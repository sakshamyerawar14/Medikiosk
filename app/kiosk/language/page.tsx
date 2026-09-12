"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/store/kiosk-context";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { KioskProgress } from "@/components/kiosk/KioskProgress";
import { AudioPlayer } from "@/components/kiosk/AudioPlayer";
import { Button } from "@/components/ui/button";
import { Language } from "@/types";
import { Check, ArrowRight, ArrowLeft, Globe } from "lucide-react";

interface LanguageOption {
  code: Language;
  name: string;
  native: string;
  subtext: string;
  popular?: boolean;
}

const LANGUAGES: LanguageOption[] = [
  { code: "hi", name: "Hindi", native: "हिंदी", subtext: "राष्ट्रीय भाषा", popular: true },
  { code: "en", name: "English", native: "English", subtext: "Standard clinical", popular: true },
  { code: "mr", name: "Marathi", native: "मराठी", subtext: "प्रादेशिक भाषा", popular: true },
  { code: "ta", name: "Tamil", native: "தமிழ்", subtext: "தமிழ்நாடு", popular: true },
  { code: "te", name: "Telugu", native: "తెలుగు", subtext: "ఆంధ్రప్రదేశ్ / తెలంగాణ", popular: false },
  { code: "bn", name: "Bengali", native: "বাংলা", subtext: "পশ্চিমবঙ্গ", popular: false },
];

export default function LanguageSelectionPage() {
  const router = useRouter();
  const { session, setLanguage } = useKiosk();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
  };

  const handleContinue = () => {
    router.push("/kiosk/consent");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
      <div>
        <KioskHeader title="Language Preference" subtitle="Choose your consultation language" />
        <KioskProgress currentStep={1} />
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col items-center">
        {/* Audio prompt & Title */}
        <div className="text-center mb-8">
          <div className="mb-3 flex justify-center">
            <AudioPlayer
              text="Please choose the language you are most comfortable speaking or reading."
              autoPlay
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] font-heading mb-2">
            Select Your Language
          </h1>
          <p className="text-base text-[#64748B]">
            आप किस भाषा में बात करना चाहते हैं? / आपण कोणत्या भाषेत संवाद साधू इच्छिता?
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-10">
          {LANGUAGES.map((lang) => {
            const isSelected = session.language === lang.code;

            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`relative flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left touch-target cursor-pointer ${
                  isSelected
                    ? "bg-[#F8FAFC] border-[#0F172A] shadow-md ring-2 ring-[#0F172A] ring-offset-2"
                    : "bg-white border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] shadow-sm"
                }`}
              >
                <div>
                  <div className="text-2xl font-bold font-heading text-[#0F172A] mb-0.5">
                    {lang.native}
                  </div>
                  <div className="text-sm font-medium text-[#64748B]">
                    {lang.name} <span className="text-xs text-[#94A3B8]">• {lang.subtext}</span>
                  </div>
                </div>

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-[#0F172A] text-white"
                      : "border-2 border-[#CBD5E1] text-transparent"
                  }`}
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between w-full max-w-xl gap-4">
          <Button
            variant="kioskSecondary"
            className="flex-1"
            onClick={() => router.push("/kiosk")}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <Button
            variant="kiosk"
            className="flex-1 bg-[#0F172A] hover:bg-[#1E293B]"
            onClick={handleContinue}
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2 text-[#34D399]" />
          </Button>
        </div>
      </main>

      <div className="p-4 text-center text-xs text-[#64748B]">
        Need another language? Ask hospital staff for an interpreter.
      </div>
    </div>
  );
}
