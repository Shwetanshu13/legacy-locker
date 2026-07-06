import { useState, useCallback, useEffect } from 'react';
import api from '@/utils/api';

export function useVaults(userId, fetchOnMount = false) {
    const [vaults, setVaults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchVaults = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            // Updated to the standard Express route
            const res = await api.get('/vaults'); 
            setVaults(res.data.vaults || res.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch vaults");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const deleteVault = async (vaultId) => {
        try {
            await api.delete(`/vaults/${vaultId}`);
            setVaults(prev => prev.filter(v => v.id !== vaultId));
        } catch (err) {
            throw new Error(err.response?.data?.message || "Failed to delete vault");
        }
    };

    useEffect(() => {
        if (fetchOnMount) {
            fetchVaults();
        }
    }, [fetchVaults, fetchOnMount]);

    return { vaults, loading, error, fetchVaults, deleteVault };
}
