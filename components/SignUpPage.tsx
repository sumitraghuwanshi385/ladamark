import React, { useState } from 'react';
import { auth, db, googleProvider } from '../firebase'; // Import path fixed
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Logo = () => (
    <div className="flex justify-center mb-6">
      <img 
        src="https://i.postimg.cc/nrRJ43f4/Picsart-25-07-19-15-59-42-768.png" 
        alt="Ladamark Logo" 
        style={{ width: '180px', height: 'auto' }}
      />
    </div>
);
  
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.16c1.56 0 2.95.54 4.04 1.58l3.15-3.15C17.45 1.94 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        <path d="M1 1h22v22H1z" fill="none"/>
    </svg>
);
  
interface SignUpPageProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onClose, onSwitchToLogin }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper function to save user data to Firestore
  const createUserInDb = async (user: any) => {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: user.displayName || user.email?.split('@')[0],
      profilePic: user.photoURL || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
      plan: 'free',
      createdAt: new Date().toISOString(),
      usage: {
        daily: { date: new Date().toISOString().split('T')[0], count: 0 },
        monthly: { month: new Date().toISOString().substring(0, 7), count: 0 }
      }
    });
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      // Check if user exists first could be better, but setDoc with merge is safer usually, 
      // here we just overwrite/create for simplicity or use getDoc check if strict.
      // For now, simple creation:
      await createUserInDb(result.user);
      onClose(); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
    }

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserInDb(userCredential.user);
      onClose(); 
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const inputClass = "block w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md py-3 px-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition";

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
           <h2 className="text-3xl font-bold text-[var(--text-primary)]">Create an Account</h2>
           <p className="text-[var(--text-secondary)] mt-2">Start your journey with Ladamark.</p>
        </div>
        
        <div className="mt-8 space-y-4">
            <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-[var(--border-secondary)] rounded-lg text-base font-semibold text-[var(--text-primary)] bg-[var(--background-primary)] hover:bg-[var(--background-tertiary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background-secondary)] focus:ring-[var(--accent-primary)] transition-all duration-300 disabled:opacity-50"
            >
                <GoogleIcon />
                {loading ? 'Processing...' : 'Continue with Google'}
            </button>
        </div>

        <div className="my-6 flex items-center gap-4">
            <div className="flex-grow border-t border-[var(--border-primary)]"></div>
            <span className="text-[var(--text-muted)] text-sm">OR</span>
            <div className="flex-grow border-t border-[var(--border-primary)]"></div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-signup" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email Address</label>
            <input 
              type="email" 
              id="email-signup" 
              name="email"
              autoComplete="email"
              required
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password-signup" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Password</label>
            <input 
              type="password" 
              id="password-signup"
              name="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label htmlFor="confirm-password-signup" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Confirm Password</label>
            <input 
              type="password" 
              id="confirm-password-signup"
              name="confirm-password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="pt-2">
            <button 
              type="submit"
              disabled={loading}
              className="w-full glowing-button flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-bold text-white bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background-secondary)] focus:ring-[var(--accent-primary)] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center text-sm">
            <p className="text-[var(--text-secondary)]">
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className="font-medium text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)]">
                    Sign In
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;