-- ============================================================
-- MediKiosk — Database Seed Script (Strict Hexadecimal UUIDs)
-- ============================================================

-- 1. Insert Departments
INSERT INTO departments (id, name, type, active, created_at)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'General Medicine', 'allopathy', true, NOW()),
  ('10000000-0000-0000-0000-000000000002', 'Cardiology', 'allopathy', true, NOW()),
  ('10000000-0000-0000-0000-000000000003', 'Orthopedics', 'allopathy', true, NOW()),
  ('10000000-0000-0000-0000-000000000004', 'Dermatology', 'allopathy', true, NOW()),
  ('10000000-0000-0000-0000-000000000005', 'Neurology', 'allopathy', true, NOW()),
  ('10000000-0000-0000-0000-000000000006', 'AYUSH (Ayurveda)', 'ayush', true, NOW()),
  ('10000000-0000-0000-0000-000000000007', 'Pediatrics', 'allopathy', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Doctor & Admin Profiles
INSERT INTO profiles (id, full_name, role, department_id, created_at, updated_at)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'Dr. Vikram Seth', 'doctor', '10000000-0000-0000-0000-000000000002', NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000002', 'Dr. Ananya Roy', 'doctor', '10000000-0000-0000-0000-000000000001', NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000003', 'Dr. Rajesh Kulkarni', 'doctor', '10000000-0000-0000-0000-000000000003', NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000004', 'Vaidya Shreya Joshi', 'doctor', '10000000-0000-0000-0000-000000000006', NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000005', 'System Administrator', 'admin', NULL, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Synthetic Demo Patients (No Real PII)
INSERT INTO patients (id, full_name, date_of_birth, gender, phone, abha_reference, created_at, updated_at)
VALUES
  ('30000000-0000-0000-0000-000000000001', 'Ramesh Kumar', '1974-05-14', 'male', '+91 98765 43210', '91-4523-8891-2014', NOW(), NOW()),
  ('30000000-0000-0000-0000-000000000002', 'Sunita Patil', '1988-11-22', 'female', '+91 98112 34567', '91-8842-1093-6745', NOW(), NOW()),
  ('30000000-0000-0000-0000-000000000003', 'Ahmed Khan', '1959-03-10', 'male', '+91 97234 56789', '91-1209-7734-9981', NOW(), NOW()),
  ('30000000-0000-0000-0000-000000000004', 'Priya Sharma', '1997-07-19', 'female', '+91 99887 76655', '91-6677-4433-2211', NOW(), NOW()),
  ('30000000-0000-0000-0000-000000000005', 'Rajendra Deshmukh', '1965-02-18', 'male', '+91 94220 12345', '91-3344-5566-7788', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Encounters
INSERT INTO encounters (id, patient_id, department_id, language, chief_complaint, status, token, created_at, completed_at)
VALUES
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'hi', 'Chest discomfort and heaviness across central chest for 2 days', 'ready_for_review', 'A-127', NOW() - INTERVAL '15 minutes', NOW()),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'mr', 'High grade fever with body aches for 3 days', 'ready_for_review', 'B-042', NOW() - INTERVAL '30 minutes', NOW()),
  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'en', 'Severe bilateral knee pain on climbing stairs', 'doctor_review', 'C-109', NOW() - INTERVAL '45 minutes', NOW()),
  ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'en', 'Pruritic erythematous rash on bilateral forearms', 'verified', 'D-088', NOW() - INTERVAL '60 minutes', NOW()),
  ('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000006', 'mr', 'Chronic constipation, bloating (Vata prakopa) and disturbed sleep', 'ready_for_review', 'E-015', NOW() - INTERVAL '75 minutes', NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Documents
INSERT INTO documents (id, patient_id, encounter_id, storage_path, document_type, document_date, ocr_status, extraction_status, created_at)
VALUES
  ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'sample-docs/prescription_june_2026.pdf', 'prescription', '2026-06-15', 'completed', 'completed', NOW() - INTERVAL '10 minutes'),
  ('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'sample-docs/lipid_panel_may_2026.pdf', 'lab_report', '2026-05-10', 'completed', 'completed', NOW() - INTERVAL '10 minutes')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Extracted Document Entities
INSERT INTO document_entities (id, document_id, entity_type, entity_name, value, unit, reference_range, confidence, verification_status, created_at)
VALUES
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'medication', 'Amlodipine', '5 mg OD', 'mg', NULL, 0.94, 'verified', NOW()),
  ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', 'medication', 'Metoprolol Succinate', '25 mg OD', 'mg', NULL, 0.91, 'needs_review', NOW()),
  ('60000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000001', 'diagnosis', 'Primary Hypertension', 'Diagnosed 2024', NULL, NULL, 0.89, 'verified', NOW()),
  ('60000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000002', 'investigation', 'Serum Total Cholesterol', '218', 'mg/dL', '< 200 mg/dL', 0.96, 'verified', NOW()),
  ('60000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000002', 'investigation', 'Serum Triglycerides', '185', 'mg/dL', '< 150 mg/dL', 0.95, 'verified', NOW())
