import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  threshold?: number;
  delay?: number;
  duration?: number;
  y?: number;
  stagger?: number;
}

export const useScrollReveal = (options: ScrollRevealOptions = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const {
      delay = 0,
      duration = 0.6,
      y = 40,
      stagger = 0.1
    } = options;

    const children = element.children;
    
    gsap.set(children, { opacity: 0, y });

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger,
          ease: 'expo.out'
        });
      },
      once: true
    });

    triggersRef.current.push(trigger);

    return () => {
      triggersRef.current.forEach(t => t.kill());
      triggersRef.current = [];
    };
  }, [options]);

  return ref;
};

export const useParallax = (speed: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const yPos = self.progress * 100 * speed;
        gsap.set(element, { y: yPos });
      }
    });

    triggerRef.current = trigger;

    return () => {
      triggerRef.current?.kill();
    };
  }, [speed]);

  return ref;
};

export const useCountUp = (end: number, duration: number = 2) => {
  const ref = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const obj = { value: 0 };

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(obj, {
          value: end,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            element.textContent = Math.floor(obj.value).toString();
          }
        });
      },
      once: true
    });

    triggerRef.current = trigger;

    return () => {
      triggerRef.current?.kill();
    };
  }, [end, duration]);

  return ref;
};
