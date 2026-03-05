import React from 'react';

const GenericModal: React.FC<{
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ onClose, title, children }) => {
  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in-up" 
      style={{animationDuration: '0.3s'}}
      onClick={onClose}
    >
      <div 
        className="relative bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl shadow-[var(--accent-shadow)] w-full max-w-2xl m-4 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-[var(--border-primary)] flex-shrink-0">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h2>
            <button 
              onClick={onClose} 
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
            {children}
        </div>
      </div>
    </div>
  );
};

export default GenericModal;
