import { useAnalysis } from "@/hooks/AnalysisContext"
import { Progress } from "@radix-ui/react-progress"
import { Camera } from "lucide-react"


const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
}

export default function VideoUpload() {
    const {
        uploadedVideo, setUploadedVideo,
        videoUrl, setVideoUrl,
        videoDuration, setVideoDuration,
        videoCurrentTime, setVideoCurrentTime,
        setIsVideoPlaying, setIsAnalyzing
    } = useAnalysis();

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type.startsWith("video/")) {
            setUploadedVideo(file)
            const url = URL.createObjectURL(file)
            setVideoUrl(url)
            setIsAnalyzing(false)
        }
    }

    return <>
        {!uploadedVideo ? (
            /* Video upload area */
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center text-gray-400">
                    <label htmlFor="video-upload" className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-gray-500 transition-colors">
                            <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg mb-2">Upload Video for Analysis</p>
                            <p className="text-sm">Drag and drop or click to select</p>
                            <p className="text-xs mt-2 text-gray-500">Supports MP4, MOV, AVI formats</p>
                        </div>
                    </label>
                    <input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                    />
                </div>
            </div>
        ) : (
            /* Video player */
            <div className="relative w-full h-full">
                <video
                    src={videoUrl || undefined}
                    className="w-full h-full object-contain"
                    onLoadedMetadata={(e) => {
                        const video = e.target as HTMLVideoElement
                        setVideoDuration(video.duration)
                    }}
                    onTimeUpdate={(e) => {
                        const video = e.target as HTMLVideoElement
                        setVideoCurrentTime(video.currentTime)
                    }}
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    controls={false}
                />

                {/* Video controls */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{uploadedVideo?.name}</span>
                        <div className="flex-1 flex items-center gap-2">
                            <span className="text-xs">{formatTime(videoCurrentTime)}</span>
                            <Progress
                                value={videoDuration > 0 ? (videoCurrentTime / videoDuration) * 100 : 0}
                                className="flex-1 h-2"
                            />
                            <span className="text-xs">{formatTime(videoDuration)}</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
}