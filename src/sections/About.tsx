import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mic, Video, Users, MessageSquare, FileText, Camera } from 'lucide-react';
import { CLOUDINARY_CONFIG } from '@/lib/cloudinary';

gsap.registerPlugin(ScrollTrigger);

// Load about image from localStorage
const loadAboutImage = (): string => {
  try {
    const saved = localStorage.getItem('portfolio_about_image');
    return saved || '/about-portrait.jpg';
  } catch {
    return '/about-portrait.jpg';
  }
};

// Check if admin mode is active (shared with Hero)
const isAdminActive = (): boolean => {
  try {
    return localStorage.getItem('portfolio_admin_mode') === 'true';
  } catch {
    return false;
  }
};

// Declare the Cloudinary widget type
declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        config: {
          cloudName: string;
          uploadPreset: string;
          sources: string[];
          multiple: boolean;
          resourceType: string;
          maxFileSize: number;
          clientAllowedFormats: string[];
          cropping?: boolean;
          croppingAspectRatio?: number;
        },
        callback: (error: Error | null, result: { event: string; info: { secure_url: string; public_id: string } }) => void
      ) => { open: () => void };
    };
  }
}

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const [aboutImage, setAboutImage] = useState<string>(loadAboutImage);
  const [isAdminMode, setIsAdminMode] = useState(isAdminActive);
  const [isUploading, setIsUploading] = useState(false);

  // Listen for admin mode changes from Hero section
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdminMode(localStorage.getItem('portfolio_admin_mode') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically for same-tab updates
    const interval = setInterval(() => {
      const currentAdminState = localStorage.getItem('portfolio_admin_mode') === 'true';
      if (currentAdminState !== isAdminMode) {
        setIsAdminMode(currentAdminState);
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isAdminMode]);

  // Save about image to localStorage
  useEffect(() => {
    if (aboutImage !== '/about-portrait.jpg') {
      localStorage.setItem('portfolio_about_image', aboutImage);
    }
  }, [aboutImage]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content animation
      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll('.reveal-item');
        gsap.fromTo(
          elements,
          { opacity: 0, y: 40, clipPath: 'inset(0 100% 0 0)' },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.6,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      // Image animation
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, x: -100, rotateY: -45 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openCloudinaryWidget = () => {
    if (!window.cloudinary) {
      alert('Cloudinary widget is still loading. Please try again.');
      return;
    }

    setIsUploading(true);

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CONFIG.cloudName,
        uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        resourceType: 'image',
        maxFileSize: 10000000, // 10MB
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        cropping: true,
        croppingAspectRatio: 3 / 4,
      },
      (error, result) => {
        if (error) {
          console.error('Upload error:', error);
          setIsUploading(false);
          return;
        }

        if (result.event === 'success') {
          setAboutImage(result.info.secure_url);
          setIsUploading(false);
        }
      }
    );

    widget.open();
  };

  const skills = [
    { icon: Mic, label: 'Public Speaking' },
    { icon: Video, label: 'Content Creation' },
    { icon: Users, label: 'Audience Engagement' },
    { icon: MessageSquare, label: 'Brand Communication' },
    { icon: FileText, label: 'Scriptwriting' },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 bg-black overflow-hidden"
    >
      {/* Diagonal Line */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        preserveAspectRatio="none"
      >
        <line
          x1="30%"
          y1="0"
          x2="70%"
          y2="100%"
          stroke="#FF0000"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Image */}
          <div
            ref={imageRef}
            className="relative order-2 lg:order-1 perspective-1000"
          >
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-red-600/10 rounded-2xl blur-3xl scale-110" />

              {/* Main Image */}
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={aboutImage}
                  alt="Sachin Pradhan"
                  className="w-full max-w-md mx-auto object-contain transition-transform duration-700 group-hover:scale-105"
                />

                {/* Admin Edit Button */}
                {isAdminMode && (
                  <button
                    onClick={openCloudinaryWidget}
                    disabled={isUploading}
                    className="absolute bottom-4 right-4 z-20 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <Camera size={20} />
                  </button>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Corner Accents */}
              <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-red-600" />
              <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-red-600" />

              {/* Floating Skill Tags */}
              <div className="absolute -right-4 top-1/4 bg-[#1A1A1A] px-4 py-2 rounded-lg shadow-xl border border-gray-800 animate-pulse">
                <span className="text-sm text-red-500 font-medium">Creator</span>
              </div>
              <div className="absolute -left-4 bottom-1/4 bg-[#1A1A1A] px-4 py-2 rounded-lg shadow-xl border border-gray-800 animate-pulse" style={{ animationDelay: '0.5s' }}>
                <span className="text-sm text-red-500 font-medium">Speaker</span>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div ref={contentRef} className="order-1 lg:order-2">
            <span className="reveal-item section-label mb-4 block">ABOUT ME</span>

            <h2 className="reveal-item text-4xl sm:text-5xl font-bold text-white mb-6 font-['Montserrat']">
              Creator. Speaker.{' '}
              <span className="text-red-600">Storyteller.</span>
            </h2>

            <div className="reveal-item space-y-4 text-gray-400 text-lg leading-relaxed mb-8">
              <p>
                I'm Sachin Pradhan, a content creator and public speaker who turns
                ideas into engaging stories. With confidence in front of the camera
                and a passion for authentic connection, I help brands communicate their
                message while building communities that care.
              </p>
              <p>
                Every piece of content I create is designed to resonate, engage, and
                inspire action. Whether it's a brand collaboration or a stage presentation,
                I bring energy, professionalism, and a unique voice that stands out.
              </p>
            </div>

            {/* Skills Tags */}
            <div className="reveal-item flex flex-wrap gap-3 mb-10">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 bg-[#1A1A1A] hover:bg-red-600/10 border border-gray-800 hover:border-red-600/50 px-4 py-2 rounded-lg transition-all duration-300 cursor-default"
                >
                  <skill.icon size={16} className="text-red-500 group-hover:text-red-400" />
                  <span className="text-sm text-gray-300 group-hover:text-white">{skill.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
