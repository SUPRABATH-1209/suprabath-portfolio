import { useState, type FormEvent } from 'react';
import { Github, Linkedin, Mail, MapPin, MessageSquare, Send, User } from 'lucide-react';

import { usePortfolioStore } from '../hooks/usePortfolioStore';

export default function Contact() {
  const { content } = usePortfolioStore();
  const { profile } = content;

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (field: 'name' | 'email' | 'message', value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const subject = encodeURIComponent(
      `Portfolio Contact from ${form.name || 'Recruiter'}`
    );

    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );

    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="clean-card p-6 sm:p-8">
        <p className="section-eyebrow">Contact</p>

        <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
          Contact me directly.
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
          Reach me through email, LinkedIn or GitHub for opportunities, interviews
          and professional communication.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="clean-card p-6">
          <p className="section-eyebrow">Contact Details</p>

          <div className="mt-5 grid gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="rounded-3xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:border-[var(--accent)] dark:border-white/10"
            >
              <Mail className="mb-3 text-[var(--accent-strong)]" size={22} />
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Email
              </p>
              <p className="mt-1 break-all font-bold text-slate-700 dark:text-slate-300">
                {profile.email}
              </p>
            </a>

            <div className="rounded-3xl border border-slate-200 p-5 dark:border-white/10">
              <MapPin className="mb-3 text-[var(--accent-strong)]" size={22} />
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Location
              </p>
              <p className="mt-1 font-bold text-slate-700 dark:text-slate-300">
                {profile.location}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary justify-center"
              >
                <Github size={18} />
                GitHub
              </a>

              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary justify-center"
              >
                <Linkedin size={18} />
                LinkedIn
              </a>

              <a href={`mailto:${profile.email}`} className="btn-secondary justify-center">
                <Mail size={18} />
                Email
              </a>
            </div>
          </div>
        </article>

        <article className="clean-card p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900">
              <MessageSquare size={21} />
            </div>

            <div>
              <p className="section-eyebrow">Message</p>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                Send a message
              </h2>
            </div>
          </div>

          <p className="mb-5 text-sm leading-7 text-slate-500 dark:text-slate-400">
            Share your message and I will respond as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <label className="grid gap-2">
              <span className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300">
                <User size={16} />
                Name
              </span>

              <input
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder="Your name"
                className="form-input"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300">
                <Mail size={16} />
                Email
              </span>

              <input
                type="email"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder="your.email@example.com"
                className="form-input"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300">
                <MessageSquare size={16} />
                Message
              </span>

              <textarea
                value={form.message}
                onChange={(event) => handleChange('message', event.target.value)}
                placeholder="Write your message..."
                rows={5}
                className="form-input min-h-[130px] resize-y"
                required
              />
            </label>

            <button
              type="submit"
              className="btn-primary inline-flex w-full items-center justify-center gap-2 py-4"
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        </article>
      </section>
    </div>
  );
}