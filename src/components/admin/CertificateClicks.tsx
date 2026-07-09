import { Award, Eye } from 'lucide-react';
import { usePortfolioStore } from '../../hooks/usePortfolioStore';

export default function CertificateClicks() {
  const { content } = usePortfolioStore();

  return (
    <section className="space-y-6">
      <div className="clean-card p-6">
        <p className="section-eyebrow">Certificate Clicks</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
          Certificate Interest Tracking
        </h2>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          Later this section will show which certificates recruiters opened the most.
        </p>
      </div>

      {content.certificates.length === 0 ? (
        <div className="clean-card p-8 text-center">
          <Award className="mx-auto text-[var(--accent-strong)]" size={34} />
          <h3 className="mt-4 text-2xl font-black text-slate-950 dark:text-white">
            No certificates added yet
          </h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Add certificates permanently in code first. Tracking can be connected later.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {content.certificates.map((certificate) => (
            <article key={certificate.id} className="clean-card p-6">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900">
                <Eye size={21} />
              </div>

              <h3 className="text-lg font-black text-slate-950 dark:text-white">
                {certificate.title}
              </h3>

              <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                {certificate.issuer}
              </p>

              <p className="mt-4 rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                Views: Not connected
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
