import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mic, Video, User, MessageCircle, FileText } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  icon: React.ElementType;
  title: string;
  description: string;
}

const skills: Skill[] = [
  {
    icon: Mic,
    title: 'Public Speaking',
    description: 'Captivating audiences with confidence, clarity, and compelling delivery on any stage.',
  },
  {
    icon: Video,
    title: 'Content Creation',
    description: 'Crafting engaging videos, posts, and campaigns that resonate with target audiences.',
  },
  {
    icon: User,
    title: 'On-Camera Presence',
    description: 'Natural, authentic delivery that builds trust and keeps viewers engaged.',
  },
  {
    icon: MessageCircle,
    title: 'Brand Communication',
    description: 'Translating brand values into messaging that connects and converts.',
  },
  {
    icon: FileText,
    title: 'Scriptwriting',
    description: 'Creating narratives that hook audiences from the first word to the last frame.',
  },
];

const Skills = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll('.word');
        gsap.fromTo(
          words,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
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
        const cards = cardsRef.current.querySelectorAll('.skill-card');
        gsap.fromTo(
          cards,
          { opacity: 0, rotateY: 90 },
          {
            opacity: 1,
            rotateY: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    gsap.to(card, {
      rotateX: -rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
    setHoveredIndex(null);
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-24 bg-black overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="section-label mb-4 block">MY EXPERTISE</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-['Montserrat']">
            <span className="word inline-block">Skills</span>{' '}
            <span className="word inline-block">That</span>{' '}
            <span className="word inline-block text-red-600">Drive</span>{' '}
            <span className="word inline-block text-red-600">Results</span>
          </h2>
        </div>

        {/* Skills Grid - Hexagonal Layout */}
        <div
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1200"
        >
          {skills.map((skill, index) => (
            <div
              key={index}
              className={`skill-card group relative bg-[#1A1A1A] rounded-xl p-8 border border-gray-800 cursor-pointer preserve-3d transition-all duration-300 ${
                index === 2 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
              style={{ transformStyle: 'preserve-3d' }}
              onMouseMove={(e) => handleMouseMove(e)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Glow Effect */}
              <div 
                className={`absolute inset-0 rounded-xl bg-red-600/10 transition-opacity duration-300 ${
                  hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-14 h-14 rounded-lg bg-red-600/10 flex items-center justify-center group-hover:bg-red-600/20 transition-colors duration-300">
                  <skill.icon 
                    size={28} 
                    className="text-red-500 group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>
                
                {/* Particle effect on hover */}
                {hoveredIndex === index && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-red-500 rounded-full animate-ping"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${30 + (i % 2) * 20}%`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: '1s',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors duration-300 font-['Montserrat']">
                {skill.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {skill.description}
              </p>

              {/* Border Glow */}
              <div 
                className={`absolute inset-0 rounded-xl border-2 border-red-600/0 transition-colors duration-300 pointer-events-none ${
                  hoveredIndex === index ? 'border-red-600/50' : ''
                }`}
              />

              {/* Shadow */}
              <div 
                className="absolute -inset-1 rounded-xl bg-red-600/20 blur-xl transition-opacity duration-300 -z-10"
                style={{ opacity: hoveredIndex === index ? 0.3 : 0 }}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">
            Want to see these skills in action?
          </p>
          <button
            onClick={() => document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition-colors"
          >
            <span>Watch My Content</span>
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Skills;
