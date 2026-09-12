"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { useKiosk } from "@/lib/store/kiosk-context";

interface AudioPlayerProps {
  text: string;
  autoPlay?: boolean;
  language?: string;
}

export function AudioPlayer({ text, autoPlay = false, language }: AudioPlayerProps) {
  const { session, isAudioMuted } = useKiosk();
  const [isPlaying, setIsPlaying] = useState(false);
  const activeLang = language || session.language || "en";

  const speakText = () => {
    if (isAudioMuted || !text) return;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // stop previous
      const utterance = new SpeechSynthesisUtterance(text);
      
      const langCodes: Record<string, string> = {
        hi: "hi-IN",
        mr: "mr-IN",
        ta: "ta-IN",
        en: "en-IN",
      };
      utterance.lang = langCodes[activeLang] || "en-IN";
      utterance.rate = 0.95; // slightly slower for clinical clarity

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback visual simulation if browser has no speech synth
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    if (autoPlay && !isAudioMuted) {
      const timer = setTimeout(() => {
        speakText();
      }, 500);
      return () => {
        clearTimeout(timer);
        stopSpeaking();
      };
    }
    return () => {
      stopSpeaking();
    };
  }, [text, autoPlay, isAudioMuted]);

  if (isAudioMuted) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={isPlaying ? stopSpeaking : speakText}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
        isPlaying
          ? "bg-[#ECFDF5] border-[#059669] text-[#047857] shadow-sm animate-pulse"
          : "bg-white border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#0F172A]"
      }`}
      title={isPlaying ? "Stop audio guidance" : "Listen to question"}
    >
      {isPlaying ? (
        <>
          <div className="flex items-center gap-0.5">
            <span className="w-1 h-3 bg-[#059669] rounded-full animate-bounce" />
            <span className="w-1 h-4 bg-[#059669] rounded-full animate-bounce [animation-delay:0.15s]" />
            <span className="w-1 h-2 bg-[#059669] rounded-full animate-bounce [animation-delay:0.3s]" />
          </div>
          <span>Playing Audio Guide</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#059669]" />
          <span>Listen (सुनें / ऐका)</span>
        </>
      )}
    </button>
  );
}
