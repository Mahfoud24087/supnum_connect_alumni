import { createContext, useContext, useState } from 'react';
import { users } from '../data/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = (email, password) => {
        // Mock login logic
        const foundUser = users.find(u => u.email === email);
        if (foundUser) {
            setUser(foundUser);
            return { success: true, role: foundUser.role };
        }
        return { success: false, error: 'Invalid credentials' };
    };

    const signup = (userData) => {
        // Mock signup - in a real app this would call an API
        // For now we just simulate success
        return { success: true };
    };

    const logout = () => {
        setUser(null);
    };

    const updateProfile = (profileData) => {
        setUser(prev => ({ ...prev, ...profileData }));
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
