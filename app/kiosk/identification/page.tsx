"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/store/kiosk-context";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { KioskProgress } from "@/components/kiosk/KioskProgress";
import { AudioPlayer } from "@/components/kiosk/AudioPlayer";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  UserCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  CreditCard,
  QrCode,
} from "lucide-react";
import { DEMO_PATIENTS } from "@/data/demo/patients";

export default function IdentificationPage() {
  const router = useRouter();
  const { loadDemoPatient, resetPatient } = useKiosk();
  const [selectedMode, setSelectedMode] = useState<"new" | "existing" | "demo">("demo");

  const handleSelectNew = () => {
    setSelectedMode("new");
    resetPatient();
    router.push("/kiosk/details");
  };

  const handleSelectExisting = () => {
    setSelectedMode("existing");
    loadDemoPatient("p-002"); // prefill Sunita Patil
    router.push("/kiosk/details");
  };

  const handleSelectDemo = (patientId: string) => {
    loadDemoPatient(patientId);
    router.push("/kiosk/details");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
      <div>
        <KioskHeader title="Patient Identification" subtitle="Step 3: Tell us who you are" />
        <KioskProgress currentStep={3} />
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-8">
          <div className="mb-3 flex justify-center">
            <AudioPlayer
              text="Are you visiting for the first time, or do you already have a hospital registration?"
              autoPlay
            />
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A] font-heading mb-2">
            Patient Identification
          </h1>
          <p className="text-base text-[#64748B]">
            क्या आप पहली बार आ रहे हैं या आपका पुराना पंजीकरण है?
          </p>
        </div>

        {/* Identification Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl mb-8">
          {/* New Patient Card */}
          <button
            type="button"
            onClick={handleSelectNew}
            className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border-2 border-[#E2E8F0] shadow-sm hover:border-[#0F172A] hover:bg-[#F8FAFC] hover:shadow-md transition-all touch-target cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UserPlus className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] font-heading mb-1">
              I am a New Patient
            </h3>
            <p className="text-sm text-[#64748B] mb-4">
              नया मरीज • First time visiting this hospital OPD
            </p>
            <span className="text-xs font-bold text-[#059669] flex items-center gap-1">
              Create New Registration →
            </span>
          </button>

          {/* Existing Patient Card */}
          <button
            type="button"
            onClick={handleSelectExisting}
            className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border-2 border-[#E2E8F0] shadow-sm hover:border-[#0F172A] hover:bg-[#F8FAFC] hover:shadow-md transition-all touch-target cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#F0F9FF] text-[#0284C7] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UserCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] font-heading mb-1">
              I am an Existing Patient
            </h3>
            <p className="text-sm text-[#64748B] mb-4">
              पुराना मरीज • Lookup via Mobile Number or ABHA ID
            </p>
            <span className="text-xs font-bold text-[#0284C7] flex items-center gap-1">
              Lookup Existing File →
            </span>
          </button>
        </div>

        {/* Demo Patient Fast-Track Section for Hackathon Reviewers */}
        <div className="w-full max-w-3xl bg-gradient-to-r from-[#F5F3FF] to-[#ECFDF5] rounded-2xl border border-[#DDD6FE] p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#7C3AED]" />
            <h4 className="text-base font-bold text-[#4C1D95] font-heading">
              Evaluation & Demo Mode (Instant Synthetic Patients)
            </h4>
          </div>
          <p className="text-xs text-[#5B21B6] mb-4">
            Select one of our realistic, non-real synthetic patient profiles to test the end-to-end clinical workflow:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DEMO_PATIENTS.slice(0, 3).map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => handleSelectDemo(demo.id)}
                className="p-3.5 rounded-xl bg-white border border-[#DDD6FE] text-left hover:border-[#7C3AED] hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="text-sm font-bold text-[#0F172A]">{demo.fullName}</div>
                <div className="text-xs text-[#64748B]">
                  {demo.age} yrs • {demo.gender}
                </div>
                <div className="text-[11px] font-medium text-[#059669] mt-1">
                  {demo.id === "p-001"
                    ? "Chest Discomfort"
                    : demo.id === "p-002"
                    ? "Fever & Chills"
                    : "Joint & Knee Pain"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="w-full max-w-xl flex justify-start">
          <Button
            variant="kioskSecondary"
            className="w-40"
            onClick={() => router.push("/kiosk/consent")}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </div>
      </main>
    </div>
  );
}
