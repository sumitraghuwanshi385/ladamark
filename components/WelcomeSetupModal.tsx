import React, { useState, useRef } from 'react';
import { type UserProfile } from '../App';

const currencies = [
  { code: 'USD', name: 'United States Dollar' }, { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' }, { code: 'GBP', name: 'British Pound' },
  { code: 'AUD', name: 'Australian Dollar' }, { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' }, { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'INR', name: 'Indian Rupee' }, { code: 'BRL', name: 'Brazilian Real' },
];

const PencilIcon = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
    <path d="M19.5 7.125l-8.832 8.831" />
  </svg>
);

interface WelcomeSetupModalProps {
  onClose: (updatedProfile: UserProfile, updatedCurrency: string, avatarFile?: File | null) => void;
  initialProfile: UserProfile;
  initialCurrency: string;
}

const WelcomeSetupModal: React.FC<WelcomeSetupModalProps> = ({ onClose, initialProfile, initialCurrency }) => {
  const [name, setName] = useState(initialProfile.name);
  const [profilePicPreview, setProfilePicPreview] = useState(initialProfile.profilePic);
  const [currency, setCurrency] = useState(initialCurrency);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
  onClose(
    { name: name.trim() || 'User', profilePic: profilePicPreview },
    currency,
    avatarFile
  );
};

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setProfilePicPreview(previewUrl);
  };

  const textInputClass =
    "block w-full bg-[var(--background-primary)] border border-[var(--border-secondary)] rounded-lg py-3 px-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition";
  const selectClass =
    "block w-full bg-[var(--background-primary)] border border-[var(--border-secondary)] rounded-lg py-3 px-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
      <div className="relative bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl shadow-[var(--accent-shadow)] w-full max-w-lg m-4 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">Welcome to Ladamark!</h2>
          <p className="text-[var(--text-secondary)] mt-2">Let's quickly set up your profile to get started.</p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex justify-center">
            <div className="relative group">
              <img src={profilePicPreview} alt="Profile Preview" className="h-32 w-32 rounded-full object-cover border-4 border-[var(--border-secondary)]" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 h-10 w-10 bg-[var(--accent-primary)] text-white rounded-full flex items-center justify-center border-4 border-[var(--background-secondary)] transition-transform duration-200 transform hover:scale-110"
                aria-label="Change profile picture"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handlePicChange} accept="image/*" className="hidden" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className={textInputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Preferred Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className={selectClass}>
              {currencies.map(c => (<option key={c.code} value={c.code}>{c.code} - {c.name}</option>))}
            </select>
          </div>
        </div>

        <div className="mt-8">
          <button
  onClick={handleSave}
  disabled={isSaving}
  className="w-full glowing-button flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-base font-bold text-white bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] disabled:opacity-60"
>
  {isSaving ? "Saving..." : "Save & Continue"}
</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSetupModal;