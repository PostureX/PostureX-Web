import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/api/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { UploadData } from "@/types";

export interface AnalysisSummaryInsight {
  type: "critical" | "warning" | "info";
  title: string;
  content: string;
}

export interface AnalysisSummary {
  id?: number;
  status?: string;
  model_name?: string;
  date_generated?: string;
  insights: AnalysisSummaryInsight[] | null;
  insights_url?: string;
  message?: string;
}

export function useAnalysisSummary(id: string | undefined) {
  // Fetch summary, then fetch insights if insights_url is present
  return useQuery({
    queryKey: ["analysis-summary", id],
    queryFn: async () => {
      try {
        const res = await api.get("/analysis/summary" + (id ? `/${id}` : ""));
        const summary: AnalysisSummary = res.data;
        if (summary.insights_url) {
          // Fetch insights from the provided URL
          const insightsRes = await api.get(summary.insights_url);
          return {
            ...summary,
            insights: insightsRes.data?.insights ?? summary.insights,
          };
        }
        return summary;
      } catch (err) {
        const axiosErr = err as AxiosError;
        if (axiosErr.response?.status === 404) {
          return axiosErr.response.data;
        }
        throw err;
      }
    },
  });
}

// Retry summary generation
export function useRetryAnalysisSummary(id: string | undefined) {
  return useMutation({
    mutationFn: async () => {
      try {
        const res = await api.post("/analysis/summary/retry" + (id ? `/${id}` : ""));
        const summary: AnalysisSummary = res.data;
        if (summary.insights_url) {
          const insightsRes = await api.get(summary.insights_url);
          return {
            ...summary,
            insights: insightsRes.data?.insights ?? summary.insights,
          };
        }
        return summary;
      } catch (err) {
        const axiosErr = err as AxiosError;
        if (axiosErr.response?.status === 404) {
          // show toast with message
          toast.error((axiosErr.response?.data as { message?: string })?.message);
          return axiosErr.response.data;
        }
        throw err;
      }
    },
  });
}

export function useGetUserDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await api.get("/user" + (id ? `/${id}` : ""));
      return res.data.user;
    },
  });
}

export function useUploads(id: string | undefined) {
  return useQuery<UploadData[], Error>({
    refetchInterval: 5000,
    queryKey: ["uploads", id],
    queryFn: async () => {
      const res = await api.get("/analysis/list" + (id ? `/${id}` : ""));
      return res.data as UploadData[];
    },
  });
}
