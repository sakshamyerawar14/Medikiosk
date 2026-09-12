"use client";

import { useEffect, useState, useCallback } from "react";
import { getPatientQueueAction, DoctorQueueItem } from "@/lib/actions/doctor";

export function useDoctorQueue(departmentId?: string) {
  const [patients, setPatients] = useState<DoctorQueueItem[]>([]);
  const [stats, setStats] = useState({
    totalWaiting: 0,
    reviewedToday: 0,
    avgWaitMinutes: 0,
    urgentCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await getPatientQueueAction(departmentId);
      if (res.success) {
        setPatients(res.patients);
        setStats(res.stats);
      } else {
        setError("Failed to load queue");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load queue");
    } finally {
      setLoading(false);
    }
  }, [departmentId]);

  useEffect(() => {
    fetchQueue();
    // Refresh queue every 15 seconds
    const interval = setInterval(fetchQueue, 15000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  return {
    patients,
    stats,
    loading,
    error,
    refresh: fetchQueue,
  };
}
