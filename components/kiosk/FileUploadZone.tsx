"use client";

import React, { useRef, useState, useCallback } from "react";
import {
  Upload,
  FileText,
  ImageIcon,
  X,
  AlertCircle,
  File,
} from "lucide-react";
import {
  SUPPORTED_EXTENSIONS,
  MAX_FILE_SIZE_BYTES,
  SUPPORTED_MIME_TYPES,
} from "@/lib/ocr/types";
import { validateFile } from "@/lib/ocr/engine";

interface FileUploadZoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function FileUploadZone({ onFileSelected, disabled = false }: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File | null | undefined) => {
      if (!file) return;
      setValidationError(null);

      const validation = validateFile(file);
      if (!validation.valid) {
        setValidationError(validation.error);
        return;
      }

      onFileSelected(file);
    },
    [onFileSelected]
  );

  // Click to browse
  const handleBrowseClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    // Reset so same file can be re-selected
    e.target.value = "";
  };

  // Drag-and-drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload medical document — PDF, JPG, PNG or WEBP"
        onClick={handleBrowseClick}
        onKeyDown={(e) => e.key === "Enter" && handleBrowseClick()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-3 px-6 py-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none
          ${disabled ? "opacity-50 cursor-not-allowed border-[#CBD5E1] bg-[#F8FAFC]" : ""}
          ${!disabled && isDragging ? "border-[#059669] bg-[#ECFDF5] scale-[1.01]" : ""}
          ${!disabled && !isDragging ? "border-[#CBD5E1] bg-white hover:border-[#0F172A] hover:bg-[#F8FAFC]" : ""}
        `}
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
          ${isDragging ? "bg-[#059669] text-white" : "bg-[#F0F9FF] text-[#0284C7]"}`}
        >
          {isDragging ? <File className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
        </div>

        <div className="text-center">
          <p className="text-sm font-bold text-[#0F172A]">
            {isDragging ? "Drop your document here" : "Upload Medical Document"}
          </p>
          <p className="text-xs text-[#64748B] mt-0.5">
            PDF, JPG, PNG, WEBP — max {MAX_FILE_SIZE_BYTES / 1024 / 1024} MB
          </p>
        </div>

        {/* File type icons */}
        <div className="flex items-center gap-2">
          {[
            { label: "PDF", color: "text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]" },
            { label: "JPG", color: "text-[#0284C7] bg-[#F0F9FF] border-[#BAE6FD]" },
            { label: "PNG", color: "text-[#7C3AED] bg-[#F5F3FF] border-[#DDD6FE]" },
            { label: "WEBP", color: "text-[#059669] bg-[#ECFDF5] border-[#A7F3D0]" },
          ].map(({ label, color }) => (
            <span
              key={label}
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${color}`}
            >
              {label}
            </span>
          ))}
        </div>

        {!isDragging && (
          <p className="text-[11px] text-[#94A3B8]">
            Click to browse or drag & drop
          </p>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={SUPPORTED_EXTENSIONS.join(",") + "," + SUPPORTED_MIME_TYPES.join(",")}
        onChange={handleInputChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        disabled={disabled}
      />

      {/* Validation error */}
      {validationError && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-2.5 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl"
        >
          <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
          <p className="text-xs text-[#991B1B] leading-relaxed">{validationError}</p>
        </div>
      )}
    </div>
  );
}
