"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"; // NestJS API

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    console.error("Error en la petición:", response.status, response.statusText);
    const message =
      typeof data === "string" ? data : data?.message || "Error en la petición";
    throw new Error(message);
  }
  console.log(data);
  return data;
};

export const startGoogleLogin = () => {
  if (typeof window !== "undefined") {
    window.location.href = `${API_BASE_URL}/auth/google`;
  }
};

export const getMe = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
  console.log("fetcheado")
  return handleResponse(response);
};
