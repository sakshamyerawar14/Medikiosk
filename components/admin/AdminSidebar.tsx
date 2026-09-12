"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  Monitor,
  FileQuestion,
  Users,
  Building2,
  BarChart3,
  ShieldCheck,
  Settings,
  LogOut,
  Sliders,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Kiosk Management", href: "/admin/kiosks", icon: Monitor },
    { name: "Interview Templates", href: "/admin/templates", icon: FileQuestion },
    { name: "Doctors & Clinical Staff", href: "/admin/doctors", icon: Users },
    { name: "Departments", href: "/admin/departments", icon: Building2 },
    { name: "OPD Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Audit Trail", href: "/admin/audit-logs", icon: ShieldCheck },
    { name: "System Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0F172A] text-white flex flex-col justify-between shrink-0 min-h-screen p-4 select-none fixed left-0 top-0 bottom-0 z-30">
      <div>
        {/* Logo */}
        <Link href="/admin/dashboard" className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-md">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold font-heading text-white tracking-tight flex items-center gap-1.5">
              MediKiosk
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#2563EB] text-white">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">Hospital Management</p>
          </div>
        </Link>

        {/* Admin User Info */}
        <div className="p-3 rounded-xl bg-[#1E293B] border border-[#334155] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white font-bold flex items-center justify-center text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">Admin Operations</h4>
              <p className="text-[10px] text-[#94A3B8] truncate">OPD IT & Hardware Desk</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] px-3 mb-2 block">
            System Administration
          </span>

          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#2563EB] text-white shadow-sm"
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

      {/* Footer Switcher */}
      <div className="pt-4 border-t border-[#1E293B] space-y-2">
        <Link
          href="/kiosk"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors"
        >
          <Activity className="w-4 h-4 text-[#059669]" />
          <span>Launch Patient Kiosk</span>
        </Link>
        <Link
          href="/doctor/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors"
        >
          <Users className="w-4 h-4 text-[#38BDF8]" />
          <span>Doctor Portal</span>
        </Link>
        <Link
          href="/admin/login"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#EF4444] hover:bg-[#1E293B] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
