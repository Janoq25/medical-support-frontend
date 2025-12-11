'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

export const getIndicators = async (q) => {
    const params = q ? `?q=${encodeURIComponent(q)}` : '';
    const response = await fetch(`${API_BASE_URL}/indicators${params}`, {
        cache: 'no-store',
    });
    return handleResponse(response);
};

export const getIndicator = async (id) => {
    const response = await fetch(`${API_BASE_URL}/indicators/${id}`, {
        cache: 'no-store',
    });
    return handleResponse(response);
};

export const createIndicator = async (payload) => {
    const response = await fetch(`${API_BASE_URL}/indicators`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
};

export const updateIndicator = async (id, payload) => {
    const response = await fetch(`${API_BASE_URL}/indicators/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
};

export const removeIndicator = async (id) => {
    const response = await fetch(`${API_BASE_URL}/indicators/${id}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
};
