"use client"

import { UploadDetailProvider } from "@/hooks/UploadDetailContext"
import UploadHeader from "./components/UploadHeader"
import UploadsViewSelector from "./components/UploadsViewSelector"
import UploadStatusOverview from "./components/UploadStatusOverview"
import UploadAnalysisPanel from "./components/UploadAnalysisPanel"
import UploadRawDataPanel from "./components/UploadRawDataPanel"
import UploadSummaryPanel from "./components/UploadSummaryPanel"
import { useParams } from "react-router"
import VideoAnalysisPlayer from "./components/VideoAnalysisPlayer"

export default function UploadDetailsPage() {
  const params = useParams()
  const id = params.id as string

  return (
    <UploadDetailProvider id={id}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="space-y-6">
            <UploadHeader />
            <UploadStatusOverview />
            {/* Video Analysis Section */}
            <UploadsViewSelector />
            <VideoAnalysisPlayer />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <UploadAnalysisPanel />
                <UploadRawDataPanel />
              </div>
              <div className="space-y-6">
                <UploadSummaryPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </UploadDetailProvider>
  )
}
