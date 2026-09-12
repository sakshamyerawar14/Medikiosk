"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, Lock, Mail, ArrowRight, ShieldCheck, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@hospital.gov.in");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    const res = await login(email, "admin", password);
    if (res.success) {
      router.push("/admin/dashboard");
    } else {
      setErrorMessage(res.error || "Authentication failed. Please verify administrator credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none">
      <header className="p-6 border-b border-[#E2E8F0] bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold font-heading text-[#0F172A]">MediKiosk</span>
              <span className="text-xs text-[#64748B] block">Hospital Administration</span>
            </div>
          </Link>

          <Link href="/doctor/dashboard" className="text-xs font-semibold text-[#2563EB] hover:underline">
            ← Switch to Doctor Portal
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E2E8F0] p-8 shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4 mx-auto">
            <Sliders className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-center text-[#0F172A] font-heading mb-1">
            System Administrator Login
          </h2>
          <p className="text-xs text-[#64748B] text-center mb-6">
            Configure kiosks, interview questionnaires, departments, and monitor hospital telemetry.
          </p>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hospital.gov.in"
                  className="pl-9 h-11 text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5 flex justify-between">
                <span>Admin Password</span>
                <span className="text-[#2563EB] font-normal lowercase text-[11px]">demo filled</span>
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
              className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold shadow-md"
            >
              <span>{isLoading ? "Signing in..." : "Open Administration Console"}</span>
              <ArrowRight className="w-4 h-4 ml-2 text-white" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E2E8F0] flex items-center justify-center gap-2 text-xs text-[#64748B]">
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
            <span>Role-Based Access Control (RBAC) & Audit Logging Active</span>
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-xs text-[#94A3B8]">
        Hospital Information System Interface • MediKiosk Admin Console
      </footer>
    </div>
  );
}
