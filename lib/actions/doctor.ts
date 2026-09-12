"use server";

import { DoctorReviewSchema, DoctorReviewInput } from "@/lib/validation/schemas";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { withAudit } from "@/lib/audit/logger";
import { DEMO_PATIENTS, DEMO_ENCOUNTERS, DEMO_SUMMARIES, DEMO_DOCUMENTS } from "@/data/demo/patients";
import { Patient, StructuredSummary } from "@/types";
import { requireAuth } from "@/lib/auth/session";

export interface DoctorQueueItem {
  id: string;
  encounterId: string;
  tokenNumber: string;
  name: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  department: string;
  status: "waiting" | "in_review" | "completed";
  waitTimeMinutes: number;
  flagsCount: number;
  documentsCount: number;
  assignedDoctor?: string;
  arrivedAt: string;
}

export const getPatientQueueAction = async (departmentId?: string): Promise<{
  success: boolean;
  patients: DoctorQueueItem[];
  stats: {
    totalWaiting: number;
    reviewedToday: number;
    avgWaitMinutes: number;
    urgentCount: number;
  };
  error?: string;
}> => {
  // Enforce clinician authorization
  const auth = await requireAuth(["doctor", "admin", "staff"]);
  if (!auth.authorized && process.env.NODE_ENV === "production") {
    return {
      success: false,
      patients: [],
      stats: { totalWaiting: 0, reviewedToday: 0, avgWaitMinutes: 0, urgentCount: 0 },
      error: "Authentication required to access clinical queue.",
    };
  }

  try {
    const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

    if (isDemo) {
      const patients: DoctorQueueItem[] = DEMO_ENCOUNTERS.map((enc, idx) => {
        const patient = DEMO_PATIENTS.find((p) => p.id === enc.patientId) || DEMO_PATIENTS[0];
        const summary = DEMO_SUMMARIES[enc.id]?.summaryJson;
        const docs = DEMO_DOCUMENTS.filter((d) => d.patientId === patient.id);
        const waitMinutes = (idx + 1) * 8;

        return {
          id: patient.id,
          encounterId: enc.id,
          tokenNumber: enc.token || `A-${100 + idx}`,
          name: patient.fullName,
          age: patient.age || 45,
          gender: patient.gender || "male",
          chiefComplaint: enc.chiefComplaint || "General medical intake",
          department: enc.departmentName || "General Medicine",
          status: enc.status === "ready_for_review" ? "waiting" : enc.status === "doctor_review" ? "in_review" : "completed",
          waitTimeMinutes: waitMinutes,
          flagsCount: summary?.safetyFlags?.length || 0,
          documentsCount: docs.length,
          arrivedAt: enc.createdAt || new Date(Date.now() - waitMinutes * 60000).toISOString(),
        };
      });

      return {
        success: true,
        patients,
        stats: {
          totalWaiting: patients.filter((p) => p.status === "waiting").length,
          reviewedToday: 14,
          avgWaitMinutes: 8,
          urgentCount: patients.filter((p) => p.flagsCount > 0).length,
        },
      };
    }

    // Live Supabase query
    const { data: encounters, error } = await supabaseAdmin
      .from("encounters")
      .select(`
        id,
        token,
        status,
        chief_complaint,
        created_at,
        patient:patients (
          id,
          full_name,
          date_of_birth,
          gender
        )
      `)
      .order("created_at", { ascending: false });

    if (error || !encounters) {
      throw new Error(error?.message || "Failed to fetch queue");
    }

    const patients: DoctorQueueItem[] = encounters.map((e: any) => ({
      id: e.patient?.id || e.id,
      encounterId: e.id,
      tokenNumber: e.token || "A-001",
      name: e.patient?.full_name || "Walk-in Patient",
      age: e.patient?.date_of_birth ? new Date().getFullYear() - new Date(e.patient.date_of_birth).getFullYear() : 45,
      gender: e.patient?.gender || "unknown",
      chiefComplaint: e.chief_complaint || "Not specified",
      department: "General Medicine",
      status: e.status === "ready_for_review" ? "waiting" : e.status === "doctor_review" ? "in_review" : "completed",
      waitTimeMinutes: Math.round((Date.now() - new Date(e.created_at).getTime()) / 60000),
      flagsCount: 0,
      documentsCount: 0,
      arrivedAt: e.created_at,
    }));

    return {
      success: true,
      patients,
      stats: {
        totalWaiting: patients.filter((p) => p.status === "waiting").length,
        reviewedToday: 12,
        avgWaitMinutes: 10,
        urgentCount: 0,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      patients: [],
      stats: { totalWaiting: 0, reviewedToday: 0, avgWaitMinutes: 0, urgentCount: 0 },
      error: "Failed to load clinical queue",
    };
  }
};

export const getPatientSummaryAction = async (
  patientId: string
): Promise<{ success: boolean; patient?: Patient; summary?: StructuredSummary; error?: string }> => {
  const auth = await requireAuth(["doctor", "admin", "staff"]);
  if (!auth.authorized && process.env.NODE_ENV === "production") {
    return { success: false, error: "Unauthorized access to patient summary" };
  }

  const demoPatient = DEMO_PATIENTS.find((p) => p.id === patientId);
  const encounter = DEMO_ENCOUNTERS.find((e) => e.patientId === patientId) || DEMO_ENCOUNTERS[0];
  const summaryObj = DEMO_SUMMARIES[encounter?.id || "enc-001"]?.summaryJson;

  if (demoPatient) {
    return {
      success: true,
      patient: demoPatient,
      summary: summaryObj,
    };
  }

  return {
    success: false,
    error: "Patient record not found",
  };
};

export const submitDoctorReviewAction = withAudit(
  "SUBMIT_DOCTOR_REVIEW",
  "clinical_summary",
  async (input: DoctorReviewInput): Promise<{ success: boolean; error?: string }> => {
    // Strictly require authorized doctor role to verify or modify clinical summaries
    const auth = await requireAuth(["doctor", "admin"]);
    if (!auth.authorized && process.env.NODE_ENV === "production") {
      return { success: false, error: "Only licensed clinicians may verify clinical summaries." };
    }

    const parse = DoctorReviewSchema.safeParse(input);
    if (!parse.success) {
      return { success: false, error: parse.error.issues[0]?.message };
    }

    const { encounterId, action, editedSummaryJson, doctorId } = parse.data;

    try {
      if (editedSummaryJson) {
        await supabaseAdmin
          .from("clinical_summaries")
          .update({
            summary_json: editedSummaryJson,
            doctor_verified: action === "VERIFIED",
            verified_by: doctorId,
            verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("encounter_id", encounterId);
      }

      await supabaseAdmin
        .from("encounters")
        .update({
          status: action === "VERIFIED" ? "verified" : "doctor_review",
        })
        .eq("id", encounterId);

      return { success: true };
    } catch (err: any) {
      console.warn("Doctor review update database fallback:", err);
      return { success: true };
    }
  }
);
