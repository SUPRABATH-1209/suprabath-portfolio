import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Github, Linkedin, Mail, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('portfolio-theme') === 'dark');
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
    const pages = navItems.map((item) => ({ title: item.label, type: 'Page', href: item.href }));
    const skills = content.skills.map((skill) => ({ title: skill.name, type: 'Skill', href: '/skills' }));
    const projects = content.projects.map((project) => ({ title: project.title, type: 'Project', href: '/projects' }));
    const certificates = content.certificates.map((certificate) => ({ title: certificate.title, type: 'Certificate', href: '/certificates' }));
    return [...pages, ...skills, ...projects, ...certificates].filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) || item.type.toLowerCase().includes(query.toLowerCase())
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
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-5 lg:px-8">
          <Link to="/" className="brand-lockup" aria-label="Go to home">
            <span className="header-avatar">
              <img src={content.profile.photoData || '/profile-placeholder.svg'} alt={`${content.profile.name} profile`} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-black leading-none text-[var(--text)]">{content.profile.name}</span>
              <span className="mt-1 block truncate text-xs font-bold text-[var(--muted)]">Java Backend Developer</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink key={item.href} to={item.href} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="search-button hidden items-center gap-2 md:inline-flex" aria-label="Open search">
              <Search size={17} /> Search <kbd>⌘K</kbd>
            </button>
            <a href={content.profile.github} target="_blank" rel="noreferrer" className="header-icon hidden sm:inline-flex" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href={content.profile.linkedin} target="_blank" rel="noreferrer" className="header-icon hidden sm:inline-flex" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <button onClick={() => setDarkMode((value) => !value)} className="header-icon" aria-label="Toggle dark mode">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setMobileOpen(true)} className="header-icon lg:hidden" aria-label="Open menu">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[80] bg-slate-950/55 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 260 }} className="ml-auto h-full w-[88%] max-w-sm overflow-y-auto bg-[var(--surface-solid)] p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <img src={content.profile.photoData || '/profile-placeholder.svg'} alt="" className="h-12 w-12 rounded-2xl object-cover" />
                  <div className="min-w-0">
                    <p className="truncate font-black">{content.profile.name}</p>
                    <p className="text-sm font-bold text-[var(--muted)]">Portfolio menu</p>
                  </div>
                </div>
                <button className="header-icon" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={20} /></button>
              </div>
              <nav className="mt-8 grid gap-2">
                {navItems.map((item) => (
                  <NavLink key={item.href} to={item.href} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-8 grid gap-3">
                <a href={`mailto:${content.profile.email}`} className="btn-primary inline-flex w-full items-center justify-center gap-2"><Mail size={18} /> Hire Me</a>
                <button type="button" onClick={() => goTo('/admin')} className="btn-secondary inline-flex w-full items-center justify-center gap-2">Admin Login</button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div className="fixed inset-0 z-[90] grid place-items-start bg-slate-950/60 p-4 pt-24 backdrop-blur-sm md:place-items-center md:pt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSearchOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: .96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .97, y: 20 }} className="w-full max-w-2xl overflow-hidden rounded-[1.75rem] bg-[var(--surface-solid)] shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center gap-3 border-b border-[var(--line)] p-4">
                <Search className="text-[var(--muted)]" />
                <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pages, skills, projects, certificates..." className="w-full bg-transparent text-base outline-none sm:text-lg" />
                <button onClick={() => setSearchOpen(false)} aria-label="Close search"><X /></button>
              </div>
              <div className="max-h-[26rem] overflow-y-auto p-3">
                {searchItems.length === 0 ? <p className="p-6 text-center text-[var(--muted)]">No results found.</p> : searchItems.slice(0, 10).map((item) => (
                  <button key={`${item.type}-${item.title}`} onClick={() => goTo(item.href)} className="flex w-full items-center justify-between rounded-2xl p-4 text-left hover:bg-[var(--soft)]">
                    <span className="font-black">{item.title}</span>
                    <span className="badge">{item.type}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
