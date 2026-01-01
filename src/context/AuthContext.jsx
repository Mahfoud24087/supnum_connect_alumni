import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const currentUser = await authService.getCurrentUser();
                    if (currentUser) {
                        setUser(currentUser);
                    } else {
                        localStorage.removeItem('auth_token');
                    }
                } catch (error) {
                    console.error('Auth init error:', error);
                    localStorage.removeItem('auth_token');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        const result = await authService.login(email, password);
        if (result.success) {
            setUser(result.user);
            return { success: true, role: result.user.role };
        }
        return result;
    };

    const signup = async (userData) => {
        const result = await authService.register(userData);
        return result;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const updateProfile = async (profileData) => {
        const result = await authService.updateProfile(profileData);
        if (result.success) {
            setUser(result.user);
            return { success: true };
        }
        return result;
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
