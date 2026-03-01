const API_BASE = '/api';

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, options);

    if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Erreur inconnue' }));
        throw new ApiError(res.status, body.error ?? `Erreur ${res.status}`);
    }

    return res.json() as Promise<T>;
}

export const api = {
    get: <T>(endpoint: string) => request<T>(endpoint),
    post: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }),
};
