import { motion } from 'framer-motion';
import { ChevronDown, Users, Music } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';

const stats = [
  { icon: Users, value: '+40', label: 'Membres actifs' },
  { icon: Music, value: '+100', label: 'Anciens membres' },
];

const Particle = ({ x, y, delay }: { x: number; y: number; delay: number }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-sky-400/60"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{ y: [-10, 10, -10], opacity: [0.3, 0.8, 0.3] }}
    transition={{ duration: 4 + delay, repeat: Infinity, delay }}
  />
);

const particles = [
  { x: 10, y: 20 }, { x: 85, y: 15 }, { x: 70, y: 70 }, { x: 25, y: 80 },
  { x: 50, y: 10 }, { x: 90, y: 50 }, { x: 15, y: 55 }, { x: 60, y: 90 },
];

export default function Hero() {
  const scrollToAbout = () => {
    document.querySelector('#apropos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Section d'accueil"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/bg.jpg"
          alt="EMIFI Chorale"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Overlay layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/70 to-navy-900/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/30 via-transparent to-navy-900/80" />
        {/* Sky blue accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sky-900/20 to-transparent" />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {particles.map((p, i) => (
          <Particle key={i} x={p.x} y={p.y} delay={i * 0.5} />
        ))}
        {/* Abstract circles */}
        <motion.div
          className="absolute top-1/4 right-1/3 w-64 h-64 rounded-full border border-sky-400/10"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full border border-sky-400/5"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container-max section-padding w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-sky-400/30 text-sky-300 text-xs font-medium tracking-widest uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              Chorale Universitaire
            </motion.div>

            {/* Title */}
            <div className="space-y-1">
              <motion.h1
                className="font-signature text-[7rem] sm:text-[9rem] lg:text-[15rem] text-white leading-none select-none"
                style={{
                  textShadow: '0 0 70px rgba(14,165,233,0.45), 0 3px 24px rgba(0,0,0,0.45)',
                }}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                Emifi
              </motion.h1>
              <motion.p
                className="text-sky-300 text-sm sm:text-base font-semibold tracking-[0.28em] uppercase font-sans"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
              >
                Emit Mikalo Fiderana
              </motion.p>
              <motion.p
                className="text-white/50 text-sm font-sans font-normal"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                EMIT – Université de Fianarantsoa, Madagascar
              </motion.p>
            </div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3 glass rounded-2xl px-5 py-3.5 border border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-sky-400/20 flex items-center justify-center">
                    <Icon size={16} className="text-sky-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg leading-none">{value}</div>
                    <div className="text-white/50 text-xs mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
            >
              <motion.button
                onClick={scrollToAbout}
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Découvrir la chorale
              </motion.button>
            </motion.div>
          </div>

          {/* Right column — Audio Player */}
          <div className="flex justify-center lg:justify-end">
            <AudioPlayer />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label="Défiler vers le bas"
      >
        <span className="text-xs font-light tracking-widest uppercase">Découvrir</span>
        <ChevronDown size={20} />
      </motion.button>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 80L60 66.7C120 53.3 240 26.7 360 20C480 13.3 600 26.7 720 33.3C840 40 960 40 1080 36.7C1200 33.3 1320 26.7 1380 23.3L1440 20V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
            className="fill-white dark:fill-navy-900"
          />
        </svg>
      </div>
    </section>
  );
}
