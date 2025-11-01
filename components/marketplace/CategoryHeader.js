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
      className="max-w-[1400px] mx-auto px-6 pt-24 pb-4 text-white"
      style={{ backgroundColor: "#000000" }}
    >
      {/* Breadcrumbs */}
      <nav className="mb-4 text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
        <Link
          href="/"
          className="hover:underline cursor-pointer"
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          Home
        </Link>{" "}
        <span className="mx-1">&gt;</span>{" "}
        <Link
          href="/marketplace"
          className="hover:underline cursor-pointer text-white"
        >
          Marketplace
        </Link>
      </nav>

      {/* Title / subtitle */}
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
        Explore the World of <span style={{ 
          background: 'linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>AI Agents</span>
      </h1>
      <p className="text-base md:text-lg mb-6" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
        Browse, test, and integrate next-generation autonomous agents in one
        place.
      </p>

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex flex-grow items-center rounded-md border px-3 py-2 h-[38px] transition-all duration-300" style={{
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)'
        }}>
          <svg
            className="h-5 w-5 mr-2"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
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
            className="flex-grow bg-transparent outline-none text-white"
            style={{ '::placeholder': { color: 'rgba(255, 255, 255, 0.6)' } }}
          />
        </div>

        {/* Rating dropdown */}
        <div className="relative" ref={ratingDropdownRef}>
          <button
            onClick={() => {
              setShowRatingDropdown(!showRatingDropdown);
              setShowCategoryDropdown(false);
            }}
            className="flex items-center gap-1 rounded-md border px-3 py-2 h-[38px] text-sm text-white transition-all duration-300 hover:bg-white hover:bg-opacity-10"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }}
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
            <div className="absolute top-full right-0 mt-2 w-48 rounded-md shadow-lg z-10 max-h-64 overflow-y-auto" style={{
              backgroundColor: '#000000',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
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
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-10 transition"
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
            className="flex items-center gap-1 rounded-md border px-3 py-2 h-[38px] text-sm text-white transition-all duration-300 hover:bg-white hover:bg-opacity-10"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }}
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
            <div className="absolute top-full right-0 mt-2 w-56 rounded-md shadow-lg z-10 py-2 max-h-80 overflow-y-auto" style={{
              backgroundColor: '#000000',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              {categories.map((category) => {
                const isSelected =
                  activeFilters.categories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                  >
                    <span className="flex items-center justify-center w-4 h-4">
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full" style={{
                          background: 'linear-gradient(45deg, oklch(89.9% 0.061 343.231), oklch(91.7% 0.08 205.041))'
                        }} />
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
          className="rounded-md border px-3 py-2 h-[38px] text-sm text-white transition-all duration-300 hover:bg-white hover:bg-opacity-10"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)'
          }}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
    </section>
  );
};
