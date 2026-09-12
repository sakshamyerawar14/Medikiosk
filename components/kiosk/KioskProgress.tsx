"use client";

import React from "react";
import { Check } from "lucide-react";

interface Step {
  id: number;
  name: string;
  short: string;
}

const STEPS: Step[] = [
  { id: 1, name: "Language", short: "Lang" },
  { id: 2, name: "Consent", short: "Consent" },
  { id: 3, name: "Identity", short: "Details" },
  { id: 4, name: "Department", short: "Dept" },
  { id: 5, name: "Complaint", short: "Complaint" },
  { id: 6, name: "Interview", short: "History" },
  { id: 7, name: "Documents", short: "Records" },
  { id: 8, name: "Review", short: "Review" },
];

export function KioskProgress({ currentStep }: { currentStep: number }) {
  const percentage = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100);

  return (
    <div className="w-full bg-white border-b border-[#E2E8F0] px-4 py-3 select-none">
      <div className="max-w-4xl mx-auto">
        {/* Step circles & connect line (desktop/tablet) */}
        <div className="hidden sm:flex items-center justify-between relative mb-1.5">
          {/* Background line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#E2E8F0] -translate-y-1/2 z-0" />
          
          {/* Active progress line */}
          <div
            className="absolute top-1/2 left-0 h-1 bg-[#059669] -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />

          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? "bg-[#059669] text-white"
                      : isCurrent
                      ? "bg-[#0F172A] text-white ring-4 ring-[#E2E8F0] scale-110 shadow-sm"
                      : "bg-white text-[#94A3B8] border-2 border-[#E2E8F0]"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                </div>
                <span
                  className={`text-[11px] mt-1 font-medium ${
                    isCurrent
                      ? "text-[#0F172A] font-bold"
                      : isCompleted
                      ? "text-[#059669]"
                      : "text-[#94A3B8]"
                  }`}
                >
                  {step.short}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile simple progress bar */}
        <div className="sm:hidden flex items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-semibold text-[#0F172A] mb-1">
              <span>Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.name}</span>
              <span className="text-[#059669]">{percentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
              <div
                className="h-full bg-[#059669] transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
