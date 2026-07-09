import { Github, Linkedin, Mail, MapPin, Target, UserRound } from 'lucide-react';
import { usePortfolioStore } from '../hooks/usePortfolioStore';

export default function About() {
  const { content } = usePortfolioStore();
  const { profile } = content;

  return (
    <div className="py-8 sm:py-10">
      <section className="mb-8 sm:mb-10">
        <p className="section-eyebrow">About</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white sm:text-5xl">
          Simple profile for recruiters.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-7">
          A clear overview of my role, objective and contact links without unnecessary claims or fake experience.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="clean-card p-5 sm:p-7">
          <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
            <img
              src={profile.photoData || '/profile-placeholder.svg'}
              alt={`${profile.name} profile`}
              className="aspect-[4/5] h-full w-full object-cover"
            />
          </div>

          <div className="mt-6 text-center">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
              {profile.name}
            </h2>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-500 dark:text-slate-400">
              {profile.headline}
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-3">
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

        <div className="space-y-6">
          <article className="clean-card p-5 sm:p-7">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900">
              <UserRound size={22} />
            </div>

            <p className="section-eyebrow">Profile summary</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">
              Java Backend Developer
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8">
              {profile.about}
            </p>
          </article>

          <article className="clean-card p-5 sm:p-7">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900">
              <Target size={22} />
            </div>

            <p className="section-eyebrow">Career objective</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">
              Looking for backend engineering roles.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8">
              {profile.objective}
            </p>
          </article>

          <article className="clean-card p-5 sm:p-7">
            <p className="section-eyebrow">Quick details</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4 transition hover:-translate-y-1 hover:border-[var(--accent)] dark:border-slate-800 dark:bg-slate-950/60"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900">
                  <Mail size={18} />
                </span>

                <span className="min-w-0">
                  <span className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Email
                  </span>
                  <span className="block break-all text-sm font-black text-slate-950 dark:text-white">
                    {profile.email}
                  </span>
                </span>
              </a>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900">
                  <MapPin size={18} />
                </span>

                <span>
                  <span className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Location
                  </span>
                  <span className="block text-sm font-black text-slate-950 dark:text-white">
                    {profile.location}
                  </span>
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}