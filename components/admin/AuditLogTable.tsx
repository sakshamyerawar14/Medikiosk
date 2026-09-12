"use client";

import React, { useState } from "react";
import { AuditLog } from "@/types";
import { DEMO_AUDIT_LOGS } from "@/data/demo/patients";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Search, Filter } from "lucide-react";

export function AuditLogTable() {
  const [logs, setLogs] = useState<AuditLog[]>(DEMO_AUDIT_LOGS);
  const [filterQuery, setFilterQuery] = useState("");

  const filtered = logs.filter(
    (l) =>
      (l.actorName || "").toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.resourceType.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#0F172A] font-heading">
            System Security & Clinical Audit Trail
          </h2>
          <p className="text-xs text-[#64748B]">
            Immutable event logs complying with healthcare privacy standards
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <Input
            type="text"
            placeholder="Filter logs by actor or action..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-[#F8FAFC]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase font-bold tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">Actor</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Action Event</th>
              <th className="py-3.5 px-4">Resource</th>
              <th className="py-3.5 px-4">Payload Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="py-4 px-4 font-mono text-[#64748B]">
                  {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </td>
                <td className="py-4 px-4 font-bold text-[#0F172A]">{log.actorName}</td>
                <td className="py-4 px-4">
                  <Badge variant="outline" className="text-[10px] uppercase font-mono">
                    {log.actorRole}
                  </Badge>
                </td>
                <td className="py-4 px-4 font-semibold text-[#059669]">{log.action}</td>
                <td className="py-4 px-4 text-[#64748B]">{log.resourceType}</td>
                <td className="py-4 px-4 font-mono text-[11px] text-[#94A3B8] max-w-xs truncate">
                  {JSON.stringify(log.metadata)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
