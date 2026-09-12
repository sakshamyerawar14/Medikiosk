"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/store/kiosk-context";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { KioskProgress } from "@/components/kiosk/KioskProgress";
import { AudioPlayer } from "@/components/kiosk/AudioPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Department } from "@/types";
import { DEMO_DEPARTMENTS } from "@/data/demo/patients";
import {
  Stethoscope,
  HeartPulse,
  Bone,
  Sparkles,
  Brain,
  Leaf,
  Baby,
  Search,
  Check,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export default function DepartmentSelectionPage() {
  const router = useRouter();
  const { session, setDepartment } = useKiosk();
  const [selectedDept, setSelectedDept] = useState<Department>(session.department || "cardiology");
  const [searchQuery, setSearchQuery] = useState("");

  const iconMap: Record<string, React.ReactNode> = {
    Stethoscope: <Stethoscope className="w-8 h-8 text-[#059669]" />,
    HeartPulse: <HeartPulse className="w-8 h-8 text-[#DC2626]" />,
    Bone: <Bone className="w-8 h-8 text-[#D97706]" />,
    Sparkles: <Sparkles className="w-8 h-8 text-[#7C3AED]" />,
    Brain: <Brain className="w-8 h-8 text-[#2563EB]" />,
    Leaf: <Leaf className="w-8 h-8 text-[#059669]" />,
    Baby: <Baby className="w-8 h-8 text-[#EA580C]" />,
  };

  const filteredDepts = DEMO_DEPARTMENTS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (code: Department, name: string) => {
    setSelectedDept(code);
    setDepartment(code, name);
  };

  const handleContinue = () => {
    const selectedObj = DEMO_DEPARTMENTS.find((d) => d.code === selectedDept);
    setDepartment(selectedDept, selectedObj?.name || "General Medicine");
    router.push("/kiosk/complaint");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
      <div>
        <KioskHeader title="Department Selection" subtitle="Step 4: Choose your specialty OPD" />
        <KioskProgress currentStep={4} />
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-6">
          <div className="mb-3 flex justify-center">
            <AudioPlayer
              text="Which department or specialty do you wish to consult today?"
              autoPlay
            />
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A] font-heading mb-2">
            Select Department
          </h1>
          <p className="text-base text-[#64748B]">
            आप किस विभाग में डॉक्टर से परामर्श लेना चाहते हैं?
          </p>
        </div>

        {/* Search filter for kiosk accessibility */}
        <div className="w-full max-w-md mb-6 relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search department (e.g. Heart, AYUSH, Medicine)..."
            className="pl-11 h-12 text-sm bg-white"
          />
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-8">
          {filteredDepts.map((dept) => {
            const isSelected = selectedDept === dept.code;

            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => handleSelect(dept.code, dept.name)}
                className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left touch-target cursor-pointer ${
                  isSelected
                    ? "bg-[#F8FAFC] border-[#0F172A] shadow-md ring-2 ring-[#0F172A]"
                    : "bg-white border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] shadow-sm"
                }`}
              >
                <div className="p-3 rounded-xl bg-[#F1F5F9] shrink-0">
                  {iconMap[dept.icon || "Stethoscope"] || <Stethoscope className="w-8 h-8 text-[#059669]" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#0F172A] font-heading">
                      {dept.name}
                    </h3>
                    {dept.type === "ayush" && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                        AYUSH
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#64748B] capitalize mt-0.5">
                    OPD Waiting: ~10 mins
                  </p>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    isSelected
                      ? "bg-[#0F172A] text-white"
                      : "border-2 border-[#CBD5E1] text-transparent"
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between w-full max-w-xl gap-4">
          <Button
            variant="kioskSecondary"
            className="flex-1"
            onClick={() => router.push("/kiosk/details")}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <Button
            variant="kiosk"
            className="flex-1 bg-[#0F172A] hover:bg-[#1E293B]"
            onClick={handleContinue}
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2 text-[#34D399]" />
          </Button>
        </div>
      </main>
    </div>
  );
}
