# MediKiosk — AI-Powered Clinical History & Medical Document Intake Platform

> **AI Prepares. Doctor Decides.**  
> Next-generation digital clinical intake assistant for high-throughput hospital Outpatient Departments (OPD).

---

## 🌟 Overview

In government and high-volume hospital OPDs, physicians face severe time constraints during consultations. Capturing detailed medical history and transcribing previous paper prescriptions consumes valuable clinical time.

**MediKiosk** moves structured information collection to the **first mile** of the patient journey:
1. **Patient Kiosk**: Accessible touch + regional voice intake, document OCR extraction, and urgent red-flag alerts.
2. **Doctor Portal**: Real-time queue, structured AI clinical drafts with confidence scores, document entity verification, and one-click record finalization.
3. **Admin Console**: Kiosk hardware fleet telemetry, questionnaire template management (including AYUSH), and throughput analytics.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗺️ Application Routes

| Experience | URL Route | Description |
|---|---|---|
| **Portal Switcher** | `/` | Main hospital entry & fast-track demo shortcuts |
| **Patient Kiosk** | `/kiosk` | Welcome & Language Selection |
| | `/kiosk/language` | Language Selection (Hindi, Marathi, Tamil, English) |
| | `/kiosk/consent` | Patient Privacy & Consent |
| | `/kiosk/identification` | New / Existing / 1-Click Demo Patient |
| | `/kiosk/details` | Patient Profile Confirmation |
| | `/kiosk/department` | Department & Specialty OPD Selection |
| | `/kiosk/complaint` | Chief Complaint (Voice / Type / Symptom Chips) |
| | `/kiosk/interview` | AI Adaptive Clinical Interview |
| | `/kiosk/documents` | Document Upload & Camera Scan |
| | `/kiosk/document-processing` | OCR Optical Extraction Scanning Progress |
| | `/kiosk/review` | Intake Summary Review |
| | `/kiosk/completed` | Consultation Token & Waiting Guidance |
| | `/kiosk/red-flag` | Urgent Clinical Emergency Escalation |
| **Doctor Portal** | `/doctor/login` | Clinician Authentication |
| | `/doctor/dashboard` | OPD Queue & Metric KPIs |
| | `/doctor/patients/[id]` | Full Patient Workspace & Verification Tabs |
| | `/doctor/documents/[id]` | OCR Document Entity Split Inspector |
| | `/doctor/timeline/[id]` | Longitudinal Medical History Timeline |
| **Admin Portal** | `/admin/login` | System Administrator Auth |
| | `/admin/dashboard` | Operational Telemetry & Analytics |
| | `/admin/kiosks` | Kiosk Fleet Management & Diagnostics |
| | `/admin/templates` | Questionnaire Template Builder |
| | `/admin/doctors` | Clinician Staff Directory |
| | `/admin/departments` | OPD Department Configuration |
| | `/admin/analytics` | Throughput & Language Adoption Charts |
| | `/admin/audit-logs` | Security & Access Audit Trail |
| | `/admin/settings` | Platform Configuration & Adapters |

---

## 🔒 Security & Privacy

- **Zero Real Patient Data**: Default configuration operates in synthetic demo mode.
- **Server-Side Authorization**: Private API keys and service-role secrets are never exposed to browser bundles.
- **PostgreSQL RLS**: Full database schema with Row Level Security in `supabase/migrations/001_initial_schema.sql`.
