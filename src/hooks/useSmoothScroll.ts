'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollStore } from '@/store';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Sync with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Track scroll velocity
    let lastScrollY = 0;
    let lastTime = Date.now();

    lenis.on('scroll', ({ scroll, velocity }) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastTime;
      const scrollDiff = scroll - lastScrollY;
      
      if (timeDiff > 0) {
        const calculatedVelocity = Math.abs(scrollDiff / timeDiff);
        useScrollStore.getState().setScrollVelocity(calculatedVelocity);
        useScrollStore.getState().setScrollY(scroll);
        useScrollStore.getState().setIsScrolling(true);

        // Reset scrolling state after pause
        setTimeout(() => {
          useScrollStore.getState().setIsScrolling(false);
        }, 150);
      }

      lastScrollY = scroll;
      lastTime = currentTime;
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}

export function useSectionObserver(sectionIds: string[]) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            useScrollStore.getState().setCurrentSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sectionIds]);
}
