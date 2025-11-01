'use client';

import { useRef } from 'react';
import Link from 'next/link';

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

  // Quick Access Cards
  const quickAccessCards = [
    {
      href: '#products',
      icon: ShoppingCartIcon,
      title: 'Browse Products',
      description: 'Explore our tech marketplace',
    },
    {
      href: '#support',
      icon: MessageSquareIcon,
      title: 'Get Support',
      description: 'Chat with our experts',
    },
    {
      href: '#ai-tools',
      icon: BotIcon,
      title: 'AI Tools',
      description: 'Smart product recommendations',
    },
    {
      href: '#account',
      icon: WalletIcon,
      title: 'My Account',
      description: 'Manage your purchases',
    },
  ];

  // Feature highlights
  const features = [
    {
      icon: ZapIcon,
      title: "Lightning Fast Delivery",
      description: "Get your tech products delivered within 24-48 hours with our express shipping service.",
    },
    {
      icon: ShieldIcon,
      title: "Quality Guaranteed",
      description: "All products come with manufacturer warranty and our 30-day satisfaction guarantee.",
    },
    {
      icon: UsersIcon,
      title: "24/7 Expert Support",
      description: "Our tech experts are available round the clock to help you with any questions or issues.",
    },
    {
      icon: DollarSignIcon,
      title: "Best Prices",
      description: "Competitive pricing with regular discounts and special offers for our valued customers.",
    },
    {
      icon: CpuIcon,
      title: "Latest Technology",
      description: "Stay ahead with the newest tech releases and innovative products from top brands.",
    },
    {
      icon: LockIcon,
      title: "Secure Shopping",
      description: "Shop with confidence using our encrypted checkout and secure payment processing.",
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
        {/* Quick Access Section */}
        <div className="mb-20">
          {/* Curved Text Effect */}
          <div className="text-center mb-12">
            <h2 
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
              style={{ 
                background: 'linear-gradient(45deg, oklch(97.1% 0.014 343.198), oklch(98.4% 0.019 200.873))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '0.05em',
                textShadow: '0 0 30px oklch(97.1% 0.014 343.198 / 0.5)'
              }}
            >
              QUICK ACCESS
            </h2>
            <p 
              className="text-xl max-w-3xl mx-auto"
              style={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Start your tech shopping journey with our streamlined access points
            </p>
          </div>

          {/* Quick Access Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            {quickAccessCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.href}
                  className="perspective-[1000px]"
                >
                  <Link href={card.href} className="block">
                    <div className="group h-[300px] w-[260px]">
                      <div className="relative h-full rounded-[30px] shadow-2xl transition-all duration-500 ease-in-out transform-3d group-hover:transform-[rotate3d(1,1,0,12deg)] group-hover:scale-105">
                        {/* Main Card */}
                        <div 
                          className="absolute inset-0 rounded-[30px] border"
                          style={{ 
                            backgroundColor: 'rgba(93, 96, 108, 0.1)',
                            borderColor: 'rgba(251, 237, 224, 0.2)',
                            backdropFilter: 'blur(10px)'
                          }}
                        />
                        
                        {/* Glass layer */}
                        <div 
                          className="absolute inset-2 rounded-[25px] border"
                          style={{
                            borderColor: 'rgba(251, 237, 224, 0.1)',
                            background: 'linear-gradient(135deg, rgba(251, 237, 224, 0.1) 0%, rgba(93, 96, 108, 0.05) 100%)',
                            backdropFilter: 'blur(5px)'
                          }}
                        />
                        
                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                          {/* Icon */}
                          <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                            <div className="relative">
                              <Icon 
                                className="h-16 w-16 relative z-10" 
                                style={{ 
                                  color: '#ffffff',
                                  filter: 'drop-shadow(0 0 15px oklch(97.1% 0.014 343.198 / 0.6))',
                                }}
                              />
                            </div>
                          </div>
                          
                          {/* Title */}
                          <h3 
                            className="text-xl font-bold text-center mb-3" 
                            style={{ color: '#ffffff' }}
                          >
                            {card.title}
                          </h3>
                          
                          {/* Description */}
                          <p 
                            className="text-sm text-center leading-relaxed" 
                            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          >
                            {card.description}
                          </p>
                        </div>

                        {/* Bottom accent */}
                        <div 
                          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full transition-all duration-500"
                          style={{ 
                            background: 'linear-gradient(45deg, oklch(97.1% 0.014 343.198), oklch(98.4% 0.019 200.873))',
                            boxShadow: '0 0 20px oklch(97.1% 0.014 343.198 / 0.8)',
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

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
            Why Choose TechTrove?
          </h2>
          <p 
            className="text-xl max-w-3xl mx-auto"
            style={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            We provide the best technology shopping experience with unmatched quality and service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="group p-6 rounded-2xl transition-all duration-300 hover:scale-105 border"
                style={{ 
                  backgroundColor: 'rgba(93, 96, 108, 0.1)',
                  borderColor: 'rgba(251, 237, 224, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div className="mb-4">
                  <Icon 
                    className="h-12 w-12 group-hover:scale-110 transition-transform duration-300" 
                    style={{ 
                      color: '#ffffff',
                      filter: 'drop-shadow(0 0 10px oklch(97.1% 0.014 343.198 / 0.5))'
                    }}
                  />
                </div>
                <h3 
                  className="text-xl font-semibold mb-2" 
                  style={{ color: '#ffffff' }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}