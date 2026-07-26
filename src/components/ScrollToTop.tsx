import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Disc3 } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ScrollToTop() {
  const scrollY = useScrollPosition();
  const visible = scrollY > 400;
  const { t } = useLanguage();
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    document.querySelector('#accueil')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const player = document.querySelector('#audio-player');
      if (player) player.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label={t('scroll_listen')}
          className="fixed bottom-6 right-6 z-50 group flex flex-col items-center gap-1"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Tooltip */}
          <AnimatePresence>
            {hovered && (
              <motion.span
                className="absolute -top-8 right-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-white bg-navy-900/90 dark:bg-slate-800 px-2.5 py-1 rounded-full shadow-lg pointer-events-none"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
              >
                {t('scroll_listen')}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Disc button */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-sky-400 flex items-center justify-center shadow-glow">
            <Disc3
              size={22}
              className="text-white"
              style={{ animation: 'spin 3s linear infinite' }}
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
