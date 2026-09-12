"use client";

import React, { useState } from "react";
import { InterviewTemplate } from "@/types";
import { DEMO_TEMPLATES } from "@/data/demo/patients";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileQuestion, Plus, Edit2, Check, Sparkles } from "lucide-react";

export function TemplateManagementTable() {
  const [templates, setTemplates] = useState<InterviewTemplate[]>(DEMO_TEMPLATES);

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#0F172A] font-heading">
            AI Clinical Interview Questionnaires
          </h2>
          <p className="text-xs text-[#64748B]">
            Configure adaptive question branching and specialty intake protocols
          </p>
        </div>

        <Button
          size="sm"
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
          onClick={() => alert("Creating a new questionnaire template.")}
        >
          <Plus className="w-4 h-4 mr-1" /> New Template
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase font-bold tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Template Name</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Language</th>
              <th className="py-3.5 px-4">Questions</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {templates.map((tpl) => (
              <tr key={tpl.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="py-4 px-4 font-bold text-sm text-[#0F172A]">
                  <div className="flex items-center gap-2">
                    <FileQuestion className="w-4 h-4 text-[#7C3AED]" />
                    <span>{tpl.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold text-[#0F172A] capitalize">
                  {tpl.department.replace("_", " ")}
                </td>
                <td className="py-4 px-4 uppercase font-mono text-[#64748B]">{tpl.language}</td>
                <td className="py-4 px-4 font-bold text-[#0F172A]">{tpl.questionCount} steps</td>
                <td className="py-4 px-4">
                  {tpl.status === "active" ? (
                    <Badge variant="success" className="text-[10px]">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="text-[10px]">
                      Draft
                    </Badge>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-[#2563EB]"
                    onClick={() => alert(`Editing template ${tpl.name}`)}
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Configure
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
