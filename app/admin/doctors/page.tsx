"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DEMO_DOCTORS } from "@/data/demo/patients";
import { UserProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Plus, Mail, CheckCircle2, User } from "lucide-react";

export default function AdminDoctorsPage() {
  const [doctors] = useState<UserProfile[]>(DEMO_DOCTORS);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader
          title="Hospital Clinicians & OPD Physicians"
          subtitle="Manage attending physicians, AYUSH practitioners, and triage staff"
        />

        <main className="p-8">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#0F172A] font-heading">
                  Active Clinical Staff Directory
                </h2>
                <p className="text-xs text-[#64748B]">
                  Clinicians authorized to review and verify digital intake drafts
                </p>
              </div>

              <Button size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
                <Plus className="w-4 h-4 mr-1" /> Add Clinician
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Doctor Name</th>
                    <th className="py-3.5 px-4">Hospital Email</th>
                    <th className="py-3.5 px-4">Assigned Department</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {doctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-4 px-4 font-bold text-sm text-[#0F172A]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold text-xs">
                            {doc.fullName[0]}
                          </div>
                          <span>{doc.fullName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-[#64748B]">{doc.email}</td>
                      <td className="py-4 px-4 font-semibold text-[#0F172A]">
                        {doc.departmentName}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {doc.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="success" className="text-[10px]">
                          ● Active On Duty
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
