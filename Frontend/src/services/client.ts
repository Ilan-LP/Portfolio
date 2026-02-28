const API_BASE = '/api';

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

async function request<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`);

    if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Erreur inconnue' }));
        throw new ApiError(res.status, body.error ?? `Erreur ${res.status}`);
    }

    return res.json() as Promise<T>;
}

export const api = {
    get: <T>(endpoint: string) => request<T>(endpoint),
};
