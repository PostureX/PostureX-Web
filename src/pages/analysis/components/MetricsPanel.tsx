import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useAnalysis } from "@/hooks/AnalysisContext"
import { Target, AlertTriangle, CheckCircle, Camera, Grid } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

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

export default function MetricsPanel() {
  const { currentScore, postureMetrics, analysisMode, uploadedVideos } = useAnalysis()

  const uploadedAngles = Object.keys(uploadedVideos)
  const uploadedCount = uploadedAngles.length

  return (
    <div className="space-y-6">
      {/* Current Score */}
      <Card variant="noHighlight">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Overall Score
            {analysisMode === "upload" && uploadedCount > 0 && (
              <Badge variant="outline" className="ml-2">
                {uploadedCount} angle{uploadedCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{currentScore}%</div>
            <Progress value={currentScore} className="mb-4" />
            <Badge variant={currentScore >= 90 ? "default" : currentScore >= 70 ? "secondary" : "destructive"}>
              {currentScore >= 90 ? "Excellent" : currentScore >= 70 ? "Good" : "Needs Improvement"}
            </Badge>
          </div>
          <p className="font-semibold mt-6 text-md text-gray-600">
            {analysisMode === "upload" ? "Multi-Angle Analysis" : "Real-Time Analysis"}
          </p>
          {postureMetrics.map((metric, index) => (
            <div key={index} className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{metric.name}</span>
                {getStatusIcon(metric.status)}
              </div>
              <div className="flex items-center gap-2">
                <Progress value={metric.value} className="flex-1" />
                <span className={`text-sm font-medium ${getStatusColor(metric.status)}`}>{metric.value}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Multi-Angle Status - only show in upload mode */}
      {analysisMode === "upload" && (
        <Card variant="noHighlight">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid className="w-5 h-5" />
              Analysis Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Upload Summary */}
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Uploaded Angles</div>
                    <div className="text-sm text-muted-foreground">
                      {uploadedCount > 0 ? `${uploadedCount}/4 angles ready` : "No videos uploaded"}
                    </div>
                  </div>
                </div>
                <Badge variant={uploadedCount > 0 ? "default" : "outline"}>{uploadedCount}/4</Badge>
              </div>

              {/* Individual Angle Status */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "front", label: "Front", icon: "👤" },
                  { key: "back", label: "Back", icon: "🔄" },
                  { key: "left", label: "Left", icon: "👈" },
                  { key: "right", label: "Right", icon: "👉" },
                ].map((angle) => {
                  const hasVideo = uploadedVideos[angle.key as keyof typeof uploadedVideos]

                  return (
                    <div
                      key={angle.key}
                      className={`p-2 rounded border text-center transition-colors ${
                        hasVideo
                          ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                          : "border-gray-200 bg-gray-50 dark:bg-gray-800/20 dark:border-gray-700"
                      }`}
                    >
                      <div className="text-lg mb-1">{angle.icon}</div>
                      <div className="text-xs font-medium">{angle.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {hasVideo ? (
                          <div className="flex items-center justify-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            Ready
                          </div>
                        ) : (
                          "Not uploaded"
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {uploadedCount > 0 && (
                <div className="text-center pt-2">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-950/20">
                    Ready for simultaneous analysis
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
