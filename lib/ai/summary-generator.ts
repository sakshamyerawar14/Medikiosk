import {
  StructuredSummary,
  HistoryAnswer,
  DocumentEntity,
  MedicationSummaryField,
  InvestigationField,
  AllergyField,
  TimelineEvent,
} from "@/types";
import { evaluateRedFlags } from "@/lib/clinical/red-flags";

export interface GenerateSummaryOptions {
  chiefComplaint?: string;
  answers: HistoryAnswer[];
  extractedEntities?: DocumentEntity[];
  patientName?: string;
  departmentName?: string;
}

/**
 * AI Clinical Summary Generator (Hardened)
 * Adheres strictly to the mandate: "AI assists; doctor decides."
 * Synthesizes patient-reported intake data and verified document entities into a review-ready clinical draft.
 *
 * CRITICAL CLINICAL SAFETY PRINCIPLE:
 * Never inject fabricated or simulated medications, diagnoses, or lab results.
 * When data is missing, explicitly report that no prior records were provided.
 */
export async function generateClinicalSummary(options: GenerateSummaryOptions): Promise<{
  summary: StructuredSummary;
  disclaimer: string;
}> {
  const { chiefComplaint = "General health checkup", answers = [], extractedEntities = [] } = options;

  // 1. Extract medications strictly from provided document entities or interview answers
  const docMedications = extractedEntities.filter((e) => e.entityType === "medication");
  const medicationHistory: MedicationSummaryField[] = docMedications.map((m) => ({
    name: m.entityName,
    dose: m.value || "As prescribed",
    frequency: "As directed",
    duration: "Per prescription",
    source: "document",
    confidence: m.confidence || 0.85,
    verificationStatus: m.verificationStatus || "needs_review",
    documentId: m.documentId,
  }));

  // Check if patient reported current medications in interview
  const medAnswer = answers.find(
    (a) =>
      a.clinicalConcept === "current_medications" ||
      a.clinicalConcept === "medication_history"
  );
  if (medAnswer && medAnswer.answerText && !medAnswer.answerText.toLowerCase().includes("none")) {
    medicationHistory.push({
      name: medAnswer.answerText,
      source: medAnswer.source || "touch",
      confidence: medAnswer.confidence || 0.8,
      verificationStatus: "needs_review",
    });
  }

  // 2. Extract investigations strictly from provided document entities
  const docInvestigations = extractedEntities.filter((e) => e.entityType === "investigation");
  const previousInvestigations: InvestigationField[] = docInvestigations.map((i) => ({
    name: i.entityName,
    value: i.value || "Present",
    unit: i.unit || "",
    referenceRange: i.referenceRange || "",
    date: new Date().toISOString().split("T")[0],
    source: "document",
    confidence: i.confidence || 0.85,
    verificationStatus: i.verificationStatus || "needs_review",
    documentId: i.documentId,
  }));

  // 3. Synthesize HPI from actual patient interview answers
  const hpiSentences = answers
    .filter((a) => a.answerText && a.answerText.trim() !== "")
    .map((a) => `${a.questionText}: ${a.answerText}`)
    .join(". ");

  const hpiContent = hpiSentences
    ? `Patient presents with chief complaint of ${chiefComplaint}. Patient intake report: ${hpiSentences}.`
    : `Patient presents for clinical evaluation with chief complaint of: ${chiefComplaint}.`;

  // 4. Extract past medical history from intake answers
  const pmhAnswer = answers.find(
    (a) =>
      a.clinicalConcept === "past_medical_conditions" ||
      a.clinicalConcept === "past_medical_history"
  );
  const pmhContent =
    pmhAnswer && pmhAnswer.answerText && !pmhAnswer.answerText.toLowerCase().includes("none")
      ? `Patient reported: ${pmhAnswer.answerText}.`
      : "No chronic pre-existing medical conditions reported during intake interview.";

  // 5. Extract past surgical history
  const pshAnswer = answers.find(
    (a) =>
      a.clinicalConcept === "past_surgical_history" ||
      a.clinicalConcept === "surgical_history"
  );
  const pshContent =
    pshAnswer && pshAnswer.answerText && !pshAnswer.answerText.toLowerCase().includes("none")
      ? `Patient reported: ${pshAnswer.answerText}.`
      : "No prior major surgical procedures reported during intake.";

  // 6. Extract known drug allergies
  const allergyAnswer = answers.find(
    (a) =>
      a.clinicalConcept === "known_allergies" ||
      a.clinicalConcept === "allergy_history"
  );
  const allergyHistory: AllergyField[] = [];

  if (
    allergyAnswer &&
    allergyAnswer.answerText &&
    !allergyAnswer.answerText.toLowerCase().includes("no known") &&
    !allergyAnswer.answerText.toLowerCase().includes("none")
  ) {
    allergyHistory.push({
      allergen: allergyAnswer.answerText,
      reaction: "Reported during intake",
      severity: "Requires verification",
      source: allergyAnswer.source || "touch",
      confidence: allergyAnswer.confidence || 0.85,
      verificationStatus: "needs_review",
    });
  }

  // Also include any allergies extracted from documents
  const docAllergies = extractedEntities.filter((e) => e.entityType === "allergy");
  for (const da of docAllergies) {
    allergyHistory.push({
      allergen: da.entityName,
      reaction: da.value || "Documented adverse reaction",
      severity: "Unknown",
      source: "document",
      confidence: da.confidence || 0.85,
      verificationStatus: da.verificationStatus || "needs_review",
    });
  }

  // 7. Extract family history
  const famAnswer = answers.find((a) => a.clinicalConcept === "family_history");
  const familyContent =
    famAnswer && famAnswer.answerText && !famAnswer.answerText.toLowerCase().includes("none")
      ? `Patient reported: ${famAnswer.answerText}.`
      : "No significant hereditary or familial diseases reported during intake.";

  // 8. Extract personal / lifestyle history
  const personalAnswer = answers.find(
    (a) => a.clinicalConcept === "personal_history" || a.clinicalConcept === "lifestyle"
  );
  const personalContent =
    personalAnswer && personalAnswer.answerText
      ? `Patient reported: ${personalAnswer.answerText}.`
      : "Lifestyle and personal habits: Not reported during intake interview.";

  // 9. Evaluate safety flags / red flags using clinical engine
  const safetyFlags = evaluateRedFlags(answers, chiefComplaint);

  // 10. Generate longitudinal timeline events based strictly on provided data
  const timeline: TimelineEvent[] = [
    {
      id: "tl-current",
      date: new Date().toISOString().split("T")[0],
      eventType: "encounter",
      title: `Intake Session: ${chiefComplaint}`,
      description: `Outpatient department intake completed. Summary generated for clinical review.`,
      source: "touch",
      confidence: "high",
    },
  ];

  if (docMedications.length > 0 || docInvestigations.length > 0) {
    timeline.unshift({
      id: "tl-docs",
      date: new Date().toISOString().split("T")[0],
      eventType: "document",
      title: "Uploaded Clinical Records",
      description: `${docMedications.length} medication(s) and ${docInvestigations.length} investigation(s) extracted for physician verification.`,
      source: "document",
      confidence: "medium",
    });
  }

  const disclaimer =
    "AI-generated clinical draft for decision support only. Must be reviewed, edited, and verified by a licensed physician before clinical decisions or orders are enacted.";

  const summary: StructuredSummary = {
    chiefComplaint: {
      content: chiefComplaint,
      source: "touch",
      confidence: "high",
      aiGenerated: false,
      doctorVerified: false,
    },
    historyOfPresentIllness: {
      content: hpiContent,
      source: "voice",
      confidence: "medium",
      aiGenerated: true,
      doctorVerified: false,
    },
    pastMedicalHistory: {
      content: pmhContent,
      source: pmhAnswer ? "touch" : "doctor",
      confidence: pmhAnswer ? "high" : "low",
      aiGenerated: true,
      doctorVerified: false,
    },
    pastSurgicalHistory: {
      content: pshContent,
      source: "touch",
      confidence: "medium",
      aiGenerated: true,
      doctorVerified: false,
    },
    medicationHistory,
    allergyHistory,
    familyHistory: {
      content: familyContent,
      source: "touch",
      confidence: "medium",
      aiGenerated: true,
      doctorVerified: false,
    },
    personalHistory: {
      content: personalContent,
      source: "touch",
      confidence: "medium",
      aiGenerated: true,
      doctorVerified: false,
    },
    reviewOfSystems: {
      content: `Systemic inquiry based on reported chief complaint (${chiefComplaint}). No additional acute systemic complaints recorded during intake.`,
      source: "touch",
      confidence: "medium",
      aiGenerated: true,
      doctorVerified: false,
    },
    previousInvestigations,
    documentTimeline: timeline,
    unresolvedItems:
      medicationHistory.length === 0
        ? ["Prior prescription records not submitted or not detected via OCR."]
        : [],
    safetyFlags,
  };

  return {
    summary,
    disclaimer,
  };
}
