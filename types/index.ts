// ============================================================
// MediKiosk — Core TypeScript Types
// ============================================================

// ---- Enums / Constants ----

export type Language = "en" | "hi" | "mr" | "ta" | "te" | "bn";
export type Role = "patient" | "doctor" | "admin" | "staff";
export type Gender = "male" | "female" | "other" | "prefer_not_to_say";
export type InputSource = "voice" | "touch" | "text" | "document" | "doctor";
export type ConfidenceLevel = "high" | "medium" | "low" | "unverified";
export type VerificationStatus = "verified" | "needs_review" | "rejected" | "pending";
export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type AlertStatus = "active" | "resolved" | "dismissed";
export type KioskStatus = "active" | "idle" | "offline" | "maintenance";
export type DocumentType =
  | "prescription"
  | "lab_report"
  | "discharge_summary"
  | "imaging_report"
  | "other";

export type EncounterStatus =
  | "started"
  | "interviewing"
  | "documents_processing"
  | "ready_for_review"
  | "doctor_review"
  | "verified"
  | "cancelled";

export type Department =
  | "general_medicine"
  | "pediatrics"
  | "orthopedics"
  | "cardiology"
  | "dermatology"
  | "neurology"
  | "ayush"
  | "other";

// ---- Patient ----

export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth?: string;
  age?: number;
  gender?: Gender;
  phone?: string;
  abhaReference?: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Encounter ----

export interface Encounter {
  id: string;
  patientId: string;
  patient?: Patient;
  departmentId?: string;
  department?: Department;
  departmentName?: string;
  language: Language;
  chiefComplaint?: string;
  status: EncounterStatus;
  token?: string;
  createdAt: string;
  completedAt?: string;
  alertCount?: number;
  documentCount?: number;
}

// ---- Interview ----

export type QuestionType = "open" | "choice" | "scale" | "date" | "boolean" | "multiselect";

export type ClinicalSection =
  | "chief_complaint"
  | "history_of_present_illness"
  | "past_medical_history"
  | "past_surgical_history"
  | "medication_history"
  | "allergy_history"
  | "family_history"
  | "personal_history"
  | "review_of_systems"
  | "previous_investigations"
  // AYUSH-specific
  | "prakriti"
  | "vikriti"
  | "ahara_vihara"
  | "dashavidha";

export interface InterviewQuestion {
  id: string;
  clinicalConcept: string;
  section: ClinicalSection;
  questionKey: string;
  language: Language;
  questionText: string;
  questionType: QuestionType;
  options?: QuestionOption[];
  followUpConditions?: FollowUpCondition[];
  active: boolean;
}

export interface QuestionOption {
  value: string;
  label: string;
  icon?: string;
}

export interface FollowUpCondition {
  ifValue: string;
  thenQuestionKey: string;
}

export interface HistoryAnswer {
  id: string;
  encounterId: string;
  questionId?: string;
  clinicalConcept: string;
  questionText: string;
  answerText: string;
  answerJson?: unknown;
  source: InputSource;
  confidence?: number;
  createdAt: string;
}

// ---- Documents ----

export interface MedicalDocument {
  id: string;
  patientId: string;
  encounterId?: string;
  storagePath: string;
  thumbnailUrl?: string;
  documentType: DocumentType;
  documentDate?: string;
  ocrStatus: "pending" | "processing" | "completed" | "failed";
  extractionStatus: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  entities?: DocumentEntity[];
}

export interface DocumentEntity {
  id: string;
  documentId: string;
  entityType:
    | "medication"
    | "diagnosis"
    | "investigation"
    | "procedure"
    | "allergy"
    | "vital"
    | "date"
    | "provider"
    | "facility";
  entityName: string;
  value?: string;
  unit?: string;
  referenceRange?: string;
  confidence: number;
  verificationStatus: VerificationStatus;
  createdAt: string;
}

// ---- Clinical Summary ----

