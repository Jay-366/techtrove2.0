'use client';

import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
// Token-based subscription model - no blockchain dependencies needed

const SUBSCRIPTION_TOKENS = '10000'; // Monthly tokens
const PAYMENT_PROCESSOR = 'IntelliBox Token System'; // Internal payment system

// Token-based payment system - no blockchain needed

export default function SubscribeModal({
  isOpen,
  onClose,
  agentId,
  agentName,
  subscriptionPrice,
}) {
  const [paymentId, setPaymentId] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('select'); // 'select' | 'success' | 'error'

  const handleClose = () => {
    setStep('select');
    setError(null);
    setPaymentId(null);
    onClose();
  };

  const handleSubscription = async () => {
    try {
      setStep('processing');
      
      // Simulate API call to your payment processor
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          subscriptionType: 'monthly',
          tokenAmount: parseInt(SUBSCRIPTION_TOKENS),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentId(data.paymentId);
        setStep('success');
      } else {
        throw new Error('Subscription failed');
      }
    } catch (err) {
      setError(err.message);
      setStep('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-[#1C1F2B] rounded-3xl border border-[#50606C] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '0 0 20px rgba(251, 237, 224, 0.1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#50606C]">
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: '#FBede0' }}
            >
              Subscribe to {agentName}
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: 'rgba(251, 237, 224, 0.6)' }}
            >
              {subscriptionPrice || `${SUBSCRIPTION_TOKENS} tokens/month`}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              backgroundColor: 'transparent',
              color: 'rgba(251, 237, 224, 0.8)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'rgba(80, 96, 108, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'select' ? (
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: '#FBede0' }}
              >
                Subscribe to {agentName}
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: 'rgba(251, 237, 224, 0.6)' }}
              >
                Subscribe to get {SUBSCRIPTION_TOKENS} tokens monthly for querying this
                agent. Tokens are deducted per query.
              </p>

              <div className="space-y-4 mb-6">
                <div
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: '#161823' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        color: 'rgba(251, 237, 224, 0.7)',
                      }}
                    >
                      Agent
                    </span>
                    <span style={{ color: '#FBede0' }}>
                      {agentName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        color: 'rgba(251, 237, 224, 0.7)',
                      }}
                    >
                      Monthly Tokens
                    </span>
                    <span style={{ color: '#FBede0' }}>
                      {SUBSCRIPTION_TOKENS} tokens
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        color: 'rgba(251, 237, 224, 0.7)',
                      }}
                    >
                      Token Usage
                    </span>
                    <span style={{ color: '#FBede0' }}>
                      Per Query Deduction
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        color: 'rgba(251, 237, 224, 0.7)',
                      }}
                    >
                      Renewal
                    </span>
                    <span
                      style={{
                        color: '#FBede0',
                        fontSize: '12px',
                      }}
                    >
                      Monthly Auto-Refill
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubscription}
                disabled={step === 'processing'}
                className="w-full px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: step === 'processing'
                    ? 'rgba(251, 237, 224, 0.3)'
                    : '#FBede0',
                  color: '#161823',
                  cursor: step === 'processing'
                    ? 'not-allowed'
                    : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (step !== 'processing') {
                    e.currentTarget.style.backgroundColor =
                      '#e8d4c5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (step !== 'processing') {
                    e.currentTarget.style.backgroundColor =
                      '#FBede0';
                  }
                }}
              >
                {step === 'processing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Subscribe for{' '}
                    {SUBSCRIPTION_TOKENS} Tokens/Month
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : step === 'success' ? (
            <div className="text-center py-8">
              <CheckCircle
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: '#10b981' }}
              />
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: '#FBede0' }}
              >
                Subscription Successful!
              </h3>
              <p
                className="mb-4"
                style={{
                  color: 'rgba(251, 237, 224, 0.6)',
                }}
              >
                You now have {SUBSCRIPTION_TOKENS} tokens monthly for {agentName}
              </p>
              {paymentId && (
                <p
                  className="text-sm"
                  style={{
                    color: 'rgba(251, 237, 224, 0.5)',
                  }}
                >
                  Payment ID:{' '}
                  <span className="font-mono">
                    {paymentId}
                  </span>
                </p>
              )}
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-3 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: '#FBede0',
                  color: '#161823',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    '#e8d4c5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    '#FBede0';
                }}
              >
                Close
              </button>
            </div>
          ) : step === 'error' ? (
            <div className="text-center py-8">
              <AlertCircle
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: '#ef4444' }}
              />
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: '#FBede0' }}
              >
                Subscription Failed
              </h3>
              <p
                className="mb-4"
                style={{
                  color: 'rgba(251, 237, 224, 0.6)',
                }}
              >
                {error ||
                  'An error occurred during the subscription process'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('select')}
                  className="flex-1 px-6 py-3 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #50606C',
                    color: '#FBede0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(80, 96, 108, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'transparent';
                  }}
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: '#FBede0',
                    color: '#161823',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      '#e8d4c5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      '#FBede0';
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
