import useSWR from 'swr';
import api from '@/utils/api';

const fetcher = url => api.get(url).then(res => res.data);

export function useStats(userId, fetchOnMount = false) {
    const { data, error, isLoading, mutate } = useSWR(userId ? '/stats' : null, fetcher);
    
    return {
        stats: data || { totalVaults: 0, totalContacts: 0, lastActivity: null },
        loading: isLoading,
        error: error?.response?.data?.message || error?.message,
        fetchStats: mutate
    };
}
