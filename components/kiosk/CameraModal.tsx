"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Camera, SwitchCamera, X, ZapOff, Loader2, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type CameraState = "requesting" | "active" | "captured" | "error";

interface CameraModalProps {
  onCapture: (blob: Blob, previewUrl: string) => void;
  onClose: () => void;
}

export function CameraModal({ onCapture, onClose }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<CameraState>("requesting");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [canSwitch, setCanSwitch] = useState(false);

  // ----------------------------------------------------------------
  // Start / restart camera stream
  // ----------------------------------------------------------------
  const startCamera = useCallback(async (mode: "environment" | "user") => {
    // Stop any previous stream tracks first
    stopStream();

    setState("requesting");
    setErrorMsg("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Detect whether multiple cameras are available for the switch button
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        setCanSwitch(videoDevices.length > 1);
      } catch {
        setCanSwitch(false);
      }

      setState("active");
    } catch (err: any) {
      stopStream();
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMsg(
          "Camera access was denied. You can enable camera permission in your browser settings, or upload a document manually instead."
        );
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setErrorMsg(
          "No camera was detected on this device. Please upload an image or PDF instead."
        );
      } else if (err.name === "NotReadableError") {
        setErrorMsg(
          "Camera is already in use by another application. Please close other apps using the camera and try again."
        );
      } else {
        setErrorMsg(
          err.message || "Camera could not be accessed. Please try uploading a file instead."
        );
      }
      setState("error");
    }
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Start camera on mount
  useEffect(() => {
    startCamera(facingMode);
    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------
  // Capture still frame from video
  // ----------------------------------------------------------------
  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setCapturedBlob(blob);
        setCapturedUrl(url);
        stopStream(); // stop camera immediately after capture
        setState("captured");
      },
      "image/jpeg",
      0.92
    );
  };

  // ----------------------------------------------------------------
  // Switch between front / back camera
  // ----------------------------------------------------------------
  const handleSwitchCamera = async () => {
    const newMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newMode);
    await startCamera(newMode);
  };

  // ----------------------------------------------------------------
  // Retake
  // ----------------------------------------------------------------
  const handleRetake = () => {
    if (capturedUrl) URL.revokeObjectURL(capturedUrl);
    setCapturedUrl(null);
    setCapturedBlob(null);
    startCamera(facingMode);
  };

  // ----------------------------------------------------------------
  // Confirm use
  // ----------------------------------------------------------------
  const handleUseImage = () => {
    if (capturedBlob && capturedUrl) {
      onCapture(capturedBlob, capturedUrl);
    }
  };

  // ----------------------------------------------------------------
  // Close
  // ----------------------------------------------------------------
  const handleClose = () => {
    stopStream();
    if (capturedUrl) URL.revokeObjectURL(capturedUrl);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Document Scanner Camera"
    >
      <div className="bg-[#0F172A] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#34D399]" />
            <h3 className="text-sm font-bold text-white">Scan Document</h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close camera"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="relative">
          {/* ---- Requesting permission ---- */}
          {state === "requesting" && (
            <div className="aspect-4/3 flex flex-col items-center justify-center gap-3 text-white bg-black">
              <Loader2 className="w-8 h-8 animate-spin text-[#34D399]" />
              <p className="text-sm text-[#94A3B8]">Requesting camera permission…</p>
            </div>
          )}

          {/* ---- Error state ---- */}
          {state === "error" && (
            <div className="aspect-4/3 flex flex-col items-center justify-center gap-4 text-white bg-black px-6 text-center">
              <ZapOff className="w-10 h-10 text-[#EF4444]" />
              <p className="text-sm text-[#CBD5E1] leading-relaxed">{errorMsg}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => startCamera(facingMode)}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try Again
              </Button>
            </div>
          )}

          {/* ---- Active camera preview ---- */}
          {(state === "active" || state === "requesting") && (
            <div className="relative aspect-4/3 bg-black overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${state === "active" ? "opacity-100" : "opacity-0"}`}
                aria-label="Camera preview"
              />

              {/* Document framing guide overlay */}
              {state === "active" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Corner marks */}
                  <div className="relative w-3/4 h-3/4">
                    <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#34D399] rounded-tl" />
                    <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#34D399] rounded-tr" />
                    <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#34D399] rounded-bl" />
                    <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#34D399] rounded-br" />
                    <p className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white/70 text-center">
                      Align document within frame
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---- Captured image preview ---- */}
          {state === "captured" && capturedUrl && (
            <div className="relative aspect-4/3 bg-black overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedUrl}
                alt="Captured document preview"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-2 right-2 bg-[#059669] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                Captured ✓
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for image export */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Footer Buttons */}
        <div className="px-4 py-3 border-t border-white/10 flex gap-3">
          {state === "active" && (
            <>
              {canSwitch && (
                <button
                  type="button"
                  onClick={handleSwitchCamera}
                  className="p-2.5 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Switch camera"
                >
                  <SwitchCamera className="w-5 h-5" />
                </button>
              )}

              <Button
                variant="secondary"
                className="flex-1 bg-white/10 text-white border-transparent hover:bg-white/20"
                onClick={handleClose}
              >
                Cancel
              </Button>

              <button
                type="button"
                onClick={handleCapture}
                className="w-14 h-14 rounded-full bg-white border-4 border-[#34D399] flex items-center justify-center shadow-lg hover:bg-[#F0FDF4] transition-colors"
                aria-label="Capture photo"
              >
                <Camera className="w-6 h-6 text-[#0F172A]" />
              </button>
            </>
          )}

          {state === "captured" && (
            <>
              <Button
                variant="secondary"
                className="flex-1 bg-white/10 text-white border-transparent hover:bg-white/20"
                onClick={handleRetake}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retake
              </Button>
              <Button
                className="flex-1 bg-[#059669] hover:bg-[#047857] text-white"
                onClick={handleUseImage}
              >
                <Check className="w-4 h-4 mr-2" />
                Use This Image
              </Button>
            </>
          )}

          {state === "error" && (
            <Button
              variant="secondary"
              className="flex-1 bg-white/10 text-white border-transparent"
              onClick={handleClose}
            >
              Close — Use File Upload Instead
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
