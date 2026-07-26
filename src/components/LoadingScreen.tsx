import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BAR_COUNT = 5;

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const total = 2200;
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / total) * 100));
      setProgress(p);
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(() => setVisible(false), 280);
      }
    }, 16);
    return () => clearInterval(tick);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0a1224 0%, #0c1f3a 50%, #071630 100%)' }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Floating music notes background */}
          {floatingNotes.map((n, i) => (
            <motion.div
              key={i}
              className="absolute text-sky-400/20 select-none pointer-events-none"
              style={{ left: `${n.x}%`, top: `${n.y}%`, fontSize: `${n.size}px` }}
              animate={{ y: [-12, 12, -12], rotate: [0, n.rot, 0], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: n.dur, repeat: Infinity, delay: n.delay, ease: 'easeInOut' }}
            >
              {n.glyph}
            </motion.div>
          ))}

          {/* Glow blob */}
          <div className="absolute w-80 h-80 rounded-full bg-sky-500/10 blur-3xl" />

          {/* Main card */}
          <motion.div
            className="relative flex flex-col items-center gap-6 px-10 py-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Audio visualizer bars */}
            <div className="flex items-end gap-1.5 h-10">
              {Array.from({ length: BAR_COUNT }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 rounded-full bg-gradient-to-t from-sky-500 to-sky-300"
                  animate={{ height: ['8px', `${20 + i * 6}px`, '8px', `${14 + i * 4}px`, '8px'] }}
                  transition={{ duration: 0.8 + i * 0.12, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
                />
              ))}
            </div>

            {/* Choir name */}
            <div className="text-center">
              <motion.h1
                className="font-signature text-[5.5rem] sm:text-[7rem] text-white leading-none"
                style={{ textShadow: '0 0 60px rgba(14,165,233,0.5)' }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Emifi
              </motion.h1>
              <motion.p
                className="text-sky-300 text-xs font-semibold tracking-[0.32em] uppercase font-sans mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                Emit Mikalo Fiderana
              </motion.p>
              <motion.p
                className="text-white/40 text-xs font-sans mt-1.5 tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
              >
                Chorale EMIT Université de Fianaratsoa · Madagascar
              </motion.p>
            </div>

            {/* Progress bar */}
            <motion.div
              className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-sky-500 to-sky-300 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const floatingNotes = [
  { x: 8,  y: 15, size: 28, rot: 15,  dur: 5.2, delay: 0,    glyph: '♩' },
  { x: 88, y: 10, size: 22, rot: -20, dur: 4.8, delay: 0.4,  glyph: '♪' },
  { x: 75, y: 75, size: 32, rot: 10,  dur: 6.1, delay: 0.9,  glyph: '♫' },
  { x: 18, y: 80, size: 20, rot: -12, dur: 4.4, delay: 1.2,  glyph: '♬' },
  { x: 50, y: 5,  size: 26, rot: 18,  dur: 5.7, delay: 0.3,  glyph: '𝄞' },
  { x: 92, y: 55, size: 24, rot: -8,  dur: 5.0, delay: 1.5,  glyph: '♩' },
  { x: 12, y: 50, size: 30, rot: 22,  dur: 6.3, delay: 0.7,  glyph: '♫' },
  { x: 60, y: 88, size: 18, rot: -15, dur: 4.6, delay: 2.0,  glyph: '♪' },
  { x: 35, y: 20, size: 22, rot: 8,   dur: 5.4, delay: 1.8,  glyph: '♬' },
];
