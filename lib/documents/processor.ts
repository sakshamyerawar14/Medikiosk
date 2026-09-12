import { DocumentEntity, DocumentType } from "@/types";
import { generateId } from "@/lib/utils";

export interface OCRResult {
  documentId: string;
  rawText: string;
  confidence: number;
  entities: DocumentEntity[];
  processingTimeMs: number;
}

export interface DocumentProcessor {
  processDocument(documentId: string, fileBufferOrPath: string | Buffer, docType?: DocumentType): Promise<OCRResult>;
}

/**
 * Mock Document Processor for Demo & Offline Testing
 * Simulates real-world OCR parsing and clinical entity extraction
 */
export class MockDocumentProcessor implements DocumentProcessor {
  async processDocument(
    documentId: string,
    fileBufferOrPath: string | Buffer,
    docType: DocumentType = "prescription"
  ): Promise<OCRResult> {
    // Simulate real-world OCR network/processing latency
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (docType === "lab_report") {
      return {
        documentId,
        rawText: `
          METROPOLIS HEALTHCARE LABS
          PATIENT INVESTIGATION REPORT
          Investigation: Serum Total Cholesterol
          Result: 218 mg/dL (Reference: < 200 mg/dL) [ELEVATED]
          Investigation: Serum Triglycerides
          Result: 185 mg/dL (Reference: < 150 mg/dL) [ELEVATED]
          Investigation: Fasting Blood Sugar
          Result: 104 mg/dL (Reference: 70 - 100 mg/dL) [BORDERLINE]
          Investigation: HbA1c
          Result: 5.9% (Reference: 4.0 - 5.6%) [PRE-DIABETIC RANGE]
        `.trim(),
        confidence: 0.95,
        processingTimeMs: 2000,
        entities: [
          {
            id: `ent-${generateId()}`,
            documentId,
            entityType: "investigation",
            entityName: "Serum Total Cholesterol",
            value: "218",
            unit: "mg/dL",
            referenceRange: "< 200 mg/dL",
            confidence: 0.96,
            verificationStatus: "verified",
            createdAt: new Date().toISOString(),
          },
          {
            id: `ent-${generateId()}`,
            documentId,
            entityType: "investigation",
            entityName: "Serum Triglycerides",
            value: "185",
            unit: "mg/dL",
            referenceRange: "< 150 mg/dL",
            confidence: 0.95,
            verificationStatus: "verified",
            createdAt: new Date().toISOString(),
          },
          {
            id: `ent-${generateId()}`,
            documentId,
            entityType: "investigation",
            entityName: "Fasting Blood Sugar",
            value: "104",
            unit: "mg/dL",
            referenceRange: "70 - 100 mg/dL",
            confidence: 0.92,
            verificationStatus: "needs_review",
            createdAt: new Date().toISOString(),
          },
          {
            id: `ent-${generateId()}`,
            documentId,
            entityType: "investigation",
            entityName: "HbA1c",
            value: "5.9",
            unit: "%",
            referenceRange: "4.0 - 5.6%",
            confidence: 0.94,
            verificationStatus: "verified",
            createdAt: new Date().toISOString(),
          },
        ],
      };
    }

    // Default: Prescription
    return {
      documentId,
      rawText: `
        DR. VIKRAM SETH, MD (MEDICINE), DM (CARDIOLOGY)
        REG NO: MH-49201-B
        Rx:
        1. Tab. Amlodipine 5mg - 1 tablet once daily in morning (2 years)
        2. Tab. Metoprolol Succinate 25mg - 1 tablet once daily post breakfast
        3. Tab. Atorvastatin 10mg - 1 tablet at bedtime
        Diagnosis: Primary Hypertension, Stage 1. Borderline Dyslipidemia.
        Advise: Low sodium diet, brisk walking 30 mins daily.
      `.trim(),
      confidence: 0.93,
      processingTimeMs: 2000,
      entities: [
        {
          id: `ent-${generateId()}`,
          documentId,
          entityType: "medication",
          entityName: "Amlodipine",
          value: "5 mg Once daily (Morning)",
          unit: "mg",
          confidence: 0.94,
          verificationStatus: "verified",
          createdAt: new Date().toISOString(),
        },
        {
          id: `ent-${generateId()}`,
          documentId,
          entityType: "medication",
          entityName: "Metoprolol Succinate",
          value: "25 mg Once daily",
          unit: "mg",
          confidence: 0.91,
          verificationStatus: "needs_review",
          createdAt: new Date().toISOString(),
        },
        {
          id: `ent-${generateId()}`,
          documentId,
          entityType: "medication",
          entityName: "Atorvastatin",
          value: "10 mg At bedtime",
          unit: "mg",
          confidence: 0.93,
          verificationStatus: "verified",
          createdAt: new Date().toISOString(),
        },
        {
          id: `ent-${generateId()}`,
          documentId,
          entityType: "diagnosis",
          entityName: "Primary Hypertension",
          value: "Stage 1 (Diagnosed 2024)",
          confidence: 0.92,
          verificationStatus: "verified",
          createdAt: new Date().toISOString(),
        },
        {
          id: `ent-${generateId()}`,
          documentId,
          entityType: "diagnosis",
          entityName: "Borderline Dyslipidemia",
          value: "Managed with diet and statin",
          confidence: 0.88,
          verificationStatus: "needs_review",
          createdAt: new Date().toISOString(),
        },
      ],
    };
  }
}

export const defaultDocumentProcessor = new MockDocumentProcessor();
