
import React from 'react';
import { type View } from './MainApplication';
import { TermsContent } from './InfoModalContent';

const ArrowLeftIcon = ({className="w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const BookOpenIcon = ({className="w-6 h-6"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;


interface TermsPageProps {
    setView: (view: View) => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ setView }) => {
    return (
        <section className="space-y-4 max-w-4xl mx-auto">
            <div>
                <button onClick={() => setView('controls')} className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-hover)] hover:shadow-md border border-transparent hover:border-[var(--border-secondary)] transform hover:-translate-y-px">
                    <ArrowLeftIcon />
                    Back to Settings
                </button>
                <div className="flex items-center gap-3">
                    <BookOpenIcon className="w-6 h-6 text-[var(--accent-primary)]" />
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                        Terms of Service
                    </h2>
                </div>
            </div>
            <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 md:p-8">
                <TermsContent />
            </div>
        </section>
    );
};

export default TermsPage;
