"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Encounter } from "@/types";
import { DEMO_ENCOUNTERS } from "@/data/demo/patients";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Eye,
} from "lucide-react";

export function PatientQueueTable() {
  const [encounters, setEncounters] = useState<Encounter[]>(DEMO_ENCOUNTERS);
  const [filter, setFilter] = useState<"all" | "alerts" | "pending">("all");

  const filteredList = encounters.filter((enc) => {
    if (filter === "alerts") return (enc.alertCount || 0) > 0;
    if (filter === "pending") return enc.status === "ready_for_review";
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
      {/* Table Header / Action Filter */}
      <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#0F172A] font-heading">
            Today's OPD Patient Intake Queue
          </h2>
          <p className="text-xs text-[#64748B]">
            Real-time digital intake sessions ready for clinical consultation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "all"
                ? "bg-[#0F172A] text-white"
                : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
            }`}
          >
            All Intakes ({encounters.length})
          </button>
          <button
            onClick={() => setFilter("alerts")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              filter === "alerts"
                ? "bg-[#DC2626] text-white"
                : "bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]"
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            Urgent Flags
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "pending"
                ? "bg-[#059669] text-white"
                : "bg-[#ECFDF5] text-[#059669] hover:bg-[#D1FAE5]"
            }`}
          >
            Pending Review
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase font-bold tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Token</th>
              <th className="py-3.5 px-4">Patient</th>
              <th className="py-3.5 px-4">Chief Complaint</th>
              <th className="py-3.5 px-4">Dept / Lang</th>
              <th className="py-3.5 px-4">Documents</th>
              <th className="py-3.5 px-4">Alert</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filteredList.map((enc) => {
              const hasAlert = (enc.alertCount || 0) > 0;

              return (
                <tr
                  key={enc.id}
                  className={`hover:bg-[#F8FAFC] transition-colors ${
                    hasAlert ? "bg-[#FFF8F8]" : ""
                  }`}
                >
                  {/* Token */}
                  <td className="py-4 px-4 font-mono font-bold text-sm text-[#0F172A]">
                    <span className="px-2 py-1 rounded-md bg-[#F1F5F9] border border-[#CBD5E1]">
                      {enc.token || "A-127"}
                    </span>
                  </td>

                  {/* Patient Name & Age */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-[#0F172A] text-sm">
                      {enc.patient?.fullName}
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      {enc.patient?.age} yrs • {enc.patient?.gender} • {enc.patient?.phone}
                    </div>
                  </td>

                  {/* Chief Complaint */}
                  <td className="py-4 px-4 max-w-xs">
                    <p className="font-medium text-[#0F172A] line-clamp-2">
                      {enc.chiefComplaint}
                    </p>
                  </td>

                  {/* Department & Language */}
                  <td className="py-4 px-4">
                    <span className="font-semibold text-[#0F172A] block">
                      {enc.departmentName}
                    </span>
                    <span className="text-[10px] text-[#64748B] uppercase">
                      Lang: {enc.language}
                    </span>
                  </td>

                  {/* Documents count */}
                  <td className="py-4 px-4">
                    {(enc.documentCount || 0) > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#059669] px-2 py-0.5 rounded bg-[#ECFDF5] border border-[#A7F3D0]">
                        <FileText className="w-3 h-3" />
                        {enc.documentCount} records
                      </span>
                    ) : (
                      <span className="text-[#94A3B8]">—</span>
                    )}
                  </td>

                  {/* Red-Flag Alert */}
                  <td className="py-4 px-4">
                    {hasAlert ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#DC2626] px-2 py-0.5 rounded bg-[#FEF2F2] border border-[#FECACA] animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        Urgent Flag
                      </span>
                    ) : (
                      <span className="text-[#94A3B8] text-[11px]">Normal</span>
                    )}
                  </td>

                  {/* Intake Status */}
                  <td className="py-4 px-4">
                    {enc.status === "verified" ? (
                      <Badge variant="success" className="text-[10px]">
                        Verified
                      </Badge>
                    ) : enc.status === "doctor_review" ? (
                      <Badge variant="info" className="text-[10px]">
                        In Review
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="text-[10px]">
                        Ready for Review
                      </Badge>
                    )}
                  </td>

                  {/* CTA Action */}
                  <td className="py-4 px-4 text-right">
                    <Link href={`/doctor/patients/${enc.patientId}`}>
                      <Button
                        size="sm"
                        className={
                          hasAlert
                            ? "bg-[#DC2626] hover:bg-[#B91C1C] text-white"
                            : "bg-[#0F172A] hover:bg-[#1E293B] text-white"
                        }
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
