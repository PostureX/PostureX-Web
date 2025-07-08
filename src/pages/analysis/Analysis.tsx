import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Activity,
  Camera,
} from "lucide-react"
import { useAnalysis } from "@/hooks/Analysis"
import AdditionalInfoPanel from "./components/AditionalInfoPanel"
import InferencePanel from "./components/InferencePanel/InferencePanel"
import MetricsPanel from "./components/MetricsPanel"

export default function Analysis() {
  const { analysisMode } = useAnalysis();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gun Posture Analysis</h1>
            <p className="text-muted-foreground mt-1">Real-time shooting stance and posture evaluation</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1">
              {
                analysisMode === "live" ?
                  <>
                    <Activity className="w-4 h-4 mr-2" />
                    Real-Time Analysis
                  </> :
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Video Analysis
                  </>
              }
            </Badge>
            <Button variant="outline" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Feed */}
          <InferencePanel />

          {/* Metrics Panel */}
          <MetricsPanel />
        </div>

        {/* Additional Information */}
        <AdditionalInfoPanel />
      </div>
    </div>
  )
}
