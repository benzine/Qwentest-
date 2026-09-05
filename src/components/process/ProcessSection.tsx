'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const processSteps = [
  {
    phase: 'Discovery',
    title: 'Understanding Your Challenge',
    description: 'Deep dive into your organization, industry, and specific challenges.',
    deliverables: ['Stakeholder Interviews', 'Current State Assessment', 'Opportunity Mapping'],
    duration: '2-3 weeks',
  },
  {
    phase: 'Analysis',
    title: 'Data-Driven Insights',
    description: 'Rigorous analysis to uncover root causes and hidden opportunities.',
    deliverables: ['Market Analysis', 'Competitive Benchmarking', 'Financial Modeling'],
    duration: '3-4 weeks',
  },
  {
    phase: 'Strategy',
    title: 'Crafting the Path Forward',
    description: 'Developing actionable strategies tailored to your unique situation.',
    deliverables: ['Strategic Roadmap', 'Implementation Plan', 'Risk Mitigation'],
    duration: '2-3 weeks',
  },
  {
    phase: 'Execution',
    title: 'Turning Vision into Reality',
    description: 'Hands-on support to ensure successful implementation.',
    deliverables: ['Change Management', 'Process Optimization', 'Performance Tracking'],
    duration: '8-12 weeks',
  },
  {
    phase: 'Transformation',
    title: 'Sustainable Impact',
    description: 'Embedding capabilities for long-term success.',
    deliverables: ['Capability Building', 'Knowledge Transfer', 'Continuous Improvement'],
    duration: 'Ongoing',
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal timeline animation
      if (timelineRef.current) {
        gsap.to(timelineRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
          x: -200,
          ease: 'none',
        });
      }

      // Portal materialization for each step
      processSteps.forEach((step, index) => {
        const element = document.getElementById(`process-step-${index}`);
        if (element) {
          gsap.from(element, {
            scrollTrigger: {
              trigger: element,
              start: 'top 70%',
              end: 'top 40%',
              scrub: 1,
            },
            scale: 0.8,
            opacity: 0,
            filter: 'blur(20px)',
            ease: 'power2.out',
          });
        }
      });

      // Progress circle animation
      if (progressCircleRef.current) {
        const circumference = 2 * Math.PI * 50;
        gsap.to(progressCircleRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
          strokeDashoffset: circumference * 0.3,
          ease: 'none',
        });
      }

      // Time dilation effect
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'center center',
        onEnter: () => {
          gsap.to('.process-step', {
            timeScale: 0.5,
            duration: 0.5,
          });
        },
        onLeaveBack: () => {
          gsap.to('.process-step', {
            timeScale: 1,
            duration: 0.5,
          });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative min-h-screen py-32 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-brand-navy to-brand-charcoal"
    >
      {/* Progress Indicator */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-20 hidden lg:block">
        <svg width="120" height="120" className="rotate-[-90deg]">
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#1a1f2e"
            strokeWidth="4"
          />
          <circle
            ref={progressCircleRef}
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#d4af37"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 50}
            strokeDashoffset={2 * Math.PI * 50}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-brand-gold font-serif text-lg rotate-[90deg]">
          Process
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-white text-center mb-8">
          Our Methodology
        </h2>
        <p className="font-sans text-xl text-gray-400 text-center mb-20 max-w-3xl mx-auto">
          A proven five-phase approach that accelerates transformation and ensures sustainable results.
        </p>

        {/* Timeline with Portals */}
        <div className="relative">
          {/* Connection Ribbons */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-gold via-brand-teal to-brand-amber hidden lg:block" />

          <div ref={timelineRef} className="space-y-24 lg:space-y-32">
            {processSteps.map((step, index) => (
              <div
                key={step.phase}
                id={`process-step-${index}`}
                className={`process-step relative ${
                  index % 2 === 0 ? 'lg:pr-1/2' : 'lg:pl-1/2 lg:ml-auto'
                } max-w-xl`}
              >
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-brand-gold rounded-full border-4 border-brand-navy hidden lg:block" />

                {/* Portal Card */}
                <div className="glass-effect rounded-2xl p-8 backdrop-blur-sm ml-8 lg:ml-0 hover:border-brand-gold/50 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold to-brand-amber flex items-center justify-center text-brand-navy font-bold font-serif text-xl">
                      {index + 1}
                    </span>
                    <div>
                      <span className="text-brand-teal uppercase tracking-widest text-sm font-semibold">
                        Phase {index + 1}
                      </span>
                      <h3 className="font-serif text-2xl text-white">
                        {step.phase}
                      </h3>
                    </div>
                  </div>

                  <h4 className="font-sans text-xl text-gray-200 mb-4">
                    {step.title}
                  </h4>

                  <p className="font-sans text-gray-400 mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    {step.deliverables.map((deliverable) => (
                      <div key={deliverable} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-brand-teal rounded-full" />
                        <span className="text-gray-300 text-sm">{deliverable}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-brand-gold text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{step.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
