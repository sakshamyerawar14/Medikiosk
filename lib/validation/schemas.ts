import { z } from "zod";

// ============================================================
// 1. Auth Schemas
// ============================================================
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["patient", "doctor", "admin", "staff"]).optional(),
});

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  role: z.enum(["patient", "doctor", "admin", "staff"]),
  departmentId: z.string().optional().nullable(),
});

// ============================================================
// 2. Patient Intake & Consent Schemas
// ============================================================
export const PatientDemographicsSchema = z.object({
  fullName: z.string().min(2, "Name is required").max(100, "Name too long"),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  phone: z
    .string()
    .min(10, "Valid phone number required")
    .max(15, "Phone number too long")
    .regex(/^[+]?[0-9\s-]+$/, "Invalid phone number format"),
  abhaReference: z.string().max(50).optional().nullable(),
});

export const ConsentSchema = z.object({
  patientId: z.string().min(1, "Invalid patient ID"),
  encounterId: z.string().min(1, "Invalid encounter ID").optional().nullable(),
  consentType: z.string().min(1, "Consent type is required"),
  granted: z.boolean().default(true),
  language: z.string().default("en"),
});

export const CreateIntakeSessionSchema = z.object({
  patientId: z.string().optional().nullable(),
  patientDemographics: PatientDemographicsSchema.optional(),
  departmentId: z.string().optional().nullable(),
  language: z.string().default("en"),
  chiefComplaint: z.string().max(500).optional().nullable(),
});

// ============================================================
// 3. Clinical Response & Red Flag Schemas
// ============================================================
export const ClinicalResponseSchema = z.object({
  encounterId: z.string().min(1, "Invalid encounter ID"),
  questionId: z.string().optional().nullable(),
  clinicalConcept: z.string().min(1, "Clinical concept is required"),
  questionText: z.string().min(1, "Question text is required"),
  answerText: z.string().min(1, "Answer text is required"),
  answerJson: z.record(z.string(), z.any()).optional().nullable(),
  source: z.enum(["voice", "touch", "text", "document", "doctor"]).default("touch"),
  confidence: z.number().min(0).max(1).optional().default(1.0),
  isRedFlag: z.boolean().optional().default(false),
});

export const RedFlagEvaluationSchema = z.object({
  encounterId: z.string().min(1, "Invalid encounter ID"),
  departmentId: z.string().optional().nullable(),
  symptom: z.string(),
  userResponse: z.string(),
});

// ============================================================
// 4. Documents & OCR Schemas
// ============================================================
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "application/pdf",
] as const;

export const DocumentUploadSchema = z.object({
  patientId: z.string().min(1, "Invalid patient ID"),
  encounterId: z.string().optional().nullable(),
  fileName: z
    .string()
    .min(1, "File name is required")
    .max(200, "File name too long")
    .regex(/^[^\\/:\*\?"<>\|]+$/, "File name contains invalid characters or path traversal"),
  fileType: z.enum(["prescription", "lab_report", "discharge_summary", "imaging_report", "other"]),
  mimeType: z.enum(ALLOWED_MIME_TYPES, {
    message: "Unsupported file type. Only PDF, JPG, PNG, and WEBP are permitted.",
  }),
  fileSize: z.number().max(20 * 1024 * 1024, "Max file size is 20MB"),
});

export const ProcessDocumentSchema = z.object({
  documentId: z.string().min(1, "Invalid document ID"),
  simulateDelay: z.boolean().optional().default(true),
});

export const EntityVerificationSchema = z.object({
  entityId: z.string().min(1, "Invalid entity ID"),
  verificationStatus: z.enum(["verified", "needs_review", "rejected"]),
  value: z.string().optional(),
});

// ============================================================
// 5. Doctor Review & Summary Schemas
// ============================================================
export const DoctorReviewSchema = z.object({
  encounterId: z.string().min(1, "Invalid encounter ID"),
  summaryId: z.string().optional().nullable(),
  action: z.enum(["REVIEWED", "EDITED", "VERIFIED", "REJECTED"]),
  editedSummaryJson: z.record(z.string(), z.any()).optional().nullable(),
  comments: z.string().optional().nullable(),
  doctorId: z.string().min(1, "Invalid doctor ID"),
});

// ============================================================
// 6. Admin Configuration Schemas
// ============================================================
export const DepartmentSchema = z.object({
  name: z.string().min(2, "Department name required"),
  type: z.string().min(2, "Department type required"),
  active: z.boolean().default(true),
});

export const QuestionConfigSchema = z.object({
  clinicalConcept: z.string().min(1, "Clinical concept required"),
  section: z.string().min(1, "Section required"),
  questionKey: z.string().min(1, "Question key required"),
  language: z.string().default("en"),
  questionText: z.string().min(2, "Question text required"),
  questionType: z.enum(["choice", "multi_choice", "text", "voice", "scale"]).default("choice"),
  active: z.boolean().default(true),
});

export const AuditLogQuerySchema = z.object({
  actorId: z.string().optional(),
  action: z.string().optional(),
  resourceType: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type PatientDemographicsInput = z.infer<typeof PatientDemographicsSchema>;
export type ConsentInput = z.infer<typeof ConsentSchema>;
export type CreateIntakeSessionInput = z.infer<typeof CreateIntakeSessionSchema>;
export type ClinicalResponseInput = z.infer<typeof ClinicalResponseSchema>;
export type RedFlagEvaluationInput = z.infer<typeof RedFlagEvaluationSchema>;
export type DocumentUploadInput = z.infer<typeof DocumentUploadSchema>;
export type ProcessDocumentInput = z.infer<typeof ProcessDocumentSchema>;
export type DoctorReviewInput = z.infer<typeof DoctorReviewSchema>;
export type DepartmentInput = z.infer<typeof DepartmentSchema>;
export type QuestionConfigInput = z.infer<typeof QuestionConfigSchema>;
export type AuditLogQueryInput = z.infer<typeof AuditLogQuerySchema>;
