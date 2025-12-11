"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin } from '@/services/auth/localApi';
import { startGoogleLogin, getMe } from '@/services/auth/googleApi';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const storedUser =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (storedUser) setUser(storedUser);
      const tokenAccess =
        typeof document !== "undefined" ? getCookie("accessToken") : null;
      if (tokenAccess || storedUser) {
        setIsAuthenticated(true);
        setAuthLoading(false);
        return;
      }
      try {
        const me = await getMe();
        if (me?.username) {
          setUser(me.username);
          localStorage.setItem("user", me.username);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
      setAuthLoading(false);
    };
    init();
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
    clearCookie("jwt");
    setIsAuthenticated(false);
    router.push("/login");
  };

  const loginWithGoogle = () => {
    startGoogleLogin();
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, isAuthenticated, authLoading }}>
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
