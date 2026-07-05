import { useMemo, useState } from 'react';
import { Download, ExternalLink, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import EmptyState from '../components/EmptyState';
import Reveal from '../components/Reveal';
import { usePortfolioStore } from '../hooks/usePortfolioStore';
import type { Certificate } from '../types/portfolio';

export default function Certificates() {
  const { content } = usePortfolioStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const categories = useMemo(() => ['All', ...Array.from(new Set(content.certificates.map((item) => item.category).filter(Boolean)))], [content.certificates]);
  const filtered = content.certificates.filter((item) => {
    const text = `${item.title} ${item.issuer} ${item.category} ${item.credentialId || ''}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (category === 'All' || item.category === category);
  });
  const visible = filtered.slice(0, page * pageSize);

  return (
    <div className="py-10">
      <SectionHeader eyebrow="Certificates" title="Certificate Gallery" description="Certificate images are shown fully and clearly. Details stay below the image instead of covering it." />
      {content.certificates.length === 0 ? (
        <EmptyState title="No certificates added yet" message="Add real certificate images from Admin. No certificate will be shown until you add it." />
      ) : (
        <>
          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search certificates by title, issuer or category" className="form-input pl-12" />
            </label>
            <div className="flex flex-wrap gap-3">
              {categories.map((item) => <button key={item} onClick={() => { setCategory(item); setPage(1); }} className={item === category ? 'btn-primary py-3' : 'btn-secondary py-3'}>{item}</button>)}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((certificate, index) => (
              <Reveal key={certificate.id} delay={Math.min(index * .035, .18)}>
                <article className="certificate-card clean-card h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-soft">
                  <button onClick={() => setSelected(certificate)} className="certificate-image-wrap block w-full text-left" aria-label={`View ${certificate.title}`}>
                    {certificate.imageData ? <img src={certificate.imageData} alt={certificate.title} /> : <p className="font-black text-slate-500">Image not added</p>}
                  </button>
                  <div className="p-6">
                    <span className="badge">{certificate.category || 'Certificate'}</span>
                    <h2 className="mt-4 text-xl font-black text-slate-950 dark:text-white">{certificate.title}</h2>
                    <p className="mt-2 font-bold text-slate-500 dark:text-slate-400">{certificate.issuer}</p>
                    {certificate.issueDate && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Issued: {certificate.issueDate}</p>}
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button onClick={() => setSelected(certificate)} className="btn-secondary py-3">View</button>
                      {certificate.imageData && <a href={certificate.imageData} download={`${certificate.title}.png`} className="btn-secondary inline-flex items-center gap-2 py-3"><Download size={17} /> Download</a>}
                      {certificate.certificateLink && <a href={certificate.certificateLink} target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center gap-2 py-3"><ExternalLink size={17} /> Link</a>}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          {visible.length < filtered.length && <div className="mt-10 text-center"><button onClick={() => setPage((value) => value + 1)} className="btn-primary">Load more certificates</button></div>}
        </>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }} className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded-[2rem] bg-white p-4 shadow-2xl dark:bg-[#070b14]" onClick={(event) => event.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between gap-4 p-2">
                <div>
                  <h2 className="text-2xl font-black">{selected.title}</h2>
                  <p className="text-slate-500">{selected.issuer}</p>
                </div>
                <button onClick={() => setSelected(null)} className="rounded-full border border-slate-200 p-3 dark:border-slate-800" aria-label="Close certificate modal"><X /></button>
              </div>
              {selected.imageData ? <img src={selected.imageData} alt={selected.title} className="mx-auto max-h-[72vh] rounded-2xl object-contain" /> : <p className="p-10 text-center">No certificate image added.</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
