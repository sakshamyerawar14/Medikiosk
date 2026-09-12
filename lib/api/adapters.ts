import { Patient, StructuredSummary, MedicalDocument, Encounter } from "@/types";

/**
 * Data Adapter Layer
 * Transforms raw database models from Supabase into MediCare+ UI view-models,
 * providing seamless compatibility across local demo state and live database records.
 */

export interface DbEncounterWithPatient {
  id: string;
  token?: string;
  chief_complaint?: string;
  status: string;
  created_at: string;
  completed_at?: string;
  patient: {
    id: string;
    full_name: string;
    date_of_birth?: string;
    gender?: string;
    phone?: string;
    abha_reference?: string;
  };
  clinical_summaries?: Array<{
    id: string;
    summary_json: StructuredSummary;
    doctor_verified: boolean;
  }>;
  documents?: Array<{
    id: string;
    storage_path: string;
    document_type: string;
    document_date?: string;
    ocr_status: string;
  }>;
}

export function adaptDbPatientToUi(dbData: DbEncounterWithPatient): {
  patient: Patient;
  encounter: Encounter;
  documents: MedicalDocument[];
  summary?: StructuredSummary;
} {
  const dob = dbData.patient.date_of_birth;
  const age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : 45;
  const summary = dbData.clinical_summaries?.[0]?.summary_json;

  const patient: Patient = {
    id: dbData.patient.id,
    fullName: dbData.patient.full_name,
    age,
    dateOfBirth: dob,
    gender: (dbData.patient.gender as any) || "other",
    phone: dbData.patient.phone || "+91 00000 00000",
    abhaReference: dbData.patient.abha_reference || "91-0000-0000-0000",
    createdAt: dbData.created_at,
    updatedAt: dbData.completed_at || dbData.created_at,
  };

  const encounter: Encounter = {
    id: dbData.id,
    patientId: dbData.patient.id,
    department: "general_medicine",
    language: "en",
    status: (dbData.status as any) || "ready_for_review",
    token: dbData.token || "A-001",
    chiefComplaint: dbData.chief_complaint || "Routine evaluation",
    createdAt: dbData.created_at,
    completedAt: dbData.completed_at,
  };

  const documents: MedicalDocument[] = (dbData.documents || []).map((d) => ({
    id: d.id,
    patientId: dbData.patient.id,
    encounterId: dbData.id,
    storagePath: d.storage_path,
    documentType: (d.document_type as any) || "other",
    documentDate: d.document_date || new Date().toISOString().split("T")[0],
    ocrStatus: (d.ocr_status as any) || "completed",
    extractionStatus: "completed",
    createdAt: dbData.created_at,
    entities: [],
  }));

  return {
    patient,
    encounter,
    documents,
    summary,
  };
}
