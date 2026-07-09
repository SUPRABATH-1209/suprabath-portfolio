import { useEffect, useMemo, useState } from 'react';
import {
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Printer,
  ScanEye
} from 'lucide-react';

import { usePortfolioStore } from '../../hooks/usePortfolioStore';
import {
  getCleanPortfolioEvents,
  type PortfolioEvent
} from '../../lib/portfolioAnalytics';

type ResumeStats = {
  total: number;
  opens: number;
  downloads: number;
  previews: number;
  prints: number;
};

function createEmptyStats(): ResumeStats {
  return {
    total: 0,
    opens: 0,
    downloads: 0,
    previews: 0,
    prints: 0
  };
}

function formatFirebaseDate(value: any) {
  if (!value) return 'Time not available';

  try {
    if (typeof value.toDate === 'function') {
      return value.toDate().toLocaleString();
    }

    if (value instanceof Date) {
      return value.toLocaleString();
    }

    return String(value);
  } catch {
    return 'Time not available';
  }
}

function formatAction(action?: string) {
  if (!action) return 'Resume Action';

  return action
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function ResumeClicks() {
  const { content } = usePortfolioStore();

  const [events, setEvents] = useState<PortfolioEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    getCleanPortfolioEvents()
      .then((data) => {
        if (!isMounted) return;

        setEvents(
          data.filter(
            (event) =>
              event.type === 'resume_open' || event.type === 'resume_download'
          )
        );
      })
      .catch((err) => {
        console.warn('Failed to load resume activity:', err);
        if (!isMounted) return;
        setError('Unable to load resume activity.');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const result = createEmptyStats();

    for (const event of events) {
      const action = event.metadata?.action || '';

      result.total += 1;

      if (event.type === 'resume_download' || action === 'download') {
        result.downloads += 1;
      } else if (action === 'preview') {
        result.previews += 1;
      } else if (action === 'print') {
        result.prints += 1;
      } else {
        result.opens += 1;
      }
    }

    return result;
  }, [events]);

  const recentEvents = useMemo(() => {
    return [...events].slice(0, 15);
  }, [events]);

  return (
    <section className="space-y-6">
      <div className="clean-card p-6">
        <p className="section-eyebrow">Resume</p>

        <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
          Resume Activity
        </h2>

        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          Resume preview, open, download and print actions from portfolio visitors.
        </p>

        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <article className="clean-card p-5">
          <ExternalLink className="mb-3 text-[var(--accent-strong)]" size={24} />
          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
            Opens
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {loading ? '...' : stats.opens}
          </h3>
        </article>

        <article className="clean-card p-5">
          <Download className="mb-3 text-[var(--accent-strong)]" size={24} />
          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
            Downloads
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {loading ? '...' : stats.downloads}
          </h3>
        </article>

        <article className="clean-card p-5">
          <ScanEye className="mb-3 text-[var(--accent-strong)]" size={24} />
          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
            Previews
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {loading ? '...' : stats.previews}
          </h3>
        </article>

        <article className="clean-card p-5">
          <Printer className="mb-3 text-[var(--accent-strong)]" size={24} />
          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
            Prints
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {loading ? '...' : stats.prints}
          </h3>
        </article>
      </div>

      <article className="clean-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-eyebrow">Resume File</p>

            <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
              {content.resume.fileName || 'Resume file'}
            </h3>

            <p className="mt-2 break-all text-sm font-bold text-slate-500 dark:text-slate-400">
              {content.resume.fileUrl || '/SUPRABATH_RESUME.pdf'}
            </p>
          </div>

          <div className="rounded-3xl bg-slate-50 px-5 py-4 text-center dark:bg-slate-900">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Total Actions
            </p>
            <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
              {loading ? '...' : stats.total}
            </p>
          </div>
        </div>
      </article>

      {loading ? (
        <div className="clean-card p-8 text-center">
          <Loader2
            className="mx-auto animate-spin text-[var(--accent-strong)]"
            size={34}
          />
          <p className="mt-4 font-black text-slate-600 dark:text-slate-300">
            Loading resume activity...
          </p>
        </div>
      ) : recentEvents.length === 0 ? (
        <div className="clean-card p-8 text-center">
          <FileText className="mx-auto text-[var(--accent-strong)]" size={34} />

          <h3 className="mt-4 text-2xl font-black text-slate-950 dark:text-white">
            No resume activity yet
          </h3>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Resume activity will appear after visitors open, preview or download
            the resume.
          </p>
        </div>
      ) : (
        <div className="clean-card p-6">
          <p className="section-eyebrow">Recent Resume Actions</p>

          <div className="mt-5 grid gap-4">
            {recentEvents.map((event) => (
              <article
                key={event.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-950"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-950 dark:text-white">
                      {formatAction(event.metadata?.action)}
                    </h3>

                    <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                      Path: {event.path}
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    {event.deviceType}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  Time: {formatFirebaseDate(event.createdAt)}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}