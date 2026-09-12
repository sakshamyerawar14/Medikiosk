import { NextResponse } from "next/server";
import { DEMO_PATIENTS } from "@/data/demo/patients";
import { getSession } from "@/lib/auth/session";
import { PatientDemographicsSchema } from "@/lib/validation/schemas";

export async function GET() {
  // Clinical data protection: only authenticated doctors/admin/staff may view the patient list
  const session = await getSession();
  if (!session && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Clinician or administrator session required." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: DEMO_PATIENTS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parse = PatientDemographicsSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { success: false, error: parse.error.issues[0]?.message || "Invalid patient payload" },
        { status: 400 }
      );
    }

    const { fullName, dateOfBirth, gender, phone, abhaReference } = parse.data;

    // Calculate approximate age from DOB if present
    const age = dateOfBirth
      ? new Date().getFullYear() - new Date(dateOfBirth).getFullYear()
      : 45;

    const newPatient = {
      id: `p-${crypto.randomUUID()}`,
      fullName,
      age,
      dateOfBirth: dateOfBirth || undefined,
      gender,
      phone,
      abhaReference: abhaReference || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newPatient,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid patient payload" },
      { status: 400 }
    );
  }
}
