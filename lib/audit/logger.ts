import { supabaseAdmin } from "@/lib/supabase/admin";

export interface AuditLogEntry {
  actorId?: string | null;
  actorRole?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  metadata?: Record<string, any> | null;
}

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "fullname",
  "phone",
  "abhareference",
  "answertext",
  "summaryjson",
  "content",
  "email",
]);

/**
 * Sanitizes audit metadata to prevent accidental PHI/PII leakage into audit logs
 */
function sanitizeAuditMetadata(metadata?: Record<string, any> | null): Record<string, any> {
  if (!metadata) return {};

  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(metadata)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      clean[key] = "[REDACTED_FOR_PRIVACY]";
    } else if (typeof val === "object" && val !== null) {
      // Avoid deep nested objects with potential PHI
      clean[key] = "[COMPLEX_OBJECT]";
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

/**
 * Log an audit event to Supabase and fallback to console in demo mode
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
    const sanitizedMeta = sanitizeAuditMetadata(entry.metadata);

    if (isDemo) {
      console.log(
        `[AUDIT LOG] ${new Date().toISOString()} | ${entry.actorRole || "SYSTEM"}:${entry.actorId || "anonymous"} -> ${entry.action} on ${entry.resourceType}:${entry.resourceId || "N/A"}`,
        sanitizedMeta
      );
      return;
    }

    await supabaseAdmin.from("audit_logs").insert({
      actor_id: entry.actorId || null,
      actor_role: entry.actorRole || "system",
      action: entry.action,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId || null,
      metadata: sanitizedMeta,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AUDIT LOG ERROR] Failed to persist audit log:", error);
  }
}

/**
 * Higher-order function to wrap server action execution with automatic audit logging
 */
export function withAudit<TArgs extends any[], TReturn>(
  actionName: string,
  resourceType: string,
  fn: (...args: TArgs) => Promise<TReturn>,
  extractContext?: (...args: TArgs) => { actorId?: string; actorRole?: string; resourceId?: string; metadata?: Record<string, any> }
) {
  return async (...args: TArgs): Promise<TReturn> => {
    const startTime = Date.now();
    let result: TReturn;
    let errorOccurred: any = null;

    try {
      result = await fn(...args);
      return result;
    } catch (err) {
      errorOccurred = err;
      throw err;
    } finally {
      const durationMs = Date.now() - startTime;
      const ctx = extractContext ? extractContext(...args) : {};

      await logAuditEvent({
        action: actionName,
        resourceType,
        actorId: ctx.actorId,
        actorRole: ctx.actorRole,
        resourceId: ctx.resourceId,
        metadata: {
          ...ctx.metadata,
          durationMs,
          success: !errorOccurred,
          error: errorOccurred ? String(errorOccurred.message || errorOccurred) : undefined,
        },
      });
    }
  };
}
