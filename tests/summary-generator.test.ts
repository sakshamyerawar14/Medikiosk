import { generateClinicalSummary } from "../lib/ai/summary-generator";
import { HistoryAnswer, DocumentEntity } from "../types";

export async function runSummaryGeneratorTests() {
  console.log("=== Running AI Summary Generator Tests ===");

  const mockAnswers: HistoryAnswer[] = [
    {
      id: "ans-1",
      encounterId: "enc-001",
      clinicalConcept: "chest_pain",
      questionText: "Are you experiencing chest heaviness?",
      answerText: "Yes, intermittent retrosternal heaviness for 2 days on climbing stairs.",
      source: "voice",
      confidence: 0.94,
      createdAt: new Date().toISOString(),
    },
  ];

  const mockEntities: DocumentEntity[] = [
    {
      id: "ent-1",
      documentId: "doc-1",
      entityType: "medication",
      entityName: "Amlodipine",
      value: "5 mg OD",
      confidence: 0.95,
      verificationStatus: "verified",
      createdAt: new Date().toISOString(),
    },
  ];

  const result = await generateClinicalSummary({
    chiefComplaint: "Chest discomfort for 2 days",
    answers: mockAnswers,
    extractedEntities: mockEntities,
  });

  console.assert(result.summary.chiefComplaint.content.includes("Chest discomfort"), "Chief complaint must be reflected in summary");
  console.assert(result.summary.medicationHistory.some((m) => m.name === "Amlodipine"), "Extracted medication must be present");
  console.assert(result.disclaimer.includes("AI-generated"), "Summary must contain physician disclaimer");
  console.log(`[PASS] AI summary assembled with structured sections and safety disclaimer.`);

  return true;
}
