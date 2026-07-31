"use client";

import React, { useState } from "react";
import { ImageLightbox } from "./ImageLightbox";
import { Bus } from "lucide-react";

interface BusPhotosGalleryProps {
  images: string[];
}

export function BusPhotosGallery({ images = [] }: BusPhotosGalleryProps) {
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    index: number;
  }>({ isOpen: false, index: 0 });

  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  const handleImageLoad = (index: number) => {
    setLoadingImages((prev) => ({ ...prev, [index]: false }));
  };

  if (!images || images.length === 0) {
    return (
      <div className="px-6 md:px-8 pt-6 pb-4">
        <h4 className="text-[14px] font-bold text-neutral-900 mb-3">Bus Photos</h4>
        <div className="flex gap-4">
          <div className="w-[180px] md:w-[200px] h-[110px] md:h-[120px] bg-[#F5F0E8] rounded-xl border-2 border-[#D94328]/30 flex flex-col items-center justify-center text-[#5D4B3B]/60 text-xs gap-1.5 p-3 text-center">
            <Bus className="w-6 h-6 text-[#5D4B3B]/40" />
            <span>No exterior photo</span>
          </div>
          <div className="w-[180px] md:w-[200px] h-[110px] md:h-[120px] bg-[#F5F0E8] rounded-xl border-2 border-[#D94328]/30 flex flex-col items-center justify-center text-[#5D4B3B]/60 text-xs gap-1.5 p-3 text-center">
            <Bus className="w-6 h-6 text-[#5D4B3B]/40" />
            <span>No interior photo</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 md:px-8 pt-6 pb-4">
        <h4 className="text-[14px] font-bold text-neutral-900 mb-3">Bus Photos</h4>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img: string, i: number) => {
            const hasFailed = failedImages[i];
            const isLoading = loadingImages[i] !== false && !hasFailed;

            return (
              <div
                key={i}
                className="relative w-[180px] md:w-[200px] h-[110px] md:h-[120px] shrink-0 rounded-xl overflow-hidden border-2 border-[#D94328]/40 bg-[#F5F0E8]"
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-[#EAD8BE]/60 animate-pulse flex items-center justify-center">
                    <Bus className="w-6 h-6 text-[#5D4B3B]/30 animate-pulse" />
                  </div>
                )}

                {hasFailed ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#5D4B3B]/60 text-xs gap-1.5 p-2 text-center bg-[#F5F0E8]">
                    <Bus className="w-6 h-6 text-[#5D4B3B]/40" />
                    <span>Photo unavailable</span>
                  </div>
                ) : (
                  <img
                    src={img}
                    alt={`Bus photo ${i + 1}`}
                    onLoad={() => handleImageLoad(i)}
                    onError={() => handleImageError(i)}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => setLightboxState({ isOpen: true, index: i })}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ImageLightbox
        isOpen={lightboxState.isOpen}
        onClose={() => setLightboxState({ isOpen: false, index: 0 })}
        images={images}
        initialIndex={lightboxState.index}
      />
    </>
  );
}
