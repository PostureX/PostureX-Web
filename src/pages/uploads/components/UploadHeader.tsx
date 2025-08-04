"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileVideo, RefreshCw, Share2, Download, Trash2 } from "lucide-react"
import { useUploadDetail } from "@/hooks/UploadDetailContext"
import { useNavigate } from "react-router"
import { SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem, Select } from "@/components/ui/select"
import { useState } from "react"
import DeleteAnalysisDialog from "./DeleteAnalysisDialog"

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

export default function UploadHeader() {
  const navigate = useNavigate()
  const { analysis, downloadReport, retryAnalysis, isRetrying, deleteAnalysis, isDeleting } = useUploadDetail()
  const [model, setModel] = useState("cx");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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
            <Badge variant="secondary" className="text-sm">
              Model Used - <span className="font-semibold">{analysis.model_name}</span>
            </Badge>
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
            </>
          )}
          {analysis.status === "failed" && (
            <>
              <Select onValueChange={setModel} value={model}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Models</SelectLabel>
                    <SelectItem value="cx">Cheng Xi's Model</SelectItem>
                    <SelectItem value="gy">Guan Yu's Model</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => retryAnalysis(model)}
                disabled={isRetrying}
              >
                <RefreshCw className={"w-4 h-4 mr-2" + (isRetrying ? " animate-spin" : "")} />
                {isRetrying ? "Retrying..." : "Retry Analysis"}
              </Button>
            </>
          )}
          <DeleteAnalysisDialog
            open={openDeleteDialog}
            setOpen={setOpenDeleteDialog}
            onDelete={deleteAnalysis}
            isDeleting={isDeleting}
            trigger={
              <Button variant="destructive" size="sm" onClick={() => setOpenDeleteDialog(true)} disabled={isDeleting}>
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            }
          />
        </div>
      </div>
    </div>
  )
}
