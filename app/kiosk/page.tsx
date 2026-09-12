"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/store/kiosk-context";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Globe,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Volume2,
  Sparkles,
  UserCheck,
} from "lucide-react";

export default function KioskWelcomePage() {
  const router = useRouter();
  const { setLanguage, loadDemoPatient } = useKiosk();

  const handleLanguageSelectAndStart = (lang: "en" | "hi" | "mr" | "ta") => {
    setLanguage(lang);
    router.push("/kiosk/consent");
  };

  const handleQuickDemoStart = () => {
    loadDemoPatient("p-001");
    setLanguage("hi");
    router.push("/kiosk/complaint");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
      <KioskHeader />

      {/* Main Kiosk Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto w-full text-center">
        {/* Hospital Branding Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] text-xs font-semibold mb-6 shadow-xs animate-fade-in">
          <Activity className="w-4 h-4 text-[#059669]" />
          <span>High-Volume Hospital OPD Digital Intake Terminal</span>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight font-heading mb-4">
          Welcome to <span className="text-[#059669]">MediKiosk</span>
        </h1>
        <p className="text-lg sm:text-xl text-[#64748B] max-w-2xl mx-auto mb-10 leading-relaxed">
          Your Digital Clinical Intake Assistant. Prepare your clinical history with voice or touch before you see the doctor.
        </p>

        {/* Primary Language Select Cards */}
        <div className="w-full max-w-2xl mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-[#64748B]">
            <Globe className="w-4 h-4 text-[#059669]" />
            <span>Select Your Preferred Language (भाषा चुनें / भाषा निवडा)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {[
              { code: "hi" as const, native: "हिंदी", english: "Hindi", icon: "🇮🇳" },
              { code: "en" as const, native: "English", english: "English", icon: "🌐" },
              { code: "mr" as const, native: "मराठी", english: "Marathi", icon: "🇮🇳" },
              { code: "ta" as const, native: "தமிழ்", english: "Tamil", icon: "🇮🇳" },
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageSelectAndStart(lang.code)}
                className="group relative flex flex-col items-center justify-center p-5 rounded-2xl bg-white border-2 border-[#E2E8F0] shadow-sm hover:border-[#0F172A] hover:bg-[#F8FAFC] hover:shadow-md active:scale-98 transition-all touch-target cursor-pointer"
              >
                <span className="text-2xl font-bold font-heading text-[#0F172A] group-hover:text-[#059669] transition-colors mb-0.5">
                  {lang.native}
                </span>
                <span className="text-xs font-medium text-[#64748B]">{lang.english}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-8">
          <Button
            variant="kiosk"
            className="w-full text-lg h-14 bg-[#0F172A] hover:bg-[#1E293B] shadow-lg flex items-center justify-center gap-3"
            onClick={() => router.push("/kiosk/language")}
          >
            <span>Start Consultation</span>
            <ArrowRight className="w-5 h-5 text-[#34D399]" />
          </Button>

          {/* Quick Demo Button for Hackathon Evaluators */}
          <Button
            variant="kioskSecondary"
            className="w-full text-base h-14 border-[#059669] text-[#059669] hover:bg-[#ECFDF5] flex items-center justify-center gap-2"
            onClick={handleQuickDemoStart}
          >
            <Sparkles className="w-4 h-4 text-[#059669]" />
            <span>Try Demo Patient (1-Click)</span>
          </Button>
        </div>

        {/* Trust & Accessibility Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full text-left text-xs text-[#64748B]">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#E2E8F0]">
            <Volume2 className="w-5 h-5 text-[#059669] shrink-0" />
            <div>
              <p className="font-semibold text-[#0F172A]">Voice & Audio</p>
              <p>Speak in your regional language</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#E2E8F0]">
            <ShieldCheck className="w-5 h-5 text-[#059669] shrink-0" />
            <div>
              <p className="font-semibold text-[#0F172A]">Private & Secure</p>
              <p>Doctor-verified records only</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#E2E8F0]">
            <HeartHandshake className="w-5 h-5 text-[#059669] shrink-0" />
            <div>
              <p className="font-semibold text-[#0F172A]">Staff Assistance</p>
              <p>Nursing coordinators on stand-by</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation Switcher to Doctor / Admin Portals */}
      <footer className="bg-white border-t border-[#E2E8F0] px-6 py-3 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span className="font-medium text-[#0F172A]">Kiosk Terminal K-001 Online</span>
            <span>• OPD Floor 1</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#94A3B8]">Staff Portals:</span>
            <Link
              href="/doctor/dashboard"
              className="text-xs font-semibold text-[#0F172A] hover:text-[#059669] underline transition-colors"
            >
              Doctor Portal →
            </Link>
            <Link
              href="/admin/dashboard"
              className="text-xs font-semibold text-[#0F172A] hover:text-[#059669] underline transition-colors"
            >
              Admin Dashboard →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
