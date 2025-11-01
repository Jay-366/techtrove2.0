"use client";

import { Search, Filter, TrendingUp, Star } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AgentCard } from '@/components/marketplace/AgentCard';
import AgentFilters from '@/components/marketplace/AgentFilters';
import { CategoryHeader } from '@/components/marketplace/CategoryHeader';
import Navigation from '@/components/Navigation';

// Agents data
const AGENTS_DATA = [
  {
    id: "bafybeibdofc5fnwiuvrzpr3ozu5x3ufccqme24ho4tbhn3e2xg4blrvo6i",
    name: 'Crypto Agent',
    category: 'Agent',
    rating: 4.3,
    reviews: 2236,
    price: 10,
    description:
      "I'm providing advanced cryptocurrency analysis and trading strategies quickly and professionally. I'll be happy to help you with your crypto trading.",
    trending: true,
  },
  {
    id: "bafybeig3k52cgqhvaatvstf7jhqmkxnpuqqme9cwjrmhs4x8de2qp9s7ei",
    name: 'Phala Network',
    category: 'Infrastructure',
    rating: 4.3,
    reviews: 2236,
    price: 15,
    description:
      'Secure, trustless AI computing without compromise. Deploy AI agents on decentralized infrastructure with built-in privacy protection.',
    trending: true,
  },
  {
    id: "bafybeifh7vn89xk2pqlwrtc3mbf9g8sjkxnp6qqme8rwjrmh4sx8de2qp9",
    name: 'AgentOps',
    category: 'Development',
    rating: 4.3,
    reviews: 2236,
    price: 5,
    description:
      'Unleash reliable AI agents with comprehensive testing and optimization. Monitor, debug, and improve your AI agent performance in production.',
    trending: true,
  },
  {
    id: "bafybeiq9m3kx7p2vwrtf5jhqnpuqqme7cwjrmhs4x8de2qp9s7eifh7vn8",
    name: 'Dify',
    category: 'Workflow',
    rating: 4.3,
    reviews: 2236,
    price: 8,
    description:
      'Build powerful AI agents and workflows in minutes. Visual agent builder with pre-built templates and integrations.',
    trending: true,
  },
  {
    id: "bafybeir2p9s7eifh7vn89xk2pqlwrtc3mbf9g8sjkxnpuqqme8rwjrmh4s",
    name: 'Oovol',
    category: 'Testing',
    rating: 4.3,
    reviews: 2236,
    price: 12,
    description:
      'Ship reliable AI agents faster with comprehensive simulation and testing environments before deployment.',
    trending: false,
  },
  {
    id: "bafybeisk2cgqhvaatvstf7jhqmkxnpuqqme9cwjrmhs4x8de2qp9s7eifh7",
    name: 'Neets.ai',
    category: 'Voice',
    rating: 4.3,
    reviews: 2236,
    price: 7,
    description:
      'Build powerful voice AI agents with natural conversations. Real-time speech processing and multi-language support.',
    trending: false,
  },
  {
    id: "bafybeit7jhqmkxnpuqqme9cwjrmhs4x8de2qp9s7eifh7vn89xk2pqlwrt",
    name: 'Potpie AI',
    category: 'Code Assistant',
    rating: 4.3,
    reviews: 2239,
    price: 9,
    description:
      'Build custom AI coding agents that understand your entire codebase. Automated code review, bug detection, and documentation.',
    trending: false,
  },
  {
    id: "bafybeiu3mbf9g8sjkxnp6qqme8rwjrmh4sx8de2qp9s7eifh7vn89xk2pq",
    name: 'Jasper AI',
    category: 'Content',
    rating: 4.3,
    reviews: 2236,
    price: 12,
    description:
      'AI-powered content agents that transform how teams create and execute marketing content at scale.',
    trending: false,
  },
  {
    id: "bafybeiv5jhqnpuqqme7cwjrmhs4x8de2qp9s7eifh7vn89xk2pqlwrtc3m",
    name: 'PrivateAI',
    category: 'Security',
    rating: 4.3,
    reviews: 2236,
    price: 6,
    description:
      'Secure AI-powered privacy protection agents for sensitive data. Enterprise-grade encryption and compliance.',
    trending: false,
  },
  {
    id: "bafybeiw8sjkxnpuqqme9cwjrmhs4x8de2qp9s7eifh7vn89xk2pqlwrtc3",
    name: 'HyperWrite AI',
    category: 'Writing',
    rating: 4.3,
    reviews: 2239,
    price: 10,
    description:
      'Build custom writing AI agents with your brand voice. Automated content generation, editing, and optimization.',
    trending: false,
  },
  {
    id: "bafybeix6qqme8rwjrmh4sx8de2qp9s7eifh7vn89xk2pqlwrtc3mbf9g8s",
    name: 'Nelima',
    category: 'Analytics',
    rating: 4.3,
    reviews: 2236,
    price: 20,
    description:
      'Intelligent AI analytics agents transforming data into strategic insights with automated reporting and predictions.',
    trending: false,
  },
  {
    id: "bafybeiy9cwjrmhs4x8de2qp9s7eifh7vn89xk2pqlwrtc3mbf9g8sjkxnp",
    name: 'Vapi',
    category: 'Voice',
    rating: 4.3,
    reviews: 2236,
    price: 12,
    description:
      'Ship reliable voice AI agents faster with comprehensive simulation and testing for conversational interfaces.',
    trending: false,
  },
];

