// Types for auth context

export interface User {
    id: string;
    username: string;
    email?: string;
    isAdmin?: boolean;
    [key: string]: unknown;
}

export interface AuthContextType {
    user: User | null;
    logout: () => Promise<void>;
    loading: boolean;
}
