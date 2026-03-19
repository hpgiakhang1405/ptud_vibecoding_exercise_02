"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AuthUser } from "@/lib/types";

type AuthContextValue = {
  user: AuthUser;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  initialUser: AuthUser;
  children: ReactNode;
};

export function AuthProvider({ initialUser, children }: AuthProviderProps) {
  const [user, setUserState] = useState<AuthUser>(initialUser);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      setUser: (nextUser) => setUserState(nextUser),
      clearUser: () => setUserState(initialUser),
    }),
    [initialUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
