import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useAnalysis } from "@/hooks/AnalysisContext"
import { Target, Camera, Square, Play, CameraOff, SwitchCamera } from "lucide-react"
import AnalysisOverlay from "./AnalysisOverlay"
import LiveWebcam from "./LiveWebcam"
import VideoUpload from "./VideoUpload"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
        isCameraOn,
        setIsCameraOn,
        cameraDevices,
        cameraIndex,
        setCameraIndex,
        fetchDevices,
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
                        {analysisMode === "live" && isCameraOn ? (
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
                <div className="mb-4 flex items-center justify-between">
                    <div className="w-fit">
                        <Tabs value={analysisMode} onValueChange={(val) => {
                            setAnalysisMode(val as "live" | "upload")
                            setIsAnalyzing(false)
                            if (val === "live") {
                                setUploadedVideo(null)
                                setVideoUrl(null)
                            }
                        }}>
                            <TabsList className="bg-secondary rounded-lg p-1">
                                <TabsTrigger value="live" className="flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    Live Camera
                                </TabsTrigger>
                                <TabsTrigger value="upload" className="flex items-center gap-2">
                                    <Camera className="w-4 h-4" />
                                    Upload Video
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    {/* Webcacm Settings */}
                    {analysisMode === "live" && (
                        <div className="flex items-center ml-4 gap-2">
                            <Button
                                variant={isCameraOn ? "default" : "outline"}
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={async () => {
                                    if (!isCameraOn) {
                                        // Request permission and update device list
                                        try {
                                            await navigator.mediaDevices.getUserMedia({ video: true });
                                        } catch {
                                            // handle error if needed
                                        }
                                        await fetchDevices();
                                    }
                                    setIsCameraOn(!isCameraOn);
                                }}
                            >
                                {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                            </Button>
                            {cameraDevices.length > 1 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={async () => {
                                        setCameraIndex((cameraIndex + 1) % cameraDevices.length);
                                        await fetchDevices(); // Optionally refresh device list after switching
                                    }}
                                    title="Switch Camera"
                                >
                                    <SwitchCamera className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    {analysisMode === "live" ? (
                        isCameraOn ? <LiveWebcam /> : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-800 to-gray-900">
                                <CameraOff className="w-16 h-16 mb-4 opacity-50" />
                                <span className="ml-4 text-lg">Camera is Off</span>
                            </div>
                        )
                    ) : (
                        <VideoUpload />
                    )}

                    <AnalysisOverlay />
                </div>
            </CardContent>
        </Card>
    </div>
}