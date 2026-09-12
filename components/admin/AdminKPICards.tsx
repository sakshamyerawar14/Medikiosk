"use client";

import React from "react";
import { Monitor, Users, Stethoscope, FileCheck, Activity } from "lucide-react";
import { DEMO_ADMIN_METRICS } from "@/data/demo/patients";

export function AdminKPICards() {
  const metrics = DEMO_ADMIN_METRICS;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Kiosks */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Total Kiosks
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <Monitor className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-[#0F172A] font-heading">
          {metrics.totalKiosks}
        </div>
        <p className="text-[11px] text-[#059669] font-medium mt-1">
          {metrics.activeKiosks} active & online
        </p>
      </div>

      {/* Patients Intake Volume */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Cumulative Patients
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-[#059669] font-heading">
          {metrics.totalPatients.toLocaleString()}
        </div>
        <p className="text-[11px] text-[#64748B] mt-1">
          Across all OPD specialty blocks
        </p>
      </div>

      {/* Active Doctors */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Hospital Clinicians
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center">
            <Stethoscope className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-[#7C3AED] font-heading">
          {metrics.totalDoctors}
        </div>
        <p className="text-[11px] text-[#64748B] mt-1">
          Allopathy & AYUSH staff
        </p>
      </div>

      {/* Intakes Processed */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Total Intakes
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
            <FileCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-[#D97706] font-heading">
          {metrics.totalIntakes.toLocaleString()}
        </div>
        <p className="text-[11px] text-[#059669] font-medium mt-1">
          97.5% completion rate
        </p>
      </div>
    </div>
  );
}
