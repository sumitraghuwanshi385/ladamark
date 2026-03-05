import React, { useState } from 'react';
import { type View } from './MainApplication';

const ArrowLeftIcon = ({className="w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const LockClosedIcon = ({className="w-6 h-6"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>;

interface ChangePasswordPageProps {
    setView: (view: View) => void;
    addToast: (message: string, type?: 'success' | 'error') => void;
}

const ChangePasswordPage: React.FC<ChangePasswordPageProps> = ({ setView, addToast }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewFields, setShowNewFields] = useState(false);
    const [error, setError] = useState('');

    const textInputClass = "block w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg py-3 px-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition";

    const handleContinue = () => {
        if (currentPassword.length === 0) {
            setError('Please enter your current password.');
            return;
        }
        // In a real app, you would verify the current password here.
        setError('');
        setShowNewFields(true);
    };

    const handlePasswordChange = () => {
        setError('');
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }
        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters long.');
            return;
        }
        
        // Mock success
        addToast('Password changed successfully!', 'success');
        setView('controls');
    };

    return (
        <section className="max-w-xl mx-auto">
            <button onClick={() => setView('controls')} className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-hover)] hover:shadow-md border border-transparent hover:border-[var(--border-secondary)] transform hover:-translate-y-px">
                <ArrowLeftIcon />
                Back to Settings
            </button>
            <div className="flex items-center gap-3">
                <LockClosedIcon className="w-6 h-6 text-[var(--accent-primary)]" />
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                    Change Password
                </h2>
            </div>
             <p className="text-md text-[var(--text-secondary)] mt-1">For your security, please enter your current password to continue.</p>

             <div className="mt-8 bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 md:p-8">
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1.5 block">Current Password</label>
                        <input 
                            type="password" 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)} 
                            className={textInputClass}
                            disabled={showNewFields}
                        />
                    </div>

                    {!showNewFields && (
                         <div className="pt-2">
                            <button onClick={handleContinue} className="w-full justify-center px-5 py-3 text-base font-bold rounded-lg transition-colors bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)]">
                                Continue
                            </button>
                        </div>
                    )}

                    {showNewFields && (
                        <div className="space-y-6 animate-slide-down-fade-in">
                            <div>
                                <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1.5 block">New Password</label>
                                <input 
                                    type="password" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    className={textInputClass}
                                    placeholder="Enter new password (min. 8 characters)"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1.5 block">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    className={textInputClass}
                                    placeholder="Confirm your new password"
                                />
                            </div>
                        </div>
                    )}
                    
                    {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}

                    {showNewFields && (
                        <div className="border-t border-[var(--border-primary)] pt-6 flex justify-end">
                             <button onClick={handlePasswordChange} className="w-full sm:w-auto px-6 py-3 text-base font-bold rounded-lg transition-colors bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)]">
                                Update Password
                            </button>
                        </div>
                    )}
                </div>
             </div>
        </section>
    );
};

export default ChangePasswordPage;