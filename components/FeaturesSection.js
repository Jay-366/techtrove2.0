'use client';

import { useRef } from 'react';
import Link from 'next/link';
import CardFlip from './kokonutui/card-flip';

// SVG Icon Components
const ZapIcon = ({ className, style }) => (
  <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ShieldIcon = ({ className, style }) => (
  <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UsersIcon = ({ className, style }) => (
  <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const DollarSignIcon = ({ className, style }) => (
  <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const CpuIcon = ({ className, style }) => (
  <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const LockIcon = ({ className, style }) => (
  <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const MessageSquareIcon = ({ className, style }) => (
  <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ShoppingCartIcon = ({ className, style }) => (
  <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
  </svg>
);

const BotIcon = ({ className, style }) => (
  <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const WalletIcon = ({ className, style }) => (
  <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default function FeaturesSection() {
  const ref = useRef(null);



  // Feature highlights for CardFlip
  const features = [
    {
      title: "AI Orchestration",
      subtitle: "Multi-agent coordination",
      description: "Coordinate multiple AI agents seamlessly to accomplish complex tasks with intelligent workflow management.",
      features: ["Smart Routing", "Agent Coordination", "Workflow Management", "Task Distribution"]
    },
    {
      title: "Custom Agents",
      subtitle: "Build your own AI",
      description: "Create and deploy custom AI agents tailored to your specific needs and business requirements.",
      features: ["Custom Training", "Easy Deployment", "API Integration", "Performance Monitoring"]
    },
    {
      title: "Real-time Chat",
      subtitle: "Instant AI responses",
      description: "Engage with AI agents through real-time conversations with lightning-fast response times.",
      features: ["Instant Messaging", "Context Awareness", "Multi-language", "Voice Support"]
    },
    {
      title: "Advanced Analytics",
      subtitle: "Intelligent insights",
      description: "Get deep insights into your AI interactions with comprehensive analytics and performance metrics.",
      features: ["Usage Analytics", "Performance Metrics", "Cost Tracking", "Optimization Tips"]
    },
    {
      title: "Enterprise Security",
      subtitle: "Bank-level protection",
      description: "Enterprise-grade security with end-to-end encryption and compliance with industry standards.",
      features: ["End-to-End Encryption", "SOC2 Compliance", "Data Privacy", "Audit Logs"]
    },
    {
      title: "API Integration",
      subtitle: "Seamless connectivity",
      description: "Integrate IntelliBox into your existing systems with our comprehensive API and SDKs.",
      features: ["REST API", "GraphQL", "Webhooks", "SDKs Available"]
    }
  ];

  return (
    <section 
      className="px-6 pt-12 pb-16 relative overflow-hidden" 
      ref={ref}
      style={{ backgroundColor: '#000000' }}
    >
      {/* Background Effects */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 25% 25%, oklch(97.1% 0.014 343.198 / 0.3), transparent 50%), radial-gradient(circle at 75% 75%, oklch(98.4% 0.019 200.873 / 0.2), transparent 50%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">


        {/* Features Section */}
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ 
              background: 'linear-gradient(45deg, oklch(97.1% 0.014 343.198), oklch(98.4% 0.019 200.873))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Why Choose IntelliBox?
          </h2>
          <p 
            className="text-xl max-w-3xl mx-auto"
            style={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            Experience the future of AI with our comprehensive multi-agent orchestration platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {features.map((feature, index) => (
            <CardFlip
              key={index}
              title={feature.title}
              subtitle={feature.subtitle}
              description={feature.description}
              features={feature.features}
            />
          ))}
        </div>
      </div>
    </section>
  );
}