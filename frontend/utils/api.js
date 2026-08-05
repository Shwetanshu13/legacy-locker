import axios from 'axios';
import { publicEnv } from './env.public';

const api = axios.create({
    baseURL: publicEnv.NEXT_PUBLIC_API_URL, // Pointing to the new Express backend
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
