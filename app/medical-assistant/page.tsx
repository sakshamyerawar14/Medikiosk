"use client";

import React from "react";
import Link from "next/link";
import { Activity, ArrowLeft, HeartPulse, ShieldAlert, Sparkles } from "lucide-react";
import { MedicalChatBot } from "@/components/chat/MedicalChatBot";

export default function MedicalAssistantPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Top Header */}
      <header className="p-4 sm:p-6 border-b border-[#E2E8F0] bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center text-white">
              <Activity className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <span className="text-xl font-bold font-heading text-[#0F172A]">MediKiosk</span>
              <span className="text-xs text-[#64748B] block">Medical AI Assistant</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/kiosk"
              className="text-xs font-semibold text-[#059669] hover:underline"
            >
              Patient Kiosk →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Full-Height Chat Workspace */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 flex flex-col">
        <div className="flex-1 h-[calc(100vh-180px)] min-h-[550px]">
          <MedicalChatBot />
        </div>
      </main>

      {/* Safety Notice Footer */}
      <footer className="py-3 px-4 text-center text-xs text-[#64748B] bg-white border-t border-[#E2E8F0]">
        MediKiosk AI is an educational informational tool powered by Google Gemini. Always seek the advice of a qualified physician for any medical conditions.
      </footer>
    </div>
  );
}
