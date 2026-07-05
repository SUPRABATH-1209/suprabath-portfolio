import { useMemo, useState } from 'react';
import { ExternalLink, Github, PlayCircle, Search } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import EmptyState from '../components/EmptyState';
import Reveal from '../components/Reveal';
import ProjectMedia from '../components/ProjectMedia';
import { usePortfolioStore } from '../hooks/usePortfolioStore';

export default function Projects() {
  const { content } = usePortfolioStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const categories = useMemo(() => ['All', ...Array.from(new Set(content.projects.map((project) => project.category).filter(Boolean)))], [content.projects]);
  const projects = content.projects.filter((project) => {
    const matchesQuery = `${project.title} ${project.summary} ${project.techStack.join(' ')}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'All' || project.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="py-10">
      <SectionHeader eyebrow="Projects" title="Projects" description="Real project screenshots show first. If a video is added, the screenshot stays visible for 3 seconds and then the video starts automatically muted." />

      {content.projects.length === 0 ? (
        <EmptyState title="No projects added yet" message="Add your real backend projects only. Recruiters should see GitHub links, screenshots, tech stack and practical summaries." />
      ) : (
        <>
          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects by title, stack or summary" className="form-input pl-12" />
            </label>
            <div className="flex flex-wrap gap-3">
              {categories.map((item) => (
                <button key={item} onClick={() => setCategory(item)} className={item === category ? 'btn-primary py-3' : 'btn-secondary py-3'}>{item}</button>
              ))}
            </div>
          </div>
          <div className="grid gap-7 lg:grid-cols-2">
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={Math.min(index * .04, .2)}>
                <article className="project-card clean-card h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-soft">
                  <ProjectMedia project={project} className="h-80 rounded-none" />
                  <div className="p-6">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="badge">{project.category || 'Project'}</span>
                      {(project.videoUrl || project.videoData || project.videoBlobKey) && <span className="badge"><PlayCircle size={15} /> Video</span>}
                    </div>
                    <h2 className="text-2xl font-black text-slate-950 dark:text-white">{project.title}</h2>
                    <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{project.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.techStack.map((tech) => <span key={tech} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold dark:bg-slate-900">{tech}</span>)}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-secondary inline-flex items-center gap-2 py-3"><Github size={18} /> GitHub</a>}
                      {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center gap-2 py-3"><ExternalLink size={18} /> Live Demo</a>}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
