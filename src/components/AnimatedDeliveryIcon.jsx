import React from 'react';

export const AnimatedDeliveryIcon = () => {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center select-none">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full filter drop-shadow-[0_0_10px_rgba(0,245,212,0.5)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Animated Speed Lines Background */}
        <g stroke="#00F5D4" strokeWidth="2" strokeLinecap="round" opacity="0.7">
          <line x1="5" y1="35" x2="25" y2="35">
            <animate attributeName="x1" values="5;-10;5" dur="0.6s" repeatCount="indefinite" />
            <animate attributeName="x2" values="25;10;25" dur="0.6s" repeatCount="indefinite" />
          </line>
          <line x1="2" y1="50" x2="18" y2="50">
            <animate attributeName="x1" values="2;-15;2" dur="0.5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="18;5;18" dur="0.5s" repeatCount="indefinite" />
          </line>
          <line x1="8" y1="65" x2="30" y2="65">
            <animate attributeName="x1" values="8;-5;8" dur="0.7s" repeatCount="indefinite" />
            <animate attributeName="x2" values="30;15;30" dur="0.7s" repeatCount="indefinite" />
          </line>
        </g>

        {/* Scooter Body Frame */}
        <path
          d="M30 65 L45 65 L55 50 L75 50 L80 40 L65 40 Z"
          fill="#FF2E63"
          stroke="#7B2CBF"
          strokeWidth="2"
        />

        {/* Delivery Thermal Box on Back */}
        <rect
          x="25"
          y="38"
          width="22"
          height="22"
          rx="4"
          fill="#00F5D4"
          stroke="#0F172A"
          strokeWidth="2"
        />
        <path d="M30 48 H42" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />

        {/* Rider Helmet */}
        <circle cx="62" cy="32" r="8" fill="#7B2CBF" />
        <path d="M62 32 H68" stroke="#00F5D4" strokeWidth="2" strokeLinecap="round" />

        {/* Spinning Wheel Left */}
        <g transform="translate(35, 68)">
          <circle cx="0" cy="0" r="10" fill="#0F172A" stroke="#00F5D4" strokeWidth="3" />
          <line x1="-8" y1="0" x2="8" y2="0" stroke="#00F5D4" strokeWidth="1.5">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.4s" repeatCount="indefinite" />
          </line>
        </g>

        {/* Spinning Wheel Right */}
        <g transform="translate(75, 68)">
          <circle cx="0" cy="0" r="10" fill="#0F172A" stroke="#00F5D4" strokeWidth="3" />
          <line x1="-8" y1="0" x2="8" y2="0" stroke="#00F5D4" strokeWidth="1.5">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.4s" repeatCount="indefinite" />
          </line>
        </g>
      </svg>
    </div>
  );
};
