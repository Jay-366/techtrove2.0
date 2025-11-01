"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Plus,
  Sparkles,
  Wrench,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { TradingOracleCard } from "@/components/agents/TradingOracleCard";
import { CreatedAgentCard } from "@/components/agents/CreatedAgentCard";
import { Toggle, ToggleButtonGroup } from "@/components/agents/toggle-group";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/Navigation";

export default function MyAgentsPage() {
  // "subscribed" | "created"
  const [activeTab, setActiveTab] = useState("created");

  const [searchQuery, setSearchQuery] = useState("");
  // "name" | "price" | "rating" | "users" | "revenue"
  const [sortBy, setSortBy] = useState("name");
  // "asc" | "desc"
  const [sortDirection, setSortDirection] = useState("asc");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0.001, 0.1]);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [newlyCreatedAgent, setNewlyCreatedAgent] = useState(null);

  // detect success redirect from upload
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uploadSuccess = urlParams.get("uploadSuccess");
    const agentName = urlParams.get("agentName") || "Crypto Agent";

    if (uploadSuccess === "true" && !newlyCreatedAgent) {
      const cryptoAgent = {
        id: Date.now(), // unique
        name: agentName,
        creator: "Your Company",
        role: "Crypto Agent",
        category: "Trading",
        description:
          "I'm providing advanced cryptocurrency analysis and trading strategies quickly and professionally. I'll be happy to help you with your crypto trading.",
        rating: 4.8,
        reviews: 0,
        users: 1,
        revenue: "$0",
        status: "Active",
        price: 0.019,
        experience: "1 year exp",
        workType: "Project work",
        expiry: "Active subscription",
        avatar: "🤖",
        trending: true,
      };
      setNewlyCreatedAgent(cryptoAgent);
      setActiveTab("created");

      // clean URL
      window.history.replaceState({}, "", "/agents");
    }
  }, [newlyCreatedAgent]);

  // refs to close dropdowns if clicked outside
  const sortMenuRef = useRef(null);
  const filterMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(event.target)
      ) {
        setShowSortMenu(false);
      }
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target)
      ) {
        setShowFilterMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // mock data: subscribed agents
  const subscribedAgents = [
    {
      id: 1,
      name: "Trading Oracle",
      creator: "AI Systems Inc",
      role: "Trading Agent",
      category: "Trading",
      description:
        "I'm providing advanced market analysis and trading strategies quickly and professionally. I'll be happy to help you with your trading.",
      rating: 4.8,
      reviews: 21,
      users: 12500,
      price: 0.019,
      experience: "2 years exp",
      workType: "Project work",
      expiry: "Expires in 14 days",
      avatar: "🤖",
      trending: true,
    },
    {
      id: 2,
      name: "Research Assistant",
      creator: "Data Labs",
      role: "Research Agent",
      category: "Research",
      description:
        "I'm conducting AI-powered research and data analysis quickly and professionally. I'll be happy to help you with your research project.",
      rating: 4.9,
      reviews: 18,
      users: 8300,
      price: 0.005,
      experience: "3 years exp",
      workType: "Hourly work",
      expiry: "Expires in 7 days",
      avatar: "📊",
      trending: true,
    },
    {
      id: 3,
      name: "Content Writer Pro",
      creator: "Creative AI",
      role: "Content Agent",
      category: "Writing",
      description:
        "I'm creating high-quality content and professional writing quickly and efficiently. I'll be happy to help you with your content needs.",
      rating: 4.7,
      reviews: 25,
      users: 15200,
      price: 0.019,
      experience: "4 years exp",
      workType: "Project work",
      expiry: "Expires in 30 days",
      avatar: "✍️",
      trending: true,
    },
  ];

  // mock data: created agents
  const baseCreatedAgents = [
    {
      id: 4,
      name: "Data Analytics Bot",
      creator: "Your Company",
      role: "Analytics Agent",
      category: "Analytics",
      description:
        "I'm providing custom analytics solutions for business intelligence quickly and professionally. I'll be happy to help you with your data needs.",
      rating: 4.6,
      reviews: 15,
      users: 340,
      revenue: "$1,240",
      status: "Active",
      price: 0.025,
      experience: "1 year exp",
      workType: "Project work",
      expiry: "Active subscription",
      avatar: "📈",
      trending: true,
    },
    {
      id: 5,
      name: "Crypto Tracker",
      creator: "Your Company",
      role: "Blockchain Agent",
      category: "Trading",
      description:
        "I'm monitoring cryptocurrency markets and providing real-time alerts professionally. I'll be happy to help you track your crypto portfolio.",
      rating: 4.5,
      reviews: 12,
      users: 520,
      revenue: "$890",
      status: "Active",
      price: 0.015,
      experience: "2 years exp",
      workType: "Subscription",
      expiry: "Active subscription",
      avatar: "₿",
      trending: true,
    },
  ];

  // merge in fresh created agent after upload
  const createdAgents = newlyCreatedAgent
    ? [newlyCreatedAgent, ...baseCreatedAgents]
    : baseCreatedAgents;

  // categories for filter
  const allCategories = Array.from(
    new Set(
      [...subscribedAgents, ...createdAgents].map(
        (agent) => agent.category
      )
    )
  );

  // filtered + sorted list
  const filteredAndSortedAgents = useMemo(() => {
    const list = activeTab === "subscribed" ? subscribedAgents : createdAgents;

    // search filter
    let filtered = list.filter(
      (agent) =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        agent.category
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );

    // category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((agent) =>
        selectedCategories.includes(agent.category)
      );
    }

    // price range filter
    filtered = filtered.filter(
      (agent) =>
        agent.price >= priceRange[0] && agent.price <= priceRange[1]
    );

    // sort
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "rating":
          comparison = a.rating - b.rating;
          break;
        case "users":
          comparison = a.users - b.users;
          break;
        case "revenue":
          // created agents have revenue like "$1,240"
          if (a.revenue && b.revenue) {
            const revenueA = parseFloat(
              a.revenue.replace(/[$,]/g, "")
            );
            const revenueB = parseFloat(
              b.revenue.replace(/[$,]/g, "")
            );
            comparison = revenueA - revenueB;
          }
          break;
        default:
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [
    activeTab,
    subscribedAgents,
    createdAgents,
    searchQuery,
    selectedCategories,
    priceRange,
    sortBy,
    sortDirection,
  ]);

  // handlers
  const handleAgentSelect = (agent) => {
    console.log("Selected agent:", agent);
    // can push route or open modal, etc
  };

  const handleCreateAgent = () => {
    window.location.href = "/createAgents";
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSortChange = (option) => {
    if (sortBy === option) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(option);
      setSortDirection("asc");
    }
    setShowSortMenu(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#161823" }}>
      {/* Navigation */}
      <Navigation />
      
      {/* header */}
      <section className="max-w-[1400px] mx-auto px-6 pt-24 pb-4 bg-gradient-to-r from-[#161823] to-[#161823] text-[#f8ede0]">
        {/* breadcrumbs */}
        <nav className="mb-4 text-sm text-[#5d606c]">
          <Link
            href="/"
            className="hover:underline cursor-pointer"
          >
            Home
          </Link>{" "}
          <span className="mx-1">&gt;</span>{" "}
          <Link
            href="/agents"
            className="hover:underline cursor-pointer text-[#f8ede0]"
          >
            My Agents
          </Link>
        </nav>

        {/* title + subtitle */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          My Agents
        </h1>
        <p className="text-base md:text-lg text-[#5d606c] mb-6">
          Track the agents you subscribe to—and the ones you build.
        </p>

        {/* tab + actions row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* tab toggle */}
          <ToggleButtonGroup
            selectionMode="single"
            selectedKeys={[activeTab]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              if (selected) setActiveTab(selected);
            }}
          >
            <Toggle
              id="created"
              variant="outline"
              size="default"
              className="gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>Created Agents</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#f8ede0]/10 text-[10px] font-semibold">
                {createdAgents.length}
              </span>
            </Toggle>

            <Toggle
              id="subscribed"
              variant="outline"
              size="default"
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Subscribed Agents</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#f8ede0]/10 text-[10px] font-semibold">
                {subscribedAgents.length}
              </span>
            </Toggle>
          </ToggleButtonGroup>

          {/* right side controls */}
          <div className="flex items-center gap-2">
            {/* search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#5d606c]" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="pl-9 pr-9 py-2 h-10 rounded-md border border-[#5d606c] bg-transparent text-sm text-[#f8ede0] placeholder:text-[#5d606c] focus:border-[#f8ede0] focus:outline-none focus:shadow-[0_0_15px_rgba(248,237,224,0.1)] transition-all duration-300"
                style={{ width: "200px" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5d606c] hover:text-[#f8ede0] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* sort dropdown */}
            <div className="relative" ref={sortMenuRef}>
              <button
                onClick={() => {
                  setShowSortMenu(!showSortMenu);
                  setShowFilterMenu(false);
                }}
                className="flex items-center gap-1 rounded-md border border-[#5d606c] px-3 py-2 h-10 text-sm text-[#f8ede0] hover:bg-[#5d606c]/20 hover:border-[#f8ede0] hover:shadow-[0_0_15px_rgba(248,237,224,0.1)] transition-all duration-300"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showSortMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#1C1F2B] border border-[#5d606c] rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
                  {[
                    { value: "name", label: "Name" },
                    { value: "price", label: "Price" },
                    { value: "rating", label: "Rating" },
                    { value: "users", label: "Users" },
                    ...(activeTab === "created"
                      ? [{ value: "revenue", label: "Revenue" }]
                      : []),
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleSortChange(option.value)
                      }
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        sortBy === option.value
                          ? "bg-[#5d606c] text-[#f8ede0] font-medium"
                          : "text-[#f8ede0] hover:bg-[#5d606c] transition"
                      }`}
                    >
                      {option.label}{" "}
                      {sortBy === option.value &&
                        (sortDirection === "asc"
                          ? "↑"
                          : "↓")}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* filter dropdown */}
            <div className="relative" ref={filterMenuRef}>
              <button
                onClick={() => {
                  setShowFilterMenu(!showFilterMenu);
                  setShowSortMenu(false);
                }}
                className="flex items-center gap-1 rounded-md border border-[#5d606c] px-3 py-2 h-10 text-sm text-[#f8ede0] hover:bg-[#5d606c]/20 hover:border-[#f8ede0] hover:shadow-[0_0_15px_rgba(248,237,224,0.1)] transition-all duration-300"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter</span>
                {(selectedCategories.length > 0 ||
                  priceRange[0] > 0.001 ||
                  priceRange[1] < 0.1) && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#f8ede0] text-[#161823] text-[10px] font-semibold">
                    {selectedCategories.length}
                  </span>
                )}
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showFilterMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-[#1C1F2B] border border-[#5d606c] rounded-md shadow-lg z-10 py-2 max-h-80 overflow-y-auto scrollbar-hide">
                  <style jsx>{`
                    .scrollbar-hide::-webkit-scrollbar {
                      display: none;
                    }
                    .scrollbar-hide {
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    }
                  `}</style>

                  {/* categories */}
                  <div className="px-4 py-2">
                    <h4 className="text-sm font-semibold text-[#f8ede0] mb-2">
                      Category
                    </h4>
                    <div className="space-y-1">
                      {allCategories.map((category) => {
                        const isSelected =
                          selectedCategories.includes(
                            category
                          );
                        return (
                          <button
                            key={category}
                            onClick={() =>
                              toggleCategory(category)
                            }
                            className="w-full flex items-center gap-3 px-2 py-2 text-sm text-[#f8ede0] hover:bg-[rgba(93,96,108,0.3)] transition-colors rounded"
                          >
                            <span className="flex items-center justify-center w-4 h-4">
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-[#f8ede0]" />
                              )}
                            </span>
                            <span
                              className={
                                isSelected
                                  ? "font-medium"
                                  : ""
                              }
                            >
                              {category}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* divider */}
                  <div className="my-2 border-t border-[#5d606c]" />

                  {/* price range */}
                  <div className="px-4 py-2">
                    <h4 className="text-sm font-semibold text-[#f8ede0] mb-3">
                      Price Range
                    </h4>
                    <div className="space-y-3">
                      <Slider
                        min={0.001}
                        max={0.1}
                        step={0.001}
                        value={priceRange}
                        onValueChange={(value) =>
                          setPriceRange(value)
                        }
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-xs text-[#f8ede0]/80">
                        <span>
                          ETH {priceRange[0].toFixed(3)}
                        </span>
                        <span>
                          ETH {priceRange[1].toFixed(3)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* clear filters */}
                  {(selectedCategories.length > 0 ||
                    priceRange[0] > 0.001 ||
                    priceRange[1] < 0.1) && (
                    <>
                      <div className="my-2 border-t border-[#5d606c]" />
                      <div className="px-4 py-2">
                        <button
                          onClick={() => {
                            setSelectedCategories([]);
                            setPriceRange([0.001, 0.1]);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-[#5d606c] text-sm text-[#f8ede0] hover:bg-[#5d606c] transition-all"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* subscribed tab */}
        {activeTab === "subscribed" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className="text-xl font-semibold"
                  style={{ color: "#f8ede0" }}
                >
                  Your Subscriptions
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "#5d606c" }}
                >
                  {filteredAndSortedAgents.length} of{" "}
                  {subscribedAgents.length} agents
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedAgents.map((agent) => (
                <TradingOracleCard
                  key={agent.id}
                  title={agent.name}
                  category={agent.category}
                  description={agent.description}
                  price={agent.price}
                  pricePeriod="/month"
                  rating={agent.rating}
                  users={agent.users}
                  trending={agent.trending}
                  onViewDetails={() =>
                    handleAgentSelect(agent)
                  }
                  variant="glass"
                  size="md"
                  hover="lift"
                  revealOnHover={true}
                />
              ))}
            </div>

            {filteredAndSortedAgents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#5d606c] text-lg">
                  No agents found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategories([]);
                    setPriceRange([0.001, 0.1]);
                  }}
                  className="mt-4 px-6 py-2 rounded-md border border-[#5d606c] text-sm text-[#f8ede0]/60 hover:bg-[#5d606c]/20 hover:text-[#f8ede0] transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* created tab */}
        {activeTab === "created" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className="text-xl font-semibold"
                  style={{ color: "#f8ede0" }}
                >
                  Agents You Created
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "#5d606c" }}
                >
                  {filteredAndSortedAgents.length} of{" "}
                  {createdAgents.length} agents
                </p>
              </div>

              <button
                onClick={handleCreateAgent}
                className="px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 font-medium"
                style={{
                  backgroundColor: "#f8ede0",
                  color: "#161823",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(248, 237, 224, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Plus className="w-5 h-5" />
                Create New Agent
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedAgents.map((agent) => (
                <CreatedAgentCard
                  key={agent.id}
                  title={agent.name}
                  category={agent.category}
                  description={agent.description}
                  price={agent.price}
                  pricePeriod="/month"
                  rating={agent.rating}
                  users={agent.users}
                  revenue={agent.revenue}
                  status={agent.status}
                  onViewDetails={() =>
                    handleAgentSelect(agent)
                  }
                  onEdit={() =>
                    console.log("Edit agent:", agent.id)
                  }
                  variant="glass"
                  size="md"
                  hover="lift"
                  revealOnHover={true}
                />
              ))}
            </div>

            {filteredAndSortedAgents.length === 0 &&
              createdAgents.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-[#5d606c] text-lg">
                    No agents found matching your criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategories([]);
                      setPriceRange([0.001, 0.1]);
                    }}
                    className="mt-4 px-6 py-2 rounded-md border border-[#5d606c] text-sm text-[#f8ede0]/60 hover:bg-[#5d606c]/20 hover:text-[#f8ede0] transition-all"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

            {/* if literally zero created agents (first-time user) */}
            {createdAgents.length === 0 && (
              <div
                className="rounded-3xl p-16 text-center"
                style={{
                  backgroundColor: "#1C1F2B",
                  border:
                    "2px dashed rgba(93, 96, 108, 0.4)",
                }}
              >
                <div className="mb-4">
                  <div
                    className="w-24 h-24 rounded-full mx-auto flex items-center justify-center"
                    style={{ backgroundColor: "#161823" }}
                  >
                    <Plus
                      className="w-12 h-12"
                      style={{ color: "#f8ede0" }}
                    />
                  </div>
                </div>
                <h3
                  className="text-2xl font-semibold mb-2"
                  style={{ color: "#f8ede0" }}
                >
                  No Agents Created Yet
                </h3>
                <p
                  className="mb-6"
                  style={{ color: "#5d606c" }}
                >
                  Start monetizing your AI by creating and
                  uploading your first agent!
                </p>
                <button
                  onClick={handleCreateAgent}
                  className="px-8 py-3 rounded-xl transition-all duration-200 font-medium"
                  style={{
                    backgroundColor: "#f8ede0",
                    color: "#161823",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 0 20px rgba(248, 237, 224, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "none";
                  }}
                >
                  Create Your First Agent
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
