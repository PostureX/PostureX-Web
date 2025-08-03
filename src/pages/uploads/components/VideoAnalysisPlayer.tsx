"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getPercentColor } from "../utils/Utils"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { useUploadDetail } from "@/hooks/UploadDetailContext"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { FrameData, View, AnalysisResult } from "@/types"
import COCO_WHOLEBODY_SKELETON from "@/config/cocoWholeBodySkeleton"

export default function VideoAnalysisPlayer() {
  const { analysisJsons, videoUrls, currentView, setCurrentView, setCurrentFrame } = useUploadDetail();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [volume, setVolume] = useState(1);

  // Get current view analysis data
  const currentAnalysis = currentView && analysisJsons ? (analysisJsons[currentView] as AnalysisResult | undefined) : undefined;
  const framesData: FrameData[] = useMemo(() => currentAnalysis?.frames_data || [], [currentAnalysis]);
  const videoUrl = currentView && videoUrls ? videoUrls[currentView] : undefined;

  // Find current frame data based on video time
  const getCurrentFrameData = useCallback(() => {
    if (!framesData.length) return null;

    // Find the closest frame based on timestamp
    const targetTime = currentTime;
    let closestFrame = framesData[0];
    let minDiff = Math.abs(closestFrame.timestamp - targetTime);
    let closestIndex = 0;

    for (let i = 0; i < framesData.length; i++) {
      const frame = framesData[i];
      const diff = Math.abs(frame.timestamp - targetTime);
      if (diff < minDiff) {
        minDiff = diff;
        closestFrame = frame;
        closestIndex = i;
      }
    }

    // Do not setCurrentFrameIndex here
    return { closestFrame, closestIndex };
  }, [currentTime, framesData]);

  const { closestFrame: currentFrameData, closestIndex: computedFrameIndex } = getCurrentFrameData() || { closestFrame: null, closestIndex: 0 };

  // Update context frame only after render
  useEffect(() => {
    if (currentView && currentFrameData) {
      setCurrentFrame(currentFrameData);
    }
  }, [currentView, currentFrameData, setCurrentFrame]);

  // Update frame index only after render
  useEffect(() => {
    setCurrentFrameIndex(computedFrameIndex);
  }, [computedFrameIndex]);

  // Draw keypoints on canvas
  const drawKeypoints = useCallback(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video || !currentFrameData) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match video display size
    const rect = video.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const keypoints = currentFrameData.keypoints
    if (!keypoints || keypoints.length === 0) return

    // Scale keypoints to canvas size
    const scaleX = canvas.width / video.videoWidth
    const scaleY = canvas.height / video.videoHeight

    // Draw connections
    ctx.strokeStyle = "#00ff00"
    ctx.lineWidth = 2
    COCO_WHOLEBODY_SKELETON.forEach(([startIdx, endIdx]) => {
      if (startIdx < keypoints.length && endIdx < keypoints.length) {
        const start = keypoints[startIdx]
        const end = keypoints[endIdx]
        if (start && end && start[0] && start[1] && end[0] && end[1]) {
          ctx.beginPath()
          ctx.moveTo(start[0] * scaleX, start[1] * scaleY)
          ctx.lineTo(end[0] * scaleX, end[1] * scaleY)
          ctx.stroke()
        }
      }
    })

    // Draw keypoints
    keypoints.forEach((point, index) => {
      if (point && point[0] !== undefined && point[1] !== undefined) {
        ctx.fillStyle = "#ff0000"
        ctx.beginPath()
        ctx.arc(point[0] * scaleX, point[1] * scaleY, 4, 0, 2 * Math.PI)
        ctx.fill()

        // Draw keypoint index
        ctx.fillStyle = "#ffffff"
        ctx.font = "12px Arial"
        ctx.fillText(index.toString(), point[0] * scaleX + 6, point[1] * scaleY - 6)
      }
    })
  }, [currentFrameData])

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (value: number[]) => {
    const newTime = value[0]
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration))
    }
  }

  const handleViewChange = (view: string) => {
    setCurrentView(view as View)
    setCurrentTime(0)
    setCurrentFrameIndex(0)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  // Draw keypoints when frame changes
  useEffect(() => {
    drawKeypoints();
  }, [currentFrameData, drawKeypoints, videoUrl]);

  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (!currentAnalysis || !videoUrl) {
    return (
      <Card variant="noHighlight" className="bg-white dark:bg-gray-800">
        <CardContent className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">Video analysis not available</p>
        </CardContent>
      </Card>
    )
  }

  const availableViews: View[] = videoUrls ? (Object.keys(videoUrls) as View[]) : [];

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <Card variant="noHighlight" className="bg-white dark:bg-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Video Analysis Player</CardTitle>
            <div className="flex items-center gap-4">
              <Select value={currentView} onValueChange={handleViewChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  {availableViews.map((view) => (
                    <SelectItem key={view} value={view} className="capitalize">
                      {view} View
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              src={videoUrl}
              className="absolute top-0 left-0 w-full h-full object-contain bg-black"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ mixBlendMode: "screen" }}
            />
          </div>

          {/* Video Controls */}
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => skipTime(-10)}>
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => skipTime(10)}>
                <SkipForward className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <Volume2 className="w-4 h-4" />
                <Slider value={[volume]} onValueChange={handleVolumeChange} max={1} step={0.1} className="w-20" />
              </div>
            </div>

            {/* Timeline Scrubber */}
            <div className="space-y-2">
              <Slider value={[currentTime]} onValueChange={handleSeek} max={duration} step={0.1} className="w-full" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  Frame: {currentFrameIndex + 1} / {framesData.length}
                </span>
                <span>Keypoints: {currentFrameData?.keypoints?.length || 0}</span>
                <span>View: {currentView}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Frame Metrics */}
      {currentFrameData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scores */}
          <Card variant="noHighlight" className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Frame Scores</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Frame {currentFrameData.frame_index} at {(currentFrameData.timestamp).toFixed(2)}s
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentFrameData.raw_scores_percent &&
                  Object.entries(currentFrameData.raw_scores_percent).map(([key, value]) => {
                    const percent = typeof value === "number" ? value : 0;
                    const colorClass = getPercentColor(percent);
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <span className="text-sm font-medium capitalize min-w-[120px]">{key.replace(/_/g, " ")}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-40">
                            <Progress value={percent} />
                          </div>
                          <Badge className={"min-w-[56px] text-center " + colorClass}>
                            {percent.toFixed(1) + "%"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Measurements */}
          <Card variant="noHighlight" className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Frame Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentFrameData.measurements &&
                  Object.entries(currentFrameData.measurements).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-sm font-medium capitalize">{key.replace(/_/g, " ")}</span>
                      <span className="text-sm font-mono">
                        {typeof value === "number" ? value.toFixed(2) : String(value)}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
