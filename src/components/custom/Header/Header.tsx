import { useAuth } from "@/hooks/Auth";
import ThemeToggle from "../ThemeToggle";
import "./Header.css";

export default function Header() {
    const { logout } = useAuth();

    return (
        <div className="header-bar bg-gradient-to-r from-blue-50 to-red-50 shadow-sm py-2">
            <img className="spf-crest w-[120px] sm:w-[100px] md:w-[80px] xl:w-[6vw] h-auto mx-2" src="/images/spf_crest_with_tagline.png" alt="Logo"/>
            <img className="logo lg:w-[10vw] lg:h-auto xl:w-[5vw] xl:h-auto mx-2" src="/images/logo.svg" alt="Logo" />
            <div className="nav">
                <a href="/dashboard">Home</a>
                <a href="/analysis">Analysis</a>
                <a onClick={logout} className="cursor-pointer">Logout</a>
                <a href="/profile">
                    <div className="profile-logo"></div>
                </a>
                <ThemeToggle />
            </div>
        </div>
    );
}