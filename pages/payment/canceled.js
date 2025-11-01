import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function PaymentCanceled() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      <Navigation />
      
      <section className="max-w-[800px] mx-auto px-6 pt-32 pb-20 text-white text-center">
        <div 
          className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "2px solid rgba(239, 68, 68, 0.3)"
          }}
        >
          <X className="w-10 h-10 text-red-400" />
        </div>

        <h1 
          className="text-5xl md:text-6xl font-bold mb-6"
          style={{
            background: "linear-gradient(45deg, oklch(97.1% 0.014 343.198), oklch(98.4% 0.019 200.873))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Payment Canceled
        </h1>
        
        <p className="text-xl text-gray-400 mb-8">
          No worries! You can try again whenever you're ready.
        </p>

        <div 
          className="rounded-2xl p-8 mb-8"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h3 className="text-xl font-semibold mb-4">What happened?</h3>
          <p className="text-gray-400 mb-6">
            Your payment was canceled and no charges were made to your account. 
            You can still continue using TechTrove with the free plan features.
          </p>
          
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-sm">5 agent conversations per day</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-sm">Basic calendar integration</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-sm">Email support</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/subscribe"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-300"
            style={{
              background: "linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))",
              color: "#000000",
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            Try Again
          </Link>
          
          <Link 
            href="/chat"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-300"
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "rgba(255, 255, 255, 0.9)",
            }}
          >
            Continue with Free Plan
          </Link>
        </div>
      </section>
    </div>
  );
}