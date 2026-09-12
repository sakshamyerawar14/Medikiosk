import { NextResponse } from "next/server";
import { DEMO_SUMMARIES } from "@/data/demo/patients";
import { getSession } from "@/lib/auth/session";
import { z } from "zod";

const SummaryPostSchema = z.object({
  encounterId: z.string().min(1, "Encounter ID is required"),
  summary: z.record(z.string(), z.any()),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const encounterId = searchParams.get("encounterId");

    if (!encounterId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: encounterId" },
        { status: 400 }
      );
    }

    // Verify authentication: either authenticated clinician/admin or valid query session
    const session = await getSession();
    // If not authenticated via session cookie, verify request format
    if (!session && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, error: "Authentication required to access clinical summaries." },
        { status: 401 }
      );
    }

    // Safe lookup avoiding prototype pollution
    if (Object.prototype.hasOwnProperty.call(DEMO_SUMMARIES, encounterId)) {
      const summary = DEMO_SUMMARIES[encounterId as keyof typeof DEMO_SUMMARIES];
      return NextResponse.json({
        success: true,
        data: summary,
      });
    }

    // Strict 404: NEVER leak another patient's summary as a fallback!
    return NextResponse.json(
      { success: false, error: "Encounter summary not found." },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve summary." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Only authorized clinicians or kiosk pipeline may write summaries
    const session = await getSession();
    if (!session && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parse = SummaryPostSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { success: false, error: parse.error.issues[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: `sum-${crypto.randomUUID()}`,
        encounterId: parse.data.encounterId,
        version: 1,
        generatedBy: session?.role === "doctor" ? "doctor" : "ai",
        doctorVerified: session?.role === "doctor",
        summaryJson: parse.data.summary,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Failed to generate summary" }, { status: 400 });
  }
}
