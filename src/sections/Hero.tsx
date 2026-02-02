import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Play, ArrowRight, Camera } from 'lucide-react';
import { CLOUDINARY_CONFIG } from '@/lib/cloudinary';




// Load hero image from localStorage
const loadHeroImage = (): string => {
  try {
    const saved = localStorage.getItem('portfolio_hero_image');
    return saved || '/hero-profile.jpg';
  } catch {
    return '/hero-profile.jpg';
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

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLCanvasElement>(null);

  const [heroImage, setHeroImage] = useState<string>(loadHeroImage);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Save hero image to localStorage
  useEffect(() => {
    if (heroImage !== '/hero-profile.jpg') {
      localStorage.setItem('portfolio_hero_image', heroImage);
    }
  }, [heroImage]);

  // Load Cloudinary script
  useEffect(() => {
    if (!document.querySelector('script[src*="cloudinary"]')) {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      const titleChars = titleRef.current?.querySelectorAll('.char');
      if (titleChars) {
        gsap.fromTo(
          titleChars,
          { opacity: 0, y: 50, rotateX: -90 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            stagger: 0.05,
            ease: 'expo.out',
            delay: 0.3,
          }
        );
      }

      // Subtitle typewriter effect
      if (subtitleRef.current) {
        const text = subtitleRef.current.textContent || '';
        subtitleRef.current.textContent = '';

        gsap.to(
          {},
          {
            duration: text.length * 0.03,
            delay: 0.8,
            onUpdate: function () {
              const progress = this.progress();
              const charIndex = Math.floor(progress * text.length);
              if (subtitleRef.current) {
                subtitleRef.current.textContent = text.slice(0, charIndex);
              }
            },
          }
        );
      }

      // Buttons animation
      if (buttonsRef.current) {
        gsap.fromTo(
          buttonsRef.current.children,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.15,
            ease: 'elastic.out(1, 0.5)',
            delay: 1.2,
          }
        );
      }

      // Image animation
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, x: 200, rotateY: 30 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 1,
            ease: 'expo.out',
            delay: 0.6,
          }
        );
      }
    }, heroRef);

    // Particle animation
    const canvas = particlesRef.current;
    if (canvas) {
      const ctx2d = canvas.getContext('2d');
      if (ctx2d) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
        const particleCount = 25;

        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
          });
        }

        let animationId: number;
        const animate = () => {
          ctx2d.clearRect(0, 0, canvas.width, canvas.height);

          particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx2d.beginPath();
            ctx2d.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx2d.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx2d.fill();

            // Draw connections
            particles.slice(i + 1).forEach((p2) => {
              const dx = p.x - p2.x;
              const dy = p.y - p2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < 100) {
                ctx2d.beginPath();
                ctx2d.moveTo(p.x, p.y);
                ctx2d.lineTo(p2.x, p2.y);
                ctx2d.strokeStyle = `rgba(255, 0, 0, ${0.2 * (1 - dist / 100)})`;
                ctx2d.stroke();
              }
            });
          });

          animationId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
          cancelAnimationFrame(animationId);
          window.removeEventListener('resize', handleResize);
          ctx.revert();
        };
      }
    }

    return () => ctx.revert();
  }, []);

  // Listen for admin mode changes from Navigation
  useEffect(() => {
    const checkAdminMode = () => {
      const adminState = localStorage.getItem('portfolio_admin_mode') === 'true';
      setIsAdminMode(adminState);
    };

    // Check on mount
    checkAdminMode();

    // Poll for changes
    const interval = setInterval(checkAdminMode, 500);

    return () => clearInterval(interval);
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
          setHeroImage(result.info.secure_url);
          setIsUploading(false);
        }
      }
    );

    widget.open();
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const firstName = 'SACHIN';
  const lastName = 'PRADHAN';

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Particle Canvas */}
      <canvas
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-800/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Diagonal Line */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1="100%"
          x2="100%"
          y2="0"
          stroke="rgba(255, 0, 0, 0.1)"
          strokeWidth="1"
          className="animate-pulse"
        />
      </svg>


      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Text */}
        <div className="text-center lg:text-left">
          <h1
            ref={titleRef}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 font-['Montserrat'] perspective-1000"
          >
            <span className="block">
              {firstName.split('').map((char, i) => (
                <span key={i} className="char inline-block" style={{ transformStyle: 'preserve-3d' }}>
                  {char}
                </span>
              ))}
            </span>
            <span className="block text-red-600">
              {lastName.split('').map((char, i) => (
                <span key={i} className="char inline-block" style={{ transformStyle: 'preserve-3d' }}>
                  {char}
                </span>
              ))}
            </span>
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl text-gray-400 mb-8 font-['Open_Sans']"
          >
            Public Speaker | Content Creator | On-Camera Personality
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => scrollToSection('videos')}
              className="group relative overflow-hidden bg-red-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/40 hover:-translate-y-1"
            >
              <Play size={20} className="transition-transform group-hover:scale-110" />
              <span>Watch My Videos</span>
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="group relative border-2 border-white text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white hover:text-black hover:-translate-y-1"
            >
              <span>Contact Me</span>
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Right Column - Image */}
        <div
          ref={imageRef}
          className="relative flex justify-center lg:justify-end perspective-1200"
        >
          <div className="relative float-animation">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-red-600/20 rounded-2xl blur-3xl scale-110 pulse-glow" />

            {/* Image Container */}
            <div className="relative group">
              <img
                src={heroImage}
                alt="Sachin Pradhan"
                className="relative z-10 w-full max-w-sm lg:max-w-md object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
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

              {/* Red Accent Border */}
              <div className="absolute -inset-2 border-2 border-red-600/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Corner Accents */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-red-600" />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
