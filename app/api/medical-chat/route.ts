import { NextResponse } from "next/server";
import { generateMedicalChatResponse } from "@/lib/ai/gemini-client";
import { checkRateLimit, getClientIdentifier } from "@/lib/api/rate-limiter";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "model", "assistant"]),
  content: z.string().min(1, "Message cannot be empty").max(2000, "Message is too long"),
});

const ChatRequestSchema = z.object({
  messages: z.array(MessageSchema).min(1, "At least one message is required").max(30, "Too many messages in history"),
});

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Protection (Denial of Wallet Defense)
    const clientIp = getClientIdentifier(request);
    const rateLimit = checkRateLimit(`medical-chat:${clientIp}`, {
      maxRequests: 20,
      windowSeconds: 60,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit exceeded. Please wait ${rateLimit.resetInSeconds} seconds before sending another medical query.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.resetInSeconds.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload in request body." },
        { status: 400 }
      );
    }

    const validation = ChatRequestSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || "Invalid chat request format.";
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    const { messages } = validation.data;

    // 2. Anti-Model-Hijacking: Ensure latest turn is from user
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== "user") {
      return NextResponse.json(
        { success: false, error: "The latest message in a conversation must be from the user." },
        { status: 400 }
      );
    }

    // 3. Sanitize message roles: map assistant to model, normalize user
    const sanitizedMessages = messages.map((m) => ({
      role: m.role === "assistant" || m.role === "model" ? ("model" as const) : ("user" as const),
      content: m.content.replace(/<system_override>[\s\S]*?<\/system_override>/gi, "").trim(),
    }));

    // Process medical chat with Gemini API
    const result = await generateMedicalChatResponse(sanitizedMessages);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: result.statusCode || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reply: result.reply,
      isEmergency: result.isEmergency || false,
      disclaimer: "AI educational guidance only. Not a medical diagnosis. Consult a qualified doctor for medical care.",
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