ON CONFLICT (id) DO NOTHING;

-- 7. Insert AI Structured Summary Draft
INSERT INTO clinical_summaries (id, encounter_id, version, summary_json, generated_by, doctor_verified, verified_by, created_at, updated_at)
VALUES
  (
    '70000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    1,
    '{
      "chiefComplaint": { "content": "Chest discomfort and heaviness across central chest for 2 days, worsening with exertion.", "source": "voice", "confidence": "high", "aiGenerated": true, "doctorVerified": false },
      "historyOfPresentIllness": { "content": "Patient reports gradual onset retrosternal chest heaviness starting 48 hours ago. Pain is 6/10 on exertion, resolving with rest. Mild shortness of breath on walking. Denies nausea or diaphoresis.", "source": "voice", "confidence": "high", "aiGenerated": true, "doctorVerified": false },
      "pastMedicalHistory": { "content": "Known case of Primary Hypertension (diagnosed 2024). Borderline Dyslipidemia on May 2026 panel.", "source": "document", "confidence": "high", "aiGenerated": true, "doctorVerified": false },
      "pastSurgicalHistory": { "content": "No previous major surgeries reported.", "source": "touch", "confidence": "medium", "aiGenerated": true, "doctorVerified": false },
      "medicationHistory": [
        { "name": "Amlodipine", "dose": "5 mg", "frequency": "Once daily (Morning)", "duration": "2 years", "source": "document", "confidence": 0.94, "verificationStatus": "verified" },
        { "name": "Metoprolol Succinate", "dose": "25 mg", "frequency": "Once daily", "duration": "Ongoing", "source": "document", "confidence": 0.91, "verificationStatus": "needs_review" }
      ],
      "allergyHistory": [
        { "allergen": "Sulfa drugs", "reaction": "Skin rash and itching", "severity": "Moderate", "source": "voice", "confidence": 0.88, "verificationStatus": "verified" }
      ],
      "familyHistory": { "content": "Father had myocardial infarction at age 58. Mother has Type 2 Diabetes.", "source": "voice", "confidence": "medium", "aiGenerated": true, "doctorVerified": false },
      "personalHistory": { "content": "Non-smoker. Moderate physical activity. Mixed vegetarian diet.", "source": "touch", "confidence": "medium", "aiGenerated": true, "doctorVerified": false },
      "reviewOfSystems": { "content": "Cardiovascular: +Chest heaviness, +Exertional dyspnea. Respiratory: Negative for chronic cough.", "source": "voice", "confidence": "high", "aiGenerated": true, "doctorVerified": false },
      "previousInvestigations": [
        { "name": "Serum Total Cholesterol", "value": "218", "unit": "mg/dL", "referenceRange": "< 200 mg/dL", "date": "2026-05-10", "source": "document", "confidence": 0.96, "verificationStatus": "verified" },
        { "name": "Serum Triglycerides", "value": "185", "unit": "mg/dL", "referenceRange": "< 150 mg/dL", "date": "2026-05-10", "source": "document", "confidence": 0.95, "verificationStatus": "verified" }
      ],
      "documentTimeline": [
        { "id": "tl-1", "date": "2024-03-12", "year": 2024, "eventType": "diagnosis", "title": "Primary Hypertension Diagnosed", "description": "Started on Amlodipine 5mg OD at District Hospital.", "confidence": "high" },
        { "id": "tl-2", "date": "2026-05-10", "year": 2026, "eventType": "document", "title": "Lipid Profile & Metabolic Panel", "description": "Elevated Total Cholesterol (218 mg/dL) and Triglycerides (185 mg/dL).", "confidence": "high" },
        { "id": "tl-3", "date": "2026-06-15", "year": 2026, "eventType": "medication", "title": "Prescription Refill — Dr. Mehta", "description": "Amlodipine 5mg + Metoprolol Succinate 25mg prescribed.", "confidence": "high" },
        { "id": "tl-4", "date": "2026-08-27", "year": 2026, "eventType": "encounter", "title": "Current Intake — Chest Discomfort", "description": "MediKiosk Intake Token A-127.", "confidence": "high" }
      ],
      "unresolvedItems": [
        "Duration and exact compliance with Metoprolol Succinate needs clinical verification.",
        "Clarify if exertional discomfort is relieved by rest within 5 minutes."
      ],
      "safetyFlags": [
        { "id": "flag-1", "alertType": "Potential Cardiac Chest Discomfort", "severity": "high", "message": "Patient reported exertional chest heaviness with cardiovascular risk factors.", "source": "voice", "status": "active" }
      ]
    }'::jsonb,
    'ai',
    false,
    NULL,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- 8. Insert Safety Alerts
