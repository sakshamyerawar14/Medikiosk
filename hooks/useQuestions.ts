"use client";

import { useMemo, useState } from "react";
import { Department, HistoryAnswer, Language } from "@/types";
import { getQuestionSetForDepartment, getNextInterviewState } from "@/lib/clinical/engine";

export function useQuestions(department?: Department | string, language: Language = "en") {
  const questions = useMemo(() => getQuestionSetForDepartment(department), [department]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<HistoryAnswer[]>([]);

  const currentQuestion = questions[currentIndex] || null;
  const isComplete = currentIndex >= questions.length;
  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / questions.length) * 100));

  const submitAnswer = (answer: HistoryAnswer) => {
    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);
    const nextState = getNextInterviewState({ department: department as any }, updatedAnswers, currentIndex + 1);
    setCurrentIndex(currentIndex + 1);
    return nextState;
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const resetQuestions = () => {
    setCurrentIndex(0);
    setAnswers([]);
  };

  return {
    questions,
    currentIndex,
    currentQuestion,
    totalQuestions: questions.length,
    answers,
    isComplete,
    progressPercent,
    submitAnswer,
    goToPrevious,
    resetQuestions,
  };
}
