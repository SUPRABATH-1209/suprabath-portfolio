import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Clock,
  Download,
  FileText,
  MousePointerClick,
  Smartphone,
  Users
} from 'lucide-react';

import {
  getPortfolioSummary,
  isCurrentVisitorAdminExcluded,
  type PortfolioSummary
} from '../../lib/portfolioAnalytics';

function getNumber(value: number | undefined) {
  return typeof value === 'number' ? value : 0;
}

function formatFirebaseDate(value: any) {
  if (!value) return 'No activity yet';

  try {
    if (typeof value.toDate === 'function') {
      return value.toDate().toLocaleString();
    }

    if (value instanceof Date) {
      return value.toLocaleString();
    }

    return String(value);
  } catch {
    return 'No activity yet';
  }
}

export default function AnalyticsOverview() {
  const [summary, setSummary] = useState<PortfolioSummary>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const adminDeviceExcluded = isCurrentVisitorAdminExcluded();

  useEffect(() => {
    let isMounted = true;

    getPortfolioSummary()
      .then((data) => {
        if (!isMounted) return;
        setSummary(data || {});
      })
      .catch((err) => {
        console.warn('Failed to load clean Firebase analytics summary:', err);
        if (!isMounted) return;
        setError(
          'Unable to load analytics. Check Firestore rules, collections and env variables.'
        );
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalClicks = useMemo(() => {
    return (
      getNumber(summary.resumeOpens) +
      getNumber(summary.resumeDownloads) +
      getNumber(summary.githubClicks) +
      getNumber(summary.linkedinClicks) +
      getNumber(summary.emailClicks) +
      getNumber(summary.certificateClicks) +
      getNumber(summary.projectClicks) +
      getNumber(summary.contactClicks) +
      getNumber(summary.contactFormSubmits)
    );
  }, [summary]);

  const cards = [
    {
      title: 'Real Visitors',
      value: getNumber(summary.totalUniqueVisitors),
      note: 'Admin/test devices are excluded from this number.',
      icon: Users
    },
    {
      title: 'Real Visits',
      value: getNumber(summary.totalVisits),
      note: 'Calculated from real visitor sessions, excluding admin sessions.',
      icon: BarChart3
    },
    {
      title: 'Page Views',
      value: getNumber(summary.pageViews),
      note: 'Public portfolio page views only. Admin page views are ignored.',
      icon: FileText
    },
    {
      title: 'Total Clicks',
      value: totalClicks,
      note: 'Resume, project, certificate, GitHub, LinkedIn, email and contact clicks.',
      icon: MousePointerClick
    },
    {
      title: 'Resume Actions',
      value: getNumber(summary.resumeOpens) + getNumber(summary.resumeDownloads),
      note: `Open: ${getNumber(summary.resumeOpens)} / Download: ${getNumber(
        summary.resumeDownloads
      )}`,
      icon: Download
    },
    {
      title: 'Device Events',
      value: `M ${getNumber(summary.mobileEvents)} / D ${getNumber(
        summary.desktopEvents
      )}`,
      note: 'Mobile and desktop activity split, excluding admin devices.',
      icon: Smartphone
    }
  ];

  return (
    <section className="space-y-6">
      <div className="clean-card p-6">
        <p className="section-eyebrow">Analytics Dashboard</p>

        <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
          Clean Recruiter Analytics
        </h2>

        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          This dashboard calculates analytics from raw Firebase events and hides
          admin/test visitor IDs. If you login to Admin from laptop and mobile,
          both devices will be excluded.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
            Status: Connected
          </span>

          <span className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-black text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">
            Admin excluded: {getNumber(summary.excludedAdminVisitors)}
          </span>

          <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            Last event: {formatFirebaseDate(summary.lastEventAt)}
          </span>
        </div>

        <p
          className={
            adminDeviceExcluded
              ? 'mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300'
              : 'mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300'
          }
        >
          {adminDeviceExcluded
            ? 'This browser/device is excluded from analytics. Your old and future visits from this device will be hidden from dashboard totals.'
            : 'This browser/device is not excluded yet. Login to Admin successfully to mark it as an admin/test device.'}
        </p>

        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </p>
        )}
      </div>

      {loading ? (
        <div className="clean-card p-8 text-center">
          <Clock className="mx-auto text-[var(--accent-strong)]" size={34} />
          <p className="mt-4 font-black text-slate-600 dark:text-slate-300">
            Loading clean Firebase analytics...
          </p>
        </div>
      ) : (
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
      )}
    </section>
  );
}