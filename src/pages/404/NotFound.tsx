"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Home, ArrowLeft, Search, HelpCircle, Mail } from "lucide-react"
import { useNavigate } from "react-router"
import AnimatedNetworkBackground from "../landing/components/AnimatedBackground"
import Logo from "@/components/custom/Logo"

export default function NotFound() {
  const navigate = useNavigate();

  const quickLinks = [
    {
      title: "Analysis Dashboard",
      description: "Access your posture analysis tools",
      icon: <Target className="w-5 h-5" />,
      href: "/dashboard",
    },
    {
      title: "Getting Started",
      description: "Learn how to use PostureX",
      icon: <HelpCircle className="w-5 h-5" />,
      href: "/help",
    },
    {
      title: "Support Center",
      description: "Get help from our team",
      icon: <Mail className="w-5 h-5" />,
      href: "/support",
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedNetworkBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Logo className="h-16 w-auto" />
          </div>

          {/* 404 Display */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold text-primary opacity-40 mb-4 select-none">404</div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Page Not Found</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto">
              Looks like this page took a wrong turn. Let's get you back on target with your posture analysis.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={() => navigate(-1)} className="text-lg px-8 py-3">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/")}
              className="text-lg px-8 py-3 bg-primary backdrop-blur-sm"
            >
              <Home className="w-5 h-5 mr-2" />
              Home Page
            </Button>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {quickLinks.map((link, index) => (
              <Card
                key={index}
                className="bg-card backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-secondary w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <div className="text-secondary-foreground">{link.icon}</div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{link.title}</h3>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search Section */}
          <Card className="bg-card backdrop-blur-sm border-0 shadow-lg max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Looking for something specific?</h3>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search our help center..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-border focus:border-transparent"
                />
                <Button size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer Message */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Still having trouble? Our support team is here to help.</p>
            <Button variant="link" className="text-primary hover:text-primary-foreground">
              Contact Support →
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      {/* <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200/30 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 left-1/2 w-24 h-24 bg-green-200/30 rounded-full blur-xl transform -translate-x-1/2"></div>
      <div className="absolute top-10 right-20 w-12 h-12 bg-yellow-200/30 rounded-full blur-xl"></div> */}
    </div>
  )
}
