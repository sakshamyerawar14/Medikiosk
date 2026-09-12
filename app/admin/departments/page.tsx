"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DEMO_DEPARTMENTS } from "@/data/demo/patients";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Edit2, Stethoscope, Leaf } from "lucide-react";

export default function AdminDepartmentsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader
          title="Hospital Departments & Clinical Modules"
          subtitle="Allopathy, AYUSH, Emergency, and Diagnostic departments"
        />

        <main className="p-8">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#0F172A] font-heading">
                  Configured OPD Departments
                </h2>
                <p className="text-xs text-[#64748B]">
                  Link clinical interview questionnaires and triage rules to OPD blocks
                </p>
              </div>

              <Button size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
                <Plus className="w-4 h-4 mr-1" /> Add Department
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Department Name</th>
                    <th className="py-3.5 px-4">Clinical Type</th>
                    <th className="py-3.5 px-4">Active Question Template</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {DEMO_DEPARTMENTS.map((dept) => (
                    <tr key={dept.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-4 px-4 font-bold text-sm text-[#0F172A]">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#2563EB]" />
                          <span>{dept.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={dept.type === "ayush" ? "success" : "secondary"}
                          className="text-[10px] uppercase font-bold"
                        >
                          {dept.type}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 font-mono text-[#64748B]">
                        {dept.questionTemplate}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="success" className="text-[10px]">
                          Active
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 text-xs text-[#2563EB]">
                          <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
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
