import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, Camera } from 'lucide-react';
import { galleryImages } from '@/data';

/* ─── Lightbox ──────────────────────────────────────────────────────────── */
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
      <motion.div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />

      <motion.div
        className="relative z-10 max-w-5xl w-full mx-4"
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: 'spring', damping: 22 }}
      >
        <img
          src={image.src}
          alt={image.alt}
          className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 rounded-b-2xl bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white font-semibold">{image.alt}</p>
          <p className="text-white/70 text-sm">{image.description}</p>
        </div>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
          {index + 1} / {galleryImages.length}
        </div>
      </motion.div>

      <motion.button
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        onClick={onClose} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Fermer"
      >
        <X size={18} />
      </motion.button>
      <motion.button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        onClick={onPrev} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Précédente"
      >
        <ChevronLeft size={22} />
      </motion.button>
      <motion.button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        onClick={onNext} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Suivante"
      >
        <ChevronRight size={22} />
      </motion.button>
    </motion.div>
  );
}

/* ─── Gallery item ──────────────────────────────────────────────────────── */
function GalleryItem({
  image, index, onOpen, className = '', style,
}: {
  image: typeof galleryImages[0];
  index: number;
  onOpen: (i: number) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className={`relative group cursor-pointer overflow-hidden rounded-2xl bg-slate-100 dark:bg-navy-700 ${className}`}
      style={style}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onClick={() => onOpen(index)}
      whileHover={{ scale: 1.01 }}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/40 transition-colors duration-300" />

      {/* View button — appears on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-white/20 dark:backdrop-blur-sm text-slate-800 dark:text-white text-xs font-semibold shadow-lg">
          <ZoomIn size={13} />
          Voir
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true });

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex(i => i !== null ? (i - 1 + galleryImages.length) % galleryImages.length : 0);
  const nextImage = () => setLightboxIndex(i => i !== null ? (i + 1) % galleryImages.length : 0);

  return (
    <section id="galerie" className="relative overflow-hidden bg-white dark:bg-navy-900" aria-label="Galerie photos">
      <div className="container-max z-10 section-padding ">
        {/* Header */}
        <motion.div
          ref={titleRef}
          className="mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-sky-500 dark:text-sky-400 text-xs font-bold tracking-widest uppercase mb-3">
            <Camera size={13} />
            Galerie
          </span>
          <h2 className="section-title text-slate-900 dark:text-white mb-3">
            Nos <span className="text-gradient">moments</span>
          </h2>
          <p className="section-subtitle max-w-lg">
            Prestations, répétitions et instants de partage capturés au fil des années.
          </p>
        </motion.div>

        {/* ── Row 1 : 1 big left + 1 tall right ─────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          {/* Big image — spans 2 cols */}
          <GalleryItem
            image={galleryImages[0]}
            index={0}
            onOpen={openLightbox}
            className="col-span-2"
            style={{ height: '340px' }}
          />
          {/* Tall right image */}
          <GalleryItem
            image={galleryImages[1]}
            index={1}
            onOpen={openLightbox}
            className="col-span-1"
            style={{ height: '340px' }}
          />
        </div>

        {/* ── Row 2 : 3 equal ────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[2, 3, 4].map((imgIdx, i) => (
            <GalleryItem
              key={imgIdx}
              image={galleryImages[imgIdx]}
              index={imgIdx}
              onOpen={openLightbox}
              style={{ height: '220px' }}
            />
          ))}
        </div>

        {/* ── Row 3 : 1 left + 1 big right ──────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <GalleryItem
            image={galleryImages[5]}
            index={5}
            onOpen={openLightbox}
            className="col-span-1"
            style={{ height: '280px' }}
          />
          <GalleryItem
            image={galleryImages[6]}
            index={6}
            onOpen={openLightbox}
            className="col-span-2"
            style={{ height: '280px' }}
          />
        </div>

        {/* ── Row 4 : 4 equal small ──────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3">
          {[7, 8, 9, 0].map((imgIdx, i) => (
            <GalleryItem
              key={`r4-${imgIdx}`}
              image={galleryImages[imgIdx]}
              index={imgIdx}
              onOpen={openLightbox}
              style={{ height: '160px' }}
            />
          ))}
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
