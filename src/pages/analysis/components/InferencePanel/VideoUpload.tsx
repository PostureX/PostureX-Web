import { useAnalysis } from "@/hooks/AnalysisContext"
import { Upload, X, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const ANGLES = [
    { key: "front" as const, label: "Front View" },
    { key: "back" as const, label: "Back View" },
    { key: "left" as const, label: "Left Side" },
    { key: "right" as const, label: "Right Side" },
]

interface VideoQuadrantProps {
    angle: (typeof ANGLES)[0]
    video?: File
    videoUrl?: string
    onUpload: (file: File) => void
    onRemove: () => void
}

function VideoQuadrant({ angle, video, videoUrl, onUpload, onRemove }: VideoQuadrantProps) {
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type.startsWith("video/")) {
            onUpload(file)
        }
    }

    return (
        <div className="relative w-full h-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors flex items-center justify-center">
            {!video ? (
                <label htmlFor={`video-upload-${angle.key}`} className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                    <Upload className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm font-medium text-center">{angle.label}</p>
                    <p className="text-xs text-center mt-1 opacity-75">Click to upload</p>
                    <input
                        id={`video-upload-${angle.key}`}
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </label>
            ) : (
                <div className="relative w-full h-full">
                    <video src={videoUrl} className="w-full h-full object-cover" muted preload="metadata" />
                    {/* Cancel button in top left */}
                    <Button
                        variant="destructive"
                        size="icon"
                        title="Remove Video"
                        onClick={onRemove}
                        className="absolute top-2 left-2 h-7 w-7 p-0 z-20 bg-black/60 hover:bg-red-600 border border-white/20 rounded-full"
                        aria-label={`Remove ${angle.label} video`}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                    {/* Overlay for filename */}
                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 rounded px-2 py-1 m-2">
                        <p className="text-xs text-white truncate">{video.name}</p>
                    </div>
                    {/* Success indicator */}
                    <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-green-500/20 border-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function VideoUpload() {
    const { uploadedVideos, setUploadedVideos, videoUrls, setVideoUrls, removeVideo, setIsAnalyzing } = useAnalysis()

    const handleVideoUpload = (angle: "front" | "back" | "left" | "right", file: File) => {
        const newVideos = { ...uploadedVideos, [angle]: file }
        const url = URL.createObjectURL(file)
        const newUrls = { ...videoUrls, [angle]: url }

        setUploadedVideos(newVideos)
        setVideoUrls(newUrls)
        setIsAnalyzing(false)
    }

    const handleVideoRemove = (angle: "front" | "back" | "left" | "right") => {
        removeVideo(angle)
    }

    const uploadedCount = Object.keys(uploadedVideos).length
    const hasAnyVideo = uploadedCount > 0

    return (
        <div className="relative bg-gray-900 rounded-lg overflow-hidden py-4 px-2 h-full flex flex-col">
            {/* Header */}
            <div className="px-4 pt-4 z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-black/60 text-white border-gray-600">
                            {uploadedCount}/4 angles uploaded
                        </Badge>
                        {hasAnyVideo && (
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Ready for analysis
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
            {/* 4 Quadrant Grid */}
            <div className="flex-1 flex flex-wrap gap-4 p-4 items-stretch justify-center">
                {ANGLES.map((angle) => (
                    <div
                        key={angle.key}
                        className="flex-grow flex-shrink-0 basis-full sm:basis-[calc(50%-0.5rem)] max-w-full sm:max-w-[calc(50%-0.5rem)] min-w-[220px] h-[180px] sm:h-auto"
                        style={{ minHeight: 0 }}
                    >
                        <VideoQuadrant
                            angle={angle}
                            video={uploadedVideos[angle.key]}
                            videoUrl={videoUrls[angle.key]}
                            onUpload={(file) => handleVideoUpload(angle.key, file)}
                            onRemove={() => handleVideoRemove(angle.key)}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}