import { useState } from "react"
import { useAuth } from "@/hooks/AuthContext"
import ThemeToggle from "../ThemeToggle"
import { Button } from "@/components/ui/button"
import { Menu, X, User } from "lucide-react"
import Logo from "@/components/custom/Logo"
import ProfileModal from "@/components/custom/ProfileModal/ProfileModal"
import "./Header.css"
import { routeNames } from "@/routes/routes"
import { useLocation } from "react-router"

export default function Header() {
    const { logout, user } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const location = useLocation();

    return (
        <nav className="bg-card shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-end items-center h-20">
                    {/* Center: Logo */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <Logo className="h-15" />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <a
                            href={routeNames.HOME}
                            className={`transition-colors font-semibold ${location.pathname === routeNames.HOME ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Home
                        </a>
                        {
                            user?.is_admin && (
                                <a
                                    href={routeNames.USERS}
                                    className={`transition-colors font-semibold ${location.pathname.startsWith(routeNames.USERS) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    Trainees
                                </a>
                            )
                        }
                        <a
                            href={routeNames.ANALYSIS}
                            className={`transition-colors font-semibold ${location.pathname === routeNames.ANALYSIS ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Analysis
                        </a>
                        <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground transition-colors font-semibold flex items-center gap-2"
                            onClick={() => setProfileOpen(true)}
                        >
                            <User className="w-4 h-4" />
                            Profile
                        </button>
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
                            <a
                                href={routeNames.HOME}
                                className={`transition-colors font-semibold ${location.pathname === routeNames.HOME ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Home
                            </a>
                            <a
                                href={routeNames.ANALYSIS}
                                className={`transition-colors font-semibold ${location.pathname === routeNames.ANALYSIS ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Analysis
                            </a>
                            <button
                                type="button"
                                className="text-muted-foreground hover:text-foreground transition-colors font-semibold flex items-center gap-2"
                                onClick={() => setProfileOpen(true)}
                            >
                                <User className="w-4 h-4" />
                                Profile
                            </button>
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
            <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
        </nav>
    )
}