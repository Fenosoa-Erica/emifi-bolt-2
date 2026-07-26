import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Heart,
  Shuffle, Repeat, Volume2, VolumeX, List, ChevronDown, Loader2,
} from 'lucide-react';
import assetManifest from 'virtual:emifi-assets';

interface PlayerSong {
  id: string;
  title: string;
  album: string;
  duration: string;
  coverUrl: string;
  src: string;
}

const songs: PlayerSong[] = assetManifest.songs.map((s) => ({
  id: s.id,
  title: s.name,
  album: 'EMIFI',
  duration: '—:—',
  coverUrl: '/assets/images/bg.jpg',
  src: s.src,
}));

export default function AudioPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showPlaylist, setShowPlaylist] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Keep refs for stale-closure-free event handlers
  const shuffleRef = useRef(shuffle);
  const repeatRef  = useRef(repeat);
  const indexRef   = useRef(currentIndex);
  const playingRef = useRef(isPlaying);

  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);
  useEffect(() => { repeatRef.current  = repeat;  }, [repeat]);
  useEffect(() => { indexRef.current   = currentIndex; }, [currentIndex]);
  useEffect(() => { playingRef.current = isPlaying; }, [isPlaying]);

  // ── Init audio element once ──────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.volume = 1;
    audioRef.current = audio;

    const onTime     = () => setCurrentTime(audio.currentTime);
    const onMeta     = () => setDuration(isNaN(audio.duration) ? 0 : audio.duration);
    const onWaiting  = () => setIsLoading(true);
    const onCanPlay  = () => setIsLoading(false);
    const onEnded    = () => {
      if (repeatRef.current) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      const next = shuffleRef.current
        ? Math.floor(Math.random() * songs.length)
        : (indexRef.current + 1) % songs.length;
      goToTrack(next, true);
    };

    audio.addEventListener('timeupdate',     onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('durationchange', onMeta);
    audio.addEventListener('waiting',        onWaiting);
    audio.addEventListener('canplay',        onCanPlay);
    audio.addEventListener('canplaythrough', onCanPlay);
    audio.addEventListener('ended',          onEnded);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate',     onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('durationchange', onMeta);
      audio.removeEventListener('waiting',        onWaiting);
      audio.removeEventListener('canplay',        onCanPlay);
      audio.removeEventListener('canplaythrough', onCanPlay);
      audio.removeEventListener('ended',          onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load and optionally play a track ─────────────────────────────────────
  const goToTrack = useCallback((index: number, play: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src  = songs[index].src;
    audio.load();
    setCurrentIndex(index);
    indexRef.current = index;
    setCurrentTime(0);
    setDuration(0);
    if (play) {
      const p = audio.play();
      if (p) p.catch(() => {});
      setIsPlaying(true);
      playingRef.current = true;
    } else {
      setIsPlaying(false);
      playingRef.current = false;
    }
  }, []);

  // ── Volume & mute ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  // ── Controls ──────────────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.src) {
      goToTrack(indexRef.current, true);
      return;
    }
    if (playingRef.current) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [goToTrack]);

  const handlePrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const prev = (indexRef.current - 1 + songs.length) % songs.length;
    goToTrack(prev, playingRef.current);
  }, [goToTrack]);

  const handleNext = useCallback(() => {
    const next = shuffleRef.current
      ? Math.floor(Math.random() * songs.length)
      : (indexRef.current + 1) % songs.length;
    goToTrack(next, playingRef.current);
  }, [goToTrack]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
    setCurrentTime(audio.currentTime);
  }, []);

  const toggleFav = (id: string) =>
    setFavorites(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const fmt = (s: number) => {
    if (!s || isNaN(s) || !isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sc = Math.floor(s % 60);
    return `${m}:${sc.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const current  = songs[currentIndex];

  return (
    <motion.div
      className="relative w-full max-w-sm mx-auto"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {/* Glow */}
      <div className="absolute -inset-4 bg-sky-400/20 rounded-3xl blur-2xl pointer-events-none" />

      <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-2xl bg-white/10">
        {/* Cover artwork */}
        <div className="relative h-52 overflow-hidden">
          <img src={current.coverUrl} alt={current.title}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/70" />

          {/* Song info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base leading-tight truncate">{current.title}</h3>
              <p className="text-white/70 text-xs mt-0.5">{current.album}</p>
            </div>
            <motion.button onClick={() => toggleFav(current.id)} whileTap={{ scale: 0.85 }} className="p-2 ml-2">
              <Heart size={18}
                className={favorites.has(current.id) ? 'fill-red-400 text-red-400' : 'text-white/60'} />
            </motion.button>
          </div>

          {/* Loading spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Loader2 size={28} className="text-sky-300 animate-spin" />
            </div>
          )}
        </div>

        {/* Player body */}
        <div className="px-5 py-4 space-y-3">
          {/* Progress bar */}
          <div>
            <div
              className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group"
              onClick={handleSeek}
            >
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-400 to-sky-300 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-white/55 text-xs mt-1.5 tabular-nums">
              <span>{fmt(currentTime)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => setShuffle(s => !s)} whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full transition-colors ${shuffle ? 'text-sky-400' : 'text-white/50 hover:text-white/80'}`}
            >
              <Shuffle size={15} />
            </motion.button>

            <motion.button
              onClick={handlePrev} whileTap={{ scale: 0.9 }}
              className="p-2 text-white/80 hover:text-white transition-colors"
            >
              <SkipBack size={22} />
            </motion.button>

            <motion.button
              onClick={togglePlay} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.06 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-glow"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isPlaying ? 'pause' : 'play'}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.12 }}
                >
                  {isPlaying
                    ? <Pause size={20} className="text-white" />
                    : <Play  size={20} className="text-white ml-0.5" />
                  }
                </motion.div>
              </AnimatePresence>
            </motion.button>

            <motion.button
              onClick={handleNext} whileTap={{ scale: 0.9 }}
              className="p-2 text-white/80 hover:text-white transition-colors"
            >
              <SkipForward size={22} />
            </motion.button>

            <motion.button
              onClick={() => setRepeat(r => !r)} whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full transition-colors ${repeat ? 'text-sky-400' : 'text-white/50 hover:text-white/80'}`}
            >
              <Repeat size={15} />
            </motion.button>
          </div>

          {/* Volume + playlist toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setMuted(m => !m)} whileTap={{ scale: 0.9 }}
                className="text-white/50 hover:text-white/80 transition-colors"
              >
                {muted || volume === 0
                  ? <VolumeX size={14} />
                  : <Volume2 size={14} />
                }
              </motion.button>
              <div
                className="w-16 h-1.5 bg-white/20 rounded-full cursor-pointer group relative"
                onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const v = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  setVolume(v);
                  setMuted(false);
                }}
              >
                <div
                  className="h-full bg-sky-400/70 rounded-full"
                  style={{ width: `${muted ? 0 : volume * 100}%` }}
                />
              </div>
            </div>

            <motion.button
              onClick={() => setShowPlaylist(p => !p)} whileTap={{ scale: 0.9 }}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-colors ${showPlaylist ? 'bg-sky-400/20 text-sky-300' : 'text-white/50 hover:text-white/80'}`}
            >
              <List size={13} />
              <span>Liste</span>
              <ChevronDown size={12} className={`transition-transform ${showPlaylist ? 'rotate-180' : ''}`} />
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
                <div className="pt-2 space-y-0.5 max-h-44 overflow-y-auto no-scrollbar">
                  {songs.map((song, i) => (
                    <motion.button
                      key={song.id}
                      onClick={() => goToTrack(i, true)}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition-colors ${
                        i === currentIndex
                          ? 'bg-sky-400/20 text-sky-300'
                          : 'text-white/60 hover:bg-white/10 hover:text-white/90'
                      }`}
                    >
                      {i === currentIndex && isPlaying ? (
                        <span className="flex gap-0.5 items-end w-4 h-4 flex-shrink-0">
                          {[1, 3, 2].map(h => (
                            <span key={h} className="w-1 bg-sky-400 rounded-sm animate-pulse" style={{ height: `${h * 4}px` }} />
                          ))}
                        </span>
                      ) : (
                        <span className="text-xs w-4 text-center opacity-40 flex-shrink-0">{i + 1}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{song.title}</p>
                        <p className="text-xs opacity-45 truncate">{song.album}</p>
                      </div>
                      <span className="text-xs opacity-35 flex-shrink-0 tabular-nums">{song.duration}</span>
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
