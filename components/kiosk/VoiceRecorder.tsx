"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Check, AlertCircle, Loader2, RefreshCw, Square, Play, Pause } from "lucide-react";
import { useKiosk } from "@/lib/store/kiosk-context";

interface VoiceRecorderProps {
  onTranscript: (text: string, audioBlob?: Blob) => void;
  placeholderText?: string;
}

type RecordingState =
  | "idle"
  | "requesting_permission"
  | "recording"
  | "processing"
  | "success"
  | "error";

// Map Kiosk language code to Web Speech Recognition BCP-47 language tag
const LANG_MAP: Record<string, string> = {
  hi: "hi-IN",
  mr: "mr-IN",
  ta: "ta-IN",
  te: "te-IN",
  bn: "bn-IN",
  en: "en-IN",
};

export function VoiceRecorder({
  onTranscript,
  placeholderText = "Tap the microphone to speak your answer in Hindi, Marathi, or English",
}: VoiceRecorderProps) {
  const { session } = useKiosk();
  const [state, setState] = useState<RecordingState>("idle");
  const [transcript, setTranscript] = useState<string>("");
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const finalTranscriptAccumulatorRef = useRef<string>("");

  // Clean up media tracks and recognition
  const cleanupMedia = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    mediaRecorderRef.current = null;

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      mediaStreamRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupMedia();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [cleanupMedia, audioUrl]);

  // Start real recording with getUserMedia and SpeechRecognition
  const startRecording = async () => {
    cleanupMedia();
    setTranscript("");
    setInterimTranscript("");
    setErrorMessage("");
    setRecordingDuration(0);
    finalTranscriptAccumulatorRef.current = "";

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    // Step 1: Check browser support for getUserMedia
    if (!navigator?.mediaDevices?.getUserMedia) {
      setState("error");
      setErrorMessage("Microphone access is not supported by your browser. Please use Chrome or Edge.");
      return;
    }

    setState("requesting_permission");

    let stream: MediaStream;
    try {
      // Step 2: Request real microphone permission
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;
    } catch (err: any) {
      setState("error");
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMessage("Microphone permission was denied. Please allow microphone access in your browser address bar.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setErrorMessage("No microphone device was found on this computer. Please connect a microphone.");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setErrorMessage("Your microphone is currently in use by another application.");
      } else {
        setErrorMessage(`Unable to access microphone: ${err.message || "Permission error"}`);
      }
      return;
    }

    // Step 3: Initialize MediaRecorder with the live audio stream
    try {
      audioChunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const finalRecordedText = finalTranscriptAccumulatorRef.current.trim();
        if (finalRecordedText) {
          setTranscript(finalRecordedText);
          setState("success");
          onTranscript(finalRecordedText, audioBlob);
        } else {
          // If no speech text was recognized from the microphone audio
          setState("error");
          setErrorMessage("No speech was detected from your microphone. Please speak louder and try again.");
        }
      };

      recorder.start(250); // Collect chunk every 250ms
    } catch (err: any) {
      cleanupMedia();
      setState("error");
      setErrorMessage(`Failed to start audio recorder: ${err.message}`);
      return;
    }

    // Step 4: Initialize Web Speech API for real-time speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        const selectedLang = LANG_MAP[session.language || "en"] || "en-IN";
        recognition.lang = selectedLang;

        recognition.onresult = (event: any) => {
          let interim = "";
          let accumulatedFinal = "";

          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            const text = result[0]?.transcript || "";
            if (result.isFinal) {
              accumulatedFinal += text + " ";
            } else {
              interim += text;
            }
          }

          if (accumulatedFinal) {
            finalTranscriptAccumulatorRef.current = accumulatedFinal;
          }
          setInterimTranscript(interim);
          if (accumulatedFinal || interim) {
            setTranscript((accumulatedFinal + " " + interim).trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("[VoiceRecorder] Speech recognition event:", event.error);
          if (event.error === "not-allowed") {
            setErrorMessage("Speech recognition permission denied by browser.");
          } else if (event.error === "no-speech") {
            // keep recording stream active
          }
        };

        recognition.onend = () => {
          // If media recorder is still recording, restart recognition
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            try {
              recognition.start();
            } catch (e) {}
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn("[VoiceRecorder] Speech recognition initialization failed:", err);
      }
    }

    // Step 5: Transition state to recording & start duration timer
    setState("recording");
    timerIntervalRef.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);
  };

  // Stop recording and process live audio
  const stopRecording = () => {
    if (state !== "recording") return;

    setState("processing");

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    // Stop media recorder (triggers recorder.onstop to create Blob and deliver transcript)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }

    // Stop all microphone stream tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      mediaStreamRef.current = null;
    }
  };

  const resetRecording = () => {
    cleanupMedia();
    setState("idle");
    setTranscript("");
    setInterimTranscript("");
    setErrorMessage("");
    setRecordingDuration(0);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current || !audioUrl) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] shadow-xs select-none">
      {/* Audio player element for user playback verification */}
      {audioUrl && (
        <audio
          ref={audioPlayerRef}
          src={audioUrl}
          onEnded={() => setIsPlayingAudio(false)}
          className="hidden"
        />
      )}

      {/* Visual Microphone Button with Accurate Dynamic States */}
      <div className="relative mb-4 flex items-center justify-center">
        {state === "recording" && (
          <>
            <span className="absolute w-28 h-28 rounded-full bg-[#ECFDF5] animate-ping opacity-75" />
            <span className="absolute w-24 h-24 rounded-full bg-[#A7F3D0] animate-pulse opacity-50" />
          </>
        )}

        <button
          type="button"
          onClick={
            state === "idle" || state === "error"
              ? startRecording
              : state === "recording"
              ? stopRecording
              : resetRecording
          }
          disabled={state === "requesting_permission" || state === "processing"}
          className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
            state === "idle"
              ? "bg-[#0F172A] text-white hover:bg-[#1E293B] hover:scale-105 active:scale-95 cursor-pointer"
              : state === "requesting_permission"
              ? "bg-[#D97706] text-white cursor-wait animate-pulse"
              : state === "recording"
              ? "bg-[#DC2626] text-white ring-8 ring-[#FEE2E2] scale-110 cursor-pointer"
              : state === "processing"
              ? "bg-[#64748B] text-white cursor-wait"
              : state === "success"
              ? "bg-[#059669] text-white ring-4 ring-[#ECFDF5] cursor-pointer"
              : "bg-[#EF4444] text-white cursor-pointer"
          }`}
          title={
            state === "recording"
              ? "Click to Stop Recording"
              : state === "idle"
              ? "Click to Speak"
              : "Microphone status"
          }
        >
          {state === "idle" && <Mic className="w-8 h-8 text-white" />}
          {state === "requesting_permission" && <Loader2 className="w-8 h-8 text-white animate-spin" />}
          {state === "recording" && <Square className="w-7 h-7 text-white fill-current" />}
          {state === "processing" && <Loader2 className="w-8 h-8 text-white animate-spin" />}
          {state === "success" && <Check className="w-9 h-9 text-white stroke-[3]" />}
          {state === "error" && <AlertCircle className="w-8 h-8 text-white" />}
        </button>
      </div>

      {/* State Label & Voice Waveform */}
      <div className="text-center max-w-md w-full">
        {state === "idle" && (
          <div>
            <h4 className="text-lg font-bold text-[#0F172A] font-heading mb-1">
              Tap to Speak (बोलें / बोला)
            </h4>
            <p className="text-xs text-[#64748B]">{placeholderText}</p>
          </div>
        )}

        {state === "requesting_permission" && (
          <div className="space-y-1 animate-fade-in">
            <h4 className="text-base font-bold text-[#D97706] font-heading flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Requesting Microphone Permission...
            </h4>
            <p className="text-xs text-[#64748B]">Please click "Allow" in your browser prompt</p>
          </div>
        )}

        {state === "recording" && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-center gap-1.5 h-6">
              {[40, 70, 90, 60, 100, 75, 45, 80, 55, 30].map((height, i) => (
                <span
                  key={i}
                  className="w-1 bg-[#DC2626] rounded-full animate-pulse"
                  style={{
                    height: `${height}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] animate-ping" />
              <span className="text-sm font-bold text-[#DC2626] font-mono">
                Recording: {formatSeconds(recordingDuration)}
              </span>
            </div>

            {/* Live real-time speech preview from microphone */}
            {(transcript || interimTranscript) && (
              <div className="bg-white/80 p-2.5 rounded-lg border border-[#CBD5E1] text-xs font-medium text-[#0F172A] italic">
                "{transcript || interimTranscript}"
              </div>
            )}

            <button
              type="button"
              onClick={stopRecording}
              className="px-5 py-2 rounded-xl bg-[#0F172A] text-white text-xs font-bold hover:bg-[#1E293B] shadow-sm transition-all cursor-pointer"
            >
              Done Speaking — Tap to Submit
            </button>
          </div>
        )}

        {state === "processing" && (
          <div className="space-y-1 animate-fade-in">
            <h4 className="text-base font-bold text-[#0F172A] font-heading flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#059669]" />
              Processing Live Audio...
            </h4>
            <p className="text-xs text-[#64748B]">Extracting live clinical concepts from your speech</p>
          </div>
        )}

        {state === "success" && (
          <div className="space-y-2.5 animate-fade-in w-full">
            <div className="bg-white p-3.5 rounded-xl border border-[#A7F3D0] shadow-xs text-left">
              <div className="flex items-center justify-between text-[11px] text-[#059669] font-bold mb-1">
                <span>✓ Live Microphone Input Captured</span>
                {audioUrl && (
                  <button
                    type="button"
                    onClick={togglePlayback}
                    className="flex items-center gap-1 text-[#0284C7] hover:underline cursor-pointer"
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause className="w-3 h-3" /> Pause Audio
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" /> Play Recording
                      </>
                    )}
                  </button>
                )}
              </div>
              <p className="text-sm font-medium text-[#0F172A] italic">"{transcript}"</p>
            </div>
            <button
              type="button"
              onClick={startRecording}
              className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] font-medium cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Re-record voice / speak again
            </button>
          </div>
        )}

        {state === "error" && (
          <div className="space-y-2.5 animate-fade-in">
            <div className="p-3 bg-[#FEF2F2] rounded-xl border border-[#FECACA]">
              <p className="text-xs font-semibold text-[#DC2626] leading-relaxed">
                {errorMessage || "Microphone recording failed. Please verify microphone permissions and speak clearly."}
              </p>
            </div>
            <button
              type="button"
              onClick={startRecording}
              className="px-4 py-2 rounded-lg bg-[#0F172A] text-white text-xs font-semibold hover:bg-[#1E293B] cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
