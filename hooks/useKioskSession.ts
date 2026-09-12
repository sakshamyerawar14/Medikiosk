"use client";

import { useKiosk } from "@/lib/store/kiosk-context";
import {
  createSessionAction,
  submitConsentAction,
  submitResponseAction,
  finalizeSessionAction,
} from "@/lib/actions/kiosk";
import { useCallback, useState } from "react";
import { HistoryAnswer, Language } from "@/types";

export function useKioskSession() {
  const kiosk = useKiosk();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initSession = useCallback(
    async (language: Language = "en") => {
      setIsSubmitting(true);
      setError(null);
      try {
        const res = await createSessionAction({
          language,
        });

        if (res.success) {
          kiosk.setLanguage(language);
        }
        return res;
      } catch (err: any) {
        setError(err.message || "Failed to initialize session");
        return { success: false, error: err.message };
      } finally {
        setIsSubmitting(false);
      }
    },
    [kiosk]
  );

  const recordConsent = useCallback(
    async (consentType = "intake_interview") => {
      const patientId = kiosk.session.patient?.id || "walk-in-patient";
      return await submitConsentAction({
        patientId,
        encounterId: kiosk.session.encounterId || undefined,
        consentType,
        granted: true,
        language: kiosk.session.language,
      });
    },
    [kiosk.session.patient?.id, kiosk.session.encounterId, kiosk.session.language]
  );

  const recordAnswer = useCallback(
    async (answer: HistoryAnswer) => {
      kiosk.addAnswer(answer);
      if (kiosk.session.sessionId) {
        return await submitResponseAction({
          encounterId: kiosk.session.sessionId,
          questionId: answer.questionId,
          clinicalConcept: answer.clinicalConcept,
          questionText: answer.questionText,
          answerText: answer.answerText,
          source: answer.source,
          confidence: answer.confidence || 1.0,
          isRedFlag: false,
        });
      }
      return { success: true, isRedFlag: false, activeFlags: [] };
    },
    [kiosk]
  );

  const finalizeIntake = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const res = await finalizeSessionAction({
        encounterId: kiosk.session.sessionId || "demo-session",
        chiefComplaint: kiosk.session.chiefComplaint || "General checkup",
        answers: kiosk.session.interviewAnswers,
      });
      return res;
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [kiosk.session.sessionId, kiosk.session.chiefComplaint, kiosk.session.interviewAnswers]);

  return {
    ...kiosk,
    session: kiosk.session,
    isSubmitting,
    error,
    initSession,
    recordConsent,
    recordAnswer,
    finalizeIntake,
  };
}
