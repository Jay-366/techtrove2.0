"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function AgentFilters({ onFiltersChange }) {
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 1],
    rating: 0,
  });

  const categories = [
    "Customer Service",
    "Development",
    "Workflow",
    "Voice",
    "Content",
    "Analytics",
    "Security",
    "Infrastructure",
    "Testing",
    "Code Assistant",
    "Writing",
  ];

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const toggleCategory = (category) => {
    const isSelected = filters.categories.includes(category);
    const newCategories = isSelected
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    handleFilterChange({ categories: newCategories });
  };

  return (
    <div className="p-6" style={{ color: "#FBede0" }}>
      <div className="space-y-6">
        {/* Categories */}
        <div>
          <label
            className="block text-sm mb-3"
            style={{ color: "rgba(251, 237, 224, 0.8)" }}
          >
            Categories
          </label>
          <div className="flex flex-col gap-2">
            {categories.map((category) => {
              const isSelected = filters.categories.includes(category);
              return (
                <label
                  key={category}
                  className="inline-flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={isSelected}
                    onChange={() => toggleCategory(category)}
                    style={{ accentColor: "#FBede0" }}
                  />
                  <span className="ml-2">{category}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label
            className="block text-sm mb-3"
            style={{ color: "rgba(251, 237, 224, 0.8)" }}
          >
            Price Range: {filters.priceRange[1]} COIN
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={filters.priceRange[1]}
            onChange={(e) =>
              handleFilterChange({
                priceRange: [0, parseFloat(e.target.value)],
              })
            }
            className="w-full"
            style={{ accentColor: "#FBede0" }}
          />
          <div
            className="flex justify-between text-sm mt-1"
            style={{ color: "rgba(251, 237, 224, 0.6)" }}
          >
            <span>0.1</span>
            <span>1.0</span>
          </div>
        </div>

        {/* Rating */}
        <div>
          <label
            className="block text-sm mb-3"
            style={{ color: "rgba(251, 237, 224, 0.8)" }}
          >
            Minimum Rating
          </label>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                onClick={() =>
                  handleFilterChange({ rating: index + 1 })
                }
                className={`w-5 h-5 cursor-pointer ${
                  index < filters.rating
                    ? "fill-current text-yellow-500"
                    : "text-gray-400"
                }`}
              />
            ))}
          </div>
          <div
            className="text-sm"
            style={{ color: "rgba(251, 237, 224, 0.6)" }}
          >
            {filters.rating > 0
              ? `${filters.rating} stars or higher`
              : "Any rating"}
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={() =>
            handleFilterChange({
              categories: [],
              priceRange: [0, 1],
              rating: 0,
            })
          }
          className="w-full px-4 py-2 mt-2 text-center rounded-xl transition-all duration-200"
          style={{
            border: "1px solid rgba(251, 237, 224, 0.4)",
            color: "#FBede0",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              "rgba(251, 237, 224, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
