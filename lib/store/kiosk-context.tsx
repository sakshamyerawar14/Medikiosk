"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Language,
  Department,
  Patient,
  HistoryAnswer,
  MedicalDocument,
  ClinicalSummary,
  SafetyFlag,
  KioskSession,
} from "@/types";
import { DEMO_PATIENTS, DEMO_DOCUMENTS, DEMO_SUMMARIES, DEMO_ENCOUNTERS } from "@/data/demo/patients";
import { generateId, generateToken } from "@/lib/utils";
import { evaluateRedFlags } from "@/lib/clinical/red-flags";

interface KioskContextType {
  session: KioskSession;
  setLanguage: (lang: Language) => void;
  setConsent: (granted: boolean) => void;
  setPatientInfo: (patient: Partial<Patient>) => void;
  resetPatient: () => void;
  loadDemoPatient: (patientId?: string) => void;
  setDepartment: (dept: Department, name: string) => void;
  setChiefComplaint: (complaint: string) => void;
  addAnswer: (answer: HistoryAnswer) => void;
  removeAnswer: (questionId: string) => void;
  uploadDocument: (doc: MedicalDocument) => void;
  triggerRedFlag: (flag: SafetyFlag) => void;
  completeIntake: () => string; // returns generated token
  resetSession: () => void;
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
}

