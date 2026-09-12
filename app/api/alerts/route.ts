import { NextResponse } from "next/server";
import { DEMO_SUMMARIES } from "@/data/demo/patients";
import { getSession } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Clinician session required to view clinical alerts." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const encounterId = searchParams.get("encounterId") || "enc-001";

    const encounterSummary =
      Object.prototype.hasOwnProperty.call(DEMO_SUMMARIES, encounterId)
        ? DEMO_SUMMARIES[encounterId as keyof typeof DEMO_SUMMARIES]
        : null;

    if (!encounterSummary) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const flags = encounterSummary.summaryJson.safetyFlags || [];
    return NextResponse.json({
      success: true,
      data: flags,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch safety alerts" },
      { status: 500 }
    );
  }
}
