import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Heart,
  Shuffle, Repeat, Volume2, List, ChevronDown,
} from 'lucide-react';
import { songs } from '@/data';

export default function AudioPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = songs[currentIndex];

  const tick = useCallback(() => {
    setProgress(p => {
      if (p >= 100) {
        if (repeat) return 0;
        setCurrentIndex(i => (i + 1) % songs.length);
        return 0;
      }
      return p + 100 / 240;
    });
  }, [repeat]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, tick]);

  const handlePrev = () => {
    setProgress(0);
    setCurrentIndex(i => (i - 1 + songs.length) % songs.length);
  };

  const handleNext = () => {
    setProgress(0);
    if (shuffle) {
      setCurrentIndex(Math.floor(Math.random() * songs.length));
    } else {
      setCurrentIndex(i => (i + 1) % songs.length);
    }
  };

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const formatTime = (pct: number, duration: string) => {
    const parts = duration.split(':');
    const total = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    const elapsed = Math.floor((pct / 100) * total);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="relative w-full max-w-sm mx-auto"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-sky-400/20 rounded-3xl blur-2xl" />

      <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-2xl bg-white/10">
        {/* Header */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={current.coverUrl}
            alt={current.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/70" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-white font-bold text-base leading-tight line-clamp-1">{current.title}</h3>
                <p className="text-white/70 text-xs mt-0.5">{current.album}</p>
              </div>
              <motion.button
                onClick={() => toggleFav(current.id)}
                whileTap={{ scale: 0.85 }}
                className="p-2"
              >
                <Heart
                  size={18}
                  className={favorites.has(current.id) ? 'fill-red-400 text-red-400' : 'text-white/70'}
                />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Player body */}
        <div className="px-5 py-4 space-y-3">
          {/* Progress */}
          <div>
            <div
              className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group"
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                setProgress(((e.clientX - rect.left) / rect.width) * 100);
              }}
            >
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-400 to-sky-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }}
              />
            </div>
            <div className="flex justify-between text-white/60 text-xs mt-1.5">
              <span>{formatTime(progress, current.duration)}</span>
              <span>{current.duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => setShuffle(s => !s)}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full transition-colors ${shuffle ? 'text-sky-400' : 'text-white/50 hover:text-white/80'}`}
            >
              <Shuffle size={15} />
            </motion.button>

            <motion.button
              onClick={handlePrev}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-white/80 hover:text-white transition-colors"
            >
              <SkipBack size={22} />
            </motion.button>

            <motion.button
              onClick={() => setIsPlaying(p => !p)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center shadow-glow"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isPlaying ? 'pause' : 'play'}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-0.5" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            <motion.button
              onClick={handleNext}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-white/80 hover:text-white transition-colors"
            >
              <SkipForward size={22} />
            </motion.button>

            <motion.button
              onClick={() => setRepeat(r => !r)}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full transition-colors ${repeat ? 'text-sky-400' : 'text-white/50 hover:text-white/80'}`}
            >
              <Repeat size={15} />
            </motion.button>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-white/50">
              <Volume2 size={13} />
              <div className="w-16 h-1 bg-white/20 rounded-full">
                <div className="h-full w-3/4 bg-sky-400/60 rounded-full" />
              </div>
            </div>
            <motion.button
              onClick={() => setShowPlaylist(p => !p)}
              whileTap={{ scale: 0.9 }}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors ${showPlaylist ? 'bg-sky-400/20 text-sky-300' : 'text-white/50 hover:text-white/80'}`}
            >
              <List size={13} />
              <span>Liste</span>
              <ChevronDown
                size={13}
                className={`transition-transform ${showPlaylist ? 'rotate-180' : ''}`}
              />
            </motion.button>
          </div>

          {/* Playlist */}
          <AnimatePresence>
            {showPlaylist && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-1 max-h-40 overflow-y-auto no-scrollbar">
                  {songs.map((song, i) => (
                    <motion.button
                      key={song.id}
                      onClick={() => { setCurrentIndex(i); setProgress(0); }}
                      className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-colors ${
                        i === currentIndex ? 'bg-sky-400/20 text-sky-300' : 'text-white/60 hover:bg-white/10 hover:text-white/90'
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-xs w-4 text-center opacity-50">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{song.title}</p>
                        <p className="text-xs opacity-50 truncate">{song.album}</p>
                      </div>
                      <span className="text-xs opacity-40 flex-shrink-0">{song.duration}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
