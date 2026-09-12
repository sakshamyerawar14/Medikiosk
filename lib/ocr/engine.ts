// ============================================================
// MediKiosk — Browser OCR Engine
// Real Tesseract.js + pdfjs-dist (NO mock/demo fallback)
// ============================================================

import {
  OCRTextResult,
  OCRProgress,
  SUPPORTED_MIME_TYPES,
  SUPPORTED_EXTENSIONS,
  MAX_FILE_SIZE_BYTES,
  MAX_PDF_PAGES,
  SupportedMimeType,
} from "./types";

type ProgressCallback = (progress: OCRProgress) => void;

// -------------------------------------------------------------------
// File Validation
// -------------------------------------------------------------------

export function validateFile(file: File): { valid: true } | { valid: false; error: string } {
  // Size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File is too large. Maximum allowed size is 10 MB (this file is ${(file.size / 1024 / 1024).toFixed(1)} MB).` };
  }

  // Empty file check
  if (file.size === 0) {
    return { valid: false, error: "The selected file appears to be empty. Please choose a valid document." };
  }

  // MIME type check
  const mimeOk = (SUPPORTED_MIME_TYPES as string[]).includes(file.type);

  // Extension check (secondary guard)
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  const extOk = SUPPORTED_EXTENSIONS.includes(ext);

  if (!mimeOk && !extOk) {
    return {
      valid: false,
      error: `Unsupported file type "${file.type || ext}". Please upload a PDF, JPG, PNG, or WEBP image.`,
    };
  }

  return { valid: true };
}

// -------------------------------------------------------------------
// Tesseract.js Image OCR
// -------------------------------------------------------------------

async function runTesseractOnBlob(
  blob: Blob,
  onProgress: ProgressCallback,
  pageLabel: string,
): Promise<{ text: string; confidence: number }> {
  // Dynamically import to avoid SSR issues (Tesseract uses browser APIs)
  const { createWorker } = await import("tesseract.js");

  onProgress({
    status: "processing",
    message: `Running OCR on ${pageLabel}...`,
    percent: 20,
  });

  const worker = await createWorker("eng", 1, {
    logger: (m: any) => {
      if (m.status === "recognizing text") {
        onProgress({
          status: "processing",
          message: `Recognizing text on ${pageLabel}...`,
          percent: Math.round(20 + m.progress * 60),
        });
      }
    },
  });

  try {
    const { data } = await worker.recognize(blob);
    return {
      text: data.text.trim(),
      confidence: data.confidence / 100,
    };
  } finally {
    await worker.terminate();
  }
}

// -------------------------------------------------------------------
// Process a single image blob (camera capture or uploaded image)
// -------------------------------------------------------------------

export async function processImageBlob(
  blob: Blob,
  fileName: string,
  onProgress: ProgressCallback,
): Promise<OCRTextResult> {
  const startMs = Date.now();

  onProgress({ status: "processing", message: "Preparing image for OCR...", percent: 5 });

  const { text, confidence } = await runTesseractOnBlob(blob, onProgress, "image");

  if (!text) {
    throw new Error("No readable text was found in this image. Please ensure the document is in focus and well-lit.");
  }

  onProgress({ status: "ocr_complete", message: "Text extraction complete.", percent: 100 });

  return {
    text,
    confidence,
    method: "tesseract_ocr",
    pageCount: 1,
    processingTimeMs: Date.now() - startMs,
    fileName,
  };
}

// -------------------------------------------------------------------
// Process a PDF file
// -------------------------------------------------------------------

export async function processPDFFile(
  file: File,
  onProgress: ProgressCallback,
): Promise<OCRTextResult> {
  const startMs = Date.now();

  onProgress({ status: "processing", message: "Loading PDF document...", percent: 5 });

  // Dynamic import to keep bundle size small and avoid SSR issues
  const pdfjsLib = await import("pdfjs-dist");

  // Point to the bundled worker. Next.js copies this to _next/static
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url,
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const totalPages = Math.min(pdf.numPages, MAX_PDF_PAGES);

  onProgress({
    status: "processing",
    message: `PDF loaded — ${totalPages} page${totalPages > 1 ? "s" : ""} to process.`,
    percent: 10,
    currentPage: 0,
    totalPages,
  });

  // --- Step 1: Try extracting embedded selectable text first ---
  let allEmbeddedText = "";

  for (let p = 1; p <= totalPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ")
      .trim();
    allEmbeddedText += pageText + "\n";
  }

  const embeddedTextCleaned = allEmbeddedText.replace(/\s+/g, " ").trim();

  // If we found substantial embedded text, return it directly (no OCR needed)
  if (embeddedTextCleaned.length > 80) {
    onProgress({ status: "ocr_complete", message: "Embedded text extracted successfully.", percent: 100 });
    return {
      text: embeddedTextCleaned,
      confidence: 1.0,
      method: "embedded_text",
      pageCount: totalPages,
      processingTimeMs: Date.now() - startMs,
      fileName: file.name,
    };
  }

  // --- Step 2: Scanned PDF — render pages to canvas and run Tesseract ---
  onProgress({
    status: "processing",
    message: "Scanned PDF detected. Starting image-based OCR...",
    percent: 12,
  });

  const allPageTexts: string[] = [];
  let totalConfidence = 0;

  for (let p = 1; p <= totalPages; p++) {
    const progressStart = 12 + ((p - 1) / totalPages) * 80;
    const progressEnd = 12 + (p / totalPages) * 80;

    onProgress({
      status: "processing",
      message: `Processing page ${p} of ${totalPages}...`,
      percent: Math.round(progressStart),
      currentPage: p,
      totalPages,
    });

    const page = await pdf.getPage(p);
    const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for better OCR accuracy

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;

    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

    // Convert canvas to blob for Tesseract
    const imageBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))), "image/png");
    });

    const { text, confidence } = await runTesseractOnBlob(
      imageBlob,
      (p) => onProgress({ ...p, percent: Math.round(progressStart + (p.percent / 100) * (progressEnd - progressStart)) }),
      `page ${p}`,
    );

    allPageTexts.push(text);
    totalConfidence += confidence;

    // Clean up
    canvas.width = 0;
    canvas.height = 0;
  }

  const finalText = allPageTexts.filter(Boolean).join("\n\n---\n\n");

  if (!finalText.trim()) {
    throw new Error("No readable text could be extracted from this PDF. The document may be too low quality or contain only images without text.");
  }

  onProgress({ status: "ocr_complete", message: "OCR extraction complete.", percent: 100 });

  return {
    text: finalText,
    confidence: totalConfidence / totalPages,
    method: "tesseract_ocr",
    pageCount: totalPages,
    processingTimeMs: Date.now() - startMs,
    fileName: file.name,
  };
}

// -------------------------------------------------------------------
// Unified entry point
// -------------------------------------------------------------------

export async function processDocument(
  fileOrBlob: File | Blob,
  fileName: string,
  onProgress: ProgressCallback,
): Promise<OCRTextResult> {
  const isFile = fileOrBlob instanceof File;
  const mimeType = fileOrBlob.type as SupportedMimeType;

  if (mimeType === "application/pdf" && isFile) {
    return processPDFFile(fileOrBlob as File, onProgress);
  }

  return processImageBlob(fileOrBlob, fileName, onProgress);
}