const initialSession: KioskSession = {
  sessionId: "session-" + Math.random().toString(36).substring(2, 9),
  language: "en",
  consent: false,
  interviewAnswers: [],
  currentQuestionIndex: 0,
  completedSections: [],
  documents: [],
  safetyFlags: [],
  startedAt: new Date().toISOString(),
  lastActivityAt: new Date().toISOString(),
  isDemo: false,
  patient: {},
};

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export function KioskProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<KioskSession>(initialSession);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Load from sessionStorage on mount (transient to kiosk browsing session)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("medikiosk_active_session");
      if (saved) {
        setSession(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to restore session from storage", e);
    }
  }, []);

  // Save to sessionStorage on change
  useEffect(() => {
    try {
      sessionStorage.setItem("medikiosk_active_session", JSON.stringify(session));
    } catch (e) {
      console.error("Failed to save session to storage", e);
    }
  }, [session]);

  // Healthcare Public Kiosk Security: Inactivity auto-purge daemon
  // If patient walks away for 120 seconds, purge all PHI to protect patient privacy
  useEffect(() => {
    const INACTIVITY_LIMIT_MS = 120 * 1000; // 2 minutes

    const updateActivity = () => {
      setSession((prev) => ({
        ...prev,
        lastActivityAt: new Date().toISOString(),
      }));
    };

    const events = ["mousedown", "touchstart", "keydown", "scroll"];
    events.forEach((ev) => window.addEventListener(ev, updateActivity, { passive: true }));

    const interval = setInterval(() => {
      setSession((prev) => {
        const lastActive = new Date(prev.lastActivityAt).getTime();
        const hasSensitiveData =
          (prev.patient && prev.patient.fullName) ||
          prev.interviewAnswers.length > 0 ||
          prev.documents.length > 0;

        if (hasSensitiveData && Date.now() - lastActive > INACTIVITY_LIMIT_MS) {
          console.warn("Kiosk session timed out due to inactivity. Purging PHI for privacy.");
          try {
            sessionStorage.removeItem("medikiosk_active_session");
            localStorage.removeItem("medikiosk_active_session");
          } catch {}
          return {
            ...initialSession,
            startedAt: new Date().toISOString(),
            lastActivityAt: new Date().toISOString(),
          };
        }
        return prev;
      });
    }, 10000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, updateActivity));
      clearInterval(interval);
    };
  }, []);

  const setLanguage = (language: Language) => {
    setSession((prev) => ({ ...prev, language, lastActivityAt: new Date().toISOString() }));
  };

  const setConsent = (granted: boolean) => {
    setSession((prev) => ({ ...prev, consent: granted, lastActivityAt: new Date().toISOString() }));
  };

  const setPatientInfo = (patient: Partial<Patient>) => {
    setSession((prev) => ({
      ...prev,
      patient: { ...prev.patient, ...patient },
      lastActivityAt: new Date().toISOString(),
    }));
  };

  const resetPatient = () => {
    setSession((prev) => ({
      ...prev,
      patient: { gender: "male" },
      isDemo: false,
      lastActivityAt: new Date().toISOString(),
    }));
  };

  const loadDemoPatient = (patientId = "p-001") => {
    const demo = DEMO_PATIENTS.find((p) => p.id === patientId) || DEMO_PATIENTS[0];
    const demoDocs = DEMO_DOCUMENTS.filter((d) => d.patientId === demo.id);
    
    setSession((prev) => ({
      ...prev,
      isDemo: true,
      patient: {
        id: demo.id,
        fullName: demo.fullName,
        age: demo.age,
        dateOfBirth: demo.dateOfBirth,
        gender: demo.gender,
        phone: demo.phone,
        abhaReference: demo.abhaReference,
      },
      documents: demoDocs,
      lastActivityAt: new Date().toISOString(),
    }));
  };

  const setDepartment = (department: Department, departmentName: string) => {
    setSession((prev) => ({
      ...prev,
      department,
      departmentName,
      lastActivityAt: new Date().toISOString(),
    }));
  };

  const setChiefComplaint = (chiefComplaint: string) => {
    setSession((prev) => {
      const flags = evaluateRedFlags(prev.interviewAnswers, chiefComplaint);
      return {
        ...prev,
        chiefComplaint,
        safetyFlags: [...prev.safetyFlags, ...flags],
        lastActivityAt: new Date().toISOString(),
      };
    });
  };

  const addAnswer = (answer: HistoryAnswer) => {
    setSession((prev) => {
      const filtered = prev.interviewAnswers.filter((a) => a.clinicalConcept !== answer.clinicalConcept);
      const updatedAnswers = [...filtered, answer];
      const flags = evaluateRedFlags(updatedAnswers, prev.chiefComplaint);
      return {
        ...prev,
        interviewAnswers: updatedAnswers,
        safetyFlags: flags,
        lastActivityAt: new Date().toISOString(),
      };
    });
  };

  const removeAnswer = (concept: string) => {
    setSession((prev) => ({
      ...prev,
      interviewAnswers: prev.interviewAnswers.filter((a) => a.clinicalConcept !== concept),
      lastActivityAt: new Date().toISOString(),
    }));
  };

  const uploadDocument = (doc: MedicalDocument) => {
    setSession((prev) => ({
      ...prev,
      documents: [...prev.documents, doc],
      lastActivityAt: new Date().toISOString(),
    }));
  };

  const triggerRedFlag = (flag: SafetyFlag) => {
    setSession((prev) => ({
      ...prev,
      safetyFlags: [...prev.safetyFlags, flag],
      lastActivityAt: new Date().toISOString(),
    }));
  };

  const completeIntake = (): string => {
    const token = generateToken();
    setSession((prev) => ({
      ...prev,
      token,
      submissionStatus: "submitted",
      lastActivityAt: new Date().toISOString(),
    }));
    return token;
  };

  const resetSession = () => {
    const fresh: KioskSession = {
      sessionId: "session-" + Math.random().toString(36).substring(2, 9),
      language: "en",
      consent: false,
      interviewAnswers: [],
      currentQuestionIndex: 0,
      completedSections: [],
      documents: [],
      safetyFlags: [],
      startedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      isDemo: false,
      patient: {},
    };
    setSession(fresh);
    try {
      sessionStorage.removeItem("medikiosk_active_session");
      localStorage.removeItem("medikiosk_active_session");
    } catch (e) {}
  };

  const toggleAudioMute = () => {
    setIsAudioMuted((prev) => !prev);
  };

  return (
    <KioskContext.Provider
      value={{
        session,
        setLanguage,
        setConsent,
        setPatientInfo,
        resetPatient,
        loadDemoPatient,
        setDepartment,
        setChiefComplaint,
        addAnswer,
        removeAnswer,
        uploadDocument,
        triggerRedFlag,
        completeIntake,
        resetSession,
        isAudioMuted,
        toggleAudioMute,
      }}
    >
      {children}
    </KioskContext.Provider>
  );
}

export function useKiosk() {
  const context = useContext(KioskContext);
  if (!context) {
    throw new Error("useKiosk must be used within a KioskProvider");
  }
  return context;
}
