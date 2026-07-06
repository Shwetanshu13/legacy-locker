import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export function useStats(userId, fetchOnMount = false) {
    const [stats, setStats] = useState({
        totalVaults: 0,
        totalContacts: 0,
        lastActivity: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            // Note: Currently calling Next.js API route. Update to Express api instance when ready.
            const response = await axios.post("/api/get/stats", { clerkUserId: userId });
            setStats(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch stats");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (fetchOnMount) {
            fetchStats();
        }
    }, [fetchStats, fetchOnMount]);

    return { stats, loading, error, fetchStats, setStats };
}
