import "./UploadCard.css";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react";

interface UploadCardProps {
  id: number;
  date: string;
  onViewAnalysis?: () => void;
}

export default function UploadCard({ id, date, onViewAnalysis }: UploadCardProps) {
  return (
    <Card className="overflow-hidden upload-container bg-card border-border">
      <div className="aspect-video bg-muted relative">
        {/* You can add Image component here if needed */}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-primary mb-2">Front Posture Analysis #{id}</h3>
        <div className="flex items-center text-destructive text-sm mb-4">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>{date}</span>
        </div>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onViewAnalysis}
        >
          View Analysis
        </Button>
      </CardContent>
    </Card>
  )
}