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