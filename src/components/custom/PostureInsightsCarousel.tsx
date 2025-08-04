import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import InsightsCard from "./InsightsCard/InsightsCard";
import { GripHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { AnalysisSummaryInsight } from "@/hooks/useAnalysisSummary";

interface PostureInsightsCarouselProps {
  insights: AnalysisSummaryInsight[];
  className?: string;
}

export default function PostureInsightsCarousel({ insights, className }: PostureInsightsCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(3)
  const carouselRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Responsive cards per view
  const getCardsPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 3 // lg screens
      if (window.innerWidth >= 768) return 2 // md screens
      return 1 // sm screens
    }
    return 3
  }

  useEffect(() => {
    const handleResize = () => setCardsPerView(getCardsPerView())
    setCardsPerView(getCardsPerView())
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  const maxSlides = Math.max(0, insights.length - cardsPerView)

  // Clamp currentSlide if insights/cardsPerView change
  useEffect(() => {
    if (currentSlide >= maxSlides) {
      setCurrentSlide(maxSlides - 1)
    }
  }, [maxSlides, currentSlide])

  const cardWidth = 100 / cardsPerView

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlides))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.min(index, maxSlides))
  }

  // Drag handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true)
    setDragStart(clientX)
    setDragOffset(0)
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return

    const offset = clientX - dragStart
    setDragOffset(offset)
  }

  const handleDragEnd = () => {
    if (!isDragging) return

    const threshold = 50 // minimum drag distance to trigger slide change
    const direction = dragOffset > threshold ? -1 : dragOffset < -threshold ? 1 : 0

    if (direction === 1 && currentSlide < maxSlides) {
      setCurrentSlide((prev) => prev + 1)
    } else if (direction === -1 && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1)
    }

    setIsDragging(false)
    setDragOffset(0)
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleDragEnd()
  }

  const handleMouseLeave = () => {
    handleDragEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  const calculateTransform = () => {
    const baseTransform = currentSlide * cardWidth
    const dragTransform = isDragging ? (dragOffset / (containerRef.current?.offsetWidth || 1)) * 100 : 0
    return -(baseTransform - dragTransform)
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Scrollable indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <GripHorizontal className="w-4 h-4" />
          <span>Drag to scroll through insights</span>
        </div>
      </div>

      <div
        className={`overflow-hidden rounded-lg relative ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Fade indicators for scrollable content */}
        {currentSlide > 0 && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#f7f7f7]-200 to-transparent dark:from-black z-10 pointer-events-none" />
        )}
        {currentSlide < maxSlides && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#f7f7f7]-200 to-transparent dark:from-black-950 z-10 pointer-events-none" />
        )}

        <div
          className={`flex transition-transform duration-300 ease-out ${isDragging ? "transition-none" : ""} gap-2 py-2`}
          style={{
            transform: `translateX(${calculateTransform()}%)`,
            width: `${(insights.length / cardsPerView) * 100}%`,
          }}
        >
          {insights.map((insight, index) => (
            <div key={index} className="flex-shrink-0 px-2 select-none" style={{ width: `${100 / insights.length}%` }}>
              <InsightsCard
                type={insight.type}
                title={insight.title}
                content={insight.content}
                isDragging={isDragging}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls - Centered below cards */}
      <div className="flex items-center justify-center mt-6 space-x-4">
        {/* Left Navigation Button */}
        <Button
          variant="outline"
          size="icon"
          className={`bg-white shadow-lg hover:bg-gray-50 transition-all ${
            currentSlide > 0 ? "opacity-100" : "opacity-30 cursor-not-allowed"
          }`}
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Dots Indicator */}
        {maxSlides > 0 && (
          <div className="flex items-center space-x-2 px-4">
            {Array.from({ length: maxSlides}, (_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  index === currentSlide ? "bg-blue-900 w-6" : "bg-gray-300 w-2 hover:bg-gray-400"
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}

        {/* Right Navigation Button */}
        <Button
          variant="outline"
          size="icon"
          className={`bg-white shadow-lg hover:bg-gray-50 transition-all ${
            currentSlide < maxSlides ? "opacity-100" : "opacity-30 cursor-not-allowed"
          }`}
          onClick={nextSlide}
          disabled={currentSlide >= maxSlides}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
