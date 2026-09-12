"use client";

import React, { useState } from "react";
import { Bot, MessageSquare, X, Sparkles, HeartPulse } from "lucide-react";
import { MedicalChatBot } from "./MedicalChatBot";

export function ChatFloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
            title="Open Medical AI Assistant"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#059669] flex items-center justify-center text-white">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#10B981] border-2 border-[#0F172A] rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#10B981] border-2 border-[#0F172A] rounded-full" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold font-heading leading-tight flex items-center gap-1">
                <span>Medical AI Assistant</span>
                <Sparkles className="w-3 h-3 text-[#34D399]" />
              </div>
              <div className="text-[10px] text-[#94A3B8]">Ask health questions</div>
            </div>
          </button>
        ) : null}
      </div>

      {/* Slide-over / Modal Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[95vw] max-w-lg h-[80vh] max-h-[680px] min-h-[480px] animate-scale-in">
          <MedicalChatBot isModal={true} onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
