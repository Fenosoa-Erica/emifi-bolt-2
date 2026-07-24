import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useTheme } from '@/contexts/ThemeContext';

const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'À propos', href: '#apropos' },
  { label: 'Réalisations', href: '#realisations' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const scrollY = useScrollPosition();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isScrolled = scrollY > 40;

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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
          <div className="flex items-center justify-between h-16 lg:h-20">
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
                className="h-10 lg:h-12 w-auto object-contain"
              />
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

            {/* Controls */}
            <div className="flex items-center gap-2">
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

              <motion.button
                className="lg:hidden p-2.5 rounded-full transition-colors duration-200"
                onClick={() => setMenuOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Ouvrir le menu"
              >
                <Menu
                  size={22}
                  className={isScrolled ? 'text-slate-700 dark:text-slate-200' : 'text-white'}
                />
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
