'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const services = [
  {
    title: 'Strategic Planning',
    description: 'Comprehensive roadmap development aligned with your vision and market dynamics.',
    icon: '🎯',
    benefits: ['Market Analysis', 'Competitive Intelligence', 'Growth Strategy'],
  },
  {
    title: 'Digital Transformation',
    description: 'End-to-end digital modernization leveraging cutting-edge technologies.',
    icon: '💻',
    benefits: ['Cloud Migration', 'Process Automation', 'Data Analytics'],
  },
  {
    title: 'Operational Excellence',
    description: 'Streamlining operations for maximum efficiency and scalability.',
    icon: '⚡',
    benefits: ['Process Optimization', 'Lean Methodologies', 'Quality Management'],
  },
  {
    title: 'Mergers & Acquisitions',
    description: 'Strategic guidance through complex M&A transactions and integrations.',
    icon: '🤝',
    benefits: ['Due Diligence', 'Valuation Analysis', 'Post-Merger Integration'],
  },
  {
    title: 'Risk Management',
    description: 'Proactive identification and mitigation of business risks.',
    icon: '🛡️',
    benefits: ['Risk Assessment', 'Compliance Frameworks', 'Crisis Management'],
  },
  {
    title: 'Sustainability',
    description: 'Building sustainable practices that drive long-term value.',
    icon: '🌱',
    benefits: ['ESG Strategy', 'Carbon Reduction', 'Circular Economy'],
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const geometryRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Geometry morphing animation
      gsap.to(geometryRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        rotateX: 360,
        rotateY: 360,
        scale: 1.2,
        ease: 'none',
      });

      // Service cards orbit effect
      const cards = cardsContainerRef.current?.children;
      if (cards) {
        Array.from(cards).forEach((card, index) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 1,
            },
            x: Math.cos(index * 60 * (Math.PI / 180)) * 200,
            y: Math.sin(index * 60 * (Math.PI / 180)) * 200,
            opacity: 0,
            rotation: index * 30,
            ease: 'power2.out',
          });
        });
      }

      // Explosion effect at milestone
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'center center',
        onEnter: () => {
          gsap.to('.service-card', {
            scale: 1.05,
            stagger: 0.1,
            duration: 0.5,
            ease: 'back.out(1.7)',
          });
        },
        onLeaveBack: () => {
          gsap.to('.service-card', {
            scale: 1,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.inOut',
          });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative min-h-screen py-32 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-brand-charcoal to-brand-navy"
    >
      {/* Central Geometric Shape */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          ref={geometryRef}
          className="w-96 h-96 relative"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
            <polygon
              points="100,10 190,50 190,150 100,190 10,150 10,50"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.5"
            />
            <polygon
              points="100,30 170,60 170,140 100,170 30,140 30,60"
              fill="none"
              stroke="#14b8a6"
              strokeWidth="0.5"
            />
            <circle cx="100" cy="100" r="50" fill="none" stroke="#f59e0b" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-white text-center mb-20">
          Our Services
        </h2>

        <div
          ref={cardsContainerRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`service-card glass-effect rounded-2xl p-8 backdrop-blur-sm hover:border-brand-gold/50 transition-all duration-500 cursor-pointer group`}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              
              <h3 className="font-serif text-2xl text-white mb-4 group-hover:text-brand-gold transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="font-sans text-gray-400 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 bg-brand-teal rounded-full" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
