import MainLayout from "@/components/custom/MainLayout/MainLayout";
import HomePage from "@/pages/home/Home";
import { createBrowserRouter, Outlet } from "react-router";
import Landing from "@/pages/landing/Landing";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "@/hooks/Auth";
import { AnalysisProvider } from "@/hooks/AnalysisContext";
import Analysis from "@/pages/analysis/Analysis";

export const router = createBrowserRouter([
  {
    element: <AuthProvider><Outlet /></AuthProvider>,
    children: [
      {
        path: "/",
        Component: Landing,
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
              },
            ],
          },
        ],
      },
    ]
  },
]);
