import { Download, ExternalLink, Printer } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { usePortfolioStore } from '../hooks/usePortfolioStore';

export default function Resume() {
  const { content } = usePortfolioStore();
  const { resume } = content;
  const resumeUrl = resume.fileUrl || '/resume.pdf';

  return (
    <div className="py-10">
      <SectionHeader eyebrow="Resume" title="Resume" description="Download or open the ATS-friendly resume. Mobile browsers handle PDFs better in a separate tab." />
      <div className="mb-6 flex flex-wrap gap-3">
        <a href={resumeUrl} download className="btn-primary inline-flex items-center gap-2"><Download size={18} /> Download Resume</a>
        <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn-secondary inline-flex items-center gap-2"><ExternalLink size={18} /> Open PDF</a>
        <button onClick={() => window.print()} className="btn-secondary inline-flex items-center gap-2"><Printer size={18} /> Print Page</button>
      </div>
      <div className="clean-card overflow-hidden p-4 md:p-5">
        {resumeUrl ? (
          <>
            <div className="grid min-h-[20rem] place-items-center rounded-[1.5rem] border border-[var(--line)] bg-[var(--soft)] p-6 text-center md:hidden">
              <div>
                <p className="text-2xl font-black">Resume preview works best on desktop.</p>
                <p className="mt-3 leading-7 text-[var(--muted)]">Tap Open PDF to view it properly on mobile without cropping.</p>
                <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn-primary mt-6 inline-flex items-center gap-2"><ExternalLink size={18} /> Open Resume</a>
              </div>
            </div>
            <iframe title="Resume PDF viewer" src={resumeUrl} className="hidden h-[76vh] min-h-[38rem] w-full rounded-[1.5rem] border-0 bg-white md:block" />
          </>
        ) : (
          <div className="grid h-[60vh] place-items-center rounded-[1.5rem] bg-[var(--soft)] text-center">
            <p className="text-xl font-black">Resume not added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
