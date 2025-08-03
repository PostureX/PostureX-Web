import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/api/api";
import { RawAnalysisDetailResponse } from "@/types/api";
import { FeedbackData } from "@/types/api";
import { AggregatedResults, AnalysisResult, FrameData, View } from "@/types";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router";
import { routeNames } from "@/routes/routes";
import { toast } from "sonner";

interface UploadDetailContextType {
  deleteAnalysis: () => void;
  isDeleting: boolean;
  deleteError: unknown;
  analysis: RawAnalysisDetailResponse | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  analysisJsons: Record<string, unknown> | undefined;
  isAnalysisJsonsLoading: boolean;
  analysisJsonsError: unknown;
  feedback: FeedbackData | undefined;
  isFeedbackLoading: boolean;
  feedbackError: unknown;
  videoUrls: Record<View, string> | undefined;
  currentView: View | undefined;
  setCurrentView: (view: View) => void;
  currentFrame: FrameData | undefined;
  setCurrentFrame: (frame: FrameData) => void;
  aggregatedResults: Record<View, AggregatedResults> | undefined;
  downloadReport: () => void;
  retryAnalysis: () => void;
  isRetrying: boolean;
  retryError: unknown;
}

const UploadDetailContext = createContext<UploadDetailContextType | undefined>(undefined);

export function UploadDetailProvider({ id, children }: { id: string; children: ReactNode }) {
  const navigate = useNavigate();

  // React Query mutation for deleting analysis
  const {
    mutate: deleteAnalysis,
    isPending: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/analysis/${id}`);
      return res.data;
    },
    onSuccess: () => {
      navigate(routeNames.HOME);
      toast.success("Analysis deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete analysis, please try again.");
    },
  });
  const [videoUrls, setVideoUrls] = useState<Record<View, string> | undefined>(undefined);
  const [analysis, setAnalysis] = useState<RawAnalysisDetailResponse | undefined>(undefined);
  const [analysisJsons, setAnalysisJsons] = useState<Record<View, AnalysisResult> | undefined>(undefined);
  const [feedback, setFeedback] = useState<FeedbackData | undefined>(undefined);
  const [currentView, setCurrentView] = useState<View | undefined>(undefined);
  const [currentFrame, setCurrentFrame] = useState<FrameData | undefined>(undefined);
  const [aggregatedResults, setAggregatedResults] = useState<Record<View, AggregatedResults> | undefined>(undefined);

  const {
    data: analysisData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["analysis", id],
    queryFn: async () => {
      const res = await api.get(`/analysis/${id}`);
      return res.data as RawAnalysisDetailResponse;
    },
    refetchInterval: (query) => {
      if (query.state.data?.status === "in_progress") return 2000;
      return false;
    },
  });

  // Feed analysisData into state
  useEffect(() => {
    if (analysisData) {
      setAnalysis(analysisData);

      // set video urls
      setVideoUrls(
        Object.fromEntries(
          Object.entries(analysisData.uploads)
            .filter(([, url]) => typeof url === "string" && url !== undefined)
        ) as Record<View, string>
      );

      // set current view
      setCurrentView(Object.keys(analysisData.uploads)[0] as View);
    }
  }, [analysisData]);

  // Fetch analysis_json_urls if present
  const angleUrls = analysis?.analysis_json_urls;
  const {
    data: analysisJsonsData,
    isLoading: isAnalysisJsonsLoading,
    error: analysisJsonsError,
  } = useQuery({
    queryKey: ["analysis-jsons", id],
    queryFn: async () => {
      if (!angleUrls) return undefined;
      const results: Record<string, unknown> = {};
      await Promise.all(
        Object.entries(angleUrls).map(async ([key, url]) => {
          if (typeof url === "string") {
            const res = await api.get(url);
            results[key] = res.data;
          }
        })
      );
      return results;
    },
    enabled: !!angleUrls,
  });

  // Feed analysisJsonsData into state
  useEffect(() => {
    if (analysisJsonsData) {
      setAnalysisJsons(analysisJsonsData as Record<View, AnalysisResult>);
      setAggregatedResults(() => {
        const updated: Record<View, AggregatedResults> = {} as Record<View, AggregatedResults>;
        Object.entries(analysisJsonsData).forEach(([key, value]) => {
          updated[key as View] = (value as AnalysisResult).aggregated_results;
        });
        return updated;
      });
    }
  }, [analysisJsonsData]);

  // Fetch feedback_json_url if present
  const feedbackUrl = analysis?.feedback_json_url;
  const {
    data: feedbackData,
    isLoading: isFeedbackLoading,
    error: feedbackError,
  } = useQuery({
    queryKey: ["feedback", id],
    queryFn: async () => {
      if (!feedbackUrl) return undefined;
      const res = await api.get(feedbackUrl);
      return res.data;
    },
    enabled: !!feedbackUrl,
  });

  // Feed feedbackData into state
  useEffect(() => {
    if (feedbackData) setFeedback(feedbackData as FeedbackData);
  }, [feedbackData]);

  // React Query mutation for retrying analysis
  const {
    mutate: retryAnalysis,
    isPending: isRetrying,
    error: retryError,
  } = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/analysis/retry/${id}`);
      return res.data;
    },
    onSuccess: () => {
      refetch();
    }
  });

  const downloadReport = async (): Promise<void> => {
    const zip = new JSZip();

    // Add analysis JSON files
    if (analysisJsons) {
      for (const [view, result] of Object.entries(analysisJsons)) {
        zip.file(`analysis_${view}.json`, JSON.stringify(result, null, 2));
      }
    }

    // Add feedback JSON
    if (feedback) {
      zip.file("feedback.json", JSON.stringify(feedback, null, 2));
    }

    // Add video files
    if (videoUrls) {
      await Promise.all(
        Object.entries(videoUrls).map(async ([view, url]: [string, string]) => {
          try {
            const res = await api.get(url, { responseType: "blob" });
            const arrayBuffer = await res.data.arrayBuffer();
            const fileExtension = getFileNameFromUrl(url).split(".").pop();
            zip.file(`video_${view}.${fileExtension}`, arrayBuffer);
          } catch (error) {
            console.error(`Failed to fetch video for ${view}:`, error);
          }
        })
      );
    }

    // Generate and save ZIP file
    try {
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "report.zip");
    } catch (err) {
      console.error("Error generating ZIP file:", err);
    }
  };

  return (
    <UploadDetailContext.Provider value={{
      analysis,
      isLoading,
      error,
      refetch,
      analysisJsons,
      isAnalysisJsonsLoading,
      analysisJsonsError,
      feedback,
      isFeedbackLoading,
      feedbackError,
      videoUrls,
      currentView,
      setCurrentView,
      currentFrame,
      setCurrentFrame,
      aggregatedResults,
      downloadReport,
      retryAnalysis,
      isRetrying,
      retryError,
      deleteAnalysis,
      isDeleting,
      deleteError
    }}>
      {children}
    </UploadDetailContext.Provider>
  );
}

export function useUploadDetail() {
  const ctx = useContext(UploadDetailContext);
  if (!ctx) throw new Error("useUploadDetail must be used within an UploadDetailProvider");
  return ctx;
}

function getFileNameFromUrl(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1].split("?")[0];
}
