import { useRef, useEffect } from "react";
import { Target, CameraOff } from "lucide-react";
import { useAnalysis } from "@/hooks/AnalysisContext";
import AnalysisOverlay from "./AnalysisOverlay";

export default function LiveWebcam() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const cleanupPromiseRef = useRef<Promise<void>>(Promise.resolve());
    const { isAnalyzing, isCameraOn, cameraDevices, cameraIndex, cameraError, setCameraError } = useAnalysis();

    useEffect(() => {
        let isMounted = true;
        const videoElement = videoRef.current;

        async function cleanupStream() {
            if (videoElement) {
                videoElement.srcObject = null;
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            await new Promise(res => setTimeout(res, 100));
        }

        async function getWebcam() {
            cleanupPromiseRef.current = cleanupPromiseRef.current.then(cleanupStream);
            await cleanupPromiseRef.current;

            if (!isMounted) return;

            try {
                let constraints: MediaStreamConstraints = {};

                if (cameraDevices.length > 0) {
                    const device = cameraDevices[cameraIndex];
                    constraints = {
                        video: {
                            deviceId: { exact: device.deviceId },
                        },
                    };
                } else {
                    constraints = { video: true };
                }

                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                streamRef.current = stream;

                if (videoElement) {
                    videoElement.srcObject = stream;
                }
                setCameraError(false);
            } catch (error) {
                console.error("Error accessing webcam:", error);
                setCameraError(true);
                await cleanupStream();
            }
        }

        if (isCameraOn) {
            getWebcam();
        } else {
            cleanupPromiseRef.current = cleanupPromiseRef.current.then(cleanupStream);
        }

        return () => {
            isMounted = false;
            cleanupPromiseRef.current = cleanupPromiseRef.current.then(cleanupStream);
        };
    }, [isCameraOn, cameraDevices, cameraIndex, setCameraError]);

    // Fallback UI for camera off
    if (!isCameraOn) {
        return (
            <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-800 to-gray-900">
                    <CameraOff className="w-16 h-16 mb-4 opacity-50" />
                    <span className="ml-4 text-lg">Camera is Off</span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <AnalysisOverlay />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain rounded-lg"
                />
                {/* Overlay for fallback or instructions if needed */}
                {cameraError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="relative z-10 flex flex-col items-center pointer-events-none">
                            <CameraOff className="w-16 h-16 mx-auto mb-4 opacity-50 text-red-400" />
                            <p className="text-lg text-red-400 font-semibold">No camera found</p>
                            <p className="text-sm mt-2 text-gray-400">Please connect a camera and refresh the page.</p>
                        </div>
                    </div>
                ) : !isAnalyzing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black opacity-80">
                        <div className="relative z-10 flex flex-col items-center pointer-events-none">
                            <Target className="w-16 h-16 mx-auto mb-4 opacity-50 text-gray-400" />
                            <p className="text-sm mt-2 text-gray-400">Click "Start Analysis" to begin</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}