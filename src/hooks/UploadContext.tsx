import { createContext, useContext, useState, type ReactNode } from "react"
import { UploadItem, UploadStatus } from "@/types/upload"
import api from "@/api/api"
import type { AxiosProgressEvent } from "axios"

export interface UploadFile {
  file: File
  viewType: "front" | "back" | "left" | "right"
}

interface UploadContextType {
  uploads: UploadItem[]
  setUploads: (uploads: UploadItem[]) => void
  updateUpload: (id: string, data: Partial<UploadItem>) => void
  addUpload: (item: UploadItem) => void
  removeUpload: (id: string) => void
  clearUploads: () => void
  uploadVideos: (data: {
    files: { [key in "front" | "back" | "left" | "right"]?: File }
    sessionId: string
    model: string
    onProgress?: (progress: number) => void
  }) => Promise<unknown>
  // Video upload UI state
  uploadedVideos: { [key in "front" | "back" | "left" | "right"]?: File }
  setUploadedVideos: (videos: { [key in "front" | "back" | "left" | "right"]?: File }) => void
  videoUrls: { [key in "front" | "back" | "left" | "right"]?: string }
  setVideoUrls: (urls: { [key in "front" | "back" | "left" | "right"]?: string }) => void
  removeVideo: (angle: "front" | "back" | "left" | "right") => void
}

const UploadContext = createContext<UploadContextType | undefined>(undefined)

export function UploadProvider({ children }: { children: ReactNode }) {
  const [uploads, setUploads] = useState<UploadItem[]>([])
  // Video upload UI state
  const [uploadedVideos, setUploadedVideos] = useState<{ [key in "front" | "back" | "left" | "right"]?: File }>({})
  const [videoUrls, setVideoUrls] = useState<{ [key in "front" | "back" | "left" | "right"]?: string }>({})

  // Remove a video and its URL
  const removeVideo = (angle: "front" | "back" | "left" | "right") => {
    setUploadedVideos((prev) => {
      const newVideos = { ...prev }
      delete newVideos[angle]
      return newVideos
    })
    setVideoUrls((prev) => {
      const newUrls = { ...prev }
      if (newUrls[angle]) {
        URL.revokeObjectURL(newUrls[angle]!)
      }
      delete newUrls[angle]
      return newUrls
    })
  }

  const updateUpload = (id: string, data: Partial<UploadItem>) => {
    setUploads((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...data } : u))
    )
  }

  const addUpload = (item: UploadItem) => {
    setUploads((prev) => [...prev, item])
  }

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id))
  }

  const clearUploads = () => setUploads([])

  const uploadVideos = async ({
    files,
    sessionId,
    model,
    onProgress,
  }: {
    files: { [key in "front" | "back" | "left" | "right"]?: File }
    sessionId: string
    model: string
    onProgress?: (progress: number) => void
  }): Promise<unknown> => {
    const formData = new FormData()
    const fileIds: { [key: string]: string } = {};

    ["front", "left", "right", "back"].forEach((angle: string) => {
      const file = files[angle as "front" | "back" | "left" | "right"]
      if (file) {
        formData.append(angle, file)

        const id = `${angle}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        fileIds[`${file.name}_${angle}`] = id

        addUpload({
          id,
          fileName: file.name,
          fileSize: file.size,
          progress: 0,
          status: "uploading" as UploadStatus,
          viewType: angle as "front" | "back" | "left" | "right",
        })
      }
    })

    formData.append("session_id", sessionId)
    formData.append("model", model)

    try {
      const response = await api.post("/video/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const percent = Math.round((progressEvent.loaded! * 100) / (progressEvent.total || 1))
          if (onProgress) onProgress(percent)
        },
      })

      Object.entries(files).forEach(([angle, file]) => {
        if (!file) return
        const id = fileIds[`${file.name}_${angle}`]
        updateUpload(id, { progress: 100, status: "completed" as UploadStatus })
      })

      return response.data
    } catch (err) {
      Object.entries(files).forEach(([angle, file]) => {
        if (!file) return
        const id = fileIds[`${file.name}_${angle}`]
        updateUpload(id, { status: "error" as UploadStatus })
      })
      throw err
    }
  }

  return (
    <UploadContext.Provider
      value={{
        uploads,
        setUploads,
        updateUpload,
        addUpload,
        removeUpload,
        clearUploads,
        uploadVideos,
        uploadedVideos,
        setUploadedVideos,
        videoUrls,
        setVideoUrls,
        removeVideo,
      }}
    >
      {children}
    </UploadContext.Provider>
  )
}

export function useUpload() {
  const ctx = useContext(UploadContext)
  if (!ctx) throw new Error("useUpload must be used within an UploadProvider")
  return ctx
}