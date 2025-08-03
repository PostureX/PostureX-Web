import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  CheckCircle,
  X,
  AlertCircle,
  Pause,
  Play,
  RotateCcw,
  Eye,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import { useUpload } from "@/hooks/UploadContext"

const viewIcons = {
  front: <ArrowUp className="w-4 h-4" />,
  back: <ArrowDown className="w-4 h-4" />,
  left: <ArrowLeft className="w-4 h-4" />,
  right: <ArrowRight className="w-4 h-4" />,
}

const viewColors = {
  front: "bg-[var(--chart-1)] text-[var(--primary-foreground)] border-[var(--chart-1)]",
  back: "bg-[var(--chart-2)] text-[var(--primary-foreground)] border-[var(--chart-2)]",
  left: "bg-[var(--chart-3)] text-[var(--primary-foreground)] border-[var(--chart-3)]",
  right: "bg-[var(--chart-4)] text-[var(--primary-foreground)] border-[var(--chart-4)]",
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

const formatTime = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

export default function UploadProgressMenu() {
  const removalTimeouts = useRef<{ [id: string]: NodeJS.Timeout }>({})
  const { uploads, removeUpload, updateUpload } = useUpload();

  // Remove completed uploads after 1s
  useEffect(() => {
    uploads.forEach((u) => {
      if (
        u.status === "completed" &&
        !removalTimeouts.current[u.id]
      ) {
        removalTimeouts.current[u.id] = setTimeout(() => {
          removeUpload(u.id)
          delete removalTimeouts.current[u.id]
        }, 1000)
      }
    })

    // Clean up timeouts for uploads that are no longer present or not completed
    Object.keys(removalTimeouts.current).forEach((id) => {
      if (!uploads.some((u) => u.id === id && u.status === "completed")) {
        clearTimeout(removalTimeouts.current[id])
        delete removalTimeouts.current[id]
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploads])

  const activeUploads = uploads.filter((upload) => upload.status === "uploading" || upload.status === "paused")
  const completedUploads = uploads.filter((upload) => upload.status === "completed")
  const errorUploads = uploads.filter((upload) => upload.status === "error")

  const totalProgress =
    uploads.length > 0
      ? uploads.reduce((sum, upload) => sum + upload.progress, 0) / uploads.length
      : 0

  if (uploads.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80">
      <Card className="shadow-2xl border-0 bg-[var(--color-card)]/95 backdrop-blur-sm">
        {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[var(--chart-1)] p-2 rounded-lg">
                <Upload className="w-4 h-4 text-[var(--primary)]" />
              </div>
              <div>
                <CardTitle className="text-sm">Upload Progress</CardTitle>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {activeUploads.length > 0
                    ? `${activeUploads.length} uploading`
                    : completedUploads.length > 0
                      ? `${completedUploads.length} completed`
                      : `${errorUploads.length} failed`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {uploads.length > 0 && (
                <Badge variant="secondary" className="text-xs px-2 py-1 bg-[var(--muted)] text-[var(--muted-foreground)]">
                  {Math.round(totalProgress)}%
                </Badge>
              )}
            </div>
          </div>

          {/* Overall Progress */}
          {uploads.length > 1 && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[var(--muted-foreground)]">Overall Progress</span>
                <span className="text-xs text-[var(--muted-foreground)]">{Math.round(totalProgress)}%</span>
              </div>
              <Progress value={totalProgress} className="h-2" />
            </div>
          )}
        </CardHeader>

        {/* Upload List */}
        <CardContent
          className="pt-0 max-h-80 overflow-y-auto custom-scrollbar"
          style={{ scrollbarGutter: "stable" }}
        >
          <div className="space-y-3">
            {uploads.map((upload) => (
              <div key={upload.id} className="border border-[var(--border)] rounded-lg p-3 bg-[var(--color-card)]/50">
                {/* File Info */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`p-1 rounded border ${viewColors[upload.viewType]}`}>
                      {viewIcons[upload.viewType]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--foreground)] truncate">{upload.fileName}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{formatFileSize(upload.fileSize)}</p>
                    </div>
                  </div>

                  {/* Status Icon */}
                  <div className="flex items-center gap-1">
                    {upload.status === "completed" && <CheckCircle className="w-4 h-4 text-[var(--success)]" />}
                    {upload.status === "error" && <AlertCircle className="w-4 h-4 text-[var(--danger)]" />}
                    {upload.status === "paused" && <Pause className="w-4 h-4 text-[var(--warning)]" />}
                    {upload.status === "uploading" && (
                      <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <Progress
                    value={upload.progress}
                    className={`h-2 ${
                      upload.status === "error"
                        ? "[&>div]:bg-[var(--danger)]"
                        : upload.status === "completed"
                          ? "[&>div]:bg-[var(--success)]"
                          : upload.status === "paused"
                            ? "[&>div]:bg-[var(--warning)]"
                            : ""
                    }`}
                  />
                </div>

                {/* Status Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                    <span>{upload.progress}%</span>
                    {upload.speed && upload.status === "uploading" && <span>{upload.speed}</span>}
                    {upload.timeRemaining && upload.status === "uploading" && (
                      <span>{formatTime(Number.parseInt(upload.timeRemaining))} left</span>
                    )}
                    {upload.status === "completed" && <span className="text-[var(--success)]">Complete</span>}
                    {upload.status === "error" && <span className="text-[var(--danger)]">Failed</span>}
                    {upload.status === "paused" && <span className="text-[var(--warning)]">Paused</span>}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    {upload.status === "uploading" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateUpload(upload.id, { status: "paused" })}
                        className="h-6 w-6 hover:bg-[var(--muted)]"
                      >
                        <Pause className="w-3 h-3" />
                      </Button>
                    )}
                    {upload.status === "paused" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateUpload(upload.id, { status: "uploading" })}
                        className="h-6 w-6 hover:bg-[var(--muted)]"
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    )}
                    {upload.status === "error" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateUpload(upload.id, { status: "uploading", progress: 0 })}
                        className="h-6 w-6 hover:bg-[var(--muted)]"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    )}
                    {upload.status === "completed" && (
                      <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-[var(--muted)] text-[var(--success)]">
                        <Eye className="w-3 h-3" />
                      </Button>
                    )}
                    {upload.status !== "completed" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeUpload(upload.id)}
                        className="h-6 w-6 hover:bg-[var(--muted)] text-[var(--danger)]"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: var(--muted) var(--color-card);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          background: var(--color-card);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--muted);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--muted-foreground);
        }
      `}</style>
    </div>
  )
}
