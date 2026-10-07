"use client";

import React, { createContext, useContext, useState, useSyncExternalStore } from "react";
import { UserRole } from "@/types/inventory";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

interface AuthContextType {
  user: AuthUser;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  isSales: boolean;
  isViewer: boolean;
}

const DEFAULT_USER: AuthUser = {
  id: "usr-admin-01",
  name: "Alexander Wright",
  email: "a.wright@apexmotors.com",
  role: "admin",
  department: "Executive Showroom Management",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function subscribeRole(callback: () => void) {
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }
  return () => {};
}

function getStoredRoleSnapshot(): UserRole {
  if (typeof window === "undefined") return "admin";
  const saved = localStorage.getItem("apex_user_role") as UserRole | null;
  if (saved && ["admin", "sales", "viewer"].includes(saved)) {
    return saved;
  }
  return "admin";
}

function getServerSnapshot(): UserRole {
  return "admin";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const currentRole = useSyncExternalStore(subscribeRole, getStoredRoleSnapshot, getServerSnapshot);
  const [overrideRole, setOverrideRole] = useState<UserRole | null>(null);

  const effectiveRole = overrideRole ?? currentRole;

  const setRole = (newRole: UserRole) => {
    setOverrideRole(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("apex_user_role", newRole);
      window.dispatchEvent(new Event("storage"));
    }
  };

  const user: AuthUser = {
    ...DEFAULT_USER,
    role: effectiveRole,
  };

  const isAdmin = effectiveRole === "admin";
  const isSales = effectiveRole === "sales";
  const isViewer = effectiveRole === "viewer";

  return (
    <AuthContext.Provider
      value={{
        user,
        setRole,
        isAdmin,
        isSales,
        isViewer,
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
