import { Outlet } from "react-router";
import Header from "../Header/Header";

export default function MainLayout() {
    return (
        <div className="root-container">
            <Header />
            <Outlet />
        </div>

    );
}
