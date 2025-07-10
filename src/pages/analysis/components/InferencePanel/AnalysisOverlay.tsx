import { useAnalysis } from "@/hooks/AnalysisContext"
import { useInferenceSettings } from "@/hooks/InferenceSettingsContext"
import { useLayoutEffect, useState } from "react"

// Keypoint index ranges for each part (COCO WholeBody)
const PART_RANGES = {
    upperBody: [
        5, 6, 7, 8, 9, 10, 11, 12
    ],
    face: [
        ...Array.from({ length: 66 }, (_, i) => 23 + i),  // 23-88 FACE
    ],
    leftHand: [
        ...Array.from({ length: 21 }, (_, i) => 112 + i), // 91-111 LEFT HAND
    ],
    rightHand: [
        ...Array.from({ length: 21 }, (_, i) => 91 + i), // 112-132 RIGHT HAND
    ],
    lowerBody: [
        13, 14, 15, 16
    ],
};

const COCO_WHOLEBODY_SKELETON: [number, number][] = [
    // BODY
    [5, 6],
    [6, 8], [8, 10],
    [5, 7], [7, 9],
    [6, 12], [5, 11],
    [12, 14], [14, 16],
    [11, 13], [13, 15],
    
    // FACE
    ...Array.from({ length: 16 }, (_, i): [number, number] => [23 + i, 23 + i + 1]), // Jawline
    ...Array.from({ length: 4 }, (_, i): [number, number] => [45 + i, 45 + i + 1]), // Right eyebrow
    ...Array.from({ length: 4 }, (_, i): [number, number] => [41 + i, 41 + i + 1]), // Left eyebrow
    [50, 51], [51, 52], [52, 53], [53, 56], [56, 55], [55, 54], [56, 57], [57, 58], // Nose bridge and bottom
    ...Array.from({ length: 5 }, (_, i): [number, number] => [65 + i, 65 + i + 1]), // Right eye
    ...Array.from({ length: 5 }, (_, i): [number, number] => [59 + i, 59 + i + 1]), // Left eye
    ...Array.from({ length: 10 }, (_, i): [number, number] => [71 + i, 71 + i + 1]), // Outer lips
    [72, 84], [84, 85], [85, 86], [86, 87], [87, 77], // Inner lips
    
    // LEFT HAND (uncomment if you have these keypoints)
    [91, 92], [92, 93], [93, 94],
    [91, 95], [95, 96], [96, 97],
    [91, 98], [98, 99], [99, 100],
    [91, 101], [101, 102], [102, 103],
    [91, 104], [104, 105], [105, 106],

    // RIGHT HAND
    [112, 113], [113, 114], [114, 115],
    [112, 116], [116, 117], [117, 118],
    [112, 119], [119, 120], [120, 121],
    [112, 122], [122, 123], [123, 124],
    [112, 125], [125, 126], [126, 127],
];

