import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import PostureInsightsCarousel from "@/components/custom/PostureInsightsCarousel"
import UploadCard from "@/components/custom/UploadCard/UploadCard"
import "./Home.css";
import Slider from "@/components/custom/Slider/Slider";
import { CalendarDays, ChevronDown, Plus, Moon, Sun, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useTheme } from "@/hooks/Theme";

type UploadData = {
  created_at: string;
  id: number;
  text: string;
  user_id: number;
  video_url: string;
};

export default function HomePage() {
  const [theme, setTheme] = useTheme();

  // Transform insights data to new format
  const insights: Array<{
    type: "critical" | "warning" | "good" | "info";
    title: string;
    content: string;
    change: string;
  }> = [
    {
      type: "critical",
      title: "Critical Issue",
      content: "Your feet are not shoulder width apart. They are 20cm smaller than your shoulder width.",
      change: "15% worse than previous",
    },
    {
      type: "warning",
      title: "Posture Alert",
      content: "Your back is slightly hunched. Your back is slightly hunched. Your back is slightly hunched. Your back is slightly hunched. Your back is slightly hunched. Your back is slightly hunched andf abaias ajosinffak ajksdjklj.",
      change: "10% worse than previous",
    },
    {
      type: "good",
      title: "Good Progress",
      content: "You are sitting for too long.",
      change: "5% better than previous",
    },
    {
      type: "good",
      title: "Good Progress",
      content: "You are sitting for too long.",
      change: "5% better than previous",
    },
    {
      type: "good",
      title: "Good Progress",
      content: "You are sitting for too long.",
      change: "5% better than previous",
    },
    {
      type: "good",
      title: "Good Progress",
      content: "You are sitting for too long.",
      change: "5% better than previous",
    },
  ];

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

  // Fetch data from API
  const [uploadData, setUploadData] = useState<UploadData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiURL = "http://localhost:5000"

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${apiURL}/api/analysis`,{
        method: "GET",
        credentials: 'include'
      }).then(res => {
        if (!res.ok) throw new Error("API error for upload");
        return res.json();
      }),
      // fetch("/api/insights").then(res => {
      //   if (!res.ok) throw new Error("API error for insights");
      //   return res.json();
      // }),
    ])
      .then(([upload]) => {
        setUploadData(upload.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Posture Tabs */}
        <div className="mb-8">
          <h2 className="text-muted-foreground mb-4 text-[20px]">Posture</h2>
          <Slider className="" />
        </div>

        {/* Posture Insights */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Posture Insights <span className="text-lg font-normal text-muted-foreground">(Weekly)</span>
          </h2>
          <PostureInsightsCarousel insights={insights} />
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
            <Card className="bg-muted border-dashed border-2 border-border hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-8 flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-primary">New Analysis</h3>
              </CardContent>
            </Card>

            {/* Conditional rendering based on loading state */}
            {loading ? (
              <div className="loading-spinner text-foreground">Loading...</div>
            ) : error ? (
              <div className="error-message text-destructive">{error}</div>
            ) : (
              uploadData && uploadData.map((upload: UploadData) => (
                <UploadCard 
                  key={upload.id} 
                  id={upload.id} 
                  date={upload.created_at}
                  onViewAnalysis={() => {
                    // Handle view analysis action
                    console.log(`View analysis for upload ${upload.id}`);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
};