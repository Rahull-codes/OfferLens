import { useContext, useEffect } from 'react';
import { AuthContext } from '../auth.context';
import { login, logout, register, getme } from '../services/auth.api';
import { getAuthToken, setAuthToken } from '../../../lib/apiBase';

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, loading, setUser, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const response = await login({ email, password });
            setUser(response.user);
            return response.user;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const response = await register({ username, email, password });
            setUser(response.user);
            return response.user;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error(error);
            setAuthToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            if (!getAuthToken()) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const response = await getme();
                setUser(response.user);
            } catch (error) {
                setAuthToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    return { user, loading, handleLogin, handleRegister, handleLogout };
};
