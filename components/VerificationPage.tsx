
import React, { useState, useEffect } from 'react';

const Logo = () => (
    <div className="flex justify-center mb-6">
      <img 
        src="https://i.postimg.cc/nrRJ43f4/Picsart-25-07-19-15-59-42-768.png" 
        alt="Ladamark Logo" 
        style={{ width: '180px', height: 'auto' }}
      />
    </div>
);

interface VerificationPageProps {
  onClose: () => void;
  onVerifySuccess: () => void;
  onGoBack: () => void;
  email: string;
}

const VerificationPage: React.FC<VerificationPageProps> = ({ onClose, onVerifySuccess, onGoBack, email }) => {
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(15);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResend = () => {
    // Simulate resending code
    console.log("Resending code...");
    setTimer(15);
    setCanResend(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful verification
    onVerifySuccess();
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in-up" 
      style={{animationDuration: '0.3s'}}
      onClick={onClose}
    >
      <div 
        className="relative bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl shadow-[var(--accent-shadow)] w-full max-w-md m-4 p-8"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="text-center">
            <Logo />
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">Verify Your Email</h2>
            <p className="text-[var(--text-secondary)] mt-2">
                We sent a 6-digit code to <strong className="text-[var(--text-primary)]">{email}</strong>. Please enter it below.
            </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="verification-code" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Verification Code</label>
            <input 
              type="text" 
              id="verification-code" 
              name="code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="block w-full text-center tracking-[1em] bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md py-3 px-4 text-2xl font-bold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition"
              placeholder="••••••"
            />
          </div>
          
          <div>
            <button 
              type="submit"
              className="w-full glowing-button flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-bold text-white bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background-secondary)] focus:ring-[var(--accent-primary)] transition-all duration-300 disabled:opacity-50"
              disabled={code.length < 6}
            >
              Verify & Sign Up
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
            <p className="text-[var(--text-secondary)]">
                Didn't receive the code?{' '}
                <button onClick={handleResend} disabled={!canResend} className="font-medium text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed">
                    {canResend ? 'Resend Code' : `Resend in ${timer}s`}
                </button>
            </p>
            <p className="mt-2 text-[var(--text-secondary)]">
                <button onClick={onGoBack} className="font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                    &larr; Back to Sign Up
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
