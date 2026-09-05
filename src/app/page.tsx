'use client';

import { useEffect } from 'react';
import { useSmoothScroll, useSectionObserver } from '@/hooks/useSmoothScroll';
import HeroSection from '@/components/hero/HeroSection';
import AboutSection from '@/components/about/AboutSection';
import ServicesSection from '@/components/services/ServicesSection';
import ProcessSection from '@/components/process/ProcessSection';
import CaseStudiesSection from '@/components/case-studies/CaseStudiesSection';
import InsightsSection from '@/components/insights/InsightsSection';
import TeamSection from '@/components/team/TeamSection';
import ContactSection from '@/components/contact/ContactSection';
import FooterSection from '@/components/footer/FooterSection';

const sectionIds = ['hero', 'about', 'services', 'process', 'case-studies', 'insights', 'team', 'contact'];

export default function Home() {
  useSmoothScroll();
  useSectionObserver(sectionIds);

  return (
    <main className="relative">
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" id="scroll-progress" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="font-serif text-xl font-bold text-white">
            APEX
          </div>
          
          <div className="flex items-center gap-6">
            {sectionIds.slice(1).map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className="text-sm text-gray-400 hover:text-brand-gold transition-colors duration-300 capitalize"
              >
                {section.replace('-', ' ')}
              </a>
            ))}
          </div>

          <button className="px-6 py-2 bg-gradient-to-r from-brand-gold to-brand-amber rounded-full text-brand-navy font-semibold text-sm hover:shadow-lg hover:shadow-brand-gold/30 transition-all duration-300">
            Get Started
          </button>
        </div>
      </nav>

      {/* Sections */}
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <CaseStudiesSection />
      <InsightsSection />
      <TeamSection />
      <ContactSection />
      <FooterSection />

      {/* Current Section Indicator */}
      <div className="fixed bottom-8 left-8 z-50 hidden lg:block">
        <div className="text-xs text-gray-500 uppercase tracking-widest">
          <span id="current-section">Hero</span>
        </div>
      </div>

      {/* Custom Cursor Placeholder */}
      <div className="custom-cursor fixed w-4 h-4 rounded-full bg-white pointer-events-none z-[9999] hidden md:block mix-blend-difference" />
    </main>
  );
}
