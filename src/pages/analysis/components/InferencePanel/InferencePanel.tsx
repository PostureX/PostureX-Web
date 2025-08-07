"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useAnalysis } from "@/hooks/AnalysisContext"
import { useUpload } from "@/hooks/UploadContext"
import { Target, Camera, Square, Play, CameraOff, SwitchCamera, Upload } from "lucide-react"
import LiveWebcam from "./LiveWebcam"
import VideoUpload from "./VideoUpload"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMutation } from "@tanstack/react-query"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "react-router"

export default function InferencePanel() {
    const navigate = useNavigate()
    const {
        analysisMode,
        setAnalysisMode,
        setIsAnalyzing,
        isAnalyzing,
        isCameraOn,
        setIsCameraOn,
        cameraDevices,
        cameraIndex,
        setCameraIndex,
        fetchDevices,
        cameraError,
        model,
        setModel,
    } = useAnalysis()

    const { uploadedVideos, uploadVideos, uploads, setUploadedVideos, setUploads, setVideoUrls } = useUpload();

    // React Query mutation for upload
    const uploadMutation = useMutation({
        mutationFn: async () => {
            const sessionId = new Date().toLocaleString().replace(/[^\dA-Za-z]/g, "_")
            return uploadVideos({
                files: uploadedVideos,
                sessionId,
                model,
            })
        },
        onSuccess: (res) => {
            // wait 1 second before resetting
            setTimeout(() => {
                setUploadedVideos({});
                setUploads([]);
                setVideoUrls({});
                console.log(res)
                if (res && typeof res === "object" && "analysis_id" in res) {
                    navigate(`/uploads/${res.analysis_id}`);
                }
            }, 1000);
        }
    })

    const handleUpload = () => {
        uploadMutation.mutate()
    }

    // Check if any upload is in progress
    const isUploading = uploads.some(u => u.status === "uploading")

    return (
        <div className={analysisMode == "live" ? "lg:col-span-2" : "lg:col-span-3"}>
            <Card variant="noHighlight">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            {analysisMode === "live" ? <Target className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                            {analysisMode === "live" ? "Live Camera Feed" : "Multi-Angle Video Analysis"}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
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
                                ) : analysisMode === "upload" ? (
                                    <Button onClick={handleUpload} disabled={isUploading}>
                                        <Upload />
                                        {isUploading ? "Uploading..." : "Upload & Analyse"}
                                    </Button>
                                ) : null}
                            </div>
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
