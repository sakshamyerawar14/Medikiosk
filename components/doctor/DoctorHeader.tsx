"use client";

import React from "react";
import { Search, Bell, Clock, Sparkles, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export function DoctorHeader({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <header className="bg-white border-b border-[#E2E8F0] px-8 py-4 sticky top-0 z-20 shadow-xs flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-[#0F172A] font-heading">
          {title || "Doctor Clinical Dashboard"}
        </h1>
        {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-64 hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <Input
            type="text"
            placeholder="Search patient, token, ABHA..."
            className="pl-9 h-9 text-xs bg-[#F8FAFC]"
          />
        </div>

        {/* Urgent Notification Bell */}
        <button
          className="relative p-2 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
          title="1 Active Red-Flag Urgent Alert"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            1
          </span>
        </button>

        {/* Live Date / Shift */}
        <div className="hidden lg:flex flex-col text-right pl-3 border-l border-[#E2E8F0]">
          <span className="text-xs font-bold text-[#0F172A]">Morning OPD Shift</span>
          <span className="text-[11px] text-[#64748B]">Room 104 • 08:00 - 14:00</span>
        </div>
      </div>
    </header>
  );
}
