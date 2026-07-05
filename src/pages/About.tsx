import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import Reveal from '../components/Reveal';
import SectionHeader from '../components/SectionHeader';
import { usePortfolioStore } from '../hooks/usePortfolioStore';

export default function About() {
  const { content } = usePortfolioStore();
  const { profile } = content;

  return (
    <div className="py-10">
      <SectionHeader eyebrow="About" title="A clear, simple profile for recruiters." description="This page avoids fake experience and only shows the details already added to the portfolio." />
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div className="clean-card p-5">
            <img src={profile.photoData || '/profile-placeholder.svg'} alt={`${profile.name} profile`} className="aspect-[4/5] w-full rounded-[1.5rem] object-cover" />
          </div>
        </Reveal>
        <Reveal delay={.08}>
          <div className="clean-card p-8 md:p-10">
            <h2 className="text-3xl font-black text-slate-950 dark:text-white">{profile.name}</h2>
            <p className="mt-3 text-lg font-bold text-amber-700 dark:text-amber-300">{profile.headline}</p>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">{profile.about}</p>
            <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-6 dark:bg-slate-900">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">Career objective</p>
              <p className="mt-3 leading-8 text-slate-700 dark:text-slate-300">{profile.objective}</p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a className="btn-secondary inline-flex items-center gap-2" href={`mailto:${profile.email}`}><Mail size={18} /> {profile.email}</a>
              <span className="btn-secondary inline-flex items-center gap-2"><MapPin size={18} /> {profile.location}</span>
              <a className="btn-secondary inline-flex items-center gap-2" href={profile.github} target="_blank" rel="noreferrer"><Github size={18} /> GitHub</a>
              <a className="btn-secondary inline-flex items-center gap-2" href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} /> LinkedIn</a>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
