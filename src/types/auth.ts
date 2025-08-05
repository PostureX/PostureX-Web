// Types for auth context

export interface User {
    id: string;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
    average_overall_score?: number;
    current_week_analyses?: number;
    latest_analysis_datetime?: string;
    total_analyses?: number;
    [key: string]: unknown;
}

export interface AuthContextType {
    user: User | null;
    logout: () => Promise<void>;
    loading: boolean;
}
