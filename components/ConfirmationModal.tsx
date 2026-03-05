import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in-up"
      style={{ animationDuration: '0.3s' }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl shadow-[var(--accent-shadow)] w-full max-w-md m-4 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h2>
          <p className="text-[var(--text-secondary)] mt-2">{message}</p>
        </div>
        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 text-base font-bold rounded-lg transition-colors bg-[var(--background-hover)] text-[var(--text-primary)] hover:bg-[var(--border-secondary)]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-3 text-base font-bold rounded-lg transition-colors bg-red-600 text-white hover:bg-red-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
