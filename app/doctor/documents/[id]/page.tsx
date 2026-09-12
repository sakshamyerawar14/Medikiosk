"use client";

import React from "react";
import { useParams } from "next/navigation";
import { DoctorSidebar } from "@/components/doctor/DoctorSidebar";
import { DoctorHeader } from "@/components/doctor/DoctorHeader";
import { DocumentSplitViewer } from "@/components/doctor/DocumentSplitViewer";

export default function DoctorDocumentsPage() {
  const params = useParams();
  const patientId = (params?.id as string) || "p-001";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <DoctorSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <DoctorHeader
          title="Document Intelligence & OCR Verification"
          subtitle="Optical entity extraction and validation"
        />
        <main className="p-8">
          <DocumentSplitViewer patientId={patientId} />
        </main>
      </div>
    </div>
  );
}
