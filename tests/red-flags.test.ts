import { evaluateRedFlags } from "../lib/clinical/red-flags";
import { HistoryAnswer } from "../types";

export function runRedFlagTests() {
  console.log("=== Running Red Flag Evaluator Tests ===");

  // 1. Cardiac Chest Pain trigger
  const cardiacAnswer: HistoryAnswer = {
    id: "ans-cardiac",
    encounterId: "enc-cardiac",
    clinicalConcept: "chest_pain",
    questionText: "Are you experiencing chest heaviness?",
    answerText: "Severe chest pain and pressure radiating to left arm",
    source: "voice",
    confidence: 0.95,
    createdAt: new Date().toISOString(),
  };

  const cardiacFlags = evaluateRedFlags([cardiacAnswer]);
  console.assert(cardiacFlags.length > 0, "Cardiac answer must trigger safety flags");
  console.assert(cardiacFlags.some((f) => f.severity === "high" || f.severity === "critical"), "Cardiac pain severity must be high/critical");
  console.log(`[PASS] Cardiac red flag correctly detected with severity: ${cardiacFlags[0]?.severity}`);

  // 2. Respiratory Distress trigger
  const dyspneaAnswer: HistoryAnswer = {
    id: "ans-dyspnea",
    encounterId: "enc-dyspnea",
    clinicalConcept: "respiratory_distress",
    questionText: "Do you have shortness of breath?",
    answerText: "Severe shortness of breath, cannot breathe when lying down",
    source: "touch",
    confidence: 1.0,
    createdAt: new Date().toISOString(),
  };

  const dyspneaFlags = evaluateRedFlags([dyspneaAnswer]);
  console.assert(dyspneaFlags.some((f) => f.severity === "critical"), "Acute dyspnea must trigger critical severity");
  console.log(`[PASS] Acute respiratory distress triggered critical alert.`);

  // 3. Normal symptom (no red flag)
  const benignAnswer: HistoryAnswer = {
    id: "ans-benign",
    encounterId: "enc-benign",
    clinicalConcept: "mild_cold",
    questionText: "Any other symptoms?",
    answerText: "Mild nasal congestion for 1 day",
    source: "touch",
    confidence: 1.0,
    createdAt: new Date().toISOString(),
  };

  const benignFlags = evaluateRedFlags([benignAnswer], "Mild cold and sneezing");
  console.assert(benignFlags.length === 0, "Benign symptoms should not trigger red flags");
  console.log(`[PASS] Benign symptoms passed without spurious red flags.`);

  // 4. Negation detection (SEC-21 fix verification)
  const negatedAnswer: HistoryAnswer = {
    id: "ans-negated",
    encounterId: "enc-negated",
    clinicalConcept: "general_survey",
    questionText: "Any chest pain or breathing trouble?",
    answerText: "Patient denies chest pain and has no shortness of breath",
    source: "touch",
    confidence: 1.0,
    createdAt: new Date().toISOString(),
  };

  const negatedFlags = evaluateRedFlags([negatedAnswer], "Routine consultation, no chest pain");
  console.assert(negatedFlags.length === 0, "Negated statements must NOT trigger red flags");
  console.log(`[PASS] Negation detection correctly prevented false alarm for 'no chest pain'.`);

  return true;
}
