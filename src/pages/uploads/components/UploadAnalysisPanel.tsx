import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3 } from "lucide-react"
import { useUploadDetail } from "@/hooks/UploadDetailContext"
import { AnalysisResult, FrameData, View } from "@/types"

interface Measurement {
  name: string
  value: number | string
  type: "score" | "measurement"
}

function getMeasurementsByView(analysisJsons: Record<string, unknown> | undefined, viewType: string) {
  const analysisResult = analysisJsons?.[viewType] as AnalysisResult
  if (!analysisResult?.aggregated_results) return []

  const measurements: Measurement[] = []
  const { score, measurements: rawMeasurements } = analysisResult.aggregated_results

  if (score) {
    Object.entries(score).forEach(([key, value]) => {
      measurements.push({
        name: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        value,
        type: "score",
      })
    })
  }

  if (rawMeasurements) {
    Object.entries(rawMeasurements).forEach(([key, value]) => {
      measurements.push({
        name: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        value,
        type: "measurement",
      })
    })
  }

  return measurements
}

function getMeasurementStatus(value: string | number) {
  if (value === "" || value === "unknown" || value === null || value === undefined) {
    return {
      status: "unknown",
      color: "text-gray-500 dark:text-gray-400",
      badge: "secondary" as const,
    }
  }
  if (typeof value === "number") {
    if (value === 0)
      return {
        status: "neutral",
        color: "text-blue-600 dark:text-blue-400",
        badge: "secondary" as const,
      }
    return {
      status: "measured",
      color: "text-green-600 dark:text-green-400",
      badge: "default" as const,
    }
  }
  return {
    status: "measured",
    color: "text-green-600 dark:text-green-400",
    badge: "default" as const,
  }
}

function formatMeasurementValue(value: string | number) {
  if (value === "" || value === "unknown" || value === null || value === undefined) {
    return "Not measured"
  }
  if (typeof value === "number") {
    return value === 0 ? "0.0" : value.toFixed(2)
  }
  return value.toString()
}

const viewConfigs = {
  front: {
    label: "Front View",
    icon: "👤",
    description: "Face-on shooting stance analysis",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  back: {
    label: "Back View",
    icon: "🔄",
    description: "Rear stance and posture analysis",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  left: {
    label: "Left Side",
    icon: "⬅️",
    description: "Left profile shooting form",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  right: {
    label: "Right Side",
    icon: "➡️",
    description: "Right profile shooting form",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
}

export default function UploadAnalysisPanel() {
  const { analysisJsons, isAnalysisJsonsLoading, videoUrls, currentView, currentFrame } = useUploadDetail();
  const availableViews: View[] = Object.keys(videoUrls || {}) as View[];
  const activeView = currentView || availableViews[0] || "front";

  if (isAnalysisJsonsLoading) {
    return (
      <Card variant="noHighlight" className="bg-white dark:bg-gray-800">
        <CardContent className="p-8 text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading analysis results...</p>
        </CardContent>
      </Card>
    )
  }

  if (!analysisJsons || !activeView) {
    return (
      <Card variant="noHighlight" className="bg-white dark:bg-gray-800">
        <CardContent className="p-8 text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No analysis results available</p>
        </CardContent>
      </Card>
    )
  }

  const measurements = getMeasurementsByView(analysisJsons, activeView);
  const activeAnalysis = analysisJsons[activeView] as AnalysisResult;
  // Use currentFrame from context if available
  const frameData: FrameData | undefined = currentFrame || activeAnalysis?.frames_data?.[0];

  return (
    <Card variant="noHighlight" className="bg-white dark:bg-gray-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analysis Results
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* View Info */}
        <div className={`rounded-lg p-4 ${viewConfigs[activeView as keyof typeof viewConfigs]?.color}`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{viewConfigs[activeView as keyof typeof viewConfigs]?.icon}</span>
            <div>
              <h3 className="font-semibold">{viewConfigs[activeView as keyof typeof viewConfigs]?.label}</h3>
              <p className="text-sm opacity-80">{viewConfigs[activeView as keyof typeof viewConfigs]?.description}</p>
            </div>
          </div>
          <div className="text-sm opacity-80">
            Keypoints: {frameData?.keypoints?.length || 0}
          </div>
        </div>

        {/* Measurements */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-gray-900 dark:text-white">Measurements & Scores</h4>
          {measurements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {measurements.map((measurement, index) => {
                const status = getMeasurementStatus(measurement.value)
                return (
                  <Card variant="noHighlight" key={index} className="bg-gray-50 dark:bg-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{measurement.name}</span>
                        <Badge variant={status.badge} className="text-xs">
                          {measurement.type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-lg font-semibold ${status.color}`}>
                          {formatMeasurementValue(measurement.value)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{status.status}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No measurements available for this view</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
