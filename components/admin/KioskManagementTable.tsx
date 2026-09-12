"use client";

import React, { useState } from "react";
import { KioskDevice } from "@/types";
import { DEMO_KIOSKS } from "@/data/demo/patients";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Monitor,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Power,
  Sliders,
  X,
} from "lucide-react";

export function KioskManagementTable() {
  const [kiosks, setKiosks] = useState<KioskDevice[]>(DEMO_KIOSKS);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKioskId, setNewKioskId] = useState("");
  const [newLocation, setNewLocation] = useState("");

  const filteredKiosks = kiosks.filter(
    (k) =>
      k.kioskId.toLowerCase().includes(search.toLowerCase()) ||
      k.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddKiosk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKioskId || !newLocation) return;

    const newKiosk: KioskDevice = {
      id: `kiosk-${Date.now()}`,
      kioskId: newKioskId,
      location: newLocation,
      status: "active",
      lastSeen: "Just now",
      ipAddress: "192.168.10.110",
    };

    setKiosks([...kiosks, newKiosk]);
    setShowAddModal(false);
    setNewKioskId("");
    setNewLocation("");
  };

  const handleRestartKiosk = (id: string) => {
    alert(`Restart signal sent to terminal ${id}. Reloading kiosk runtime.`);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
      {/* Table Header */}
      <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#0F172A] font-heading">
            Hardware Kiosk Terminals Network
          </h2>
          <p className="text-xs text-[#64748B]">
            Real-time telemetry and terminal device management across hospital blocks
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <Input
              type="text"
              placeholder="Search kiosk or floor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs bg-[#F8FAFC]"
            />
          </div>

          <Button
            size="sm"
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shrink-0"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Kiosk
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase font-bold tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Kiosk ID</th>
              <th className="py-3.5 px-4">Hospital Location</th>
              <th className="py-3.5 px-4">IP Address</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Last Telemetry</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filteredKiosks.map((kiosk) => (
              <tr key={kiosk.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="py-4 px-4 font-mono font-bold text-sm text-[#0F172A]">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-[#2563EB]" />
                    <span>{kiosk.kioskId}</span>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold text-[#0F172A]">{kiosk.location}</td>
                <td className="py-4 px-4 font-mono text-[#64748B]">{kiosk.ipAddress || "192.168.10.x"}</td>
                <td className="py-4 px-4">
                  {kiosk.status === "active" ? (
                    <Badge variant="success" className="text-[10px]">
                      ● Online & Active
                    </Badge>
                  ) : kiosk.status === "idle" ? (
                    <Badge variant="secondary" className="text-[10px]">
                      Idle
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-[10px]">
                      Offline
                    </Badge>
                  )}
                </td>
                <td className="py-4 px-4 text-[#64748B]">{kiosk.lastSeen}</td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-[#64748B] hover:text-[#0F172A]"
                      onClick={() => handleRestartKiosk(kiosk.kioskId)}
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1" />
                      Reboot
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Kiosk Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0F172A] font-heading">
                Deploy New Kiosk Terminal
              </h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>

            <form onSubmit={handleAddKiosk} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Kiosk Terminal ID (e.g. K-007)
                </label>
                <Input
                  type="text"
                  required
                  placeholder="K-007"
                  value={newKioskId}
                  onChange={(e) => setNewKioskId(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Hospital Floor / Location
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. 2nd Floor — ENT & Ophthalmology"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
                  Deploy Terminal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
