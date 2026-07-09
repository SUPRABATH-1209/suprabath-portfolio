import { Github, Linkedin, Mail, MapPin, Target, UserRound } from 'lucide-react';

import { usePortfolioStore } from '../hooks/usePortfolioStore';

export default function About() {
  const { content } = usePortfolioStore();
  const { profile } = content;

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="clean-card p-6 sm:p-8">
        <p className="section-eyebrow">About</p>

        <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
          Backend developer profile.
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
          A focused overview of my backend development direction, technical strengths
          and career objective.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="clean-card p-6">
          <div className="flex flex-col items-center text-center">
            <img
              src={profile.photoData || '/profile-placeholder.svg'}
              alt={`${profile.name} profile`}
              className="h-40 w-40 rounded-[2rem] object-cover shadow-2xl ring-4 ring-white dark:ring-white/10"
            />

            <h2 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">
              {profile.name}
            </h2>

            <p className="mt-2 text-sm font-bold text-[var(--accent-strong)]">
              {profile.headline}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                aria-label="GitHub profile"
              >
                <Github size={18} />
                GitHub
              </a>

              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                aria-label="LinkedIn profile"
              >
                <Linkedin size={18} />
                LinkedIn
              </a>

              <a href={`mailto:${profile.email}`} className="btn-secondary">
                <Mail size={18} />
                Email
              </a>
            </div>
          </div>
        </article>

        <div className="grid gap-6">
          <article className="clean-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900">
                <UserRound size={21} />
              </div>

              <div>
                <p className="section-eyebrow">Profile Summary</p>
                <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                  Java Backend Developer
                </h2>
              </div>
            </div>

            <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
              {profile.about}
            </p>
          </article>

          <article className="clean-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900">
                <Target size={21} />
              </div>

              <div>
                <p className="section-eyebrow">Career Objective</p>
                <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                  Focused on Java backend development roles.
                </h2>
              </div>
            </div>

            <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
              {profile.objective}
            </p>
          </article>

          <article className="clean-card p-6">
            <p className="section-eyebrow">Quick Details</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}