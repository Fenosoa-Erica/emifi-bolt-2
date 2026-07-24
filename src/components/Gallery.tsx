import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, Camera } from 'lucide-react';
import { galleryImages } from '@/data';

interface LightboxProps {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ index, onClose, onPrev, onNext }: LightboxProps) {
  const image = galleryImages[index];

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onKeyDown={handleKey}
      tabIndex={0}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Image */}
      <motion.div
        className="relative z-10 max-w-5xl w-full mx-4"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <img
          src={image.src}
          alt={image.alt}
          className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
        />

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 p-6 rounded-b-2xl bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white font-semibold">{image.alt}</p>
          <p className="text-white/70 text-sm">{image.description}</p>
        </div>

        {/* Counter */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
          {index + 1} / {galleryImages.length}
        </div>
      </motion.div>

      {/* Close */}
      <motion.button
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Fermer"
      >
        <X size={18} />
      </motion.button>

      {/* Prev */}
      <motion.button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        onClick={onPrev}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Précédente"
      >
        <ChevronLeft size={22} />
      </motion.button>

      {/* Next */}
      <motion.button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        onClick={onNext}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Suivante"
      >
        <ChevronRight size={22} />
      </motion.button>
    </motion.div>
  );
}

// 3-4-3 masonry layout
const rows: number[][] = [
  [0, 1, 2],
  [3, 4, 5, 6],
  [7, 8, 9],
];

const colSpanClass = (index: number, rowIndex: number): string => {
  if (rowIndex === 0) {
    if (index === 0) return 'col-span-2 row-span-2';
    return 'col-span-1';
  }
  if (rowIndex === 1) {
    if (index === 0) return 'col-span-2';
    return 'col-span-1';
  }
  if (rowIndex === 2) {
    if (index === 1) return 'col-span-2';
    return 'col-span-1';
  }
  return 'col-span-1';
};

function GalleryItem({ image, globalIndex, onOpen }: {
  image: typeof galleryImages[0];
  globalIndex: number;
  onOpen: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: globalIndex * 0.07 }}
      className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-sky-500/15 transition-all duration-500"
      onClick={() => onOpen(globalIndex)}
    >
      <div className="relative w-full h-full min-h-[160px]">
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Description glassmorphism */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 glass border-0 border-t border-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-400"
        >
          <p className="text-white text-xs font-semibold truncate">{image.alt}</p>
          <p className="text-white/70 text-xs truncate">{image.description}</p>
        </motion.div>

        {/* Zoom icon */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ZoomIn size={14} className="text-white" />
        </div>

        {/* View button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ZoomIn size={13} />
            Voir
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true });

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex(i => i !== null ? (i - 1 + galleryImages.length) % galleryImages.length : 0);
  const nextImage = () => setLightboxIndex(i => i !== null ? (i + 1) % galleryImages.length : 0);

  // Build flat list tracking global indices per row
  let globalCounter = 0;
  const rowItems = rows.map(row => row.map(() => globalCounter++));
  // Reset
  globalCounter = 0;

  return (
    <section id="galerie" className="relative overflow-hidden" aria-label="Galerie photos">
      <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-navy-900 via-sky-50/20 dark:via-navy-800/30 to-white dark:to-navy-900 pointer-events-none" />

      <div className="relative z-10 container-max section-padding">
        {/* Header */}
        <motion.div
          ref={titleRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-semibold tracking-widest uppercase mb-4">
            <Camera size={12} />
            Photos
          </span>
          <h2 className="section-title text-slate-900 dark:text-white mb-4">
            Notre{' '}
            <span className="text-gradient">galerie</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Instants capturés de la vie d'EMIFI — prestations, répétitions et moments de partage.
          </p>
        </motion.div>

        {/* Masonry Gallery */}
        <div className="space-y-3">
          {/* Row 1 — 3 images: wide + 2 stacked */}
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((imgIdx, i) => (
              <div
                key={imgIdx}
                className={i === 0 ? 'col-span-1 row-span-2' : 'col-span-1'}
                style={{ height: i === 0 ? '400px' : '190px' }}
              >
                <div className="h-full">
                  <GalleryItem image={galleryImages[imgIdx]} globalIndex={imgIdx} onOpen={openLightbox} />
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 — 4 images: wide + 3 equal */}
          <div className="grid grid-cols-4 gap-3" style={{ height: '260px' }}>
            {[3, 4, 5, 6].map((imgIdx, i) => (
              <div key={imgIdx} className={i === 0 ? 'col-span-2 h-full' : 'col-span-1 h-full'}>
                <GalleryItem image={galleryImages[imgIdx]} globalIndex={imgIdx} onOpen={openLightbox} />
              </div>
            ))}
          </div>

          {/* Row 3 — 3 images: 2 equal + wide */}
          <div className="grid grid-cols-3 gap-3" style={{ height: '240px' }}>
            {[7, 8, 9].map((imgIdx, i) => (
              <div key={imgIdx} className={i === 2 ? 'col-span-2 h-full' : 'col-span-1 h-full'}>
                <GalleryItem image={galleryImages[imgIdx]} globalIndex={imgIdx} onOpen={openLightbox} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
