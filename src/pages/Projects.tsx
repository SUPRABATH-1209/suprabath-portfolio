import { useMemo, useState } from 'react';
import { ExternalLink, Github, PlayCircle, Search, X } from 'lucide-react';

import SectionHeader from '../components/SectionHeader';
import EmptyState from '../components/EmptyState';
import Reveal from '../components/Reveal';
import ProjectMedia from '../components/ProjectMedia';
import { usePortfolioStore } from '../hooks/usePortfolioStore';
import { trackPortfolioEvent } from '../lib/portfolioAnalytics';
import type { Project } from '../types/portfolio';

export default function Projects() {
  const { content } = usePortfolioStore();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  const pageSize = 4;

  const categories = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(content.projects.map((project) => project.category).filter(Boolean))
      )
    ],
    [content.projects]
  );

  const filteredProjects = content.projects.filter((project) => {
    const techStackText = Array.isArray(project.techStack)
      ? project.techStack.join(' ')
      : '';

    const searchableText = `${project.title} ${project.summary} ${
      project.category || ''
    } ${techStackText}`.toLowerCase();

    const matchesQuery = searchableText.includes(query.toLowerCase());
    const matchesCategory = category === 'All' || project.category === category;

    return matchesQuery && matchesCategory;
  });

  const visibleProjects = filteredProjects.slice(0, page * pageSize);

  const clearFilters = () => {
    setQuery('');
    setCategory('All');
    setPage(1);
  };

  const trackProject = (
    project: Project,
    action: 'github' | 'demo',
    targetUrl?: string
  ) => {
    trackPortfolioEvent('project_click', {
      action,
      projectId: project.id,
      projectTitle: project.title,
      category: project.category || 'Project',
      targetUrl: targetUrl || ''
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <SectionHeader
        eyebrow="Projects"
        title="Practical Backend Projects"
        description="Selected projects that show backend development, API design, database work and practical implementation."
      />

      {content.projects.length === 0 ? (
        <EmptyState
          title="No projects added yet"
          message="Projects will appear here after they are added to the portfolio."
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
                  placeholder="Search projects by title, stack or summary"
                  className="form-input pl-12"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setPage(1);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                    aria-label="Clear search"
                  >
                    <X size={17} />
                  </button>
                )}
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
                        ? 'btn-primary py-3'
                        : 'btn-secondary py-3'
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {filteredProjects.length === 0 ? (
            <EmptyState
              title="No projects matched your search"
              message="Try a different keyword or reset the selected filter."
              action={false}
            />
          ) : (
            <>
              <section className="grid gap-6 lg:grid-cols-2">
                {visibleProjects.map((project, index) => (
                  <Reveal key={project.id} delay={index * 0.04}>
                    <article className="clean-card h-full overflow-hidden">
                      <ProjectMedia project={project} className="h-[260px]" />

                      <div className="p-5">
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                            {project.category || 'Project'}
                          </span>

                          {(project.videoUrl ||
                            project.videoData ||
                            project.videoBlobKey) && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                              <PlayCircle size={14} />
                              Video
                            </span>
                          )}
                        </div>

                        <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                          {project.title}
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                          {project.summary}
                        </p>

                        {Array.isArray(project.techStack) &&
                          project.techStack.length > 0 && (
                            <div className="mt-5 flex flex-wrap gap-2">
                              {project.techStack.map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-500 dark:border-white/10 dark:text-slate-400"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() =>
                                trackProject(project, 'github', project.githubUrl)
                              }
                              className="btn-secondary justify-center"
                            >
                              <Github size={18} />
                              GitHub
                            </a>
                          )}

                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() =>
                                trackProject(project, 'demo', project.demoUrl)
                              }
                              className="btn-primary justify-center"
                            >
                              <ExternalLink size={18} />
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </section>

              {visibleProjects.length < filteredProjects.length && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setPage((value) => value + 1)}
                    className="btn-primary w-full rounded-full px-6 py-4 text-center sm:w-auto"
                  >
                    View more projects
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}