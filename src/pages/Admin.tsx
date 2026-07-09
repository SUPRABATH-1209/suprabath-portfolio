import { useState, type FormEvent } from 'react';
import {
  Activity,
  Award,
  BarChart3,
  CheckSquare,
  FileText,
  FolderKanban,
  LogOut,
  Menu,
  Shield,
  X
} from 'lucide-react';

import AnalyticsOverview from '../components/admin/AnalyticsOverview';
import RecruiterActivity from '../components/admin/RecruiterActivity';
import ResumeClicks from '../components/admin/ResumeClicks';
import ProjectClicks from '../components/admin/ProjectClicks';
import CertificateClicks from '../components/admin/CertificateClicks';
import WebsiteChecklist from '../components/admin/WebsiteChecklist';

import {
  isCurrentVisitorAdminExcluded,
  markCurrentVisitorAsAdmin
} from '../lib/portfolioAnalytics';

const ADMIN_PASSWORD = 'suprabath1209';

const tabs = [
  {
    id: 'overview',
    label: 'Overview',
    icon: BarChart3,
    component: AnalyticsOverview
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: Activity,
    component: RecruiterActivity
  },
  {
    id: 'resume',
    label: 'Resume',
    icon: FileText,
    component: ResumeClicks
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderKanban,
    component: ProjectClicks
  },
  {
    id: 'certificates',
    label: 'Certificates',
    icon: Award,
    component: CertificateClicks
  },
  {
    id: 'checklist',
    label: 'Checklist',
    icon: CheckSquare,
    component: WebsiteChecklist
  }
];

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [privateSessionReady, setPrivateSessionReady] = useState(
    isCurrentVisitorAdminExcluded()
  );

  const activeItem = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const ActiveComponent = activeItem.component;
  const ActiveIcon = activeItem.icon;

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    if (password !== ADMIN_PASSWORD) {
      setError('Wrong password. Try again.');
      return;
    }

    setIsOpening(true);

    try {
      await markCurrentVisitorAsAdmin();
      setPrivateSessionReady(true);
    } catch {
      setPrivateSessionReady(isCurrentVisitorAdminExcluded());
    } finally {
      setIsUnlocked(true);
      setPassword('');
      setError('');
      setIsOpening(false);
    }
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    setPassword('');
    setError('');
    setActiveTab('overview');
    setMobileMenuOpen(false);
  };

  const selectTab = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  if (!isUnlocked) {
    return (
      <section className="space-y-6">
        <div className="clean-card p-6">
          <p className="section-eyebrow">Admin</p>

          <h1 className="mt-2 flex items-center gap-3 text-3xl font-black text-slate-950 dark:text-white">
            <Shield className="text-[var(--accent-strong)]" />
            Private Dashboard
          </h1>

          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
            Authorized access only.
          </p>
        </div>

        <form onSubmit={handleLogin} className="clean-card mx-auto max-w-xl p-6">
          <label
            htmlFor="admin-password"
            className="text-sm font-black uppercase tracking-[0.18em] text-slate-400"
          >
            Password
          </label>

          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            className="form-input mt-3"
            autoComplete="current-password"
          />

          {error && (
            <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isOpening}
            className="btn-primary mt-5 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isOpening ? 'Opening...' : 'Continue'}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="clean-card p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="section-eyebrow">Admin</p>

            <h1 className="mt-2 flex items-center gap-3 text-3xl font-black text-slate-950 dark:text-white">
              <Shield className="text-[var(--accent-strong)]" />
              Dashboard
            </h1>

            <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
              Portfolio dashboard.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                Dashboard ready
              </span>

              <span
                className={
                  privateSessionReady
                    ? 'inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-black text-sky-700 dark:bg-sky-400/10 dark:text-sky-300'
                    : 'inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-700 dark:bg-amber-400/10 dark:text-amber-300'
                }
              >
                {privateSessionReady ? 'Private session active' : 'Private session pending'}
              </span>
            </div>
          </div>

          <button type="button" onClick={handleLogout} className="btn-secondary">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="clean-card flex w-full items-center justify-between p-4 text-left"
        >
          <span className="flex items-center gap-3 font-black text-slate-950 dark:text-white">
            <ActiveIcon size={20} className="text-[var(--accent-strong)]" />
            {activeItem.label}
          </span>

          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {mobileMenuOpen && (
          <div className="clean-card mt-3 grid gap-2 p-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => selectTab(tab.id)}
                  className={
                    isActive
                      ? 'flex items-center gap-3 rounded-2xl bg-[var(--accent)] px-4 py-3 text-left text-sm font-black text-white'
                      : 'flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
                  }
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="hidden flex-wrap gap-3 lg:flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => selectTab(tab.id)}
              className={
                isActive
                  ? 'btn-primary inline-flex items-center gap-2 py-3'
                  : 'btn-secondary inline-flex items-center gap-2 py-3'
              }
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <ActiveComponent />
    </section>
  );
}