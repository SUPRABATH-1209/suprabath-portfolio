import { ArrowUp, Github, Linkedin, Lock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolioStore } from '../hooks/usePortfolioStore';

export default function Footer() {
  const { content } = usePortfolioStore();
  return (
    <footer className="mt-24 border-t border-slate-200 bg-white/60 py-10 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-lg font-black text-slate-950 dark:text-white">{content.profile.name}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Java Backend Developer | Spring Boot Developer</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a href={content.profile.github} target="_blank" rel="noreferrer" className="btn-secondary inline-flex items-center gap-2 py-3"><Github size={18} /> GitHub</a>
          <a href={content.profile.linkedin} target="_blank" rel="noreferrer" className="btn-secondary inline-flex items-center gap-2 py-3"><Linkedin size={18} /> LinkedIn</a>
          <a href={`mailto:${content.profile.email}`} className="btn-secondary inline-flex items-center gap-2 py-3"><Mail size={18} /> Email</a>
          <Link to="/admin" className="btn-secondary inline-flex items-center gap-2 py-3"><Lock size={18} /> Admin</Link>
          <a href="#main-content" className="btn-primary inline-flex items-center gap-2 py-3"><ArrowUp size={18} /> Top</a>
        </div>
      </div>
    </footer>
  );
}
