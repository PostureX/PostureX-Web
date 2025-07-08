import { createContext, useContext, useState, ReactNode, useEffect } from "react"

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
    uploadedVideo: File | null
    setUploadedVideo: (v: File | null) => void
    videoUrl: string | null
    setVideoUrl: (v: string | null) => void
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
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined)

export function AnalysisProvider({ children }: { children: ReactNode }) {
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [currentScore, setCurrentScore] = useState(85)
    const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("live")
    const [isCameraOn, setIsCameraOn] = useState(false)
    const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
    const [cameraIndex, setCameraIndex] = useState(0);
    const [uploadedVideo, setUploadedVideo] = useState<File | null>(null)
    const [videoUrl, setVideoUrl] = useState<string | null>(null)
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

    const [keypoints, setKeypoints] = useState<Keypoint[]>([
        { id: 1, name: "Head", x: 320, y: 80, confidence: 0.95 },
        { id: 2, name: "Left Shoulder", x: 280, y: 140, confidence: 0.92 },
        { id: 3, name: "Right Shoulder", x: 360, y: 140, confidence: 0.94 },
        { id: 4, name: "Left Elbow", x: 240, y: 200, confidence: 0.89 },
        { id: 5, name: "Right Elbow", x: 400, y: 200, confidence: 0.91 },
        { id: 6, name: "Left Wrist", x: 220, y: 260, confidence: 0.87 },
        { id: 7, name: "Right Wrist", x: 420, y: 260, confidence: 0.93 },
    ])

    const fetchDevices = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setCameraDevices(devices.filter(d => d.kind === "videoinput"));
    }

    useEffect(() => {
        if (!isCameraOn) {
            setIsAnalyzing(false);
            setVideoUrl(null);
        }
    }, [isCameraOn]);

    return (
        <AnalysisContext.Provider
            value={{
                isAnalyzing, setIsAnalyzing,
                currentScore, setCurrentScore,
                analysisMode, setAnalysisMode,
                isCameraOn, setIsCameraOn,
                cameraIndex, setCameraIndex,
                uploadedVideo, setUploadedVideo,
                videoUrl, setVideoUrl,
                isVideoPlaying, setIsVideoPlaying,
                videoCurrentTime, setVideoCurrentTime,
                videoDuration, setVideoDuration,
                postureMetrics, setPostureMetrics,
                keypoints, setKeypoints,
                cameraDevices,
                fetchDevices
            }}
        >
            {children}
        </AnalysisContext.Provider>
    )
}

export function useAnalysis() {
    const ctx = useContext(AnalysisContext)
    if (!ctx) throw new Error("useAnalysis must be used within an AnalysisProvider")
    return ctx
}