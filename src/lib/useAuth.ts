"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";

export interface SessionUser {
  user_id: number;
  name: string;
  email: string;
  role: UserRole;
  roll_no?: string | null;
  club_role?: string | null;
  admin_level?: string | null;
  club_ids?: number[];
}

const STORAGE_KEY = "ccre_session_user";

export function getStoredUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: SessionUser | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
}

export function useAuth(allowedRoles?: UserRole[]) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = getStoredUser();
    if (!current) {
      router.replace("/login");
      setLoading(false);
      return;
    }
    setUser(current);
    setLoading(false);
  }, [router]);

  const isAuthorized =
    !allowedRoles || (user !== null && allowedRoles.includes(user.role));

  function logout() {
    setStoredUser(null);
    setUser(null);
    router.push("/login");
  }

  return { user, loading, isAuthorized, logout };
}
