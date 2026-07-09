import { BarChart3, Clock, MousePointerClick, Smartphone, Users } from 'lucide-react';

export default function AnalyticsOverview() {
  const cards = [
    {
      title: 'Total Visits',
      value: 'Not connected',
      note: 'Will show real visitor count after Firebase setup.',
      icon: Users
    },
    {
      title: 'Page Views',
      value: 'Not connected',
      note: 'Home, Resume, Projects, Certificates and Contact views.',
      icon: BarChart3
    },
    {
      title: 'Clicks',
      value: 'Not connected',
      note: 'Resume, GitHub, LinkedIn, project and certificate clicks.',
      icon: MousePointerClick
    },
    {
      title: 'Time Spent',
      value: 'Not connected',
      note: 'Average session time and last active time.',
      icon: Clock
    },
    {
      title: 'Device Type',
      value: 'Not connected',
      note: 'Mobile and desktop visitor split.',
      icon: Smartphone
    }
  ];

  return (
    <section className="space-y-6">
      <div className="clean-card p-6">
        <p className="section-eyebrow">Analytics Dashboard</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
          Overview
        </h2>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          Real analytics are not connected yet. After final portfolio fixes, this section will connect to Firebase
          Firestore / Google Analytics and show real visitor activity across all users.
        </p>

        <div className="mt-5 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
          Status: Not connected yet
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article key={card.title} className="clean-card p-6">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900">
                <Icon size={22} />
              </div>

              <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
                {card.title}
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                {card.value}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {card.note}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
