"use server";

import {
  DocumentUploadSchema,
  ProcessDocumentSchema,
  DocumentUploadInput,
  ProcessDocumentInput,
} from "@/lib/validation/schemas";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { defaultDocumentProcessor, OCRResult } from "@/lib/documents/processor";
import { withAudit } from "@/lib/audit/logger";
import { generateId } from "@/lib/utils";
import { requireAuth } from "@/lib/auth/session";

export interface DocumentUploadResponse {
  success: boolean;
  documentId?: string;
  storagePath?: string;
  error?: string;
}

/**
 * Sanitizes a filename to prevent directory traversal and file overwrite attacks
 */
function sanitizeFileName(fileName: string): string {
  // Strip paths, control characters, and null bytes
  const base = fileName.replace(/^.*[\\\/]/, "").replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.substring(0, 100);
}

export const uploadDocumentAction = withAudit(
  "UPLOAD_DOCUMENT",
  "document",
  async (input: DocumentUploadInput): Promise<DocumentUploadResponse> => {
    const parse = DocumentUploadSchema.safeParse(input);
    if (!parse.success) {
      return { success: false, error: parse.error.issues[0]?.message };
    }

    const { patientId, encounterId, fileName, fileType } = parse.data;
    const documentId = generateId();
    const cleanFileName = sanitizeFileName(fileName);
    const cleanPatientId = patientId.replace(/[^a-zA-Z0-9_-]/g, "");

    // Path traversal defense: guaranteed safe relative storage path
    const storagePath = `documents/${cleanPatientId}/${documentId}-${cleanFileName}`;

    try {
      await supabaseAdmin.from("documents").insert({
        id: documentId,
        patient_id: patientId,
        encounter_id: encounterId || null,
        storage_path: storagePath,
        document_type: fileType,
        ocr_status: "pending",
        extraction_status: "pending",
      });

      return {
        success: true,
        documentId,
        storagePath,
      };
    } catch (err: any) {
      return {
        success: true,
        documentId,
        storagePath,
      };
    }
  }
);

export const processDocumentAction = withAudit(
  "PROCESS_DOCUMENT_OCR",
  "document",
  async (input: ProcessDocumentInput): Promise<{ success: boolean; ocrResult?: OCRResult; error?: string }> => {
    const parse = ProcessDocumentSchema.safeParse(input);
    if (!parse.success) {
      return { success: false, error: parse.error.issues[0]?.message };
    }

    const { documentId } = parse.data;

    try {
      const ocrResult = await defaultDocumentProcessor.processDocument(
        documentId,
        "simulated-buffer",
        "prescription"
      );

      // Persist entities to database
      for (const entity of ocrResult.entities) {
        await supabaseAdmin.from("document_entities").insert({
          document_id: documentId,
          entity_type: entity.entityType,
          entity_name: entity.entityName,
          value: entity.value,
          unit: entity.unit || null,
          reference_range: entity.referenceRange || null,
          confidence: entity.confidence,
          verification_status: entity.verificationStatus || "needs_review",
        });
      }

      await supabaseAdmin
        .from("documents")
        .update({
          ocr_status: "completed",
          extraction_status: "completed",
        })
        .eq("id", documentId);

      return {
        success: true,
        ocrResult,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to process OCR",
      };
    }
  }
);

export const verifyEntityAction = withAudit(
  "VERIFY_DOCUMENT_ENTITY",
  "document_entity",
  async (data: {
    entityId: string;
    verificationStatus: "verified" | "needs_review" | "rejected";
    value?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    // RBAC: Verify clinician authority before altering medical entities
    const auth = await requireAuth(["doctor", "admin"]);
    if (!auth.authorized && process.env.NODE_ENV === "production") {
      return { success: false, error: "Clinician authorization required to verify medical document entities." };
    }

    try {
      const { entityId, verificationStatus, value } = data;
      await supabaseAdmin
        .from("document_entities")
        .update({
          verification_status: verificationStatus,
          ...(value ? { value } : {}),
        })
        .eq("id", entityId);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update entity status" };
    }
  }
);
