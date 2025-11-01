'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * Simple Dropdown Menu component
 */
export default function DropdownMenu({ options, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 rounded-xl text-left transition-all duration-200"
        style={{
          border: '1px solid #50606C',
          backgroundColor: '#161823',
          color: 'rgba(251, 237, 224, 0.8)',
          fontSize: '14px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#FBede0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#50606C';
        }}
      >
        {children}
      </button>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden"
          style={{
            backgroundColor: '#1C1F2B',
            border: '1px solid #50606C',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          }}
        >
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                option.onClick();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left transition-all duration-200"
              style={{
                color: 'rgba(251, 237, 224, 0.8)',
                fontSize: '14px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(80, 96, 108, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

