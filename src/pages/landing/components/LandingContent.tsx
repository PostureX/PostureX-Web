import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  Camera,
  TrendingUp,
  Shield,
  Users,
  Award,
  CheckCircle,
  Play,
  Star,
  ArrowRight,
  Zap,
} from "lucide-react"
import AnimatedNetworkBackground from "./AnimatedBackground"

interface LandingContentProps {
  onGetStarted: () => void
}

export default function LandingContent({ onGetStarted }: LandingContentProps) {
  const features = [
    {
      icon: <Camera className="w-8 h-8 text-blue-600" />,
      title: "Real-Time Analysis",
      description:
        "Get instant feedback on your shooting posture with live camera analysis and AI-powered keypoint detection.",
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Precision Tracking",
      description: "Track 17+ key body points with 95%+ accuracy for comprehensive posture evaluation and improvement.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      title: "Progress Monitoring",
      description:
        "Monitor your improvement over time with detailed analytics, scoring, and personalized recommendations.",
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Professional Grade",
      description:
        "Used by law enforcement, military, and professional shooting instructors worldwide for training excellence.",
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Team Management",
      description: "Manage multiple trainees, track team progress, and generate comprehensive training reports.",
    },
    {
      icon: <Award className="w-8 h-8 text-blue-600" />,
      title: "Certification Ready",
      description:
        "Generate official training certificates and compliance reports for professional certification programs.",
    },
  ]

  const testimonials = [
    {
      name: "Yusuf Dikec",
      role: "Olympic Athlete",
      content:
        "PostureX gives me instant, actionable feedback that helps me refine my stance and stay at the top of my game. It's like having a world-class coach with me every session.",
      rating: 5,
      image: "/images/testimonials/yusuf_dikec.jpg",
    },
    {
      name: "Mike Chen",
      role: "Competitive Shooter",
      content: "The precision of the analysis is incredible. I've improved my scores by 15% since using PostureX.",
      rating: 5,
      image: "/images/testimonials/mike_chen.jpg",
    },
    {
      name: "David Rodriguez",
      role: "Military Instructor",
      content:
        "Essential tool for modern firearms training. The progress tracking keeps our recruits motivated and improving.",
      rating: 5,
      image: "/images/testimonials/david_rodriguez.jpg",
    },
  ]

  const pricingPlans = [
    {
      name: "Individual",
      price: "$29",
      period: "/month",
      description: "Perfect for individual shooters and enthusiasts",
      features: [
        "Real-time posture analysis",
        "Video upload analysis",
        "Personal progress tracking",
        "Basic reporting",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "Ideal for instructors and small teams",
      features: [
        "Everything in Individual",
        "Up to 25 trainees",
        "Advanced analytics",
        "Custom training programs",
        "Priority support",
        "API access",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations and institutions",
      features: [
        "Everything in Professional",
        "Unlimited trainees",
        "White-label solution",
        "Custom integrations",
        "Dedicated support",
        "On-premise deployment",
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <AnimatedNetworkBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
                <div className="relative w-48 group mb-2 text-center">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-primary/50 to-chart-2 rounded-md blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative px-3 py-1 bg-background/40 backdrop-blur-md rounded border border-primary/20 shadow">
                  <div className="flex items-center justify-center">
                  <Zap className="w-4 h-4 mr-1 text-primary" />
                  <span className="font-semibold text-xs text-foreground">AI-powered Analysis</span>
                  </div>
                </div>
                </div>
              <h1 className="text-5xl font-bold text mb-6 leading-tight">
                Perfect Your
                <span className="text-primary"> Shooting Posture</span>
                <br />
                with AI Precision
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Advanced computer vision technology analyzes your shooting stance in real-time, providing instant
                feedback and personalized recommendations for optimal performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-3 pointer-events-auto">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent pointer-events-auto">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
            <Card variant="glassWithHoverEffect" className="relative rounded-2xl shadow-2xl p-8 pointer-events-auto">
              <CardContent className="p-0">
                <div className="bg-gray-900 dark:bg-gray-800 rounded-lg aspect-video flex items-center justify-center mb-6">
                  <div className="text-center text-gray-400">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Live Analysis Preview</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">95%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">17+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Key Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Real-time</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Analysis</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text mb-4">Advanced Features for Professional Training</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to analyze, improve, and perfect shooting posture with cutting-edge AI technology.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-primary-foreground">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-primary-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Training Facilities</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-primary-100">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-primary-100">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Trusted by Professionals Worldwide</h2>
            <p className="text-xl text">See what training professionals are saying about PostureX</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
                <Card key={index} className="">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-primary"
                  />
                  <div>
                    <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                    <div className="text-sm text-card-muted">{testimonial.role}</div>
                  </div>
                  </div>
                  <p className="text-card-foreground mb-4 italic">"{testimonial.content}"</p>
                </CardContent>
                </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground">Flexible pricing for individuals, teams, and enterprises</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative overflow-visible ${plan.popular ? "border-blue-500 shadow-xl scale-105 border" : "border-gray-200"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                  </ul>
                  <div className="mt-auto">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} onClick={onGetStarted}>
                    {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                  </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Perfect Your Shooting Posture?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who trust PostureX for their training needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={onGetStarted} className="text-lg px-8 py-3 bg-primary text-primary-foreground">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 bg-secondary text-secondary-foreground"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/images/logo_light.svg" alt="PostureX Logo" className="w-24 h-12" />
              </div>
              <p className="text-gray-400">
                Advanced AI-powered shooting posture analysis for professional training and improvement.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PostureX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
