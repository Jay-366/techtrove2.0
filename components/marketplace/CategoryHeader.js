"use client";

import React from "react";
import Link from "next/link";

export const CategoryHeader = ({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters,
  onFiltersChange,
  activeFilters,
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = React.useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = React.useState(false);

  const ratingDropdownRef = React.useRef(null);
  const categoryDropdownRef = React.useRef(null);

  // close dropdowns on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (
        ratingDropdownRef.current &&
        !ratingDropdownRef.current.contains(event.target)
      ) {
        setShowRatingDropdown(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const categories = [
    "Customer Service",
    "Development",
    "Workflow",
    "Voice",
    "Content",
    "Analytics",
    "Security",
  ];

  const ratings = [
    { label: "All Ratings", value: 0 },
    { label: "4+ Stars", value: 4 },
    { label: "4.5+ Stars", value: 4.5 },
  ];

  const getSelectedRatingLabel = () => {
    const selected = ratings.find(
      (r) => r.value === activeFilters.rating
    );
    return selected ? selected.label : "Ratings";
  };

  const getSelectedCategoryLabel = () => {
    const count = activeFilters.categories.length;
    if (count === 0) return "Categories";
    if (count === 1) return activeFilters.categories[0];
    return `${count} Categories`;
  };

  const toggleCategory = (category) => {
    const isSelected = activeFilters.categories.includes(category);
    const newCategories = isSelected
      ? activeFilters.categories.filter((c) => c !== category)
      : [...activeFilters.categories, category];

    onFiltersChange({
      ...activeFilters,
      categories: newCategories,
    });
  };

  return (
    <section
      className="max-w-[1400px] mx-auto px-6 pt-24 pb-4 text-[#f8ede0]"
      style={{ backgroundColor: "#161823" }}
    >
      {/* Breadcrumbs */}
      <nav className="mb-4 text-sm text-[#5d606c]">
        <Link
          href="/"
          className="hover:underline cursor-pointer text-[#5d606c]"
        >
          Home
        </Link>{" "}
        <span className="mx-1">&gt;</span>{" "}
        <Link
          href="/marketplace"
          className="hover:underline cursor-pointer text-[#f8ede0]"
        >
          Marketplace
        </Link>
      </nav>

      {/* Title / subtitle */}
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[#f8ede0]">
        Explore the World of AI Agents
      </h1>
      <p className="text-base md:text-lg text-[#5d606c] mb-6">
        Browse, test, and integrate next-generation autonomous agents in one
        place.
      </p>

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex flex-grow items-center rounded-md border border-[#5d606c] bg-transparent px-3 py-2 h-[38px] focus-within:border-[#f8ede0] hover:border-[#f8ede0]/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(248,237,224,0.1)]">
          <svg
            className="h-5 w-5 text-[#5d606c] mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-grow bg-transparent outline-none text-[#f8ede0] placeholder-[#5d606c]"
          />
        </div>

        {/* Rating dropdown */}
        <div className="relative" ref={ratingDropdownRef}>
          <button
            onClick={() => {
              setShowRatingDropdown(!showRatingDropdown);
              setShowCategoryDropdown(false);
            }}
            className="flex items-center gap-1 rounded-md border border-[#5d606c] px-3 py-2 h-[38px] text-sm text-[#f8ede0] hover:bg-[#5d606c]/20 hover:border-[#f8ede0] hover:shadow-[0_0_15px_rgba(248,237,224,0.1)] transition-all duration-300"
          >
            {getSelectedRatingLabel()}
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
          {showRatingDropdown && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-[#1C1F2B] border border-[#5d606c] rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
              {ratings.map((rating) => (
                <button
                  key={rating.value}
                  onClick={() => {
                    onFiltersChange({
                      ...activeFilters,
                      rating: rating.value,
                    });
                    setShowRatingDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#f8ede0] hover:bg-[#5d606c] transition"
                >
                  {rating.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category dropdown */}
        <div className="relative" ref={categoryDropdownRef}>
          <button
            onClick={() => {
              setShowCategoryDropdown(!showCategoryDropdown);
              setShowRatingDropdown(false);
            }}
            className="flex items-center gap-1 rounded-md border border-[#5d606c] px-3 py-2 h-[38px] text-sm text-[#f8ede0] hover:bg-[#5d606c]/20 hover:border-[#f8ede0] hover:shadow-[0_0_15px_rgba(248,237,224,0.1)] transition-all duration-300"
          >
            {getSelectedCategoryLabel()}
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

          {showCategoryDropdown && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-[#1C1F2B] border border-[#5d606c] rounded-md shadow-lg z-10 py-2 max-h-80 overflow-y-auto">
              {categories.map((category) => {
                const isSelected =
                  activeFilters.categories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#f8ede0] hover:bg-[rgba(93,96,108,0.3)] transition-colors"
                  >
                    <span className="flex items-center justify-center w-4 h-4">
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#f8ede0]" />
                      )}
                    </span>
                    <span className={isSelected ? "font-medium" : ""}>
                      {category}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Show/Hide Filters sidebar toggle (optional use) */}
        <button
          onClick={onToggleFilters}
          className="rounded-md border border-[#5d606c] px-3 py-2 h-[38px] text-sm text-[#f8ede0] hover:bg-[#5d606c]/20 hover:border-[#f8ede0] hover:shadow-[0_0_15px_rgba(248,237,224,0.1)] transition-all duration-300"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
    </section>
  );
};
