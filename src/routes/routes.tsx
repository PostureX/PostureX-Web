import MainLayout from "@/components/custom/MainLayout/MainLayout";
import HomePage from "@/pages/home/Home";
import { createBrowserRouter, Outlet } from "react-router";
import Landing from "@/pages/landing/Landing";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "@/hooks/AuthContext";
import { AnalysisProvider } from "@/hooks/AnalysisContext";
import Analysis from "@/pages/analysis/Analysis";
import NotFound from "@/pages/404/notFound";
import GuestRoute from "./GuestRoute";
import VideoUpload from "@/pages/analysis/components/InferencePanel/VideoUpload";

export const router = createBrowserRouter([
  {
    element: <AuthProvider><Outlet /></AuthProvider>,
    errorElement: <NotFound />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          {
            path: "/",
            Component: Landing,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            Component: MainLayout,
            children: [
              {
                path: "/dashboard",
                Component: HomePage,
                id: "dashboard",
              },
              {
                path: "/analysis",
                element: <AnalysisProvider><Analysis /></AnalysisProvider>,
                id: "analysis",
              }
            ],
          },
        ],
      },
    ]
  },
]);
