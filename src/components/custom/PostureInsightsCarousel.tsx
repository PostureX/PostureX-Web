import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import InsightsCard from "./InsightsCard/InsightsCard";

interface Insight {
  severity_level: number;
  message: string;
  percentageChange: number;
  improvement: boolean;
}

interface PostureInsightsCarouselProps {
  insights: Insight[];
  className?: string;
}

export default function PostureInsightsCarousel({ insights, className }: PostureInsightsCarouselProps) {
  // State Management
  const [cardsPerView, setCardsPerView] = useState(3);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive Layout
  const getCardsPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) return 3; // Large desktop
      if (window.innerWidth >= 1024) return 3; // Desktop
      if (window.innerWidth >= 768) return 2;  // Tablet
      if (window.innerWidth >= 640) return 2;  // Small tablet
      return 1; // Mobile
    }
    return 3;
  };

  useEffect(() => {
    const handleResize = () => {
      const newCardsPerView = getCardsPerView();
      setCardsPerView(newCardsPerView);
      
      // Recalculate max slides and clamp current slide if necessary
      const newTotalSlides = Math.ceil(insights.length / newCardsPerView);
      const newMaxSlides = Math.max(0, newTotalSlides - 1);
      
      // Ensure current slide doesn't exceed new maximum
      setCurrentSlide(prev => Math.min(prev, newMaxSlides));
    };
    
    setCardsPerView(getCardsPerView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [insights.length]);

  // Slide Navigation
  const totalSlides = Math.ceil(insights.length / cardsPerView); // Calculate total slides needed
  const maxSlides = Math.max(0, totalSlides - 1); // Maximum slide index (0-based)
  const cardWidth = 100 / cardsPerView;

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlides));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.min(index, maxSlides));
  };

  // Drag Handling
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStart(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    setDragOffset(clientX - dragStart);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    const threshold = 50;
    const direction = dragOffset > threshold ? -1 : dragOffset < -threshold ? 1 : 0;

    if (direction === 1 && currentSlide < maxSlides) setCurrentSlide((prev) => prev + 1);
    else if (direction === -1 && currentSlide > 0) setCurrentSlide((prev) => prev - 1);

    setIsDragging(false);
    setDragOffset(0);
  };

  // Event Handlers (Mouse & Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Transform Calculation for Sliding
  const calculateTransform = () => {
    const baseTransform = currentSlide * cardWidth;
    const dragTransform = isDragging ? (dragOffset / (containerRef.current?.offsetWidth || 1)) * 100 : 0;
    return -(baseTransform - dragTransform);
  };

  // Create dots array based on actual number of slides needed
  const dots = Array.from({ length: totalSlides }, (_, i) => i);

  return (
    <div className={`insights-carousel ${className} gap-10`}>
      {/* Carousel Container */}
      <div 
        ref={containerRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(${calculateTransform()}%)`,
            width: `${(insights.length / cardsPerView) * 100}%`,
          }}
        >
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`flex-shrink-0 select-none transition-transform duration-200 ${
                isDragging ? 'scale-95' : ''
              } ${cardsPerView === 1 ? 'px-4' : cardsPerView === 2 ? 'px-3' : 'px-2'}`}
              style={{ width: `${100 / insights.length}%` }}
            >
              <InsightsCard
                severity_level={insight.severity_level}
                message={insight.message}
                percentageChange={insight.percentageChange}
                improvement={insight.improvement}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-4 sm:mt-6">
          <div className="flex gap-1 sm:gap-2">
            {dots.map((_, i) => (
              <button
                key={i}
                className={`transition-colors duration-200 rounded-full ${
                  cardsPerView === 1 ? 'w-4 h-4' : 'w-3 h-3'
                } ${
                  currentSlide === i ? "bg-[#00205B]" : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => goToSlide(i)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      {totalSlides > 1 && (
        <div className="flex items-center justify-center mt-3 sm:mt-4 gap-3 sm:gap-4">
          {/* Previous Arrow */}
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`p-0 ${cardsPerView === 1 ? 'w-10 h-10 text-lg' : 'w-8 h-8'}`}
          >
            ⟨
          </Button>

          {/* Next Arrow */}
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentSlide >= maxSlides}
            className={`p-0 ${cardsPerView === 1 ? 'w-10 h-10 text-lg' : 'w-8 h-8'}`}
          >
            ⟩
          </Button>
        </div>
      )}
    </div>
  );
}
