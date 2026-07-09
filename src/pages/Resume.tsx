import { useRef, useState } from 'react';
import {
  AlertTriangle,
  Download,
  ExternalLink,
  FileText,
  Printer,
  X
} from 'lucide-react';

import SectionHeader from '../components/SectionHeader';
import { usePortfolioStore } from '../hooks/usePortfolioStore';
import { trackPortfolioEvent } from '../lib/portfolioAnalytics';

export default function Resume() {
  const { content } = usePortfolioStore();
  const resumeUrl = content.resume.fileUrl || '/SUPRABATH_RESUME.pdf';
  const resumeFileName = content.resume.fileName || 'SUPRABATH_RESUME.pdf';

  const [showMobileResume, setShowMobileResume] = useState(false);
  const viewerRef = useRef<HTMLDivElement | null>(null);

  const trackResumeAction = (action: 'open' | 'download' | 'preview' | 'print') => {
    const type = action === 'download' ? 'resume_download' : 'resume_open';

    trackPortfolioEvent(type, {
      action,
      resumeFileName,
      resumeUrl
    });
  };

  const openResumeInsidePage = () => {
    trackResumeAction('preview');
    setShowMobileResume(true);

    setTimeout(() => {
      viewerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handlePrint = () => {
    trackResumeAction('print');
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <SectionHeader
        eyebrow="Resume"
        title="ATS-Friendly Resume"
        description="View or download my resume for Java Backend Developer, Spring Boot Developer and Software Engineer roles."
      />

      <section className="clean-card p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--accent)] text-white shadow-lg shadow-indigo-500/20">
              <FileText size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-950 dark:text-white">
                {resumeFileName}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Open, download or print my resume directly from this portfolio.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[430px]">
            <button
              type="button"
              onClick={openResumeInsidePage}
              className="btn-secondary justify-center py-3"
            >
              <FileText size={18} />
              Preview
            </button>

            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackResumeAction('open')}
              className="btn-primary justify-center py-3"
            >
              <ExternalLink size={18} />
              Open
            </a>

            <a
              href={resumeUrl}
              download={resumeFileName}
              onClick={() => trackResumeAction('download')}
              className="btn-secondary justify-center py-3"
            >
              <Download size={18} />
              Download
            </a>
          </div>
        </div>
      </section>

      <section ref={viewerRef} className="clean-card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-eyebrow">Resume Preview</p>

            <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
              Embedded Resume Viewer
            </h2>

            <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Desktop preview is shown below. Mobile browsers may open the PDF in
              a separate viewer for better readability.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="btn-secondary justify-center py-3"
          >
            <Printer size={18} />
            Print Page
          </button>
        </div>

        <div className="block p-5 lg:hidden">
          {!showMobileResume ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-white/10 dark:bg-slate-900">
              <FileText className="mx-auto text-[var(--accent-strong)]" size={40} />

              <h3 className="mt-4 text-2xl font-black text-slate-950 dark:text-white">
                Resume Preview
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                Tap preview to view resume inside this page, or open it in your
                browser PDF viewer.
              </p>

              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={openResumeInsidePage}
                  className="btn-primary justify-center py-3"
                >
                  <FileText size={18} />
                  Preview Resume
                </button>

                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackResumeAction('open')}
                  className="btn-secondary justify-center py-3"
                >
                  <ExternalLink size={18} />
                  Open Resume
                </a>

                <a
                  href={resumeUrl}
                  download={resumeFileName}
                  onClick={() => trackResumeAction('download')}
                  className="btn-secondary justify-center py-3"
                >
                  <Download size={18} />
                  Download Resume
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900">
                <div>
                  <h3 className="font-black text-slate-950 dark:text-white">
                    Mobile Resume Preview
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    If preview is blocked, use Open Resume or Download Resume.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMobileResume(false)}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                  aria-label="Close resume preview"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="h-[72vh] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-slate-900">
                <iframe
                  src={resumeUrl}
                  title="Resume mobile preview"
                  className="h-full w-full"
                  onLoad={() => trackResumeAction('preview')}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackResumeAction('open')}
                  className="btn-primary justify-center py-3"
                >
                  <ExternalLink size={18} />
                  Open Resume
                </a>

                <a
                  href={resumeUrl}
                  download={resumeFileName}
                  onClick={() => trackResumeAction('download')}
                  className="btn-secondary justify-center py-3"
                >
                  <Download size={18} />
                  Download Resume
                </a>
              </div>

              <div className="rounded-3xl bg-amber-50 p-4 text-amber-800 dark:bg-amber-400/10 dark:text-amber-200">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-1 shrink-0" size={20} />
                  <p className="text-sm font-bold leading-6">
                    Some mobile browsers may block embedded PDF preview. The resume
                    is still available through open or download.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="hidden p-5 lg:block">
          <div className="h-[78vh] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-slate-900">
            <iframe
              src={resumeUrl}
              title="Resume desktop preview"
              className="h-full w-full"
              onLoad={() => trackResumeAction('preview')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}