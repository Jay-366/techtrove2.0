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
  const [webglSupported, setWebglSupported] = useState(true);
  const splineRef = useRef(null);
  
  // Your Spline scene URL
  const sceneUrl = "https://prod.spline.design/JyEBHpF6tGRGi8LZ/scene.splinecode";

  // Check WebGL support
  const checkWebGLSupport = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    setIsMounted(true);
    
    // Check WebGL support
    const hasWebGL = checkWebGLSupport();
    setWebglSupported(hasWebGL);
    
    if (!hasWebGL) {
      console.warn('WebGL not supported, falling back to static background');
      setSplineError(true);
    }
    
    // Add some debugging
    console.log('HeroSection mounted, WebGL supported:', hasWebGL, 'Spline scene URL:', sceneUrl);

    // Set a timeout to fallback if Spline takes too long to load
    const timeout = setTimeout(() => {
      if (!splineLoaded && !splineError && hasWebGL) {
        console.warn('Spline loading timeout, falling back to static background');
        setSplineError(true);
      }
    }, 15000); // 15 second timeout

    return () => clearTimeout(timeout);
  }, [splineLoaded, splineError]);

  const onSplineLoad = (spline) => {
    console.log('Spline loaded successfully', spline);
    setSplineLoaded(true);
    setSplineError(false);
    
    // Try to access the scene and check for animations
    try {
      if (spline && spline.getScene) {
        const scene = spline.getScene();
        console.log('Spline scene:', scene);
      }
    } catch (err) {
      console.warn('Spline scene access error:', err);
    }
  };

  const onSplineError = (error) => {
    console.error('Spline loading error:', error);
    setSplineError(true);
    setSplineLoaded(false);
    
    // If it's a WebGL error, mark WebGL as not supported
    if (error && error.message && error.message.includes('WebGL')) {
      setWebglSupported(false);
    }
  };

  return (
    <section 
      className="hero-section relative overflow-hidden min-h-screen"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Fallback Background for when WebGL fails */}
      {(!webglSupported || splineError) && (
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full"
            style={{
              background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 35%, #0f0f23 100%)',
              backgroundSize: '100% 100%',
            }}
          >
            {/* Animated particles as fallback */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                    opacity: 0.3 + Math.random() * 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spline 3D Background - only if WebGL is supported */}
      {webglSupported && !splineError && (
        <div className="absolute inset-0 z-0">
          {isMounted && (
            <Spline
              scene={sceneUrl}
              onLoad={onSplineLoad}
              onError={onSplineError}
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
              }}
            />
          )}
        </div>
      )}

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

      {/* Error State - only show if WebGL is supported but Spline still failed */}
      {webglSupported && splineError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <p className="text-white font-medium mb-2">3D Scene Loading Issue</p>
            <p className="text-gray-300 text-sm mb-4">
              The 3D background failed to load. You're now seeing a fallback design.
            </p>
            <button 
              onClick={() => {
                setSplineError(false);
                setSplineLoaded(false);
                window.location.reload();
              }} 
              className="px-4 py-2 text-white rounded transition-opacity hover:opacity-80"
              style={{ 
                background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* WebGL Not Supported Message */}
      {!webglSupported && (
        <div className="absolute top-4 right-4 z-10 bg-yellow-600 text-white px-3 py-1 rounded text-sm">
          WebGL not available - using fallback design
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