import AnimatedNetworkBackground from "../landing/components/AnimatedBackground"
import Logo from "@/components/custom/Logo"

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center relative overflow-hidden">
      <AnimatedNetworkBackground />
      <div className="text-center relative pointer-events-none">
        {/* Logo */}
        <Logo className="h-20 mx-auto mb-4" />

        {/* Spinner */}
        <div className="relative w-12 h-12 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1"></div>
          </div>
        </div>

      </div>
    </div>
  )
}
