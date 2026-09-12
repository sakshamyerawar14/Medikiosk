"use client";

import React from "react";
import { KioskProvider } from "@/lib/store/kiosk-context";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ChatFloatingWidget } from "@/components/chat/ChatFloatingWidget";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <KioskProvider>
        {children}
        <ChatFloatingWidget />
      </KioskProvider>
    </AuthProvider>
  );
}

