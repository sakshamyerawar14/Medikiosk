"use client";

import React, { useState } from "react";
import { ClinicalSummary, StructuredSummary } from "@/types";
import { DEMO_SUMMARIES } from "@/data/demo/patients";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  CheckCircle2,
  Edit2,
  Check,
  AlertTriangle,
  FileText,
  ShieldCheck,
  FileEdit,
  Save,
  Undo2,
} from "lucide-react";

export function ClinicalSummaryViewer({
  encounterId = "enc-001",
  onVerifySuccess,
}: {
  encounterId?: string;
  onVerifySuccess?: () => void;
}) {
  const [summaryData, setSummaryData] = useState<ClinicalSummary>(
    DEMO_SUMMARIES[encounterId] || DEMO_SUMMARIES["enc-001"]
  );
  const [isDoctorVerified, setIsDoctorVerified] = useState(summaryData.doctorVerified);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const [saveToast, setSaveToast] = useState(false);

  const summary = summaryData.summaryJson;

  const handleStartEdit = (sectionKey: string, currentContent: string) => {
    setEditingSection(sectionKey);
    setEditedText(currentContent);
  };

  const handleSaveEdit = (sectionKey: string) => {
    // Save the edited content
    setSummaryData((prev) => {
      const updated = { ...prev };
      if (sectionKey === "chiefComplaint") {
        updated.summaryJson.chiefComplaint.content = editedText;
        updated.summaryJson.chiefComplaint.doctorVerified = true;
      } else if (sectionKey === "hpi") {
        updated.summaryJson.historyOfPresentIllness.content = editedText;
        updated.summaryJson.historyOfPresentIllness.doctorVerified = true;
      } else if (sectionKey === "pastMedical") {
        updated.summaryJson.pastMedicalHistory.content = editedText;
        updated.summaryJson.pastMedicalHistory.doctorVerified = true;
      }
      return updated;
    });

    setEditingSection(null);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleVerifyAll = () => {
    setIsDoctorVerified(true);
    setSummaryData((prev) => ({
      ...prev,
      doctorVerified: true,
      verifiedBy: "Dr. Vikram Seth",
      verifiedAt: new Date().toISOString(),
    }));
    if (onVerifySuccess) onVerifySuccess();
  };

  return (
    <div className="space-y-6">
      {/* AI Draft Banner with Clear Medical Disclaimer */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isDoctorVerified
            ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]"
            : "bg-[#F5F3FF] border-[#DDD6FE] text-[#5B21B6]"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isDoctorVerified ? "bg-[#059669] text-white" : "bg-[#7C3AED] text-white"
            }`}
          >
            {isDoctorVerified ? <CheckCircle2 className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-heading">
                {isDoctorVerified
                  ? "CLINICIAN VERIFIED CLINICAL RECORD"
                  : "AI-GENERATED CLINICAL DRAFT — REQUIRES CLINICIAN VERIFICATION"}
              </h3>
              <Badge variant={isDoctorVerified ? "success" : "ai"} className="text-[10px]">
                {isDoctorVerified ? "Verified by Dr. Seth" : "AI Confidence: 92%"}
              </Badge>
            </div>
            <p className="text-xs opacity-90 mt-0.5">
              {isDoctorVerified
                ? "Record locked and verified for hospital EHR / HIS integration."
                : "Synthesized from patient voice intake and extracted prescriptions. Review, edit, or approve below."}
            </p>
          </div>
        </div>

        {!isDoctorVerified && (
          <Button
            size="sm"
            className="bg-[#059669] hover:bg-[#047857] text-white shrink-0 font-semibold"
            onClick={handleVerifyAll}
          >
            <Check className="w-4 h-4 mr-1" />
            Verify All & Finalize
          </Button>
        )}
      </div>

      {saveToast && (
        <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] rounded-xl text-xs font-bold animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Clinical section successfully updated by Doctor.</span>
        </div>
      )}

      {/* Structured Clinical Sections Grid */}
      <div className="space-y-4">
        {/* Section 1: Chief Complaint */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                1. Chief Complaint
              </span>
              <Badge variant="ai" className="text-[10px]">
                Source: {summary.chiefComplaint.source}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#059669] h-8 text-xs"
              onClick={() => handleStartEdit("chiefComplaint", summary.chiefComplaint.content)}
            >
              <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
            </Button>
          </div>

          {editingSection === "chiefComplaint" ? (
            <div className="space-y-2">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full p-3 rounded-lg border border-[#0F172A] text-sm text-[#0F172A] focus:outline-none"
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-[#0F172A]"
                  onClick={() => handleSaveEdit("chiefComplaint")}
                >
                  <Save className="w-3.5 h-3.5 mr-1" /> Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm font-semibold text-[#0F172A] leading-relaxed">
              {summary.chiefComplaint.content}
            </p>
          )}
        </div>

        {/* Section 2: History of Present Illness (HPI) */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                2. History of Present Illness (HPI)
              </span>
              <Badge variant="ai" className="text-[10px]">
                Source: Voice Interview
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#059669] h-8 text-xs"
              onClick={() => handleStartEdit("hpi", summary.historyOfPresentIllness.content)}
            >
              <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
            </Button>
          </div>

          {editingSection === "hpi" ? (
            <div className="space-y-2">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full p-3 rounded-lg border border-[#0F172A] text-sm text-[#0F172A] focus:outline-none"
                rows={4}
              />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-[#0F172A]"
                  onClick={() => handleSaveEdit("hpi")}
                >
                  <Save className="w-3.5 h-3.5 mr-1" /> Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#334155] leading-relaxed">
              {summary.historyOfPresentIllness.content}
            </p>
          )}
        </div>

        {/* Section 3: Medication History (Extracted from Documents) */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              3. Current Medication History (OCR Extracted)
            </span>
            <span className="text-xs text-[#64748B]">
              Prescription: 15 June 2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B]">
                <tr>
                  <th className="py-2.5 px-3">Medication</th>
                  <th className="py-2.5 px-3">Dose / Frequency</th>
                  <th className="py-2.5 px-3">Source</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {summary.medicationHistory.map((med, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-3 font-bold text-[#0F172A]">{med.name}</td>
                    <td className="py-3 px-3 text-[#334155]">
                      {med.dose} • {med.frequency}
                    </td>
                    <td className="py-3 px-3 text-[#64748B] capitalize">{med.source}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#059669]">
                      {Math.round(med.confidence * 100)}%
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={med.verificationStatus === "verified" ? "success" : "warning"}
                        className="text-[10px]"
                      >
                        {med.verificationStatus === "verified" ? "Verified" : "Needs Review"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Allergies & Chronic Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Allergies */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block mb-2">
              4. Known Drug Allergies
            </span>
            {summary.allergyHistory.map((all, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-[#991B1B]">{all.allergen}</h4>
                  <p className="text-xs text-[#B91C1C]">Reaction: {all.reaction}</p>
                </div>
                <Badge variant="destructive" className="text-[10px]">
                  {all.severity}
                </Badge>
              </div>
            ))}
          </div>

          {/* Past Medical History */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block mb-2">
              5. Past Medical History
            </span>
            <p className="text-sm text-[#334155] leading-relaxed">
              {summary.pastMedicalHistory.content}
            </p>
          </div>
        </div>

        {/* Section 5: Unresolved Items Flagged for Doctor */}
        {summary.unresolvedItems && summary.unresolvedItems.length > 0 && (
          <div className="bg-[#FFFBEB] rounded-2xl border border-[#FDE68A] p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E]">
                Items Flagged for Clinical Clarification
              </h4>
            </div>
            <ul className="list-disc pl-5 text-xs text-[#78350F] space-y-1">
              {summary.unresolvedItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Master Verification Footer */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <ShieldCheck className="w-5 h-5 text-[#059669]" />
          <span>
            Doctor verification creates an immutable audit trail entry and synchronizes with the hospital HIS.
          </span>
        </div>

        <Button
          className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-6 h-11"
          onClick={handleVerifyAll}
        >
          <CheckCircle2 className="w-4 h-4 mr-2 text-[#34D399]" />
          <span>{isDoctorVerified ? "Record Verified ✓" : "Accept & Verify Draft"}</span>
        </Button>
      </div>
    </div>
  );
}
