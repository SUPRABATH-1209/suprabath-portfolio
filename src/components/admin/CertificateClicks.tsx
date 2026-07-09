import { useEffect, useMemo, useState } from 'react';
import { Award, Download, ExternalLink, Eye, Loader2 } from 'lucide-react';

import { usePortfolioStore } from '../../hooks/usePortfolioStore';
import {
  getCleanPortfolioEvents,
  type PortfolioEvent
} from '../../lib/portfolioAnalytics';

type CertificateStat = {
  total: number;
  views: number;
  downloads: number;
  links: number;
};

function createEmptyStat(): CertificateStat {
  return {
    total: 0,
    views: 0,
    downloads: 0,
    links: 0
  };
}

export default function CertificateClicks() {
  const { content } = usePortfolioStore();

  const [events, setEvents] = useState<PortfolioEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    getCleanPortfolioEvents()
      .then((data) => {
        if (!isMounted) return;
        setEvents(data.filter((event) => event.type === 'certificate_click'));
      })
      .catch((err) => {
        console.warn('Failed to load certificate activity:', err);
        if (!isMounted) return;
        setError('Unable to load certificate activity.');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const statsByCertificateId = useMemo(() => {
    const map = new Map<string, CertificateStat>();

    for (const event of events) {
      const certificateId = event.metadata?.certificateId;

      if (!certificateId) continue;

      const current = map.get(certificateId) || createEmptyStat();
      const action = event.metadata?.action || 'modal_open';

      current.total += 1;

      if (action === 'download') {
        current.downloads += 1;
      } else if (action === 'credential_link') {
        current.links += 1;
      } else {
        current.views += 1;
      }

      map.set(certificateId, current);
    }

    return map;
  }, [events]);

  const sortedCertificates = useMemo(() => {
    return [...content.certificates].sort((first, second) => {
      const firstStats = statsByCertificateId.get(first.id) || createEmptyStat();
      const secondStats = statsByCertificateId.get(second.id) || createEmptyStat();

      return secondStats.total - firstStats.total;
    });
  }, [content.certificates, statsByCertificateId]);

  const totalViews = sortedCertificates.reduce((sum, certificate) => {
    const stats = statsByCertificateId.get(certificate.id) || createEmptyStat();
    return sum + stats.views;
  }, 0);

  const totalDownloads = sortedCertificates.reduce((sum, certificate) => {
    const stats = statsByCertificateId.get(certificate.id) || createEmptyStat();
    return sum + stats.downloads;
  }, 0);

  const totalLinks = sortedCertificates.reduce((sum, certificate) => {
    const stats = statsByCertificateId.get(certificate.id) || createEmptyStat();
    return sum + stats.links;
  }, 0);

  return (
    <section className="space-y-6">
      <div className="clean-card p-6">
        <p className="section-eyebrow">Certificates</p>

        <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
          Certificate Activity
        </h2>

        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          Certificate views, downloads and open actions from portfolio visitors.
        </p>

        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <article className="clean-card p-5">
          <Eye className="mb-3 text-[var(--accent-strong)]" size={24} />
          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
            Views
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {loading ? '...' : totalViews}
          </h3>
        </article>

        <article className="clean-card p-5">
          <Download className="mb-3 text-[var(--accent-strong)]" size={24} />
          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
            Downloads
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {loading ? '...' : totalDownloads}
          </h3>
        </article>

        <article className="clean-card p-5">
          <ExternalLink className="mb-3 text-[var(--accent-strong)]" size={24} />
          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
            Opens
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {loading ? '...' : totalLinks}
          </h3>
        </article>
      </div>

      {loading ? (
        <div className="clean-card p-8 text-center">
          <Loader2
            className="mx-auto animate-spin text-[var(--accent-strong)]"
            size={34}
          />
          <p className="mt-4 font-black text-slate-600 dark:text-slate-300">
            Loading certificate activity...
          </p>
        </div>
      ) : content.certificates.length === 0 ? (
        <div className="clean-card p-8 text-center">
          <Award className="mx-auto text-[var(--accent-strong)]" size={34} />
          <h3 className="mt-4 text-2xl font-black text-slate-950 dark:text-white">
            No certificates added yet
          </h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Certificate activity will appear after certificates are added.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {sortedCertificates.map((certificate) => {
            const stats =
              statsByCertificateId.get(certificate.id) || createEmptyStat();

            return (
              <article key={certificate.id} className="clean-card p-5">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <h3 className="text-xl font-black text-slate-950 dark:text-white">
                      {certificate.title}
                    </h3>

                    <p className="mt-1 font-bold text-slate-500 dark:text-slate-400">
                      {certificate.issuer}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                        Views
                      </p>
                      <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                        {stats.views}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                        Downloads
                      </p>
                      <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                        {stats.downloads}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                        Opens
                      </p>
                      <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                        {stats.links}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}