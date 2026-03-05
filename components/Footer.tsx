import React from 'react';

const Logo = () => (
    <a href="/" className="flex items-center -ml-2 mb-2">
      <img 
        src="https://i.postimg.cc/nrRJ43f4/Picsart-25-07-19-15-59-42-768.png" 
        alt="Ladamark Logo" 
        style={{ width: '180px', height: 'auto' }}
      />
    </a>
  );

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-300">
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
    <footer id="contact" className="border-t border-[var(--border-primary)] bg-[var(--background-primary)]">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <Logo />
            <p className="text-sm text-[var(--text-secondary)] max-w-xs">
                Built to label the next billion product images.
            </p>
          </div>
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h5 className="text-sm font-semibold text-[var(--text-primary)] tracking-wider uppercase">Product</h5>
              <ul className="mt-4 space-y-3">
                <li><a href="#features" onClick={handleScroll} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Features</a></li>
                <li><a href="#pricing" onClick={handleScroll} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Pricing</a></li>
              </ul>
            </div>
             <div>
              <h5 className="text-sm font-semibold text-[var(--text-primary)] tracking-wider uppercase">Company</h5>
              <ul className="mt-4 space-y-3">
                <li><a href="#" onClick={onOpenInfoModal('about')} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">About</a></li>
                <li><a href="#" onClick={onOpenInfoModal('contact')} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Contact</a></li>
              </ul>
            </div>
             <div>
              <h5 className="text-sm font-semibold text-[var(--text-primary)] tracking-wider uppercase">Legal</h5>
              <ul className="mt-4 space-y-3">
                <li><a href="#" onClick={onOpenInfoModal('terms')} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Terms of Service</a></li>
                <li><a href="#" onClick={onOpenInfoModal('privacy')} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
             <div className="sm:col-span-1">
              <h5 className="text-sm font-semibold text-[var(--text-primary)] tracking-wider uppercase">Stay Updated</h5>
                <p className="mt-4 text-sm text-[var(--text-secondary)]">Get the latest news and updates from Ladamark.</p>
                <form className="mt-4 flex flex-col sm:flex-row gap-2">
                    <input 
                        type="email" 
                        placeholder="Your email" 
                        className="flex-grow w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md py-2 px-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition"
                    />
                    <button type="submit" className="text-sm font-semibold text-white bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] px-4 py-2 rounded-lg transition-colors">
                        Subscribe
                    </button>
                </form>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-[var(--border-primary)] pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-[var(--text-muted)] order-2 md:order-1 mt-4 md:mt-0">&copy; {new Date().getFullYear()} Ladamark, Inc. All rights reserved.</p>
            <div className="flex space-x-6 order-1 md:order-2">
                <SocialIcon href="#">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                </SocialIcon>
                <SocialIcon href="#">
                     <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </SocialIcon>
                 <SocialIcon href="#">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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