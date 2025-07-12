import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router';

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

interface User {
    id: string;
    username: string;
    isAdmin?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchUser = async (): Promise<User | null> => {
    const storedUser = localStorage.getItem('authUser');
    if (!storedUser) return null;
    try {
        const parsed = JSON.parse(storedUser);
        if (parsed && typeof parsed.id === 'string' && typeof parsed.username === 'string') {
            return parsed as User;
        }
        return null;
    } catch {
        return null;
    }
};

const fakeLogin = async (username: string, password: string): Promise<User> => {
    await new Promise((res) => setTimeout(res, 500));
    return { id: '1', username };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const { data: user, isLoading: loading } = useQuery({
        queryKey: ['authUser'],
        queryFn: fetchUser,
    });

    const loginMutation = useMutation({
        mutationFn: ({ username, password }: { username: string; password: string }) => fakeLogin(username, password),
        onSuccess: (user) => {
            localStorage.setItem('authUser', JSON.stringify(user));
            queryClient.setQueryData(['authUser'], user);
            navigate('/dashboard'); // Redirect to dashboard after login
        },
    });

    const logout = () => {
        localStorage.removeItem('authUser');
        queryClient.setQueryData(['authUser'], null);
    };

    const login = async (username: string, password: string) => {
        await loginMutation.mutateAsync({ username, password });
    };

    return (
        <AuthContext.Provider value={{ user: user ?? null, login, logout, loading: loading || loginMutation.status === 'pending' }}>
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