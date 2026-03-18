import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import DataNexus from './components/DataNexus';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import Audience from './components/Audience';
import MainApplication from './components/MainApplication';
import SignUpPage from './components/SignUpPage';
import GenericModal from './components/GenericModal';
import WelcomeSetupModal from './components/WelcomeSetupModal';
import VerificationPage from './components/VerificationPage';
import { AboutContent, ContactContent, TermsContent, PrivacyContent } from './components/InfoModalContent';
import { type Plan } from './components/plans';
import ResponsiveShowcase from './components/ResponsiveShowcase';

import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

export type InfoModalView = 'none' | 'about' | 'contact' | 'terms' | 'privacy';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      setStoredValue(currentValue => {
        const valueToStore = value instanceof Function ? value(currentValue) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
};

export type UserProfile = {
  name: string;
  profilePic: string;
  email: string;
};

const getModalTitle = (view: InfoModalView) => {
  switch (view) {
    case 'about': return 'About Ladamark';
    case 'contact': return 'Get in Touch';
    case 'terms': return 'Terms of Service';
    case 'privacy': return 'Privacy Policy';
    default: return '';
  }
};

const getModalContent = (view: InfoModalView) => {
  switch (view) {
    case 'about': return <AboutContent />;
    case 'contact': return <ContactContent />;
    case 'terms': return <TermsContent />;
    case 'privacy': return <PrivacyContent />;
    default: return null;
  }
};

const App: React.FC = () => {
  const [modalView, setModalView] = useState<'none' | 'login' | 'signup' | 'verify'>('none');
  const [infoModalView, setInfoModalView] = useState<InfoModalView>('none');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const [plan, setPlan] = useState<Plan>('free');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) return savedTheme;
    return 'light';
  });

  const [currency, setCurrency] = useLocalStorage('app-currency', 'USD');
  const [profile, setProfile] = useState<UserProfile>({
  name: 'Guest',
  profilePic: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  email: '', 
});
  const [categoryFilter, setCategoryFilter] = useState('all');
