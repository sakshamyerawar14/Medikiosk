"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TemplateManagementTable } from "@/components/admin/TemplateManagementTable";

export default function AdminTemplatesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader
          title="Clinical Interview Questionnaires"
          subtitle="Department protocols, AYUSH questions, and branching rules"
        />
        <main className="p-8">
          <TemplateManagementTable />
        </main>
      </div>
    </div>
  );
}
