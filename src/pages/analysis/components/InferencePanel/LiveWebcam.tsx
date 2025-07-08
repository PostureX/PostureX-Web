import { useRef, useEffect, useState } from "react";
import { Target, CameraOff } from "lucide-react";
import { useAnalysis } from "@/hooks/Analysis";

export default function LiveWebcam() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { isAnalyzing, isCameraOn, cameraDevices, cameraIndex } = useAnalysis();
    const [cameraError, setCameraError] = useState(false);

    useEffect(() => {
        let stream: MediaStream | null = null;
        const videoElement = videoRef.current;

        async function getWebcam() {
            try {
                const constraints: MediaStreamConstraints = {
                    video: cameraDevices.length
                        ? { deviceId: { exact: cameraDevices[cameraIndex]?.deviceId } }
                        : true,
                };
                stream = await navigator.mediaDevices.getUserMedia(constraints);
                if (videoElement) {
                    videoElement.srcObject = stream;
                }
                setCameraError(false);
            } catch {
                setCameraError(true);
            }
        }

        if (isCameraOn) {
            getWebcam();
        } else {
            // If camera is turned off, clear the video stream
            if (videoElement) {
                videoElement.srcObject = null;
            }
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (videoElement) {
                videoElement.srcObject = null;
            }
        };
    }, [isCameraOn, cameraDevices, cameraIndex]);

    return (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain rounded-lg"
            />
            {/* Overlay for fallback or instructions if needed */}
            {cameraError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <CameraOff className="w-16 h-16 mx-auto mb-4 opacity-50 text-red-400" />
                    <p className="text-lg text-red-400 font-semibold">No camera found</p>
                    <p className="text-sm mt-2 text-gray-400">Please connect a camera and refresh the page.</p>
                </div>
            ) : !isAnalyzing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <Target className="w-16 h-16 mx-auto mb-4 opacity-50 text-gray-400" />
                    <p className="text-sm mt-2 text-gray-400">Click "Start Analysis" to begin</p>
                </div>
            )}
        </div>
    );
}