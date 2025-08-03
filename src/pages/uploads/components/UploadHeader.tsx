"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileVideo, RefreshCw, Share2, Download, Trash2 } from "lucide-react"
import { useUploadDetail } from "@/hooks/UploadDetailContext"
import { useNavigate } from "react-router"

const getStatusVariant = (status: string) => {
  switch (status) {
    case "completed":
      return "default"
    case "in_progress":
      return "secondary"
    case "failed":
      return "destructive"
    default:
      return "secondary"
  }
}

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "completed":
//       return "text-green-600 dark:text-green-400"
//     case "in_progress":
//       return "text-blue-600 dark:text-blue-400"
//     case "failed":
//       return "text-red-600 dark:text-red-400"
//     default:
//       return "text-gray-600 dark:text-gray-400"
//   }
// }

export default function UploadHeader() {
  const navigate = useNavigate()
  const { analysis, downloadReport, retryAnalysis, deleteAnalysis, isDeleting } = useUploadDetail()

  if (!analysis) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mt-1">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Analysis #{analysis.id}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FileVideo className="w-4 h-4" />
                <span className="capitalize">
                  Video
                </span>
              </div>
              <Badge variant={getStatusVariant(analysis.status)} className="capitalize">
                {analysis.status.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {analysis.status === "completed" && (
            <>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={downloadReport}>
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" size="sm" onClick={deleteAnalysis} disabled={isDeleting}>
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </>
          )}
          {analysis.status === "failed" && (
            <Button variant="outline" size="sm" onClick={retryAnalysis}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Analysis
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
