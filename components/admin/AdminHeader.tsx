"use client";

import React from "react";
import { Activity, ShieldCheck, Server, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AdminHeader({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <header className="bg-white border-b border-[#E2E8F0] px-8 py-4 sticky top-0 z-20 shadow-xs flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-[#0F172A] font-heading">
          {title || "MediKiosk Administration"}
        </h1>
        {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* System Health Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-xs font-semibold text-[#047857]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span>System Healthy • All Microservices Online</span>
        </div>

        <div className="hidden lg:flex flex-col text-right pl-3 border-l border-[#E2E8F0]">
          <span className="text-xs font-bold text-[#0F172A]">Kiosk Network</span>
          <span className="text-[11px] text-[#64748B]">10 of 12 Terminals Active</span>
        </div>
      </div>
    </header>
  );
}
