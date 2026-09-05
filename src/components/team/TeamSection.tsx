'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const teamMembers = [
  { name: 'Alexandra Chen', role: 'CEO & Founder', department: 'Leadership', star: '★' },
  { name: 'Marcus Williams', role: 'Managing Partner', department: 'Leadership', star: '★' },
  { name: 'Sarah Mitchell', role: 'Head of Strategy', department: 'Strategy', star: '☆' },
  { name: 'David Park', role: 'Head of Technology', department: 'Technology', star: '☆' },
  { name: 'Emma Rodriguez', role: 'Head of Operations', department: 'Operations', star: '☆' },
  { name: 'James Thompson', role: 'Senior Consultant', department: 'Strategy', star: '☆' },
  { name: 'Lisa Wang', role: 'Senior Consultant', department: 'Technology', star: '☆' },
  { name: 'Michael Brown', role: 'Consultant', department: 'Operations', star: '·' },
];

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const starfieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Starfield to constellation transformation
      if (starfieldRef.current) {
        gsap.to(starfieldRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
          opacity: 0.5,
          scale: 1.2,
          ease: 'power2.out',
        });
      }

      // Team member supernova reveal
      gsap.utils.toArray('.team-star').forEach((star: any, index) => {
        gsap.from(star, {
          scrollTrigger: {
            trigger: star,
            start: 'top 70%',
            scrub: 1,
          },
          scale: 0,
          opacity: 0,
          rotation: index * 45,
          ease: 'back.out(2)',
        });

        // Content reveal after star
        gsap.from(star.querySelector('.team-content'), {
          scrollTrigger: {
            trigger: star,
            start: 'top 60%',
            scrub: 1,
          },
          opacity: 0,
          y: 20,
          ease: 'power2.out',
        });
      });

      // Gravitational pull effect on nearby elements
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'center center',
        onEnter: () => {
          gsap.to('.team-card', {
            x: (i) => Math.sin(i * 0.5) * 10,
            stagger: 0.1,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative min-h-screen py-32 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-brand-charcoal to-brand-navy"
    >
      {/* Starfield Background */}
      <div
        ref={starfieldRef}
        className="absolute inset-0 pointer-events-none"
      >
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-white text-center mb-8">
          Our Constellation
        </h2>
        <p className="font-sans text-xl text-gray-400 text-center mb-20 max-w-3xl mx-auto">
          Brilliant minds assembled to illuminate your path forward.
        </p>

        {/* Department Sections */}
        <div className="space-y-24">
          {/* Leadership */}
          <div>
            <h3 className="font-serif text-3xl text-brand-gold text-center mb-12">
              Leadership
            </h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {teamMembers
                .filter((m) => m.department === 'Leadership')
                .map((member, index) => (
                  <div
                    key={member.name}
                    className="team-card team-star glass-effect rounded-2xl p-8 backdrop-blur-sm hover:border-brand-gold/50 transition-all duration-500 cursor-pointer group text-center"
                  >
                    <div className="text-6xl text-brand-gold mb-4 group-hover:scale-110 transition-transform duration-300">
                      {member.star}
                    </div>
                    <div className="team-content">
                      <h4 className="font-serif text-2xl text-white mb-2">
                        {member.name}
                      </h4>
                      <p className="font-sans text-brand-teal">{member.role}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Department Heads */}
          <div>
            <h3 className="font-serif text-3xl text-brand-teal text-center mb-12">
              Department Heads
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers
                .filter((m) => m.department !== 'Leadership' && m.role.includes('Head'))
                .map((member, index) => (
                  <div
                    key={member.name}
                    className="team-card team-star glass-effect rounded-2xl p-8 backdrop-blur-sm hover:border-brand-teal/50 transition-all duration-500 cursor-pointer group text-center"
                  >
                    <div className="text-5xl text-brand-teal mb-4 group-hover:scale-110 transition-transform duration-300">
                      {member.star}
                    </div>
                    <div className="team-content">
                      <h4 className="font-serif text-xl text-white mb-2">
                        {member.name}
                      </h4>
                      <p className="font-sans text-gray-400">{member.role}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Extended Team */}
          <div>
            <h3 className="font-serif text-3xl text-brand-amber text-center mb-12">
              Senior Team
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              {teamMembers
                .filter((m) => !m.role.includes('Head') && m.department !== 'Leadership')
                .map((member, index) => (
                  <div
                    key={member.name}
                    className="team-card team-star glass-effect rounded-xl p-6 backdrop-blur-sm hover:border-brand-amber/50 transition-all duration-500 cursor-pointer group text-center"
                  >
                    <div className="text-4xl text-brand-amber mb-3 group-hover:scale-110 transition-transform duration-300">
                      {member.star}
                    </div>
                    <div className="team-content">
                      <h4 className="font-serif text-lg text-white mb-1">
                        {member.name}
                      </h4>
                      <p className="font-sans text-gray-400 text-sm">{member.role}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Careers CTA */}
        <div className="text-center mt-24">
          <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-brand-gold to-brand-amber rounded-full text-brand-navy font-semibold text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-brand-gold/30">
            <span>Join Our Constellation</span>
            <svg 
              className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
