import { ArrowRight, Download, ExternalLink, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../components/Reveal';
import EmptyState from '../components/EmptyState';
import ProjectMedia from '../components/ProjectMedia';
import { usePortfolioStore } from '../hooks/usePortfolioStore';

export default function Home() {
  const { content } = usePortfolioStore();
  const { profile, projects, certificates, resume } = content;
  const latestCertificates = certificates.slice(0, 3);
  const latestProjects = projects.slice(0, 2);

  return (
    <div id="home">
      <section className="hero-shell py-6 md:py-14">
        <div className="hero-grid">
          <motion.div
            initial={{ opacity: 0, x: -28, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.55 }}
            className="hero-photo-card"
          >
            <div className="photo-frame">
              <img src={profile.photoData || '/profile-placeholder.svg'} alt={`${profile.name} profile`} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="hero-info-card clean-card"
          >
            <p className="section-eyebrow">Portfolio</p>

            <h1 className="hero-title">
              Suprabath Behera builds reliable backend systems.
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:mt-5 sm:text-lg sm:leading-8">
              Java Backend Developer focused on building clean, practical and database-backed applications using Spring Boot, REST APIs and SQL.
            </p>

            <div className="mt-5 grid gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 sm:mt-6 sm:gap-3 sm:text-sm">
              <span className="inline-flex items-center gap-2">
                <MapPin size={17} /> Andhra Pradesh, India
              </span>
              <span>{profile.headline}</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7 sm:flex sm:flex-wrap">
              <Link
                to="/certificates"
                className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-3 text-sm sm:text-base"
              >
                Certificates <ArrowRight size={17} />
              </Link>

              <Link
                to="/projects"
                className="btn-secondary inline-flex items-center justify-center gap-2 px-4 py-3 text-sm sm:text-base"
              >
                Projects
              </Link>

              <a
                href={resume.fileUrl || '/SUPRABATH_RESUME.pdf'}
                download
                className="btn-secondary inline-flex items-center justify-center gap-2 px-4 py-3 text-sm sm:text-base"
              >
                <Download size={17} /> Resume
              </a>

              <Link
                to="/contact"
                className="btn-secondary inline-flex items-center justify-center gap-2 px-4 py-3 text-sm sm:text-base"
              >
                <Mail size={17} /> Contact
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2 py-5 sm:gap-4 sm:py-8">
        <Reveal>
          <div className="clean-card p-3 text-center sm:p-6 sm:text-left">
            <p className="text-2xl font-black text-slate-950 dark:text-white sm:text-4xl">{certificates.length}</p>
            <p className="mt-1 text-[11px] font-bold leading-tight text-slate-500 dark:text-slate-400 sm:mt-2 sm:text-base">
              Certificates
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="clean-card p-3 text-center sm:p-6 sm:text-left">
            <p className="text-2xl font-black text-slate-950 dark:text-white sm:text-4xl">{projects.length}</p>
            <p className="mt-1 text-[11px] font-bold leading-tight text-slate-500 dark:text-slate-400 sm:mt-2 sm:text-base">
              Projects
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="clean-card p-3 text-center sm:p-6 sm:text-left">
            <p className="text-2xl font-black text-slate-950 dark:text-white sm:text-4xl">{content.skills.length}</p>
            <p className="mt-1 text-[11px] font-bold leading-tight text-slate-500 dark:text-slate-400 sm:mt-2 sm:text-base">
              Skills
            </p>
          </div>
        </Reveal>
      </section>

      <section className="py-12 sm:py-16">
        <Reveal>
          <div className="mb-7">
            <p className="section-eyebrow">Certificates</p>
            <h2 className="section-title">Verified learning proof</h2>
          </div>

          {latestCertificates.length === 0 ? (
            <EmptyState
              title="No certificates added yet"
              message="Upload your real certificates from Admin. Certificate images will be shown clearly without cutting."
            />
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {latestCertificates.map((certificate, index) => (
                  <Reveal key={certificate.id} delay={Math.min(index * 0.04, 0.16)}>
                    <Link
                      to="/certificates"
                      className="certificate-card clean-card block overflow-hidden transition hover:-translate-y-1 hover:shadow-soft"
                    >
                      <div className="certificate-image-wrap">
                        {certificate.imageData ? (
                          <img src={certificate.imageData} alt={certificate.title} />
                        ) : (
                          <p className="font-black text-slate-500">Image not added</p>
                        )}
                      </div>

                      <div className="p-5">
                        <span className="badge">{certificate.category || 'Certificate'}</span>
                        <h3 className="mt-3 text-xl font-black">{certificate.title}</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{certificate.issuer}</p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>

              {certificates.length > 3 && (
                <div className="mt-8 flex justify-center px-4 sm:mt-10">
                  <Link
                    to="/certificates"
                    className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-center sm:w-auto"
                  >
                    View all certificates
                    <ArrowRight size={18} />
                  </Link>
                </div>
              )}
            </>
          )}
        </Reveal>
      </section>

      <section className="py-12 sm:py-16">
        <Reveal>
          <div className="mb-7">
            <p className="section-eyebrow">Projects</p>
            <h2 className="section-title">Practical build proof</h2>
          </div>

          {latestProjects.length === 0 ? (
            <EmptyState
              title="No projects added yet"
              message="Add real projects with screenshots, GitHub links, demo links and optional videos from Admin."
            />
          ) : (
            <>
              <div className="grid gap-6 lg:grid-cols-3">
                {latestProjects.map((project, index) => (
                  <Reveal key={project.id} delay={Math.min(index * 0.04, 0.16)}>
                    <Link
                      to="/projects"
                      className="project-card clean-card group block h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-soft"
                    >
                      <ProjectMedia project={project} className="h-64 rounded-none" />

                      <div className="p-5">
                        <span className="badge">{project.category || 'Project'}</span>
                        <h3 className="mt-3 text-xl font-black">{project.title}</h3>
                        <p className="mt-2 line-clamp-3 text-slate-600 dark:text-slate-300">{project.summary}</p>

                        <div className="mt-4 inline-flex items-center gap-2 font-black text-[var(--accent-strong)]">
                          View project <ExternalLink size={17} />
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>

              {projects.length > 2 && (
                <div className="mt-8 flex justify-center px-4 sm:mt-10">
                  <Link
                    to="/projects"
                    className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-center sm:w-auto"
                  >
                    View all projects
                    <ArrowRight size={18} />
                  </Link>
                </div>
              )}
            </>
          )}
        </Reveal>
      </section>
    </div>
  );
}