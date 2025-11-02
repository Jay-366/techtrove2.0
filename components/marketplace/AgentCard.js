"use client";

import React from "react";
import { useRouter } from "next/navigation";

// Single star icon
const Star = ({ filled }) => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill={filled ? "oklch(89.9% 0.061 343.231)" : "rgba(255, 255, 255, 0.3)"}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 6.091 1.484 8.603L12 18.897l-7.42 4.103 1.484-8.603L0 9.306l8.332-1.151z" />
  </svg>
);

export const AgentCard = ({
  id,
  name,
  description,
  rating,
  reviews,
  tags,
  price,
  onDeploy,
}) => {
  const router = useRouter();
  const filledStars = Math.round(rating);

  return (
    <div
      className="relative overflow-hidden rounded-3xl text-white cursor-pointer transition-all duration-300"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
        e.currentTarget.style.boxShadow =
          "0 20px 40px rgba(255, 255, 255, 0.08), 0 0 60px rgba(255, 255, 255, 0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
        e.currentTarget.style.boxShadow =
          "0 10px 20px rgba(255, 255, 255, 0.04)";
      }}
      onClick={() => {
        router.push(`/agents/${id}`);
      }}
    >
      {/* soft glow overlay */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* main content */}
      <div className="relative z-10 p-4">
        {/* name */}
        <h3 className="text-lg font-semibold leading-tight text-white">
          {name}
        </h3>

        {/* description */}
        <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          {description}
        </p>

        {/* rating row */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-white">
            {rating.toFixed(1)}/5
          </span>
          <div className="flex space-x-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} filled={index < filledStars} />
            ))}
          </div>
          <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            ({reviews.toLocaleString()} Reviews)
          </span>
        </div>

        {/* divider */}
        <div className="my-3 h-px w-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* tags */}
        <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-2.5 py-0.5 text-xs text-white"
                style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
              >
                {tag}
              </span>
            ))}
          </div>
      </div>
    </div>
  );
};
