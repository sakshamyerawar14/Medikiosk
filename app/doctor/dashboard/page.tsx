"use client";

import React from "react";
import { DoctorSidebar } from "@/components/doctor/DoctorSidebar";
import { DoctorHeader } from "@/components/doctor/DoctorHeader";
import { KPICards } from "@/components/doctor/KPICards";
import { PatientQueueTable } from "@/components/doctor/PatientQueueTable";

export default function DoctorDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Left Navigation Sidebar */}
      <DoctorSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <DoctorHeader
          title="Clinical OPD Queue"
          subtitle="Dr. Vikram Seth • Room 104 (Cardiology & Internal Medicine)"
        />

        <main className="p-8 space-y-6">
          {/* Key Metric KPI Cards */}
          <KPICards />

          {/* Patient Queue Table */}
          <div id="queue">
            <PatientQueueTable />
          </div>
        </main>
      </div>
    </div>
  );
}
