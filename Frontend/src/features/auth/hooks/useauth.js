import { useContext, useEffect } from 'react';
import { AuthContext } from '../auth.context';
import { login, logout, register, getme } from '../services/auth.api';

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, loading, setUser, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const response = await login({ email, password });
            setUser(response.user);
            
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const response = await register({ username, email, password });
            setUser(response.user);
        } catch (error) {
            console.error(error);
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getme();
                setUser(response.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    return { user, loading, handleLogin, handleRegister, handleLogout };
};
