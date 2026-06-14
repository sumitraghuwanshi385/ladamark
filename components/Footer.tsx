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
      className="text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 transform hover:-translate-y-0.5"
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
      className="border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://res.cloudinary.com/dtu6sxxyc/image/upload/v1781421246/b4825fb14f5f6b870ecbbffcde85eee4_xeyc5w.jpg')" }}
    >
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10 md:py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6">
          
          {/* Brand Block */}
          <div className="md:col-span-4 flex flex-col justify-start">
            <Logo />
            <p className="text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 max-w-[240px] leading-relaxed">
                Built to label the next billion product images instantly.
            </p>
          </div>

          {/* Links Grid & Premium Subscription Block */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-12 gap-6 sm:gap-4">
            
            <div className="sm:col-span-3">
              <h5 className="text-[11px] font-bold tracking-wider uppercase text-zinc-900 dark:text-white">Product</h5>
              <ul className="mt-3.5 space-y-2">
                <li><a href="#features" onClick={handleScroll} className="text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200">Features</a></li>
                <li><a href="#pricing" onClick={handleScroll} className="text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200">Pricing</a></li>
              </ul>
            </div>

            <div className="sm:col-span-3">
              <h5 className="text-[11px] font-bold tracking-wider uppercase text-zinc-900 dark:text-white">Company</h5>
              <ul className="mt-3.5 space-y-2">
                <li><a href="#" onClick={onOpenInfoModal('about')} className="text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200">About</a></li>
                <li><a href="#" onClick={onOpenInfoModal('contact')} className="text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200">Contact</a></li>
              </ul>
            </div>

            <div className="sm:col-span-3">
              <h5 className="text-[11px] font-bold tracking-wider uppercase text-zinc-900 dark:text-white">Legal</h5>
              <ul className="mt-3.5 space-y-2">
                <li><a href="#" onClick={onOpenInfoModal('terms')} className="text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200">Terms of Service</a></li>
                <li><a href="#" onClick={onOpenInfoModal('privacy')} className="text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Compact Optimized Newsletter Section */}
            <div className="col-span-2 sm:col-span-3 flex flex-col justify-start">
              <h5 className="text-[11px] font-bold tracking-wider uppercase text-zinc-900 dark:text-white">Stay Updated</h5>
              <p className="mt-3 text-[12px] text-zinc-800 dark:text-zinc-200 font-semibold leading-relaxed mb-3">
                Get the latest tags and updates from Ladamark.
              </p>
              <form className="flex flex-col gap-1.5 w-full max-w-[220px]" onSubmit={(e) => e.preventDefault()}>
                <input 
                    type="email" 
                    placeholder="Your email" 
                    className="w-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-700 rounded-md py-1.5 px-3 text-[12.5px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1.5 focus:ring-red-500 transition-all duration-200"
                />
                <button type="submit" className="w-full text-[12px] font-bold text-white bg-red-500 hover:bg-red-600 py-1.5 px-3 rounded-md transition-all duration-300 shadow-sm">
                    Subscribe
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 md:mt-12 border-t border-zinc-300 dark:border-zinc-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[12px] font-semibold text-zinc-600 dark:text-zinc-400 order-2 sm:order-1">&copy; {new Date().getFullYear()} Ladamark, Inc. All rights reserved.</p>
            
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
