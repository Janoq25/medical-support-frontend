"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin } from "@/services/auth/localApi";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (storedUser) setUser(storedUser);
    const token =
      typeof document !== "undefined" ? getCookie("accessToken") : null;
    setIsAuthenticated(!!token || !!storedUser);
  }, []);

  const getCookie = (name) => {
    const match =
      typeof document !== "undefined"
        ? document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"))
        : null;
    return match ? decodeURIComponent(match[1]) : null;
  };

  const clearCookie = (name) => {
    if (typeof document !== "undefined") {
      document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
    }
  };

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    const displayName = data?.user?.name || email;
    setUser(displayName);
    localStorage.setItem("user", displayName);
    setIsAuthenticated(true);
    router.push("/dashboard/home");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    clearCookie("accessToken");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
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
