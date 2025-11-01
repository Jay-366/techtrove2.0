"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";
import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function SubscribePage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, annual: 0 },
      description: "Get started with basic features",
      features: [
        "5 agent conversations per day",
        "Basic calendar integration",
        "Email support",
        "Community access",
        "Limited AI responses (10 per day)",
      ],
      notIncluded: [
        "Advanced AI agents",
        "Priority support",
        "Custom integrations",
      ],
      gradient: "linear-gradient(45deg, oklch(95% 0.02 200), oklch(96% 0.02 250))",
      buttonStyle: {
        background: "transparent",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        color: "rgba(255, 255, 255, 0.9)",
      },
      hoverStyle: {
        border: "1px solid rgba(255, 255, 255, 0.5)",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      },
    },
    {
      name: "Pro",
      price: { monthly: 29, annual: 290 },
      description: "Unlock the full power of AIBox",
      features: [
        "Unlimited agent conversations",
        "Advanced calendar & email automation",
        "Priority support",
        "Custom AI agent creation",
        "API access",
        "Invoice & payment integration",
        "Stripe payment links",
        "Advanced analytics",
        "Team collaboration",
      ],
      notIncluded: [],
      gradient: "linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))",
      buttonStyle: {
        background: "linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))",
        border: "none",
        color: "#000000",
      },
      hoverStyle: {
        transform: "translateY(-2px)",
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
      },
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      <Navigation />

      <section className="max-w-[1200px] mx-auto px-6 pt-32 pb-20 text-white">
        <div className="text-center mb-16">
          <h1
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{
              background: "linear-gradient(45deg, oklch(97.1% 0.014 343.198), oklch(98.4% 0.019 200.873))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Unlock the power of AI automation at any scale
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={`text-sm transition-colors ${
                !isAnnual ? "text-white" : "text-gray-500"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-7 rounded-full transition-all duration-300 relative"
              style={{
                background: isAnnual
                  ? "linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))"
                  : "rgba(255, 255, 255, 0.2)",
              }}
            >
              <div
                className="absolute top-1 w-5 h-5 rounded-full bg-white transition-transform duration-300"
                style={{
                  transform: isAnnual ? "translateX(32px)" : "translateX(4px)",
                }}
              />
            </button>
            <span
              className={`text-sm transition-colors ${
                isAnnual ? "text-white" : "text-gray-500"
              }`}
            >
              Annual
            </span>
            {isAnnual && (
              <span className="ml-2 px-2 py-1 rounded text-xs font-medium" style={{ 
                background: "rgba(34, 197, 94, 0.1)",
                color: "rgba(34, 197, 94, 0.9)",
                border: "1px solid rgba(34, 197, 94, 0.3)"
              }}>
                Save 17%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="relative rounded-2xl p-8 transition-all duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: plan.popular
                  ? "2px solid transparent"
                  : "1px solid rgba(255, 255, 255, 0.1)",
                backgroundImage: plan.popular
                  ? `linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), ${plan.gradient}`
                  : "none",
                backgroundClip: plan.popular ? "padding-box, border-box" : "border-box",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {plan.popular && (
                <div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))",
                    color: "#000000",
                  }}
                >
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-gray-500">
                      /{isAnnual ? "year" : "month"}
                    </span>
                  )}
                </div>
              </div>

              <button
                className="w-full py-3 rounded-lg font-medium transition-all duration-300"
                style={plan.buttonStyle}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, plan.hoverStyle);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.border =
                    plan.buttonStyle.border || "none";
                  if (plan.hoverStyle.backgroundColor) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {plan.name === "Free" ? "Get Started" : "Start Free Trial"}
              </button>

              <div className="mt-8 space-y-4">
                <div className="text-sm font-medium text-gray-300 mb-3">
                  What's included:
                </div>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ 
                      color: "rgba(34, 197, 94, 0.9)" 
                    }} />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}

                {plan.notIncluded.length > 0 && (
                  <>
                    <div className="text-sm font-medium text-gray-300 mb-3 mt-6">
                      Not included:
                    </div>
                    {plan.notIncluded.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <X className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ 
                          color: "rgba(127, 127, 127, 0.5)" 
                        }} />
                        <span className="text-sm text-gray-500">{feature}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-[800px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I change my plan later?",
                a: "Yes! You can upgrade, downgrade, or cancel your subscription at any time from your account settings.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and cryptocurrency payments through Stripe.",
              },
              {
                q: "Is there a refund policy?",
                a: "Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked.",
              },
              {
                q: "Do I need technical knowledge to use AIBox?",
                a: "Not at all! AIBox is designed to be intuitive and user-friendly. Our AI agents handle the technical complexity for you.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-lg p-6"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

