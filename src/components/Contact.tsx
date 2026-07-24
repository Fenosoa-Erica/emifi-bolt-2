import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
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

export default function Contact() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true });

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = 'Le nom est requis.';
    if (!form.subject.trim()) e.subject = "L'objet est requis.";
    if (!form.message.trim()) e.message = 'Le message est requis.';
    if (!form.phone.trim() && !form.email.trim()) {
      e.phone = 'Renseignez au moins un téléphone ou un email.';
      e.email = 'Renseignez au moins un téléphone ou un email.';
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
        throw new Error(body.error || 'Erreur lors de l\'envoi.');
      }
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none bg-white dark:bg-navy-700 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
      errors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900'
        : 'border-slate-200 dark:border-navy-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/30'
    }`;

  return (
    <section id="contact" className="relative overflow-hidden" aria-label="Contact">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900" />
      {/* Abstract glows */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-sky-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />
      {/* Stars */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 bg-white/30 rounded-full"
          style={{ left: `${(i * 17 + 5) % 100}%`, top: `${(i * 23 + 8) % 100}%` }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      <div className="relative z-10 container-max section-padding">
        {/* Header */}
        <motion.div
          ref={titleRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-sky-400/10 border border-sky-400/20 text-sky-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Nous rejoindre
          </span>
          <h2 className="section-title text-white mb-4">
            Nous{' '}
            <span className="text-gradient">contacter</span>
          </h2>
          <p className="section-subtitle text-slate-400 max-w-xl mx-auto">
            Une question, un message ou envie de rejoindre EMIFI ? Écrivez-nous.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
              {status === 'success' ? (
                <motion.div
                  className="flex flex-col items-center justify-center text-center py-12 gap-4"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-400" />
                  </div>
                  <h3 className="text-white font-bold text-xl">Message envoyé !</h3>
                  <p className="text-slate-400 text-sm">Nous vous répondrons dans les plus brefs délais.</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="btn-primary mt-2"
                  >
                    Nouveau message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <label className="block text-white/80 text-xs font-semibold mb-1.5">
                      Nom <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass('name')}
                      placeholder="Votre nom complet"
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-xs font-semibold mb-1.5">
                        Téléphone <span className="text-slate-500 font-normal">(ou email)</span>
                      </label>
                      <input
                        type="tel"
                        className={inputClass('phone')}
                        placeholder="+261 ..."
                        value={form.phone}
                        onChange={e => handleChange('phone', e.target.value)}
                      />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-white/80 text-xs font-semibold mb-1.5">
                        Email <span className="text-slate-500 font-normal">(ou téléphone)</span>
                      </label>
                      <input
                        type="email"
                        className={inputClass('email')}
                        placeholder="votre@email.com"
                        value={form.email}
                        onChange={e => handleChange('email', e.target.value)}
                      />
                      {errors.email && !errors.phone && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-xs font-semibold mb-1.5">
                      Objet <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass('subject')}
                      placeholder="Sujet de votre message"
                      value={form.subject}
                      onChange={e => handleChange('subject', e.target.value)}
                    />
                    {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <label className="block text-white/80 text-xs font-semibold mb-1.5">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={5}
                      className={`${inputClass('message')} resize-none`}
                      placeholder="Votre message..."
                      value={form.message}
                      onChange={e => handleChange('message', e.target.value)}
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-xs">
                      <AlertCircle size={14} />
                      {errorMsg}
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
                    whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
                  >
                    {status === 'loading' ? (
                      <><Loader2 size={16} className="animate-spin" /> Envoi en cours...</>
                    ) : (
                      <><Send size={16} /> Envoyer le message</>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-6"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-white font-bold text-xl">Informations</h3>

              {[
                { icon: Mail, label: 'Email', value: 'emitmikalo@gmail.com' },
                { icon: Phone, label: 'Téléphone', value: 'À compléter' },
                { icon: MapPin, label: 'Adresse', value: 'EMIT – Université de Fianarantsoa, Madagascar' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-400/15 border border-sky-400/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-sky-400" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-medium mb-0.5">{label}</p>
                    <p className="text-white text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-4">
              <motion.a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-blue-700/20 border border-blue-500/20 hover:bg-blue-700/30 hover:border-blue-500/40 transition-all duration-300 group"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-700/40 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-shadow">
                  <Facebook size={22} className="text-blue-300" />
                </div>
                <span className="text-white font-semibold text-sm">Facebook</span>
              </motion.a>

              <motion.a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-red-700/20 border border-red-500/20 hover:bg-red-700/30 hover:border-red-500/40 transition-all duration-300 group"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="w-12 h-12 rounded-xl bg-red-700/40 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-shadow">
                  <Youtube size={22} className="text-red-300" />
                </div>
                <span className="text-white font-semibold text-sm">YouTube</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
