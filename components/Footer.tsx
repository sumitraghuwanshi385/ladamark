import React from 'react';

const Logo = () => (
    <a href="/" className="flex items-center -ml-1 mb-2.5">
      <img 
        src="https://i.postimg.cc/nrRJ43f4/Picsart-25-07-19-15-59-42-768.png" 
        alt="Ladamark Logo" 
        style={{ width: '145px', height: 'auto' }}
      />
    </a>
  );

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-all duration-300 transform hover:-translate-y-0.5">
        {children}
    </a>
);

interface FooterProps {
    onOpenInfoModal: (view: 'about' | 'contact' | 'terms' | 'privacy') => (e: React.MouseEvent) => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenInfoModal }) => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (!href) return;
    const targetId = href.replace(/.*#/, "");
    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({
        behavior: 'smooth',
    });
  };
    
  return (
    <footer id="contact" className="border-t border-[var(--border-primary)] bg-[var(--background-primary)] relative overflow-hidden">
      {/* Background Micro Glow Layer */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-red-500/[0.015] rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10 md:py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6">
          
          {/* Brand Block */}
          <div className="md:col-span-4 flex flex-col justify-start">
            <Logo />
            <p className="text-[12.5px] font-medium text-[var(--text-secondary)] max-w-[240px] leading-relaxed">
                Built to label the next billion product images instantly.
            </p>
          </div>

          {/* Links Grid & Premium Subscription Block */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-12 gap-6 sm:gap-4">
            
            <div className="sm:col-span-3">
              <h5 className="text-[11px] font-bold tracking-wider uppercase text-[var(--text-primary)] opacity-90">Product</h5>
              <ul className="mt-3.5 space-y-2">
                <li><a href="#features" onClick={handleScroll} className="text-[12.5px] font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-200">Features</a></li>
                <li><a href="#pricing" onClick={handleScroll} className="text-[12.5px] font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-200">Pricing</a></li>
              </ul>
            </div>

            <div className="sm:col-span-3">
              <h5 className="text-[11px] font-bold tracking-wider uppercase text-[var(--text-primary)] opacity-90">Company</h5>
              <ul className="mt-3.5 space-y-2">
                <li><a href="#" onClick={onOpenInfoModal('about')} className="text-[12.5px] font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-200">About</a></li>
                <li><a href="#" onClick={onOpenInfoModal('contact')} className="text-[12.5px] font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-200">Contact</a></li>
              </ul>
            </div>

            <div className="sm:col-span-3">
              <h5 className="text-[11px] font-bold tracking-wider uppercase text-[var(--text-primary)] opacity-90">Legal</h5>
              <ul className="mt-3.5 space-y-2">
                <li><a href="#" onClick={onOpenInfoModal('terms')} className="text-[12.5px] font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-200">Terms of Service</a></li>
                <li><a href="#" onClick={onOpenInfoModal('privacy')} className="text-[12.5px] font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-200">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Compact Optimized Newsletter Section */}
            <div className="col-span-2 sm:col-span-3 flex flex-col justify-start">
              <h5 className="text-[11px] font-bold tracking-wider uppercase text-[var(--text-primary)] opacity-90">Stay Updated</h5>
              <p className="mt-3 text-[12px] text-[var(--text-secondary)] font-medium leading-relaxed mb-3">
                Get the latest tags and updates from Ladamark.
              </p>
              <form className="flex flex-col gap-1.5 w-full max-w-[220px]">
                <input 
                    type="email" 
                    placeholder="Your email" 
                    className="w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md py-1.5 px-3 text-[12.5px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1.5 focus:ring-[var(--accent-primary)] transition-all duration-200"
                />
                <button type="submit" className="w-full text-[12px] font-bold text-white bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] py-1.5 px-3 rounded-md transition-all duration-300 shadow-sm">
                    Subscribe
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 md:mt-12 border-t border-[var(--border-primary)] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[12px] font-medium text-[var(--text-muted)] order-2 sm:order-1">&copy; {new Date().getFullYear()} Ladamark, Inc. All rights reserved.</p>
            
            <div className="flex space-x-5 order-1 sm:order-2">
                <SocialIcon href="#">
                    <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                </SocialIcon>
                <SocialIcon href="#">
                     <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </SocialIcon>
                 <SocialIcon href="#">
                    <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                </SocialIcon>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
