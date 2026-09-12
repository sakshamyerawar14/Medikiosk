"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { DEMO_ADMIN_METRICS, DEMO_DASHBOARD_METRICS } from "@/data/demo/patients";

export function AnalyticsCharts() {
  const adminMetrics = DEMO_ADMIN_METRICS;
  const dashMetrics = DEMO_DASHBOARD_METRICS;

  const COLORS = ["#0F172A", "#059669", "#2563EB", "#7C3AED", "#D97706", "#DC2626"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Chart 1: Intakes Over Time */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Patient Throughput
          </span>
          <h3 className="text-base font-bold text-[#0F172A] font-heading">
            Daily Kiosk Intakes (Past 7 Days)
          </h3>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adminMetrics.intakesOverTime}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748B" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  color: "#FFFFFF",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-[#64748B] text-center mt-2">
          Peak volume observed between 09:00 AM - 11:30 AM daily
        </p>
      </div>

      {/* Chart 2: Department Distribution */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Specialty Allocation
          </span>
          <h3 className="text-base font-bold text-[#0F172A] font-heading">
            Intake Volume by Department
          </h3>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={adminMetrics.departmentDistribution}
                dataKey="count"
                nameKey="department"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={45}
                paddingAngle={4}
              >
                {adminMetrics.departmentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  color: "#FFFFFF",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-2 text-[11px] text-[#64748B] pt-2 border-t border-[#E2E8F0]">
          {adminMetrics.departmentDistribution.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[idx] }}
              />
              <span className="truncate">{item.department}: {item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
