"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/store/kiosk-context";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { KioskProgress } from "@/components/kiosk/KioskProgress";
import { AudioPlayer } from "@/components/kiosk/AudioPlayer";
import { CameraModal } from "@/components/kiosk/CameraModal";
import { FileUploadZone } from "@/components/kiosk/FileUploadZone";
import { OCRReviewPanel } from "@/components/kiosk/OCRReviewPanel";
import { Button } from "@/components/ui/button";
import { DEMO_DOCUMENTS } from "@/data/demo/patients";
import {
  Camera,
  Upload,
  FileText,
  CheckCircle2,
  Trash2,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import { MedicalDocument } from "@/types";
import { processDocument } from "@/lib/ocr/engine";
import { OCRTextResult, OCRProgress } from "@/lib/ocr/types";
import { generateId } from "@/lib/utils";

// ---------------------------------------------------------------
// OCR State Machine type
// ---------------------------------------------------------------
type DocState =
  | "idle"
  | "camera_open"
  | "processing"
  | "ocr_complete"
  | "error";

export default function DocumentUploadPage() {
  const router = useRouter();
  const { session, uploadDocument } = useKiosk();

  // ---------------------------------------------------------------
  // Uploaded docs list (pre-seeded only if session already has docs)
  // ---------------------------------------------------------------
  const [uploadedList, setUploadedList] = useState<MedicalDocument[]>(
    session.documents && session.documents.length > 0 ? session.documents : []
  );

  // ---------------------------------------------------------------
  // OCR workflow state
  // ---------------------------------------------------------------
  const [docState, setDocState] = useState<DocState>("idle");
  const [ocrProgress, setOcrProgress] = useState<OCRProgress | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRTextResult | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  // AI chat drawer state
  const [chatPreload, setChatPreload] = useState<string | null>(null);

  // ---------------------------------------------------------------
  // Run OCR on a blob / file
  // ---------------------------------------------------------------
  const runOCR = async (fileOrBlob: File | Blob, fileName: string) => {
    setDocState("processing");
    setOcrError(null);
    setOcrResult(null);

    try {
      const result = await processDocument(fileOrBlob, fileName, (progress) => {
        setOcrProgress(progress);
      });

      // Add an entry to the uploaded list
      const newDoc: MedicalDocument = {
        id: `doc-${generateId()}`,
        patientId: session.patient?.id || "kiosk-patient",
        encounterId: session.sessionId,
        storagePath: `kiosk-capture/${fileName}`,
        documentType: "other",
        documentDate: new Date().toISOString().split("T")[0],
        ocrStatus: "completed",
        extractionStatus: "completed",
        createdAt: new Date().toISOString(),
      };

      setUploadedList((prev) => [...prev, newDoc]);
      uploadDocument(newDoc);

      setOcrResult(result);
      setDocState("ocr_complete");
    } catch (err: any) {
      setOcrError(
        err?.message ||
          "OCR processing failed. Please try again or upload a clearer image."
      );
      setDocState("error");
    }
  };

  // ---------------------------------------------------------------
  // Camera capture handler
  // ---------------------------------------------------------------
  const handleCameraCapture = async (blob: Blob, _previewUrl: string) => {
    setShowCamera(false);
    await runOCR(blob, `camera-capture-${Date.now()}.jpg`);
  };

  // ---------------------------------------------------------------
  // File upload handler
  // ---------------------------------------------------------------
  const handleFileSelected = async (file: File) => {
    await runOCR(file, file.name);
  };

  // ---------------------------------------------------------------
  // Demo sample docs (clearly labelled — separate from real flow)
  // ---------------------------------------------------------------
  const handleAddSampleDoc = (doc: MedicalDocument) => {
    if (!uploadedList.some((d) => d.id === doc.id)) {
      const updated = [...uploadedList, doc];
      setUploadedList(updated);
      uploadDocument(doc);
    }
  };

  const handleRemoveDoc = (id: string) => {
    setUploadedList((prev) => prev.filter((d) => d.id !== id));
  };

  // ---------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------
  const handleContinue = () => {
    if (uploadedList.length > 0) {
      router.push("/kiosk/document-processing");
    } else {
      router.push("/kiosk/review");
    }
  };

  const handleSkip = () => {
    router.push("/kiosk/review");
  };

  // ---------------------------------------------------------------
  // Send OCR text to AI chatbot
  // ---------------------------------------------------------------
  const handleSendToAI = (text: string) => {
    const prompt = `Please help me understand this medical document I scanned:\n\n${text}`;
    // Store prompt for the floating chatbot and open it
    // We dispatch a custom event so ChatFloatingWidget can pick it up
    window.dispatchEvent(
      new CustomEvent("medikiosk:open-chat", { detail: { prompt } })
    );
  };

  // ---------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
      <div>
        <KioskHeader
          title="Medical Records"
          subtitle="Step 7: Upload prescriptions & lab reports"
        />
        <KioskProgress currentStep={7} />
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-6">
          <div className="mb-3 flex justify-center">
            <AudioPlayer
              text="Do you have any previous prescriptions, discharge summaries, or blood reports with you? You can scan them with the camera or upload files."
              autoPlay
            />
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A] font-heading mb-2">
            Previous Medical Records
          </h1>
          <p className="text-base text-[#64748B]">
            क्या आपके पास कोई पुरानी पर्ची, डिस्चार्ज समरी या खून की रिपोर्ट है?
          </p>
        </div>

        {/* ---- OCR Processing Progress ---- */}
        {docState === "processing" && ocrProgress && (
          <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="w-5 h-5 text-[#059669] animate-spin" />
              <span className="text-sm font-bold text-[#0F172A]">
                {ocrProgress.message}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#E2E8F0] rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-[#059669] rounded-full transition-all duration-300"
                style={{ width: `${ocrProgress.percent}%` }}
              />
            </div>

            {ocrProgress.totalPages && ocrProgress.totalPages > 1 && (
              <p className="text-xs text-[#64748B] mt-2">
                Page {ocrProgress.currentPage} of {ocrProgress.totalPages}
              </p>
            )}

            <p className="text-[11px] text-[#94A3B8] mt-2">
              Processing with Tesseract.js — text never leaves your device.
            </p>
          </div>
        )}

        {/* ---- OCR Error ---- */}
        {docState === "error" && ocrError && (
          <div
            role="alert"
            className="w-full flex items-start gap-3 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl mb-6"
          >
            <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-[#991B1B]">OCR Processing Failed</p>
              <p className="text-xs text-[#B91C1C] mt-0.5 leading-relaxed">{ocrError}</p>
            </div>
            <button
              type="button"
              onClick={() => { setDocState("idle"); setOcrError(null); }}
              className="text-[#DC2626] hover:text-[#991B1B]"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ---- OCR Result Review Panel ---- */}
        {docState === "ocr_complete" && ocrResult && (
          <div className="w-full mb-6">
            <OCRReviewPanel
              result={ocrResult}
              onDismiss={() => { setDocState("idle"); setOcrResult(null); }}
              onSendToAI={handleSendToAI}
            />
          </div>
        )}

        {/* ---- Upload Action Cards (only when not processing/reviewing) ---- */}
        {(docState === "idle" || docState === "error") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
            {/* Camera Scan */}
            <button
              type="button"
              onClick={() => setShowCamera(true)}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border-2 border-[#E2E8F0] shadow-sm hover:border-[#059669] hover:bg-[#ECFDF5] hover:shadow-md transition-all touch-target cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] font-heading mb-1">
                Scan with Camera
              </h3>
              <p className="text-xs text-[#64748B] text-center">
                Photograph a prescription or lab report
              </p>
            </button>

            {/* File Upload */}
            <div className="rounded-2xl bg-white border-2 border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="h-full">
                <FileUploadZone onFileSelected={handleFileSelected} />
              </div>
            </div>
          </div>
        )}

        {/* ---- Evaluation Sample Documents (clearly labelled, separate from real flow) ---- */}
        <div className="w-full bg-[#F5F3FF] rounded-2xl border border-[#DDD6FE] p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#7C3AED]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5B21B6]">
              Evaluation Sample Documents (Synthetic — Click to Attach)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DEMO_DOCUMENTS.map((doc) => {
              const isAttached = uploadedList.some((d) => d.id === doc.id);
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() =>
                    isAttached ? handleRemoveDoc(doc.id) : handleAddSampleDoc(doc)
                  }
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isAttached
                      ? "bg-white border-[#059669] shadow-xs ring-1 ring-[#059669]"
                      : "bg-white/80 border-[#DDD6FE] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#7C3AED]" />
                    <div>
                      <div className="text-xs font-bold text-[#0F172A] capitalize">
                        {doc.documentType.replace("_", " ")}
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        {doc.documentDate}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#059669]">
                    {isAttached ? "Attached ✓" : "+ Add"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- Uploaded Documents Preview List ---- */}
        {uploadedList.length > 0 && (
          <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm mb-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
              Attached Medical Records ({uploadedList.length})
            </h4>

            <div className="space-y-2.5">
              {uploadedList.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0F172A] capitalize">
                        {doc.documentType.replace("_", " ")}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {doc.storagePath.startsWith("kiosk-capture")
                          ? "📷 Captured / Uploaded — OCR complete"
                          : `Date: ${doc.documentDate || "Recent"} • Sample document`}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="p-2 text-[#94A3B8] hover:text-[#EF4444] transition-colors"
                    title="Remove document"
                    aria-label="Remove document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- Bottom Navigation ---- */}
        <div className="flex items-center justify-between w-full max-w-xl gap-4">
          <Button variant="ghost" className="text-[#64748B]" onClick={handleSkip}>
            I don't have records (Skip)
          </Button>

          <Button
            variant="kiosk"
            className="flex-1 bg-[#0F172A] hover:bg-[#1E293B]"
            onClick={handleContinue}
            disabled={docState === "processing"}
          >
            <span>Process &amp; Review</span>
            <ArrowRight className="w-5 h-5 ml-2 text-[#34D399]" />
          </Button>
        </div>
      </main>

      {/* ---- Real Camera Modal ---- */}
      {showCamera && (
        <CameraModal
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}
