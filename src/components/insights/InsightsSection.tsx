'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const insights = [
  {
    title: 'The Future of Digital Transformation',
    category: 'Strategy',
    date: 'December 2024',
    excerpt: 'How AI and automation are reshaping the competitive landscape.',
    readTime: '8 min read',
  },
  {
    title: 'Building Resilient Supply Chains',
    category: 'Operations',
    date: 'November 2024',
    excerpt: 'Lessons from global disruptions and paths to resilience.',
    readTime: '6 min read',
  },
  {
    title: 'ESG as a Strategic Advantage',
    category: 'Sustainability',
    date: 'November 2024',
    excerpt: 'Turning environmental commitments into business value.',
    readTime: '7 min read',
  },
  {
    title: 'The Human Element in Automation',
    category: 'Technology',
    date: 'October 2024',
    excerpt: 'Balancing efficiency with employee experience.',
    readTime: '5 min read',
  },
];

export default function InsightsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const networkContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Network growth animation
      if (networkContainerRef.current) {
        gsap.from(networkContainerRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
          opacity: 0.3,
          scale: 0.8,
          ease: 'power2.out',
        });
      }

      // Article cards blooming
      gsap.utils.toArray('.insight-node').forEach((node: any, index) => {
        gsap.from(node, {
          scrollTrigger: {
            trigger: node,
            start: 'top 80%',
            scrub: 1,
          },
          scale: 0,
          opacity: 0,
          rotation: index * 15,
          ease: 'elastic.out(1, 0.5)',
        });
      });

      // Connection lines pulsing
      gsap.utils.toArray('.connection-line').forEach((line: any) => {
        gsap.to(line, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
          strokeDashoffset: 0,
          ease: 'none',
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="insights"
      ref={sectionRef}
      className="relative min-h-screen py-32 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-brand-navy to-brand-charcoal"
    >
      {/* Neural Network Background */}
      <div
        ref={networkContainerRef}
        className="absolute inset-0 pointer-events-none opacity-20"
      >
        <svg className="w-full h-full">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
              <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Connection Lines */}
          {[...Array(10)].map((_, i) => (
            <line
              key={i}
              className="connection-line"
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              strokeDasharray="10 5"
              fill="none"
            />
          ))}
          
          {/* Nodes */}
          {[...Array(20)].map((_, i) => (
            <circle
              key={i}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r="3"
              fill="#14b8a6"
              opacity="0.6"
            />
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-white text-center mb-8">
          Insights & Thinking
        </h2>
        <p className="font-sans text-xl text-gray-400 text-center mb-20 max-w-3xl mx-auto">
          Perspectives on the trends shaping business today and tomorrow.
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {['All', 'Strategy', 'Operations', 'Technology', 'Sustainability'].map((filter) => (
            <button
              key={filter}
              className="px-6 py-2 rounded-full border border-gray-600 text-gray-300 hover:border-brand-gold hover:text-brand-gold transition-all duration-300"
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {insights.map((insight, index) => (
            <article
              key={insight.title}
              className="insight-node glass-effect rounded-2xl p-8 backdrop-blur-sm hover:border-brand-teal/50 transition-all duration-500 cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 text-xs uppercase tracking-widest text-brand-teal border border-brand-teal/30 rounded-full">
                  {insight.category}
                </span>
                <span className="text-gray-500 text-sm">{insight.date}</span>
              </div>

              <h3 className="font-serif text-2xl text-white mb-4 group-hover:text-brand-gold transition-colors duration-300">
                {insight.title}
              </h3>

              <p className="font-sans text-gray-400 mb-6 leading-relaxed">
                {insight.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">{insight.readTime}</span>
                <span className="text-brand-gold group-hover:translate-x-2 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-16">
          <button className="group inline-flex items-center gap-3 text-brand-gold hover:text-brand-teal transition-colors duration-300">
            <span className="font-sans text-lg">View All Insights</span>
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
