"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"; // NestJS API

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "string" ? data : data?.message || "Error en la petición";
    throw new Error(message);
  }
  console.log(data);
  return data;
};

const setToken = (token) => {
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `accessToken=${token}; Path=/; SameSite=Lax${secure}`;
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(response);
  setToken(data.accessToken);
  return data;
};

export const register = async (username, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse(response);
};
