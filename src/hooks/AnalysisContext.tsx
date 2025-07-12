"use client"

import { createContext, useContext, useState, type ReactNode, useEffect, useRef } from "react"
import { InferenceSettingsProvider } from "./InferenceSettingsContext"

type AnalysisMode = "live" | "upload"

export interface Keypoint {
  id: number
  name: string
  x: number
  y: number
  confidence: number
}

export interface PostureMetric {
  name: string
  value: number
  status: string
}

interface AnalysisContextType {
  isAnalyzing: boolean
  setIsAnalyzing: (v: boolean) => void
  currentScore: number
  setCurrentScore: (v: number) => void
  analysisMode: AnalysisMode
  setAnalysisMode: (v: AnalysisMode) => void
  isCameraOn: boolean
  setCameraIndex: (v: number) => void
  cameraIndex: number
  setIsCameraOn: (v: boolean) => void
  cameraError: boolean
  setCameraError: (v: boolean) => void
  uploadedVideos: { front?: File; back?: File; left?: File; right?: File }
  setUploadedVideos: (videos: { front?: File; back?: File; left?: File; right?: File }) => void
  videoUrls: { front?: string; back?: string; left?: string; right?: string }
  setVideoUrls: (urls: { front?: string; back?: string; left?: string; right?: string }) => void
  isVideoPlaying: boolean
  setIsVideoPlaying: (v: boolean) => void
  videoCurrentTime: number
  setVideoCurrentTime: (v: number) => void
  videoDuration: number
  setVideoDuration: (v: number) => void
  postureMetrics: PostureMetric[]
  setPostureMetrics: (v: PostureMetric[]) => void
  keypoints: Keypoint[]
  setKeypoints: (v: Keypoint[]) => void
  cameraDevices: MediaDeviceInfo[]
  fetchDevices: () => Promise<void>
  removeVideo: (angle: "front" | "back" | "left" | "right") => void
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined)

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentScore, setCurrentScore] = useState(85)
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("live")
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([])
  const [cameraIndex, setCameraIndex] = useState(0)
  const [cameraError, setCameraError] = useState(false)
  const [uploadedVideos, setUploadedVideos] = useState<{
    front?: File
    back?: File
    left?: File
    right?: File
  }>({})

  const [videoUrls, setVideoUrls] = useState<{
    front?: string
    back?: string
    left?: string
    right?: string
  }>({})

  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [videoCurrentTime, setVideoCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)

  const [postureMetrics, setPostureMetrics] = useState<PostureMetric[]>([
    { name: "Stance Width", value: 92, status: "good" },
    { name: "Shoulder Alignment", value: 78, status: "warning" },
    { name: "Grip Position", value: 95, status: "excellent" },
    { name: "Elbow Position", value: 83, status: "good" },
    { name: "Head Position", value: 88, status: "good" },
    { name: "Balance", value: 91, status: "excellent" },
  ])

  const [keypoints, setKeypoints] = useState<Keypoint[]>([])

  const wsRef = useRef<WebSocket | null>(null)
  const frameIntervalRef = useRef<number | null>(null)

  const fetchDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    setCameraDevices(devices.filter((d) => d.kind === "videoinput"))
  }

  const removeVideo = (angle: "front" | "back" | "left" | "right") => {
    const newVideos = { ...uploadedVideos }
    const newUrls = { ...videoUrls }

    // Revoke the object URL to free memory
    if (newUrls[angle]) {
      URL.revokeObjectURL(newUrls[angle]!)
    }

    delete newVideos[angle]
    delete newUrls[angle]

    setUploadedVideos(newVideos)
    setVideoUrls(newUrls)
    setIsAnalyzing(false)
  }

  useEffect(() => {
    if (!isCameraOn) {
      setIsAnalyzing(false)
    }
  }, [isCameraOn])

  useEffect(() => {
    if (isAnalyzing && analysisMode === "live" && isCameraOn) {
      // Open WebSocket connection
      const ws = new WebSocket("ws://10.3.250.181:8891")
      wsRef.current = ws

      ws.onopen = () => {
        // Start sending frames at 10 FPS
        frameIntervalRef.current = window.setInterval(async () => {
          // Get the current video frame from the webcam
          const video = document.querySelector("video")
          if (!video) return

          // Create a canvas to capture the frame
          const canvas = document.createElement("canvas")
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext("2d")
          if (!ctx) return
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          // Convert to base64
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
          const base64 = dataUrl.split(",")[1]

          // Send to server
          ws.send(JSON.stringify({ image: base64 }))
        }, 100) // 10 FPS
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.keypoints) {
            // Convert array-of-arrays to array-of-objects
            const mappedKeypoints = data.keypoints.map((arr: unknown[], idx: number) => ({
              x: arr[0],
              y: arr[1],
              confidence: arr[2],
              id: idx + 1,
            }))
            setKeypoints(mappedKeypoints)
          }
        } catch (e) {
          console.error("WebSocket message error:", e)
        }
      }

      ws.onerror = (e) => {
        // Optionally handle error
        console.error("WebSocket error:", e)
      }

      ws.onclose = () => {
        if (frameIntervalRef.current) {
          clearInterval(frameIntervalRef.current)
          frameIntervalRef.current = null
        }
      }

      // Cleanup on unmount or when analysis stops
      return () => {
        if (wsRef.current) {
          wsRef.current.close()
          wsRef.current = null
        }
        if (frameIntervalRef.current) {
          clearInterval(frameIntervalRef.current)
          frameIntervalRef.current = null
        }
      }
    }
  }, [isAnalyzing, analysisMode, isCameraOn])

  return (
    <AnalysisContext.Provider
      value={{
        isAnalyzing,
        setIsAnalyzing,
        currentScore,
        setCurrentScore,
        analysisMode,
        setAnalysisMode,
        isCameraOn,
        setIsCameraOn,
        cameraIndex,
        setCameraIndex,
        cameraError,
        setCameraError,
        uploadedVideos,
        setUploadedVideos,
        videoUrls,
        setVideoUrls,
        isVideoPlaying,
        setIsVideoPlaying,
        videoCurrentTime,
        setVideoCurrentTime,
        videoDuration,
        setVideoDuration,
        postureMetrics,
        setPostureMetrics,
        keypoints,
        setKeypoints,
        cameraDevices,
        fetchDevices,
        removeVideo,
      }}
    >
      <InferenceSettingsProvider>{children}</InferenceSettingsProvider>
    </AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext)
  if (!ctx) throw new Error("useAnalysis must be used within an AnalysisProvider")
  return ctx
}
