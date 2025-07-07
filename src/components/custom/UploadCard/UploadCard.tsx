import "./UploadCard.css";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function UploadCard(props: { id: number, date: string }) {
    return (
        <Card key={props.id} className="flex flex-col justify-between bg-[#F2F2F2] overflow-hidden lg:w-[40vw] lg:h-[350px] xl:w-[26vw] xl:h-[350px] rounded-[12px] pt-2 gap-1 border-none shadow-sm upload-container">
            <div className="aspect-video bg-gray-300 relative lg:h-[200px] xl:h-[220px] mx-2 rounded-[6px] my-0 py-0">
            </div>
            <CardContent className="p-4 pt-1 flex flex-col justify-between flex-grow box-border">
                <h3 className="font-semibold text-[#00205B] text-[1.2rem] mb-2">Front Posture Analysis #{props.id}</h3>
                <div className="flex items-center text-red-500 text-sm mb-4">
                    <span>{props.date}</span>
                </div>
                <Button variant="outline" className="w-full bg-transparent text-[#00205B] text-[1rem] border-[#00205B] border-1">
                    View Analysis
                </Button>
            </CardContent>
        </Card>
    )
}