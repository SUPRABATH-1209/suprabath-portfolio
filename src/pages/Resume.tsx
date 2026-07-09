import { useRef, useState } from 'react';
import { AlertTriangle, Download, ExternalLink, FileText, Printer, X } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

export default function Resume() {
  const resumeUrl = '/SUPRABATH_RESUME.pdf';
  const [showMobileResume, setShowMobileResume] = useState(false);
  const viewerRef = useRef<HTMLDivElement | null>(null);

  const openResumeInsidePage = () => {
    setShowMobileResume(true);

    setTimeout(() => {
      viewerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  return (
    <div className="py-8 sm:py-10">
      <SectionHeader
        eyebrow="Resume"
        title="Resume"
        description="View or download my ATS-friendly resume."
      />

      {/* Desktop/tablet buttons only */}
      <div className="mb-6 hidden gap-3 md:grid md:grid-cols-3">
        <a
          href={resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-primary inline-flex items-center justify-center gap-2 py-3"
        >
          <ExternalLink size={18} />
          Open Resume
        </a>

        <a
          href={resumeUrl}
          download="SUPRABATH_RESUME.pdf"
          className="btn-secondary inline-flex items-center justify-center gap-2 py-3"
        >
          <Download size={18} />
          Download
        </a>

        <button
          type="button"
          onClick={() => window.print()}
          className="btn-secondary inline-flex items-center justify-center gap-2 py-3"
        >
          <Printer size={18} />
          Print Page
        </button>
      </div>

      {/* Mobile view */}
      <div ref={viewerRef} className="md:hidden">
        {!showMobileResume ? (
          <div className="clean-card p-6 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900">
              <FileText size={30} />
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">
              Resume PDF
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Tap below to view resume options inside this portfolio page.
            </p>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={openResumeInsidePage}
                className="btn-primary inline-flex items-center justify-center gap-2 py-4"
              >
                <ExternalLink size={18} />
                Open Resume
              </button>

              <a
                href={resumeUrl}
                download="SUPRABATH_RESUME.pdf"
                className="btn-secondary inline-flex items-center justify-center gap-2 py-4"
              >
                <Download size={18} />
                Download Resume
              </a>
            </div>
          </div>
        ) : (
          <div className="clean-card overflow-hidden p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="section-eyebrow">Resume Preview</p>
                <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">
                  SUPRABATH_RESUME.pdf
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowMobileResume(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                aria-label="Close resume preview"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/70">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                <AlertTriangle size={30} />
              </div>

              <h3 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">
                Mobile preview may be blocked
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Some mobile Chrome browsers block PDF preview inside a website. Your resume is still available clearly through open or download.
              </p>

              <div className="mt-6 grid gap-3">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary inline-flex items-center justify-center gap-2 py-4"
                >
                  <ExternalLink size={18} />
                  Open in PDF Viewer
                </a>

                <a
                  href={resumeUrl}
                  download="SUPRABATH_RESUME.pdf"
                  className="btn-secondary inline-flex items-center justify-center gap-2 py-4"
                >
                  <Download size={18} />
                  Download Resume
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop/tablet embedded preview */}
      <div ref={viewerRef} className="clean-card hidden overflow-hidden p-4 md:block md:p-5">
        <iframe
          title="Resume PDF desktop viewer"
          src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=1`}
          className="block h-[82vh] min-h-[42rem] w-full rounded-[1.5rem] border-0 bg-white"
        />
      </div>
    </div>
  );
}