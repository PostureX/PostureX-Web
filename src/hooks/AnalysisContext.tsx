import { createContext, useContext, useState, type ReactNode, useEffect, useRef } from "react"
import { Keypoint, PostureMetric } from "@/types/analysis"
import { InferenceSettingsProvider } from "./InferenceSettingsContext"
import api from "@/api/api"

type AnalysisMode = "live" | "upload"

// Keypoint imported from types

// PostureMetric imported from types

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
  postureMetrics: PostureMetric[]
  setPostureMetrics: (v: PostureMetric[]) => void
  keypoints: Keypoint[]
  setKeypoints: (v: Keypoint[]) => void
  cameraDevices: MediaDeviceInfo[]
  fetchDevices: () => Promise<void>
  rawScores: number[] | null
  setRawScores: (v: number[] | null) => void
  model: string
  setModel: (v: string) => void
}

// Utility to parse both object and array posture_score formats
function parsePostureScore(posture_score: number): PostureMetric[] {
  if (Array.isArray(posture_score)) {
    // Array of objects (e.g., inference_front.json)
    // Flatten and merge all keys except "side"
    return posture_score.flatMap((entry: PostureMetric) =>
      Object.entries(entry)
        .filter(([k]) => k !== "side")
        .map(([k, v]) => ({
          key: k,
          name: k,
          value: Array.isArray(v) ? v.join(", ") : v,
          status: "good", // You can add logic for status if needed
        }))
    )
  } else if (typeof posture_score === "object" && posture_score !== null) {
    // Single object (e.g., inference.json)
    return Object.entries(posture_score)
      .filter(([k]) => k !== "side")
      .map(([k, v]) => ({
        key: k,
        name: k,
        value: typeof v === "number" ? v : Number(v),
        status: "good", // You can add logic for status if needed
      }))
  }
  return []
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
  const [postureMetrics, setPostureMetrics] = useState<PostureMetric[]>([])
  const [keypoints, setKeypoints] = useState<Keypoint[]>([])
  const [rawScores, setRawScores] = useState<number[] | null>(null)
  const [model, setModel] = useState("cx")

  const wsRef = useRef<WebSocket | null>(null)
  const frameIntervalRef = useRef<number | null>(null)

  const fetchDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    setCameraDevices(devices.filter((d) => d.kind === "videoinput"))
  }

  useEffect(() => {
    if (!isCameraOn) {
      setIsAnalyzing(false)
    }
  }, [isCameraOn])

  useEffect(() => {
    if (isAnalyzing && analysisMode === "live" && isCameraOn) {
      // Get websocket token (async)
      let ws: WebSocket | null = null;
      let cleanup: (() => void) | undefined;

      (async () => {
        try {
          const response = await api.get("/auth/ws-token");
          const token = response.data.ws_token;

          const port = model == "cx" ? 8893 : 8894;

          // Open WebSocket connection with token as URL param
          ws = new WebSocket(`ws://10.3.250.181:${port}?token=${encodeURIComponent(token)}`);
          wsRef.current = ws;

          ws.onopen = () => {
            // Start sending frames at 10 FPS
            frameIntervalRef.current = window.setInterval(async () => {
              const video = document.querySelector("video");
              if (!video) return;

              const canvas = document.createElement("canvas");
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext("2d");
              if (!ctx) return;
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

              const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
              const base64 = dataUrl.split(",")[1];

              ws!.send(JSON.stringify({ image: base64 }));
            }, 100); // 10 FPS
          };

          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              if (data.keypoints) {
                const mappedKeypoints = data.keypoints.map((arr: unknown[], idx: number) => ({
                  x: arr[0],
                  y: arr[1],
                  confidence: arr[2],
                  id: idx + 1,
                }));
                setKeypoints(mappedKeypoints);
              }
              if (data.posture_score) {
                setPostureMetrics(parsePostureScore(data.posture_score));
              }
              if (data.raw_scores_percent) {
                setRawScores(data.raw_scores_percent);
                console.log("Raw scores updated:", data.raw_scores_percent);
              }
            } catch (e) {
              console.error("WebSocket message error:", e);
            }
          };

          ws.onerror = (e) => {
            console.error("WebSocket error:", e);
          };

          ws.onclose = () => {
            if (frameIntervalRef.current) {
              clearInterval(frameIntervalRef.current);
              frameIntervalRef.current = null;
            }
          };

          cleanup = () => {
            if (wsRef.current) {
              wsRef.current.close();
              wsRef.current = null;
            }
            if (frameIntervalRef.current) {
              clearInterval(frameIntervalRef.current);
              frameIntervalRef.current = null;
            }
          };
        } catch (err) {
          console.error("Failed to get WebSocket token:", err);
        }
      })();

      // Cleanup on unmount or when analysis stops
      return () => {
        if (cleanup) cleanup();
        else if (wsRef.current) {
          wsRef.current.close();
          wsRef.current = null;
        }
        if (frameIntervalRef.current) {
          clearInterval(frameIntervalRef.current);
          frameIntervalRef.current = null;
        }
      };
    }
  }, [isAnalyzing, analysisMode, isCameraOn, model])

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
        postureMetrics,
        setPostureMetrics,
        keypoints,
        setKeypoints,
        cameraDevices,
        fetchDevices,
        rawScores,
        setRawScores,
        model,
        setModel,
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
