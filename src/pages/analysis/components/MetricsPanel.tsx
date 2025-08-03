import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useAnalysis } from "@/hooks/AnalysisContext"
import { Target, AlertTriangle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PostureMetric } from "@/types"

const metricLabels: Record<string, string> = {
  knee_angle: "Knee Angle",
  head_tilt: "Head Tilt",
  arm_angle: "Arm Angle",
  arm_bent_angle: "Arm Bent Angle",
  leg_spread: "Leg Spread",
  back_angle: "Back Angle",
  foot_to_shoulder_offset: "Foot to Shoulder Offset",
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "excellent":
      return "text-green-600"
    case "good":
      return "text-blue-600"
    case "warning":
      return "text-yellow-600"
    case "poor":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "excellent":
    case "good":
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />
    case "poor":
      return <AlertTriangle className="w-4 h-4 text-red-600" />
    default:
      return null
  }
}

// Example: assign status based on value (customize as needed)
const getMetricStatus = (value: number) => {
  if (typeof value === "string") return "good"
  if (value >= 90) return "excellent"
  if (value >= 80) return "good"
  if (value >= 60) return "warning"
  return "poor"
}

export default function MetricsPanel() {
  const { postureMetrics, analysisMode, rawScores } = useAnalysis()

  // If rawScores is an object (not null/array), convert to array of metric objects
  let metrics: {
    key: string
    label: string
    value: number
    status: string
  }[] = []

  if (rawScores && typeof rawScores === "object" && !Array.isArray(rawScores)) {
    metrics = Object.entries(rawScores).map(([key, value]) => ({
      key,
      label: metricLabels[key] || key,
      value: typeof value === "number" ? value : Number(value),
      status: getMetricStatus(typeof value === "number" ? value : Number(value)),
    }))
  } else if (Array.isArray(postureMetrics)) {
    metrics = postureMetrics.map((metric: PostureMetric) => {
      const key = metric.key || metric.name
      const value = metric.value
      return {
        key,
        label: metricLabels[key] || key,
        value,
        status: getMetricStatus(value),
      }
    })
  }

  if (analysisMode === "upload") {
    return null
  }

  if (!metrics.length) {
    return (
      <div className="space-y-6">
        <Card variant="noHighlight">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              No Metrics Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500">No analysis data to display.</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate a simple average score for display
  const numericValues = metrics
    .map((m) => (typeof m.value === "number" ? m.value : undefined))
    .filter((v) => typeof v === "number") as number[]
  const score =
    numericValues.length > 0
      ? Math.round(
          numericValues.reduce((sum, v) => sum + (typeof v === "number" ? v : 0), 0) / numericValues.length
        )
      : 0

  return (
    <div className="space-y-6">
      {/* Current Score */}
      <Card variant="noHighlight">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Overall Score
            <Badge variant="outline" className="ml-2">
              {metrics.length} metric{metrics.length !== 1 ? "s" : ""}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
            <Progress value={score} className="mb-4" />
            <Badge variant={score >= 90 ? "default" : score >= 70 ? "secondary" : "destructive"}>
              {score >= 90 ? "Excellent" : score >= 70 ? "Good" : "Needs Improvement"}
            </Badge>
          </div>
          <p className="font-semibold mt-6 text-md text-gray-600">
            Real-Time Analysis
          </p>
          {metrics.map((metric, index) => (
            <div key={index} className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{metric.label}</span>
                {getStatusIcon(metric.status)}
              </div>
                <div className="flex items-center gap-2">
                <Progress
                  value={
                  typeof metric.value === "number"
                    ? Math.round(metric.value)
                    : 100
                  }
                  className="flex-1"
                />
                <span className={`text-sm font-medium ${getStatusColor(metric.status)}`}>
                  {typeof metric.value === "number"
                  ? `${Math.round(metric.value)}%`
                  : String(metric.value)}
                </span>
                </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
