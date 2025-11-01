'use client';

import { useEffect, useState } from 'react';

/**
 * Simple SplitText animation component
 * Splits text into characters and animates them
 */
export default function SplitText({ 
  text, 
  className = '', 
  tag = 'span',
  delay = 0,
  duration = 0.8 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const Tag = tag;
  const characters = text.split('');

  return (
    <Tag className={className}>
      {characters.map((char, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            transition: `opacity ${duration}s ease-out, transform ${duration}s ease-out`,
            transitionDelay: `${index * 0.03}s`,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(50px)'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  );
}

