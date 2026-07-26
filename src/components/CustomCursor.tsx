import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const trailX = useSpring(x, { damping: 22, stiffness: 280 });
  const trailY = useSpring(y, { damping: 22, stiffness: 280 });
  const isDown = useRef(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const down = () => { isDown.current = true; };
    const up   = () => { isDown.current = false; };
    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup',   up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup',   up);
    };
  }, [x, y]);

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-9 h-9 rounded-full border border-sky-400/60 -translate-x-1/2 -translate-y-1/2"
        style={{ x: trailX, y: trailY }}
      />
      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full bg-sky-400 -translate-x-1/2 -translate-y-1/2"
        style={{ x, y }}
      />
    </>
  );
}
