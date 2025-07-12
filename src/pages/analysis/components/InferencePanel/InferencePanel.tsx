"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useAnalysis } from "@/hooks/AnalysisContext"
import { Target, Camera, Square, Play, CameraOff, SwitchCamera } from "lucide-react"
import LiveWebcam from "./LiveWebcam"
import VideoUpload from "./VideoUpload"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InferencePanel() {
    const {
        analysisMode,
        setAnalysisMode,
        setIsAnalyzing,
        isAnalyzing,
        setIsVideoPlaying,
        isCameraOn,
        setIsCameraOn,
        cameraDevices,
        cameraIndex,
        setCameraIndex,
        fetchDevices,
        cameraError,
        uploadedVideos,
        setUploadedVideos,
        setVideoUrls,
    } = useAnalysis()

    const handleMultiVideoAnalysis = () => {
        if (isAnalyzing) {
            // Stop analysis
            setIsAnalyzing(false)
            setIsVideoPlaying(false)
        } else {
            // Start analysis for all uploaded videos
            setIsAnalyzing(true)
            setIsVideoPlaying(true)
            // Here you would implement logic to analyze all uploaded videos simultaneously
            console.log("Analyzing videos:", Object.keys(uploadedVideos))
        }
    }

    const hasAnyVideo = Object.keys(uploadedVideos).length > 0
    const uploadedCount = Object.keys(uploadedVideos).length

    return (
        <div className="lg:col-span-2">
            <Card variant="noHighlight">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            {analysisMode === "live" ? <Target className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                            {analysisMode === "live" ? "Live Camera Feed" : "Multi-Angle Video Analysis"}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            {analysisMode === "live" && isCameraOn && !cameraError ? (
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
                            ) : hasAnyVideo ? (
                                <Button variant={isAnalyzing ? "destructive" : "default"} size="sm" onClick={handleMultiVideoAnalysis}>
                                    {isAnalyzing ? (
                                        <>
                                            <Square className="w-4 h-4 mr-2" />
                                            Stop Analysis
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4 mr-2" />
                                            Analyze All ({uploadedCount} angle{uploadedCount !== 1 ? "s" : ""})
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
                            <Tabs
                                value={analysisMode}
                                onValueChange={(val) => {
                                    setAnalysisMode(val as "live" | "upload")
                                    setIsAnalyzing(false)
                                    if (val === "live") {
                                        setUploadedVideos({})
                                        setVideoUrls({})
                                    }
                                }}
                            >
                                <TabsList className="bg-secondary rounded-lg p-1">
                                    <TabsTrigger value="live" className="flex items-center gap-2">
                                        <Target className="w-4 h-4" />
                                        Live Camera
                                    </TabsTrigger>
                                    <TabsTrigger value="upload" className="flex items-center gap-2">
                                        <Camera className="w-4 h-4" />
                                        Multi-Angle Upload
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                        {/* Webcam Settings */}
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
                                                await navigator.mediaDevices.getUserMedia({ video: true })
                                            } catch {
                                                // handle error if needed
                                            }
                                            await fetchDevices()
                                        }
                                        setIsCameraOn(!isCameraOn)
                                    }}
                                >
                                    {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                                </Button>
                                {cameraDevices.length > 1 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={async () => {
                                            setCameraIndex((cameraIndex + 1) % cameraDevices.length)
                                            await fetchDevices() // Optionally refresh device list after switching
                                        }}
                                        title="Switch Camera"
                                    >
                                        <SwitchCamera className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {analysisMode === "live" ? (
                        <LiveWebcam />
                    ) : (
                        <VideoUpload />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
