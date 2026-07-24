import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Music, Calendar, ChevronDown, ChevronUp, Play, ExternalLink, Youtube, Facebook } from 'lucide-react';
import { albums, clips } from '@/data';

function AlbumCard({ album, index }: { album: typeof albums[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative rounded-3xl overflow-hidden bg-white dark:bg-navy-800 border border-slate-100 dark:border-navy-700 shadow-lg hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500"
    >
      {/* Cover */}
      <div className="relative overflow-hidden h-56">
        <img
          src={album.coverUrl}
          alt={album.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Hover play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <Play size={22} className="text-white ml-1" />
          </motion.div>
        </div>
        {/* Year badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold">
          {album.year}
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg leading-tight">{album.title}</h3>
            <div className="flex items-center gap-3 mt-1.5 text-slate-500 dark:text-slate-400 text-xs">
              <span className="flex items-center gap-1"><Calendar size={11} /> {album.year}</span>
              <span className="flex items-center gap-1"><Music size={11} /> {album.songsCount} chansons</span>
            </div>
          </div>
        </div>

        {/* Expand button */}
        <motion.button
          onClick={() => setExpanded(e => !e)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 text-xs font-semibold hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors"
        >
          <span>Voir les chansons</span>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown size={14} />
          </motion.div>
        </motion.button>

        {/* Songs list */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-1">
                {album.songs.map((song, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-navy-700/50 transition-colors group/song"
                  >
                    <span className="text-slate-400 text-xs w-4">{i + 1}</span>
                    <span className="text-slate-700 dark:text-slate-300 text-xs flex-1 truncate">{song}</span>
                    <Play size={11} className="text-sky-400 opacity-0 group-hover/song:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ClipCard({ clip, index }: { clip: typeof clips[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex gap-4 p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-100 dark:border-navy-700 shadow-md hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-400 items-center"
    >
      {/* Thumbnail */}
      <div className="relative w-28 h-20 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={clip.thumbnailUrl}
          alt={clip.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play size={14} className="text-white ml-0.5" />
          </div>
        </div>
        {/* Platform badge */}
        <div className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-white text-xs font-bold ${clip.platform === 'youtube' ? 'bg-red-600' : 'bg-blue-700'}`}>
          {clip.platform === 'youtube' ? 'YT' : 'FB'}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight truncate">{clip.title}</h4>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{clip.album}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          {clip.platform === 'youtube'
            ? <Youtube size={12} className="text-red-500" />
            : <Facebook size={12} className="text-blue-600" />
          }
          <span className="text-slate-400 text-xs capitalize">{clip.platform}</span>
        </div>
      </div>

      {/* Watch button */}
      <motion.a
        href={clip.url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 text-xs font-semibold hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors flex-shrink-0"
      >
        <span>Regarder</span>
        <ExternalLink size={11} />
      </motion.a>
    </motion.div>
  );
}

export default function Realisations() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <section
      id="realisations"
      className="relative overflow-hidden bg-slate-50 dark:bg-navy-800/50"
      aria-label="Nos réalisations"
    >
      {/* Background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-sky-100/60 dark:bg-sky-900/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-sky-50/80 dark:bg-navy-700/20 blur-3xl" />
      </div>

      <div className="relative z-10 container-max section-padding">
        {/* Header */}
        <motion.div
          ref={titleRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Discographie & Médias
          </span>
          <h2 className="section-title text-slate-900 dark:text-white mb-4">
            Nos{' '}
            <span className="text-gradient">réalisations</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Albums enregistrés, clips officiels et prestations mémorables.
          </p>
        </motion.div>

        {/* Albums */}
        <div className="mb-16">
          <motion.h3
            className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
              <Music size={16} className="text-white" />
            </div>
            Albums
          </motion.h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album, i) => (
              <AlbumCard key={album.id} album={album} index={i} />
            ))}
          </div>
        </div>

        {/* Clips */}
        <div>
          <motion.h3
            className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
              <Play size={16} className="text-white" />
            </div>
            Clips officiels
          </motion.h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {clips.map((clip, i) => (
              <ClipCard key={clip.id} clip={clip} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Top wave */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 60" className="w-full" fill="none">
          <path
            d="M0 60L60 50C120 40 240 20 360 16.7C480 13.3 600 26.7 720 30C840 33.3 960 26.7 1080 23.3C1200 20 1320 20 1380 20L1440 20V0H0V60Z"
            className="fill-white dark:fill-navy-900"
          />
        </svg>
      </div>
    </section>
  );
}
