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
    label: 'Recruiter Activity',
    icon: Activity,
    component: RecruiterActivity
  },
  {
    id: 'resume',
    label: 'Resume Clicks',
    icon: FileText,
    component: ResumeClicks
  },
  {
    id: 'projects',
    label: 'Project Clicks',
    icon: FolderKanban,
    component: ProjectClicks
  },
  {
    id: 'certificates',
    label: 'Certificate Clicks',
    icon: Award,
    component: CertificateClicks
  },
  {
    id: 'checklist',
    label: 'Website Checklist',
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

  const activeItem = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const ActiveComponent = activeItem.component;
  const ActiveIcon = activeItem.icon;

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      setPassword('');
      setError('');
      return;
    }

    setError('Wrong password. Try again.');
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
      <div className="py-8 sm:py-10">
        <div className="mx-auto max-w-xl">
          <div className="clean-card p-5 sm:p-8">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900 sm:h-14 sm:w-14">
              <Shield size={24} />
            </div>

            <p className="section-eyebrow">Admin</p>
            <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">
              Analytics Dashboard
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-7">
              This admin panel is only for analytics setup and portfolio readiness checks.
              Editing sections were removed because they only worked locally before Firebase.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4 sm:mt-7">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-300">
                  Admin password
                </span>

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter admin password"
                  className="form-input"
                />
              </label>

              {error && (
                <p className="rounded-2xl bg-red-100 px-4 py-3 text-sm font-bold text-red-700 dark:bg-red-500/10 dark:text-red-300">
                  {error}
                </p>
              )}

              <button type="submit" className="btn-primary w-full justify-center py-3">
                Open Dashboard
              </button>
            </form>

            <div className="mt-5 rounded-2xl bg-amber-100 p-4 text-xs font-bold leading-5 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300 sm:mt-6 sm:text-sm">
              Firebase is not connected yet. Real visitor data will be added later after final portfolio fixes.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-10">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">Admin</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
            Analytics Dashboard
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:mt-3 sm:text-base">
            Focused on analytics, recruiter activity, click tracking and website readiness.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="btn-secondary inline-flex items-center justify-center gap-2 py-3"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="mb-6 block sm:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="clean-card flex w-full items-center justify-between p-4 text-left"
        >
          <span className="inline-flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900">
              <ActiveIcon size={20} />
            </span>

            <span>
              <span className="block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Dashboard section
              </span>
              <span className="block text-base font-black text-slate-950 dark:text-white">
                {activeItem.label}
              </span>
            </span>
          </span>

          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {mobileMenuOpen && (
          <div className="mt-3 grid gap-2 rounded-[1.5rem] border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-800 dark:bg-slate-950">
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

      <div className="mb-8 hidden flex-wrap gap-3 sm:flex">
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
    </div>
  );
}