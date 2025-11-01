'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';

// SVG Icon Components
const ZapIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export default function HeroSection() {
  const [isMounted, setIsMounted] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const splineRef = useRef(null);
  
  // Your Spline scene URL
  const sceneUrl = "https://prod.spline.design/JyEBHpF6tGRGi8LZ/scene.splinecode";

  useEffect(() => {
    setIsMounted(true);
    
    // Add some debugging
    console.log('HeroSection mounted, Spline scene URL:', sceneUrl);
  }, []);

  const onSplineLoad = (spline) => {
    console.log('Spline loaded successfully', spline);
    setSplineLoaded(true);
    setSplineError(false);
    
    // Try to access the scene and check for animations
    if (spline && spline.getScene) {
      const scene = spline.getScene();
      console.log('Spline scene:', scene);
    }
  };

  const onSplineError = (error) => {
    console.error('Spline loading error:', error);
    setSplineError(true);
    setSplineLoaded(false);
  };

  return (
    <section 
      className="hero-section relative overflow-hidden min-h-screen"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-0">
        {isMounted && (
          <Spline
            ref={splineRef}
            scene={sceneUrl}
            onLoad={onSplineLoad}
            onError={onSplineError}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              pointerEvents: 'auto',
            }}
            renderOnDemand={false}
            allowFullScreen
          />
        )}
      </div>

      {/* Loading State */}
      {!splineLoaded && !splineError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: 'oklch(97.1% 0.014 343.198)' }}></div>
            <p className="mt-4 font-medium" style={{ 
              background: 'linear-gradient(45deg, oklch(97.1% 0.014 343.198), oklch(98.4% 0.019 200.873))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Loading 3D Scene...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {splineError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white font-medium">Failed to load 3D scene</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 text-white rounded"
              style={{ 
                background: 'linear-gradient(45deg, oklch(97.1% 0.014 343.198), oklch(98.4% 0.019 200.873))',
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-30 max-w-7xl mx-auto text-center w-full">
        {/* Minimal content or just the 3D scene */}
      </div>

      {/* Overlay to cover Spline watermark */}
      <div 
        className="absolute bottom-0 right-0 z-40"
        style={{
          width: '150px',
          height: '50px',
          backgroundColor: '#000000',
          pointerEvents: 'none'
        }}
      />

      {/* Hide Spline Badge */}
      <style jsx global>{`
        /* Hide the "Built with Spline" badge */
        #spline-watermark,
        .spline-watermark,
        [data-spline-watermark],
        .spline-badge,
        .watermark,
        div[style*="position: absolute"][style*="bottom"][style*="right"],
        div[style*="position: fixed"][style*="bottom"][style*="right"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }

        /* Additional targeting for Spline watermark */
        canvas + div,
        canvas + div + div {
          display: none !important;
        }
      `}</style>
    </section>
  );
}