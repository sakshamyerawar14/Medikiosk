"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/store/kiosk-context";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { KioskProgress } from "@/components/kiosk/KioskProgress";
import { AudioPlayer } from "@/components/kiosk/AudioPlayer";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Lock,
  UserCheck,
  FileText,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function ConsentPage() {
  const router = useRouter();
  const { session, setConsent } = useKiosk();
  const [isChecked, setIsChecked] = useState<boolean>(session.consent ?? true);
  const [declinedModal, setDeclinedModal] = useState(false);

  const consentTextByLang: Record<string, string> = {
    en: "MediKiosk helps collect your symptoms and previous medical records to assist your doctor. Your data is kept private and securely shared only with your treating physician. You may decline at any time.",
    hi: "मेडीकियोस्क आपके लक्षणों और पुरानी मेडिकल फाइलों को व्यवस्थित करने में मदद करता है ताकि डॉक्टर बेहतर इलाज कर सकें। आपकी जानकारी पूरी तरह सुरक्षित रखी जाती है।",
    mr: "मेडीकियोस्क तुमच्या लक्षणांची आणि जुन्या अहवालांची माहिती डॉक्टरांना वेळेवर मिळवून देण्यासाठी मदत करतो. तुमची सर्व माहिती पूर्णपणे सुरक्षित राहील.",
    ta: "உங்கள் மருத்துவ தகவல்கள் மற்றும் அறிகுறிகளை ஒழுங்குபடுத்த இந்த கியோஸ்க் உதவுகிறது. உங்கள் தகவல்கள் பாதுகாப்பாக வைக்கப்படும்.",
  };

  const currentSpeechText = consentTextByLang[session.language] || consentTextByLang.en;

  const handleAgree = () => {
    setConsent(true);
    router.push("/kiosk/identification");
  };

  const handleDecline = () => {
    setConsent(false);
    setDeclinedModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
      <div>
        <KioskHeader title="Privacy & Consent" subtitle="Information collection agreement" />
        <KioskProgress currentStep={2} />
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 flex flex-col items-center">
        {/* Audio prompt & Title */}
        <div className="text-center mb-6">
          <div className="mb-3 flex justify-center">
            <AudioPlayer text={currentSpeechText} autoPlay />
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A] font-heading mb-2">
            Your Privacy & Consent
          </h1>
          <p className="text-sm text-[#64748B]">
            गोपनीयता एवं सहमति पत्र • कृपया ध्यान से पढ़ें
          </p>
        </div>

        {/* Structured Consent Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm w-full mb-6 space-y-5">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] font-heading mb-1">
                1. Why information is collected
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                To capture your current symptoms, chief complaints, and past medical prescriptions so your treating doctor can review a clear clinical summary.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] text-[#0284C7] flex items-center justify-center shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] font-heading mb-1">
                2. Who has access to this data
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Only authorized hospital clinical staff and your assigned OPD doctor. MediKiosk does not sell or share data with outside commercial entities.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] font-heading mb-1">
                3. AI Prepares, Doctor Decides
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                MediKiosk is an intake assistant, not an autonomous doctor. All AI drafts are reviewed, edited, and verified by a licensed medical practitioner.
              </p>
            </div>
          </div>

          {/* Interactive Checkbox */}
          <label className="flex items-center gap-3 p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] cursor-pointer touch-target select-none">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-6 h-6 rounded-md accent-[#059669] cursor-pointer"
            />
            <span className="text-sm font-semibold text-[#065F46]">
              I have read, understood, and consent to provide intake history for clinical care.
            </span>
          </label>
        </div>

        {/* Buttons: Decline & Agree */}
        <div className="flex items-center justify-between w-full max-w-xl gap-4">
          <Button
            variant="kioskSecondary"
            className="flex-1 text-[#EF4444] border-[#FECACA] hover:bg-[#FEF2F2]"
            onClick={handleDecline}
          >
            Decline
          </Button>

          <Button
            variant="kiosk"
            disabled={!isChecked}
            className="flex-1 bg-[#059669] hover:bg-[#047857] shadow-md"
            onClick={handleAgree}
          >
            <span>I Agree & Continue</span>
            <ArrowRight className="w-5 h-5 ml-2 text-white" />
          </Button>
        </div>
      </main>

      {/* Decline Dialog Modal */}
      {declinedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-center">
            <AlertTriangle className="w-12 h-12 text-[#D97706] mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[#0F172A] font-heading mb-2">
              Consent Declined
            </h3>
            <p className="text-sm text-[#64748B] mb-6">
              You can proceed directly to the regular OPD registration counter for manual paper registration.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => router.push("/kiosk")}
              >
                Return to Home
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-[#0F172A]"
                onClick={() => {
                  setDeclinedModal(false);
                  setIsChecked(true);
                }}
              >
                Re-review Consent
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
