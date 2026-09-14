"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import authApi from "@/lib/axios";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await authApi.get<User>("/api/account/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    await authApi.post("/api/account/login", credentials);
    await fetchUser();
    router.push("/");
  };

  const logout = async () => {
    try {
      await authApi.post("/api/account/logout");
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoading, login, logout, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
