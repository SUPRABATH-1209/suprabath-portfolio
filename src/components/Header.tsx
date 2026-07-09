import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Github, Linkedin, Mail, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { usePortfolioStore } from '../hooks/usePortfolioStore';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Skills', href: '/skills' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Projects', href: '/projects' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' }
];

export default function Header() {
  const { content } = usePortfolioStore();
  const { profile } = content;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('portfolio-theme') === 'dark'
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('portfolio-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const searchItems = useMemo(() => {
    const pages = navItems.map((item) => ({
      title: item.label,
      type: 'Page',
      href: item.href
    }));

    const skills = content.skills.map((skill) => ({
      title: skill.name,
      type: 'Skill',
      href: '/skills'
    }));

    const projects = content.projects.map((project) => ({
      title: project.title,
      type: 'Project',
      href: '/projects'
    }));

    const certificates = content.certificates.map((certificate) => ({
      title: certificate.title,
      type: 'Certificate',
      href: '/certificates'
    }));

    return [...pages, ...skills, ...projects, ...certificates].filter((item) => {
      const searchValue = `${item.title} ${item.type}`.toLowerCase();
      return searchValue.includes(query.toLowerCase());
    });
  }, [content, query]);

  const goTo = (href: string) => {
    setSearchOpen(false);
    setMobileOpen(false);
    setQuery('');
    navigate(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-2xl dark:bg-slate-950/80">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-black focus:text-slate-950"
        >
          Skip to main content
        </a>

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img
              src={profile.photoData || '/profile-placeholder.svg'}
              alt={`${profile.name} profile`}
              className="h-11 w-11 shrink-0 rounded-2xl object-cover ring-2 ring-white/70 dark:ring-white/10"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-950 dark:text-white sm:text-base">
                {profile.name}
              </p>
              <p className="truncate text-xs font-bold text-slate-500 dark:text-slate-400">
                Java Backend Developer
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="search-button hidden items-center gap-2 md:inline-flex"
              aria-label="Open search"
            >
              <Search size={17} />
              <span>Search</span>
              <kbd>⌘K</kbd>
            </button>

            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="header-icon"
              aria-label="GitHub profile"
            >
              <Github size={18} />
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="header-icon"
              aria-label="LinkedIn profile"
            >
              <Linkedin size={18} />
            </a>

            <button
              type="button"
              onClick={() => setDarkMode((value) => !value)}
              className="header-icon"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="header-icon lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              className="ml-auto flex h-full w-[86%] max-w-sm flex-col gap-5 overflow-y-auto bg-white p-5 shadow-2xl dark:bg-slate-950"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={profile.photoData || '/profile-placeholder.svg'}
                    alt={`${profile.name} profile`}
                    className="h-12 w-12 rounded-2xl object-cover"
                  />

                  <div className="min-w-0">
                    <p className="truncate font-black text-slate-950 dark:text-white">
                      {profile.name}
                    </p>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Portfolio menu
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="header-icon"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="grid gap-2" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="grid gap-3 pt-2">
                <a href={`mailto:${profile.email}`} className="btn-primary justify-center">
                  <Mail size={18} />
                  Hire Me
                </a>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary justify-center"
                  >
                    <Github size={18} />
                    GitHub
                  </a>

                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary justify-center"
                  >
                    <Linkedin size={18} />
                    LinkedIn
                  </a>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 z-[90] bg-slate-950/70 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              className="mx-auto mt-20 max-w-2xl rounded-[2rem] border border-white/10 bg-white p-4 shadow-2xl dark:bg-slate-950"
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-slate-200 px-2 pb-4 dark:border-white/10">
                <Search className="text-slate-400" size={22} />

                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search pages, skills, projects, certificates..."
                  className="w-full bg-transparent text-base outline-none sm:text-lg"
                  autoFocus
                />

                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="header-icon"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[55vh] overflow-y-auto py-3">
                {searchItems.length === 0 ? (
                  <p className="rounded-2xl p-4 text-center font-bold text-slate-500">
                    No results found.
                  </p>
                ) : (
                  searchItems.slice(0, 10).map((item) => (
                    <button
                      key={`${item.type}-${item.title}`}
                      type="button"
                      onClick={() => goTo(item.href)}
                      className="flex w-full items-center justify-between rounded-2xl p-4 text-left transition hover:bg-[var(--soft)]"
                    >
                      <span className="font-black text-slate-950 dark:text-white">
                        {item.title}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500 dark:bg-slate-900 dark:text-slate-300">
                        {item.type}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}