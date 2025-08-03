import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useCookie } from './Cookies';
import api from "@/api/api";

import { AuthContextType, User } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchUser = async (getCookie: (name: string) => string | null): Promise<User | null> => {
    const userCookie = getCookie('authUser');
    if (userCookie) {
        try {
            const parsed = JSON.parse(userCookie);
            if (parsed && typeof parsed.id === 'string' && typeof parsed.username === 'string') {
                return parsed as User;
            }
        } catch {
            // fall through to fetch from backend
        }
    }
    // If no cookie, try to fetch from backend (if session/cookie is valid)
    try {
        const res = await api.get("/auth/profile");
        if (res.data && res.data.user) {
            // Optionally set the cookie for future reloads
            document.cookie = `authUser=${encodeURIComponent(JSON.stringify(res.data.user))}; path=/`;
            return res.data.user as User;
        }
    } catch {
        // Not authenticated or error
    }
    return null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { get: getCookie, remove: removeCookie } = useCookie();

    const { data: user, isLoading: loading } = useQuery({
        queryKey: ['authUser'],
        queryFn: () => fetchUser(getCookie),
    });

    // Logout function using cookies
    const logout = async () => {
        removeCookie('authUser');
        removeCookie('authToken');
        queryClient.setQueryData(['authUser'], null);
        navigate('/');
    };

    return (
        <AuthContext.Provider
            value={{
                user: user ?? null,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};