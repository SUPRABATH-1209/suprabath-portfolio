import { AlertTriangle, CheckCircle2, CircleDashed } from 'lucide-react';
import { usePortfolioStore } from '../../hooks/usePortfolioStore';

export default function WebsiteChecklist() {
  const { content } = usePortfolioStore();

  const checks = [
    {
      label: 'Profile photo added',
      done: Boolean(content.profile.photoData && !content.profile.photoData.includes('placeholder')),
      note: 'Use your real profile image instead of placeholder.'
    },
    {
      label: 'Resume connected',
      done: Boolean(content.resume.fileUrl),
      note: 'Resume PDF should open from the website.'
    },
    {
      label: 'Certificates added',
      done: content.certificates.length > 0,
      note: `${content.certificates.length} certificates found.`
    },
    {
      label: 'Projects added',
      done: content.projects.length > 0,
      note: `${content.projects.length} projects found.`
    },
    {
      label: 'Skills added',
      done: content.skills.length > 0,
      note: `${content.skills.length} skills listed.`
    },
    {
      label: 'GitHub connected',
      done: Boolean(content.profile.github),
      note: content.profile.github || 'GitHub link missing.'
    },
    {
      label: 'LinkedIn connected',
      done: Boolean(content.profile.linkedin),
      note: content.profile.linkedin || 'LinkedIn link missing.'
    },
    {
      label: 'Firebase analytics connected',
      done: false,
      note: 'Will be connected after final UI/content fixes.'
    }
  ];

  const completed = checks.filter((check) => check.done).length;

  return (
    <section className="space-y-6">
      <div className="clean-card p-6">
        <p className="section-eyebrow">Website Checklist</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
          Portfolio Readiness
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          {completed} of {checks.length} checks completed.
        </p>

        {content.projects.length === 0 && (
          <div className="mt-5 flex gap-3 rounded-2xl bg-amber-100 p-4 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300">
            <AlertTriangle className="shrink-0" size={22} />
            <p className="text-sm font-bold">
              Projects are still missing. For Java Backend roles, projects are more important than certificates.
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {checks.map((check) => (
          <article key={check.label} className="clean-card flex gap-4 p-5">
            {check.done ? (
              <CheckCircle2 className="mt-1 shrink-0 text-emerald-500" size={24} />
            ) : (
              <CircleDashed className="mt-1 shrink-0 text-slate-400" size={24} />
            )}

            <div>
              <h3 className="font-black text-slate-950 dark:text-white">
                {check.label}
              </h3>
              <p className="mt-1 break-words text-sm leading-6 text-slate-500 dark:text-slate-400">
                {check.note}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
