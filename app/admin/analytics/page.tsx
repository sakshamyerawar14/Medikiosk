"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { DEMO_DASHBOARD_METRICS } from "@/data/demo/patients";
import { Globe, Clock, FileText, CheckCircle2 } from "lucide-react";

export default function AdminAnalyticsPage() {
  const metrics = DEMO_DASHBOARD_METRICS;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader
          title="Hospital OPD Intake Analytics"
          subtitle="Longitudinal performance metrics, language adoption, and throughput statistics"
        />

        <main className="p-8 space-y-6">
          <AnalyticsCharts />

          {/* Language & Throughput Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Language Distribution */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-[#059669]" />
                <h3 className="text-base font-bold text-[#0F172A] font-heading">
                  Language Adoption Distribution
                </h3>
              </div>

              <div className="space-y-3">
                {metrics.languageDistribution.map((l) => {
                  const total = metrics.intakesToday;
                  const pct = Math.round((l.count / total) * 100);
                  const names: Record<string, string> = {
                    hi: "Hindi (हिंदी)",
                    en: "English",
                    mr: "Marathi (मराठी)",
                    ta: "Tamil (தமிழ்)",
                  };

                  return (
                    <div key={l.language}>
                      <div className="flex justify-between text-xs font-semibold text-[#0F172A] mb-1">
                        <span>{names[l.language] || l.language}</span>
                        <span>{l.count} intakes ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                        <div
                          className="h-full bg-[#059669] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance KPIs */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-[#2563EB]" />
                <h3 className="text-base font-bold text-[#0F172A] font-heading">
                  Operational Intake Efficiency
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-xs text-[#64748B] block">Average Intake Time</span>
                  <span className="text-2xl font-bold text-[#0F172A]">4.2 mins</span>
                  <p className="text-[11px] text-[#059669] mt-0.5">↓ 68% faster than paper</p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-xs text-[#64748B] block">Doctor Consultation Saved</span>
                  <span className="text-2xl font-bold text-[#059669]">~3.5 mins</span>
                  <p className="text-[11px] text-[#64748B] mt-0.5">per patient consult</p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-xs text-[#64748B] block">OCR Extraction Accuracy</span>
                  <span className="text-2xl font-bold text-[#0F172A]">94.8%</span>
                  <p className="text-[11px] text-[#64748B] mt-0.5">Clinical entity accuracy</p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-xs text-[#64748B] block">Red-Flag Escalation Speed</span>
                  <span className="text-2xl font-bold text-[#DC2626]">&lt; 15 sec</span>
                  <p className="text-[11px] text-[#64748B] mt-0.5">Kiosk to OPD alert</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
