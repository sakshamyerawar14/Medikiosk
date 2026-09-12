"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminKPICards } from "@/components/admin/AdminKPICards";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { KioskManagementTable } from "@/components/admin/KioskManagementTable";
import { TemplateManagementTable } from "@/components/admin/TemplateManagementTable";
import { AuditLogTable } from "@/components/admin/AuditLogTable";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader
          title="Hospital OPD Operations & Telemetry"
          subtitle="Real-time kiosk network analytics and clinical questionnaire governance"
        />

        <main className="p-8 space-y-6">
          {/* Key KPI Metrics */}
          <AdminKPICards />

          {/* Graphical Analytics */}
          <AnalyticsCharts />

          {/* Kiosks Table */}
          <KioskManagementTable />

          {/* Questionnaire Templates */}
          <TemplateManagementTable />

          {/* Audit Logs */}
          <AuditLogTable />
        </main>
      </div>
    </div>
  );
}
