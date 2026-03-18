import type { GalleryImage } from "@/types/website";
import { useState } from "react";

interface GalleryProps {
  data: GalleryImage[];
}

export default function Gallery({ data }: GalleryProps) {
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  if (!data || data.length === 0) return null;

  return (
    <section className="w-full py-20 bg-background">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">
          Gallery
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((image, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl cursor-pointer"
              style={{ aspectRatio: "3/2" }}
              onClick={() => setLightbox(image)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {image.caption && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm flex items-center gap-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Close
            </button>
            <img
              src={lightbox.url}
              alt={lightbox.alt}
              className="w-full rounded-xl"
            />
            {lightbox.caption && (
              <p className="text-white/70 text-sm text-center mt-3">
                {lightbox.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}