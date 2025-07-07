import { Target } from "lucide-react";

export default function LiveWebcam() {
    return <>
        {/* Live camera feed placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center text-gray-400">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Live camera feed will appear here</p>
                <p className="text-sm mt-2">Click "Start Analysis" to begin</p>
            </div>
        </div>
    </>
}