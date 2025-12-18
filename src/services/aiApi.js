"use client";

import { emitToast } from "@/services/utils/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "string" ? data : data?.message || "Error en la petición";
    if (response.status === 401) {
      emitToast({
        message: "Tu sesión ha caducado. Por favor, inicia sesión nuevamente.",
        type: "warning",
      });
    } else {
      emitToast({ message, type: "error" });
    }
    throw new Error(message);
  }

  return data;
};
