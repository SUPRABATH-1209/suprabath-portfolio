import { useMemo, useState } from 'react';
import { Download, ExternalLink, Image as ImageIcon, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import SectionHeader from '../components/SectionHeader';
import EmptyState from '../components/EmptyState';
import Reveal from '../components/Reveal';
import { usePortfolioStore } from '../hooks/usePortfolioStore';
import { trackPortfolioEvent } from '../lib/portfolioAnalytics';
import type { Certificate } from '../types/portfolio';

export default function Certificates() {
  const { content } = usePortfolioStore();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [page, setPage] = useState(1);

  const pageSize = 6;

  const categories = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(content.certificates.map((item) => item.category).filter(Boolean))
      )
    ],
    [content.certificates]
  );

  const filtered = content.certificates.filter((item) => {
    const text = `${item.title} ${item.issuer} ${item.category} ${
      item.credentialId || ''
    }`.toLowerCase();

    return (
      text.includes(query.toLowerCase()) &&
      (category === 'All' || item.category === category)
    );
  });

  const visible = filtered.slice(0, page * pageSize);

  const trackCertificate = (
    certificate: Certificate,
    action: 'modal_open' | 'download' | 'credential_link'
  ) => {
    trackPortfolioEvent('certificate_click', {
      action,
      certificateId: certificate.id,
      certificateTitle: certificate.title,
      issuer: certificate.issuer,
      category: certificate.category
    });
  };

  const openCertificate = (certificate: Certificate) => {
    trackCertificate(certificate, 'modal_open');
    setSelected(certificate);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <SectionHeader
        eyebrow="Certificates"
        title="Certifications & Learning"
        description="Selected certifications and learning milestones relevant to backend development, cloud fundamentals and software engineering."
      />

      {content.certificates.length === 0 ? (
        <EmptyState
          title="No certificates added yet"
          message="Certificates will appear here after they are added to the portfolio."
          action={false}
        />
      ) : (
        <>
          <section className="clean-card p-4 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <label className="relative block">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />

                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search certificates by title, issuer or category"
                  className="form-input pl-12"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setCategory(item);
                      setPage(1);
                    }}
                    className={
                      item === category
                        ? 'btn-primary px-4 py-3 text-sm'
                        : 'btn-secondary px-4 py-3 text-sm'
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {visible.length === 0 ? (
            <EmptyState
              title="No certificates matched your search"
              message="Try a different keyword or reset the selected filter."
              action={false}
            />
          ) : (
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((certificate, index) => (
                <Reveal key={certificate.id} delay={index * 0.04}>
                  <article className="clean-card h-full overflow-hidden">
                    <button
                      type="button"
                      onClick={() => openCertificate(certificate)}
                      className="certificate-image-wrap block w-full text-left"
                      aria-label={`View ${certificate.title}`}
                    >
                      {certificate.imageData ? (
                        <img
                          src={certificate.imageData}
                          alt={certificate.title}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="grid min-h-[260px] place-items-center bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                          <div className="text-center">
                            <ImageIcon className="mx-auto mb-3" size={34} />
                            <p className="font-black">Preview unavailable</p>
                          </div>
                        </div>
                      )}
                    </button>

                    <div className="p-5">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        {certificate.category || 'Certificate'}
                      </span>

                      <h2 className="mt-4 text-xl font-black text-slate-950 dark:text-white">
                        {certificate.title}
                      </h2>

                      <p className="mt-2 font-bold text-slate-500 dark:text-slate-400">
                        {certificate.issuer}
                      </p>

                      {certificate.issueDate && (
                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                          Issued: {certificate.issueDate}
                        </p>
                      )}

                      {certificate.credentialId && (
                        <p className="mt-2 break-all text-sm text-slate-500 dark:text-slate-400">
                          Credential ID: {certificate.credentialId}
                        </p>
                      )}

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => openCertificate(certificate)}
                          className="btn-secondary justify-center py-3"
                        >
                          View
                        </button>

                        {certificate.imageData && (
                          <a
                            href={certificate.imageData}
                            download={`${certificate.title}.jpg`}
                            onClick={() => trackCertificate(certificate, 'download')}
                            className="btn-secondary justify-center py-3"
                          >
                            <Download size={17} />
                            Download
                          </a>
                        )}

                        {certificate.certificateLink && (
                          <a
                            href={certificate.certificateLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() =>
                              trackCertificate(certificate, 'credential_link')
                            }
                            className="btn-primary justify-center py-3 sm:col-span-2"
                          >
                            <ExternalLink size={17} />
                            Open Certificate
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </section>
          )}

          {visible.length < filtered.length && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setPage((value) => value + 1)}
                className="btn-primary"
              >
                View more certificates
              </button>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[90] overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="mx-auto my-8 max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-slate-950"
              initial={{ scale: 0.96, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 20, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-white/10">
                <div>
                  <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                    {selected.title}
                  </h2>
                  <p className="mt-1 font-bold text-slate-500 dark:text-slate-400">
                    {selected.issuer}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-full border border-slate-200 p-3 dark:border-slate-800"
                  aria-label="Close certificate modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5">
                {selected.imageData ? (
                  <img
                    src={selected.imageData}
                    alt={selected.title}
                    className="mx-auto max-h-[72vh] w-full rounded-3xl object-contain"
                  />
                ) : (
                  <div className="grid min-h-[320px] place-items-center rounded-3xl bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                    <div className="text-center">
                      <ImageIcon className="mx-auto mb-3" size={40} />
                      <p className="font-black">
                        Certificate preview is not available yet.
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  {selected.imageData && (
                    <a
                      href={selected.imageData}
                      download={`${selected.title}.jpg`}
                      onClick={() => trackCertificate(selected, 'download')}
                      className="btn-secondary"
                    >
                      <Download size={17} />
                      Download
                    </a>
                  )}

                  {selected.certificateLink && (
                    <a
                      href={selected.certificateLink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackCertificate(selected, 'credential_link')}
                      className="btn-primary"
                    >
                      <ExternalLink size={17} />
                      Open Certificate
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}