"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/store/kiosk-context";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { KioskProgress } from "@/components/kiosk/KioskProgress";
import { AudioPlayer } from "@/components/kiosk/AudioPlayer";
import { VoiceRecorder } from "@/components/kiosk/VoiceRecorder";
import { Button } from "@/components/ui/button";
import { getQuestionSetForDepartment } from "@/lib/clinical/interview-engine";
import { HistoryAnswer, InputSource } from "@/types";
import {
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  Volume2,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";

export default function ClinicalInterviewPage() {
  const router = useRouter();
  const { session, addAnswer, triggerRedFlag } = useKiosk();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [voiceAnswer, setVoiceAnswer] = useState<string>("");

  const questions = getQuestionSetForDepartment(session.department);
  const total = questions.length;
  const currentQ = questions[questionIndex] || questions[0];

  const lang = (session.language || "en") as "en" | "hi" | "mr" | "ta";
  const questionTitle = currentQ.text[lang] || currentQ.text.en;
  const audioPromptText = currentQ.audioPrompt?.[lang] || currentQ.audioPrompt?.en || questionTitle;

  const handleOptionSelect = (option: (typeof currentQ.options)[0]) => {
    setSelectedOption(option.value);
    const labelText = option.label[lang] || option.label.en;

    const answerRecord: HistoryAnswer = {
      id: `ans-${Math.random().toString(36).substring(2, 9)}`,
      encounterId: session.encounterId || "enc-001",
      clinicalConcept: currentQ.key,
      questionText: questionTitle,
      answerText: labelText,
      source: "touch",
      confidence: 1.0,
      createdAt: new Date().toISOString(),
    };

    addAnswer(answerRecord);

    // If option is a red flag trigger
    if (option.isRedFlag) {
      triggerRedFlag({
        id: `rf-${Date.now()}`,
        alertType: `Clinical Alert: ${currentQ.key}`,
        severity: "high",
        message: `Patient reported critical symptom: ${labelText}`,
        source: "touch",
        status: "active",
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setVoiceAnswer(text);
    const answerRecord: HistoryAnswer = {
      id: `ans-${Math.random().toString(36).substring(2, 9)}`,
      encounterId: session.encounterId || "enc-001",
      clinicalConcept: currentQ.key,
      questionText: questionTitle,
      answerText: text,
      source: "voice",
      confidence: 0.95,
      createdAt: new Date().toISOString(),
    };
    addAnswer(answerRecord);
  };

  const handleNext = () => {
    if (questionIndex + 1 < total) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption("");
      setVoiceAnswer("");
    } else {
      // Finished all interview questions, navigate to document upload
      router.push("/kiosk/documents");
    }
  };

  const handleBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
      setSelectedOption("");
      setVoiceAnswer("");
    } else {
      router.push("/kiosk/complaint");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
      <div>
        <KioskHeader
          title={`Clinical Intake: Question ${questionIndex + 1} of ${total}`}
          subtitle="Adaptive medical questionnaire"
        />
        <KioskProgress currentStep={6} />
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col items-center">
        {/* Step Indicator & AI Question Card */}
        <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0F172A] text-white">
                Question {questionIndex + 1} / {total}
              </span>
              <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider">
                Section: {currentQ.section.replace(/_/g, " ")}
              </span>
            </div>

            <AudioPlayer text={audioPromptText} autoPlay key={currentQ.key} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-heading leading-snug mb-2">
            {questionTitle}
          </h2>
          <p className="text-sm text-[#64748B]">
            Please speak your response or tap the best matching option below.
          </p>
        </div>

        {/* Touch Answer Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mb-6">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.value;
            const labelText = opt.label[lang] || opt.label.en;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleOptionSelect(opt)}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left touch-target cursor-pointer ${
                  isSelected
                    ? "bg-[#F8FAFC] border-[#0F172A] shadow-md ring-2 ring-[#0F172A]"
                    : "bg-white border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] shadow-sm"
                }`}
              >
                <span className="text-base font-bold text-[#0F172A]">
                  {labelText}
                </span>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    isSelected
                      ? "bg-[#0F172A] text-white"
                      : "border-2 border-[#CBD5E1] text-transparent"
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Voice Alternative */}
        <div className="w-full max-w-2xl mb-8">
          <VoiceRecorder
            onTranscript={handleVoiceTranscript}
            placeholderText="Or tap to speak your answer to this question..."
          />
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center justify-between w-full max-w-xl gap-4">
          <Button variant="kioskSecondary" className="flex-1" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <Button
            variant="kiosk"
            disabled={!selectedOption && !voiceAnswer}
            className="flex-1 bg-[#0F172A] hover:bg-[#1E293B]"
            onClick={handleNext}
          >
            <span>{questionIndex + 1 === total ? "Review Documents" : "Next Question"}</span>
            <ArrowRight className="w-5 h-5 ml-2 text-[#34D399]" />
          </Button>
        </div>
      </main>
    </div>
  );
}
