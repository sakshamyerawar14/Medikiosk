-- ============================================================
-- MediKiosk — PostgreSQL / Supabase Initial Schema & RLS
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'admin', 'staff')),
  department_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  phone TEXT,
  abha_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Encounters Table
CREATE TABLE IF NOT EXISTS encounters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id),
  language TEXT NOT NULL DEFAULT 'en',
  chief_complaint TEXT,
  status TEXT NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'interviewing', 'documents_processing', 'ready_for_review', 'doctor_review', 'verified', 'cancelled')),
  token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Interview Questions Table
CREATE TABLE IF NOT EXISTS interview_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinical_concept TEXT NOT NULL,
  section TEXT NOT NULL,
  question_key TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'choice',
  active BOOLEAN DEFAULT TRUE
);

-- History Answers Table
CREATE TABLE IF NOT EXISTS history_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
  question_id UUID REFERENCES interview_questions(id),
  clinical_concept TEXT NOT NULL,
  question_text TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  answer_json JSONB,
  source TEXT NOT NULL CHECK (source IN ('voice', 'touch', 'text', 'document', 'doctor')),
  confidence NUMERIC(4,3),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  encounter_id UUID REFERENCES encounters(id),
  storage_path TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('prescription', 'lab_report', 'discharge_summary', 'imaging_report', 'other')),
  document_date DATE,
  ocr_status TEXT NOT NULL DEFAULT 'pending',
  extraction_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document Entities Table
CREATE TABLE IF NOT EXISTS document_entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  value TEXT,
  unit TEXT,
  reference_range TEXT,
  confidence NUMERIC(4,3),
  verification_status TEXT NOT NULL DEFAULT 'needs_review' CHECK (verification_status IN ('verified', 'needs_review', 'rejected', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinical Summaries Table
CREATE TABLE IF NOT EXISTS clinical_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  summary_json JSONB NOT NULL,
  generated_by TEXT NOT NULL DEFAULT 'ai',
  doctor_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safety Alerts Table
CREATE TABLE IF NOT EXISTS safety_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  message TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'voice',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Consents Table
CREATE TABLE IF NOT EXISTS consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  encounter_id UUID REFERENCES encounters(id),
  consent_type TEXT NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT TRUE,
  language TEXT NOT NULL DEFAULT 'en',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id),
  actor_role TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE history_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
