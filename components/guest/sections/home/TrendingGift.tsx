"use client";

import { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, Gift } from "lucide-react";
import Service from "@/components/common/Service";
import { Service as TypeGiftService } from "@/types/services";
import { Button } from "@/components/ui/button";
import { trendingGifts } from "@/data/dummy"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const TrendingGift = () => {
  const [currentIndex, setCurrentIndex] = useState(0); 
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToNext = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 320; // w-80 = 320px
      const gap = 16; // gap-4 = 16px
      const scrollAmount = cardWidth + gap;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setCurrentIndex(prev => Math.min(prev + 1, trendingGifts.length - 1));
    }
  };

  const scrollToPrev = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 320; // w-80 = 320px
      const gap = 16; // gap-4 = 16px
      const scrollAmount = cardWidth + gap;
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
  };

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < trendingGifts.length - 1;

  return (
    <div className="py-8 px-4 xl:px-0">
      <Card className="max-w-7xl mx-auto px-4 dark:bg-gray-900">
        <CardHeader className="flex flex-row items-center justify-between mb-2 pb-0">
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6" />
            <CardTitle className="text-xl font-bold">Trending gifts</CardTitle>
          </div>
          <div className="flex items-center gap-1 text-blue-600 cursor-pointer hover:text-blue-700">
            <span className="text-sm font-medium">See all</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Carousel Container */}
          <div className="relative group">
            {/* Left Arrow */}
            {canScrollLeft && (
              <Button
                variant="outline"
                size="icon"
                onClick={scrollToPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            {/* Cards Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {trendingGifts.map((gift, idx) => (
                <div key={idx} className="flex-shrink-0 w-80">
                  <Service offer={gift as TypeGiftService} />
                </div>
              ))}
            </div>
            {/* Right Arrow */}
            {canScrollRight && (
              <Button
                variant="outline"
                size="icon"
                onClick={scrollToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendingGift;    