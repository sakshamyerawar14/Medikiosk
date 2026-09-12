"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sliders,
  ShieldCheck,
  Sparkles,
  Server,
  Save,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [demoMode, setDemoMode] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader
          title="MediKiosk Platform Configuration"
          subtitle="AI engines, ABDM/FHIR interoperability boundaries, and kiosk security policies"
        />

        <main className="p-8 max-w-4xl space-y-6">
          {saved && (
            <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-5 h-5" />
              <span>Platform settings saved successfully.</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Setting Group 1: Demo / Production Mode */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] font-heading">
                    Hackathon Evaluation & Demo Mode
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Enable deterministic simulated responses, synthetic patient profiles, and offline demo fallback
                  </p>
                </div>
                <Badge variant={demoMode ? "success" : "secondary"}>
                  {demoMode ? "Demo Mode Active" : "Live API Mode"}
                </Badge>
              </div>

              <label className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer">
                <div>
                  <span className="text-sm font-bold text-[#0F172A] block">
                    Use Synthetic Demo Patient Data
                  </span>
                  <span className="text-xs text-[#64748B]">
                    Never uses real patient PII during demonstrations
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={demoMode}
                  onChange={(e) => setDemoMode(e.target.checked)}
                  className="w-5 h-5 accent-[#059669]"
                />
              </label>
            </div>

            {/* Setting Group 2: AI & OCR Adapter Services */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#0F172A] font-heading">
                AI & Speech Microservice Adapters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[#64748B] mb-1 uppercase">
                    LLM Clinical Summary Engine
                  </label>
                  <Input defaultValue="Server-side LLM Gateway (Gemini 2.5 Pro / Flash)" className="h-10" readOnly />
                </div>
                <div>
                  <label className="block font-bold text-[#64748B] mb-1 uppercase">
                    Speech-to-Text Provider
                  </label>
                  <Input defaultValue="Bhashini / AI4Bharat Multilingual ASR Adapter" className="h-10" readOnly />
                </div>
                <div>
                  <label className="block font-bold text-[#64748B] mb-1 uppercase">
                    Optical Character Recognition (OCR)
                  </label>
                  <Input defaultValue="Healthcare Optical Entity Pipeline v2" className="h-10" readOnly />
                </div>
                <div>
                  <label className="block font-bold text-[#64748B] mb-1 uppercase">
                    ABDM / FHIR Resource Mapper
                  </label>
                  <Input defaultValue="FHIR R4 DiagnosticReport / Observation Adapter" className="h-10" readOnly />
                </div>
              </div>
            </div>

            {/* Setting Group 3: Kiosk Timeout & Security */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#0F172A] font-heading">
                Kiosk Privacy & Session Lifecycle
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[#64748B] mb-1 uppercase">
                    Inactive Session Timeout (Seconds)
                  </label>
                  <Input defaultValue="90" className="h-10 font-mono" />
                </div>
                <div>
                  <label className="block font-bold text-[#64748B] mb-1 uppercase">
                    Temporary PII Memory Wipe Policy
                  </label>
                  <Input defaultValue="Immediate on ticket generation" className="h-10" readOnly />
                </div>
              </div>
            </div>

            <Button type="submit" className="bg-[#0F172A] text-white px-8 h-11 font-semibold">
              <Save className="w-4 h-4 mr-2" /> Save Configuration
            </Button>
          </form>
        </main>
      </div>
    </div>
  );
}
