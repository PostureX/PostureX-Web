import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useAnalysis } from "@/hooks/Analysis"
import { Target, Camera, Square, Play } from "lucide-react"
import AnalysisOverlay from "./AnalysisOverlay"
import LiveWebcam from "./LiveWebcam"
import VideoUpload from "./VideoUpload"


export default function InferencePanel() {
    const analysis = useAnalysis();
    const {
        uploadedVideo,
        isVideoPlaying,
        analysisMode,
        setAnalysisMode,
        setUploadedVideo,
        setVideoUrl,
        setIsAnalyzing,
        isAnalyzing,
        setIsVideoPlaying,
    } = analysis;

    const handleVideoPlay = () => {
        setIsVideoPlaying(true)
        setIsAnalyzing(true)
    }

    const handleVideoPause = () => {
        setIsVideoPlaying(false)
        setIsAnalyzing(false)
    }

    return <div className="lg:col-span-2">
        <Card variant="noHighlight">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        {analysisMode === "live" ? <Target className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                        {analysisMode === "live" ? "Live Camera Feed" : "Video Analysis"}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {analysisMode === "live" ? (
                            <Button
                                variant={isAnalyzing ? "destructive" : "default"}
                                size="sm"
                                onClick={() => setIsAnalyzing(!isAnalyzing)}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Square className="w-4 h-4 mr-2" />
                                        Stop
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 mr-2" />
                                        Start Analysis
                                    </>
                                )}
                            </Button>
                        ) : uploadedVideo ? (
                            <Button
                                variant={isVideoPlaying ? "destructive" : "default"}
                                size="sm"
                                onClick={isVideoPlaying ? handleVideoPause : handleVideoPlay}
                            >
                                {isVideoPlaying ? (
                                    <>
                                        <Square className="w-4 h-4 mr-2" />
                                        Pause
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 mr-2" />
                                        Analyze
                                    </>
                                )}
                            </Button>
                        ) : null}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Mode Selection */}
                <div className="mb-4">
                    <div className="flex items-center gap-4 p-1 bg-secondary rounded-lg w-fit">
                        <button
                            onClick={() => {
                                setAnalysisMode("live")
                                setIsAnalyzing(false)
                                setUploadedVideo(null)
                                setVideoUrl(null)
                            }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:cursor-pointer ${analysisMode === "live"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-primary-foreground"
                                }`}
                        >
                            <Target className="w-4 h-4 mr-2 inline" />
                            Live Camera
                        </button>
                        <button
                            onClick={() => {
                                setAnalysisMode("upload")
                                setIsAnalyzing(false)
                            }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:cursor-pointer ${analysisMode === "upload"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-primary-foreground"
                                }`}
                        >
                            <Camera className="w-4 h-4 mr-2 inline" />
                            Upload Video
                        </button>
                    </div>
                </div>

                <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    {analysisMode === "live" ? (
                        <LiveWebcam />
                    ) : (
                        <VideoUpload />
                    )}

                    <AnalysisOverlay />
                </div>
            </CardContent>
        </Card>
    </div>
}