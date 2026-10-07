"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Camera
} from "lucide-react";
import { getLuxuryShimmerPlaceholder } from "@/lib/data/vehicles-service";

interface ImageGalleryProps {
  imageUrls: string[];
  vehicleTitle: string;
  initialIndex?: number;
}

export function ImageGallery({
  imageUrls,
  vehicleTitle,
  initialIndex = 0,
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(
    initialIndex >= 0 && initialIndex < imageUrls.length ? initialIndex : 0
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : imageUrls.length - 1));
      }
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev < imageUrls.length - 1 ? prev + 1 : 0));
      }
    },
    [lightboxOpen, imageUrls.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const activeImage = imageUrls[activeIndex] || imageUrls[0] || "/placeholder-car.jpg";

  const nextImage = () => {
    setActiveIndex((prev) => (prev < imageUrls.length - 1 ? prev + 1 : 0));
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : imageUrls.length - 1));
  };

  return (
    <>
      <div className="space-y-3">
        {/* Main Hero Image */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#050505] border border-[rgba(237,232,223,0.1)] shadow-2xl group">
          <Image
            src={activeImage}
            alt={`${vehicleTitle} - Exhibit View ${activeIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
            placeholder="blur"
            blurDataURL={getLuxuryShimmerPlaceholder(1000, 625)}
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* Navigation Arrows on Hero */}
          {imageUrls.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="pointer-events-auto p-2.5 bg-black/70 hover:bg-[#c5a880] hover:text-[#09090a] text-[#ede8df] border border-white/10 transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                aria-label="Previous photograph"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="pointer-events-auto p-2.5 bg-black/70 hover:bg-[#c5a880] hover:text-[#09090a] text-[#ede8df] border border-white/10 transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                aria-label="Next photograph"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Top Left: Atelier Photo Badge */}
          <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-black/70 border border-[#c5a880]/30 text-[#c5a880] text-[10px] font-mono uppercase tracking-[0.2em]">
            <Camera className="w-3 h-3 text-[#c5a880]" />
            <span>High-Res Exhibition Photographic Dossier</span>
          </div>

          {/* Bottom Controls: Counter and Lightbox Expand Button */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between font-mono text-[10px]">
            <span className="px-2.5 py-1 bg-black/70 border border-white/10 text-[#ede8df] tracking-widest uppercase">
              ANGLE {String(activeIndex + 1).padStart(2, "0")} / {String(imageUrls.length).padStart(2, "0")}
            </span>

            <button
              onClick={() => setLightboxOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-black/70 hover:bg-[#121214] border border-white/15 hover:border-[#c5a880]/50 text-[#ede8df] transition-colors"
              aria-label="Open Fullscreen Lightbox"
            >
              <Maximize2 className="w-3 h-3 text-[#c5a880]" />
              <span className="hidden sm:inline uppercase tracking-wider text-[10px]">Fullscreen Lightbox</span>
            </button>
          </div>
        </div>

        {/* Thumbnail Navigation Strip */}
        {imageUrls.length > 1 && (
          <div 
            className="flex items-center gap-2.5 overflow-x-auto pb-1"
            aria-label="Gallery thumbnails"
          >
            {imageUrls.map((url, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden border transition-all duration-300 ${
                    isActive
                      ? "border-[#c5a880] shadow-md shadow-[#c5a880]/20"
                      : "border-[rgba(237,232,223,0.1)] opacity-50 hover:opacity-100 hover:border-white/30"
                  }`}
                  aria-label={`Select photo ${idx + 1}`}
                >
                  <Image
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={getLuxuryShimmerPlaceholder(96, 64)}
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-[#c5a880]/10 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-[#ede8df] z-10 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c5a880]">
                EXHIBITION LIGHTBOX
              </span>
              <h3 className="font-serif text-lg tracking-tight">{vehicleTitle}</h3>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-[#a39e93] tracking-widest">
                {activeIndex + 1} / {imageUrls.length}
              </span>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-2 border border-white/20 text-[#ede8df] hover:bg-[#c5a880] hover:text-[#09090a] transition-colors"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Stage */}
          <div className="relative flex-1 my-4 flex items-center justify-center">
            <div className="relative w-full h-full max-w-6xl max-h-[80vh]">
              <Image
                src={activeImage}
                alt={`${vehicleTitle} - Lightbox View`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Left/Right Lightbox Controls */}
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-6 p-3 bg-black/80 hover:bg-[#c5a880] hover:text-[#09090a] text-[#ede8df] border border-white/10 transition-colors shadow-2xl"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-6 p-3 bg-black/80 hover:bg-[#c5a880] hover:text-[#09090a] text-[#ede8df] border border-white/10 transition-colors shadow-2xl"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Footer Thumbnails */}
          <div className="flex justify-center gap-2 overflow-x-auto py-2 z-10 border-t border-white/10">
            {imageUrls.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative w-16 h-10 shrink-0 border overflow-hidden transition-all ${
                  idx === activeIndex
                    ? "border-[#c5a880] opacity-100"
                    : "border-white/10 opacity-40 hover:opacity-80"
                }`}
              >
                <Image src={url} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
