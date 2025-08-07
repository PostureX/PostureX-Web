import { useAuth } from "@/hooks/AuthContext";
import LoadingPage from "@/pages/loading/Loading";
import { Navigate, Outlet } from "react-router";

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a spinner or skeleton here
    return <LoadingPage />;
  }

  return user && user.is_admin ? <>
    <Outlet />
  </> : <Navigate to="/" replace />;
}