"use client";

import React from "react";
import { useParams } from "next/navigation";
import { DoctorSidebar } from "@/components/doctor/DoctorSidebar";
import { DoctorHeader } from "@/components/doctor/DoctorHeader";
import { MedicalTimelineView } from "@/components/doctor/MedicalTimelineView";

export default function DoctorTimelinePage() {
  const params = useParams();
  const patientId = (params?.id as string) || "p-001";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <DoctorSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <DoctorHeader
          title="Patient Longitudinal Medical Timeline"
          subtitle="Cross-encounter chronological progression"
        />
        <main className="p-8">
          <MedicalTimelineView encounterId="enc-001" />
        </main>
      </div>
    </div>
  );
}
