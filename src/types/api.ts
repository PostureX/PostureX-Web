// Feedback type for analysis results
export interface MeasurementFeedback {
  commendation: string;
  critique: string;
  suggestions: string[];
}

export type FeedbackAngles = "front" | "back" | "left" | "right";

export type FeedbackMeasurements =
  | "foot_to_shoulder_offset"
  | "knee_angle"
  | "head_tilt"
  | "arm_angle"
  | "arm_bent_angle"
  | "leg_spread"
  | "back_angle";

export type FeedbackData = {
  [angle in FeedbackAngles]?: {
    [measurement in FeedbackMeasurements]?: MeasurementFeedback;
  };
};
// API response types for analysis and uploads

import { AnalysisStatus, View } from "./analysis";

export interface RawAnalysisDetailResponse {
  id: number;
  status: AnalysisStatus;
  session_id: string;
  user_id: number;
  analysis_json_urls: Partial<Record<View, string>>;
  feedback_json_url: string;
  uploads: Partial<Record<View, string>>;
  model_name: string;
  created_at: string;
}

export interface UploadResponse {
  id: number;
  status: AnalysisStatus;
  url: string;
  error?: string;
}