const [quota, setQuota] = useState({
  daily: { used: 0, limit: 5 },
  monthly: { used: 0, limit: 150 },
});

  useEffect(() => {
    let unsubUserDoc: null | (() => void) = null;

    const DEFAULT_PROFILE_PIC =
  "https://ui-avatars.com/api/?name=User&background=ff0000&color=fff&size=256";

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      try {
        if (unsubUserDoc) {
          unsubUserDoc();
          unsubUserDoc = null;
        }

        if (!user) {
          setIsAuthenticated(false);
          setIsLoadingAuth(false);
          return;
        }

        setIsAuthenticated(true);

        const userDocRef = doc(db, "users", user.uid);
        const snap = await getDoc(userDocRef);

        const todayStr = new Date().toISOString().split("T")[0];
        const currentMonthStr = todayStr.substring(0, 7);

        if (!snap.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            name: user.displayName || user.email?.split("@")[0] || "User",
            profilePic: user.photoURL || DEFAULT_PROFILE_PIC,
            plan: "free",
            createdAt: new Date().toISOString(),
            usage: {
              daily: { date: todayStr, count: 0 },
              monthly: { month: currentMonthStr, count: 0 },
            },
            settings: {
              currency: "USD",
              aiSpeedMode: "normal",
              showConfidenceScore: true,
            },
          });
        } else {
          // ensure settings keys exist (merge defaults)
          await setDoc(userDocRef, {
            settings: {
              currency: (snap.data() as any)?.settings?.currency ?? "USD",
              aiSpeedMode: (snap.data() as any)?.settings?.aiSpeedMode ?? "normal",
              showConfidenceScore: (snap.data() as any)?.settings?.showConfidenceScore ?? true,
            }
          }, { merge: true });
        }

        // live sync user doc
      unsubUserDoc = onSnapshot(userDocRef, async (docSnap) => {
  const data: any = docSnap.data() || {};

  // ✅ plan
  setPlan((data.plan as Plan) || 'free');

  // ✅ profile
  setProfile({
    name: data.name || user.displayName || 'User',
    profilePic: data.profilePic || user.photoURL || DEFAULT_PROFILE_PIC,
    email: data.email || user.email || '',
  });

  // ✅ settings
  const settings = data.settings || {};
  setCurrency(settings.currency || 'USD');
  setTheme(settings.theme || 'light');

  // =========================
  // 🔥 QUOTA LOGIC
  // =========================

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // DAILY
  let dailyCount = data?.usage?.daily?.count || 0;
  if (data?.usage?.daily?.date !== todayStr) {
    dailyCount = 0;

    await updateDoc(userDocRef, {
      'usage.daily': { date: todayStr, count: 0 }
    });
  }

  // MONTHLY
  let monthlyCount = data?.usage?.monthly?.count || 0;
  if (data?.usage?.monthly?.month !== currentMonthStr) {
    monthlyCount = 0;

    await updateDoc(userDocRef, {
      'usage.monthly': { month: currentMonthStr, count: 0 }
    });
  }

  const isPro = data?.plan === 'pro';

  // ✅ FINAL QUOTA SET
  setQuota({
    daily: {
      used: dailyCount,
      limit: isPro ? 20 : 5,
    },
    monthly: {
      used: monthlyCount,
      limit: isPro ? 600 : 150,
    },
  });

  
  if (settings.aiSpeedMode) {
    
  }

  if (settings.showConfidenceScore !== undefined) {
    
  }
});

      } catch (err) {
        console.error("Auth/Firestore sync error:", err);
      } finally {
        setIsLoadingAuth(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubUserDoc) unsubUserDoc();
    };
  }, [setCurrency]);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleCloseModals = () => {
    setModalView('none');
    setInfoModalView('none');
  };

  const handleOpenLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalView('login');
  };

  const handleOpenSignUp = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalView('signup');
  };

  const switchToLogin = () => setModalView('login');
  const switchToSignUp = () => setModalView('signup');

  const handleLoginSuccess = () => {
    setModalView('none');
  };

  // Welcome modal save => sync currency + name + avatar
  const handleWelcomeModalClose = async (updatedProfile: UserProfile, updatedCurrency: string, avatarFile?: File | null) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // save currency + name to Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        name: updatedProfile.name,
        'settings.currency': updatedCurrency,
      });

      // if avatar file selected => upload via backend
      if (avatarFile) {
        const token = await user.getIdToken();
        const fd = new FormData();
        fd.append('name', updatedProfile.name);
        fd.append('avatar', avatarFile);

        await fetch(`${BACKEND_URL}/api/update-profile`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        // profilePic will update automatically via onSnapshot
      }

      setShowWelcomeModal(false);
    } catch (e) {
      console.error(e);
      setShowWelcomeModal(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    handleCloseModals();
  };

  const handleOpenInfoModal = (view: InfoModalView) => (e: React.MouseEvent) => {
    e.preventDefault();
    setInfoModalView(view);
  };

  if (isLoadingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--background-primary)] text-[var(--text-primary)]">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <MainApplication
          onLogout={handleLogout}
          theme={theme}
          setTheme={setTheme}
          onOpenInfoModal={handleOpenInfoModal}
          profile={profile}
          setProfile={setProfile}
          currency={currency}
          setCurrency={setCurrency}
          plan={plan}
quota={quota}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />

        {showWelcomeModal && (
          <WelcomeSetupModal
            onClose={handleWelcomeModalClose}
            initialProfile={profile}
            initialCurrency={currency}
          />
        )}
      </>
    );
  }

  return (
    <div className="bg-[var(--background-secondary)]">
      <Header onLoginClick={handleOpenLogin} onSignUpClick={handleOpenSignUp} theme={theme} setTheme={setTheme} />
      <main>
        <Hero onLoginClick={handleOpenLogin} onSignUpClick={handleOpenSignUp} />
        <DataNexus onSignUpClick={handleOpenSignUp} />
        <HowItWorks />
        <Features onSignUpClick={handleOpenSignUp} />
        <Audience />
        <ResponsiveShowcase />
        <Pricing onSignUpClick={handleOpenSignUp} />
        <Testimonials />
      </main>
      <Footer onOpenInfoModal={handleOpenInfoModal} />

      {modalView === 'login' && (
        <LoginPage onClose={handleCloseModals} onLoginSuccess={handleLoginSuccess} onSwitchToSignUp={switchToSignUp} />
      )}

      {modalView === 'signup' && (
        <SignUpPage onClose={handleCloseModals} onSwitchToLogin={switchToLogin} />
      )}

      {modalView === 'verify' && (
        <VerificationPage
          onClose={handleCloseModals}
          onVerifySuccess={() => {}}
          onGoBack={switchToSignUp}
          email={''}
        />
      )}

      {infoModalView !== 'none' && (
        <GenericModal title={getModalTitle(infoModalView)} onClose={handleCloseModals}>
          {getModalContent(infoModalView)}
        </GenericModal>
      )}
    </div>
  );
};

export default App;