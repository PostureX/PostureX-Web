import UploadProgressMenu from "@/components/custom/UploadProgress/UploadProgressMenu";
import { useAuth } from "@/hooks/AuthContext";
import LoadingPage from "@/pages/loading/Loading";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a spinner or skeleton here
    return <LoadingPage />;
  }

  return user ? <>
    <UploadProgressMenu />
    <Outlet />
  </> : <Navigate to="/" replace />;
}