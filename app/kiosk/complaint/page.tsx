"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/store/kiosk-context";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { KioskProgress } from "@/components/kiosk/KioskProgress";
import { AudioPlayer } from "@/components/kiosk/AudioPlayer";
import { VoiceRecorder } from "@/components/kiosk/VoiceRecorder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Thermometer,
  Activity,
  Heart,
  Wind,
  Flame,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Keyboard,
} from "lucide-react";

interface ComplaintChip {
  id: string;
  label: { en: string; hi: string; mr: string; ta: string };
  icon: React.ReactNode;
  concept: string;
}

const POPULAR_COMPLAINTS: ComplaintChip[] = [
  {
    id: "c-chest",
    label: { en: "Chest Discomfort / Heaviness", hi: "सीने में दर्द या भारीपन", mr: "छातीत दुखणे किंवा जडपणा", ta: "நெஞ்சு வலி" },
    icon: <Heart className="w-5 h-5 text-[#DC2626]" />,
    concept: "chest_pain",
  },
  {
    id: "c-fever",
    label: { en: "Fever & Chills", hi: "बुखार और कंपकंपी", mr: "ताप आणि थंडी", ta: "காய்ச்சல்" },
    icon: <Thermometer className="w-5 h-5 text-[#EA580C]" />,
    concept: "fever",
  },
  {
    id: "c-cough",
    label: { en: "Cough & Cold", hi: "खांसी और जुकाम", mr: "खोकला आणि सर्दी", ta: "இருமல்" },
    icon: <Wind className="w-5 h-5 text-[#0284C7]" />,
    concept: "cough_cold",
  },
  {
    id: "c-breathing",
    label: { en: "Breathing Difficulty", hi: "सांस लेने में तकलीफ", mr: "श्वास घेण्यास त्रास", ta: "மூச்சுத்திணறல்" },
    icon: <Activity className="w-5 h-5 text-[#7C3AED]" />,
    concept: "shortness_of_breath",
  },
  {
    id: "c-stomach",
    label: { en: "Stomach Pain / Acidity", hi: "पेट दर्द या गैस", mr: "पोटदुखी / गॅस", ta: "வயிற்று வலி" },
    icon: <Flame className="w-5 h-5 text-[#D97706]" />,
    concept: "abdominal_pain",
  },
  {
    id: "c-joint",
    label: { en: "Joint & Knee Pain", hi: "जोड़ों या घुटनों में दर्द", mr: "सांधेदुखी / गुडघेदुखी", ta: "மூட்டு வலி" },
    icon: <Activity className="w-5 h-5 text-[#059669]" />,
    concept: "joint_pain",
  },
];

export default function ChiefComplaintPage() {
  const router = useRouter();
  const { session, setChiefComplaint } = useKiosk();
  const [complaintText, setComplaintText] = useState(
    session.chiefComplaint || ""
  );
  const [showKeyboard, setShowKeyboard] = useState(false);

  const lang = (session.language || "en") as "en" | "hi" | "mr" | "ta";

  const handleTranscript = (text: string) => {
    setComplaintText(text);
  };

  const handleChipSelect = (chip: ComplaintChip) => {
    const text = chip.label[lang] || chip.label.en;
    setComplaintText(text);
  };

  const handleContinue = () => {
    if (!complaintText.trim()) return;
    setChiefComplaint(complaintText);
    router.push("/kiosk/interview");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
      <div>
        <KioskHeader title="Chief Complaint" subtitle="Step 5: Describe your problem" />
        <KioskProgress currentStep={5} />
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-6">
          <div className="mb-3 flex justify-center">
            <AudioPlayer
              text="What brings you to the hospital today? You can tap the microphone to speak, or select from the common symptoms below."
              autoPlay
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] font-heading mb-2">
            What brings you to the hospital today?
          </h1>
          <p className="text-base text-[#64748B]">
            आज आपको क्या तकलीफ महसूस हो रही है? बोलकर या छूकर बताएं।
          </p>
        </div>

        {/* Voice Recorder Component (Primary Action) */}
        <div className="w-full max-w-2xl mb-6">
          <VoiceRecorder
            onTranscript={handleTranscript}
            placeholderText="Tap microphone and describe your problem naturally in your language"
          />
        </div>

        {/* Selected / Transcribed Complaint Display & Text Option */}
        <div className="w-full max-w-2xl bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Captured Complaint (दर्ज समस्या)
            </span>
            <button
              type="button"
              onClick={() => setShowKeyboard(!showKeyboard)}
              className="text-xs font-semibold text-[#059669] flex items-center gap-1 hover:underline"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>{showKeyboard ? "Hide Keyboard" : "Type Manually"}</span>
            </button>
          </div>

          <Input
            type="text"
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            placeholder="e.g. Chest discomfort for 2 days, fever, knee pain..."
            className="h-13 text-base font-semibold text-[#0F172A] border-[#CBD5E1]"
          />
        </div>

        {/* Popular Symptom Quick Chips */}
        <div className="w-full max-w-2xl mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3 text-center">
            Or tap a common symptom (या इनमें से चुनें):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {POPULAR_COMPLAINTS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleChipSelect(chip)}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#0F172A] hover:bg-[#F8FAFC] text-left transition-all shadow-xs touch-target cursor-pointer"
              >
                {chip.icon}
                <span className="text-xs font-bold text-[#0F172A] leading-tight">
                  {chip.label[lang] || chip.label.en}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center justify-between w-full max-w-xl gap-4">
          <Button
            variant="kioskSecondary"
            className="flex-1"
            onClick={() => router.push("/kiosk/department")}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <Button
            variant="kiosk"
            disabled={!complaintText.trim()}
            className="flex-1 bg-[#0F172A] hover:bg-[#1E293B]"
            onClick={handleContinue}
          >
            <span>Continue to Interview</span>
            <ArrowRight className="w-5 h-5 ml-2 text-[#34D399]" />
          </Button>
        </div>
      </main>
    </div>
  );
}
