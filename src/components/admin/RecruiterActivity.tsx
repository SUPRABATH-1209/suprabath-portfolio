import { useEffect, useState } from 'react';
import {
  Activity,
  Eye,
  MonitorSmartphone,
  MousePointerClick,
  Timer,
  UserRound
} from 'lucide-react';

import {
  getRecentPortfolioEvents,
  getRecentPortfolioVisitors,
  isCurrentVisitorAdminExcluded,
  type PortfolioEvent,
  type PortfolioVisitor
} from '../../lib/portfolioAnalytics';

function formatEventType(type: string) {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatFirebaseDate(value: any) {
  if (!value) return 'Time not available yet';

  try {
    if (typeof value.toDate === 'function') {
      return value.toDate().toLocaleString();
    }

    if (value instanceof Date) {
      return value.toLocaleString();
    }

    return String(value);
  } catch {
    return 'Time not available yet';
  }
}

function shortVisitorId(visitorId: string) {
  if (!visitorId) return 'Unknown visitor';
  return `${visitorId.slice(0, 18)}...`;
}

export default function RecruiterActivity() {
  const [events, setEvents] = useState<PortfolioEvent[]>([]);
  const [visitors, setVisitors] = useState<PortfolioVisitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const adminDeviceExcluded = isCurrentVisitorAdminExcluded();

  useEffect(() => {
    let isMounted = true;

    Promise.all([getRecentPortfolioEvents(30), getRecentPortfolioVisitors(20)])
      .then(([eventData, visitorData]) => {
        if (!isMounted) return;
        setEvents(eventData);
        setVisitors(visitorData);
      })
      .catch((err) => {
        console.warn('Failed to load clean recruiter activity:', err);
        if (!isMounted) return;
        setError(
          'Unable to load activity. Check Firestore rules, collections and env variables.'
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

  return (
    <section className="space-y-6">
      <div className="clean-card p-6">
        <p className="section-eyebrow">Recruiter Activity</p>

        <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
          Clean Anonymous Visitor Timeline
        </h2>

        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          This list hides admin/test devices and shows only real anonymous visitor
          actions like page views, resume opens, project clicks and certificate
          clicks.
        </p>

        <p
          className={
            adminDeviceExcluded
              ? 'mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300'
              : 'mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300'
          }
        >
          {adminDeviceExcluded
            ? 'This admin device is excluded. Your laptop/mobile activity from this browser will not appear here.'
            : 'This device is not excluded yet. Login to Admin successfully on each device you personally use.'}
        </p>

        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </p>
        )}
      </div>

      {loading ? (
        <div className="clean-card p-8 text-center">
          <Timer className="mx-auto text-[var(--accent-strong)]" size={34} />
          <p className="mt-4 font-black text-slate-600 dark:text-slate-300">
            Loading clean visitor activity...
          </p>
        </div>
      ) : (
        <>
          <div className="clean-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <UserRound className="text-[var(--accent-strong)]" size={24} />

              <div>
                <h3 className="text-xl font-black text-slate-950 dark:text-white">
                  Recent Real Visitors
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Admin/test visitor IDs are hidden from this list.
                </p>
              </div>
            </div>

            {visitors.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-5 text-center font-bold text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                No real visitors yet. Admin/test visitors may already be hidden.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {visitors.map((visitor, index) => (
                  <article
                    key={visitor.id || visitor.visitorId}
                    className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-950"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">
                          Visitor {index + 1}
                        </p>

                        <h4 className="mt-2 text-lg font-black text-slate-950 dark:text-white">
                          {visitor.visitCount || 0} visit
                          {(visitor.visitCount || 0) === 1 ? '' : 's'}
                        </h4>
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        {visitor.deviceType || 'unknown'}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                      ID: {shortVisitorId(visitor.visitorId)}
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Events: {visitor.eventCount || 0}
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Last seen: {formatFirebaseDate(visitor.lastSeenAt)}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="clean-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <Activity className="text-[var(--accent-strong)]" size={24} />

              <div>
                <h3 className="text-xl font-black text-slate-950 dark:text-white">
                  Recent Real Actions
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Latest non-admin actions from Firestore.
                </p>
              </div>
            </div>

            {events.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-5 text-center font-bold text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                No real activity yet. Admin/test events may already be hidden.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {events.map((event) => {
                  const Icon =
                    event.type === 'page_view'
                      ? Eye
                      : event.type.includes('click') ||
                          event.type.includes('resume') ||
                          event.type.includes('download')
                        ? MousePointerClick
                        : MonitorSmartphone;

                  return (
                    <article
                      key={event.id}
                      className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-950"
                    >
                      <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900">
                        <Icon size={21} />
                      </div>

                      <h4 className="text-lg font-black text-slate-950 dark:text-white">
                        {formatEventType(event.type)}
                      </h4>

                      <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                        Path: {event.path}
                      </p>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Visitor: {shortVisitorId(event.visitorId)}
                      </p>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Device: {event.deviceType}
                      </p>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Time: {formatFirebaseDate(event.createdAt)}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}