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

    const cleanQuery = query.toLowerCase().trim();

    return [...pages, ...skills, ...projects, ...certificates].filter(
      (item) =>
        item.title.toLowerCase().includes(cleanQuery) ||
        item.type.toLowerCase().includes(cleanQuery)
    );
  }, [content, query]);

  const goTo = (href: string) => {
    setSearchOpen(false);
    setMobileOpen(false);
    setQuery('');
    navigate(href);
  };

  return (
    <>
      <header className="site-header sticky top-0 z-50 border-b backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-2 px-3 sm:h-20 sm:px-5 lg:px-8">
          <Link
            to="/"
            className="mobile-brand flex min-w-0 flex-1 items-center gap-2 overflow-hidden sm:gap-3"
            aria-label="Go to home"
          >
            <div className="header-avatar h-10 w-10 shrink-0 sm:h-12 sm:w-12">
              <img
                src={content.profile.photoData || '/profile-placeholder.svg'}
                alt={`${content.profile.name} profile`}
              />
            </div>

            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="mobile-brand-name truncate text-[0.88rem] font-black leading-tight text-[var(--text)] sm:text-base">
                {content.profile.name}
              </p>
              <p className="mobile-brand-role truncate text-[0.68rem] font-extrabold leading-tight text-[var(--muted)] sm:text-xs">
                Java Backend Developer
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mobile-header-actions flex shrink-0 items-center gap-1.5 sm:gap-2">
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
            className="fixed inset-0 z-[80] bg-black/60 p-3 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              className="ml-auto flex h-full w-full max-w-sm flex-col overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface-solid)] shadow-2xl"
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[var(--line)] p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="header-avatar h-11 w-11">
                    <img
                      src={content.profile.photoData || '/profile-placeholder.svg'}
                      alt={`${content.profile.name} profile`}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-black text-[var(--text)]">
                      {content.profile.name}
                    </p>
                    <p className="truncate text-xs font-bold text-[var(--muted)]">
                      Java Backend Developer
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="header-icon"
                  aria-label="Close menu"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="btn-secondary mb-4 flex w-full items-center justify-center gap-2 py-3"
                >
                  <Search size={18} />
                  Search portfolio
                </button>

                <nav className="grid gap-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `nav-link flex items-center justify-between ${
                          isActive ? 'active' : ''
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <a
                    href={content.profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary flex items-center justify-center py-3"
                    aria-label="GitHub"
                  >
                    <Github size={18} />
                  </a>

                  <a
                    href={content.profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary flex items-center justify-center py-3"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>

                  <a
                    href={`mailto:${content.profile.email}`}
                    className="btn-secondary flex items-center justify-center py-3"
                    aria-label="Email"
                  >
                    <Mail size={18} />
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
            className="fixed inset-0 z-[90] grid place-items-start bg-black/55 p-3 pt-20 backdrop-blur-sm sm:p-6 sm:pt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              className="mx-auto w-full max-w-2xl rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface-solid)] p-4 shadow-2xl"
              initial={{ y: -18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] px-4 py-3">
                <Search size={18} className="text-[var(--muted)]" />
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
                  aria-label="Close search"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-3 max-h-[22rem] overflow-y-auto">
                {searchItems.length === 0 ? (
                  <div className="rounded-2xl p-4 text-sm font-bold text-[var(--muted)]">
                    No results found.
                  </div>
                ) : (
                  searchItems.slice(0, 10).map((item) => (
                    <button
                      key={`${item.type}-${item.title}`}
                      type="button"
                      onClick={() => goTo(item.href)}
                      className="flex w-full items-center justify-between rounded-2xl p-4 text-left hover:bg-[var(--soft)]"
                    >
                      <span className="font-black text-[var(--text)]">
                        {item.title}
                      </span>
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">
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