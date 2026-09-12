"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { KioskManagementTable } from "@/components/admin/KioskManagementTable";

export default function AdminKiosksPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader title="Kiosk Terminal Fleet" subtitle="Terminal status, locations, and device telemetry" />
        <main className="p-8">
          <KioskManagementTable />
        </main>
      </div>
    </div>
  );
}
