// Returns a color string based on percentage value (0-100)

import { AnalysisStatus } from "@/types";

// Returns a Tailwind color class based on percentage value (0-100)
export function getPercentColor(percent: number, type: string = "bg"): string {
  if (percent >= 90) return `${type}-green-500`;
  if (percent >= 80) return `${type}-lime-400`;
  if (percent >= 60) return `${type}-orange-400`;
  return `${type}-red-500`;
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

export function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date);
  }

  let formattedDate = date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  formattedDate = formattedDate.replace(/\b(am|pm)\b/i, (match) =>
    match.toUpperCase()
  );

  return formattedDate;
}


export const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

export const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
