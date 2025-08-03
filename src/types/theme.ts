// Types for theme context

export type Theme = "light" | "dark";
export type ThemeContextType = [Theme, (theme: Theme) => void];
