import { Card, CardHeader } from "@/components/ui/card";
import "./upload.css";

export default function UploadPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Card>
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center">Upload Your Posture Data</h2>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                        Please upload your posture image or video file to get started.
                    </p>
                </CardHeader>
            </Card>
        </div>
    );
}