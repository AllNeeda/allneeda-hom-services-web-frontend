'use client'

import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface GalleryDialogProps {
  open: boolean;
  /* eslint-disable no-unused-vars */
  onOpenChange: (open: boolean) => void;
  /* eslint-enable no-unused-vars */
  images: string[];
  title?: string;
  selectIndex:number;
}

export default function ImagesDialogBox({
  open,
  onOpenChange,
  images,
  title = "Gallery",
  selectIndex,
}: GalleryDialogProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(selectIndex? selectIndex : 0);

  // Update selectedImageIndex when selectIndex prop changes
  useEffect(() => {
    if (selectIndex !== undefined && selectIndex >= 0 && selectIndex < images.length) {
      setSelectedImageIndex(selectIndex);
    }
  }, [selectIndex, images.length]);

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const goPrev = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden w-[90vw] !max-w-4xl h-[80vh]">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
            <DialogClose className="text-gray-400 hover:text-gray-700" />
          </div>

          {/* Main Image */}
          <div className="flex-1 relative p-4">
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src={images[selectedImageIndex]}
                alt={`Gallery image ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Thumbnails */}
          <div className="p-4 border-t">
            <div className="relative">
              {/* Prev Button */}
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 shadow hover:bg-gray-100 hover:text-black transition-all"
                onClick={goPrev}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Next Button */}
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 shadow hover:bg-gray-100 hover:text-black transition-all"
                onClick={goNext}
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Thumbnails */}
              <div className="flex justify-center gap-2 px-8">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`relative w-20 h-16 rounded overflow-hidden border-2 cursor-pointer transition-all ${
                      selectedImageIndex === i
                        ? 'border-blue-500 scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleThumbnailClick(i)}
                  >
                    <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
