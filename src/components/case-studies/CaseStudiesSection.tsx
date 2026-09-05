'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const caseStudies = [
  {
    client: 'Fortune 100 Tech Company',
    challenge: 'Digital transformation across 40 countries',
    solution: 'Implemented cloud-first strategy with AI-powered automation',
    results: [
      { metric: '47%', label: 'Cost Reduction' },
      { metric: '3.2x', label: 'Faster Time to Market' },
      { metric: '$2.4B', label: 'Value Created' },
    ],
    logo: '🏢',
  },
  {
    client: 'Global Financial Services',
    challenge: 'Regulatory compliance modernization',
    solution: 'Built real-time risk monitoring platform',
    results: [
      { metric: '99.9%', label: 'Compliance Rate' },
      { metric: '60%', label: 'Faster Reporting' },
      { metric: '$500M', label: 'Risk Mitigated' },
    ],
    logo: '🏦',
  },
  {
    client: 'Healthcare Leader',
    challenge: 'Patient experience transformation',
    solution: 'End-to-end digital patient journey redesign',
    results: [
      { metric: '85%', label: 'Patient Satisfaction' },
      { metric: '40%', label: 'Wait Time Reduction' },
      { metric: '2M+', label: 'Patients Impacted' },
    ],
    logo: '🏥',
  },
  {
    client: 'Manufacturing Giant',
    challenge: 'Supply chain resilience',
    solution: 'AI-driven predictive supply network',
    results: [
      { metric: '95%', label: 'On-Time Delivery' },
      { metric: '30%', label: 'Inventory Optimization' },
      { metric: '$1.1B', label: 'Efficiency Gains' },
    ],
    logo: '🏭',
  },
];

export default function CaseStudiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gravityWellRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Gravity well effect
      if (gravityWellRef.current) {
        gsap.to(gravityWellRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
          scale: 1.5,
          opacity: 0.8,
          ease: 'power2.inOut',
        });
      }

      // Cards orbital entry
      const cards = cardsContainerRef.current?.children;
      if (cards) {
        Array.from(cards).forEach((card, index) => {
          const angle = (index / cards.length) * Math.PI * 2;
          const radius = 300;
          
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              scrub: 1,
            },
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            opacity: 0,
            rotation: angle * (180 / Math.PI),
            ease: 'power2.out',
          });
        });
      }

      // Metrics particle materialization
      gsap.utils.toArray('.metric-particle').forEach((particle: any) => {
        gsap.from(particle, {
          scrollTrigger: {
            trigger: particle,
            start: 'top 70%',
            scrub: 1,
          },
          scale: 0,
          opacity: 0,
          ease: 'back.out(1.7)',
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="case-studies"
      ref={sectionRef}
      className="relative min-h-screen py-32 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-brand-charcoal to-brand-navy"
    >
      {/* Gravity Well */}
      <div
        ref={gravityWellRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-radial from-brand-gold/10 via-brand-teal/5 to-transparent blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-white text-center mb-8">
          Results That Speak
        </h2>
        <p className="font-sans text-xl text-gray-400 text-center mb-20 max-w-3xl mx-auto">
          Real transformations for industry leaders across the globe.
        </p>

        <div
          ref={cardsContainerRef}
          className="grid md:grid-cols-2 gap-8"
        >
          {caseStudies.map((study, index) => (
            <div
              key={study.client}
              className="glass-effect rounded-2xl p-8 backdrop-blur-sm hover:border-brand-gold/50 transition-all duration-500 cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">{study.logo}</span>
                <h3 className="font-serif text-xl text-white group-hover:text-brand-gold transition-colors duration-300">
                  {study.client}
                </h3>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <span className="text-brand-teal text-sm uppercase tracking-widest">Challenge</span>
                  <p className="text-gray-300 mt-1">{study.challenge}</p>
                </div>
                <div>
                  <span className="text-brand-amber text-sm uppercase tracking-widest">Solution</span>
                  <p className="text-gray-300 mt-1">{study.solution}</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-700">
                {study.results.map((result) => (
                  <div key={result.label} className="metric-particle text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gradient">
                      {result.metric}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{result.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
