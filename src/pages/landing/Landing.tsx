import { useState } from "react"
import LandingContent from "./components/LandingContent"
import AuthModal from "./components/AuthModal"
import LandingHeader from "./components/LandingHeader"

export default function Landing() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")

  const handleAuthSuccess = () => {
    setIsAuthOpen(false)
  }

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setIsAuthOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader
        onLogin={() => openAuth("login")}
        onSignup={() => openAuth("signup")}
      />
      <LandingContent onGetStarted={() => openAuth("signup")} />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}
