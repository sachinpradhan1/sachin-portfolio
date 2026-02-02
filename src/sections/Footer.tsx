import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Linkedin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll('.footer-item');
        gsap.fromTo(
          elements,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 90%',
              once: true,
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Videos', id: 'videos' },
    { label: 'Skills', id: 'skills' },
    { label: 'Contact', id: 'contact' },
  ];

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/theunemployedfriend?igsh=MTEyYjEwNmwxcWI4Ng==', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/sachin-pradhan-ba82a927a', label: 'LinkedIn' },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative py-16 bg-black border-t border-gray-900"
    >
      {/* Animated Divider Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent footer-item"
        style={{
          animation: 'expandLine 1s ease-out forwards',
          animationDelay: '0.5s',
        }}
      />

      <style>{`
        @keyframes expandLine {
          to { width: 100%; }
        }
      `}</style>

      <div ref={contentRef} className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Tagline */}
          <div className="footer-item text-center md:text-left">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group"
            >
              <span className="text-2xl font-bold text-white font-['Montserrat']">
                SACHIN<span className="text-red-600">.</span>
              </span>
            </button>
            <p className="text-gray-500 text-sm mt-2">
              Creator. Speaker. Storyteller.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="footer-item flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-gray-400 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-600 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Social Links */}
          <div className="footer-item flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-600/10 transition-all duration-300 hover:scale-110 hover:rotate-6"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-item mt-12 pt-8 border-t border-gray-900 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Sachin Pradhan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
