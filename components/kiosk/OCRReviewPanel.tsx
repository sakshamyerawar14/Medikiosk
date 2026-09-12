"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Copy,
  Edit3,
  Sparkles,
  AlertTriangle,
  FileSearch,
  X,
  Bot,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OCRTextResult } from "@/lib/ocr/types";

interface OCRReviewPanelProps {
  result: OCRTextResult;
  onDismiss: () => void;
  /** Called when user clicks "Analyze with Medical AI" */
  onSendToAI?: (text: string) => void;
}

export function OCRReviewPanel({ result, onDismiss, onSendToAI }: OCRReviewPanelProps) {
  const [editedText, setEditedText] = useState(result.text);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sendingToAI, setSendingToAI] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently ignore
    }
  };

  const handleSendToAI = async () => {
    if (!onSendToAI || !editedText.trim()) return;
    setSendingToAI(true);
    await new Promise((r) => setTimeout(r, 300));
    onSendToAI(editedText);
    setSendingToAI(false);
  };

  const confidencePct = Math.round(result.confidence * 100);
  const confidenceColor =
    result.confidence >= 0.85
      ? "text-[#059669]"
      : result.confidence >= 0.65
      ? "text-[#D97706]"
      : "text-[#DC2626]";

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] flex items-center justify-center">
            <FileSearch className="w-4 h-4 text-[#059669]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#0F172A]">Document Processed</span>
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            </div>
            <p className="text-[11px] text-[#64748B]">
              {result.fileName} &bull;{" "}
              {result.pageCount > 1 ? `${result.pageCount} pages` : "1 page"} &bull;{" "}
              {result.method === "embedded_text" ? "Embedded text" : "OCR"} &bull;{" "}
              <span className={confidenceColor}>{confidencePct}% confidence</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
          aria-label="Close OCR result"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Safety Disclaimer */}
      <div className="flex items-start gap-2.5 mx-4 mt-3 p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl">
        <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#92400E] leading-relaxed">
          <strong>OCR may contain errors.</strong> Please carefully review the extracted text before relying on it. Handwritten or low-quality documents may not extract accurately.
        </p>
      </div>

      {/* Extracted Text Area */}
      <div className="px-4 mt-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
            Extracted Text
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0284C7] hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing ? "Done Editing" : "Edit Text"}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#64748B] hover:text-[#0F172A]"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full min-h-48 max-h-72 p-3.5 text-xs font-mono text-[#0F172A] bg-[#F8FAFC] focus:outline-none resize-y"
              aria-label="Extracted OCR text (editable)"
              autoFocus
            />
          ) : (
            <pre className="w-full min-h-32 max-h-72 p-3.5 text-xs font-mono text-[#0F172A] bg-[#F8FAFC] overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {editedText || (
                <span className="text-[#94A3B8] italic">No text extracted from document.</span>
              )}
            </pre>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pt-3 pb-4 flex flex-col sm:flex-row gap-2.5 mt-1">
        {onSendToAI && editedText.trim() && (
          <Button
            className="flex-1 bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm h-11"
            onClick={handleSendToAI}
            disabled={sendingToAI}
          >
            {sendingToAI ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Opening AI Assistant…</>
            ) : (
              <>
                <Bot className="w-4 h-4 mr-2 text-[#34D399]" />
                Analyze with Medical AI
                <Sparkles className="w-3.5 h-3.5 ml-1.5 text-[#34D399]" />
              </>
            )}
          </Button>
        )}

        <Button
          variant="secondary"
          className="sm:flex-none h-11 text-sm"
          onClick={onDismiss}
        >
          Done
        </Button>
      </div>

      {/* Bottom note */}
      <div className="px-4 pb-3 text-[10px] text-[#94A3B8] leading-relaxed border-t border-[#E2E8F0] pt-2.5">
        This is OCR-extracted text only. It has not been interpreted, verified, or modified by the AI. The "Analyze with Medical AI" action uses the Gemini Medical Assistant for educational explanations only.
      </div>
    </div>
  );
}
