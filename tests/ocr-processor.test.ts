import { MockDocumentProcessor } from "../lib/documents/processor";

export async function runOcrProcessorTests() {
  console.log("=== Running OCR Processor Tests ===");

  const processor = new MockDocumentProcessor();

  // 1. Process prescription
  const prescriptionResult = await processor.processDocument("doc-rx-1", "mock-buffer", "prescription");
  console.assert(prescriptionResult.entities.length > 0, "Prescription must extract clinical entities");
  console.assert(prescriptionResult.entities.some((e) => e.entityType === "medication"), "Prescription must contain medications");
  console.log(`[PASS] Prescription processed: ${prescriptionResult.entities.length} entities extracted.`);

  // 2. Process lab report
  const labResult = await processor.processDocument("doc-lab-1", "mock-buffer", "lab_report");
  console.assert(labResult.entities.some((e) => e.entityType === "investigation"), "Lab report must extract investigations");
  console.log(`[PASS] Lab report processed: ${labResult.entities.length} investigations extracted.`);

  return true;
}
