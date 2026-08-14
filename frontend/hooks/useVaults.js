import useSWR from 'swr';
import api from '@/utils/api';

const fetcher = url => api.get(url).then(res => res.data);

export function useVaults(userId, fetchOnMount = false) {
    const { data, error, isLoading, mutate } = useSWR(userId ? '/vaults' : null, fetcher);
    
    const vaults = data?.vaults || data?.data || [];
    
    const deleteVault = async (vaultId) => {
        try {
            await api.delete(`/vaults/${vaultId}`);
            mutate();
        } catch (err) {
            throw new Error(err.response?.data?.message || "Failed to delete vault");
        }
    };
    
    return {
        vaults,
        loading: isLoading,
        error: error?.response?.data?.message || error?.message,
        fetchVaults: mutate,
        deleteVault
    };
}
