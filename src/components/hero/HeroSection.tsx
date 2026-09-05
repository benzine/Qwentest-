'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroScene from './HeroScene';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Camera push-in effect
      tl.to('.hero-canvas', {
        scale: 1.5,
        ease: 'power2.inOut',
      }, 0);

      // Headline deconstruction and motion blur
      tl.to(headlineRef.current, {
        filter: 'blur(10px)',
        opacity: 0.8,
        y: -100,
        ease: 'power2.inOut',
      }, 0);

      // Tagline transformation
      tl.to(taglineRef.current, {
        y: -50,
        opacity: 0,
        ease: 'power2.out',
      }, 0.3);

      // CTA morphing
      tl.to(ctaRef.current, {
        scale: 0.8,
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        ease: 'power2.inOut',
      }, 0);

      // Scroll indicator disintegration
      tl.to(scrollIndicatorRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.5,
        ease: 'power2.in',
      }, 0.2);

      // Lens flare intensification (simulated with overlay)
      tl.to('.lens-flare-overlay', {
        opacity: 0.3,
        ease: 'power2.inOut',
      }, 0);

      // Vignette breathing
      tl.to('.vignette-overlay', {
        opacity: 0.6,
        ease: 'power2.inOut',
      }, 0);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Three.js Background */}
      <div className="hero-canvas absolute inset-0">
        <HeroScene />
      </div>

      {/* Lens Flare Overlay */}
      <div className="lens-flare-overlay fixed inset-0 pointer-events-none z-10 opacity-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-yellow-400/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-gradient-radial from-teal-400/15 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Vignette Effect */}
      <div className="vignette-overlay fixed inset-0 pointer-events-none z-10 opacity-0">
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-brand-navy/50 to-brand-navy" />
      </div>

      {/* Film Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-10 mix-blend-overlay">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
        <h1
          ref={headlineRef}
          className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold mb-6 text-white tracking-tight"
        >
          APEX CONSULTING
        </h1>

        <p
          ref={taglineRef}
          className="font-sans text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 font-light tracking-wide"
        >
          Transforming Complexity Into Clarity
        </p>

        <button
          ref={ctaRef}
          className="group relative px-8 py-4 bg-gradient-to-r from-brand-gold to-brand-amber rounded-full text-brand-navy font-semibold text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-brand-gold/30"
        >
          <span className="relative z-10">Discover</span>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-teal to-brand-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <span className="text-sm uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-gray-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* Anamorphic Letterboxing */}
      <div className="fixed top-0 left-0 w-full h-16 bg-black/80 z-30 hidden md:block" />
      <div className="fixed bottom-0 left-0 w-full h-16 bg-black/80 z-30 hidden md:block" />
    </section>
  );
}
