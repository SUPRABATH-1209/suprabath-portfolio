import { useMemo, useState, type ComponentType } from 'react';
import {
  BarChart3,
  ChevronDown,
  Code2,
  Database,
  Filter,
  Layers3,
  Network,
  X
} from 'lucide-react';

import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import { usePortfolioStore } from '../hooks/usePortfolioStore';

const levelWidth = {
  Beginner: '38%',
  Intermediate: '70%',
  Advanced: '90%'
} as const;

const levelGradients = {
  Beginner: 'linear-gradient(90deg, #38bdf8, #6366f1)',
  Intermediate: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
  Advanced: 'linear-gradient(90deg, #22c55e, #06b6d4, #6366f1)'
} as const;

type SkillLogoConfig = {
  src?: string;
  fallbackText: string;
  FallbackIcon: ComponentType<{ size?: number; className?: string }>;
  gradient: string;
};

const deviconBase = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

const skillLogos: Record<string, SkillLogoConfig> = {
  Java: {
    src: `${deviconBase}/java/java-original.svg`,
    fallbackText: 'Java',
    FallbackIcon: Code2,
    gradient: 'linear-gradient(135deg, #f97316, #ef4444)'
  },
  'Spring Boot': {
    src: `${deviconBase}/spring/spring-original.svg`,
    fallbackText: 'Spring',
    FallbackIcon: Code2,
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)'
  },
  Hibernate: {
    src: `${deviconBase}/hibernate/hibernate-original.svg`,
    fallbackText: 'Hibernate',
    FallbackIcon: Database,
    gradient: 'linear-gradient(135deg, #facc15, #ca8a04)'
  },
  MySQL: {
    src: `${deviconBase}/mysql/mysql-original.svg`,
    fallbackText: 'MySQL',
    FallbackIcon: Database,
    gradient: 'linear-gradient(135deg, #0ea5e9, #2563eb)'
  },
  SQL: {
    src: `${deviconBase}/azuresqldatabase/azuresqldatabase-original.svg`,
    fallbackText: 'SQL',
    FallbackIcon: Database,
    gradient: 'linear-gradient(135deg, #38bdf8, #4f46e5)'
  },
  'REST APIs': {
    fallbackText: 'API',
    FallbackIcon: Network,
    gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)'
  },
  Git: {
    src: `${deviconBase}/git/git-original.svg`,
    fallbackText: 'Git',
    FallbackIcon: Code2,
    gradient: 'linear-gradient(135deg, #f97316, #dc2626)'
  },
  GitHub: {
    src: `${deviconBase}/github/github-original.svg`,
    fallbackText: 'GitHub',
    FallbackIcon: Code2,
    gradient: 'linear-gradient(135deg, #111827, #475569)'
  },
  Postman: {
    src: `${deviconBase}/postman/postman-original.svg`,
    fallbackText: 'Postman',
    FallbackIcon: Network,
    gradient: 'linear-gradient(135deg, #fb923c, #f97316)'
  },
  'Python Basic': {
    src: `${deviconBase}/python/python-original.svg`,
    fallbackText: 'Python',
    FallbackIcon: Code2,
    gradient: 'linear-gradient(135deg, #2563eb, #facc15)'
  },
  'Power BI': {
    src: `${deviconBase}/powerbi/powerbi-original.svg`,
    fallbackText: 'Power BI',
    FallbackIcon: BarChart3,
    gradient: 'linear-gradient(135deg, #facc15, #f59e0b)'
  },
  HTML: {
    src: `${deviconBase}/html5/html5-original.svg`,
    fallbackText: 'HTML',
    FallbackIcon: Code2,
    gradient: 'linear-gradient(135deg, #f97316, #ef4444)'
  },
  CSS: {
    src: `${deviconBase}/css3/css3-original.svg`,
    fallbackText: 'CSS',
    FallbackIcon: Code2,
    gradient: 'linear-gradient(135deg, #38bdf8, #2563eb)'
  },
  JavaScript: {
    src: `${deviconBase}/javascript/javascript-original.svg`,
    fallbackText: 'JavaScript',
    FallbackIcon: Code2,
    gradient: 'linear-gradient(135deg, #fde047, #eab308)'
  }
};

