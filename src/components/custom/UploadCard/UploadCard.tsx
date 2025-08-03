import "./UploadCard.css";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";

interface UploadCardProps {
  id: number;
  date: string;
  status?: string;
  onViewAnalysis?: () => void;
}

function getStatusBadge(status?: string) {
  switch (status) {
    case "completed":
      return (
        <span className="ml-2 px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Completed
        </span>
      );
    case "in_progress":
      return (
        <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1">
          <Clock className="w-3 h-3 animate-spin" /> Processing
        </span>
      );
    case "queued":
      return (
        <span className="ml-2 px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold flex items-center gap-1">
          <Clock className="w-3 h-3" /> Queued
        </span>
      );
    case "failed":
      return (
        <span className="ml-2 px-2 py-0.5 rounded bg-destructive/20 text-destructive text-xs font-semibold flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> Failed
        </span>
      );
    default:
      return (
        <span className="ml-2 px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs font-semibold flex items-center gap-1">
          <Clock className="w-3 h-3" /> Unknown
        </span>
      );
  }
}

export default function UploadCard({ id, date, status, onViewAnalysis }: UploadCardProps) {
  const navigate = useNavigate();

  const isFailed = status === "failed";
  return (
    <Card onClick={() => navigate(`/uploads/${id}`)} variant="noHighlight" className={`overflow-hidden upload-container bg-card border-border hover:cursor-pointer ${isFailed ? "border-destructive/50 bg-destructive/5" : ""}`}>
      <div className="aspect-video bg-muted relative flex items-center justify-center">
        {isFailed && (
          <AlertCircle className="w-10 h-10 text-destructive opacity-80" />
        )}
        {/* You can add Image component here if needed */}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-primary">Front Posture Analysis #{id}</h3>
          {getStatusBadge(status)}
        </div>
        <div className={`flex items-center text-sm mb-4 ${isFailed ? "text-destructive" : "text-muted-foreground"}`}>
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>{date}</span>
        </div>
        {isFailed ? (
          <div className="text-destructive text-xs mb-2">All files failed to process.</div>
        ) : null}
        <Button 
          variant={isFailed ? "outline" : "outline"} 
          className="w-full"
          onClick={onViewAnalysis}
          disabled={isFailed}
        >
          {isFailed ? "Unavailable" : "View Analysis"}
        </Button>
      </CardContent>
    </Card>
  )
}