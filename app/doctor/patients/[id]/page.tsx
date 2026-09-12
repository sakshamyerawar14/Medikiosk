"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DoctorSidebar } from "@/components/doctor/DoctorSidebar";
import { DoctorHeader } from "@/components/doctor/DoctorHeader";
import { ClinicalSummaryViewer } from "@/components/doctor/ClinicalSummaryViewer";
import { DocumentSplitViewer } from "@/components/doctor/DocumentSplitViewer";
import { MedicalTimelineView } from "@/components/doctor/MedicalTimelineView";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DEMO_PATIENTS, DEMO_ENCOUNTERS, DEMO_AUDIT_LOGS } from "@/data/demo/patients";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Phone,
  Calendar,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Activity,
  Printer,
} from "lucide-react";

export default function DoctorPatientWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = (params?.id as string) || "p-001";

  const patient = DEMO_PATIENTS.find((p) => p.id === patientId) || DEMO_PATIENTS[0];
  const encounter = DEMO_ENCOUNTERS.find((e) => e.patientId === patient.id) || DEMO_ENCOUNTERS[0];

  const [activeTab, setActiveTab] = useState("summary");
  const [isVerified, setIsVerified] = useState(encounter.status === "verified");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <DoctorSidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <DoctorHeader
          title={`Patient Workspace: ${patient.fullName}`}
          subtitle={`Token ${encounter.token || "A-127"} • Cardiology Intake Consultation`}
        />

        <main className="p-8 space-y-6">
          {/* Back to Queue & Patient Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
              onClick={() => router.push("/doctor/dashboard")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Patient Queue</span>
            </button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-9 bg-white"
                onClick={() => window.print()}
              >
                <Printer className="w-3.5 h-3.5 mr-1" />
                Print Clinical Summary
              </Button>
            </div>
          </div>

          {/* Patient Profile Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Left Profile Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center text-xl font-bold font-heading shadow-md">
                  {patient.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-bold text-[#0F172A] font-heading">
                      {patient.fullName}
                    </h2>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A]">
                      Token: {encounter.token || "A-127"}
                    </span>
                    {(encounter.alertCount || 0) > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#DC2626] px-2 py-0.5 rounded-full bg-[#FEF2F2] border border-[#FECACA]">
                        <AlertTriangle className="w-3 h-3" />
                        Urgent Flag
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] mt-1.5">
                    <span>Age: <strong>{patient.age} yrs</strong></span>
                    <span>•</span>
                    <span>Gender: <strong>{patient.gender}</strong></span>
                    <span>•</span>
                    <span>Phone: <strong>{patient.phone}</strong></span>
                    <span>•</span>
                    <span>ABHA ID: <strong className="font-mono">{patient.abhaReference}</strong></span>
                  </div>
                </div>
              </div>

              {/* Status and Action Badge */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                    Intake Status
                  </span>
                  <Badge variant={isVerified ? "success" : "warning"} className="text-xs font-bold mt-0.5">
                    {isVerified ? "Clinician Verified ✓" : "Ready for Doctor Review"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Workspace Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white border border-[#E2E8F0] p-1.5 rounded-xl h-13 shadow-xs">
              <TabsTrigger value="summary" className="text-xs font-bold px-5 h-10 gap-2">
                <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                AI Clinical Summary
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs font-bold px-5 h-10 gap-2">
                <Activity className="w-4 h-4 text-[#059669]" />
                Original Answers
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-xs font-bold px-5 h-10 gap-2">
                <FileText className="w-4 h-4 text-[#0284C7]" />
                Documents & OCR ({encounter.documentCount || 2})
              </TabsTrigger>
              <TabsTrigger value="timeline" className="text-xs font-bold px-5 h-10 gap-2">
                <Clock className="w-4 h-4 text-[#D97706]" />
                Medical Timeline
              </TabsTrigger>
              <TabsTrigger value="audit" className="text-xs font-bold px-5 h-10 gap-2">
                <ShieldCheck className="w-4 h-4 text-[#64748B]" />
                Audit Trail
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: AI Clinical Summary */}
            <TabsContent value="summary" className="mt-6">
              <ClinicalSummaryViewer
                encounterId={encounter.id}
                onVerifySuccess={() => setIsVerified(true)}
              />
            </TabsContent>

            {/* Tab 2: Original Patient Answers */}
            <TabsContent value="history" className="mt-6">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
                <div className="border-b border-[#E2E8F0] pb-4">
                  <h3 className="text-base font-bold text-[#0F172A] font-heading">
                    Original Patient Interview Log (Raw Intake)
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Verbatim patient statements captured via touch selection and regional voice recognition
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      concept: "Chief Complaint",
                      question: "What brings you to the hospital today?",
                      answer: "Mujhe kal se seene mein bhari pan aur dard ho raha hai.",
                      source: "voice (Hindi ASR)",
                      time: "08:32 AM",
                    },
                    {
                      concept: "Symptom Onset",
                      question: "When did your symptoms start?",
                      answer: "Yesterday / 2 days ago (< 48 hours)",
                      source: "touch",
                      time: "08:34 AM",
                    },
                    {
                      concept: "Pain Character",
                      question: "What type of sensation or pain are you feeling?",
                      answer: "Heavy pressure / Tightness (Substernal)",
                      source: "touch (Red-Flag Flagged)",
                      time: "08:35 AM",
                    },
                    {
                      concept: "Associated Symptoms",
                      question: "Any shortness of breath or sweating?",
                      answer: "Mild shortness of breath on exertion",
                      source: "voice (Hindi ASR)",
                      time: "08:36 AM",
                    },
                    {
                      concept: "Past Medical Conditions",
                      question: "Do you have any existing chronic illnesses?",
                      answer: "High Blood Pressure (Hypertension since 2024)",
                      source: "touch",
                      time: "08:37 AM",
                    },
                    {
                      concept: "Known Allergies",
                      question: "Any known drug allergies?",
                      answer: "Sulfa drugs (Skin rash reaction)",
                      source: "touch",
                      time: "08:38 AM",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#059669] uppercase tracking-wider">
                          {item.concept}
                        </span>
                        <span className="text-[#94A3B8] font-mono">
                          {item.source} • {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mb-1">Q: {item.question}</p>
                      <p className="text-sm font-semibold text-[#0F172A] italic">
                        "{item.answer}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Documents & OCR Extraction */}
            <TabsContent value="documents" className="mt-6">
              <DocumentSplitViewer patientId={patient.id} />
            </TabsContent>

            {/* Tab 4: Longitudinal Timeline */}
            <TabsContent value="timeline" className="mt-6">
              <MedicalTimelineView encounterId={encounter.id} />
            </TabsContent>

            {/* Tab 5: Immutable Audit Trail */}
            <TabsContent value="audit" className="mt-6">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
                <h3 className="text-base font-bold text-[#0F172A] font-heading mb-4">
                  Clinical Intake Audit History
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B]">
                      <tr>
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Actor</th>
                        <th className="py-2.5 px-3">Action</th>
                        <th className="py-2.5 px-3">Resource</th>
                        <th className="py-2.5 px-3">Metadata</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {DEMO_AUDIT_LOGS.map((log) => (
                        <tr key={log.id} className="hover:bg-[#F8FAFC]">
                          <td className="py-3 px-3 font-mono text-[#64748B]">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </td>
                          <td className="py-3 px-3 font-bold text-[#0F172A]">{log.actorName}</td>
                          <td className="py-3 px-3 text-[#059669] font-medium">{log.action}</td>
                          <td className="py-3 px-3 text-[#64748B]">{log.resourceType}</td>
                          <td className="py-3 px-3 font-mono text-[11px] text-[#94A3B8]">
                            {JSON.stringify(log.metadata)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
