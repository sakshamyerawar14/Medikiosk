"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/store/kiosk-context";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { KioskProgress } from "@/components/kiosk/KioskProgress";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Loader2,
  FileSearch,
  Pill,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface StepStatus {
  id: number;
  label: string;
  sublabel: string;
  status: "done" | "in_progress" | "pending";
}

export default function DocumentProcessingPage() {
  const router = useRouter();
  const { session } = useKiosk();
  const [progressPercent, setProgressPercent] = useState(25);
  const [currentStepIndex, setCurrentStepIndex] = useState(1);

  const steps: StepStatus[] = [
    {
      id: 1,
      label: "Document Uploaded & Sanitized",
      sublabel: "Encrypted optical image stored in secure vault",
      status: currentStepIndex >= 1 ? "done" : "pending",
    },
    {
      id: 2,
      label: "Optical Character Recognition (OCR)",
      sublabel: "Multi-column layout & handwritten text processing",
      status: currentStepIndex > 2 ? "done" : currentStepIndex === 2 ? "in_progress" : "pending",
    },
    {
      id: 3,
      label: "Clinical Entity & Medication Extraction",
      sublabel: "Identified Amlodipine 5mg, Metoprolol 25mg, Fasting Glucose",
      status: currentStepIndex > 3 ? "done" : currentStepIndex === 3 ? "in_progress" : "pending",
    },
    {
      id: 4,
      label: "Synthesizing Longitudinal Medical Timeline",
      sublabel: "Cross-referencing 2024–2026 chronological records",
      status: currentStepIndex >= 4 ? "done" : currentStepIndex === 4 ? "in_progress" : "pending",
    },
  ];

  useEffect(() => {
    const t1 = setTimeout(() => {
      setCurrentStepIndex(2);
      setProgressPercent(50);
    }, 1200);

    const t2 = setTimeout(() => {
      setCurrentStepIndex(3);
      setProgressPercent(80);
    }, 2400);

    const t3 = setTimeout(() => {
      setCurrentStepIndex(4);
      setProgressPercent(100);
    }, 3600);

    const t4 = setTimeout(() => {
      router.push("/kiosk/review");
    }, 4800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
      <div>
        <KioskHeader title="Document Intelligence" subtitle="AI Optical Medical Extraction" />
        <KioskProgress currentStep={7} />
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 flex flex-col items-center justify-center text-center">
        {/* Animated OCR Scan Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-[#ECFDF5] border-2 border-[#A7F3D0] flex items-center justify-center text-[#059669] shadow-md">
            <FileSearch className="w-12 h-12 text-[#059669] animate-pulse" />
          </div>
          <span className="absolute -bottom-2 -right-2 p-2 rounded-full bg-[#0F172A] text-white shadow-sm">
            <Sparkles className="w-4 h-4 text-[#34D399]" />
          </span>
        </div>

        <h1 className="text-3xl font-bold text-[#0F172A] font-heading mb-2">
          Analyzing Medical Documents...
        </h1>
        <p className="text-sm text-[#64748B] max-w-md mx-auto mb-8">
          Extracting clinical observations, medications, and laboratory values into a structured timeline.
        </p>

        {/* Progress Bar */}
        <div className="w-full mb-8">
          <div className="flex justify-between text-xs font-bold text-[#0F172A] mb-2">
            <span>Extraction Progress</span>
            <span className="text-[#059669] font-mono">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        {/* Step-by-Step Status Card */}
        <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm text-left space-y-4 mb-8">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-3.5">
              <div className="mt-0.5 shrink-0">
                {step.status === "done" ? (
                  <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                ) : step.status === "in_progress" ? (
                  <Loader2 className="w-5 h-5 text-[#0284C7] animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-[#CBD5E1]" />
                )}
              </div>

              <div className="flex-1">
                <p
                  className={`text-sm font-bold ${
                    step.status === "done"
                      ? "text-[#0F172A]"
                      : step.status === "in_progress"
                      ? "text-[#0284C7]"
                      : "text-[#94A3B8]"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-[#64748B]">{step.sublabel}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Disclaimer */}
        <div className="flex items-center gap-2 text-xs text-[#64748B] bg-[#F1F5F9] px-4 py-2 rounded-xl mb-6">
          <ShieldCheck className="w-4 h-4 text-[#059669]" />
          <span>Extracted information will be verified by the doctor during consultation.</span>
        </div>

        {/* Manual Skip/Proceed CTA */}
        <Button
          variant="kioskSecondary"
          className="text-sm h-12 px-6"
          onClick={() => router.push("/kiosk/review")}
        >
          <span>Proceed to Review Summary</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </main>
    </div>
  );
}
