import axios from 'axios';
import API_URL from '../../../lib/apiBase';

const api = axios.create({
    baseURL: `${API_URL}/api/auth`,
    withCredentials: true
});

export async function register({ username, email, password }) {
    const response = await api.post(`/register`, {
        username, email, password
    });

    return response.data;
}

export async function login({ email, password }) {
    const response = await api.post(`/login`, {
        email, password
    });
    return response.data;
}

export async function logout() {
    const response = await api.get(`/logout`);
    return response.data;
}

export async function getme() {
    const response = await api.get(`/get-me`);
    return response.data;
}
