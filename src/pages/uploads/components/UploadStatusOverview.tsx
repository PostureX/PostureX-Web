import { Card, CardContent } from "@/components/ui/card"
import { Eye, Target, Activity, FileVideo } from "lucide-react"
import { useUploadDetail } from "@/hooks/UploadDetailContext"
import { View, AnalysisResult } from "@/types"
import { getStatusColor } from "../utils/Utils"

export default function UploadStatusOverview() {
  const { analysis, analysisJsons, videoUrls } = useUploadDetail()

  if (!analysis) return null

  const availableViews: View[] = videoUrls ? (Object.keys(videoUrls) as View[]) : [];
  const totalKeypoints = analysisJsons
    ? Object.values(analysisJsons).reduce((acc: number, result) => {
        const res = result as AnalysisResult;
        if (res?.frames_data && res.frames_data.length > 0) {
          return acc + (res.frames_data[0]?.keypoints?.length || 0);
        }
        return acc;
      }, 0)
    : 0;

  const totalFrames = analysisJsons
    ? Object.values(analysisJsons).reduce((acc: number, result) => {
        const res = result as AnalysisResult;
        return acc + (res?.total_frames || 0);
      }, 0)
    : 0;

  const stats = [
    {
      icon: Eye,
      value: availableViews.length,
      label: "Camera Views",
      color: "bg-blue-500",
      textColor: "text-gray-900 dark:text-white",
      labelColor: "text-gray-600 dark:text-gray-400",
    },
    {
      icon: Target,
      value: totalKeypoints,
      label: "Keypoints Detected",
      color: "bg-green-500",
      textColor: "text-gray-900 dark:text-white",
      labelColor: "text-gray-600 dark:text-gray-400",
    },
    {
      icon: FileVideo,
      value: totalFrames,
      label: "Total Frames",
      color: "bg-purple-500",
      textColor: "text-gray-900 dark:text-white",
      labelColor: "text-gray-600 dark:text-gray-400",
    },
    {
      icon: Activity,
      value: analysis.status === "completed" ? "Complete" : analysis.status === "in_progress" ? "Processing" : "Failed",
      label: "Status",
      color: "bg-gray-500",
      textColor: getStatusColor(analysis.status),
      labelColor: getStatusColor(analysis.status),
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card variant="noHighlight" key={index} className="bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={"rounded-lg p-3 " + stat.color}>
                <stat.icon className="w-6 h-6 text-white " />
              </div>
              <div className="space-y-1">
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                <p className="text-sm">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
