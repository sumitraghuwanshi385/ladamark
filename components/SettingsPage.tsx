import React, { useState, useRef, useEffect } from 'react';
import { type InfoModalView, type UserProfile } from '../App';
import { type LabeledItem, type AISpeedMode, type View } from './MainApplication';
import { type Plan, PLAN_DETAILS } from './plans';
import ExportModal from './ExportModal';
import ConfirmationModal from './ConfirmationModal';

import { auth, db } from '../firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

// --- ICONS ---
const SettingsIcon = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33-1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const UserCircleIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const EyeIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CreditCardIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LockClosedIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>;
const DownloadIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const BookOpenIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const PencilIcon = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /><path d="M19.5 7.125l-8.832 8.831" /></svg>;
const TrashIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 6h18" /></svg>;
const PlansIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>
);
const SpeedIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ConfidenceIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const CrossIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- INTERFACES ---
interface SettingsPageProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;

  onClearCache: () => void;
  onLogout: () => void;

  labeledItems: LabeledItem[];

  currency: string;
  setCurrency: (c: string) => void;

  onOpenInfoModal: (view: InfoModalView) => (e: React.MouseEvent) => void;

  profile: UserProfile;
  setProfile: (p: UserProfile) => void;

  addToast: (message: string, type?: 'success' | 'error') => void;
  setView: (view: View) => void;

  aiSpeedMode: AISpeedMode;
  setAiSpeedMode: (mode: AISpeedMode) => void;

  showConfidenceScore: boolean;
  setShowConfidenceScore: (show: boolean) => void;

  plan: Plan;
  quota: {
    daily: { used: number; limit: number };
    monthly: { used: number; limit: number };
  };
}

