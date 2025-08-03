import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnalysis } from "@/hooks/AnalysisContext";
import { AlertCircle, CheckCircle, TriangleAlert } from "lucide-react";

const cocoWholeBodyKeypoints = [
  // Body (17 keypoints - same as COCO)
  "nose", "left_eye", "right_eye", "left_ear", "right_ear",
  "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
  "left_wrist", "right_wrist", "left_hip", "right_hip",
  "left_knee", "right_knee", "left_ankle", "right_ankle",

  // Face (68 keypoints)
  "face_0", "face_1", "face_2", "face_3", "face_4", "face_5", "face_6", "face_7", "face_8", "face_9",
  "face_10", "face_11", "face_12", "face_13", "face_14", "face_15", "face_16", "face_17", "face_18", "face_19",
  "face_20", "face_21", "face_22", "face_23", "face_24", "face_25", "face_26", "face_27", "face_28", "face_29",
  "face_30", "face_31", "face_32", "face_33", "face_34", "face_35", "face_36", "face_37", "face_38", "face_39",
  "face_40", "face_41", "face_42", "face_43", "face_44", "face_45", "face_46", "face_47", "face_48", "face_49",
  "face_50", "face_51", "face_52", "face_53", "face_54", "face_55", "face_56", "face_57", "face_58", "face_59",
  "face_60", "face_61", "face_62", "face_63", "face_64", "face_65", "face_66", "face_67",

  // Left Hand (21 keypoints)
  "left_hand_0", "left_hand_1", "left_hand_2", "left_hand_3", "left_hand_4",
  "left_hand_5", "left_hand_6", "left_hand_7", "left_hand_8",
  "left_hand_9", "left_hand_10", "left_hand_11", "left_hand_12",
  "left_hand_13", "left_hand_14", "left_hand_15", "left_hand_16",
  "left_hand_17", "left_hand_18", "left_hand_19", "left_hand_20",

  // Right Hand (21 keypoints)
  "right_hand_0", "right_hand_1", "right_hand_2", "right_hand_3", "right_hand_4",
  "right_hand_5", "right_hand_6", "right_hand_7", "right_hand_8",
  "right_hand_9", "right_hand_10", "right_hand_11", "right_hand_12",
  "right_hand_13", "right_hand_14", "right_hand_15", "right_hand_16",
  "right_hand_17", "right_hand_18", "right_hand_19", "right_hand_20",

  // Left Foot (6 keypoints)
  "left_foot_0", "left_foot_1", "left_foot_2", "left_foot_3", "left_foot_4", "left_foot_5",

  // Right Foot (6 keypoints)
  "right_foot_0", "right_foot_1", "right_foot_2", "right_foot_3", "right_foot_4", "right_foot_5"
];


export default function AdditionalInfoPanel() {
    const { keypoints, analysisMode } = useAnalysis();

    return analysisMode == "live" && <Card variant="noHighlight">
        <CardHeader>
            <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="keypoints">Keypoint Data</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>

                <TabsContent value="keypoints" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {keypoints.map((point) => (
                            <div key={point.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                                <div>
                                    <div className="text-sm text-muted-foreground">
                                        X: {point.x}, Y: {point.y}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-muted-foreground">{cocoWholeBodyKeypoints[point.id - 1]}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4">
                    <div className="space-y-4 text-primary-foreground">
                        <div className="p-4 bg-(--warning) border rounded-lg">
                            <AlertCircle className="w-5 h-5 mb-2" />
                            <h4 className="font-medium mb-2">Shoulder Alignment</h4>
                            <p className="text-sm">
                                Your shoulders are slightly uneven. Try to keep both shoulders level and square to the target.
                            </p>
                        </div>
                        <div className="p-4 bg-(--danger) border rounded-lg">
                            <TriangleAlert className="w-5 h-5 mb-2" />
                            <h4 className="font-medium mb-2">Elbow Position</h4>
                            <p className="text-sm">
                                Your elbows are excessively bent, which may cause instability. Aim to keep your elbows straighter and aligned with your wrists.
                            </p>
                        </div>
                        <div className="p-4 bg-(--success) border rounded-lg">
                            <CheckCircle className="w-5 h-5 mb-2" />
                            <h4 className="font-medium mb-2">Grip Position</h4>
                            <p className="text-sm">
                                Excellent grip positioning! Your hand placement is optimal for control and accuracy.
                            </p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </CardContent>
    </Card>
}