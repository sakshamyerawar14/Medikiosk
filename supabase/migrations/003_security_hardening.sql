-- ============================================================
-- Migration: 003_security_hardening.sql
-- Purpose: Revoke blanket public RLS policies, enforce strict role-based
-- access control, enable RLS on missing tables, secure audit logs,
-- and add foreign key and lookup performance indexes.
-- ============================================================

-- 1. Enable RLS on previously omitted tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;

-- 2. Drop all insecure, overly-permissive blanket policies
DO $$
BEGIN
  -- Drop policies on profiles
  DROP POLICY IF EXISTS "Allow public read profiles" ON profiles;

  -- Drop policies on patients
  DROP POLICY IF EXISTS "Allow public read patients" ON patients;
  DROP POLICY IF EXISTS "Allow public insert patients" ON patients;
  DROP POLICY IF EXISTS "Allow public update patients" ON patients;

  -- Drop policies on encounters
  DROP POLICY IF EXISTS "Allow public read encounters" ON encounters;
  DROP POLICY IF EXISTS "Allow public insert encounters" ON encounters;
  DROP POLICY IF EXISTS "Allow public update encounters" ON encounters;

  -- Drop policies on documents
  DROP POLICY IF EXISTS "Allow public read documents" ON documents;
  DROP POLICY IF EXISTS "Allow public insert documents" ON documents;

  -- Drop policies on document_entities
  DROP POLICY IF EXISTS "Allow public read document_entities" ON document_entities;
  DROP POLICY IF EXISTS "Allow public update document_entities" ON document_entities;

  -- Drop policies on clinical_summaries
  DROP POLICY IF EXISTS "Allow public read clinical_summaries" ON clinical_summaries;
  DROP POLICY IF EXISTS "Allow public update clinical_summaries" ON clinical_summaries;

  -- Drop policies on departments
  DROP POLICY IF EXISTS "Allow public read departments" ON departments;

  -- Drop policies on safety_alerts
  DROP POLICY IF EXISTS "Allow public read safety_alerts" ON safety_alerts;

  -- Drop policies on audit_logs (CRITICAL: prevent audit poisoning and leakage)
  DROP POLICY IF EXISTS "Allow public read audit_logs" ON audit_logs;
  DROP POLICY IF EXISTS "Allow public insert audit_logs" ON audit_logs;
END $$;

-- 3. Define Hardened, Principle-of-Least-Privilege RLS Policies

-- DEPARTMENTS
-- Anyone (including kiosks) can read active departments
CREATE POLICY "Allow public read active departments"
  ON departments FOR SELECT
  USING (active = true);

-- Only authenticated administrators can modify departments
CREATE POLICY "Allow admin manage departments"
  ON departments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- INTERVIEW QUESTIONS
-- Anyone (kiosk intake) can read active questions
CREATE POLICY "Allow public read active questions"
  ON interview_questions FOR SELECT
  USING (active = true);

-- Only administrators can manage interview questions
CREATE POLICY "Allow admin manage questions"
  ON interview_questions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- PROFILES
-- Authenticated users can read their own profile
CREATE POLICY "Allow users read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR role IN ('doctor', 'admin'));

-- Only admins can insert or delete profiles
CREATE POLICY "Allow admin manage profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- PATIENTS (PHI Protected)
-- Clinicians and administrators can view patients
CREATE POLICY "Allow clinicians read patients"
  ON patients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('doctor', 'admin', 'staff')
    )
  );

-- ENCOUNTERS
-- Clinicians and staff can view encounters
CREATE POLICY "Allow clinicians read encounters"
  ON encounters FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('doctor', 'admin', 'staff')
    )
  );

-- CLINICAL SUMMARIES
-- Clinicians can read summaries
CREATE POLICY "Allow clinicians read summaries"
  ON clinical_summaries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('doctor', 'admin')
    )
  );

-- Only doctors can verify or edit clinical summaries
CREATE POLICY "Allow doctors update summaries"
  ON clinical_summaries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('doctor', 'admin')
    )
  );

-- SAFETY ALERTS
-- Clinicians and staff can read and manage alerts
CREATE POLICY "Allow staff manage alerts"
  ON safety_alerts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('doctor', 'admin', 'staff')
    )
  );

-- AUDIT LOGS
-- STRICT FORENSIC CONTROL: Only administrators can read audit logs.
-- Public/anonymous read is strictly REVOKED.
-- Inserts occur exclusively via backend service-role or SECURITY DEFINER procedures.
CREATE POLICY "Allow admin read audit_logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 4. Create Foreign Key and Query Performance Indexes
-- Prevents sequential table scans, DoS on joins, and cascading deletion locks

CREATE INDEX IF NOT EXISTS idx_encounters_patient_id ON encounters(patient_id);
CREATE INDEX IF NOT EXISTS idx_encounters_department_id ON encounters(department_id);
CREATE INDEX IF NOT EXISTS idx_encounters_status ON encounters(status);
CREATE INDEX IF NOT EXISTS idx_encounters_token ON encounters(token);
CREATE INDEX IF NOT EXISTS idx_encounters_created_at ON encounters(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_history_answers_encounter_id ON history_answers(encounter_id);
CREATE INDEX IF NOT EXISTS idx_history_answers_clinical_concept ON history_answers(clinical_concept);

CREATE INDEX IF NOT EXISTS idx_documents_patient_id ON documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_documents_encounter_id ON documents(encounter_id);

CREATE INDEX IF NOT EXISTS idx_document_entities_document_id ON document_entities(document_id);
CREATE INDEX IF NOT EXISTS idx_document_entities_type ON document_entities(entity_type);

CREATE INDEX IF NOT EXISTS idx_clinical_summaries_encounter_id ON clinical_summaries(encounter_id);
CREATE INDEX IF NOT EXISTS idx_safety_alerts_encounter_id ON safety_alerts(encounter_id);
CREATE INDEX IF NOT EXISTS idx_safety_alerts_status ON safety_alerts(status);

CREATE INDEX IF NOT EXISTS idx_consents_patient_id ON consents(patient_id);
CREATE INDEX IF NOT EXISTS idx_consents_encounter_id ON consents(encounter_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_abha ON patients(abha_reference);
