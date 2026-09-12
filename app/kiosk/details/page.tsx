"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/store/kiosk-context";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { KioskProgress } from "@/components/kiosk/KioskProgress";
import { AudioPlayer } from "@/components/kiosk/AudioPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Phone, Calendar, ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { Gender } from "@/types";

export default function PatientDetailsPage() {
  const router = useRouter();
  const { session, setPatientInfo } = useKiosk();

  const [fullName, setFullName] = useState(session.patient?.fullName || "");
  const [age, setAge] = useState(session.patient?.age?.toString() || "");
  const [gender, setGender] = useState<Gender>(session.patient?.gender || "male");
  const [phone, setPhone] = useState(session.patient?.phone || "");
  const [abha, setAbha] = useState(session.patient?.abhaReference || "");

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientInfo({
      fullName,
      age: parseInt(age) || 45,
      gender,
      phone,
      abhaReference: abha,
    });
    router.push("/kiosk/department");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
      <div>
        <KioskHeader title="Patient Information" subtitle="Confirm your basic details" />
        <KioskProgress currentStep={3} />
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-6">
          <div className="mb-3 flex justify-center">
            <AudioPlayer
              text="Please confirm your name, age, and phone number."
              autoPlay
            />
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A] font-heading mb-1">
            Confirm Your Details
          </h1>
          <p className="text-sm text-[#64748B]">
            कृपया अपनी जानकारी की पुष्टि करें
          </p>
        </div>

        <form onSubmit={handleContinue} className="w-full bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm space-y-5 mb-8">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
              Full Name (पूरा नाम) *
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <Input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter patient full name"
                className="pl-11 h-13 text-lg font-semibold text-[#0F172A]"
              />
            </div>
          </div>

          {/* Age & Gender Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Age in Years (उम्र) *
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <Input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 45"
                  className="pl-11 h-13 text-lg font-semibold text-[#0F172A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Gender (लिंग) *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "male" as Gender, label: "Male (पुरुष)" },
                  { value: "female" as Gender, label: "Female (महिला)" },
                  { value: "other" as Gender, label: "Other" },
                ].map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setGender(g.value)}
                    className={`h-13 rounded-lg border-2 text-xs font-bold transition-all ${
                      gender === g.value
                        ? "border-[#0F172A] bg-[#F8FAFC] text-[#0F172A] ring-2 ring-[#0F172A]"
                        : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
              Mobile Number (मोबाइल नंबर) *
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <Input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="pl-11 h-13 text-lg font-semibold text-[#0F172A]"
              />
            </div>
          </div>

          {/* ABHA Reference */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5 flex items-center justify-between">
              <span>ABHA / Health ID (Optional)</span>
              <span className="text-[#059669] font-normal lowercase text-[11px]">demo linked</span>
            </label>
            <Input
              type="text"
              value={abha}
              onChange={(e) => setAbha(e.target.value)}
              placeholder="e.g. 91-4523-8891-2014"
              className="h-12 text-sm font-mono text-[#0F172A]"
            />
          </div>

          <div className="pt-4 flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="kioskSecondary"
              className="flex-1"
              onClick={() => router.push("/kiosk/identification")}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <Button
              type="submit"
              variant="kiosk"
              className="flex-1 bg-[#0F172A] hover:bg-[#1E293B]"
            >
              <span>Save & Continue</span>
              <ArrowRight className="w-5 h-5 ml-2 text-[#34D399]" />
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
