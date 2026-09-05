'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const footerLinks = {
  services: ['Strategic Planning', 'Digital Transformation', 'Operational Excellence', 'M&A'],
  company: ['About Us', 'Our Team', 'Careers', 'Press'],
  resources: ['Insights', 'Case Studies', 'Events', 'Webinars'],
  legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'],
};

export default function FooterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const journeyMapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Gentle deceleration effect
      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1,
        },
        opacity: 1,
        y: 0,
        ease: 'power2.out',
      });

      // Links fade in with staggered timing
      gsap.from('.footer-link-group', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          scrub: 1,
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out',
      });

      // Copyright "written by invisible hand"
      gsap.from('.copyright-text', {
        scrollTrigger: {
          trigger: '.copyright-text',
          start: 'top 90%',
          scrub: 1,
        },
        width: 0,
        opacity: 0,
        ease: 'power2.inOut',
      });

      // Journey map appearance
      if (journeyMapRef.current) {
        gsap.from(journeyMapRef.current.querySelectorAll('.journey-dot'), {
          scrollTrigger: {
            trigger: journeyMapRef.current,
            start: 'top 80%',
            scrub: 1,
          },
          scale: 0,
          opacity: 0,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const sections = ['hero', 'about', 'services', 'process', 'case-studies', 'insights', 'team', 'contact'];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="footer"
      ref={sectionRef}
      className="relative py-24 px-4 md:px-8 bg-gradient-to-b from-brand-charcoal to-black"
    >
      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {/* Journey Map */}
        <div ref={journeyMapRef} className="mb-16">
          <p className="text-gray-500 text-sm mb-6 text-center">Your Journey</p>
          <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
            {sections.map((section, index) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="journey-dot group flex flex-col items-center gap-2 transition-all duration-300 hover:text-brand-gold"
              >
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gray-600 group-hover:bg-brand-gold transition-colors duration-300" />
                <span className="text-xs text-gray-500 capitalize hidden md:block">
                  {section.replace('-', ' ')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="footer-link-group">
              <h4 className="font-serif text-lg text-white mb-4 capitalize">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-brand-gold transition-colors duration-300 text-sm relative group"
                    >
                      {link}
                      <span className="absolute bottom-0 left-1/2 w-0 h-px bg-brand-gold group-hover:w-full group-hover:left-0 transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="overflow-hidden">
              <p className="copyright-text text-gray-500 text-sm whitespace-nowrap">
                © 2024 Apex Consulting. All rights reserved.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-brand-gold transition-colors duration-300 text-sm">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-gold transition-colors duration-300 text-sm">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-gold transition-colors duration-300 text-sm">
                Cookies
              </a>
            </div>

            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span>Crafted with</span>
              <svg className="w-4 h-4 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>for visionaries</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
