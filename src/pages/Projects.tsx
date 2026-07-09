import { useMemo, useState } from 'react';
import { ExternalLink, Github, PlayCircle, Search, X } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import EmptyState from '../components/EmptyState';
import Reveal from '../components/Reveal';
import ProjectMedia from '../components/ProjectMedia';
import { usePortfolioStore } from '../hooks/usePortfolioStore';

export default function Projects() {
  const { content } = usePortfolioStore();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  const pageSize = 4;

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(content.projects.map((project) => project.category).filter(Boolean)))],
    [content.projects]
  );

  const filteredProjects = content.projects.filter((project) => {
    const techStackText = Array.isArray(project.techStack) ? project.techStack.join(' ') : '';
    const searchableText = `${project.title} ${project.summary} ${project.category || ''} ${techStackText}`.toLowerCase();

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

  return (
    <div className="py-10">
      <SectionHeader
        eyebrow="Projects"
        title="Projects"
        description="Real project screenshots show first. If a video is added, the screenshot stays visible for 3 seconds and then the video starts automatically muted."
      />

      {content.projects.length === 0 ? (
        <EmptyState
          title="No projects added yet"
          message="Add your real backend projects only. Recruiters should see GitHub links, screenshots, tech stack and practical summaries."
        />
      ) : (
        <>
          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto]">
            <label className="relative block">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
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
                  <X size={18} />
                </button>
              )}
            </label>

            <div className="flex flex-wrap gap-3">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setCategory(item);
                    setPage(1);
                  }}
                  className={item === category ? 'btn-primary py-3' : 'btn-secondary py-3'}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="clean-card p-8 text-center">
              <p className="text-2xl font-black text-slate-950 dark:text-white">No matching projects found</p>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Try another keyword or clear the selected filter.
              </p>

              <button type="button" onClick={clearFilters} className="btn-primary mt-6">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-7 lg:grid-cols-2">
                {visibleProjects.map((project, index) => (
                  <Reveal key={project.id} delay={Math.min(index * 0.04, 0.2)}>
                    <article className="project-card clean-card h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-soft">
                      <ProjectMedia project={project} className="h-72 rounded-none sm:h-80" />

                      <div className="p-5 sm:p-6">
                        <div className="mb-4 flex flex-wrap gap-2">
                          <span className="badge">{project.category || 'Project'}</span>

                          {(project.videoUrl || project.videoData || project.videoBlobKey) && (
                            <span className="badge inline-flex items-center gap-1">
                              <PlayCircle size={15} /> Video
                            </span>
                          )}
                        </div>

                        <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                          {project.title}
                        </h2>

                        <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                          {project.summary}
                        </p>

                        {Array.isArray(project.techStack) && project.techStack.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold dark:bg-slate-900"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-secondary inline-flex items-center justify-center gap-2 py-3"
                            >
                              <Github size={18} /> GitHub
                            </a>
                          )}

                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-primary inline-flex items-center justify-center gap-2 py-3"
                            >
                              <ExternalLink size={18} /> Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>

              {visibleProjects.length < filteredProjects.length && (
                <div className="mt-10 flex justify-center px-4">
                  <button
                    type="button"
                    onClick={() => setPage((value) => value + 1)}
                    className="btn-primary w-full rounded-full px-6 py-4 text-center sm:w-auto"
                  >
                    Load more projects
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