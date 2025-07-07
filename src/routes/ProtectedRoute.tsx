import { useAuth } from "@/hooks/Auth";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    // You can return a spinner or null while loading
    return null;
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
}