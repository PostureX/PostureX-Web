import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAnalysis } from "@/hooks/AnalysisContext";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getPercentColor } from "@/pages/uploads/utils/Utils";

// Recommendation rubric for each metric
function getRecommendation(key: string, value: number): string {
  switch (key) {
    case "knee_bent_angle":
      if (value < 10) return "Straighten your knees for better stability.";
      if (value <= 30) return "Knee bend is optimal for balance.";
      return "Bend your knees slightly to improve balance and reduce strain.";
    case "head_tilt":
      if (value > 30) return "Lower your head slightly to maintain a neutral neck position.";
      if (value >= -10 && value <= 10) return "Head position is neutral.";
      if (value < -30) return "Raise your head slightly to avoid excessive neck flexion.";
      return "Head position is within tolerance.";
    case "arm_angle":
      if (value < 60) return "Raise your arms for optimal posture and control.";
      if (value >= 80 && value <= 100) return "Arm position is optimal.";
      if (value > 100) return "Lower your arms to reduce shoulder fatigue.";
      return "Arm position is within tolerance.";
    case "arm_bent_angle":
      if (value < 10) return "Decrease elbow bend for better recoil control.";
      if (value <= 40) return "Elbow bend is optimal for control.";
      return "Bend your elbows more for better recoil control.";
    case "leg_spread":
      if (value < 20) return "Widen your stance for improved balance.";
      if (value <= 40) return "Leg spread is optimal for stability.";
      if (value > 40) return "Narrow your stance for better stability.";
      return "Leg spread is within tolerance.";
    case "back_angle":
      if (value > 45) return "Bent your back lesser to avoid lower back strain.";
      if (value >= -30 && value <= 30) return "Back posture is good.";
      if (value < -45) return "Standing straight; bent forward for better stability.";
      return "Back posture is within tolerance.";
    case "foot_to_shoulder_offset_left":
      if (value > 6) return "Bring your feet closer to your shoulders for optimal support.";
      if (value >= -3 && value <= 3) return "Foot position is optimal.";
      if (value < -6) return "Move your feet slightly apart for better balance.";
      return "Foot position is within tolerance.";
    default:
      return "No recommendation available.";
  }
}

export default function MetricsPanel() {
  const { measurements, rawScores, analysisMode } = useAnalysis();

  if (analysisMode === "upload") return null;

  // Convert measurements to array of metric objects
  let metrics: { key: string; value: number }[] = [];
  if (measurements && typeof measurements === "object" && !Array.isArray(measurements)) {
    metrics = Object.entries(measurements).map(([key, value]) => ({
      key,
      value: typeof value === "number" ? value : Number(value),
    }));
  }

  // Convert rawScores to a lookup object if it's an array
  let rawScoresObj: Record<string, number> = {};
  if (rawScores && typeof rawScores === "object" && !Array.isArray(rawScores)) {
    rawScoresObj = rawScores as Record<string, number>;
  }

  if (!metrics.length) {
    return (
      <div className="space-y-6">
        <Card variant="noHighlight">
          <CardHeader>
            <CardTitle>No Recommendations Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500">No analysis data to display.</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card variant="noHighlight">
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.map((metric, index) => {
            let percent = rawScoresObj[metric.key] ?? 0;
            // Map left/right offset to foot_to_shoulder_offset
            if (
              metric.key === "foot_to_shoulder_offset_left" ||
              metric.key === "foot_to_shoulder_offset_right"
            ) {
              percent = rawScoresObj["foot_to_shoulder_offset"] ?? 0;
            }
            const colorClass = getPercentColor(percent);
            return (
              <div key={index} className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm capitalize">{metric.key.replace(/_/g, " ")}</span>
                  <Badge variant="outline" className={colorClass}>{percent.toFixed(1)}%</Badge>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {getRecommendation(metric.key, metric.value)}
                </div>
                <Progress value={percent} className="mt-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
