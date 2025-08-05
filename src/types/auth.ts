// Types for auth context

export interface User {
    id: string;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
    [key: string]: unknown;
}

export interface AuthContextType {
    user: User | null;
    logout: () => Promise<void>;
    loading: boolean;
}