export default function AnalysisOverlay() {
    const { isAnalyzing, analysisMode, keypoints } = useAnalysis();
    const {
        showFace,
        showLeftHand,
        showRightHand,
        showUpperBody,
        showLowerBody,
    } = useInferenceSettings();
    const [videoDims, setVideoDims] = useState({
        width: 0,
        height: 0,
        displayWidth: 0,
        displayHeight: 0,
        offsetX: 0,
        offsetY: 0,
    });

    useLayoutEffect(() => {
        let video: HTMLVideoElement | null = null;
        let resizeObserver: ResizeObserver | null = null;

        function updateDims() {
            video = document.querySelector("video");
            if (!video) return;
            if (video.videoWidth === 0 || video.videoHeight === 0) return;

            const rect = video.getBoundingClientRect();
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            const displayWidth = rect.width;
            const displayHeight = rect.height;

            // Calculate scale and offset for object-contain
            const videoAspect = videoWidth / videoHeight;
            const displayAspect = displayWidth / displayHeight;
            let drawWidth = displayWidth, drawHeight = displayHeight, offsetX = 0, offsetY = 0;
            if (videoAspect > displayAspect) {
                // Letterbox top/bottom
                drawWidth = displayWidth;
                drawHeight = displayWidth / videoAspect;
                offsetY = (displayHeight - drawHeight) / 2;
            } else {
                // Letterbox left/right
                drawHeight = displayHeight;
                drawWidth = displayHeight * videoAspect;
                offsetX = (displayWidth - drawWidth) / 2;
            }
            setVideoDims({
                width: videoWidth,
                height: videoHeight,
                displayWidth: drawWidth,
                displayHeight: drawHeight,
                offsetX,
                offsetY,
            });
        }

        // Run once and on every relevant change
        updateDims();

        // Listen for video metadata, resize, and window resize
        video = document.querySelector("video");
        if (video) {
            video.addEventListener("loadedmetadata", updateDims);
            // Listen for video element resize (e.g., when layout changes)
            if ("ResizeObserver" in window) {
                resizeObserver = new ResizeObserver(updateDims);
                resizeObserver.observe(video);
            }
        }
        window.addEventListener("resize", updateDims);

        // Also re-run when keypoints or camera state changes (to catch stream switches)
        // (You can add isCameraOn, isAnalyzing, keypoints.length to the dependency array)

        return () => {
            if (video) {
                video.removeEventListener("loadedmetadata", updateDims);
                if (resizeObserver) resizeObserver.disconnect();
            }
            window.removeEventListener("resize", updateDims);
        };
    }, [isAnalyzing, keypoints.length]);

    // Map keypoints to displayed coordinates
    function mapPoint(point: { x: number, y: number }) {
        const { width, height, displayWidth, displayHeight, offsetX, offsetY } = videoDims;
        if (!width || !height) return { x: 0, y: 0 };
        return {
            x: (point.x / width) * displayWidth + offsetX,
            y: (point.y / height) * displayHeight + offsetY,
        };
    }

    // Build a set of allowed indices based on settings
    const allowedIndices = new Set<number>();
    if (showUpperBody) PART_RANGES.upperBody.forEach(i => allowedIndices.add(i));
    if (showFace) PART_RANGES.face.forEach(i => allowedIndices.add(i));
    if (showLeftHand) PART_RANGES.leftHand.forEach(i => allowedIndices.add(i));
    if (showRightHand) PART_RANGES.rightHand.forEach(i => allowedIndices.add(i));
    if (showLowerBody) PART_RANGES.lowerBody.forEach(i => allowedIndices.add(i));

    const videoReady = videoDims.width > 0 && videoDims.height > 0;

    const maxIndex = keypoints.length - 1;
    console.log("max keypoint index:", maxIndex);
    console.log("AnalysisOverlay keypoints:", allowedIndices);
    console.log("keypoints array:", keypoints);

    return (
        <>
            {isAnalyzing && videoReady && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Draw skeleton connections */}
                    {COCO_WHOLEBODY_SKELETON.map(([from, to], idx) => {
                        if (!allowedIndices.has(from) || !allowedIndices.has(to)) return null;
                        if (!keypoints[from] || !keypoints[to]) return null;
                        const kp1 = keypoints[from];
                        const kp2 = keypoints[to];
                        if (
                            typeof kp1.x !== "number" || typeof kp1.y !== "number" ||
                            typeof kp2.x !== "number" || typeof kp2.y !== "number"
                        ) return null;
                        const p1 = mapPoint(kp1);
                        const p2 = mapPoint(kp2);
                        return (
                            <line
                                key={idx}
                                x1={p1.x}
                                y1={p1.y}
                                x2={p2.x}
                                y2={p2.y}
                                stroke="#3b82f6"
                                strokeWidth="2"
                                opacity="0.7"
                            />
                        );
                    })}
                    {/* Draw keypoints */}
                    {keypoints.map((point, index) => {
                        if (!allowedIndices.has(index)) return null;
                        if (!point || typeof point.x !== "number" || typeof point.y !== "number") return null;
                        const mapped = mapPoint(point);
                        return (
                            <g key={index}>
                                <circle cx={mapped.x} cy={mapped.y} r="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />
                            </g>
                        );
                    })}
                </svg>
            )}

            {isAnalyzing && (
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">
                            {analysisMode === "live" ? "Analyzing Live Feed" : "Analyzing Video"}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
}