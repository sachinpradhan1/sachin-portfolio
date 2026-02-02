import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, Linkedin, Instagram, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone',
      value: '7846922344',
      href: 'tel:7846922344',
      display: '+91 78469 22344',
      openInNewTab: false,
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'sachinpradhan805@gmail.com',
      href: 'mailto:sachinpradhan805@gmail.com',
      display: 'sachinpradhan805@gmail.com',
      openInNewTab: false,
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: 'https://www.instagram.com/theunemployedfriend',
      href: 'https://www.instagram.com/theunemployedfriend?igsh=MTEyYjEwNmwxcWI4Ng==',
      display: '@theunemployedfriend',
      openInNewTab: true,
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'https://www.linkedin.com/in/sachin-pradhan-ba82a927a',
      href: 'https://www.linkedin.com/in/sachin-pradhan-ba82a927a',
      display: 'Sachin Pradhan',
      openInNewTab: true,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll('.word');
        gsap.fromTo(
          words,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      // Cards animation
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.contact-card');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 80, rotateX: 20 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'elastic.out(1, 0.8)',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 bg-black overflow-hidden"
    >
      {/* Diagonal Divider */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#FF0000" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <line
          x1="0"
          y1="30%"
          x2="100%"
          y2="70%"
          stroke="url(#lineGradient)"
          strokeWidth="1"
        />
      </svg>

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="section-label mb-4 block">GET IN TOUCH</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 font-['Montserrat']">
            <span className="word inline-block">Let's</span>{' '}
            <span className="word inline-block">Create</span>{' '}
            <span className="word inline-block text-red-600">Something</span>{' '}
            <span className="word inline-block text-red-600">Amazing</span>
          </h2>
          <p className="word text-gray-400 text-lg max-w-2xl mx-auto">
            Ready to collaborate? Reach out and let's discuss your next project.
          </p>
        </div>

        {/* Contact Cards */}
        <div
          ref={cardsRef}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto perspective-1000"
        >
          {contactInfo.map((item, index) => (
            <div
              key={index}
              className="contact-card group relative bg-[#1A1A1A] rounded-xl p-6 border border-gray-800 hover:border-red-600/50 transition-all duration-300 hover:-translate-y-3 hover:shadow-xl hover:shadow-red-600/10 preserve-3d"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Icon */}
              <div className="relative mb-4">
                <div className="w-12 h-12 rounded-lg bg-red-600/10 flex items-center justify-center group-hover:bg-red-600/20 transition-colors duration-300">
                  <item.icon
                    size={24}
                    className="text-red-500 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Label */}
              <p className="relative z-10 text-sm text-gray-500 mb-2">{item.label}</p>

              {/* Value */}
              <div className="relative z-10 flex items-center gap-2">
                <a
                  href={item.href}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                  className="text-white font-semibold hover:text-red-500 transition-colors truncate"
                >
                  {item.display}
                </a>
              </div>

              {/* Actions */}
              <div className="relative z-10 mt-4 flex gap-2">
                <button
                  onClick={() => handleCopy(item.value, item.label)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  {copiedField === item.label ? (
                    <>
                      <Check size={12} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <a
                  href={item.href}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  <ExternalLink size={12} />
                  <span>Open</span>
                </a>
              </div>

              {/* Border Glow */}
              <div className="absolute inset-0 rounded-xl border-2 border-red-600/0 group-hover:border-red-600/30 transition-colors pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Response time: Usually within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
