import { useRef, useEffect, useState } from "react";
import { Target, CameraOff } from "lucide-react";
import { useAnalysis } from "@/hooks/Analysis";

export default function LiveWebcam() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const cleanupPromiseRef = useRef<Promise<void>>(Promise.resolve());
    const { isAnalyzing, isCameraOn, cameraDevices, cameraIndex } = useAnalysis();
    const [cameraError, setCameraError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const videoElement = videoRef.current;

        // Helper to stop and clean up the current stream
        async function cleanupStream() {
            if (videoElement) {
                videoElement.srcObject = null;
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            // Wait a tick to ensure hardware is released
            await new Promise(res => setTimeout(res, 100));
        }

        async function getWebcam() {
            // Chain cleanup to avoid overlap
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
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="relative z-10 flex flex-col items-center pointer-events-none">
                        <CameraOff className="w-16 h-16 mx-auto mb-4 opacity-50 text-red-400" />
                        <p className="text-lg text-red-400 font-semibold">No camera found</p>
                        <p className="text-sm mt-2 text-gray-400">Please connect a camera and refresh the page.</p>
                    </div>
                </div>
            ) : !isAnalyzing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="relative z-10 flex flex-col items-center pointer-events-none">
                        <Target className="w-16 h-16 mx-auto mb-4 opacity-50 text-gray-400" />
                        <p className="text-sm mt-2 text-gray-400">Click "Start Analysis" to begin</p>
                    </div>
                </div>
            )}
        </div>
    );
}