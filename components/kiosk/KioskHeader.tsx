"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useKiosk } from "@/lib/store/kiosk-context";
import { Volume2, VolumeX, HelpCircle, Activity, Globe, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function KioskHeader({ title, subtitle }: { title?: string; subtitle?: string }) {
  const { session, isAudioMuted, toggleAudioMute, resetSession } = useKiosk();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [showStaffModal, setShowStaffModal] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const languageLabels: Record<string, string> = {
    en: "English",
    hi: "हिंदी (Hindi)",
    mr: "मराठी (Marathi)",
    ta: "தமிழ் (Tamil)",
    te: "తెలుగు (Telugu)",
    bn: "বাংলা (Bengali)",
  };

  return (
    <>
      <header className="bg-white border-b border-[#E2E8F0] px-6 py-4 sticky top-0 z-30 shadow-sm select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Platform Info */}
          <Link href="/kiosk" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-[#0F172A] flex items-center justify-center text-white shadow-md group-hover:bg-[#1E293B] transition-colors">
              <Activity className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-heading text-[#0F172A] tracking-tight">
                  MediKiosk
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                  AI INTAKE
                </span>
              </div>
              <p className="text-xs text-[#64748B] font-medium">Digital Clinical Assistant</p>
            </div>
          </Link>

          {/* Title in center if provided */}
          {title && (
            <div className="hidden md:block text-center">
              <h1 className="text-base font-semibold text-[#0F172A] font-heading">{title}</h1>
              {subtitle && <p className="text-xs text-[#64748B]">{subtitle}</p>}
            </div>
          )}

          {/* Right Action Bar: Language Indicator, Audio, Staff Assistance, Time */}
          <div className="flex items-center gap-3">
            {/* Active Language Badge */}
            <Link
              href="/kiosk/language"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#059669]" />
              <span>{languageLabels[session.language] || "English"}</span>
            </Link>

            {/* Audio Guidance Toggle */}
            <button
              onClick={toggleAudioMute}
              className={`p-2.5 rounded-lg border transition-all ${
                isAudioMuted
                  ? "bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]"
                  : "bg-[#ECFDF5] border-[#A7F3D0] text-[#059669] hover:bg-[#D1FAE5]"
              }`}
              title={isAudioMuted ? "Audio Muted — Tap to Unmute" : "Audio Guide Active — Tap to Mute"}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Staff Assistance Button */}
            <button
              onClick={() => setShowStaffModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-xs font-semibold text-[#92400E] hover:bg-[#FDE68A] transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-[#D97706]" />
              <span className="hidden sm:inline">Staff Help</span>
            </button>

            {/* Live Clock & Restart Option */}
            <div className="hidden lg:flex flex-col items-end pl-2 border-l border-[#E2E8F0] text-right">
              <span className="text-xs font-mono font-semibold text-[#0F172A]">{currentTime}</span>
              <button
                onClick={resetSession}
                className="text-[11px] text-[#64748B] hover:text-[#EF4444] transition-colors underline"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Staff Assistance Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0]">
            <div className="w-12 h-12 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mb-4 mx-auto">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-center text-[#0F172A] font-heading mb-2">
              Hospital Staff Assistance
            </h3>
            <p className="text-sm text-[#64748B] text-center mb-6">
              A kiosk coordinator or nursing staff member is available to help you complete your intake.
            </p>
            <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] mb-6 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Kiosk Terminal:</span>
                <span className="font-semibold text-[#0F172A]">K-001 (Ground Floor OPD)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Staff Coordinator:</span>
                <span className="font-semibold text-[#0F172A]">Sister Preeti / Desk 4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Emergency Code:</span>
                <span className="font-semibold text-[#DC2626]">Priority Intake Support</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowStaffModal(false)}
              >
                Dismiss
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-[#0F172A]"
                onClick={() => {
                  alert("Kiosk coordinator has been notified.");
                  setShowStaffModal(false);
                }}
              >
                Call Coordinator
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
