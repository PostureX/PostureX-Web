import type React from "react"
import { createContext, useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/api/api"

export interface ApiResponse {
  id: number
  user_id: number
  filename: string
  posture_result: string
  feedback: string
  status: "completed" | "processing" | "failed" | "queued" | "in_progress"
  created_at: string
}

// Define the structure for each view in the posture result
export interface ViewResult {
  score?: Record<string, number>
  measurements?: Record<string, number>
  keypoints?: { x: number; y: number; confidence: number }[]
  feedback?: Record<
    string,
    {
      commendation?: string
      critique?: string
      suggestions?: string[]
    }
  >
}

// The posture result is a mapping from view name to its result
export type PostureResult = Record<string, ViewResult>

interface UploadDetailContextType {
  upload: ApiResponse | null
  postureResult: PostureResult | null
  loading: boolean
  error: string | null
  refetch: () => void
  download: () => void
}

const UploadDetailContext = createContext<UploadDetailContextType | undefined>(undefined)

export const useUploadDetail = () => {
  const ctx = useContext(UploadDetailContext)
  if (!ctx) throw new Error("useUploadDetail must be used within UploadDetailProvider")
  return ctx
}

async function fetchUploadData(id: string) {
  // Mock API call - replace with your actual API
  const response = await api.get(`/analysis/${id}`)
  return response.data
}

export const UploadDetailProvider: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const {
    data: upload,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ApiResponse, Error>({
    queryKey: ["upload-detail", id],
    queryFn: () => fetchUploadData(id),
    staleTime: 1000 * 60 * 5,
    refetchInterval: (query) =>
      query.state.data && (query.state.data.status === "in_progress") ? 2000 : false,
  })

  let postureResult: PostureResult | null = null
  if (upload?.posture_result) {
    try {
      postureResult = JSON.parse(upload.posture_result) as PostureResult
    } catch {
      postureResult = null
    }
  }

  const download = () => {
    if (upload) {
      // downloads the raw API response as JSON file
      const blob = new Blob([JSON.stringify(upload)], { type: "application/json" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `posture_analysis_${upload.id}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <UploadDetailContext.Provider
      value={{
        upload: upload ?? null,
        postureResult,
        loading,
        error: error ? error.message : null,
        refetch,
        download,
      }}
    >
      {children}
    </UploadDetailContext.Provider>
  )
}
