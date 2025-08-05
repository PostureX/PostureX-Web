import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UploadCard from "@/components/custom/UploadCard/UploadCard";
import { AlertTriangle, Plus } from "lucide-react";
import { formatDate } from "../../utils/Utils";
import api from "@/api/api";
import { UploadData } from "@/types";

export default function UserDetails() {
  const params = useParams();
  const userId = params.id;

  // Fetch uploads for this user
  const {
    data: uploadData,
    isLoading: uploadsLoading,
    error: uploadsError,
    refetch,
  } = useQuery<UploadData[], Error>({
    queryKey: ["uploads", userId],
    queryFn: async () => {
      const res = await api.get(`/analysis/list/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">User Analyses</h2>
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uploadsLoading ? (
            <div className="loading-spinner text-foreground">Loading...</div>
          ) : uploadsError ? (
            <Card
              variant="noHighlight"
              className="col-span-1 md:col-span-2 lg:col-span-3 bg-destructive/10 border-destructive/30 border flex items-center justify-center h-64 shadow-sm"
            >
              <CardContent className="flex flex-col items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-destructive mb-3" />
                <div className="text-lg font-semibold text-destructive mb-1">
                  Failed to load uploads
                </div>
                <div className="text-sm text-destructive/80 mb-4">
                  {uploadsError.message}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => refetch()}
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : uploadData && uploadData.length > 0 ? (
            uploadData.map((upload: UploadData) => {
              const dateObj = new Date(upload.created_at);
              const formattedDate = formatDate(dateObj);
                const videoUrl = Object.entries(upload.uploads).length > 0 ? Object.values(upload.uploads)[0] : undefined;
                return (
                  <UploadCard
                    key={upload.id}
                    id={upload.id}
                    date={formattedDate}
                    status={upload.status}
                    thumbnail={videoUrl ? videoUrl : undefined}
                    onViewAnalysis={
                      upload.status === "failed"
                        ? undefined
                        : () => {
                            // Handle view analysis action
                            console.log(`View analysis for upload ${upload.id}`);
                          }
                    }
                  />
                );
              })
          ) : (
            <Card
              variant="noHighlight"
              className="col-span-1 md:col-span-2 lg:col-span-3 bg-muted border-0 flex items-center justify-center h-64"
            >
              <CardContent className="flex flex-col items-center justify-center">
                <Plus className="w-10 h-10 text-muted-foreground mb-3" />
                <div className="text-lg font-semibold text-muted-foreground mb-1">
                  No analyses found for this user
                </div>
                <div className="text-sm text-muted-foreground/80 mb-4">
                  This user has not uploaded any analyses yet.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}