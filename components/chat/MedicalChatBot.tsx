"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  RefreshCw,
  AlertTriangle,
  ShieldAlert,
  Info,
  Sparkles,
  Stethoscope,
  X,
  Maximize2,
  Minimize2,
  ChevronDown,
  Loader2,
  FileText,
  HelpCircle,
  Activity,
  HeartPulse,
} from "lucide-react";

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isEmergency?: boolean;
}

const WELCOME_MESSAGE: ChatMessageItem = {
  id: "welcome-1",
  role: "assistant",
  content: `Hi! I'm your **MediKiosk Medical Information Assistant**. I can help you understand symptoms, medical terms, general health topics, and questions to ask your doctor.

*Please note: I provide general educational health information and cannot replace a qualified doctor or emergency medical care.*`,
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const SUGGESTED_PROMPTS = [
  { label: "Help me understand these symptoms", text: "Can you help me understand what might cause a dull headache and fatigue for 2 days?" },
  { label: "What does this medical term mean?", text: "What does 'Essential Hypertension' mean in simple terms?" },
  { label: "Explain a lab test", text: "What does an elevated Serum Triglyceride level mean on a blood test?" },
  { label: "What questions should I ask my doctor?", text: "What questions should I prepare to ask my doctor during my cardiology consultation?" },
];

const QUICK_ACTIONS = [
  { label: "Explain Symptoms", icon: Activity, prompt: "I would like help understanding a symptom: " },
  { label: "Explain Medical Term", icon: HelpCircle, prompt: "What does this medical term mean: " },
  { label: "Understand Lab Report", icon: FileText, prompt: "Can you explain this lab test result: " },
  { label: "Doctor Questions", icon: Stethoscope, prompt: "What questions should I ask my doctor regarding " },
];

interface MedicalChatBotProps {
  isModal?: boolean;
  onClose?: () => void;
  initialPrompt?: string;
}

export function MedicalChatBot({ isModal = false, onClose, initialPrompt }: MedicalChatBotProps) {
  const [messages, setMessages] = useState<ChatMessageItem[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState<string>(initialPrompt || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [showDisclaimerTooltip, setShowDisclaimerTooltip] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, errorMessage]);

  // Focus textarea on mount
  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
    }
    textareaRef.current?.focus();
  }, [initialPrompt]);

  // Voice speech-to-text integration for input
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      setIsListening(false);
    }
  };

  // Send message to Gemini API
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || isLoading) return;

    setErrorMessage(null);
    setInput("");

    const userMessageId = `user-${Date.now()}`;
    const newUserMessage: ChatMessageItem = {
      id: userMessageId,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedHistory = [...messages, newUserMessage];
    setMessages(updatedHistory);
    setIsLoading(true);

    try {
      // Build API payload format
      const apiMessages = updatedHistory
        .filter((m) => m.id !== "welcome-1") // omit local static welcome from API context if desired or include as assistant
        .map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("model" as const),
          content: m.content,
        }));

      const res = await fetch("/api/medical-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(
          data.error || "Sorry, the medical assistant is temporarily unavailable. Please try again."
        );
      } else {
        const assistantMessage: ChatMessageItem = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isEmergency: data.isEmergency,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err: any) {
      setErrorMessage("Network error connecting to the medical assistant. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        ...WELCOME_MESSAGE,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setErrorMessage(null);
    setInput("");
    textareaRef.current?.focus();
  };

  const handleSuggestedPrompt = (promptText: string) => {
    handleSendMessage(promptText);
  };

  const handleQuickAction = (prefix: string) => {
    setInput(prefix);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-[#E2E8F0] shadow-xl overflow-hidden">
      {/* 1. Header */}
      <header className="px-5 py-3.5 bg-[#0F172A] text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#059669] text-white flex items-center justify-center shadow-xs">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-heading tracking-wide">Medical AI Assistant</h3>
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#059669]/30 text-[#34D399] border border-[#059669]/40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Gemini Active
              </span>
            </div>
            <span className="text-[11px] text-[#94A3B8] block">
              Educational Health & Symptom Guidance
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Disclaimer Info Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDisclaimerTooltip(!showDisclaimerTooltip)}
              className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
              title="Medical Safety & Policy"
            >
              <Info className="w-4 h-4" />
            </button>

            {showDisclaimerTooltip && (
              <div className="absolute right-0 top-10 w-72 p-3.5 bg-[#1E293B] border border-[#334155] rounded-xl shadow-xl text-xs text-[#CBD5E1] z-50 animate-fade-in">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Clinical Safety Policy</span>
                </div>
                <p className="leading-relaxed text-[11px] text-[#94A3B8]">
                  This AI assistant provides educational health information. It is not a doctor, cannot examine you, and cannot provide definitive medical diagnoses or prescription changes. In case of emergency, contact emergency medical services immediately.
                </p>
              </div>
            )}
          </div>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={handleResetChat}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#CBD5E1] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Start new conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {/* Close button if in modal */}
          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* 2. Quick Action Chips Bar */}
      <div className="px-4 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider whitespace-nowrap">
          Quick Actions:
        </span>
        {QUICK_ACTIONS.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickAction(action.prompt)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#CBD5E1] text-[11px] font-semibold text-[#0F172A] hover:border-[#059669] hover:bg-[#ECFDF5] hover:text-[#059669] whitespace-nowrap transition-all shadow-2xs cursor-pointer"
            >
              <Icon className="w-3 h-3 text-[#059669]" />
              {action.label}
            </button>
          );
        })}
      </div>

      {/* 3. Messages Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F8FAFC]">
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                  isUser
                    ? "bg-[#0F172A] text-white"
                    : msg.isEmergency
                    ? "bg-[#DC2626] text-white"
                    : "bg-[#059669] text-white"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : msg.isEmergency ? <AlertTriangle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? "bg-[#0F172A] text-white rounded-tr-none"
                    : msg.isEmergency
                    ? "bg-[#FEF2F2] border-2 border-[#EF4444] text-[#991B1B] rounded-tl-none"
                    : "bg-white border border-[#E2E8F0] text-[#0F172A] rounded-tl-none"
                }`}
              >
                {/* Assistant Label */}
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-[#E2E8F0]/60">
                    <span className="text-[11px] font-bold text-[#059669] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Medical AI Assistant
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">{msg.timestamp}</span>
                  </div>
                )}

                {/* Content with Markdown */}
                <div className={`prose prose-sm max-w-none ${isUser ? "text-white prose-invert" : "text-[#0F172A] prose-slate"}`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {isUser && (
                  <div className="text-[10px] text-[#94A3B8] text-right mt-1.5">
                    {msg.timestamp}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Suggested Prompts (shown when only welcome message exists) */}
        {messages.length === 1 && (
          <div className="mt-4 pt-2">
            <p className="text-xs font-bold text-[#64748B] mb-2 uppercase tracking-wider">
              Suggested Topics:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestedPrompt(p.text)}
                  className="p-3 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#059669] hover:bg-[#ECFDF5] text-left text-xs font-medium text-[#0F172A] hover:text-[#059669] transition-all shadow-xs cursor-pointer flex items-center justify-between group"
                >
                  <span>{p.label}</span>
                  <span className="text-[#059669] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-2xl rounded-tl-none p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#059669]">
                <Loader2 className="w-4 h-4 animate-spin text-[#059669]" />
                <span>Analyzing medical information with Gemini...</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="w-2 h-2 rounded-full bg-[#059669] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#059669] animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 rounded-full bg-[#059669] animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <p className="font-bold text-[#991B1B] mb-0.5">Medical Assistant Notice</p>
              <p className="text-[#B91C1C] leading-relaxed">{errorMessage}</p>
              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="mt-2 text-xs font-bold text-[#DC2626] hover:underline"
              >
                Retry Request
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Input Area */}
      <div className="p-4 bg-white border-t border-[#E2E8F0] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex flex-col gap-2"
        >
          <div className="relative flex items-center bg-[#F8FAFC] border border-[#CBD5E1] focus-within:border-[#0F172A] focus-within:ring-1 focus-within:ring-[#0F172A] rounded-2xl transition-all shadow-inner">
            <textarea
              ref={textareaRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your health concern or ask a medical question..."
              disabled={isLoading}
              className="w-full bg-transparent px-4 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] resize-none focus:outline-hidden disabled:opacity-50"
            />

            <div className="flex items-center gap-1.5 pr-2.5 pb-1 self-end">
              {/* Microphone Voice Button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2 rounded-xl transition-all ${
                  isListening
                    ? "bg-[#DC2626] text-white animate-pulse"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]"
                }`}
                title={isListening ? "Listening... click to stop" : "Speak your question"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-2.5 rounded-xl font-semibold transition-all ${
                  input.trim() && !isLoading
                    ? "bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-sm cursor-pointer scale-100"
                    : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
                }`}
                title="Send message (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#94A3B8] px-1">
            <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for new line</span>
            <span className="italic">AI assists • Doctor decides</span>
          </div>
        </form>
      </div>
    </div>
  );
}
