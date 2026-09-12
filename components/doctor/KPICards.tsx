"use client";

import React from "react";
import { Users, FileCheck, Clock, AlertTriangle, FileText } from "lucide-react";
import { DEMO_DASHBOARD_METRICS } from "@/data/demo/patients";

export function KPICards() {
  const metrics = DEMO_DASHBOARD_METRICS;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Patients */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Total Patients
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#0F172A] flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-[#0F172A] font-heading">
          {metrics.totalPatients}
        </div>
        <p className="text-[11px] text-[#059669] font-medium mt-1">
          ↑ 14% vs yesterday
        </p>
      </div>

      {/* Intakes Today */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Intakes Today
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
            <FileCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-[#059669] font-heading">
          {metrics.intakesToday}
        </div>
        <p className="text-[11px] text-[#64748B] mt-1">
          Avg duration: {metrics.avgIntakeDuration} mins
        </p>
      </div>

      {/* Pending Doctor Reviews */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Pending Review
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-[#D97706] font-heading">
          {metrics.pendingReview}
        </div>
        <p className="text-[11px] text-[#64748B] mt-1">
          In queue for verification
        </p>
      </div>

      {/* Potential Urgent Flags */}
      <div className="bg-white rounded-2xl border-2 border-[#FECACA] p-5 shadow-xs bg-gradient-to-br from-white to-[#FEF2F2]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
            Urgent Alerts
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-[#DC2626] font-heading">
          {metrics.urgentAlerts}
        </div>
        <p className="text-[11px] text-[#DC2626] font-semibold mt-1">
          Prioritize immediate evaluation
        </p>
      </div>
    </div>
  );
}
