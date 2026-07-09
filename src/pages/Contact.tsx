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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent(`Portfolio Contact from ${form.name || 'Recruiter'}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );

    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="py-8 sm:py-10">
      <section className="mb-8 sm:mb-10">
        <p className="section-eyebrow">Contact</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white sm:text-5xl">
          Simple contact path for recruiters.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-7">
          Reach me through email, LinkedIn or GitHub. The contact form opens your email app, so no paid backend is needed.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="clean-card p-5 sm:p-7">
          <p className="section-eyebrow">Contact details</p>

          <div className="mt-6 space-y-4">
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4 transition hover:-translate-y-1 hover:border-[var(--accent)] dark:border-slate-800 dark:bg-slate-950/60"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900">
                <Mail size={19} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Email
                </span>
                <span className="block break-all text-sm font-black text-slate-950 dark:text-white sm:text-base">
                  {profile.email}
                </span>
              </span>
            </a>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900">
                <MapPin size={19} />
              </span>
              <span>
                <span className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Location
                </span>
                <span className="block text-sm font-black text-slate-950 dark:text-white sm:text-base">
                  {profile.location}
                </span>
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              title="GitHub"
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:-translate-y-1 hover:border-[var(--accent)] hover:text-[var(--accent-strong)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <Github size={19} />
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:-translate-y-1 hover:border-[var(--accent)] hover:text-[var(--accent-strong)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <Linkedin size={19} />
            </a>

            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              title="Email"
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:-translate-y-1 hover:border-[var(--accent)] hover:text-[var(--accent-strong)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <Mail size={19} />
            </a>
          </div>
        </div>

        <div className="clean-card p-5 sm:p-7">
          <div className="mb-6">
            <p className="section-eyebrow">Send a message</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">
              Open Email Draft
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Fill the fields and your email app will open with the message ready.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300">
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

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300">
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

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300">
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
              Open Email Draft
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}