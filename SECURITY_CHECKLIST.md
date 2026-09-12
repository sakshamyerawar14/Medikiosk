# MediKiosk Security Hardening & Operational Checklist

This checklist serves as the operational baseline and post-remediation verification guide for the MediKiosk platform.

---

## 1. Authentication & Session Management
- [ ] Hardcoded auto-login as doctor removed from `lib/auth/auth-context.tsx`.
- [ ] Client-side setting of privileged cookies (`document.cookie = "medikiosk_admin_auth=true"`) eliminated.
- [ ] Constant-time password verification implemented in `lib/actions/auth.ts`.
- [ ] Secure, signed HttpOnly session cookies issued exclusively server-side.
- [ ] Next.js middleware guards `/doctor/*` and `/admin/*` against unauthenticated or unauthorized access.
- [ ] Public kiosk interfaces remain functional without requiring staff credentials, using ephemeral intake session tokens.

## 2. Server-Side Authorization & Anti-IDOR
- [ ] Every privileged server action checks `auth` and verifies required role (`doctor`, `admin`).
- [ ] Clinical summary verification (`submitDoctorReviewAction`) strictly verifies caller is an authorized clinician.
- [ ] Patient queue action (`getPatientQueueAction`) restricts query results based on department and authenticated session.
- [ ] Encounter summary endpoint (`/api/summary`) returns 404/403 for unauthorized or non-existent encounters (no fallback to other patients).
- [ ] PRNG replaced with cryptographically secure random values (`crypto.randomUUID()` and `crypto.getRandomValues()`).

## 3. Database & Storage Security
- [ ] Row Level Security (RLS) enabled on all 12 database tables, including `departments` and `interview_questions`.
- [ ] Blanket `USING (true)` and `WITH CHECK (true)` policies revoked.
- [ ] Audit logs table (`audit_logs`) secured against public read and write access.
- [ ] Foreign key and lookup indexes added to prevent query table-scan denial of service.
- [ ] Admin Supabase clients guarded with `import "server-only"`.
- [ ] Insecure fallback from service role key to anon key removed.

## 4. AI & OCR Safety
- [ ] Structural XML encapsulation (`<untrusted_patient_document>`) enforced on all OCR text inputs to Gemini prompts.
- [ ] Anti-prompt injection negative constraints active in all LLM system prompts.
- [ ] Chat endpoint (`/api/medical-chat`) enforces client message role sanitization (no unauthorized `model` turn injection).
- [ ] Rate limiting implemented on Gemini API endpoints to prevent quota exhaustion / denial of wallet.
- [ ] Fabricated fallback clinical data (Amlodipine, elevated cholesterol, hypertension) completely removed from `lib/ai/summary-generator.ts`.
- [ ] Mandatory medical decision support disclaimer displayed on all AI outputs.

## 5. Public Kiosk Privacy
- [ ] Inactivity timer (120 seconds) active in `lib/store/kiosk-context.tsx` to purge state if a patient walks away.
- [ ] Intakes cleanly flushed from memory upon final submission or cancellation.
- [ ] Unencrypted patient intake records prevented from accumulating indefinitely in browser `localStorage`.

## 6. Network & Deployment Hardening
- [ ] Comprehensive security headers enabled in `middleware.ts` (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- [ ] Exposed live credentials in `.env.local` rotated and sanitized.
- [ ] Document uploads validate MIME types against strict allowlist and sanitize storage file paths against directory traversal.
- [ ] Production error responses genericized to avoid leaking backend environment variable names or stack traces.