INSERT INTO safety_alerts (id, encounter_id, alert_type, severity, message, source, status, created_at)
VALUES
  ('80000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Potential Cardiac Chest Discomfort', 'high', 'Patient reported exertional chest heaviness with cardiovascular risk factors. Prioritize clinical evaluation & ECG.', 'voice', 'active', NOW() - INTERVAL '12 minutes')
ON CONFLICT (id) DO NOTHING;

-- 9. Insert Audit Logs
INSERT INTO audit_logs (id, actor_id, actor_role, action, resource_type, resource_id, metadata, created_at)
VALUES
  ('90000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'doctor', 'Verified Clinical Intake', 'Encounter', '40000000-0000-0000-0000-000000000004', '{"token": "D-088", "patient": "Priya Sharma", "verified_sections": 9}'::jsonb, NOW() - INTERVAL '40 minutes'),
  ('90000000-0000-0000-0000-000000000002', NULL, 'patient', 'Completed Kiosk Intake', 'Encounter', '40000000-0000-0000-0000-000000000001', '{"token": "A-127", "input_modes": ["voice", "touch"], "documents_uploaded": 2}'::jsonb, NOW() - INTERVAL '15 minutes'),
  ('90000000-0000-0000-0000-000000000003', NULL, 'staff', 'Generated Clinical Draft Summary', 'ClinicalSummary', '70000000-0000-0000-0000-000000000001', '{"confidence_score": 0.92, "red_flags": 1}'::jsonb, NOW() - INTERVAL '14 minutes')
ON CONFLICT (id) DO NOTHING;

-- 10. Enable Read & Write Policies for Application Client
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Allow public read profiles') THEN
    CREATE POLICY "Allow public read profiles" ON profiles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patients' AND policyname = 'Allow public read patients') THEN
    CREATE POLICY "Allow public read patients" ON patients FOR SELECT USING (true);
    CREATE POLICY "Allow public insert patients" ON patients FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow public update patients" ON patients FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'encounters' AND policyname = 'Allow public read encounters') THEN
    CREATE POLICY "Allow public read encounters" ON encounters FOR SELECT USING (true);
    CREATE POLICY "Allow public insert encounters" ON encounters FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow public update encounters" ON encounters FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'Allow public read documents') THEN
    CREATE POLICY "Allow public read documents" ON documents FOR SELECT USING (true);
    CREATE POLICY "Allow public insert documents" ON documents FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'document_entities' AND policyname = 'Allow public read document_entities') THEN
    CREATE POLICY "Allow public read document_entities" ON document_entities FOR SELECT USING (true);
    CREATE POLICY "Allow public update document_entities" ON document_entities FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clinical_summaries' AND policyname = 'Allow public read clinical_summaries') THEN
    CREATE POLICY "Allow public read clinical_summaries" ON clinical_summaries FOR SELECT USING (true);
    CREATE POLICY "Allow public update clinical_summaries" ON clinical_summaries FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'departments' AND policyname = 'Allow public read departments') THEN
    CREATE POLICY "Allow public read departments" ON departments FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'safety_alerts' AND policyname = 'Allow public read safety_alerts') THEN
    CREATE POLICY "Allow public read safety_alerts" ON safety_alerts FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'Allow public read audit_logs') THEN
    CREATE POLICY "Allow public read audit_logs" ON audit_logs FOR SELECT USING (true);
    CREATE POLICY "Allow public insert audit_logs" ON audit_logs FOR INSERT WITH CHECK (true);
  END IF;
END $$;
