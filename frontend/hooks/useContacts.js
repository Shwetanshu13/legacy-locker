import useSWR from 'swr';
import api from '@/utils/api';

const fetcher = url => api.get(url).then(res => res.data);

export function useContacts(userId, fetchOnMount = false) {
    const { data, error, isLoading, mutate } = useSWR(userId ? '/contacts' : null, fetcher, { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false });
    
    return {
        contacts: data?.contacts || [],
        loading: isLoading,
        error: error?.response?.data?.message || error?.message,
        fetchContacts: mutate
    };
}
