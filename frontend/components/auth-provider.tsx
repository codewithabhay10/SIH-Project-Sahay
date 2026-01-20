"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  getCurrentUser,
  logout as authLogout,
  login as authLogin,
  signup as authSignup,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  setUser: (user: User | null) => void;
  signup: (args: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "mosje" | "state" | "ia" | "pacc" | "sna" | "beneficary";
  }) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const login = async (email: string, password: string): Promise<User> => {
    const user = await authLogin(email, password);
    setUser(user);
    return user;
  };

  const signup = async (args: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "mosje" | "state" | "ia" | "pacc" | "sna" | "beneficary";
  }): Promise<User> => {
    const user = await authSignup(args);
    setUser(user);
    return user;
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
