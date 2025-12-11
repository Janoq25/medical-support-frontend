"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

const ToastContext = createContext(undefined);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);
  const { theme } = useTheme();

  useEffect(() => {
    const handler = (e) => {
      const { message, type = "info", duration = 4000 } = e.detail || {};
      const id = ++counter.current;
      setToasts((prev) => [...prev, { id, message, type, visible: false }]);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: true } : t)));
        });
      });
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };
    window.addEventListener("toast", handler);
    return () => window.removeEventListener("toast", handler);
  }, []);

  return (
    <ToastContext.Provider value={{}}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`min-w-[280px] max-w-[400px] px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 transform flex items-start gap-3 pointer-events-auto
              ${t.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
              ${theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-clinical-gray-200 text-clinical-gray-900"}`}
          >
            <span className={`mt-0.5`}>
              {t.type === "success" && <CheckCircle size={18} className="text-clinical-green-600" />}
              {t.type === "error" && <XCircle size={18} className="text-clinical-red-600" />}
              {t.type === "warning" && <AlertTriangle size={18} className="text-yellow-600" />}
              {t.type === "info" && <Info size={18} className="text-clinical-blue-600" />}
            </span>
            <span className="text-sm flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (ctx === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
