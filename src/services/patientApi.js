'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const defaultHeaders = {
    'Content-Type': 'application/json',
};

const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        const message = typeof data === 'string' ? data : data?.message || 'Error en la petición';
        throw new Error(message);
    }

    return data;
};

export const getPatients = async () => {
    const response = await fetch(`${API_BASE_URL}/patient`, {
        cache: 'no-store',
    });
    return handleResponse(response);
};

export const getPatient = async (id) => {
    const response = await fetch(`${API_BASE_URL}/patient/${id}`, {
        cache: 'no-store',
    });
    return handleResponse(response);
};

export const createPatient = async (payload) => {
    const response = await fetch(`${API_BASE_URL}/patient`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
};

export const updatePatient = async (id, payload) => {
    const response = await fetch(`${API_BASE_URL}/patient/${id}`, {
        method: 'PATCH',
        headers: defaultHeaders,
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
};

export const removePatient = async (id) => {
    const response = await fetch(`${API_BASE_URL}/patient/${id}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
};
