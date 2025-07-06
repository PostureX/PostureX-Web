import "./insights_card.css";
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function InsightsCard(props: {severity_level: number, message: string, percentageChange: number, improvement: boolean}) {
    const severityMessage: String[] = ["Critical Issue", "Warning", "Good"]

    const getBadgeColour = (severity: number) => {
        switch (severity) {
            case 0:
                //red
                return "bg-[#F45050]/20 text-[#DB1B1B] text-[16px] font-[500]";
            case 1:
                //orange
                return "bg-[#FFD079]/30 text-[#FDAF1E] text-[16px] font-[500]";
            case 2:
                //green
                return "bg-[#75F290]/30 text-[#00BA28] text-[16px] font-[500]";
            default:
                return "bg-[#000]/30 text-[#000] text-[16px] font-[500]";
        }
    };

    const getimprovementTextColor = (severity: number) => {
        switch (severity) {
            case 0:
                return "text-[#DB1B1B]";
            case 1:
                return "text-[#FDAF1E]";
            case 2:
                return "text-[#00BA28]";
            default:
                return "text-[#000]";
        }
    };

    const getBorderColour = (severity: number) => {
        switch (severity) {
            case 0:
                return "border-[#DB1B1B]";
            case 1:
                return "border-[#FFD079]";
            case 2:
                return "border-[#00BA28]";
            default:
                return "border-[#000]";
        }
    }

    return (
        <Card className={`insight-card-container bg-[#F2F2F2] border-1 shadow-xs flex flex-col h-full ${getBorderColour(props.severity_level)} rounded-[12px] overflow-hidden`}>
            <CardContent className="px-6 py-2 flex-1 flex flex-col">
                <Badge variant="destructive" className={`flex-none mb-3 ${getBadgeColour(props.severity_level)} rounded-full px-6`}>
                    {severityMessage[props.severity_level] || "Invalid"}
                </Badge>
                <p className="flex-1 text-[#00205B] text-[18px] font-[500] mb-4 overflow-auto scrollbar-hide max-h-[5rem]">
                    {props.message || "Invalid"}
                </p>
                <p className={`flex-none text-sm font-medium ${getimprovementTextColor(props.severity_level)}`}>
                    {props.percentageChange || 0}% {props.improvement ? "better" : "worse"} than previous week
                </p>
            </CardContent>
        </Card>
    )
}