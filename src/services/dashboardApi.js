"use client";

import { getPatientInitials } from "./utils/getPatientInitials";
import { emitToast } from "@/services/utils/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"; // NestJS API

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "string" ? data : data?.message || "Error en la petición";
    if (response.status === 401) {
      emitToast({ message: "Tu sesión ha caducado. Por favor, inicia sesión nuevamente.", type: "warning" });
    } else {
      emitToast({ message, type: "error" });
    }
    throw new Error(message);
  }
  console.log(data);
  return data;
};

const findRecentPatients = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/recent-patients`, {
    method: "GET",
    cache: "no-store",
  });
  return handleResponse(response);
};

export const getRecentPatients = async () => {
  const data = await findRecentPatients();
  const formatedData = data.map((dto) => ({
    name: dto.patient.name,
    lastname: dto.patient.lastname,
    initials: getPatientInitials(dto.patient.name, dto.patient.lastname),
    lastState: dto.lastState,
  }));
  return formatedData;
};

export const getPatientMonthlyResume = async () => {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/monthly-patient-resume`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  return handleResponse(response);
};

export const getInquiryMonthlyResume = async () => {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/monthly-inquiry-resume`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  return handleResponse(response);
};

export const getInquiryMonthlyChart = async (
  year = new Date().getFullYear()
) => {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/monthly-inquiry-chart?year=${year}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  return handleResponse(response);
};
