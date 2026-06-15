import React, { useEffect } from 'react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string;
}

const WatchDemoModal: React.FC<DemoModalProps> = ({ 
  isOpen, 
  onClose, 
  videoSrc = "https://assets.mixkit.co/videos/preview/mixkit-dashboard-analytics-on-a-screen-42352-large.mp4" // Fallback premium sample tech video
}) => {
  
  // Prevent background scrolling when modal is open (iOS handling)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      
      {/* 1. iOS Style Ultra-Blur Backdrop (Apple/Vercel Style) */}
      <div 
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-2xl transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* 2. Main Premium Video Wrapper Box */}
      <div 
        className="relative w-full max-w-4xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.5)] transform scale-100 transition-all duration-300 animate-scale-up"
        style={{
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 25px 50px -12px rgba(0,0,0,0.4)'
        }}
      >
        
        {/* Top Floating Glass Header Bar (iOS Accent) */}
        <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/20 to-transparent z-10 flex items-center justify-between px-5 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff0033] opacity-80" />
            <span className="text-xs font-semibold text-white tracking-wide uppercase opacity-90 drop-shadow-sm">Ladamark AI Demo</span>
          </div>
          
          {/* Close Button - Interactive Layer */}
          <button 
            onClick={onClose}
            className="pointer-events-auto p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Close Demo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 3. Cinematic Video Frame Area */}
        <div className="relative aspect-video w-full bg-zinc-950 flex items-center justify-center">
          <video 
            src={videoSrc}
            className="w-full h-full object-contain"
            autoPlay
            controls
            playsInline
          />
          
          {/* Ambient Outer Red Glow beneath the video player frame to match Hero branding */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#ff0033]/10 to-transparent blur-2xl pointer-events-none mix-blend-screen" />
        </div>

        {/* Bottom Status Ribbon */}
        <div className="px-5 py-3 bg-zinc-900/80 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-[11px] text-zinc-400 font-medium">
            Ready to explore? Setup your custom automated workflow in less than 5 minutes.
          </p>
          <button
            onClick={(e) => {
              onClose();
              // Add trigger logic here if you want to pop up sign up directly
            }}
            className="text-[11px] font-bold text-white bg-gradient-to-r from-[#ff0033] to-[#ff3366] px-3 py-1.5 rounded-md hover:scale-[1.02] transition-transform text-center sm:w-auto"
          >
            Get Started Free
          </button>
        </div>

      </div>

      {/* Global Embedded CSS Animations for sleek popup feel */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default WatchDemoModal;
