import { CLINICAL_QUESTION_FLOW, AYUSH_QUESTION_FLOW, LocalizedQuestion } from "@/data/questions/clinical-questions";
import { Department, HistoryAnswer, Language, KioskSession } from "@/types";
import { evaluateRedFlags } from "./red-flags";

export interface InterviewState {
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion: LocalizedQuestion | null;
  answers: HistoryAnswer[];
  isComplete: boolean;
  hasRedFlags: boolean;
}

export function getQuestionSetForDepartment(department?: Department): LocalizedQuestion[] {
  if (department === "ayush") {
    return [...CLINICAL_QUESTION_FLOW.slice(0, 4), ...AYUSH_QUESTION_FLOW];
  }
  return CLINICAL_QUESTION_FLOW;
}

export function getNextInterviewState(
  session: Partial<KioskSession>,
  answers: HistoryAnswer[],
  currentIndex: number
): InterviewState {
  const questionSet = getQuestionSetForDepartment(session.department);
  const totalQuestions = questionSet.length;
  const isComplete = currentIndex >= totalQuestions;
  const currentQuestion = isComplete ? null : questionSet[currentIndex];

  const safetyFlags = evaluateRedFlags(answers, session.chiefComplaint);
  const hasRedFlags = safetyFlags.some((f) => f.severity === "critical" || f.severity === "high");

  return {
    currentQuestionIndex: currentIndex,
    totalQuestions,
    currentQuestion,
    answers,
    isComplete,
    hasRedFlags,
  };
}
