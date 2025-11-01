'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const animatedTextRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (animatedTextRef.current) {
      // GSAP skew-in animation
      gsap.from(animatedTextRef.current, {
        scrollTrigger: {
          trigger: animatedTextRef.current,
          start: "top 85%",
          end: "top 35%",
          scrub: true,
        },
        skewX: 45,
        opacity: 0,
        duration: 2,
      });
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <footer className="w-full bg-black py-12 flex flex-col justify-center relative">
      <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24">
        
        {/* Top section with copyright and back to top */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-white/70 text-sm">
            © 2025
          </div>
          
          <div className="flex items-center gap-3 text-white/70 text-sm font-medium">
            BACK TO TOP
            <button
              onClick={scrollToTop}
              className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-white/90 transition-colors duration-300"
              aria-label="Back to top"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mb-8">
          <h2 className="text-white text-xl mb-4 font-normal">
            READY TO EXPERIENCE AI INTELLIGENCE?
          </h2>
          
          {/* Large Brand Name */}
          <div className="mb-8">
            <h1 
              ref={animatedTextRef}
              className="text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem] xl:text-[8rem] font-light leading-[0.8] tracking-tight text-left animated-text"
              style={{
                background: 'linear-gradient(135deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              INTELLIBOX
            </h1>
          </div>
        </div>

        {/* Bottom section with social buttons and credits */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
          {/* Social Media Buttons */}
          <div className="flex gap-4 mb-6 md:mb-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-white/30 text-white font-medium rounded-full hover:bg-white hover:text-black transition-all duration-300 text-sm"
            >
              GITHUB
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-white/30 text-white font-medium rounded-full hover:bg-white hover:text-black transition-all duration-300 text-sm"
            >
              LINKEDIN
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-white/30 text-white font-medium rounded-full hover:bg-white hover:text-black transition-all duration-300 text-sm"
            >
              TWITTER
            </a>
          </div>
          
          {/* Credits */}
          <div className="text-right text-sm text-white/60 leading-relaxed">
            <p>Development by <span className="font-medium text-white">Peonut Potato Team</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}