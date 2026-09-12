import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey && process.env.NODE_ENV === "production") {
  console.error("CRITICAL SECURITY CONFIGURATION ERROR: SUPABASE_SERVICE_ROLE_KEY is not defined in production.");
}

/**
 * Administrative Supabase Client (Server-side only)
 * STRICT SECURITY RULE: Runs with elevated service_role privileges.
 * Protected by 'server-only' package to prevent accidental client bundling.
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || "mock-service-role-key-for-development",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
