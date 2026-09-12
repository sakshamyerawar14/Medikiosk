// ============================================================
// MediKiosk — OCR Engine Types
// ============================================================

export type OCRStatus =
  | "idle"
  | "camera_permission"
  | "camera_active"
  | "image_captured"
  | "file_selected"
  | "processing"
  | "ocr_complete"
  | "review"
  | "error";

export interface OCRProgress {
  status: OCRStatus;
  message: string;
  /** 0–100 */
  percent: number;
  currentPage?: number;
  totalPages?: number;
}

export interface OCRTextResult {
  /** Raw text extracted from the document */
  text: string;
  /** 0–1 confidence score (Tesseract) or 1.0 for embedded PDF text */
  confidence: number;
  /** How the text was obtained */
  method: "embedded_text" | "tesseract_ocr";
  pageCount: number;
  processingTimeMs: number;
  fileName: string;
}

export type SupportedMimeType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "application/pdf";

export const SUPPORTED_MIME_TYPES: SupportedMimeType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export const SUPPORTED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_PDF_PAGES = 10;
