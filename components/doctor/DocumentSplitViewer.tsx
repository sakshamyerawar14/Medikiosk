"use client";

import React, { useState } from "react";
import { MedicalDocument, DocumentEntity } from "@/types";
import { DEMO_DOCUMENTS } from "@/data/demo/patients";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  ZoomIn,
  Check,
  X,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export function DocumentSplitViewer({ patientId = "p-001" }: { patientId?: string }) {
  const patientDocs = DEMO_DOCUMENTS.filter((d) => d.patientId === patientId || d.patientId === "p-001");
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument>(patientDocs[0] || DEMO_DOCUMENTS[0]);
  const [entities, setEntities] = useState<DocumentEntity[]>(selectedDoc.entities || []);

  const handleToggleVerify = (entityId: string) => {
    setEntities((prev) =>
      prev.map((ent) =>
        ent.id === entityId
          ? {
              ...ent,
              verificationStatus: ent.verificationStatus === "verified" ? "needs_review" : "verified",
            }
          : ent
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Document Selector Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {patientDocs.map((doc) => {
          const isSelected = selectedDoc.id === doc.id;

          return (
            <button
              key={doc.id}
              onClick={() => {
                setSelectedDoc(doc);
                setEntities(doc.entities || []);
              }}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-[#0F172A] text-white border-[#0F172A] shadow-sm"
                  : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="capitalize">{doc.documentType.replace("_", " ")}</span>
              <span className="opacity-75 font-normal">({doc.documentDate})</span>
            </button>
          );
        })}
      </div>

      {/* Split Viewer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Original Document Preview */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Original Medical Document
              </span>
              <Badge variant="outline" className="text-[10px] uppercase">
                {selectedDoc.documentType.replace("_", " ")}
              </Badge>
            </div>
            <span className="text-xs text-[#64748B]">Date: {selectedDoc.documentDate}</span>
          </div>

          {/* Document Simulated Canvas */}
          <div className="flex-1 min-h-[380px] bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-6 relative flex flex-col justify-between overflow-hidden">
            {/* Watermark */}
            <div className="absolute top-4 right-4 text-[10px] font-mono text-[#94A3B8] border border-[#CBD5E1] px-2 py-1 rounded">
              OCR-SCAN-VAULT
            </div>

            {/* Document Header Text */}
            <div>
              <div className="border-b border-[#CBD5E1] pb-3 mb-4">
                <h4 className="text-sm font-extrabold text-[#0F172A] uppercase">
                  District Memorial Hospital & Cardiology OPD
                </h4>
                <p className="text-[11px] text-[#64748B]">
                  Dr. R. K. Mehta, MD (Cardiology) • Reg: MCI-54812
                </p>
                <p className="text-[11px] text-[#64748B]">
                  Patient: Ramesh Kumar (52/M) • Date: {selectedDoc.documentDate}
                </p>
              </div>

              {/* Document Body Lines */}
              <div className="space-y-3 text-xs text-[#334155] font-mono">
                <p className="font-bold text-[#0F172A]">Clinical Impression: Primary Hypertension</p>
                <div className="bg-[#FEF3C7] p-2 rounded border border-[#FDE68A] text-[11px]">
                  Rx:
                  <br />
                  1. Tab. Amlodipine 5mg — 1 tab OD (Morning) x 30 days
                  <br />
                  2. Tab. Metoprolol Succinate 25mg — 1 tab OD x 30 days
                </div>
                <p className="text-[11px] text-[#64748B]">
                  Advice: Salt restriction, monitor BP weekly, review after 1 month with lipid profile.
                </p>
              </div>
            </div>

            {/* Doctor Signature Block */}
            <div className="pt-4 border-t border-[#CBD5E1] flex justify-between items-end">
              <span className="text-[10px] text-[#94A3B8]">Digitally Captured by MediKiosk Scanner</span>
              <div className="text-right">
                <span className="text-xs font-serif italic text-[#0F172A] font-bold block">
                  Dr. R. K. Mehta
                </span>
                <span className="text-[9px] text-[#64748B]">Authorized Signatory</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Structured Extracted Entities with Confidence */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Extracted Clinical Entities
                </span>
                <h3 className="text-base font-bold text-[#0F172A] font-heading">
                  AI Entity Extraction Results
                </h3>
              </div>
              <Badge variant="ai" className="text-[10px]">
                OCR Confidence: 94%
              </Badge>
            </div>

            {/* Entities List */}
            <div className="space-y-3">
              {entities.map((ent) => {
                const isVerified = ent.verificationStatus === "verified";

                return (
                  <div
                    key={ent.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isVerified
                        ? "bg-[#ECFDF5] border-[#A7F3D0]"
                        : "bg-[#FFFBEB] border-[#FDE68A]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white text-[#0F172A] border border-[#E2E8F0]">
                          {ent.entityType}
                        </span>
                        <h4 className="text-sm font-bold text-[#0F172A]">
                          {ent.entityName}
                        </h4>
                      </div>

                      <span className="text-xs font-mono font-bold text-[#059669]">
                        {Math.round(ent.confidence * 100)}% conf
                      </span>
                    </div>

                    {ent.value && (
                      <p className="text-xs text-[#334155] font-medium mb-2">
                        Value / Dose: <span className="font-bold text-[#0F172A]">{ent.value}</span>{" "}
                        {ent.referenceRange && `(Ref: ${ent.referenceRange})`}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-black/5 text-xs">
                      <span className="text-[11px] text-[#64748B]">
                        Status:{" "}
                        <strong className={isVerified ? "text-[#059669]" : "text-[#D97706]"}>
                          {isVerified ? "Clinician Verified" : "Needs Review"}
                        </strong>
                      </span>

                      <button
                        onClick={() => handleToggleVerify(ent.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                          isVerified
                            ? "bg-white text-[#DC2626] border border-[#FECACA] hover:bg-[#FEF2F2]"
                            : "bg-[#059669] text-white hover:bg-[#047857]"
                        }`}
                      >
                        {isVerified ? "Mark Needs Review" : "Verify Fact ✓"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] mt-4 flex items-center justify-between text-xs text-[#64748B]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#059669]" />
              Confidence &gt; 85% highlighted green
            </span>
            <Button
              size="sm"
              className="bg-[#0F172A] text-white"
              onClick={() => {
                setEntities((prev) =>
                  prev.map((e) => ({ ...e, verificationStatus: "verified" }))
                );
              }}
            >
              Verify All Entities
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
