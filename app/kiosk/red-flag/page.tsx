"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/store/kiosk-context";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  BellRing,
  PhoneCall,
  UserCheck,
  ArrowLeft,
  ShieldAlert,
  HeartCrack,
} from "lucide-react";

export default function RedFlagEscalationPage() {
  const router = useRouter();
  const { session, resetSession } = useKiosk();
  const [staffNotified, setStaffNotified] = useState(true);

  const handleReturn = () => {
    resetSession();
    router.push("/kiosk");
  };

  return (
    <div className="min-h-screen bg-[#FEF2F2] flex flex-col justify-between select-none">
      <KioskHeader title="Clinical Alert" subtitle="Urgent Assessment Needed" />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 flex flex-col items-center justify-center text-center">
        {/* Warning Icon with Pulse Accent */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shadow-lg ring-8 ring-[#FECACA] animate-pulse">
            <AlertTriangle className="w-12 h-12 stroke-[2.5]" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#991B1B] font-heading mb-3">
          Please Contact Hospital Staff Immediately
        </h1>
        <p className="text-base font-medium text-[#B91C1C] max-w-lg mb-8 leading-relaxed">
          कृपया तुरंत अस्पताल के कर्मचारियों से संपर्क करें।
        </p>

        {/* Escalation Card */}
        <div className="w-full bg-white rounded-3xl border-2 border-[#FECACA] p-6 sm:p-8 shadow-md text-left mb-8 space-y-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-[#0F172A] font-heading">
                Potential Urgent Symptoms Reported
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Based on your reported chest discomfort or shortness of breath, you require immediate clinical triage and examination by an emergency doctor.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] space-y-2 text-xs">
            <div className="flex justify-between font-semibold">
              <span className="text-[#991B1B]">Patient Name:</span>
              <span className="text-[#0F172A]">{session.patient?.fullName || "Ramesh Kumar"}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-[#991B1B]">Status:</span>
              <span className="text-[#DC2626] flex items-center gap-1">
                <BellRing className="w-3.5 h-3.5 animate-bounce" />
                Staff Alert Broadcasted to OPD Desk
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-[#991B1B]">Triage Desk:</span>
              <span className="text-[#0F172A]">Emergency Counter 1 (Ground Floor)</span>
            </div>
          </div>

          <p className="text-[11px] text-[#94A3B8] italic text-center">
            * Note: MediKiosk does not emit diagnostic determinations. Hospital clinical personnel are performing emergency evaluation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-3">
          <Button
            variant="destructive"
            className="w-full h-14 text-lg font-bold bg-[#DC2626] hover:bg-[#B91C1C] shadow-lg flex items-center justify-center gap-2"
            onClick={() => alert("Emergency alert re-transmitted to OPD Nursing Station.")}
          >
            <BellRing className="w-5 h-5 animate-bounce" />
            <span>Call Nursing Staff to Kiosk</span>
          </Button>

          <Button
            variant="kioskSecondary"
            className="w-full h-12 text-sm"
            onClick={handleReturn}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Return to Welcome Screen</span>
          </Button>
        </div>
      </main>

      <footer className="p-4 text-center text-xs text-[#991B1B]">
        Emergency Hotline: Call 108 or Contact Hospital Reception Desk
      </footer>
    </div>
  );
}
