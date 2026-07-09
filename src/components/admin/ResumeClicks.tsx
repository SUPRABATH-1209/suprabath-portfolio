import { Download, Eye, FileText } from 'lucide-react';
import { usePortfolioStore } from '../../hooks/usePortfolioStore';

export default function ResumeClicks() {
  const { content } = usePortfolioStore();

  return (
    <section className="space-y-6">
      <div className="clean-card p-6">
        <p className="section-eyebrow">Resume Clicks</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
          Resume Interest Tracking
        </h2>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          This will track how many visitors open or download your resume after Firebase is connected.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <article className="clean-card p-6">
          <Eye className="text-[var(--accent-strong)]" size={26} />
          <h3 className="mt-4 text-xl font-black">Resume Views</h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Not connected yet</p>
        </article>

        <article className="clean-card p-6">
          <Download className="text-[var(--accent-strong)]" size={26} />
          <h3 className="mt-4 text-xl font-black">Resume Downloads</h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Not connected yet</p>
        </article>

        <article className="clean-card p-6">
          <FileText className="text-[var(--accent-strong)]" size={26} />
          <h3 className="mt-4 text-xl font-black">Resume File</h3>
          <p className="mt-2 break-all text-slate-500 dark:text-slate-400">
            {content.resume.fileName || 'Resume not added'}
          </p>
        </article>
      </div>
    </section>
  );
}
