import { useTheme } from "@/hooks/ThemeContext";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const [theme, setTheme] = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <div className="flex items-center ml-4">
            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
        </div>
    );
}