import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { env } from './env';

const api = axios.create({
    baseURL: env.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
