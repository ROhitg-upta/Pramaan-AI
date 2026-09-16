"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export type UserRole = "STUDENT" | "EVALUATOR" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  githubUsername?: string;
  avatarUrl?: string;
  organizationName?: string;
  verifiedAt?: string;
}

export const PRESET_USERS: Record<string, AuthUser> = {
  evaluator: {
    id: "user-eval-001",
    email: "prof.alok@university.edu",
    fullName: "Prof. Alok Sharma",
    role: "EVALUATOR",
    githubUsername: "prof-alok",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    organizationName: "Dept. of Computer Science & Forensics",
    verifiedAt: "2026-01-15T09:00:00Z",
  },
  student: {
    id: "user-stud-001",
    email: "rohit.sharma@university.edu",
    fullName: "Rohit Sharma",
    role: "STUDENT",
    githubUsername: "rohit-sharma",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    organizationName: "Senior Capstone 2026",
    verifiedAt: "2026-02-01T14:30:00Z",
  },
  studentSuspect: {
    id: "user-stud-002",
    email: "aryan.dev@gmail.com",
    fullName: "Aryan Kumar",
    role: "STUDENT",
    githubUsername: "aryan-k",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    organizationName: "Senior Capstone 2026",
    verifiedAt: "2026-02-01T14:30:00Z",
  },
};

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAs: (presetKey: "evaluator" | "student" | "studentSuspect") => void;
  loginWithGithub: (targetRole?: UserRole) => Promise<void>;
  switchRole: (newRole: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "pramaan_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize from localStorage or default to Evaluator in dev
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default demo session: Evaluator
        setUser(PRESET_USERS.evaluator);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(PRESET_USERS.evaluator));
      }
    } catch {
      setUser(PRESET_USERS.evaluator);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAs = (presetKey: "evaluator" | "student" | "studentSuspect") => {
    const selected = PRESET_USERS[presetKey] || PRESET_USERS.evaluator;
    setUser(selected);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));

    if (selected.role === "EVALUATOR") {
      router.push("/evaluator/dashboard");
    } else {
      router.push("/student/dashboard");
    }
  };

  const loginWithGithub = async (targetRole: UserRole = "STUDENT") => {
    setIsLoading(true);
    // Simulate GitHub OAuth handshake
    await new Promise((r) => setTimeout(r, 600));

    const newUser: AuthUser = {
      id: `gh-${Date.now()}`,
      email: "github.developer@pramaan.ai",
      fullName: targetRole === "EVALUATOR" ? "Prof. Evaluator (GitHub Verified)" : "Verified Builder (@github)",
      role: targetRole,
      githubUsername: "verified-builder",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      organizationName: "Pramaan Verification Network",
      verifiedAt: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setIsLoading(false);

    if (targetRole === "EVALUATOR") {
      router.push("/evaluator/dashboard");
    } else {
      router.push("/student/dashboard");
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    let updated: AuthUser;

    if (newRole === "EVALUATOR") {
      updated = {
        ...PRESET_USERS.evaluator,
      };
      setUser(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      router.push("/evaluator/dashboard");
    } else {
      updated = {
        ...PRESET_USERS.student,
      };
      setUser(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      router.push("/student/dashboard");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "STUDENT",
        isAuthenticated: !!user,
        isLoading,
        loginAs,
        loginWithGithub,
        switchRole,
        logout,
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
