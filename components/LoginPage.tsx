import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const Logo = () => (
    <div className="flex justify-center mb-4">
      <img 
        src="https://i.postimg.cc/nrRJ43f4/Picsart-25-07-19-15-59-42-768.png" 
        alt="Ladamark Logo" 
        style={{ width: '120px', height: 'auto' }}
      />
    </div>
);

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.16c1.56 0 2.95.54 4.04 1.58l3.15-3.15C17.45 1.94 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

const LoginPage: React.FC<{ onClose: () => void; onLoginSuccess: () => void; }> = ({ onClose, onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  // Freeze background scrolling when login modal is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      onLoginSuccess();
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[12px]"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[380px] bg-white/70 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 backdrop-blur-[20px] rounded-2xl p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Left iOS Style Back Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 left-5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200 z-20 flex items-center gap-1 text-[14px] font-medium"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>

        {/* Subtle Glow Effect */}
        <div className="absolute -top-[20%] -right-[20%] w-[250px] h-[250px] bg-red-500/20 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="relative z-10 text-center mt-6">
           <Logo />
           <h2 className="text-[26px] font-bold text-zinc-900 dark:text-white tracking-tight">Welcome</h2>
           <p className="text-[13.5px] text-zinc-600 dark:text-zinc-400 mt-1 mb-8">Sign in to start labeling images.</p>
        </div>

        <div className="relative z-10">
            <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 py-3 px-5 rounded-xl text-[14.5px] font-semibold bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-white/5 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-[0.98]"
            >
                <GoogleIcon />
                {loading ? 'Authenticating...' : 'Continue with Google'}
            </button>
            
            <p className="text-[11.5px] text-zinc-500 dark:text-zinc-500 mt-6 text-center leading-relaxed">
                By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
