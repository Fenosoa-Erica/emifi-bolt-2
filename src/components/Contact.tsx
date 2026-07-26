import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2, Mail, MapPin, Phone, Facebook, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const initialForm: FormData = { name: '', phone: '', email: '', subject: '', message: '' };

const infoItems = [
  { icon: Mail,   labelKey: 'Email' as const,             value: 'emitmikalo@gmail.com' },
  { icon: Phone,  labelKey: 'cont_tel_label' as const,    value: '+261 34 18 924 33' },
  { icon: MapPin, labelKey: 'cont_addr_label' as const,   value: 'EMIT – Université de Fianarantsoa, Madagascar' },
];

export default function Contact() {
  const [form, setForm]         = useState<FormData>(initialForm);
  const [errors, setErrors]     = useState<Partial<FormData>>({});
  const [status, setStatus]     = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const titleRef   = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true });
  const { t } = useLanguage();

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    if (!form.name.trim())    e.name    = t('err_name');
    if (!form.subject.trim()) e.subject = t('err_subject');
    if (!form.message.trim()) e.message = t('err_message');
    if (!form.phone.trim() && !form.email.trim()) {
      e.phone = t('err_contact_req');
      e.email = t('err_contact_req');
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const n = { ...e }; delete n[field]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || t('err_message'));
      }
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : t('err_message'));
    }
  };

  /* ── input class — adapts to light / dark ── */
  const inputBase =
    'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 ' +
    'bg-slate-50 dark:bg-white/5 ' +
    'text-slate-900 dark:text-white ' +
    'placeholder:text-slate-400 dark:placeholder:text-white/30';

  const inputCls = (f: keyof FormData) =>
    `${inputBase} ${
      errors[f]
        ? 'border-red-400 focus:ring-2 focus:ring-red-400/30'
        : 'border-slate-200 dark:border-white/15 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20'
    }`;

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-slate-50 dark:bg-gradient-to-br dark:from-navy-900 dark:via-navy-800 dark:to-slate-900"
      aria-label="Contact"
    >
      {/* Light-mode top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-300/40 dark:via-sky-500/20 to-transparent pointer-events-none" />
      {/* Dark-mode glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-sky-600/0 dark:bg-sky-600/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-sky-400/0 dark:bg-sky-400/8 blur-3xl pointer-events-none" />

      <div className="relative z-10 container-max section-padding">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          ref={titleRef}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-sky-100 dark:bg-sky-400/10 border border-sky-300 dark:border-sky-400/20 text-sky-600 dark:text-sky-400 text-xs font-bold tracking-widest uppercase mb-4">
            {t('cont_badge')}
          </span>
          <h2 className="section-title text-slate-900 dark:text-white mb-3">
            {t('cont_title_pre')} <span className="text-gradient">{t('cont_title')}</span>
          </h2>
          <p className="section-subtitle text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            {t('cont_sub')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-start">

          {/* ── LEFT : Form ─────────────────────────────────────────────── */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-sm dark:shadow-none">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    className="flex flex-col items-center justify-center text-center py-14 gap-4"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-400/15 border border-green-300 dark:border-green-400/30 flex items-center justify-center">
                      <CheckCircle size={30} className="text-green-500 dark:text-green-400" />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-xl">{t('cont_ok_title')}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">{t('cont_ok_text')}</p>
                    <button onClick={() => setStatus('idle')} className="btn-primary mt-2">
                      {t('cont_new')}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Nom */}
                    <div>
                      <label className="block text-slate-600 dark:text-white/60 text-xs font-semibold tracking-wider uppercase mb-1.5">
                        {t('cont_name')} <span className="text-sky-500 dark:text-sky-400">*</span>
                      </label>
                      <input type="text" className={inputCls('name')} placeholder={t('cont_name_ph')}
                        value={form.name} onChange={e => handleChange('name', e.target.value)} />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Téléphone + Email */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-600 dark:text-white/60 text-xs font-semibold tracking-wider uppercase mb-1.5">
                          {t('cont_phone')}
                          <span className="text-slate-400 dark:text-white/30 normal-case tracking-normal ml-1">{t('cont_email_hint')}</span>
                        </label>
                        <input type="tel" className={inputCls('phone')} placeholder="+261 34 ..."
                          value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-white/60 text-xs font-semibold tracking-wider uppercase mb-1.5">
                          Email
                          <span className="text-slate-400 dark:text-white/30 normal-case tracking-normal ml-1">{t('cont_phone_hint')}</span>
                        </label>
                        <input type="email" className={inputCls('email')} placeholder="votre@email.com"
                          value={form.email} onChange={e => handleChange('email', e.target.value)} />
                        {errors.email && !errors.phone && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Objet */}
                    <div>
                      <label className="block text-slate-600 dark:text-white/60 text-xs font-semibold tracking-wider uppercase mb-1.5">
                        {t('cont_subject')} <span className="text-sky-500 dark:text-sky-400">*</span>
                      </label>
                      <input type="text" className={inputCls('subject')} placeholder={t('cont_subject_ph')}
                        value={form.subject} onChange={e => handleChange('subject', e.target.value)} />
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-slate-600 dark:text-white/60 text-xs font-semibold tracking-wider uppercase mb-1.5">
                        {t('cont_message')} <span className="text-sky-500 dark:text-sky-400">*</span>
                      </label>
                      <textarea rows={5} className={`${inputCls('message')} resize-none`}
                        placeholder={t('cont_message_ph')}
                        value={form.message} onChange={e => handleChange('message', e.target.value)} />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-400/10 border border-red-200 dark:border-red-400/20 text-red-600 dark:text-red-400 text-xs">
                        <AlertCircle size={14} />{errorMsg}
                      </div>
                    )}

                    <motion.button
                      type="submit" disabled={status === 'loading'}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold tracking-wide shadow-md hover:shadow-lg hover:shadow-sky-200 dark:hover:shadow-sky-900/40 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      whileHover={{ scale: status === 'loading' ? 1 : 1.01 }}
                      whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
                    >
                      {status === 'loading'
                        ? <><Loader2 size={16} className="animate-spin" /> {t('cont_sending')}</>
                        : <><Send size={15} /> {t('cont_send')}</>
                      }
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── RIGHT : Info + Social ────────────────────────────────────── */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-4"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Informations card */}
            <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl p-6 shadow-sm dark:shadow-none">
              <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-5">{t('cont_info')}</h3>
              <div className="space-y-4">
                {infoItems.map(({ icon: Icon, labelKey, value }) => (
                  <div key={labelKey} className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-400/15 border border-sky-200 dark:border-sky-400/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-sky-500 dark:text-sky-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 dark:text-white/40 text-[10px] font-bold tracking-widest uppercase mb-0.5">
                        {labelKey === 'Email' ? 'Email' : t(labelKey as any)}
                      </p>
                      <p className="text-slate-800 dark:text-white text-sm leading-snug">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social buttons — side by side */}
            <div className="grid grid-cols-2 gap-3">
              <motion.a
                href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-4 rounded-2xl
                  bg-blue-50 dark:bg-blue-900/40
                  border border-blue-200 dark:border-blue-500/20
                  hover:bg-blue-100 dark:hover:bg-blue-800/50
                  hover:border-blue-300 dark:hover:border-blue-400/30
                  transition-all duration-300 group text-center"
                whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-600/30 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-600/50 transition-colors">
                  <Facebook size={18} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-blue-800 dark:text-white font-semibold text-sm">Facebook</p>
                  <p className="text-blue-500 dark:text-white/40 text-xs">{t('cont_fb_follow')}</p>
                </div>
              </motion.a>

              <motion.a
                href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-4 rounded-2xl
                  bg-red-50 dark:bg-red-900/40
                  border border-red-200 dark:border-red-500/20
                  hover:bg-red-100 dark:hover:bg-red-800/50
                  hover:border-red-300 dark:hover:border-red-400/30
                  transition-all duration-300 group text-center"
                whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              >
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-600/30 border border-red-200 dark:border-red-500/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-600/50 transition-colors">
                  <Youtube size={18} className="text-red-600 dark:text-red-300" />
                </div>
                <div>
                  <p className="text-red-800 dark:text-white font-semibold text-sm">YouTube</p>
                  <p className="text-red-500 dark:text-white/40 text-xs">{t('cont_yt_label')}</p>
                </div>
              </motion.a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
