import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Search, Music2 } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useTheme } from '@/contexts/ThemeContext';
import { songs } from '@/data';

const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'À propos', href: '#apropos' },
  { label: 'Réalisations', href: '#realisations' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Contact', href: '#contact' },
];

/* ─── Lyrics Modal ──────────────────────────────────────────────────────── */
function LyricsModal({ songId, onClose }: { songId: string; onClose: () => void }) {
  const song = songs.find(s => s.id === songId);
  if (!song) return null;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 w-full max-w-lg max-h-[80vh] rounded-3xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-600 shadow-2xl overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-100 dark:border-navy-700 bg-gradient-to-r from-sky-50 to-white dark:from-navy-900 dark:to-navy-800">
          <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center flex-shrink-0">
            <Music2 size={18} className="text-sky-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-slate-900 dark:text-white font-bold text-base truncate">{song.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">{song.album}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors flex-shrink-0"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Lyrics */}
        <div className="overflow-y-auto flex-1 px-6 py-6">
          <pre className="font-sans text-sm text-slate-700 dark:text-slate-300 leading-7 whitespace-pre-wrap">
            {song.lyrics}
          </pre>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Search Bar ────────────────────────────────────────────────────────── */
function SearchBar({ isScrolled }: { isScrolled: boolean }) {
  const [query, setQuery]     = useState('');
  const [open, setOpen]       = useState(false);
  const [lyricsSong, setLyricsSong] = useState<string | null>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const results = query.trim().length > 0
    ? songs.filter(s => s.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const textColor = isScrolled
    ? 'text-slate-600 dark:text-slate-300 placeholder:text-slate-400'
    : 'text-white/90 placeholder:text-white/40';
  const borderColor = isScrolled
    ? 'border-slate-200 dark:border-navy-600 bg-slate-50 dark:bg-navy-800/80'
    : 'border-white/20 bg-white/10 backdrop-blur-sm';

  return (
    <>
      <div ref={wrapperRef} className="relative hidden lg:block">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300 ${borderColor}`}>
          <Search size={14} className={isScrolled ? 'text-slate-400' : 'text-white/60'} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Chercher une chanson..."
            className={`bg-transparent outline-none text-xs w-36 transition-all duration-300 focus:w-44 ${textColor}`}
            aria-label="Rechercher une chanson"
          />
          {query && (
            <button onClick={() => { setQuery(''); setOpen(false); }} className={`${isScrolled ? 'text-slate-400' : 'text-white/60'} hover:opacity-100`}>
              <X size={12} />
            </button>
          )}
        </div>

        {/* Dropdown results */}
        <AnimatePresence>
          {open && results.length > 0 && (
            <motion.div
              className="absolute top-full mt-2 left-0 w-64 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-600 shadow-xl overflow-hidden z-50"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              <div className="px-3 py-2 border-b border-slate-100 dark:border-navy-700">
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-widest uppercase">
                  {results.length} résultat{results.length > 1 ? 's' : ''}
                </p>
              </div>
              {results.map(song => (
                <button
                  key={song.id}
                  onClick={() => { setLyricsSong(song.id); setOpen(false); setQuery(''); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sky-50 dark:hover:bg-navy-700 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                    <Music2 size={13} className="text-sky-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-800 dark:text-white text-sm font-semibold truncate">{song.title}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs truncate">{song.album}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
          {open && query.trim().length > 0 && results.length === 0 && (
            <motion.div
              className="absolute top-full mt-2 left-0 w-64 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-600 shadow-xl p-4 z-50 text-center"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <p className="text-slate-400 dark:text-slate-500 text-sm">Aucun résultat pour « {query} »</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lyrics modal */}
      <AnimatePresence>
        {lyricsSong && (
          <LyricsModal songId={lyricsSong} onClose={() => setLyricsSong(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Navbar ────────────────────────────────────────────────────────────── */
export default function Navbar() {
  const scrollY    = useScrollPosition();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isScrolled = scrollY > 40;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/90 dark:bg-navy-900/90 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-white/5'
            : 'bg-transparent'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Logo */}
            <motion.a
              href="#accueil"
              onClick={e => { e.preventDefault(); handleNavClick('#accueil'); }}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0"
            >
              <img src="/assets/images/logo.png" alt="EMIFI" className="h-10 lg:h-12 w-auto object-contain" />
            </motion.a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={e => { e.preventDefault(); handleNavClick(link.href); }}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 group ${
                    isScrolled
                      ? 'text-slate-700 dark:text-slate-200 hover:text-sky-500 dark:hover:text-sky-400'
                      : 'text-white/90 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    isScrolled ? 'bg-sky-50 dark:bg-sky-900/30' : 'bg-white/10'
                  }`} />
                </motion.a>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Search bar — desktop only */}
              <SearchBar isScrolled={isScrolled} />

              {/* Theme toggle */}
              <motion.button
                onClick={toggleTheme}
                aria-label="Basculer le thème"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2.5 rounded-full transition-colors duration-200 ${
                  isScrolled
                    ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-700'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </motion.button>

              {/* Mobile menu button */}
              <motion.button
                className="lg:hidden p-2.5 rounded-full transition-colors duration-200"
                onClick={() => setMenuOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Ouvrir le menu"
              >
                <Menu size={22} className={isScrolled ? 'text-slate-700 dark:text-slate-200' : 'text-white'} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-[70] w-72 bg-white dark:bg-navy-900 shadow-2xl flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-navy-700">
                <img src="/assets/images/logo.png" alt="EMIFI" className="h-9 w-auto" />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={e => { e.preventDefault(); handleNavClick(link.href); }}
                    className="flex items-center px-4 py-3.5 rounded-xl text-slate-700 dark:text-slate-200 font-medium hover:bg-sky-50 dark:hover:bg-navy-700 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
              <div className="px-6 pb-8">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-navy-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors text-sm font-medium"
                >
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                  {theme === 'light' ? 'Mode sombre' : 'Mode clair'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
