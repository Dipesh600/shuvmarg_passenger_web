import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({ images, initialIndex, isOpen, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(isOpen);

  const handleNext = useCallback(() => {
    setCurrentIndex((previous) => (previous + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(
      (previous) => (previous - 1 + images.length) % images.length
    );
  }, [images.length]);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsRendered(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsRendered(false), 220); // 220ms from design system
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isOpen, onClose]);

  if (!isRendered) return null;

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center select-none touch-none">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-neutral-900/90 backdrop-blur-sm transition-opacity duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center w-full h-full p-4 md:p-8 transition-all duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'}`}
      >
        <div className="relative inline-flex">
          {/* Close Button - cuts top right corner */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 w-10 h-10 bg-[#D94328] hover:bg-[#C93522] text-white rounded-full flex items-center justify-center shadow-xl transition-colors z-20"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Main Image */}
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1} of ${images.length}`}
            className="w-[90vw] md:w-[800px] h-[60vh] md:h-[500px] object-cover rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Navigation Buttons - cuts left/right edges */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-[#D94328] hover:bg-[#C93522] text-white rounded-full flex items-center justify-center transition-colors z-20 shadow-xl"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8 -ml-1" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 bg-[#D94328] hover:bg-[#C93522] text-white rounded-full flex items-center justify-center transition-colors z-20 shadow-xl"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8 -mr-1" />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-6 bg-neutral-900/60 text-white text-[14px] font-bold px-5 py-2 rounded-full backdrop-blur-md">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
