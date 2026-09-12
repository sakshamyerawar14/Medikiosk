# MediKiosk Security Architecture Document

**System Classification:** High-Throughput Healthcare Outpatient Department (OPD) Intake & Clinical Decision Support System  
**Regulatory Context:** ABDM (Ayushman Bharat Digital Mission), DISHA (Digital Information Security in Healthcare Act), HIPAA Security Rule principles, India DPDP Act 2023  

---

## 1. End-to-End Architectural Data Flow

```text
       ┌─────────────────────────────────────────────────────────┐
       │                Untrusted Client Tier                    │
       │  - Patient Kiosk (Touch / Multilingual Voice / Web ASR) │
       │  - Doctor Clinical Dashboard (Web Browser)              │
       │  - Hospital Admin Console (Web Browser)                 │
       └────────────────────────────┬────────────────────────────┘
                                    │ HTTPS / TLS 1.3
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │           Edge & Network Security Layer                 │
       │  - Next.js Middleware (Security Headers, CSP, HSTS)     │
       │  - Route Protection & Role Verification                 │
       │  - In-Memory IP / Device Rate Limiting                  │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │       Authentication & Session Management Layer         │
       │  - Cryptographically Signed Session Cookies (HMAC-SHA256│
       │  - Strict Role-Based Access Control (RBAC)              │
       │  - Zero Trust User/Encounter Identifier Verification    │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │         Server Actions & API Gateway Tier               │
       │  - Zod Schema Validation & Input Sanitization           │
       │  - IDOR & Encounter Ownership Enforcement               │
       │  - MIME / File Magic Byte Verification                  │
       └──────────────┬───────────────────────────┬──────────────┘
                      │                           │
                      ▼                           ▼
       ┌────────────────────────┐   ┌────────────────────────────┐
       │ AI & OCR Boundary      │   │ Database & Storage Layer   │
       │ - XML Data Enclosure   │   │ - PostgreSQL (Supabase)    │
       │ - Anti-Prompt Injection│   │ - Row Level Security (RLS) │
       │ - Clinical Disclaimer  │   │ - Encrypted at Rest (AES)  │
       │ - Google Gemini API    │   │ - Private Object Storage   │
       └──────────────┬─────────┘   └─────────────┬──────────────┘
                      │                           │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │        Security Audit Logging & Telemetry Layer         │
       │  - Tamper-Resistant Audit Log Store                     │
       │  - Sanitized Metadata (PHI Masked)                      │
       │  - Access Control: Admin Read-Only, Service Role Insert │
       └─────────────────────────────────────────────────────────┘
```

---

## 2. Trust Boundaries & Security Enclaves

### Trust Boundary 1: Public Kiosk Terminal ↔ Edge Server
- **Physical Environment:** Shared public touch-screen terminal in hospital waiting rooms.
- **Threats:** Shoulder surfing, walk-away data leakage, terminal abandonment, physical tampering.
- **Controls:**
  - Strict 120-second inactivity timeout with automatic state purge and redirect to welcome screen.
  - Ephemeral session handling; no long-term persistence of unencrypted PHI in browser `localStorage`.
  - Cryptographically randomized session IDs (`crypto.randomUUID()`) and queue tokens.

### Trust Boundary 2: Client Web Browser ↔ Backend Server Actions / API Routes
- **Threats:** Parameter tampering, Broken Object Level Authorization (BOLA/IDOR), Privilege Escalation, Session Hijacking, Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF).
- **Controls:**
  - Secure, signed `HttpOnly`, `SameSite=Lax` cookies for authenticated sessions.
  - Server-side role verification on every privileged action (`doctor`, `admin`).
  - Strict Zod schemas validating type, length, and format of every input parameter.
  - Strict Content Security Policy (CSP) blocking unauthorized script execution and object embedding.

### Trust Boundary 3: Application Server ↔ Database & Storage (Supabase)
- **Threats:** SQL Injection, database credential leakage, RLS bypass, mass exfiltration via anonymous key.
- **Controls:**
  - Parameterized queries enforced via Supabase PostgREST client.
  - Row Level Security (RLS) active on all tables with explicit, least-privilege policies.
  - Revocation of public read/write permissions on `audit_logs` and patient data tables.
  - Segregation of anonymous key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) from backend service role key (`SUPABASE_SERVICE_ROLE_KEY`), with `server-only` build guards.

### Trust Boundary 4: Application Server ↔ External AI Providers (Google Gemini)
- **Threats:** Direct and indirect prompt injection, data leakage, denial-of-wallet, model hallucination leading to medical misdirection.
- **Controls:**
  - Strict structural XML boundary delimiters (e.g. `<untrusted_patient_document>`) encapsulating untrusted user and OCR data.
  - Negative constraints instructing the model to treat encapsulated content purely as unverified data and reject embedded instructions.
  - Removal of all fabricated fallback medical data (Amlodipine, false cholesterol levels).
  - Prominent UI and API disclaimers declaring that AI drafts are assistive decision support only, requiring mandatory licensed physician review.
  - In-memory rate limiting throttling requests per IP and session.

---

## 3. Role-Based Access Control (RBAC) Matrix

| Resource / Action | Patient (Kiosk) | Doctor | Nurse / Staff | System Administrator |
|---|---|---|---|---|
| **Start Intake Session** | Allowed (New Encounter) | Allowed | Allowed | Allowed |
| **Submit Consent & Answers** | Allowed (Active Session Only)| Denied | Denied | Denied |
| **Upload Intake Documents** | Allowed (Active Session Only)| Allowed | Allowed | Allowed |
| **View Own Intake Summary** | View-Only (Draft Token) | N/A | N/A | N/A |
| **View Doctor OPD Queue** | Denied | Allowed (Dept Scoped) | Allowed | Allowed |
| **View Patient Dossier & PHI**| Denied (Other Patients) | Allowed (Authorized Patient)| Allowed (Assigned) | Allowed |
| **Edit / Verify Clinical Summary**| Denied | Allowed (Doctor Only) | Denied | Denied |
| **Trigger Emergency Red Flag**| Automatic (Rule Engine) | Allowed | Allowed | Allowed |
| **Configure Departments & Forms**| Denied | Denied | Denied | Allowed |
| **View Full Hospital Audit Logs**| Denied | Denied | Denied | Allowed |

---

## 4. Cryptographic Standards & Key Management

1. **In Transit:**
   - Enforce HTTPS/TLS 1.3 across all endpoints.
   - HSTS header configured with `max-age=31536000; includeSubDomains; preload`.
2. **At Rest:**
   - PostgreSQL table storage encrypted at rest using AES-256 via managed cloud database infrastructure.
   - Object storage bucket encryption for patient documents.
3. **Session Tokens:**
   - HMAC-SHA256 cryptographic signatures over session payloads to prevent tampering with user IDs or roles.
4. **Randomness:**
   - Cryptographically secure pseudo-random number generator (`crypto.randomUUID()` and `crypto.getRandomValues()`) for encounter tokens, document IDs, and session references.
5. **Secret Segregation:**
   - `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are strictly server-side environment variables and never prefixed with `NEXT_PUBLIC_`.
   - `server-only` guard packages imported in administrative database modules to trigger build-time errors if client components attempt an import.
