"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, Lock, Mail, ArrowRight, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";

export default function DoctorLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("vikram.seth@hospital.gov.in");
  const [password, setPassword] = useState("doctor123");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    const res = await login(email, "doctor", password);
    if (res.success) {
      router.push("/doctor/dashboard");
    } else {
      setErrorMessage(res.error || "Authentication failed. Please check your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
      <header className="p-6 border-b border-[#E2E8F0] bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center text-white">
              <Activity className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <span className="text-xl font-bold font-heading text-[#0F172A]">MediKiosk</span>
              <span className="text-xs text-[#64748B] block">Clinical Doctor Portal</span>
            </div>
          </Link>

          <Link href="/kiosk" className="text-xs font-semibold text-[#059669] hover:underline">
            ← Switch to Patient Kiosk
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E2E8F0] p-8 shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center mb-4 mx-auto">
            <Stethoscope className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-center text-[#0F172A] font-heading mb-1">
            Doctor Clinical Login
          </h2>
          <p className="text-xs text-[#64748B] text-center mb-6">
            Sign in to access real-time OPD intake queues and AI clinical drafts.
          </p>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Hospital Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@hospital.gov.in"
                  className="pl-9 h-11 text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5 flex justify-between">
                <span>Password</span>
                <span className="text-[#059669] font-normal lowercase text-[11px]">demo filled</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 h-11 text-sm bg-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold shadow-md"
            >
              <span>{isLoading ? "Authenticating..." : "Sign In to Clinic Dashboard"}</span>
              <ArrowRight className="w-4 h-4 ml-2 text-[#34D399]" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E2E8F0] flex items-center justify-center gap-2 text-xs text-[#64748B]">
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <span>Encrypted HIPAA/ABDM-ready session authentication</span>
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-xs text-[#94A3B8]">
        MediKiosk v2.4 • Hospital Clinical Access Terminal
      </footer>
    </div>
  );
}
