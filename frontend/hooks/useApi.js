import { useState, useCallback } from 'react';
import api from '@/utils/api';

export function useApi(apiFunc) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiFunc(api, ...args);
            setData(response.data);
            return response.data;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "An error occurred";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunc]);

    return { data, loading, error, execute };
}
