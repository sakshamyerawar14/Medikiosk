"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AuditLogTable } from "@/components/admin/AuditLogTable";

export default function AdminAuditLogsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader
          title="Clinical & System Audit Trail"
          subtitle="HIPAA and EHR compliance access logs and tamper-evident event records"
        />
        <main className="p-8">
          <AuditLogTable />
        </main>
      </div>
    </div>
  );
}
