"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  Stethoscope,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  Mic,
  FileText,
  HeartPulse,
  Users,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEMO_PATIENTS } from "@/data/demo/patients";

export default function LandingPortalPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
      {/* Top Hospital Navigation Bar */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#0F172A] flex items-center justify-center text-white shadow-md">
              <Activity className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-heading text-[#0F172A] tracking-tight">
                  MediKiosk
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                  AI CLINICAL INTAKE
                </span>
              </div>
              <p className="text-xs text-[#64748B]">Digital Intake Platform for High-Volume OPDs</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/doctor/login">
              <Button variant="outline" size="sm" className="h-9 text-xs">
                Doctor Login
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button variant="secondary" size="sm" className="h-9 text-xs">
                Admin Console
              </Button>
            </Link>
            <Link href="/kiosk">
              <Button size="sm" className="h-9 text-xs bg-[#059669] hover:bg-[#047857] text-white">
                Launch Kiosk →
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] text-xs font-bold mb-4">
            <Sparkles className="w-4 h-4 text-[#059669]" />
            <span>AI Prepares. Doctor Decides.</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] font-heading tracking-tight mb-4">
            Transforming the First Mile of <span className="text-[#059669]">Hospital Clinical Care</span>
          </h1>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed mb-6">
            An accessible, multilingual clinical history and document intake terminal built for high-throughput OPDs. Patients speak or touch their symptoms; AI extracts records; physicians review concise, verified summaries.
          </p>
        </div>

        {/* 3 Main Experience Portals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Patient Kiosk Experience */}
          <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] hover:border-[#059669] p-8 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-[#0F172A] font-heading">
                  1. Patient Kiosk
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669]">
                  Touch + Voice
                </span>
              </div>
              <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
                Step-by-step accessible intake for patients with Hindi/Marathi/Tamil voice recognition, document OCR scanning, and red-flag urgent triage alerts.
              </p>
              <ul className="text-xs text-[#334155] space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" /> Large accessible touch targets
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" /> Multilingual speech & audio guidance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" /> Prescription & lab report OCR scan
                </li>
              </ul>
            </div>

            <Link href="/kiosk" className="w-full">
              <Button className="w-full h-12 text-sm font-bold bg-[#059669] hover:bg-[#047857] text-white shadow-md">
                <span>Start Patient Kiosk Flow</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Card 2: Doctor Clinical Portal */}
          <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] hover:border-[#0F172A] p-8 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] text-[#0F172A] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-[#0F172A] font-heading">
                  2. Doctor Portal
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F1F5F9] text-[#0F172A]">
                  Physician MD
                </span>
              </div>
              <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
                Information-dense clinical dashboard. Review live queues, inspect AI drafts with confidence scores, verify OCR extractions, and edit before final lock.
              </p>
              <ul className="text-xs text-[#334155] space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" /> AI Draft with source citations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" /> Split document & entity inspector
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" /> Longitudinal patient timeline
                </li>
              </ul>
            </div>

            <Link href="/doctor/dashboard" className="w-full">
              <Button className="w-full h-12 text-sm font-bold bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-md">
                <span>Open Doctor Workspace</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Card 3: Admin Management Console */}
          <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] hover:border-[#2563EB] p-8 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sliders className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-[#0F172A] font-heading">
                  3. Admin Console
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB]">
                  Operations
                </span>
              </div>
              <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
                Hospital OPD operations command center. Monitor kiosk telemetry, author specialty interview questionnaires (including AYUSH), and audit trail.
              </p>
              <ul className="text-xs text-[#334155] space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" /> Kiosk fleet telemetry & reboot
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" /> Questionnaire template management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" /> Real-time intake throughput charts
                </li>
              </ul>
            </div>

            <Link href="/admin/dashboard" className="w-full">
              <Button className="w-full h-12 text-sm font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md">
                <span>Launch Admin Console</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Medical AI Assistant Banner */}
        <div className="mb-12 rounded-3xl border-2 border-[#A7F3D0] bg-gradient-to-r from-[#ECFDF5] to-[#F0FDF4] p-8 shadow-sm hover:shadow-lg transition-all group">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#059669] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md">
                <HeartPulse className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-[#0F172A] font-heading">
                    Medical AI Assistant
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#059669] text-white">
                    <Sparkles className="w-3 h-3" />
                    Powered by Gemini
                  </span>
                </div>
                <p className="text-sm text-[#064E3B] leading-relaxed max-w-xl">
                  Ask health questions, understand symptoms, decode medical terms, and prepare for your doctor visit — all in plain language. Available 24/7 for educational health guidance.
                </p>
                <p className="text-xs text-[#059669] font-semibold mt-2 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Educational information only — not a substitute for professional medical advice
                </p>
              </div>
            </div>
            <Link href="/medical-assistant" className="shrink-0">
              <Button className="h-12 px-6 text-sm font-bold bg-[#059669] hover:bg-[#047857] text-white shadow-md whitespace-nowrap">
                <span>Open AI Assistant</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 1-Click Synthetic Demo Patients fast-track for Evaluators */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white rounded-3xl p-8 mb-12 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-[#34D399]" />
                <h3 className="text-xl font-bold font-heading text-white">
                  Fast-Track Hackathon Evaluation Cases
                </h3>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Select a synthetic patient to jump directly into the full intake and doctor verification pipeline:
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase px-3 py-1 rounded-full bg-white/10 text-[#34D399] border border-white/20">
              SYNTHETIC DATA • ZERO PII
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {DEMO_PATIENTS.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                href={`/doctor/patients/${p.id}`}
                className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all text-left group"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white group-hover:text-[#34D399] transition-colors">
                    {p.fullName}
                  </span>
                  <span className="font-mono text-[11px] text-[#94A3B8]">
                    {p.id === "p-001" ? "Token A-127" : p.id === "p-002" ? "Token B-042" : "Token C-109"}
                  </span>
                </div>
                <p className="text-xs text-[#CBD5E1] mb-2">
                  {p.age} yrs • {p.gender} • {p.id === "p-001" ? "Cardiology" : p.id === "p-002" ? "General Med" : "Orthopedics"}
                </p>
                <span className="text-[11px] text-[#34D399] font-semibold flex items-center gap-1">
                  Inspect in Doctor Workspace →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] px-6 py-6 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#059669]" />
            <span className="font-bold text-[#0F172A]">MediKiosk Clinical Intake System</span>
            <span>• Verified for High-Volume OPD Deployments</span>
          </div>
          <div className="flex items-center gap-6 text-[#64748B]">
            <span>Privacy-First Architecture</span>
            <span>•</span>
            <span>ABDM / FHIR Ready</span>
            <span>•</span>
            <span>AYUSH Compatible</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
