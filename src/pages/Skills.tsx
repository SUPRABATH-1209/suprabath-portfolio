import { useMemo, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import { usePortfolioStore } from '../hooks/usePortfolioStore';

const levelWidth = { Beginner: '35%', Intermediate: '68%', Advanced: '88%' } as const;

export default function Skills() {
  const { content } = usePortfolioStore();
  const [category, setCategory] = useState('All');
  const categories = useMemo(() => ['All', ...Array.from(new Set(content.skills.map((skill) => skill.category)))], [content.skills]);
  const skills = category === 'All' ? content.skills : content.skills.filter((skill) => skill.category === category);

  return (
    <div className="py-10">
      <SectionHeader eyebrow="Skills" title="Backend-first skill set." description="Skills are grouped by category so recruiters can quickly understand your technical direction." />
      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map((item) => (
          <button key={item} onClick={() => setCategory(item)} className={item === category ? 'btn-primary py-3' : 'btn-secondary py-3'}>{item}</button>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {skills.map((skill, index) => (
          <Reveal key={skill.id} delay={Math.min(index * .03, .18)}>
            <div className="clean-card p-6 transition hover:-translate-y-1 hover:shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950 dark:text-white">{skill.name}</h2>
                  <p className="mt-1 font-bold text-slate-500 dark:text-slate-400">{skill.category}</p>
                </div>
                <span className="badge">{skill.level}</span>
              </div>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full accent-gradient" style={{ width: levelWidth[skill.level] }} />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
