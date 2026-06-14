import React from 'react';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Logo = () => (
    <a href="/" className="flex items-center -ml-1 mb-2.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
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
      className="text-zinc-300 hover:text-red-400 transition-all duration-300 transform hover:-translate-y-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
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
      className="border-t border-zinc-500/30 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://res.cloudinary.com/dtu6sxxyc/image/upload/v1781421246/b4825fb14f5f6b870ecbbffcde85eee4_xeyc5w.jpg')" }}
    >
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10 md:py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6">
          
          {/* Brand Block */}
          <div className="md:col-span-4 flex flex-col justify-start">
            <Logo />
            <p 
              className="text-[12.5px] font-bold leading-relaxed bg-gradient-to-r from-zinc-100 via-white to-zinc-300 bg-clip-text text-transparent max-w-[240px]"
              style={{ filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.8))' }}
            >
                Built to label the next billion product images instantly.
            </p>
          </div>

          {/* Links Grid & Premium Subscription Block */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-12 gap-6 sm:gap-4">
            
            <div className="sm:col-span-3">
              <h5 
                className="text-[11px] font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent"
                style={{ filter: 'drop-shadow(0px 1.5px 2px rgba(0, 0, 0, 0.9))' }}
              >
                Product
              </h5>
              <ul className="mt-3.5 space-y-2">
                <li>
                  <a 
                    href="#features" 
                    onClick={handleScroll} 
                    className="text-[12.5px] font-bold bg-gradient-to-r from-zinc-100 to-zinc-300 hover:from-red-400 hover:to-red-300 bg-clip-text text-transparent transition-all duration-200"
                    style={{ filter: 'drop-shadow(0px 1.5px 3px rgba(0, 0, 0, 0.8))' }}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a 
                    href="#pricing" 
                    onClick={handleScroll} 
                    className="text-[12.5px] font-bold bg-gradient-to-r from-zinc-100 to-zinc-300 hover:from-red-400 hover:to-red-300 bg-clip-text text-transparent transition-all duration-200"
                    style={{ filter: 'drop-shadow(0px 1.5px 3px rgba(0, 0, 0, 0.8))' }}
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div className="sm:col-span-3">
              <h5 
                className="text-[11px] font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent"
                style={{ filter: 'drop-shadow(0px 1.5px 2px rgba(0, 0, 0, 0.9))' }}
              >
                Company
              </h5>
              <ul className="mt-3.5 space-y-2">
                <li>
                  <a 
                    href="#" 
                    onClick={onOpenInfoModal('about')} 
                    className="text-[12.5px] font-bold bg-gradient-to-r from-zinc-100 to-zinc-300 hover:from-red-400 hover:to-red-300 bg-clip-text text-transparent transition-all duration-200"
                    style={{ filter: 'drop-shadow(0px 1.5px 3px rgba(0, 0, 0, 0.8))' }}
                  >
                    About
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    onClick={onOpenInfoModal('contact')} 
                    className="text-[12.5px] font-bold bg-gradient-to-r from-zinc-100 to-zinc-300 hover:from-red-400 hover:to-red-300 bg-clip-text text-transparent transition-all duration-200"
                    style={{ filter: 'drop-shadow(0px 1.5px 3px rgba(0, 0, 0, 0.8))' }}
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="sm:col-span-3">
              <h5 
                className="text-[11px] font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent"
                style={{ filter: 'drop-shadow(0px 1.5px 2px rgba(0, 0, 0, 0.9))' }}
              >
                Legal
              </h5>
              <ul className="mt-3.5 space-y-2">
                <li>
                  <a 
                    href="#" 
                    onClick={onOpenInfoModal('terms')} 
                    className="text-[12.5px] font-bold bg-gradient-to-r from-zinc-100 to-zinc-300 hover:from-red-400 hover:to-red-300 bg-clip-text text-transparent transition-all duration-200"
                    style={{ filter: 'drop-shadow(0px 1.5px 3px rgba(0, 0, 0, 0.8))' }}
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    onClick={onOpenInfoModal('privacy')} 
                    className="text-[12.5px] font-bold bg-gradient-to-r from-zinc-100 to-zinc-300 hover:from-red-400 hover:to-red-300 bg-clip-text text-transparent transition-all duration-200"
                    style={{ filter: 'drop-shadow(0px 1.5px 3px rgba(0, 0, 0, 0.8))' }}
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Compact Optimized Newsletter Section */}
            <div className="col-span-2 sm:col-span-3 flex flex-col justify-start">
              <h5 
                className="text-[11px] font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent"
                style={{ filter: 'drop-shadow(0px 1.5px 2px rgba(0, 0, 0, 0.9))' }}
              >
                Stay Updated
              </h5>
              <p 
                className="mt-3 text-[12px] font-bold leading-relaxed mb-3 bg-gradient-to-r from-zinc-100 via-white to-zinc-300 bg-clip-text text-transparent"
                style={{ filter: 'drop-shadow(0px 1.5px 3px rgba(0, 0, 0, 0.8))' }}
              >
                Get the latest tags and updates from Ladamark.
              </p>
              <form className="flex flex-col gap-1.5 w-full max-w-[220px]" onSubmit={(e) => e.preventDefault()}>
                <input 
                    type="email" 
                    placeholder="Your email" 
                    className="w-full bg-black/40 border border-white/30 backdrop-blur-sm rounded-md py-1.5 px-3 text-[12.5px] text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1.5 focus:ring-red-500 transition-all duration-200 shadow-md"
                />
                <button type="submit" className="w-full text-[12px] font-bold text-white bg-red-500 hover:bg-red-600 py-1.5 px-3 rounded-md transition-all duration-300 shadow-[0_4px_12px_rgba(239,68,68,0.3)]">
                    Subscribe
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Silver-White Gradient Line Divider */}
        <div className="mt-10 md:mt-12 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-200/50 to-transparent" />

        {/* Bottom Section */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p 
              className="text-[12px] font-bold bg-gradient-to-r from-zinc-200 to-zinc-400 bg-clip-text text-transparent order-2 sm:order-1"
              style={{ filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.8))' }}
            >
              &copy; {new Date().getFullYear()} Ladamark, Inc. All rights reserved.
            </p>
            
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