export default function MyAgentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    priceRange: [0, 1000],
    rating: 0,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter agents based on search query and filters
  const filteredAgents = useMemo(() => {
    let result = AGENTS_DATA;

    // Search filter
    if (searchQuery) {
      result = result.filter((agent) =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (activeFilters.categories.length > 0) {
      result = result.filter((agent) =>
        activeFilters.categories.includes(agent.category)
      );
    }

    // Rating filter
    if (activeFilters.rating > 0) {
      result = result.filter((agent) => agent.rating >= activeFilters.rating);
    }

    return result;
  }, [searchQuery, activeFilters]);

  // Handle agent selection
  const handleSelectAgent = (agent) => {
    window.location.href = `/agents/${agent.id}`;
  };

  // Handle filter changes
  const handleFiltersChange = (filters) => {
    setActiveFilters(filters);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#161823' }}>
      {/* Navigation */}
      <Navigation />
      
      {/* Category Header */}
      <CategoryHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onFiltersChange={handleFiltersChange}
        activeFilters={activeFilters}
      />

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar with Filters */}
          {showFilters && (
            <div className="w-1/4 transition-all duration-300">
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: '#1C1F2B',
                  border: '1px solid rgba(80, 96, 108, 0.4)',
                }}
              >
                <h3 className="text-xl mb-6" style={{ color: '#FBede0' }}>
                  Filters
                </h3>
                <AgentFilters onFiltersChange={handleFiltersChange} />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={showFilters ? 'w-3/4' : 'w-full'}>
            {/* Agent Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(filteredAgents.length > 0 ? filteredAgents : AGENTS_DATA).map(
                (agent) => (
                  <AgentCard
                    key={agent.id}
                    id={String(agent.id)}
                    name={agent.name}
                    description={agent.description}
                    rating={agent.rating}
                    reviews={agent.reviews || 0}
                    tags={
                      agent.id ===
                      'bafybeibdofc5fnwiuvrzpr3ozu5x3ufccqme24ho4tbhn3e2xg4blrvo6i'
                        ? ['Customer Service', '+2']
                        : agent.id ===
                          'bafybeig3k52cgqhvaatvstf7jhqmkxnpuqqme9cwjrmhs4x8de2qp9s7ei'
                        ? ['Infrastructure', '+2']
                        : agent.id ===
                          'bafybeifh7vn89xk2pqlwrtc3mbf9g8sjkxnp6qqme8rwjrmh4sx8de2qp9'
                        ? ['Development', '+2']
                        : agent.id ===
                          'bafybeiq9m3kx7p2vwrtf5jhqnpuqqme7cwjrmhs4x8de2qp9s7eifh7vn8'
                        ? ['Workflow', '+2']
                        : agent.id ===
                          'bafybeir2p9s7eifh7vn89xk2pqlwrtc3mbf9g8sjkxnpuqqme8rwjrmh4s'
                        ? ['Testing', '+2']
                        : agent.id ===
                          'bafybeisk2cgqhvaatvstf7jhqmkxnpuqqme9cwjrmhs4x8de2qp9s7eifh7'
                        ? ['Voice', '+2']
                        : agent.id ===
                          'bafybeit7jhqmkxnpuqqme9cwjrmhs4x8de2qp9s7eifh7vn89xk2pqlwrt'
                        ? ['Code Assistant', '+2']
                        : agent.id ===
                          'bafybeiu3mbf9g8sjkxnp6qqme8rwjrmh4sx8de2qp9s7eifh7vn89xk2pq'
                        ? ['Content', '+2']
                        : agent.id ===
                          'bafybeiv5jhqnpuqqme7cwjrmhs4x8de2qp9s7eifh7vn89xk2pqlwrtc3m'
                        ? ['Security', '+2']
                        : agent.id ===
                          'bafybeiw8sjkxnpuqqme9cwjrmhs4x8de2qp9s7eifh7vn89xk2pqlwrtc3'
                        ? ['Writing', '+2']
                        : agent.id ===
                          'bafybeix6qqme8rwjrmh4sx8de2qp9s7eifh7vn89xk2pqlwrtc3mbf9g8s'
                        ? ['Analytics', '+2']
                        : ['Voice', '+2']
                    }
                    price={
                      typeof agent.price === 'number'
                        ? `${agent.price} tokens/query`
                        : agent.price
                    }
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}