"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Role, UserProfile } from "@/types";
import { loginAction, logoutAction, getActiveUserAction } from "@/lib/actions/auth";

interface AuthContextType {
  user: UserProfile | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (email: string, role: Role, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check server-side verified session on mount
  const checkSession = useCallback(async () => {
    try {
      const res = await getActiveUserAction();
      if (res.success && res.user) {
        setUser({
          id: res.user.id,
          fullName: res.user.fullName,
          email: res.user.email,
          role: res.user.role,
          departmentName: res.user.departmentId || undefined,
          active: true,
          createdAt: new Date().toISOString(),
        });
      } else {
        // Clear any stale local state
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (
    email: string,
    role: Role,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Default demo password if not provided in demo environments
      const resolvedPassword = password || (role === "admin" ? "admin123" : "doctor123");

      const res = await loginAction({
        email,
        password: resolvedPassword,
        role,
      });

      if (!res.success || !res.user) {
        return { success: false, error: res.error || "Authentication failed" };
      }

      const userProfile: UserProfile = {
        id: res.user.id,
        fullName: res.user.fullName,
        email: res.user.email,
        role: res.user.role,
        departmentName: res.user.departmentId || undefined,
        active: true,
        createdAt: new Date().toISOString(),
      };

      setUser(userProfile);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "An unexpected error occurred during login" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutAction();
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user, // Real authentication status
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
