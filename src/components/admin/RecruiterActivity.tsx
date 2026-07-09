import { Activity, Eye, MousePointerClick, Timer } from 'lucide-react';

export default function RecruiterActivity() {
  const futureEvents = [
    {
      title: 'Portfolio opened',
      detail: 'Visitor opened the portfolio from mobile or desktop.',
      icon: Eye
    },
    {
      title: 'Resume viewed',
      detail: 'Visitor opened or downloaded the resume.',
      icon: MousePointerClick
    },
    {
      title: 'Important section clicked',
      detail: 'Visitor clicked certificates, projects, GitHub, LinkedIn or email.',
      icon: Activity
    },
    {
      title: 'Time tracked',
      detail: 'Session duration will show how long the visitor stayed.',
      icon: Timer
    }
  ];

  return (
    <section className="space-y-6">
      <div className="clean-card p-6">
        <p className="section-eyebrow">Recruiter Activity</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
          Activity Timeline
        </h2>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          After Firebase is connected, this section will show real visitor actions like resume views,
          GitHub clicks, certificate opens, project clicks and time spent.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {futureEvents.map((event) => {
          const Icon = event.icon;

          return (
            <article key={event.title} className="clean-card p-6">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900">
                <Icon size={21} />
              </div>

              <h3 className="text-xl font-black text-slate-950 dark:text-white">
                {event.title}
              </h3>
              <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
                {event.detail}
              </p>

              <p className="mt-4 text-sm font-bold text-slate-400">
                Waiting for Firebase connection
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
