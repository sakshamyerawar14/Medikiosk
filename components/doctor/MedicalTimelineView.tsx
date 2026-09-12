"use client";

import React from "react";
import { TimelineEvent } from "@/types";
import { DEMO_SUMMARIES } from "@/data/demo/patients";
import {
  Calendar,
  FileText,
  Activity,
  Heart,
  Pill,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function MedicalTimelineView({ encounterId = "enc-001" }: { encounterId?: string }) {
  const summary = DEMO_SUMMARIES[encounterId] || DEMO_SUMMARIES["enc-001"];
  const timeline: TimelineEvent[] = summary.summaryJson.documentTimeline;

  const iconMap: Record<string, React.ReactNode> = {
    diagnosis: <Heart className="w-4 h-4 text-[#DC2626]" />,
    document: <FileText className="w-4 h-4 text-[#0284C7]" />,
    medication: <Pill className="w-4 h-4 text-[#7C3AED]" />,
    encounter: <Activity className="w-4 h-4 text-[#059669]" />,
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Longitudinal Patient History
          </span>
          <h2 className="text-lg font-bold text-[#0F172A] font-heading">
            Chronological Medical Timeline
          </h2>
        </div>
        <Badge variant="outline" className="text-xs">
          4 Chronological Records
        </Badge>
      </div>

      {/* Timeline Nodes */}
      <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
        {timeline.map((event, idx) => (
          <div key={event.id || idx} className="relative group">
            {/* Timeline Circle */}
            <div
              className={`absolute -left-6 top-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-125 ${
                event.eventType === "encounter"
                  ? "bg-[#059669] text-white ring-4 ring-[#ECFDF5]"
                  : event.eventType === "diagnosis"
                  ? "bg-[#DC2626] text-white"
                  : event.eventType === "medication"
                  ? "bg-[#7C3AED] text-white"
                  : "bg-[#0284C7] text-white"
              }`}
            >
              {iconMap[event.eventType] || <FileText className="w-3 h-3 text-white" />}
            </div>

            {/* Event Content Card */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#0F172A] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                    {event.date}
                  </span>
                  <h4 className="text-sm font-bold text-[#0F172A] font-heading">
                    {event.title}
                  </h4>
                </div>

                <Badge
                  variant={event.eventType === "encounter" ? "success" : "secondary"}
                  className="text-[10px] uppercase"
                >
                  {event.eventType}
                </Badge>
              </div>

              <p className="text-xs text-[#64748B] leading-relaxed mt-1">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
