import { useAnalysis } from "@/hooks/Analysis"

export default function AnalysisOverlay() {
    const { isAnalyzing, analysisMode, keypoints } = useAnalysis();

    return <>
        {/* Keypoint overlay - show for both modes when analyzing */}
        {isAnalyzing && (
            <svg className="absolute inset-0 w-full h-full">
                {/* Skeleton connections */}
                <line x1="320" y1="80" x2="280" y2="140" stroke="#3b82f6" strokeWidth="2" />
                <line x1="320" y1="80" x2="360" y2="140" stroke="#3b82f6" strokeWidth="2" />
                <line x1="280" y1="140" x2="240" y2="200" stroke="#3b82f6" strokeWidth="2" />
                <line x1="360" y1="140" x2="400" y2="200" stroke="#3b82f6" strokeWidth="2" />
                <line x1="240" y1="200" x2="220" y2="260" stroke="#3b82f6" strokeWidth="2" />
                <line x1="400" y1="200" x2="420" y2="260" stroke="#3b82f6" strokeWidth="2" />

                {/* Keypoints */}
                {keypoints.map((point) => (
                    <g key={point.id}>
                        <circle cx={point.x} cy={point.y} r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                        <text
                            x={point.x}
                            y={point.y - 15}
                            fill="#ffffff"
                            fontSize="12"
                            textAnchor="middle"
                            className="font-medium"
                        >
                            {point.name}
                        </text>
                    </g>
                ))}
            </svg>
        )}

        {/* Analysis overlay */}
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
}