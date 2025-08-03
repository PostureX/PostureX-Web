import MainLayout from "@/components/custom/MainLayout/MainLayout";
import HomePage from "@/pages/home/Home";
import { createBrowserRouter, Outlet } from "react-router";
import Landing from "@/pages/landing/Landing";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "@/hooks/AuthContext";
import { AnalysisProvider } from "@/hooks/AnalysisContext";
import Analysis from "@/pages/analysis/Analysis";
import GuestRoute from "./GuestRoute";
import NotFound from "@/pages/404/NotFound";
import UploadDetailsPage from "@/pages/uploads/Uploads";

export const routeNames = {
  HOME: "/dashboard",
  LANDING: "/",
  ANALYSIS: "/analysis",
  LOGIN: "/login",
  UPLOADS: "/uploads/:id",
};

export const router = createBrowserRouter([
  {
    element: <AuthProvider><Outlet /></AuthProvider>,
    errorElement: <NotFound />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          {
            path: routeNames.LANDING,
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
                path: routeNames.HOME,
                Component: HomePage,
              },
              {
                path: routeNames.ANALYSIS,
                element: <AnalysisProvider><Analysis /></AnalysisProvider>,
              },
              {
                path: routeNames.UPLOADS,
                element: <UploadDetailsPage />
              }
            ],
          },
        ],
      },
    ]
  },
]);
