import { NextResponse } from "next/server";
import { DEMO_DOCUMENTS } from "@/data/demo/patients";
import { getSession } from "@/lib/auth/session";
import { z } from "zod";

const DocumentPostSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  documentType: z.enum(["prescription", "lab_report", "discharge_summary", "imaging_report", "other"]).default("prescription"),
  entities: z.array(z.record(z.string(), z.any())).max(100, "Too many entities").optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Staff or clinician session required to view clinical documents." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: DEMO_DOCUMENTS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parse = DocumentPostSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { success: false, error: parse.error.issues[0]?.message || "Invalid document payload" },
        { status: 400 }
      );
    }

    const { patientId, documentType, entities } = parse.data;

    return NextResponse.json({
      success: true,
      data: {
        id: `doc-${crypto.randomUUID()}`,
        patientId,
        documentType,
        documentDate: new Date().toISOString().split("T")[0],
        ocrStatus: "completed",
        extractionStatus: "completed",
        entities: entities || [],
        createdAt: new Date().toISOString(),
      },
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Failed to upload document" }, { status: 400 });
  }
}
