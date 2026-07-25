import axios from 'axios';
import API_URL, { getAuthToken, setAuthToken } from '../../../lib/apiBase';

const api = axios.create({
    baseURL: `${API_URL}/api/auth`,
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function register({ username, email, password }) {
    const response = await api.post(`/register`, {
        username, email, password
    });
    if (response.data?.token) {
        setAuthToken(response.data.token);
    }
    return response.data;
}

export async function login({ email, password }) {
    const response = await api.post(`/login`, {
        email, password
    });
    if (response.data?.token) {
        setAuthToken(response.data.token);
    }
    return response.data;
}

export async function logout() {
    const response = await api.get(`/logout`);
    setAuthToken(null);
    return response.data;
}

export async function getme() {
    const response = await api.get(`/get-me`);
    return response.data;
}
