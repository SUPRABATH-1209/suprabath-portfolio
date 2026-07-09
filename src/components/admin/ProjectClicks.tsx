import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Github, Loader2, MousePointerClick } from 'lucide-react';

import { usePortfolioStore } from '../../hooks/usePortfolioStore';
import {
  getCleanPortfolioEvents,
  type PortfolioEvent
} from '../../lib/portfolioAnalytics';

type ProjectStat = {
  total: number;
  github: number;
  demo: number;
};

function createEmptyStat(): ProjectStat {
  return {
    total: 0,
    github: 0,
    demo: 0
  };
}

export default function ProjectClicks() {
  const { content } = usePortfolioStore();

  const [events, setEvents] = useState<PortfolioEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    getCleanPortfolioEvents()
      .then((data) => {
        if (!isMounted) return;
        setEvents(data.filter((event) => event.type === 'project_click'));
      })
      .catch((err) => {
        console.warn('Failed to load project activity:', err);
        if (!isMounted) return;
        setError('Unable to load project activity.');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const statsByProjectId = useMemo(() => {
    const map = new Map<string, ProjectStat>();

    for (const event of events) {
      const projectId = event.metadata?.projectId;

      if (!projectId) continue;

      const current = map.get(projectId) || createEmptyStat();
      const action = event.metadata?.action || '';

      current.total += 1;

      if (action === 'github') {
        current.github += 1;
      }

      if (action === 'demo') {
        current.demo += 1;
      }

      map.set(projectId, current);
    }

    return map;
  }, [events]);

  const sortedProjects = useMemo(() => {
    return [...content.projects].sort((first, second) => {
      const firstStats = statsByProjectId.get(first.id) || createEmptyStat();
      const secondStats = statsByProjectId.get(second.id) || createEmptyStat();

      return secondStats.total - firstStats.total;
    });
  }, [content.projects, statsByProjectId]);

  const totalGithubClicks = sortedProjects.reduce((sum, project) => {
    const stats = statsByProjectId.get(project.id) || createEmptyStat();
    return sum + stats.github;
  }, 0);

  const totalDemoClicks = sortedProjects.reduce((sum, project) => {
    const stats = statsByProjectId.get(project.id) || createEmptyStat();
    return sum + stats.demo;
  }, 0);

  const totalProjectClicks = totalGithubClicks + totalDemoClicks;

  return (
    <section className="space-y-6">
      <div className="clean-card p-6">
        <p className="section-eyebrow">Projects</p>

        <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
          Project Activity
        </h2>

        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          Project GitHub and live demo actions from portfolio visitors.
        </p>

        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <article className="clean-card p-5">
          <MousePointerClick className="mb-3 text-[var(--accent-strong)]" size={24} />
          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
            Total
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {loading ? '...' : totalProjectClicks}
          </h3>
        </article>

        <article className="clean-card p-5">
          <Github className="mb-3 text-[var(--accent-strong)]" size={24} />
          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
            GitHub
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {loading ? '...' : totalGithubClicks}
          </h3>
        </article>

        <article className="clean-card p-5">
          <ExternalLink className="mb-3 text-[var(--accent-strong)]" size={24} />
          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
            Live Demo
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {loading ? '...' : totalDemoClicks}
          </h3>
        </article>
      </div>

      {loading ? (
        <div className="clean-card p-8 text-center">
          <Loader2
            className="mx-auto animate-spin text-[var(--accent-strong)]"
            size={34}
          />
          <p className="mt-4 font-black text-slate-600 dark:text-slate-300">
            Loading project activity...
          </p>
        </div>
      ) : content.projects.length === 0 ? (
        <div className="clean-card p-8 text-center">
          <MousePointerClick
            className="mx-auto text-[var(--accent-strong)]"
            size={34}
          />
          <h3 className="mt-4 text-2xl font-black text-slate-950 dark:text-white">
            No projects added yet
          </h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Project activity will appear after projects are added.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {sortedProjects.map((project) => {
            const stats = statsByProjectId.get(project.id) || createEmptyStat();

            return (
              <article key={project.id} className="clean-card p-5">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <h3 className="text-xl font-black text-slate-950 dark:text-white">
                      {project.title}
                    </h3>

                    <p className="mt-1 font-bold text-slate-500 dark:text-slate-400">
                      {project.category || 'Project'}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                        Total
                      </p>
                      <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                        {stats.total}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                        GitHub
                      </p>
                      <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                        {stats.github}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                        Demo
                      </p>
                      <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                        {stats.demo}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}