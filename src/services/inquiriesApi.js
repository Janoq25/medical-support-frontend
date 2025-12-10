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

export const getInquiries = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.patient_state) params.append('patient_state', filters.patient_state);
    if (filters.type_diagnosis) params.append('type_diagnosis', filters.type_diagnosis);

    const query = params.toString();
    const url = query ? `${API_BASE_URL}/inquiries?${query}` : `${API_BASE_URL}/inquiries`;

    const response = await fetch(url, { cache: 'no-store' });
    return handleResponse(response);
};

export const getLatestInquiryByPatient = async (patientId) => {
    if (!patientId) return null;
    const inquiries = await getInquiries({ patientId });
    return Array.isArray(inquiries) && inquiries.length > 0 ? inquiries[0] : null; // endpoint ya ordena DESC
};

export const createInquiry = async (payload) => {
    const response = await fetch(`${API_BASE_URL}/inquiries`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
};

export const getInquiriesByPatient = async (patientId) => {
    if (!patientId) return [];
    const response = await fetch(`${API_BASE_URL}/inquiries/patient/${patientId}/history`, {
        cache: 'no-store',
    });
    return handleResponse(response);
};
