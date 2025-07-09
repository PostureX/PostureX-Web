import { useAuth } from "@/hooks/Auth";
import ThemeToggle from "../ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import Logo from "@/components/custom/Logo"
import { useState } from "react";
import "./Header.css";

export default function Header() {
    const { logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-card shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Left: SPF Crest */}
                    <div className="flex items-center bg-[#f7f7f7] rounded-full px-4 py-2">
                        <img    
                            className="w-[120px] sm:w-[100px] md:w-[80px] xl:w-[6vw] h-auto" 
                            src="/images/spf_crest_with_tagline.png" 
                            alt="SPF Crest"
                        />
                    </div>

                    {/* Center: Logo */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <Logo className="h-15" />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors font-semibold">
                            Home
                        </a>
                        <a href="/analysis" className="text-muted-foreground hover:text-foreground transition-colors font-semibold">
                            Analysis
                        </a>
                        <a href="/profile" className="text-muted-foreground hover:text-foreground transition-colors font-semibold">
                            Profile
                        </a>
                        <Button variant="ghost" onClick={logout} className="text-muted-foreground hover:text-foreground">
                            Logout
                        </Button>
                        <ThemeToggle />
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-border py-4">
                        <div className="flex flex-col space-y-4">
                            <a href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors font-semibold">
                                Home
                            </a>
                            <a href="/analysis" className="text-muted-foreground hover:text-foreground transition-colors font-semibold">
                                Analysis
                            </a>
                            <a href="/profile" className="text-muted-foreground hover:text-foreground transition-colors font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Profile
                            </a>
                            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                                <Button variant="ghost" onClick={logout} className="justify-start text-muted-foreground hover:text-foreground">
                                    Logout
                                </Button>
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}