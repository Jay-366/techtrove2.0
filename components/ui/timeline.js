"use client";

import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({ data }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 90%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full font-sans md:px-10"
      style={{ backgroundColor: "#161823" }}
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto pb-40 pt-0">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-5 md:pt-10 md:gap-10"
          >
            {/* Sticky left rail (step info + dot) */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div
                className="h-10 absolute left-0 md:left-0 w-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#161823" }}
              >
                <div
                  className="h-4 w-4 rounded-full border p-2"
                  style={{
                    backgroundColor: "#5d606c",
                    borderColor: "#f8ede0",
                  }}
                />
              </div>

              <div className="hidden md:block md:pl-20">
                <h3
                  className="text-xl md:text-5xl font-bold mb-2"
                  style={{ color: "#5d606c" }}
                >
                  {item.title}
                </h3>

                {item.subtitle && (
                  <h4
                    className="text-lg md:text-2xl font-bold mb-1"
                    style={{ color: "#f8ede0" }}
                  >
                    {item.subtitle}
                  </h4>
                )}

                {item.description && (
                  <p
                    className="text-sm md:text-base"
                    style={{ color: "#5d606c" }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            </div>

            {/* Right side content block */}
            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              {/* mobile header */}
              <div className="md:hidden block mb-4">
                <h3
                  className="text-2xl mb-2 text-left font-bold"
                  style={{ color: "#5d606c" }}
                >
                  {item.title}
                </h3>

                {item.subtitle && (
                  <h4
                    className="text-xl font-bold mb-1"
                    style={{ color: "#f8ede0" }}
                  >
                    {item.subtitle}
                  </h4>
                )}

                {item.description && (
                  <p className="text-sm" style={{ color: "#5d606c" }}>
                    {item.description}
                  </p>
                )}
              </div>

              {item.content}{" "}
            </div>
          </div>
        ))}

        {/* vertical line + animated progress highlight */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-5 left-5 top-0 overflow-hidden w-[2px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          {/* base line (grey) */}
          <div
            className="absolute inset-x-0 top-0 w-[2px] h-full"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, #5d606c 10%, #5d606c 90%, transparent 100%)",
            }}
          />

          {/* scroll progress line (peach glow) */}
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              background:
                "linear-gradient(to top, #f8ede0 0%, #f8ede0 10%, transparent 100%)",
            }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
