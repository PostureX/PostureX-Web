import { useAuth } from "@/hooks/AuthContext";
import { Navigate, Outlet } from "react-router";

export default function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    // You can return a spinner or null while loading
    return null;
  }

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}