import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export function useContacts(userId, fetchOnMount = false) {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchContacts = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            // Note: Currently calling Next.js API route. Update to Express api instance when ready.
            const response = await axios.post("/api/get/trusted-contacts", { clerkUserId: userId });
            setContacts(response.data.contacts);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch contacts");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (fetchOnMount) {
            fetchContacts();
        }
    }, [fetchContacts, fetchOnMount]);

    return { contacts, loading, error, fetchContacts };
}
