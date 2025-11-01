import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function PaymentSuccess() {
  const router = useRouter();
  const { session_id, transactionId } = router.query;
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for either session_id (from Stripe) or transactionId (from other sources)
    const paymentId = session_id || transactionId;
    
    if (paymentId || router.isReady) {
      // You can fetch session details here if needed
      setSessionData({
        id: paymentId || 'completed',
        status: 'complete'
      });
      setLoading(false);
    }

    // Fallback: if no parameters and router is ready, show success anyway after 2 seconds
    const timeout = setTimeout(() => {
      if (router.isReady && !paymentId) {
        setSessionData({
          id: 'completed',
          status: 'complete'
        });
        setLoading(false);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [session_id, transactionId, router.isReady]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      <Navigation />
      
      <section className="max-w-[800px] mx-auto px-6 pt-32 pb-20 text-white text-center">
        <div 
          className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))"
          }}
        >
          <Check className="w-10 h-10 text-black" />
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
          Payment Successful!
        </h1>
        
        <p className="text-xl text-gray-400 mb-8">
          Welcome to TechTrove Pro! Your subscription is now active.
        </p>

        <div 
          className="rounded-2xl p-8 mb-8"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h3 className="text-xl font-semibold mb-4">What's Next?</h3>
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>Access to all Pro features unlocked</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>Unlimited AI agent conversations</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>Priority support activated</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>API access enabled</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/chat"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-300"
            style={{
              background: "linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))",
              color: "#000000",
            }}
          >
            Start Using TechTrove
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <Link 
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-300"
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "rgba(255, 255, 255, 0.9)",
            }}
          >
            Go to Dashboard
          </Link>
        </div>

        {sessionData && (
          <div className="mt-12 text-sm text-gray-500">
            <p>Session ID: {sessionData.id}</p>
          </div>
        )}
      </section>
    </div>
  );
}