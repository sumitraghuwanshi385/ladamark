import React from 'react';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';

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
    <a 
      href={href} 
      target="_blank"
      rel="noopener noreferrer"
      className="text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 transform hover:-translate-y-0.5"
    >
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
    <footer 
      id="contact" 
      className="border-t border-[var(--border-primary)] relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://res.cloudinary.com/dtu6sxxyc/image/upload/v1781421246/b4825fb14f5f6b870ecbbffcde85eee4_xeyc5w.jpg')" }}
    >
      {/* Smooth Content Visibility Overlay Layer 
        Yeh layer layout parameters ke text content ko clear background contrast deti h light/dark toggles me
      */}
      <div className="absolute inset-0 bg-white/90 dark:bg-zinc-950/92 backdrop-blur-[2px] pointer-events-none" />

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
              <form className="flex flex-col gap-1.5 w-full max-w-[220px]" onSubmit={(e) => e.preventDefault()}>
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
            
            <div className="flex space-x-5 order-1 sm:order-2 items-center">
                <SocialIcon href="https://twitter.com/ladamark">
                    <Twitter size={16} strokeWidth={2.5} />
                </SocialIcon>
                <SocialIcon href="https://github.com/ladamark">
                    <Github size={16} strokeWidth={2.5} />
                </SocialIcon>
                <SocialIcon href="https://linkedin.com/company/ladamark">
                    <Linkedin size={16} strokeWidth={2.5} />
                </SocialIcon>
                <SocialIcon href="mailto:support@ladamark.com">
                    <Mail size={16} strokeWidth={2.5} />
                </SocialIcon>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
