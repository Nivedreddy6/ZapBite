import React from 'react';

export const AnimatedDeliveryIcon = () => {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center select-none">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full filter drop-shadow-[0_0_12px_rgba(0,245,155,0.4)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Animated Cyber Speed Lasers */}
        <g stroke="#00f59b" strokeWidth="2" strokeLinecap="round" opacity="0.8">
          <line x1="6" y1="36" x2="26" y2="36">
            <animate attributeName="x1" values="6;-12;6" dur="0.5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="26;8;26" dur="0.5s" repeatCount="indefinite" />
          </line>
          <line x1="2" y1="52" x2="20" y2="52" stroke="#00d2ff">
            <animate attributeName="x1" values="2;-16;2" dur="0.4s" repeatCount="indefinite" />
            <animate attributeName="x2" values="20;4;20" dur="0.4s" repeatCount="indefinite" />
          </line>
          <line x1="8" y1="68" x2="30" y2="68">
            <animate attributeName="x1" values="8;-8;8" dur="0.6s" repeatCount="indefinite" />
            <animate attributeName="x2" values="30;14;30" dur="0.6s" repeatCount="indefinite" />
          </line>
        </g>

        {/* Cyber-Bike Frame */}
        <path
          d="M28 64 L44 64 L54 48 L76 48 L82 38 L66 38 Z"
          fill="#0f172a"
          stroke="#00d2ff"
          strokeWidth="2"
        />

        {/* Quantum Insulated Cargo Pod */}
        <rect
          x="24"
          y="36"
          width="22"
          height="22"
          rx="5"
          fill="#1e293b"
          stroke="#00f59b"
          strokeWidth="2"
        />
        <path d="M29 47 H41" stroke="#00f59b" strokeWidth="2" strokeLinecap="round" />

        {/* Rider Cyber Visor Helmet */}
        <circle cx="64" cy="30" r="8" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1.5" />
        <path d="M64 30 H71" stroke="#00f59b" strokeWidth="2.5" strokeLinecap="round" />

        {/* Spinning Photon Wheel Left */}
        <g transform="translate(34, 68)">
          <circle cx="0" cy="0" r="10" fill="#070b14" stroke="#00f59b" strokeWidth="2.5" />
          <line x1="-8" y1="0" x2="8" y2="0" stroke="#00d2ff" strokeWidth="2">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.4s" repeatCount="indefinite" />
          </line>
          <circle cx="0" cy="0" r="3" fill="#00f59b" />
        </g>

        {/* Spinning Photon Wheel Right */}
        <g transform="translate(76, 68)">
          <circle cx="0" cy="0" r="10" fill="#070b14" stroke="#00f59b" strokeWidth="2.5" />
          <line x1="-8" y1="0" x2="8" y2="0" stroke="#00d2ff" strokeWidth="2">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.4s" repeatCount="indefinite" />
          </line>
          <circle cx="0" cy="0" r="3" fill="#00f59b" />
        </g>
      </svg>
    </div>
  );
};
