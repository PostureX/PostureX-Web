import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnalysis } from "@/hooks/Analysis";
import { AlertCircle, CheckCircle, TriangleAlert } from "lucide-react";

export default function AdditionalInfoPanel() {
    const { keypoints } = useAnalysis();

    return <Card variant="noHighlight">
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
                                    <span className="font-medium">{point.name}</span>
                                    <div className="text-sm text-muted-foreground">
                                        X: {point.x}, Y: {point.y}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium">{(point.confidence * 100).toFixed(1)}%</div>
                                    <div className="text-xs text-muted-foreground">Confidence</div>
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