function getSkillLogo(skillName: string) {
  return (
    skillLogos[skillName] || {
      fallbackText: skillName,
      FallbackIcon: Code2,
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
    }
  );
}

function SkillLogo({
  skillName,
  config
}: {
  skillName: string;
  config: SkillLogoConfig;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const FallbackIcon = config.FallbackIcon;

  return (
    <div
      className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white shadow-lg ring-1 ring-black/5 transition duration-300 group-hover:scale-105 dark:bg-slate-950 dark:ring-white/10"
      aria-label={`${skillName} logo`}
    >
      {config.src && !imageFailed ? (
        <img
          src={config.src}
          alt={`${skillName} logo`}
          className="h-8 w-8 object-contain"
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div
          className="grid h-full w-full place-items-center rounded-2xl text-white"
          style={{ background: config.gradient }}
        >
          <FallbackIcon size={23} />
        </div>
      )}
    </div>
  );
}

export default function Skills() {
  const { content } = usePortfolioStore();
  const [category, setCategory] = useState('All');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(content.skills.map((skill) => skill.category)))],
    [content.skills]
  );

  const skills =
    category === 'All'
      ? content.skills
      : content.skills.filter((skill) => skill.category === category);

  const selectedCount = skills.length;

  const chooseCategory = (item: string) => {
    setCategory(item);
    setMobileFilterOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <SectionHeader
        eyebrow="Skills"
        title="Backend skills, clearly grouped."
        description="Java, Spring Boot, REST APIs, SQL and development tools I use to build practical backend projects."
      />

      <section className="clean-card overflow-hidden p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent)] text-white shadow-lg shadow-indigo-500/20">
              <Layers3 size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white sm:text-xl">
                Skill Categories
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Showing{' '}
                <span className="font-black text-[var(--accent-strong)]">
                  {selectedCount}
                </span>{' '}
                skill{selectedCount === 1 ? '' : 's'} in{' '}
                <span className="font-black text-slate-800 dark:text-slate-200">
                  {category}
                </span>
                .
              </p>
            </div>
          </div>

          <div className="hidden flex-wrap gap-3 lg:flex">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => chooseCategory(item)}
                className={
                  item === category
                    ? 'btn-primary px-5 py-3 text-sm'
                    : 'btn-secondary px-5 py-3 text-sm'
                }
              >
                {item}
              </button>
            ))}
          </div>

          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setMobileFilterOpen((value) => !value)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm dark:border-white/10 dark:bg-slate-950"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900">
                  <Filter size={18} />
                </span>

                <span>
                  <span className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Filter
                  </span>
                  <span className="block text-sm font-black text-slate-950 dark:text-white">
                    {category}
                  </span>
                </span>
              </span>

              {mobileFilterOpen ? <X size={19} /> : <ChevronDown size={19} />}
            </button>

            {mobileFilterOpen && (
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-950">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => chooseCategory(item)}
                    className={
                      item === category
                        ? 'rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-black text-white shadow-lg shadow-indigo-500/20'
                        : 'rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {skills.map((skill, index) => {
          const logo = getSkillLogo(skill.name);
          const width = levelWidth[skill.level as keyof typeof levelWidth] || '60%';
          const barGradient =
            levelGradients[skill.level as keyof typeof levelGradients] ||
            'linear-gradient(90deg, #6366f1, #a855f7)';

          return (
            <Reveal key={skill.id} delay={index * 0.035}>
              <article className="group clean-card h-full overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <SkillLogo skillName={skill.name} config={logo} />

                    <div className="min-w-0">
                      <h3 className="truncate text-xl font-black text-slate-950 dark:text-white">
                        {skill.name}
                      </h3>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    {skill.category}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Level
                  </span>

                  <span className="text-sm font-black text-[var(--accent-strong)]">
                    {skill.level}
                  </span>
                </div>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width,
                      background: barGradient,
                      boxShadow: '0 0 18px rgba(99, 102, 241, 0.35)'
                    }}
                  />
                </div>
              </article>
            </Reveal>
          );
        })}
      </section>
    </div>
  );
}