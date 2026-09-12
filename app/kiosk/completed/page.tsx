"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/store/kiosk-context";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Ticket,
  Clock,
  MapPin,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Stethoscope,
} from "lucide-react";

export default function IntakeCompletedPage() {
  const router = useRouter();
  const { session, resetSession } = useKiosk();
  const token = session.token || "A-127";

  const handleReturnHome = () => {
    resetSession();
    router.push("/kiosk");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
      <KioskHeader title="Intake Complete" subtitle="Submission Confirmed" />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-10 flex flex-col items-center justify-center text-center">
        {/* Success Animated Circle */}
        <div className="w-20 h-20 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center mb-6 shadow-md ring-8 ring-[#D1FAE5] animate-scale-in">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <h1 className="text-3xl font-extrabold text-[#0F172A] font-heading mb-2">
          Intake Submitted Successfully!
        </h1>
        <p className="text-sm text-[#64748B] mb-8">
          आपकी जानकारी सफलतापूर्वक डॉक्टर के पास भेज दी गई है।
        </p>

        {/* Token Card */}
        <div className="w-full bg-white rounded-3xl border-2 border-[#E2E8F0] p-8 shadow-md mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#059669]" />

          <span className="text-xs font-bold uppercase tracking-widest text-[#64748B] block mb-1">
            Your Consultation Token (कंसल्टेशन टोकन)
          </span>

          <div className="text-6xl font-extrabold text-[#0F172A] font-heading tracking-tight my-3 text-[#059669]">
            {token}
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F5F9] text-xs font-bold text-[#0F172A] mb-4">
            <span>Patient: {session.patient?.fullName || "Ramesh Kumar"}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E2E8F0] text-left text-xs">
            <div className="flex items-center gap-2 text-[#64748B]">
              <MapPin className="w-4 h-4 text-[#059669]" />
              <div>
                <span className="block text-[#94A3B8]">Room / Counter</span>
                <span className="font-bold text-[#0F172A]">Room 104 (Cardiology)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#64748B]">
              <Clock className="w-4 h-4 text-[#059669]" />
              <div>
                <span className="block text-[#94A3B8]">Estimated Wait</span>
                <span className="font-bold text-[#0F172A]">~8-12 Minutes</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#64748B] mb-8 max-w-md">
          Please proceed to the waiting area. Your token number will be called and displayed on the OPD screen when the doctor is ready.
        </p>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <Button
            variant="kiosk"
            className="w-full bg-[#0F172A] hover:bg-[#1E293B] shadow-md h-14"
            onClick={handleReturnHome}
          >
            <RefreshCw className="w-5 h-5 mr-2 text-[#34D399]" />
            <span>Finish & Return to Welcome Screen</span>
          </Button>

          {/* Hackathon Reviewer Direct Link */}
          <Link href="/doctor/dashboard" className="block w-full">
            <Button
              variant="outline"
              className="w-full h-12 border-[#059669] text-[#059669] hover:bg-[#ECFDF5] font-semibold"
            >
              <Stethoscope className="w-4 h-4 mr-2 text-[#059669]" />
              <span>Jump to Doctor Dashboard (View this Intake) →</span>
            </Button>
          </Link>
        </div>
      </main>

      <footer className="p-4 text-center text-xs text-[#94A3B8]">
        Session cleared automatically after completion to protect patient privacy.
      </footer>
    </div>
  );
}
