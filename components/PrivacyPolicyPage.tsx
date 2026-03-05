
import React from 'react';
import { type View } from './MainApplication';
import { PrivacyContent } from './InfoModalContent';

const ArrowLeftIcon = ({className="w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const LockClosedIcon = ({className="w-6 h-6"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>;


interface PrivacyPolicyPageProps {
    setView: (view: View) => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ setView }) => {
    return (
        <section className="space-y-4 max-w-4xl mx-auto">
            <div>
                <button onClick={() => setView('controls')} className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-hover)] hover:shadow-md border border-transparent hover:border-[var(--border-secondary)] transform hover:-translate-y-px">
                    <ArrowLeftIcon />
                    Back to Settings
                </button>
                <div className="flex items-center gap-3">
                    <LockClosedIcon className="w-6 h-6 text-[var(--accent-primary)]" />
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                        Privacy Policy
                    </h2>
                </div>
            </div>
            <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 md:p-8">
                <PrivacyContent />
            </div>
        </section>
    );
};

export default PrivacyPolicyPage;
