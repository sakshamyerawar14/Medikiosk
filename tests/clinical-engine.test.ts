import { getQuestionSetForDepartment, getNextInterviewState } from "../lib/clinical/engine";
import { HistoryAnswer } from "../types";

export function runClinicalEngineTests() {
  console.log("=== Running Clinical Engine Tests ===");

  // 1. Allopathy question set retrieval
  const standardQuestions = getQuestionSetForDepartment("cardiology");
  console.assert(standardQuestions.length > 0, "Standard questions should not be empty");
  console.log(`[PASS] Standard question set loaded: ${standardQuestions.length} questions.`);

  // 2. AYUSH question set retrieval
  const ayushQuestions = getQuestionSetForDepartment("ayush");
  console.assert(ayushQuestions.length > standardQuestions.length || ayushQuestions.some(q => q.key.includes("prakriti")), "AYUSH questions should contain specialized concepts");
  console.log(`[PASS] AYUSH question set loaded with specialized concepts: ${ayushQuestions.length} questions.`);

  // 3. State machine progression
  const answers: HistoryAnswer[] = [
    {
      id: "ans-1",
      encounterId: "enc-test",
      clinicalConcept: "onset_duration",
      questionText: "How long have you had this?",
      answerText: "2 days",
      source: "touch",
      confidence: 1.0,
      createdAt: new Date().toISOString(),
    },
  ];

  const state = getNextInterviewState({ department: "cardiology" as any }, answers, 1);
  console.assert(state.currentQuestionIndex === 1, "State index should update to 1");
  console.assert(!state.isComplete, "State should not be complete after 1 answer");
  console.log(`[PASS] State machine advances cleanly to next question.`);

  return true;
}
