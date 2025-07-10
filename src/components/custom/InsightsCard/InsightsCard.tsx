import "./InsightsCard.css";
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react";

interface InsightCardProps {
  type: "critical" | "warning" | "good" | "info";
  title: string;
  content: string;
  change: string;
  isDragging?: boolean;
}

export default function InsightsCard({ type, title, content, change, isDragging = false }: InsightCardProps) {
  return (
    <Card
        variant="noHighlight"
        className={`h-full transition-all duration-200 border ${
            type === "critical"
            ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
            : type === "warning"
                ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
                : type === "good"
                ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
        } ${isDragging ? "draggable" : "not-draggable"}`}
    >
      <CardContent className="p-6">
        <Badge
          variant={type === "critical" ? "destructive" : "secondary"}
          className={`mb-3 ${
            type === "warning"
              ? "bg-yellow-500 dark:bg-yellow-600 text-white"
              : type === "good"
                ? "bg-green-500 dark:bg-green-600 text-white"
                : type === "info"
                  ? "bg-blue-500 dark:bg-blue-600 text-white"
                  : ""
          }`}
        >
          {title}
        </Badge>
        <p className="text-foreground mb-4 text-sm leading-relaxed">{content}</p>
        <div
          className={`flex items-center ${
            type === "critical"
              ? "text-red-600 dark:text-red-400"
              : type === "warning"
                ? "text-yellow-600 dark:text-yellow-400"
                : type === "good"
                  ? "text-green-600 dark:text-green-400"
                  : "text-blue-600 dark:text-blue-400"
          }`}
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">{change}</span>
        </div>
      </CardContent>
    </Card>
  )
}