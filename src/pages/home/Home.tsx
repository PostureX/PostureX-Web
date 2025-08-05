import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import PostureInsightsCarousel from "@/components/custom/PostureInsightsCarousel"
import UploadCard from "@/components/custom/UploadCard/UploadCard"
import "./Home.css";
import { CalendarDays, ChevronDown, Plus, X, AlertTriangle, RefreshCcw } from "lucide-react";
import { DateRange } from "react-day-picker";
import api from "@/api/api"; // <-- use axios instance
import { useNavigate } from "react-router";
import { routeNames } from "@/routes/routes";
import { useAnalysisSummary, useRetryAnalysisSummary } from "@/hooks/useAnalysisSummary";
import type { AnalysisSummary } from "@/hooks/useAnalysisSummary";

type UploadData = {
  created_at: string;
  id: number;
  text: string;
  user_id: number;
  video_url: string;
  status?: string; // <-- add status
};

export default function HomePage() {
  const navigate = useNavigate();

  // Fetch analysis summary
  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } = useAnalysisSummary() as { data: AnalysisSummary | undefined, isLoading: boolean, refetch: () => void };
  const { mutate: retrySummary, isPending: isRetrying } = useRetryAnalysisSummary();
  
  useEffect(() => {
    if (!isRetrying) {
      refetchSummary();
    }
  }, [isRetrying, refetchSummary]);

  // State for calendar
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  // Format date range for display
  const formatDateRange = () => {
    if (!selectedDateRange?.from) return "Filter by Date";

    const fromDate = selectedDateRange.from.toLocaleDateString();
    if (!selectedDateRange.to) return `From ${fromDate}`;

    const toDate = selectedDateRange.to.toLocaleDateString();
    return `${fromDate} - ${toDate}`;
  };

  // Clear date range filter
  const clearDateFilter = () => {
    setSelectedDateRange({
      from: undefined,
      to: undefined,
    });
    setShowCalendar(false);
  };

  // Check if filter is active
  const hasActiveFilter = selectedDateRange?.from !== undefined;

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.calendar-container')) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  // Fetch uploads using react-query and axios
  const {
    data: uploadData,
    isLoading: uploadsLoading,
    error: uploadsError,
  } = useQuery<UploadData[], Error>({
    refetchInterval: 5000,
    queryKey: ["uploads"],
    queryFn: async () => {
      const res = await api.get("/analysis/list");
      return res.data as UploadData[];
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 w-full">
      <div className="container mx-auto px-4 py-8">
        {/* Posture Insights (now also Analysis Summary) */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Posture Insights <span className="text-lg font-normal text-muted-foreground">(Weekly)</span>
            </h2>
            <Button variant="outline" onClick={() => retrySummary()} disabled={isRetrying}>
              {isRetrying ? (
                <svg className="animate-spin w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <RefreshCcw className="mr-2" />
              )}
              {isRetrying ? "Regenerating..." : "Regenerate"}
            </Button>
          </div>
          {summaryLoading ? (
            <Card variant="noHighlight" className="mb-4 bg-muted border-0 flex items-center justify-center h-32">
              <CardContent className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-primary mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <div className="loading-spinner text-foreground">Loading insights...</div>
                </div>
              </CardContent>
            </Card>
          ) : (!summary?.insights || summary?.insights?.length === 0) ? (
            <Card variant="noHighlight" className="mb-4 bg-muted border-0 flex items-center justify-center h-32">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-muted-foreground text-lg">{summary?.message || "No insights available."}</div>
              </CardContent>
            </Card>
          ) : (
            <PostureInsightsCarousel insights={summary.insights} />
          )}
        </div>

        {/* Uploads Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">Uploads</h2>
            <div className="flex items-center space-x-4">
              {/* Clear Filter Button */}
              {hasActiveFilter && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
                  onClick={clearDateFilter}
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </Button>
              )}
              <div className="relative calendar-container">
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 min-w-fit"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span className="whitespace-nowrap">{formatDateRange()}</span>
                </Button>
                {showCalendar && (
                  <div className="absolute top-full mt-2 z-50 bg-card rounded-lg shadow-lg border border-border right-0">
                    <Calendar
                      mode="range"
                      selected={selectedDateRange}
                      onSelect={setSelectedDateRange}
                      captionLayout="dropdown"
                      fromYear={2020}
                      toYear={2030}
                      numberOfMonths={1}
                      className="rounded-md border"
                    />
                  </div>
                )}
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <span>Sort</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* New Analysis Card */}
            <button
              onClick={() => navigate(routeNames.ANALYSIS)}
              className="group w-full text-left"
              style={{ minWidth: 0 }}
            >
              <Card className="overflow-hidden upload-container bg-muted border-dashed border-2 border-border hover:border-primary/50 transition-colors cursor-pointer h-full flex flex-col">
                <CardContent className="p-4 flex flex-col flex-1 items-center justify-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary text-center">New Analysis</h3>
                </CardContent>
              </Card>
            </button>
            {/* Conditional rendering based on react-query */}
            {uploadsLoading ? (
              <div className="loading-spinner text-foreground">Loading...</div>
            ) : uploadsError ? (
              <Card variant="noHighlight" className="col-span-1 md:col-span-2 lg:col-span-3 bg-destructive/10 border-destructive/30 border flex items-center justify-center h-64 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-destructive mb-3" />
                  <div className="text-lg font-semibold text-destructive mb-1">Failed to load uploads</div>
                  <div className="text-sm text-destructive/80 mb-4">{uploadsError.message}</div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : (
              uploadData &&
              uploadData.map((upload: UploadData) => (
                <UploadCard
                  key={upload.id}
                  id={upload.id}
                  date={upload.created_at}
                  status={upload.status}
                  onViewAnalysis={
                    upload.status === "failed"
                      ? undefined
                      : () => {
                        // Handle view analysis action
                        console.log(`View analysis for upload ${upload.id}`);
                      }
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}