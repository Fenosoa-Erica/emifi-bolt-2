import { motion } from 'framer-motion';
import { Facebook, Youtube, Mail, MapPin, ExternalLink } from 'lucide-react';

const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'À propos', href: '#apropos' },
  { label: 'Réalisations', href: '#realisations' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const handleNav = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      className="relative overflow-hidden bg-slate-100 dark:bg-navy-900 border-t border-slate-200 dark:border-white/5"
      role="contentinfo"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-100 dark:from-slate-900 dark:to-navy-900 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-sky-400/0 dark:bg-sky-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 container-max px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div className="space-y-4">
            <img
              src="/assets/images/logo.png"
              alt="EMIFI"
              className="h-15 w-auto dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.65)]"
            />
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
              La chorale universitaire de l'EMIT – Université de Fianarantsoa. Une voix, une mission.
            </p>
            <div className="flex items-center gap-3">
              <motion.a
                href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-700/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500/20 transition-all duration-300"
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Facebook EMIFI"
              >
                <Facebook size={15} />
              </motion.a>
              <motion.a
                href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-700/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-500/20 transition-all duration-300"
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="YouTube EMIFI"
              >
                <Youtube size={15} />
              </motion.a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-4">Navigation</h4>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="text-slate-500 dark:text-slate-400 text-sm hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-sm">
                <Mail size={13} className="text-sky-500 flex-shrink-0" />
                emitmikalo@gmail.com
              </li>
              <li className="flex items-start gap-2.5 text-slate-500 dark:text-slate-400 text-sm">
                <MapPin size={13} className="text-sky-500 flex-shrink-0 mt-0.5" />
                EMIT – Université de Fianarantsoa, Madagascar
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-400 dark:text-slate-500 text-xs">
            © {new Date().getFullYear()} EMIFI – Emit Mikalo Fiderana. Tous droits réservés.
          </p>
          <a
            href="http://fenosoa-erica.bolt.host"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-400 dark:text-slate-600 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-200 text-xs group"
          >
            <span>Développé par Fenosoa Erica NIRINDRAIBE</span>
            <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </footer>
  );
}
