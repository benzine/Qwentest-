'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fluidCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Magnetic text effect
      const words = contentRef.current?.querySelectorAll('.magnetic-word');
      
      words?.forEach((word) => {
        ScrollTrigger.create({
          trigger: word,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => {
            gsap.to(word, {
              scale: 1.05,
              duration: 0.3,
              ease: 'power2.out',
            });
          },
          onLeaveBack: () => {
            gsap.to(word, {
              scale: 1,
              duration: 0.3,
              ease: 'power2.out',
            });
          },
        });
      });

      // Fluid simulation background parallax
      if (fluidCanvasRef.current) {
        gsap.to(fluidCanvasRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
          y: -100,
          opacity: 0.8,
        });
      }

      // Content fade in with elastic effect
      gsap.from(contentRef.current?.children, {
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: 1,
        },
        y: 100,
        opacity: 0,
        stagger: 0.2,
        ease: 'elastic.out(1, 0.5)',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen py-32 px-4 md:px-8 overflow-hidden"
    >
      {/* Fluid Simulation Background */}
      <div className="absolute inset-0 z-0">
        <canvas
          ref={fluidCanvasRef}
          className="w-full h-full opacity-30"
          style={{
            background: 'linear-gradient(135deg, #0a1628 0%, #1a1f2e 50%, #1e3a5f 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-charcoal/70 to-brand-blue/80" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center"
      >
        <div className="space-y-8">
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-white">
            Our Story
          </h2>
          
          <p className="font-sans text-lg text-gray-300 leading-relaxed">
            <span className="magnetic-word inline-block">Founded on the belief that</span>{' '}
            <span className="magnetic-word inline-block">every challenge contains</span>{' '}
            <span className="magnetic-word inline-block">the seeds of transformation,</span>{' '}
            <span className="magnetic-word inline-block">Apex Consulting has</span>{' '}
            <span className="magnetic-word inline-block">guided Fortune 500 companies</span>{' '}
            <span className="magnetic-word inline-block">through their most critical</span>{' '}
            <span className="magnetic-word inline-block">moments of change.</span>
          </p>

          <p className="font-sans text-lg text-gray-300 leading-relaxed">
            We combine deep industry expertise with innovative methodologies 
            to deliver results that exceed expectations and create lasting impact.
          </p>
        </div>

        <div className="space-y-8">
          <div className="glass-effect rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="font-serif text-3xl text-brand-gold mb-4">
              Mission
            </h3>
            <p className="font-sans text-gray-300">
              To empower organizations with strategic clarity, operational excellence, 
              and transformative insights that drive sustainable growth.
            </p>
          </div>

          <div className="glass-effect rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="font-serif text-3xl text-brand-teal mb-4">
              Values
            </h3>
            <ul className="font-sans text-gray-300 space-y-2">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-brand-gold rounded-full" />
                Integrity in every engagement
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-brand-teal rounded-full" />
                Innovation through collaboration
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-brand-amber rounded-full" />
                Excellence as a standard
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-brand-gold rounded-full" />
                Impact that endures
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