export interface ClinicalSummary {
  id: string;
  encounterId: string;
  version: number;
  summaryJson: StructuredSummary;
  generatedBy: "ai" | "doctor" | "system";
  doctorVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StructuredSummary {
  chiefComplaint: SummaryField;
  historyOfPresentIllness: SummaryField;
  pastMedicalHistory: SummaryField;
  pastSurgicalHistory: SummaryField;
  medicationHistory: MedicationSummaryField[];
  allergyHistory: AllergyField[];
  familyHistory: SummaryField;
  personalHistory: SummaryField;
  reviewOfSystems: SummaryField;
  previousInvestigations: InvestigationField[];
  documentTimeline: TimelineEvent[];
  unresolvedItems: string[];
  safetyFlags: SafetyFlag[];
}

export interface SummaryField {
  content: string;
  source: InputSource;
  confidence: ConfidenceLevel;
  aiGenerated: boolean;
  doctorVerified: boolean;
}

export interface MedicationSummaryField {
  name: string;
  dose?: string;
  frequency?: string;
  duration?: string;
  source: InputSource;
  confidence: number;
  verificationStatus: VerificationStatus;
  documentId?: string;
}

export interface AllergyField {
  allergen: string;
  reaction?: string;
  severity?: string;
  source: InputSource;
  confidence: number;
  verificationStatus: VerificationStatus;
}

export interface InvestigationField {
  name: string;
  value?: string;
  unit?: string;
  referenceRange?: string;
  date?: string;
  source: InputSource;
  documentId?: string;
  confidence: number;
  verificationStatus: VerificationStatus;
}

export interface TimelineEvent {
  id: string;
  date?: string;
  year?: number;
  eventType: "encounter" | "document" | "procedure" | "diagnosis" | "medication";
  title: string;
  description?: string;
  source?: InputSource;
  documentId?: string;
  confidence: ConfidenceLevel;
}

// ---- Safety ----

export interface SafetyFlag {
  id: string;
  alertType: string;
  severity: AlertSeverity;
  message: string;
  source: InputSource;
  status: AlertStatus;
  createdAt: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

// ---- Consent ----

export interface Consent {
  id: string;
  patientId: string;
  encounterId?: string;
  consentType: "intake" | "data_sharing" | "ai_processing";
  granted: boolean;
  language: Language;
  timestamp: string;
}

// ---- Audit ----

export interface AuditLog {
  id: string;
  actorId?: string;
  actorName?: string;
  actorRole?: Role;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ---- Admin ----

export interface KioskDevice {
  id: string;
  kioskId: string;
  location: string;
  status: KioskStatus;
  lastSeen: string;
  currentEncounterId?: string;
  ipAddress?: string;
}

export interface DepartmentConfig {
  id: string;
  name: string;
  code: Department;
  type: "allopathy" | "ayush" | "emergency" | "diagnostic";
  active: boolean;
  icon?: string;
  questionTemplate?: string;
  createdAt: string;
}

export interface InterviewTemplate {
  id: string;
  name: string;
  department: Department;
  language: Language;
  questionCount: number;
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  departmentId?: string;
  departmentName?: string;
  active: boolean;
  createdAt: string;
}

// ---- Kiosk Session ----

export interface KioskSession {
  sessionId: string;
  encounterId?: string;
  patientId?: string;
  language: Language;
  consent?: boolean;
  department?: Department;
  departmentName?: string;
  chiefComplaint?: string;
  interviewAnswers: HistoryAnswer[];
  currentSection?: ClinicalSection;
  currentQuestionIndex: number;
  completedSections: ClinicalSection[];
  documents: MedicalDocument[];
  safetyFlags: SafetyFlag[];
  submissionStatus?: "pending" | "submitted" | "error";
  token?: string;
  startedAt: string;
  lastActivityAt: string;
  isDemo: boolean;
  patient?: Partial<Patient>;
}

// ---- Analytics ----

export interface DashboardMetrics {
  totalPatients: number;
  intakesToday: number;
  pendingReview: number;
  urgentAlerts: number;
  completedIntakes: number;
  avgIntakeDuration: number; // minutes
  documentsProcessed: number;
  languageDistribution: { language: Language; count: number }[];
  departmentDistribution: { department: string; count: number }[];
  intakesByHour: { hour: number; count: number }[];
}

export interface AdminMetrics {
  totalKiosks: number;
  activeKiosks: number;
  totalPatients: number;
  totalDoctors: number;
  totalIntakes: number;
  completedIntakes: number;
  pendingReviews: number;
  urgentFlags: number;
  intakesOverTime: { date: string; count: number }[];
  departmentDistribution: { department: string; count: number; percentage: number }[];
}

// ---- API Response ----

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Convenience Type Aliases
export type ExtractedEntity = DocumentEntity;
export type MedicationItem = MedicationSummaryField;
export type InvestigationItem = InvestigationField;
export type Document = MedicalDocument;

