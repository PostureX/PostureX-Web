import { Outlet } from "react-router";
import Header from "../Header/Header";

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <Header />
            <Outlet />
        </div>

    );
}
