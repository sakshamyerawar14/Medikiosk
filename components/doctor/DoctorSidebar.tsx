"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  Users,
  AlertTriangle,
  FileText,
  Clock,
  Settings,
  LogOut,
  Sparkles,
  Stethoscope,
} from "lucide-react";

export function DoctorSidebar() {
  const pathname = usePathname();

  const navLinks = [
    {
      name: "Dashboard",
      href: "/doctor/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Patient Queue",
      href: "/doctor/dashboard#queue",
      icon: Users,
    },
    {
      name: "Clinical Workspace",
      href: "/doctor/patients/p-001",
      icon: Stethoscope,
    },
    {
      name: "Document Intelligence",
      href: "/doctor/documents/p-001",
      icon: FileText,
    },
    {
      name: "Medical Timeline",
      href: "/doctor/timeline/p-001",
      icon: Clock,
    },
  ];

  return (
    <aside className="w-64 bg-[#0F172A] text-white flex flex-col justify-between shrink-0 min-h-screen p-4 select-none fixed left-0 top-0 bottom-0 z-30">
      <div>
        {/* Hospital & MediKiosk Logo */}
        <Link href="/doctor/dashboard" className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#059669] flex items-center justify-center text-white shadow-md">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold font-heading text-white tracking-tight flex items-center gap-1.5">
              MediKiosk
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#059669] text-white">
                MD
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">Doctor Clinical Portal</p>
          </div>
        </Link>

        {/* Doctor Profile Banner */}
        <div className="p-3 rounded-xl bg-[#1E293B] border border-[#334155] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#059669] text-white font-bold flex items-center justify-center text-xs">
              VS
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">Dr. Vikram Seth</h4>
              <p className="text-[10px] text-[#94A3B8] truncate">Cardiology OPD • Room 104</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] px-3 mb-2 block">
            Clinical Navigation
          </span>

          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href.includes("patients") && pathname.includes("patients"));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#059669] text-white shadow-sm"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#1E293B]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Switch to Kiosk or Admin */}
      <div className="pt-4 border-t border-[#1E293B] space-y-2">
        <Link
          href="/kiosk"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors"
        >
          <Activity className="w-4 h-4 text-[#059669]" />
          <span>Launch Patient Kiosk</span>
        </Link>
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors"
        >
          <Settings className="w-4 h-4 text-[#38BDF8]" />
          <span>Admin Portal</span>
        </Link>
        <Link
          href="/doctor/login"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#EF4444] hover:bg-[#1E293B] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
