"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const ToastContext = createContext(undefined);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  useEffect(() => {
    const handler = (e) => {
      const { message, type = "info", duration = 4000 } = e.detail || {};
      const id = ++counter.current;
      setToasts((prev) => [...prev, { id, message, type }]);
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
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`min-w-[260px] max-w-[360px] px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 ${
              t.type === "success"
                ? "bg-clinical-green-50 border-clinical-green-200 text-clinical-green-700"
                : t.type === "error"
                ? "bg-clinical-red-50 border-clinical-red-200 text-clinical-red-700"
                : t.type === "warning"
                ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                : "bg-white border-clinical-gray-200 text-clinical-gray-800"
            }`}
          >
            <span className="text-sm">{t.message}</span>
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
