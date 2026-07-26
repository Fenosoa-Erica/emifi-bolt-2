import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, Music4 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const timelineEvents = [
  {
    date: '19 juin 2018',
    titleKey: 'tl1_title',
    descKey: 'tl1_desc',
    color: 'sky',
  },
  {
    date: '23 juin 2018',
    titleKey: 'tl2_title',
    descKey: 'tl2_desc',
    color: 'blue',
  },
  {
    date: '26 septembre 2018',
    titleKey: 'tl3_title',
    descKey: 'tl3_desc',
    color: 'navy',
  },
] as const;

function TimelineItem({ event, index }: { event: typeof timelineEvents[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { t } = useLanguage();

  return (
    <motion.div
      ref={ref}
      className="relative flex gap-6"
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      {/* Line and dot */}
      <div className="flex flex-col items-center flex-shrink-0 w-10">
        <motion.div
          className="w-4 h-4 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 border-4 border-white dark:border-navy-800 shadow-glow flex-shrink-0 z-10"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.3, type: 'spring' }}
        />
        {index < timelineEvents.length - 1 && (
          <div className="flex-1 w-px bg-gradient-to-b from-sky-400/50 to-transparent mt-1" />
        )}
      </div>
      {/* Content */}
      <div className="pb-8 flex-1">
        <span className="inline-block px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-semibold mb-2">
          {event.date}
        </span>
        <h4 className="font-bold text-slate-800 dark:text-white text-base mb-1">{t(event.titleKey as any)}</h4>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t(event.descKey as any)}</p>
      </div>
    </motion.div>
  );
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useLanguage();

  return (
    <section id="apropos" className="relative overflow-hidden" aria-label="À propos">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-sky-50/30 to-white dark:from-navy-900 dark:via-navy-800/50 dark:to-navy-900" />

      {/* Abstract shapes */}
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-sky-100/50 dark:bg-sky-900/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-sky-50/80 dark:bg-navy-700/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 container-max section-padding">
        {/* Section header */}
        <motion.div
          ref={ref}
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-semibold tracking-widest uppercase mb-4">
            {t('about_badge')}
          </span>
          <h2 className="section-title text-slate-900 dark:text-white mb-4">
            {t('about_title_pre')}{' '}
            <span className="text-gradient">{t('about_title')}</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {t('about_sub')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left column */}
          <div className="space-y-10">            {/* Who we are */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
                  <Music4 size={18} className="text-sky-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('about_who')}</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                {t('about_who_text')}
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
                  <Target size={18} className="text-sky-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('about_mission')}</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-3">
                {t('about_mission1')}
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                {t('about_mission2')}
              </p>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('about_history')}</h3>
              <div>
                {timelineEvents.map((event, i) => (
                  <TimelineItem key={i} event={event} index={i} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right column — Hero image as design piece */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="sticky top-28"
          >
            <div className="relative group perspective">
              {/* Outer glow halo */}
              <div className="absolute -inset-6 bg-gradient-to-br from-sky-400/20 via-transparent to-sky-600/10 rounded-[3rem] blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Abstract decorations */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-2 border-sky-400/20 group-hover:border-sky-400/40 transition-colors duration-500" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full border border-sky-200/30 dark:border-sky-400/10 group-hover:border-sky-400/20 transition-colors duration-500" />
              <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-sky-400/40 blur-sm" />
              <div className="absolute top-1/4 -left-3 w-4 h-4 rounded-full bg-sky-300/30 blur-sm" />

              {/* Card */}
              <motion.div
                className="relative rounded-[2.5rem] overflow-hidden border border-white/30 dark:border-white/10 shadow-[0_30px_80px_rgba(10,18,36,0.4)] group-hover:shadow-[0_40px_100px_rgba(14,165,233,0.2)]"
                whileHover={{ rotateY: 3, rotateX: -2, scale: 1.01 }}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img
                  src="/assets/images/bg.jpg"
                  alt="EMIFI – Chorale EMIT Fianarantsoa"
                  className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Luminous overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-sky-900/10 opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                {/* Glass bottom badge */}
                <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl border border-white/20 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-sm">EMIFI</p>
                      <p className="text-white/60 text-xs">EMIT – Fianarantsoa</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sky-300 font-bold text-sm">{t('about_since')}</p>
                      <p className="text-white/50 text-xs">{t('about_menbre')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section divider */}
      <div className="relative">
        <svg viewBox="0 0 1440 60" className="w-full" fill="none">
          <path
            d="M0 0L1440 0L1440 60C1200 20 960 60 720 40C480 20 240 60 0 30L0 0Z"
            className="fill-slate-50 dark:fill-navy-800/50"
          />
        </svg>
      </div>
    </section>
  );
}
