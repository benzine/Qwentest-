'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const convergenceRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Convergence effect - elements flying toward center
      if (convergenceRef.current) {
        gsap.to(convergenceRef.current.querySelectorAll('.converge-element'), {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: 1,
          },
          x: '50%',
          y: '50%',
          scale: 0,
          opacity: 0,
          stagger: 0.05,
          ease: 'power2.in',
        });
      }

      // Big Bang at 70% - form materialization
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: '30% center',
        onEnter: () => {
          setFormVisible(true);
          
          gsap.from(formRef.current?.children, {
            scale: 0,
            opacity: 0,
            stagger: 0.1,
            ease: 'back.out(1.7)',
          });

          // Energy burst effect
          gsap.to('.energy-burst', {
            scale: 3,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
          });
        },
        onLeaveBack: () => {
          setFormVisible(false);
        },
      });

      // Submit button pulse with accumulated energy
      gsap.to('.submit-button', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'center center',
          end: 'bottom top',
          scrub: true,
        },
        scale: 1.05,
        boxShadow: '0 0 60px rgba(212, 175, 55, 0.6)',
        ease: 'power2.inOut',
      });
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Energy release animation on submit
    gsap.to('.submit-button', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    gsap.to('.energy-burst', {
      scale: 2,
      opacity: 1,
      duration: 0.5,
      onComplete: () => {
        gsap.to('.energy-burst', {
          scale: 0,
          opacity: 0,
          duration: 0.5,
        });
      },
    });
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen py-32 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-brand-navy to-brand-charcoal"
    >
      {/* Convergence Point */}
      <div
        ref={convergenceRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="absolute w-4 h-4 bg-brand-gold rounded-full blur-sm converge-element" />
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="converge-element absolute w-2 h-2 bg-brand-teal rounded-full"
            style={{
              transform: `rotate(${i * 30}deg) translateX(100px)`,
            }}
          />
        ))}
      </div>

      {/* Energy Burst */}
      <div className="energy-burst fixed inset-0 pointer-events-none z-0 opacity-0">
        <div className="absolute inset-0 bg-gradient-radial from-brand-gold/30 via-brand-teal/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-white text-center mb-8">
          Let's Converge
        </h2>
        <p className="font-sans text-xl text-gray-400 text-center mb-20 max-w-3xl mx-auto">
          Everything comes together when we work together.
        </p>

        {formVisible && (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="glass-effect rounded-2xl p-8 md:p-12 backdrop-blur-sm space-y-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="name" className="block text-sm text-gray-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all duration-300 text-white"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all duration-300 text-white"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm text-gray-400 mb-2">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all duration-300 text-white"
                placeholder="Your company"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm text-gray-400 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all duration-300 text-white resize-none"
                placeholder="Tell us about your challenge..."
              />
            </div>

            <button
              type="submit"
              className="submit-button w-full py-4 bg-gradient-to-r from-brand-gold to-brand-amber rounded-full text-brand-navy font-semibold text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-brand-gold/30 relative overflow-hidden"
            >
              <span className="relative z-10">Send Message</span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-teal to-brand-gold rounded-full opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </button>
          </form>
        )}

        {/* Direct Contact Info */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-brand-gold text-2xl mb-2">📧</div>
            <p className="text-gray-400">hello@apexconsulting.com</p>
          </div>
          <div>
            <div className="text-brand-teal text-2xl mb-2">📞</div>
            <p className="text-gray-400">+1 (555) 123-4567</p>
          </div>
          <div>
            <div className="text-brand-amber text-2xl mb-2">📍</div>
            <p className="text-gray-400">New York • London • Singapore</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mt-12">
          {['LinkedIn', 'Twitter', 'Medium'].map((social) => (
            <a
              key={social}
              href="#"
              className="text-gray-400 hover:text-brand-gold transition-colors duration-300"
            >
              {social}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
