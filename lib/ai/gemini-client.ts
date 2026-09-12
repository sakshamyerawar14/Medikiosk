import { GoogleGenAI } from "@google/genai";
import {
  MEDICAL_CHAT_SYSTEM_PROMPT,
  isEmergencyQuery,
  EMERGENCY_RESPONSE_TEXT,
} from "./prompts/medical-chat-system";

export interface ChatMessage {
  role: "user" | "model" | "assistant";
  content: string;
}

export interface ChatCompletionResult {
  success: boolean;
  reply?: string;
  isEmergency?: boolean;
  error?: string;
  statusCode?: number;
}

/**
 * Executes a conversation turn with Google Gemini API
 * Strictly server-side only — never leaks the API key to the client.
 */
export async function generateMedicalChatResponse(
  messages: ChatMessage[]
): Promise<ChatCompletionResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return {
      success: false,
      error: "Message history cannot be empty.",
      statusCode: 400,
    };
  }

  // Get the latest user message
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const queryText = lastUserMessage?.content?.trim() || "";

  if (!queryText) {
    return {
      success: false,
      error: "User message cannot be empty.",
      statusCode: 400,
    };
  }

  // Input length capping (max 6000 characters per message to support OCR document analysis)
  if (queryText.length > 6000) {
    return {
      success: false,
      error: "Message exceeds maximum allowed length (6000 characters). Please summarize your document or question.",
      statusCode: 400,
    };
  }

  // Step 1: Real-time emergency detection
  if (isEmergencyQuery(queryText)) {
    return {
      success: true,
      reply: EMERGENCY_RESPONSE_TEXT,
      isEmergency: true,
    };
  }

  // Step 2: Validate API key presence (Genericized error to avoid leaking internal config keys)
  if (!apiKey) {
    return {
      success: false,
      error: "The Medical AI Assistant service is temporarily unavailable. Please consult your physician or clinic staff.",
      statusCode: 503,
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Build sliding window of conversation history (last 8 messages)
    const recentMessages = messages.slice(-8);

    // Format contents for Gemini SDK
    const contents = recentMessages.map((m) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Call Gemini with medical system instruction
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: MEDICAL_CHAT_SYSTEM_PROMPT,
        temperature: 0.3, // Lower temperature for cautious, factual health guidance
        maxOutputTokens: 1024,
      },
    });

    const responseText = response.text;

    if (!responseText) {
      return {
        success: false,
        error: "No response received from the medical assistant. Please try rephrasing your question.",
        statusCode: 500,
      };
    }

    return {
      success: true,
      reply: responseText,
      isEmergency: false,
    };
  } catch (err: any) {
    console.error("[Gemini Client Error]:", err?.message || err);

    // Provide safe, user-friendly error without leaking sensitive internals
    if (err?.message?.includes("API_KEY_INVALID") || err?.status === 400) {
      return {
        success: false,
        error: "Invalid Gemini API key configured. Please verify your GEMINI_API_KEY.",
        statusCode: 401,
      };
    }

    if (err?.status === 429 || err?.message?.includes("RESOURCE_EXHAUSTED")) {
      return {
        success: false,
        error: "The medical assistant is receiving high traffic. Please wait a moment and try again.",
        statusCode: 429,
      };
    }

    return {
      success: false,
      error: "Sorry, the medical assistant is temporarily unavailable. Please try again later.",
      statusCode: 500,
    };
  }
}
