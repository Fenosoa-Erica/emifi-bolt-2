import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2, Mail, MapPin, Phone, Facebook, Youtube } from 'lucide-react';

interface FormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const initialForm: FormData = { name: '', phone: '', email: '', subject: '', message: '' };

const infoItems = [
  { icon: Mail,  label: 'Email',       value: 'emitmikalo@gmail.com' },
  { icon: Phone, label: 'Téléphone',   value: 'À compléter' },
  { icon: MapPin, label: 'Localisation', value: 'Fianarantsoa, Madagascar' },
];

export default function Contact() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true });

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    if (!form.name.trim())    e.name    = 'Le nom est requis.';
    if (!form.subject.trim()) e.subject = "L'objet est requis.";
    if (!form.message.trim()) e.message = 'Le message est requis.';
    if (!form.phone.trim() && !form.email.trim()) {
      e.phone = 'Téléphone ou email requis.';
      e.email = 'Téléphone ou email requis.';
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Erreur lors de l'envoi.");
      }
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  const inputBase =
    'w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-navy-700 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all duration-200';

  const inputClass = (field: keyof FormData) =>
    `${inputBase} ${
      errors[field]
        ? 'border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900'
        : 'border-slate-200 dark:border-navy-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/30'
    }`;

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-slate-50 dark:bg-navy-900"
      aria-label="Contact"
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent" />

      <div className="container-max section-padding">
        {/* Header */}
        <motion.div
          ref={titleRef}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-bold tracking-widest uppercase mb-4">
            Nous rejoindre
          </span>
          <h2 className="section-title text-slate-900 dark:text-white mb-3">
            Nous <span className="text-gradient">contacter</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Une question ou envie de rejoindre EMIFI ? Écrivez-nous.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-start">

          {/* ── Left : info cards ─────────────────────────── */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-4"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 bg-white dark:bg-navy-800 border border-slate-200/80 dark:border-navy-700 rounded-2xl px-5 py-4 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                  <Icon size={17} className="text-sky-500" />
                </div>
                <div>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-0.5">
                    {label}
                  </p>
                  <p className="text-slate-800 dark:text-white text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}

            {/* Disponibilité */}
            <div className="flex items-center gap-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-700/40 rounded-2xl px-5 py-4">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 flex-shrink-0 shadow-[0_0_6px_rgba(74,222,128,0.7)]" />
              <div>
                <p className="text-slate-800 dark:text-white text-sm font-bold">Disponible</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Ouvert aux collaborations.</p>
              </div>
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <motion.a
                href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 shadow-sm"
                whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              >
                <Facebook size={15} /> Facebook
              </motion.a>
              <motion.a
                href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 shadow-sm"
                whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              >
                <Youtube size={15} /> YouTube
              </motion.a>
            </div>
          </motion.div>

          {/* ── Right : form card ─────────────────────────── */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white dark:bg-navy-800 border border-slate-200/80 dark:border-navy-700 rounded-3xl p-6 sm:p-8 shadow-sm">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    className="flex flex-col items-center justify-center text-center py-14 gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 flex items-center justify-center">
                      <CheckCircle size={30} className="text-green-500" />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-xl">Message envoyé !</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                      Nous vous répondrons dans les plus brefs délais.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="btn-primary mt-2"
                    >
                      Nouveau message
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
                    {/* Row 1 : Nom + Email */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 text-[11px] font-bold tracking-widest uppercase mb-2">
                          Nom complet <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          className={inputClass('name')}
                          placeholder="Jean Dupont"
                          value={form.name}
                          onChange={e => handleChange('name', e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 text-[11px] font-bold tracking-widest uppercase mb-2">
                          Adresse email
                        </label>
                        <input
                          type="email"
                          className={inputClass('email')}
                          placeholder="jean@example.com"
                          value={form.email}
                          onChange={e => handleChange('email', e.target.value)}
                        />
                        {errors.email && !errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Téléphone */}
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 text-[11px] font-bold tracking-widest uppercase mb-2">
                        Téléphone
                        <span className="text-slate-400 font-normal normal-case tracking-normal ml-1 text-xs">(si pas d'email)</span>
                      </label>
                      <input
                        type="tel"
                        className={inputClass('phone')}
                        placeholder="+261 34 ..."
                        value={form.phone}
                        onChange={e => handleChange('phone', e.target.value)}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Sujet */}
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 text-[11px] font-bold tracking-widest uppercase mb-2">
                        Sujet <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        className={inputClass('subject')}
                        placeholder="Proposition de collaboration..."
                        value={form.subject}
                        onChange={e => handleChange('subject', e.target.value)}
                      />
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 text-[11px] font-bold tracking-widest uppercase mb-2">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        rows={5}
                        className={`${inputClass('message')} resize-none`}
                        placeholder="Décrivez votre projet ou opportunité..."
                        value={form.message}
                        onChange={e => handleChange('message', e.target.value)}
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40 text-red-600 dark:text-red-400 text-xs">
                        <AlertCircle size={14} />
                        {errorMsg}
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-sky-400 hover:bg-sky-500 active:bg-sky-600 text-white text-sm font-bold tracking-wide shadow-md hover:shadow-lg hover:shadow-sky-200 dark:hover:shadow-sky-900 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      whileHover={{ scale: status === 'loading' ? 1 : 1.01 }}
                      whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
                    >
                      {status === 'loading' ? (
                        <><Loader2 size={16} className="animate-spin" /> Envoi en cours...</>
                      ) : (
                        <><Send size={15} /> Envoyer le message</>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
