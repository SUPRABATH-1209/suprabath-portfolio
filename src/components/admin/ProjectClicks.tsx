import { ExternalLink, Github, MousePointerClick } from 'lucide-react';
import { usePortfolioStore } from '../../hooks/usePortfolioStore';

export default function ProjectClicks() {
  const { content } = usePortfolioStore();

  return (
    <section className="space-y-6">
      <div className="clean-card p-6">
        <p className="section-eyebrow">Project Clicks</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
          Project Interest Tracking
        </h2>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          Later this section will show which projects recruiters opened, which GitHub links they clicked,
          and which demo links received attention.
        </p>
      </div>

      {content.projects.length === 0 ? (
        <div className="clean-card p-8 text-center">
          <MousePointerClick className="mx-auto text-[var(--accent-strong)]" size={34} />
          <h3 className="mt-4 text-2xl font-black text-slate-950 dark:text-white">
            No projects added yet
          </h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            After adding projects, this panel will be ready to track project views and clicks.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {content.projects.map((project) => (
            <article key={project.id} className="clean-card p-6">
              <h3 className="text-xl font-black text-slate-950 dark:text-white">
                {project.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {project.category || 'Project'}
              </p>

              <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
                {project.githubUrl && (
                  <span className="btn-secondary inline-flex items-center justify-center gap-2 py-3">
                    <Github size={17} /> GitHub clicks: Not connected
                  </span>
                )}

                {project.demoUrl && (
                  <span className="btn-primary inline-flex items-center justify-center gap-2 py-3">
                    <ExternalLink size={17} /> Demo clicks: Not connected
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
