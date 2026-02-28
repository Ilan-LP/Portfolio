import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '@/services/client.ts';

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    status: number | null;
    refetch: () => void;
}

export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []): FetchState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<number | null>(null);

    const execute = useCallback(() => {
        setLoading(true);
        setError(null);
        setStatus(null);

        fetcher()
            .then((result) => {
                setData(result);
                setStatus(200);
            })
            .catch((err: unknown) => {
                if (err instanceof ApiError) {
                    setError(err.message);
                    setStatus(err.status);
                } else {
                    setError(err instanceof Error ? err.message : 'Erreur inconnue');
                    setStatus(500);
                }
            })
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        execute();
    }, [execute]);

    return { data, loading, error, status, refetch: execute };
}
