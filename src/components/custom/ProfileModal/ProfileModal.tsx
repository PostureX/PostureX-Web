import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/hooks/AuthContext"
import { Button } from "@/components/ui/button"
import { User, RefreshCw } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import api from "@/api/api"
import { useEffect, useRef, useState } from "react"

type ProfileModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

type TelegramLinkResponse = {
    telegram_link: string
    expires_at: number // now a float (unix seconds)
}

function getCountdownString(expiresAt: number) {
    // expiresAt is a float unix timestamp in seconds
    const ms = Math.floor(expiresAt * 1000) - Date.now()
    if (ms <= 0) return "Link expired, please refresh to generate a new one."
    const totalSeconds = Math.floor(ms / 1000)
    if (totalSeconds < 60) {
        return `${totalSeconds} second${totalSeconds !== 1 ? "s" : ""} remaining`
    }
    const minutes = Math.floor(totalSeconds / 60)
    return `${minutes} minute${minutes !== 1 ? "s" : ""} remaining`
}

export default function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
    const { user } = useAuth()
    const [countdown, setCountdown] = useState<string>("")
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const {
        data: teleData,
        isLoading: teleLoading,
        isError: teleError,
        refetch: refetchTele,
        isFetching: teleFetching,
    } = useQuery<TelegramLinkResponse>({
        queryKey: ["telegram-link"],
        queryFn: async () => {
            const res = await api.get("/auth/gen-tele-link")
            return res.data
        },
        enabled: false, // Only fetch when user clicks button
        refetchOnWindowFocus: false,
    })

    // Countdown timer effect
    useEffect(() => {
        if (teleData?.expires_at) {
            setCountdown(getCountdownString(teleData.expires_at))
            if (intervalRef.current) clearInterval(intervalRef.current)
            intervalRef.current = setInterval(() => {
                setCountdown(getCountdownString(teleData.expires_at))
            }, 1000)
            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current)
            }
        } else {
            setCountdown("")
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [teleData?.expires_at])

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Profile
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="space-y-2 mb-4">
                            <div>
                                <span className="font-semibold">Name: </span>
                                <span>{typeof user?.name === "string" ? user.name : "Unknown"}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Email: </span>
                                <span>{user?.email || "Unknown"}</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="font-semibold mb-1 flex items-center gap-2">
                                Telegram Link
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="ml-2"
                                    onClick={() => refetchTele()}
                                    disabled={teleLoading || teleFetching}
                                >
                                    <RefreshCw className={`w-4 h-4 mr-1 ${teleFetching ? "animate-spin" : ""}`} />
                                    {teleData ? "Refresh Link" : "Generate Link"}
                                </Button>
                            </div>
                            {teleLoading || teleFetching ? (
                                <span className="text-sm text-muted-foreground">Generating link...</span>
                            ) : teleError ? (
                                <div className="text-sm text-red-600 mb-2">
                                    Failed to fetch Telegram link.
                                </div>
                            ) : teleData ? (
                                <div className="flex flex-col gap-2">
                                    <a
                                        href={teleData.telegram_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={18}
                                            height={18}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            className="inline-block"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M21.944 3.433a1.5 1.5 0 0 0-1.62-.23L3.5 10.13a1.5 1.5 0 0 0 .13 2.8l3.98 1.37 1.53 4.6a1.5 1.5 0 0 0 2.37.7l2.1-1.7 3.47 2.6a1.5 1.5 0 0 0 2.37-.9l3.13-14.01a1.5 1.5 0 0 0-.55-1.57ZM9.7 15.1l-.98-2.95 7.6-6.7-6.62 7.7Zm2.13 3.13-.01-.01.01.01Zm7.13 1.13-3.47-2.6a1.5 1.5 0 0 0-1.87-.01l-2.1 1.7a.5.5 0 0 1-.79-.23l-1.53-4.6 9.97-8.8-2.1 9.41a1.5 1.5 0 0 0 .6 1.54l2.29 1.71a.5.5 0 0 1-.37.88Z"
                                            />
                                        </svg>
                                        Open Telegram Link
                                    </a>
                                    <span className="text-xs text-muted-foreground">
                                        {countdown}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-sm text-muted-foreground">No link generated yet.</span>
                            )}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}