// Returns a color string based on percentage value (0-100)

import { AnalysisStatus } from "@/types";

// Returns a Tailwind color class based on percentage value (0-100)
export function getPercentColor(percent: number): string {
	if (percent >= 90) return "bg-green-500";
	if (percent >= 80) return "bg-lime-400";
	if (percent >= 60) return "bg-orange-400";
	return "bg-red-500";
}

export function getStatusColor(status: AnalysisStatus): string {
	switch (status) {
		case AnalysisStatus.InProgress:
			return "text-blue-500";
		case AnalysisStatus.Failed:
			return "text-red-500";
		case AnalysisStatus.Completed:
			return "text-green-500";
	}
}
