import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type Theme = "light" | "dark"
type ThemeContextType = [Theme, (theme: Theme) => void]

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme")
      if (stored === "light" || stored === "dark") return stored
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark"
    }
    return "light"
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider")
  return ctx
}
