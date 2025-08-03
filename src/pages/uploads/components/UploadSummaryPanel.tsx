"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Info,
  Eye,
  Download,
  Share2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useUploadDetail } from "@/hooks/UploadDetailContext"
import type { MeasurementFeedback, FeedbackMeasurements } from "@/types/api"
import { useState } from "react"
import { AnalysisResult, View } from "@/types/analysis"

export default function UploadSummaryPanel() {
  const { analysis, analysisJsons, feedback, videoUrls, currentView, downloadReport, retryAnalysis } = useUploadDetail()
  const [expandedMetrics, setExpandedMetrics] = useState<Record<string, boolean>>({})

  if (!analysis) return null

  const availableViews: View[] = videoUrls ? (Object.keys(videoUrls) as View[]) : []


  const toggleMetric = (metricId: string) => {
    setExpandedMetrics((prev) => ({ ...prev, [metricId]: !prev[metricId] }))
  }

  const renderFeedbackMetric = (
    view: View,
    metric: FeedbackMeasurements,
    details: MeasurementFeedback
  ) => {
    const metricId = `${view}-${metric}`
    const isExpanded = expandedMetrics[metricId]

    return (
      <Collapsible key={metricId} open={isExpanded} onOpenChange={() => toggleMetric(metricId)}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-3 h-auto">
            <div className="flex items-center gap-2">
              <span className="font-medium capitalize text-left">{metric.replace(/_/g, " ")}</span>
              <Badge variant="outline" className="text-xs">
                {details.commendation ? "✓" : ""} {details.critique ? "⚠" : ""} {details.suggestions ? "💡" : ""}
              </Badge>
            </div>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-3 pb-3">
          <div className="space-y-1">
            {details.commendation && (
              <div className="text-xs text-green-700 dark:text-green-300">{details.commendation}</div>
            )}

            {details.critique && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-2 rounded-r">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-3 h-3 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-yellow-700 dark:text-yellow-300">{details.critique}</div>
                </div>
              </div>
            )}

            {details.suggestions && Array.isArray(details.suggestions) && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-2 rounded-r">
                <div className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">Suggestions:</div>
                <ul className="space-y-1">
                  {details.suggestions.slice(0, 2).map((suggestion: string, i: number) => (
                    <li key={i} className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-1">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                  {details.suggestions.length > 2 && (
                    <li className="text-xs text-blue-600 dark:text-blue-400 italic">
                      +{details.suggestions.length - 2} more suggestions...
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Summary */}
      <Card variant="noHighlight" className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="w-4 h-4" />
            Quick Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{availableViews.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Views</div>
            </div>
          </div>

          <div className="flex items-center justify-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {analysis.status === "completed" && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span className="font-medium text-sm">Analysis Complete</span>
              </div>
            )}
            {analysis.status === "in_progress" && (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Clock className="w-3 h-3" />
                <span className="font-medium text-sm">Processing...</span>
              </div>
            )}
            {analysis.status === "failed" && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-3 h-3" />
                <span className="font-medium text-sm">Analysis Failed</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feedback - Redesigned */}
      {feedback && currentView && feedback[currentView as View] && (
        <Card variant="noHighlight"className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="w-4 h-4" />
              Analysis Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80 px-4 pb-4">
              <div className="font-semibold capitalize text-blue-700 dark:text-blue-300 mb-2">
                {currentView} View
              </div>
              <div className="space-y-1">
                {Object.entries(feedback[currentView as View] as { [measurement in FeedbackMeasurements]?: MeasurementFeedback })
                  .sort(([, aDetails], [, bDetails]) => {
                    const aHasCritique = aDetails?.critique && aDetails.critique.length > 0
                    const bHasCritique = bDetails?.critique && bDetails.critique.length > 0
                    return aHasCritique === bHasCritique ? 0 : aHasCritique ? -1 : 1
                  })
                  .map(([metric, details]) =>
                    details
                      ? renderFeedbackMetric(currentView as View, metric as FeedbackMeasurements, details)
                      : null
                  )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Available Views - Compact */}
      <Card variant="noHighlight" className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="w-4 h-4" />
            Available Views
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {availableViews.length > 0 ? (
              availableViews.map((view) => {
                const analysisResult: AnalysisResult = analysisJsons?.[view] as AnalysisResult
                return (
                  <div
                    key={view}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize text-xs">
                        {view}
                      </Badge>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {analysisResult?.frames_data?.[0]?.keypoints?.length || 0} keypoints
                      </span>
                    </div>
                    {analysisResult?.aggregated_results?.overall_posture_score && (
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        {analysisResult.aggregated_results.overall_posture_score.toFixed(1)}
                      </span>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm">No views available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions - Compact */}
      <Card variant="noHighlight" className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full bg-transparent" variant="outline" size="sm" onClick={downloadReport}>
            <Download className="w-3 h-3 mr-2" />
            Export Data
          </Button>
          <Button className="w-full bg-transparent" variant="outline" size="sm">
            <Share2 className="w-3 h-3 mr-2" />
            Share Analysis
          </Button>
          <Button className="w-full bg-transparent" variant="outline" size="sm" onClick={retryAnalysis}>
            <RefreshCw className="w-3 h-3 mr-2" />
            Reprocess
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
