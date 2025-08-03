// Upload domain types and enums

export type UploadStatus = "uploading" | "completed" | "error" | "paused";

export interface UploadItem {
  id: string;
  fileName: string;
  fileSize: number;
  progress: number;
  status: UploadStatus;
  viewType: "front" | "back" | "left" | "right";
  speed?: string;
  timeRemaining?: string;
}

export interface UploadProgress {
  id: string;
  progress: number;
  status: AnalysisStatus;
}

export interface UploadedVideo {
  id: string;
  url: string;
  name: string;
  status: AnalysisStatus;
}

// Import AnalysisStatus from analysis types
import { AnalysisStatus } from "./analysis";
