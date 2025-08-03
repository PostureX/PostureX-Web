// Keypoint for pose estimation
export interface Keypoint {
  id: number;
  name: string;
  x: number;
  y: number;
  confidence: number;
}

// Posture metric for analysis
export interface PostureMetric {
  name: string;
  value: number;
  status: string;
  key?: string;
}
// Analysis domain types and enums

export enum AnalysisStatus {
  InProgress = "in_progress",
  Completed = "completed",
  Failed = "failed",
}

export enum FileType {
  Video = "video",
  Image = "image",
}

export enum View {
  Left = "left",
  Right = "right",
  Front = "front",
  Back = "back",
}

export type MeasurementKey =
  | "foot_to_shoulder_offset_left"
  | "foot_to_shoulder_offset_right"
  | "knee_angle"
  | "head_tilt"
  | "arm_angle"
  | "arm_bent_angle"
  | "leg_spread"
  | "back_angle";

export type ScoreKey =
  | "foot_to_shoulder_offset"
  | "knee_angle"
  | "head_tilt"
  | "arm_angle"
  | "arm_bent_angle"
  | "leg_spread"
  | "back_angle";

export type Measurements = Partial<Record<MeasurementKey, number>>;
export type Scores = Partial<Record<ScoreKey, number>>;

export interface FrameScore {
  side: string;
  [key: string]: string | number | undefined;
}

export interface FrameData {
  frame_index: number;
  timestamp: number;
  keypoints: [number, number][];
  score: FrameScore;
  raw_scores_percent: Scores;
  measurements: Measurements;
}

export interface AggregatedResults {
  overall_posture_score: number;
  score: Scores;
  raw_scores_percent: Scores;
  measurements: Measurements;
}

export interface AnalysisResult {
  file_type: FileType;
  view: View;
  detected_view: View;
  analysis_timestamp: number;
  total_frames: number;
  processed_frames: number;
  frame_skip: number;
  frames_data: FrameData[];
  aggregated_results: AggregatedResults;
}
