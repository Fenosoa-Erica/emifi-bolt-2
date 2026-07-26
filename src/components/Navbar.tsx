import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Search, Music2, Loader2 } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useTheme } from '@/contexts/ThemeContext';
import assetManifest from 'virtual:emifi-assets';

const lyricsList = assetManifest.lyrics;

const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'À propos', href: '#apropos' },
  { label: 'Réalisations', href: '#realisations' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Contact', href: '#contact' },
];

/* ─── Lyrics Modal — fetches content from public/assets/lyrics/*.txt ──────── */
function LyricsModal({ lyricsId, onClose }: { lyricsId: string; onClose: () => void }) {
  const item = lyricsList.find(l => l.id === lyricsId);
  const [text, setText]       = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    if (!item) return;
    setLoading(true);
    setError(false);
    fetch(item.file)
      .then(r => {
        if (!r.ok) throw new Error('not found');
        return r.text();
      })
      .then(t => { setText(t); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [item]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!item) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 w-full max-w-lg max-h-[82vh] rounded-3xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-600 shadow-2xl overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-100 dark:border-navy-700 bg-gradient-to-r from-sky-50 to-white dark:from-navy-900 dark:to-navy-800 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center flex-shrink-0">
            <Music2 size={18} className="text-sky-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-slate-900 dark:text-white font-bold text-base truncate">{item.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Paroles</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors flex-shrink-0"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-sky-500" />
            </div>
          )}
          {error && !loading && (
            <p className="text-center text-slate-400 dark:text-slate-500 text-sm py-10">
              Paroles non disponibles.
            </p>
          )}
          {!loading && !error && (
            <pre className="font-sans text-sm text-slate-700 dark:text-slate-300 leading-7 whitespace-pre-wrap">
              {text}
            </pre>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Reusable search results list ──────────────────────────────────────── */
function SearchResults({
  results, query, onSelect,
}: {
  results: typeof lyricsList;
  query: string;
  onSelect: (id: string) => void;
}) {
  if (query.trim().length === 0) return null;
  return (
    <AnimatePresence>
      {results.length > 0 ? (
        <motion.div
          className="absolute top-full mt-2 left-0 right-0 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-600 shadow-xl overflow-hidden z-50"
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
          {results.map(item => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sky-50 dark:hover:bg-navy-700 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                <Music2 size={13} className="text-sky-500" />
              </div>
              <div className="min-w-0">
                <p className="text-slate-800 dark:text-white text-sm font-semibold truncate">{item.name}</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs truncate">Paroles</p>
              </div>
            </button>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="absolute top-full mt-2 left-0 right-0 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-600 shadow-xl p-4 z-50 text-center"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <p className="text-slate-400 dark:text-slate-500 text-sm">Aucun résultat pour « {query} »</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Desktop search bar (top nav) ─────────────────────────────────────── */
function DesktopSearchBar({
  isScrolled, onOpenLyrics,
}: {
  isScrolled: boolean;
  onOpenLyrics: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen]   = useState(false);
  const wrapperRef        = useRef<HTMLDivElement>(null);

  const results = query.trim().length > 0
    ? lyricsList.filter(l => l.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const textColor = isScrolled
    ? 'text-slate-600 dark:text-slate-300 placeholder:text-slate-400'
    : 'text-white/90 placeholder:text-white/40';
  const containerColor = isScrolled
    ? 'border-slate-200 dark:border-navy-600 bg-slate-50 dark:bg-navy-800/80'
    : 'border-white/20 bg-white/10 backdrop-blur-sm';
  const iconColor = isScrolled ? 'text-slate-400' : 'text-white/60';

  return (
    <div ref={wrapperRef} className="relative hidden lg:block">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300 ${containerColor}`}>
        <Search size={14} className={iconColor} />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Chercher une chanson..."
          className={`bg-transparent outline-none text-xs w-36 transition-all duration-300 focus:w-44 ${textColor}`}
          aria-label="Rechercher une chanson"
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false); }} className={`${iconColor} hover:opacity-80`}>
            <X size={12} />
          </button>
        )}
      </div>
      {open && (
        <div className="w-64">
          <SearchResults
            results={results} query={query}
            onSelect={id => { onOpenLyrics(id); setOpen(false); setQuery(''); }}
          />
        </div>
      )}
    </div>
  );
}

/* ─── Mobile search section (inside menu drawer) ───────────────────────── */
function MobileSearchSection({ onOpenLyrics }: { onOpenLyrics: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [open, setOpen]   = useState(false);
  const wrapperRef        = useRef<HTMLDivElement>(null);

  const results = query.trim().length > 0
    ? lyricsList.filter(l => l.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={wrapperRef} className="relative px-4 pb-2">
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-navy-600 bg-slate-50 dark:bg-navy-800">
        <Search size={15} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Chercher les paroles..."
          className="bg-transparent outline-none text-sm flex-1 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          aria-label="Rechercher une chanson"
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown — positioned relative to the search bar */}
      {open && query.trim().length > 0 && (
        <div className="mt-1">
          <SearchResults
            results={results} query={query}
            onSelect={id => { onOpenLyrics(id); setOpen(false); setQuery(''); }}
          />
        </div>
      )}
    </div>
  );
}

/* ─── Navbar ──────────────────────────────────────────────────────────── */
export default function Navbar() {
  const scrollY               = useScrollPosition();
  const [menuOpen, setMenuOpen]       = useState(false);
  const [lyricsId, setLyricsId]     = useState<string | null>(null);
  const { theme, toggleTheme }        = useTheme();
  const isScrolled                    = scrollY > 40;

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
            ? 'bg-white/90 dark:bg-navy-900/90 backdrop-blur-xl shadow-lg border-b border-slate-200/60 dark:border-white/5'
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
              <img
                src="/assets/images/logo.png"
                alt="EMIFI"
                className="h-10 lg:h-12 w-auto object-contain dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.65)]"
              />
            </motion.a>

            {/* Desktop Nav links */}
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
              {/* Desktop search */}
              <DesktopSearchBar isScrolled={isScrolled} onOpenLyrics={setLyricsId} />

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

              {/* Mobile hamburger */}
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

      {/* ── Mobile menu drawer ────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-[70] w-72 bg-white dark:bg-navy-900 shadow-2xl flex flex-col overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-navy-700 flex-shrink-0">
                <img
                  src="/assets/images/logo.png"
                  alt="EMIFI"
                  className="h-9 w-auto dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.55)]"
                />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search — visible in mobile menu */}
              <div className="py-4 border-b border-slate-100 dark:border-navy-700">
                <p className="px-6 text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2">
                  Rechercher les paroles
                </p>
                <MobileSearchSection onOpenLyrics={id => { setLyricsId(id); setMenuOpen(false); }} />
              </div>

              {/* Nav links */}
              <nav className="flex flex-col gap-1 px-4 py-4 flex-1">
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

              {/* Theme toggle */}
              <div className="px-6 pb-8 flex-shrink-0">
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

      {/* ── Lyrics modal (shared by desktop + mobile) ─────────────────── */}
      <AnimatePresence>
        {lyricsId && (
          <LyricsModal lyricsId={lyricsId} onClose={() => setLyricsId(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