const currencies = [
  { code: 'USD', name: 'United States Dollar' }, { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' }, { code: 'GBP', name: 'British Pound' },
  { code: 'AUD', name: 'Australian Dollar' }, { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' }, { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'INR', name: 'Indian Rupee' }, { code: 'BRL', name: 'Brazilian Real' },
];

// --- SUB-COMPONENTS ---
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<{ icon: React.ReactNode; title: string; children?: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="flex items-center justify-between gap-4 mb-4">
    <div className="flex items-center gap-3">
      <div className="text-[var(--accent-primary)]">{icon}</div>
      <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
    </div>
    {children}
  </div>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${checked ? 'bg-[var(--accent-primary)]' : 'bg-[var(--background-hover)]'}`}
  >
    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const SettingRow: React.FC<{ icon: React.ReactNode; title: string; description: string; children: React.ReactNode }> = ({ icon, title, description, children }) => (
  <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 text-[var(--text-secondary)] mt-1">{icon}</div>
      <div>
        <h4 className="font-semibold text-[var(--text-primary)]">{title}</h4>
        <p className="text-sm text-[var(--text-secondary)]">{description}</p>
      </div>
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

// ---------------- PROFILE CARD (draft only) ----------------
const ProfileCard: React.FC<{
  draftName: string;
  setDraftName: (s: string) => void;
  draftPicPreview: string;
  setDraftPicPreview: (s: string) => void;
  setAvatarFile: (f: File | null) => void;
  setIsEditing: (value: boolean) => void;
}> = ({
  draftName,
  setDraftName,
  draftPicPreview,
  setDraftPicPreview,
  setAvatarFile,
  setIsEditing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

setIsEditing(true);
    setAvatarFile(file);
    const preview = URL.createObjectURL(file);
    setDraftPicPreview(preview);
  };

  const textInputClass =
    "block w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg py-2.5 px-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition";

  const email = auth.currentUser?.email || '—';

  return (
    <Card>
      <CardHeader icon={<UserCircleIcon />} title="Profile" />
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex-shrink-0">
          <img src={draftPicPreview} alt="Profile" className="h-24 w-24 rounded-full object-cover border-2 border-[var(--border-secondary)]" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 h-8 w-8 bg-[var(--accent-primary)] text-white rounded-full flex items-center justify-center border-2 border-[var(--background-secondary)] transition-transform duration-200 transform hover:scale-110"
            aria-label="Change profile picture"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <input type="file" ref={fileInputRef} onChange={handlePicChange} accept="image/*" className="hidden" />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1.5 block">Full Name</label>
          <input
  type="text"
  value={draftName}
  onChange={(e) => {
    setIsEditing(true);
    setDraftName(e.target.value);
  }}
 className={textInputClass} />
        </div>
        <div>
          <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1.5 block">Email Address</label>
          <input type="email" value={email} disabled className={`${textInputClass} opacity-70 cursor-not-allowed`} />
        </div>
      </div>

      <p className="mt-4 text-xs text-[var(--text-muted)]">
        Changes will be saved when you click <strong>Save Changes</strong> at the bottom.
      </p>
    </Card>
  );
};

const SecurityCard: React.FC<{ setView: (view: View) => void }> = ({ setView }) => (
  <Card>
    <CardHeader icon={<LockClosedIcon />} title="Security" />
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <h4 className="font-semibold text-[var(--text-primary)]">Password</h4>
        <p className="text-sm text-[var(--text-secondary)]">Change your password to keep your account secure.</p>
      </div>
      <button
        onClick={() => setView('change-password')}
        className="px-5 py-2 text-sm font-bold rounded-lg transition-colors bg-[var(--accent-bg-muted)] text-[var(--accent-text-primary)] hover:bg-[var(--accent-bg-subtle)]"
      >
        Change Password
      </button>
    </div>
  </Card>
);

const GeneralSettingsCard: React.FC<{
  draftTheme: 'light' | 'dark';
  setDraftTheme: (t: 'light' | 'dark') => void;
setTheme: (t: 'light' | 'dark') => void;

  draftCurrency: string;
  setDraftCurrency: (c: string) => void;

  draftAiSpeedMode: AISpeedMode;
  setDraftAiSpeedMode: (m: AISpeedMode) => void;

  draftShowConfidenceScore: boolean;
  setDraftShowConfidenceScore: (b: boolean) => void;

  plan: Plan;
}> = ({
  draftTheme, setDraftTheme,setTheme,
  draftCurrency, setDraftCurrency,
  draftAiSpeedMode, setDraftAiSpeedMode,
  draftShowConfidenceScore, setDraftShowConfidenceScore,
  plan
}) => {
  const selectClass = "w-40 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md py-1.5 px-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors";
  const isPro = plan === 'pro';

const [openCurrency, setOpenCurrency] = useState(false);

  useEffect(() => {
    if (!isPro && draftAiSpeedMode === 'fast') {
      setDraftAiSpeedMode('normal');
    }
  }, [isPro, draftAiSpeedMode, setDraftAiSpeedMode]);

  const handleSpeedModeChange = (mode: AISpeedMode) => {
    if (!isPro && mode === 'fast') return;
    setDraftAiSpeedMode(mode);
  };

  return (
    <Card>
      <CardHeader icon={<SettingsIcon />} title="General Settings" />
      <div className="divide-y divide-[var(--border-primary)]">
        <SettingRow icon={<EyeIcon />} title="Appearance" description="Customize how the app looks and feels.">
          <div className="flex items-center gap-1 bg-[var(--background-tertiary)] p-1 rounded-lg">
            <button
  onClick={() => {
    setDraftTheme('light');
    setTheme('light');
  }}
  className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${draftTheme === 'light' ? 'bg-[var(--background-primary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
>
  Light
</button>
            <button
  onClick={() => {
    setDraftTheme('dark');
    setTheme('dark');
  }}
  className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${draftTheme === 'dark' ? 'bg-[var(--background-primary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
>
  Dark
</button>
          </div>
        </SettingRow>

        <SettingRow icon={<CreditCardIcon />} title="Default Currency" description="Set your preferred currency for pricing tools.">
          
<div className="relative w-40">
  <button
    onClick={() => setOpenCurrency(!openCurrency)}
    className="w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md py-1.5 px-2 text-sm text-left"
  >
    {draftCurrency}
  </button>

  {openCurrency && (
    <div className="absolute z-50 mt-1 w-full bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-md shadow-lg max-h-40 overflow-auto">
      {currencies.map(c => (
        <div
          key={c.code}
          onClick={() => {
            setDraftCurrency(c.code);
            setOpenCurrency(false);
          }}
          className="px-3 py-2 text-sm hover:bg-[var(--background-hover)] cursor-pointer"
        >
          {c.code} - {c.name}
        </div>
      ))}
    </div>
  )}
</div>
        </SettingRow>

        <SettingRow icon={<SpeedIcon />} title="Default AI Labelling Speed Mode" description="Fast mode uses less thinking time for quicker analysis.">
          <div className="flex items-center gap-1 bg-[var(--background-tertiary)] p-1 rounded-lg">
            <button onClick={() => handleSpeedModeChange('normal')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${draftAiSpeedMode === 'normal' ? 'bg-[var(--background-primary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Normal</button>

            <div className="relative group">
              <button
                onClick={() => handleSpeedModeChange('fast')}
                disabled={!isPro}
                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${draftAiSpeedMode === 'fast' && isPro ? 'bg-[var(--background-primary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                Fast (Pro)
              </button>
              {!isPro && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] text-[var(--text-primary)] text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Upgrade to Pro to use Fast mode.
                </div>
              )}
            </div>
          </div>
        </SettingRow>

        <SettingRow icon={<ConfidenceIcon />} title="Show AI Confidence Score" description="Display the confidence % for each generated attribute.">
          <ToggleSwitch checked={draftShowConfidenceScore} onChange={setDraftShowConfidenceScore} />
        </SettingRow>
      </div>

      <p className="mt-4 text-xs text-[var(--text-muted)]">
        Changes will be saved when you click <strong>Save Changes</strong> at the bottom.
      </p>
    </Card>
  );
};

const PlansAndLimitsCard: React.FC<{
  setView: (view: View) => void;
  plan: Plan;
  quota: {
    daily: { used: number; limit: number };
    monthly: { used: number; limit: number };
  };
}> = ({ setView, plan, quota }) => {
  const currentPlanDetails = PLAN_DETAILS[plan];
  const dailyProgress = quota.daily.limit > 0 ? (quota.daily.used / quota.daily.limit) * 100 : 0;
  const monthlyProgress = quota.monthly.limit > 0 ? (quota.monthly.used / quota.monthly.limit) * 100 : 0;

  return (
    <Card>
      <CardHeader icon={<PlansIcon />} title="Plan & Billing" />
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-[var(--background-primary)] p-4 rounded-lg border border-[var(--border-secondary)]">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Current Plan</p>
            <p className="text-lg font-bold text-[var(--accent-primary)] capitalize">{plan}</p>
          </div>
          {plan === 'free' && (
            <div className="tooltip">
              <button className="px-4 py-2 text-sm font-bold rounded-lg transition-colors bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)]">
                Upgrade to Pro
              </button>
              <span className="tooltip-text">Unlock API access & more!</span>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2 text-[var(--text-primary)]">Usage Quotas</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-[var(--text-secondary)]">Daily Quota</span>
                <span className="font-bold text-[var(--text-primary)]">{quota.daily.used} / {quota.daily.limit}</span>
              </div>
              <div className="w-full bg-[var(--background-tertiary)] rounded-full h-2.5">
                <div className="bg-[var(--accent-primary)] h-2.5 rounded-full" style={{ width: `${dailyProgress}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-[var(--text-secondary)]">Monthly Quota</span>
                <span className="font-bold text-[var(--text-primary)]">{quota.monthly.used} / {quota.monthly.limit}</span>
              </div>
              <div className="w-full bg-[var(--background-tertiary)] rounded-full h-2.5">
                <div className="bg-[var(--accent-primary)] h-2.5 rounded-full" style={{ width: `${monthlyProgress}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2 text-[var(--text-primary)]">What's included in my plan?</h4>
          <ul className="space-y-2 text-sm">
            {currentPlanDetails.features.map(feature => (
              <li key={feature.text} className="flex items-center gap-3">
                {feature.included ? <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" /> : <CrossIcon className="w-4 h-4 text-red-500 flex-shrink-0" />}
                <span className={`${feature.included ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] line-through'}`}>{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-[var(--border-primary)] pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-sm text-[var(--text-muted)]">Next invoice on Oct 25, 2024</p>
          <button onClick={() => setView('payment-details')} className="text-sm font-semibold text-[var(--accent-primary)] hover:underline">View Payment Details</button>
        </div>
      </div>
    </Card>
  );
};

const DataPrivacyCard: React.FC<{
  setView: (view: View) => void;
  onExportClick: () => void;
}> = ({ setView, onExportClick }) => {
  const buttonClasses = "px-3 py-1.5 text-xs font-bold rounded-md transition-colors bg-[var(--background-tertiary)] hover:bg-[var(--background-hover)] text-[var(--text-primary)] border border-[var(--border-secondary)]";

  return (
    <Card>
      <CardHeader icon={<LockClosedIcon />} title="Data & Privacy" />
      <div className="divide-y divide-[var(--border-primary)]">
        <SettingRow icon={<DownloadIcon />} title="Export Your Data" description="Download all your labeled data. Formats depend on your plan.">
          <button onClick={onExportClick} className={buttonClasses}>Export Data</button>
        </SettingRow>
        <SettingRow icon={<BookOpenIcon />} title="Privacy Policy" description="Review our commitment to your data privacy.">
          <button onClick={() => setView('privacy-policy')} className={buttonClasses}>See</button>
        </SettingRow>
        <SettingRow icon={<BookOpenIcon />} title="Terms of Service" description="Understand the rules for using the Ladamark platform.">
          <button onClick={() => setView('terms-of-service')} className={buttonClasses}>See</button>
        </SettingRow>
      </div>
    </Card>
  );
};

const DangerZoneCard: React.FC<{
  onClearCacheClick: () => void;
  onDeleteAccountClick: () => void;
  labeledItemsCount: number;
}> = ({ onClearCacheClick, onDeleteAccountClick, labeledItemsCount }) => (
  <div className="bg-red-900/10 dark:bg-red-500/5 border border-red-500/20 rounded-2xl p-6 space-y-4">
    <h3 className="text-xl font-bold text-red-400">Danger Zone</h3>

    <div className="flex flex-col md:flex-row items-start justify-between gap-4 p-4 bg-[var(--background-primary)] rounded-lg border border-red-500/20">
      <div>
        <h4 className="font-semibold text-[var(--text-primary)]">Clear History</h4>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          This will delete all <strong className="text-red-400">{labeledItemsCount} labeled items</strong> from your account (Firestore + Cloudinary).
          This action cannot be undone.
        </p>
      </div>
      <button onClick={onClearCacheClick} className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors bg-red-600/80 text-white hover:bg-red-600 flex-shrink-0">
        <TrashIcon className="w-4 h-4" /> Clear History
      </button>
    </div>

    <div className="flex flex-col md:flex-row items-start justify-between gap-4 p-4 bg-[var(--background-primary)] rounded-lg border border-red-500/20">
      <div>
        <h4 className="font-semibold text-[var(--text-primary)]">Delete Account</h4>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Permanently delete your account and all associated data. This action is irreversible.</p>
      </div>
      <button onClick={onDeleteAccountClick} className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors bg-red-600 text-white hover:bg-red-500 flex-shrink-0">
        <TrashIcon className="w-4 h-4" /> Delete Account
      </button>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
const SettingsPage: React.FC<SettingsPageProps> = (props) => {
  const { onClearCache, addToast, onLogout } = props;

  // drafts (only saved on Save Changes)
  const [draftTheme, setDraftTheme] = useState<'light' | 'dark'>(props.theme);
  const [draftCurrency, setDraftCurrency] = useState(props.currency);
  const [draftAiSpeedMode, setDraftAiSpeedMode] = useState<AISpeedMode>(props.aiSpeedMode);
  const [draftShowConfidenceScore, setDraftShowConfidenceScore] = useState(props.showConfidenceScore);
const [isEditing, setIsEditing] = useState(false);

  const [draftName, setDraftName] = useState(props.profile.name);
  const [draftPicPreview, setDraftPicPreview] = useState(props.profile.profilePic);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [isSaving, setIsSaving] = useState(false);
const [hasChanges, setHasChanges] = useState(false);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // keep drafts in sync when props change (from Firestore snapshot)
  useEffect(() => {
    setDraftTheme(props.theme);
  }, [props.theme]);

  useEffect(() => {
    setDraftCurrency(props.currency);
  }, [props.currency]);

  useEffect(() => {
    setDraftAiSpeedMode(props.aiSpeedMode);
  }, [props.aiSpeedMode]);

  useEffect(() => {
    setDraftShowConfidenceScore(props.showConfidenceScore);
  }, [props.showConfidenceScore]);

  useEffect(() => {
  if (!isEditing) {
    setDraftName(props.profile.name);
    setDraftPicPreview(props.profile.profilePic);
  }
}, [props.profile.name, props.profile.profilePic, isEditing]);


useEffect(() => {
  const isChanged =
    draftName !== props.profile.name ||
    draftCurrency !== props.currency ||
    draftTheme !== props.theme ||
    draftAiSpeedMode !== props.aiSpeedMode ||
    draftShowConfidenceScore !== props.showConfidenceScore ||
    !!avatarFile;

  setHasChanges(isChanged);
}, [
  draftName,
  draftCurrency,
  draftTheme,
  draftAiSpeedMode,
  draftShowConfidenceScore,
  avatarFile
]);

  const handleClearCacheClick = () => {
    setModalConfig({
      isOpen: true,
      title: 'Are you sure?',
      message: 'This will permanently delete your full history (Firestore + Cloudinary). This action cannot be undone.',
      onConfirm: () => {
        onClearCache();
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDeleteAccountClick = () => {
    setModalConfig({
      isOpen: true,
      title: 'Delete Your Account?',
      message: 'This will permanently delete your account and all data. This is irreversible. Are you sure you want to proceed?',
      onConfirm: () => {
        addToast('Account deletion not implemented yet.', 'error');
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleSaveAllChanges = async () => {
    const user = auth.currentUser;
    if (!user) {
      addToast('You must be logged in.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      // enforce pro speed
      const normalizedSpeed: AISpeedMode =
        props.plan === 'pro' ? draftAiSpeedMode : 'normal';

      // 1) Save settings to Firestore
      await updateDoc(doc(db, 'users', user.uid), {
name: draftName.trim() || 'User',

        'settings.currency': draftCurrency,
        'settings.aiSpeedMode': normalizedSpeed,
        'settings.showConfidenceScore': draftShowConfidenceScore,
'settings.theme': draftTheme,
        updatedAt: serverTimestamp(),
      });

      // 2) Save theme locally (app behavior)
      props.setTheme(draftTheme);

      // 3) Apply locally too (instant UI)
      props.setCurrency(draftCurrency);
      props.setAiSpeedMode(normalizedSpeed);
      props.setShowConfidenceScore(draftShowConfidenceScore);

      // 4) Update profile (name + optional avatar) via backend (Cloudinary)
      // 🔥 SAFE TOKEN
let token = "";
try {
  token = await user.getIdToken();
} catch (e) {
  console.error("Token error:", e);
}

// 🔥 FORM DATA
const fd = new FormData();
fd.append('name', draftName.trim() || 'User');

try {
  if (avatarFile) {
    fd.append('avatar', avatarFile);

    const res = await fetch(`${BACKEND_URL}/api/update-profile`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    const json = await res.json();

    if (!json?.ok) {
      addToast(json?.error || 'Profile update failed', 'error');
    } else {
      const newProfilePic = json?.profile?.profilePic || draftPicPreview;

      props.setProfile({
        ...props.profile,
        name: draftName.trim() || 'User',
        profilePic: newProfilePic,
      });

      await updateDoc(doc(db, 'users', user.uid), {
        profilePic: newProfilePic,
      });
    }

    setAvatarFile(null);
  }
} catch (err) {
  console.error("Upload error:", err);
  addToast("Upload failed", "error");
}

      let messages = [];

if (draftName !== props.profile.name) {
  messages.push("Name updated");
}

if (avatarFile) {
  messages.push("Profile image updated");
}

if (draftShowConfidenceScore !== props.showConfidenceScore) {
  messages.push(
    draftShowConfidenceScore
      ? "AI confidence enabled"
      : "AI confidence disabled"
  );
}

if (draftCurrency !== props.currency) {
  messages.push(`Currency: ${draftCurrency}`);
}

if (messages.length === 0) {
  messages.push("Settings updated");
}

addToast(messages.join(" • "), "success");
setIsEditing(false);
setHasChanges(false);
    } catch (e: any) {
      console.error(e);
      addToast(e?.message || 'Failed to save settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="space-y-4 w-full max-w-3xl mx-auto px-4 overflow-x-hidden">
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
      />

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 text-[var(--accent-primary)]" />
            Settings
          </h2>
          <p className="text-md text-[var(--text-secondary)]">Manage your account and application preferences.</p>
        </div>

        {hasChanges && (
  <button
    onClick={handleSaveAllChanges}
    disabled={isSaving}
    className="px-4 py-1.5 text-xs font-bold rounded-md bg-[var(--accent-primary)] text-white hover:opacity-90"
  >
    {isSaving ? 'Saving...' : 'Save'}
  </button>
)}
      </div>

      <ProfileCard
  draftName={draftName}
  setDraftName={setDraftName}
  draftPicPreview={draftPicPreview}
  setDraftPicPreview={setDraftPicPreview}
  setAvatarFile={setAvatarFile}
  setIsEditing={setIsEditing}
/>

      <SecurityCard setView={props.setView} />

      <GeneralSettingsCard
        draftTheme={draftTheme}
        setDraftTheme={setDraftTheme}
setTheme={props.setTheme}
        draftCurrency={draftCurrency}
        setDraftCurrency={setDraftCurrency}
        draftAiSpeedMode={draftAiSpeedMode}
        setDraftAiSpeedMode={setDraftAiSpeedMode}
        draftShowConfidenceScore={draftShowConfidenceScore}
        setDraftShowConfidenceScore={setDraftShowConfidenceScore}
        plan={props.plan}
      />

      <PlansAndLimitsCard
        setView={props.setView}
        plan={props.plan}
        quota={props.quota}
      />

      <DataPrivacyCard setView={props.setView} onExportClick={() => setIsExportModalOpen(true)} />

      <DangerZoneCard
        onClearCacheClick={handleClearCacheClick}
        onDeleteAccountClick={handleDeleteAccountClick}
        labeledItemsCount={props.labeledItems.length}
      />

      {isExportModalOpen && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          plan={props.plan}
          itemsToExport={props.labeledItems}
        />
      )}
    </section>
  );
};

export default SettingsPage;