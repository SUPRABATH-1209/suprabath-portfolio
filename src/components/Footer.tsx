import { ArrowUp, Github, Linkedin, Lock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolioStore } from '../hooks/usePortfolioStore';

export default function Footer() {
  const { content } = usePortfolioStore();

  return (
    <footer className="mt-24 border-t border-slate-200 bg-white/60 py-10 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-5 px-5 text-center lg:flex-row lg:justify-between lg:px-8 lg:text-left">
        <div>
          <p className="text-lg font-black text-slate-950 dark:text-white">
            {content.profile.name}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Java Backend Developer | Spring Boot Developer
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <a
            href={content.profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            title="GitHub"
            className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-[var(--accent)] hover:text-[var(--accent-strong)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <Github size={19} />
          </a>

          <a
            href={content.profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
            className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-[var(--accent)] hover:text-[var(--accent-strong)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <Linkedin size={19} />
          </a>

          <a
            href={`mailto:${content.profile.email}`}
            aria-label="Email"
            title="Email"
            className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-[var(--accent)] hover:text-[var(--accent-strong)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <Mail size={19} />
          </a>

          <Link
            to="/admin"
            aria-label="Admin"
            title="Admin"
            className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-[var(--accent)] hover:text-[var(--accent-strong)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <Lock size={19} />
          </Link>

          <a
            href="#main-content"
            aria-label="Back to top"
            title="Back to top"
            className="grid h-11 w-11 place-items-center rounded-full bg-[var(--accent)] text-white shadow-sm transition hover:-translate-y-1 hover:bg-[var(--accent-strong)]"
          >
            <ArrowUp size={19} />
          </a>
        </div>
      </div>
    </footer>
  );
}