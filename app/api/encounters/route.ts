import { NextResponse } from "next/server";
import { DEMO_ENCOUNTERS } from "@/data/demo/patients";
import { getSession } from "@/lib/auth/session";
import { generateToken } from "@/lib/utils";
import { z } from "zod";

const CreateEncounterApiSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  department: z.string().default("cardiology"),
  language: z.string().default("en"),
  chiefComplaint: z.string().max(500, "Chief complaint too long").default("General intake"),
});

export async function GET() {
  const session = await getSession();
  if (!session && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Staff or clinician session required." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: DEMO_ENCOUNTERS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parse = CreateEncounterApiSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { success: false, error: parse.error.issues[0]?.message || "Invalid encounter parameters" },
        { status: 400 }
      );
    }

    const { patientId, department, language, chiefComplaint } = parse.data;

    const newEncounter = {
      id: `enc-${crypto.randomUUID()}`,
      patientId,
      department,
      language,
      chiefComplaint,
      status: "ready_for_review",
      token: generateToken(),
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newEncounter,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create encounter" },
      { status: 400 }
    );
  }
}
