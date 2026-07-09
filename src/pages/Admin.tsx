import { useState, type FormEvent } from 'react';
import {
  Activity,
  Award,
  BarChart3,
  CheckSquare,
  FileText,
  FolderKanban,
  KeyRound,
  Loader2,
  LogOut,
  Menu,
  Save,
  Shield,
  X
} from 'lucide-react';

import AnalyticsOverview from '../components/admin/AnalyticsOverview';
import RecruiterActivity from '../components/admin/RecruiterActivity';
import ResumeClicks from '../components/admin/ResumeClicks';
import ProjectClicks from '../components/admin/ProjectClicks';
import CertificateClicks from '../components/admin/CertificateClicks';
import WebsiteChecklist from '../components/admin/WebsiteChecklist';
import { updateAdminPassword, verifyAdminPassword } from '../lib/adminPassword';
import {
  isCurrentVisitorAdminExcluded,
  markCurrentVisitorAsAdmin
} from '../lib/portfolioAnalytics';

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
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isMarkingAdminDevice, setIsMarkingAdminDevice] = useState(false);
  const [adminDeviceExcluded, setAdminDeviceExcluded] = useState(
    isCurrentVisitorAdminExcluded()
  );

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);
  const [passwordUpdateError, setPasswordUpdateError] = useState('');
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState('');

  const activeItem = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const ActiveComponent = activeItem.component;
  const ActiveIcon = activeItem.icon;

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    setError('');
    setIsCheckingPassword(true);

    try {
      const isCorrect = await verifyAdminPassword(password);

      if (!isCorrect) {
        setError('Wrong password. Try again.');
        return;
      }

      setIsMarkingAdminDevice(true);

      try {
        await markCurrentVisitorAsAdmin();
        setAdminDeviceExcluded(true);
      } catch {
        setAdminDeviceExcluded(isCurrentVisitorAdminExcluded());
      }

      setIsUnlocked(true);
      setPassword('');
      setError('');
    } catch (err) {
      console.warn('Admin password check failed:', err);
      setError('Unable to verify password. Check Firebase rules and env variables.');
    } finally {
      setIsCheckingPassword(false);
      setIsMarkingAdminDevice(false);
    }
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    setPassword('');
    setError('');
    setActiveTab('overview');
    setMobileMenuOpen(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordUpdateError('');
    setPasswordUpdateSuccess('');
  };

  const selectTab = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const updatePasswordField = (
    field: 'currentPassword' | 'newPassword' | 'confirmPassword',
    value: string
  ) => {
    setPasswordForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handlePasswordUpdate = async (event: FormEvent) => {
    event.preventDefault();

    setPasswordUpdateError('');
    setPasswordUpdateSuccess('');

    if (!passwordForm.currentPassword.trim()) {
      setPasswordUpdateError('Enter current password.');
      return;
    }

    if (!passwordForm.newPassword.trim()) {
      setPasswordUpdateError('Enter new password.');
      return;
    }

    if (passwordForm.newPassword.trim().length < 8) {
      setPasswordUpdateError('New password must be at least 8 characters.');
      return;
    }

    if (passwordForm.newPassword.trim() !== passwordForm.confirmPassword.trim()) {
      setPasswordUpdateError('New password and confirm password do not match.');
      return;
    }

    setPasswordUpdateLoading(true);

    try {
      await updateAdminPassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setPasswordUpdateSuccess('Password updated successfully.');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to update password.';
      setPasswordUpdateError(message);
    } finally {
      setPasswordUpdateLoading(false);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-4">
        <section className="clean-card w-full max-w-xl p-6 sm:p-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--accent)] text-white shadow-lg shadow-indigo-500/20">
            <Shield size={26} />
          </div>

          <div className="mt-6 text-center">
            <p className="section-eyebrow">Admin</p>

            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
              Private Dashboard
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Authorized access only.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-300">
                Password
              </span>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                className="form-input"
                autoComplete="current-password"
                required
              />
            </label>

            {error && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isCheckingPassword || isMarkingAdminDevice}
              className="btn-primary inline-flex w-full items-center justify-center gap-2 py-4 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {(isCheckingPassword || isMarkingAdminDevice) && (
                <Loader2 className="animate-spin" size={18} />
              )}
              {isCheckingPassword || isMarkingAdminDevice
                ? 'Opening Dashboard...'
                : 'Continue'}
            </button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="clean-card p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--accent)] text-white shadow-lg shadow-indigo-500/20">
              <ActiveIcon size={22} />
            </div>

            <div>
              <p className="section-eyebrow">Admin</p>

              <h1 className="mt-1 text-3xl font-black text-slate-950 dark:text-white">
                Dashboard
              </h1>

              <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                Portfolio dashboard.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                  Dashboard ready
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  {adminDeviceExcluded
                    ? 'Private session active'
                    : 'Private session pending'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="btn-secondary justify-center py-3"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </section>

      <section className="clean-card p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-[var(--accent-strong)] dark:bg-slate-900">
                <KeyRound size={21} />
              </div>

              <div>
                <p className="section-eyebrow">Security</p>

                <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                  Change Admin Password
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Update your admin password from desktop or mobile. The new password
              is saved in Firebase.
            </p>
          </div>

          <form onSubmit={handlePasswordUpdate} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-sm font-black text-slate-700 dark:text-slate-300">
                  Current Password
                </span>

                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    updatePasswordField('currentPassword', event.target.value)
                  }
                  placeholder="Current password"
                  className="form-input"
                  autoComplete="current-password"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-slate-700 dark:text-slate-300">
                  New Password
                </span>

                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    updatePasswordField('newPassword', event.target.value)
                  }
                  placeholder="New password"
                  className="form-input"
                  autoComplete="new-password"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-slate-700 dark:text-slate-300">
                  Confirm Password
                </span>

                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    updatePasswordField('confirmPassword', event.target.value)
                  }
                  placeholder="Confirm password"
                  className="form-input"
                  autoComplete="new-password"
                />
              </label>
            </div>

            {passwordUpdateError && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:bg-red-500/10 dark:text-red-300">
                {passwordUpdateError}
              </p>
            )}

            {passwordUpdateSuccess && (
              <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                {passwordUpdateSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={passwordUpdateLoading}
              className="btn-primary inline-flex w-full items-center justify-center gap-2 py-4 sm:w-auto sm:px-6"
            >
              {passwordUpdateLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {passwordUpdateLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </section>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="clean-card flex w-full items-center justify-between p-4 text-left"
        >
          <span className="inline-flex items-center gap-3 font-black text-slate-950 dark:text-white">
            <ActiveIcon size={20} />
            {activeItem.label}
          </span>

          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {mobileMenuOpen && (
          <div className="mt-3 grid gap-2 rounded-3xl border border-slate-200 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-slate-950">
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
    </div>
  );
}