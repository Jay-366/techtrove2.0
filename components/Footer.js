'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer 
      className="w-full py-12 mt-10"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-6">
          {/* Say Hi Section */}
          <div>
            <h3 
              className="text-xs mb-3 uppercase tracking-wider"
              style={{ color: 'rgba(255, 255, 255, 0.6)' }}
            >
              Say hi
            </h3>
            <a 
              href="mailto:hello@techtrove.com"
              className="text-base font-semibold transition-colors hover:opacity-80"
              style={{ 
                background: 'linear-gradient(45deg, oklch(97.1% 0.014 343.198), oklch(98.4% 0.019 200.873))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              hello@techtrove.com
            </a>
          </div>

          {/* Links Section */}
          <div>
            <h3 
              className="text-xs mb-3 uppercase tracking-wider"
              style={{ color: 'rgba(255, 255, 255, 0.6)' }}
            >
              Links
            </h3>
            <nav className="flex flex-col gap-2">
              <Link 
                href="#faq"
                className="text-base font-semibold transition-colors hover:opacity-80"
                style={{ color: '#ffffff' }}
              >
                FAQ
              </Link>
              <Link 
                href="#contact"
                className="text-base font-semibold transition-colors hover:opacity-80"
                style={{ color: '#ffffff' }}
              >
                Contact
              </Link>
              <Link 
                href="#support"
                className="text-base font-semibold transition-colors hover:opacity-80"
                style={{ color: '#ffffff' }}
              >
                Support
              </Link>
              <Link 
                href="#privacy"
                className="text-base font-semibold transition-colors hover:opacity-80"
                style={{ color: '#ffffff' }}
              >
                Privacy Policy
              </Link>
            </nav>
          </div>

          {/* Follow Us Section */}
          <div>
            <h3 
              className="text-xs mb-3 uppercase tracking-wider"
              style={{ color: 'rgba(255, 255, 255, 0.6)' }}
            >
              Follow us
            </h3>
            <div className="flex flex-col gap-2">
              <a 
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold flex items-center gap-2 transition-colors hover:opacity-80"
                style={{ color: '#ffffff' }}
              >
                LinkedIn
              </a>
              <a 
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold flex items-center gap-2 transition-colors hover:opacity-80"
                style={{ color: '#ffffff' }}
              >
                Instagram
              </a>
              <a 
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold flex items-center gap-2 transition-colors hover:opacity-80"
                style={{ color: '#ffffff' }}
              >
                Twitter
              </a>
              <a 
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold flex items-center gap-2 transition-colors hover:opacity-80"
                style={{ color: '#ffffff' }}
              >
                Github
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Large Brand Name - Full Width */}
      <div className="w-full px-8 text-center">
        <h2 
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight inline-block"
          style={{ 
            background: 'linear-gradient(45deg, oklch(97.1% 0.014 343.198), oklch(98.4% 0.019 200.873))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.07em',
            transform: 'scaleX(1.5)',
            transformOrigin: 'center',
            textShadow: '0 0 40px oklch(97.1% 0.014 343.198 / 0.5)'
          }}
        >
          TECHTROVE
        </h2>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-[1440px] mx-auto px-8">
        <div 
          className="mt-8 text-sm text-center"
          style={{ color: 'rgba(255, 255, 255, 0.5)' }}
        >
          © {new Date().getFullYear()} TechTrove. All rights reserved.
        </div>
      </div>
    </footer>
  );
}