"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/store/kiosk-context";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { KioskProgress } from "@/components/kiosk/KioskProgress";
import { AudioPlayer } from "@/components/kiosk/AudioPlayer";
import { Button } from "@/components/ui/button";
import {
  User,
  Heart,
  Calendar,
  Pill,
  AlertOctagon,
  FileText,
  Edit2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function ReviewSummaryPage() {
  const router = useRouter();
  const { session, completeIntake } = useKiosk();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      // Check if red-flags triggered
      const hasCriticalFlags = session.safetyFlags && session.safetyFlags.length > 0;
      const generatedToken = completeIntake();

      if (hasCriticalFlags && session.safetyFlags.some((f) => f.severity === "critical")) {
        router.push("/kiosk/red-flag");
      } else {
        router.push("/kiosk/completed");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
      <div>
        <KioskHeader title="Review Your Intake" subtitle="Step 8: Confirm your information" />
        <KioskProgress currentStep={8} />
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-6">
          <div className="mb-3 flex justify-center">
            <AudioPlayer
              text="Please review your summarized clinical information before sending it to the doctor's queue."
              autoPlay
            />
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A] font-heading mb-1">
            Review & Confirm Your Intake
          </h1>
          <p className="text-sm text-[#64748B]">
            डॉक्टर के पास भेजने से पहले अपनी जानकारी की जांच कर लें
          </p>
        </div>

        {/* Structured Patient Review Cards */}
        <div className="w-full space-y-4 mb-8">
          {/* Section 1: Patient Identity */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] text-[#0F172A] flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Patient Identity
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">
                  {session.patient?.fullName || "Ramesh Kumar"} (
                  {session.patient?.age || "52"} yrs, {session.patient?.gender || "male"})
                </h3>
                <p className="text-xs text-[#64748B]">
                  Phone: {session.patient?.phone || "+91 98765 43210"} • Dept: {session.departmentName || "Cardiology"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#059669]"
              onClick={() => router.push("/kiosk/details")}
            >
              <Edit2 className="w-4 h-4 mr-1" /> Edit
            </Button>
          </div>

          {/* Section 2: Chief Complaint */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Primary Complaint
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">
                  {session.chiefComplaint || "Chest discomfort & heaviness across central chest for 2 days"}
                </h3>
                <p className="text-xs text-[#64748B]">
                  Reported via voice & touch • 2 days duration
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#059669]"
              onClick={() => router.push("/kiosk/complaint")}
            >
              <Edit2 className="w-4 h-4 mr-1" /> Edit
            </Button>
          </div>

          {/* Section 3: History & Question Answers */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#059669]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Clinical History Responses ({session.interviewAnswers.length || 4} captured)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#059669]"
                onClick={() => router.push("/kiosk/interview")}
              >
                <Edit2 className="w-4 h-4 mr-1" /> Edit
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block">Onset:</span>
                <span className="font-bold text-[#0F172A]">Yesterday / 2 days ago</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block">Severity:</span>
                <span className="font-bold text-[#0F172A]">Moderate to Severe (Exertional)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block">Existing Conditions:</span>
                <span className="font-bold text-[#0F172A]">Hypertension (High BP)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block">Known Drug Allergy:</span>
                <span className="font-bold text-[#0F172A]">Sulfa drugs (Skin rash)</span>
              </div>
            </div>
          </div>

          {/* Section 4: Current Medications & Documents */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-[#7C3AED]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Current Medications & Attached Files
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#059669]"
                onClick={() => router.push("/kiosk/documents")}
              >
                <Edit2 className="w-4 h-4 mr-1" /> Edit
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-lg bg-[#F5F3FF] border border-[#DDD6FE] text-[#5B21B6] font-semibold">
                💊 Amlodipine 5mg OD
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#F5F3FF] border border-[#DDD6FE] text-[#5B21B6] font-semibold">
                💊 Metoprolol Succinate 25mg
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] font-semibold">
                📄 Prescription (June 2026 attached)
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] text-[#0284C7] font-semibold">
                🧪 Lipid Panel (May 2026 attached)
              </span>
            </div>
          </div>
        </div>

        {/* Safety Footer & Final Submit Button */}
        <div className="w-full max-w-xl flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <span>Information will be routed directly to the OPD Doctor Dashboard.</span>
          </div>

          <Button
            variant="kiosk"
            disabled={isSubmitting}
            className="w-full bg-[#059669] hover:bg-[#047857] shadow-lg text-lg h-14 flex items-center justify-center gap-2"
            onClick={handleSubmit}
          >
            <span>{isSubmitting ? "Submitting to Doctor Queue..." : "Submit to Doctor (डॉक्टर को भेजें)"}</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </main>
    </div>
  );
}
