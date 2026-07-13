import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import ShowcaseLayout from '../components/ShowcaseLayout';
import { GALLERY_IMAGES } from '../lib/gallery';

const GalleryPage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length));
  }, []);
  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % GALLERY_IMAGES.length));
  }, []);

  useEffect(() => {
    document.title = 'Gallery — Youth Innovators Hub';
  }, []);

  useEffect(() => {
    if (activeIndex === null) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeIndex, close, goPrev, goNext]);

  const active = activeIndex !== null ? GALLERY_IMAGES[activeIndex] : null;

  return (
    <ShowcaseLayout>
      <section className="px-5 md:px-8 lg:px-16 pt-12 md:pt-16 pb-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-accent text-sm font-semibold tracking-wide mb-3">Gallery</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Moments from the Hub
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mb-12">
            Game Jam, workshops, and community gatherings — real rooms, real builders across Rwanda.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {GALLERY_IMAGES.map((image, index) => (
              <motion.button
                key={image.id}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                onClick={() => setActiveIndex(index)}
                className="photo-frame rounded-sm overflow-hidden text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={`View ${image.alt}`}
              >
                <div className="overflow-hidden aspect-[4/3]">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {image.caption && (
                  <p className="px-3 py-2 text-sm text-navy/80 font-semibold bg-paper">
                    {image.caption}
                  </p>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {active && activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Image gallery lightbox"
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 z-10 w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-accent transition-colors"
              aria-label="Close gallery"
            >
              <X size={22} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-2 md:left-6 z-10 w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-accent transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-2 md:right-6 z-10 w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-accent transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={active.src}
                alt={active.alt}
                className="w-full max-h-[75vh] object-contain rounded-lg"
              />
              <p className="mt-4 text-center text-white/80 text-sm md:text-base">
                {active.caption ?? active.alt}
              </p>
              <p className="mt-1 text-center text-white/40 text-xs">
                {activeIndex + 1} / {GALLERY_IMAGES.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ShowcaseLayout>
  );
};

export default GalleryPage;
