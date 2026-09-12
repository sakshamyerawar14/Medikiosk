# MediKiosk Data Privacy & Governance Policy

**Document Classification:** Healthcare Privacy & Data Governance Specification  
**Framework Alignment:** India Digital Personal Data Protection (DPDP) Act 2023, Ayushman Bharat Digital Mission (ABDM) Health Data Management Policy, DISHA Guidelines, and HIPAA Privacy Principles.  

> [!NOTE]
> This document establishes technical and organizational privacy controls. It does not constitute legal certification or statutory compliance counsel. An independent legal compliance review is recommended before production clinical deployment.

---

## 1. Data Inventory & Classification

MediKiosk processes data into distinct classification tiers:

| Data Category | Specific Elements | Purpose of Processing | Storage Location | Retention Window | Access Boundary |
|---|---|---|---|---|---|
| **Patient Identification (PII)** | Full name, age, date of birth, gender, mobile number, ABHA health reference ID. | Patient registration, queue ticket issuance, and longitudinal OPD record linkage. | Supabase PostgreSQL `patients` table. | Encrypted; retained in accordance with hospital OPD records policy (minimum 3 years). | Authorized clinical staff & assigned doctors. |
| **Protected Health Information (PHI)** | Chief complaint, symptom chronology, review of systems, past medical/surgical history, drug allergies. | Pre-consultation clinical intake and decision support draft generation. | Supabase PostgreSQL `encounters`, `history_answers`, `clinical_summaries`. | Retained for medical record lifecycle; immutable audit history. | Assigned consultation clinician, emergency staff. |
| **Medical Documents & Biometrics** | Prescriptions, lab reports, discharge summaries (PDF, JPEG, PNG, WEBP), and extracted text. | OCR ingestion, prior medication extraction, and longitudinal medical timeline collation. | Encrypted Supabase Storage bucket (`documents/`), metadata in `documents`. | Retained for active treatment episode; archival per hospital policy. | Assigned clinician and verifying medical records team. |
| **Clinical Decision Support Outputs** | AI-generated summary draft, synthesized medication lists, rule-based safety alerts (Red Flags). | Assisting clinician review during OPD consultation. | `clinical_summaries`, `safety_alerts`. | Linked to encounter; preserved with clinician verification stamps. | Clinician, clinical quality audit committee. |
| **System Audit Telemetry** | Actor ID, role, action code, resource ID, timestamp, operational metadata (status, latency). | Security monitoring, accountability, forensic reconstruction, and non-repudiation. | Supabase PostgreSQL `audit_logs`. | Tamper-resistant log store; minimum 7 years. | System Administrator & Compliance Officer only. |

---

## 2. Privacy Engineering Principles Implemented

### Principle 1: Data Minimization
- **Purpose Limitation:** MediKiosk collects only the clinical and demographic data points necessary to populate the pre-consultation OPD dossier.
- **Exclusion of Unnecessary Data:** Unnecessary identifiers (e.g., payment card details, biometric scans, detailed residential addresses) are not solicited or stored.
- **Audit Log Sanitization:** Audit log metadata records only entity identifiers and action verbs; raw patient narratives, full symptom texts, and unmasked document contents are excluded from audit log records.

### Principle 2: Purpose-Bound Explicit Consent
- **Consent Collection:** Before initiating the intake interview or uploading prior records, the patient must review and accept an explicit consent declaration (available in multiple Indian languages: English, Hindi, Marathi, Tamil).
- **Consent Recording:** Patient consent status, consent timestamp, language of disclosure, and consent type (`intake`, `data_sharing`, `ai_processing`) are recorded immutably in the `consents` table.
- **Revocation Capability:** Patients retain the prerogative to abort the kiosk session at any point, triggering an immediate purge of in-progress intake answers.

### Principle 3: Shared Kiosk Device Privacy (Public Terminal Hardening)
- **Zero Persistent PHI:** Public kiosk browsers operate as transient interfaces. Sensitive intake details are not permanently stored in browser `localStorage`.
- **Inactivity Purge Daemon:** If a patient walks away from a kiosk terminal without completing intake, an automated 120-second inactivity timer clears all session state and returns the interface to the clean welcome screen.
- **Completion Teardown:** Upon final submission and token issuance, active session memory is flushed immediately to prevent subsequent users from viewing previous entries.

### Principle 4: Elimination of Fictitious Clinical Data
- **Integrity Baseline:** The application strictly prohibits injecting simulated or synthetic medications, diagnoses, or lab values into real patient summaries.
- **Transparency:** Where patient records or prior test documents are missing, the system explicitly indicates "No prior records reported/detected" rather than generating placeholder clinical information.

---

## 3. Regulatory Gap Analysis & Compliance Road Map

| Requirement Area | Current Technical Status | Compliance Gap / Action Required |
|---|---|---|
| **DPDP Act (India) — Notice & Consent** | Localized consent screen active in 4 languages; consent logged in DB. | Must appoint a designated Data Protection Officer (DPO) and formalize grievance redressal workflows. |
| **ABDM Integration — ABHA Validation** | Captures ABHA ID string in patient profile. | Needs official ABDM M1/M2/M3 sandbox certification to integrate with the Ayushman Bharat Digital Mission gateway via authorized Health Information Exchange (HIE). |
| **HIPAA Security Rule — Access Controls** | Role-based access control (RBAC), signed session cookies, database Row Level Security. | Formal Business Associate Agreements (BAAs) must be executed with hosting providers (Vercel, Supabase, Google Cloud). |
| **HIPAA Privacy Rule — Minimum Necessary** | Clinical data scoped to assigned department queue. | Implement automated PHI field masking for administrative and non-clinical roles. |
| **Data Retention & Deletion Rights** | Data can be deleted via administrative server actions. | Implement automated retention lifecycles and an API endpoint to support Patient Right to Erasure / Data Portability requests. |
