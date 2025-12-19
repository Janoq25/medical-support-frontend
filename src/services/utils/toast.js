"use client";

export function emitToast({ message, type = "info", duration = 4000 }) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("toast", { detail: { message, type, duration } }));
  }
}