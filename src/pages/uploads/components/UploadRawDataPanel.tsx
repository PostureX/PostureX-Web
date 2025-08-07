import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useUploadDetail } from "@/hooks/UploadDetailContext"
import { AnalysisResult } from "@/types"
import { Button } from "@/components/ui/button"

export default function UploadRawDataPanel() {
  const { analysisJsons, analysis, downloadRawData } = useUploadDetail()

  if (!analysis || !analysisJsons) return null

  return (
    <Card variant="noHighlight" className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Detailed Analysis Data</CardTitle>
        <Button onClick={downloadRawData}>Download Raw Data</Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="structured" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="structured">Structured View</TabsTrigger>
            <TabsTrigger value="raw">Raw JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="structured" className="space-y-6 mt-6">
            {Object.entries(analysisJsons).map(([viewType, analysisResult]) => {
              const result = analysisResult as AnalysisResult
              return (
                <Card variant="noHighlight" key={viewType} className="border border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Badge variant="outline" className="capitalize">
                        {viewType}
                      </Badge>
                      {result?.aggregated_results?.overall_posture_score && (
                        <Badge variant="default">
                          Score: {result.aggregated_results.overall_posture_score.toFixed(1)}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Overall Results */}
                    {result?.aggregated_results && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Aggregated Results</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {Object.entries(result.aggregated_results).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              </div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {typeof value === "number"
                                  ? value.toFixed(4)
                                  : typeof value === "object"
                                    ? JSON.stringify(value)
                                    : value?.toString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Frame Data Summary */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                        Frame Data ({result?.frames_data?.length || 0} frames)
                      </h4>
                      {result?.frames_data && result.frames_data.length > 0 ? (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Processed {result.frames_data.length} frames with{" "}
                            {result.frames_data[0]?.keypoints?.length || 0} keypoints each
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            Total frames: {result.total_frames}, Frame skip: {result.frame_skip}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            No frame data available for this view
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="raw" className="mt-6">
            <div className="bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg p-4 overflow-auto max-h-96">
              <pre className="text-sm whitespace-pre-wrap font-mono">{JSON.stringify(analysisJsons, null, 2)}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
