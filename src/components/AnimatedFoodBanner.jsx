import React from 'react';

export const AnimatedFoodBanner = () => {
  return (
    <div className="relative w-full h-48 sm:h-56 flex items-center justify-center overflow-hidden select-none">
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full filter drop-shadow-[0_0_25px_rgba(0,245,155,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cyber Plasma Flame Gradient */}
          <linearGradient id="cyberFlameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ff3366" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#00f59b" />
          </linearGradient>

          {/* Wok Induction Base Gradient */}
          <linearGradient id="cyberWokGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#070b14" />
          </linearGradient>

          {/* Holographic Orbital Ring */}
          <linearGradient id="cyberRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f59b" />
            <stop offset="50%" stopColor="#00d2ff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>

          {/* Glowing Filters */}
          <filter id="cyberNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Grid Floor Projection */}
        <g stroke="#1e293b" strokeWidth="1" opacity="0.4">
          <line x1="80" y1="230" x2="320" y2="230" />
          <line x1="100" y1="245" x2="300" y2="245" />
          <line x1="130" y1="260" x2="270" y2="260" />
        </g>

        {/* Animated Outer Holographic Orbit Rings */}
        <circle
          cx="200"
          cy="150"
          r="105"
          stroke="url(#cyberRingGrad)"
          strokeWidth="1.5"
          strokeDasharray="16 10"
          className="animate-spin-slow opacity-75"
        />
        <circle
          cx="200"
          cy="150"
          r="88"
          stroke="#00d2ff"
          strokeWidth="1"
          strokeDasharray="6 8"
          opacity="0.35"
        />

        {/* Animated Floating Cyber Steam Waves */}
        <g stroke="#00f59b" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" filter="url(#cyberNeonGlow)">
          <path d="M175 105 Q165 85 175 65 Q185 45 175 25" className="animate-pulse">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,8; 0,-16; 0,8"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M200 105 Q210 85 200 65 Q190 45 200 25" className="animate-pulse">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,4; 0,-20; 0,4"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M225 105 Q215 85 225 65 Q235 45 225 25" className="animate-pulse">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,10; 0,-14; 0,10"
              dur="3.2s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Animated Plasma Reaction Flames */}
        <path
          d="M170 205 Q185 165 190 185 Q200 155 210 185 Q215 165 230 205 Z"
          fill="url(#cyberFlameGrad)"
          filter="url(#cyberNeonGlow)"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1,1; 1.08,1.18; 1,1"
            pivot="200 205"
            dur="0.75s"
            repeatCount="indefinite"
          />
        </path>

        {/* Cyber Cloche / High-Tech Wok Reactor */}
        <path
          d="M136 165 C136 215 264 215 264 165 Z"
          fill="url(#cyberWokGrad)"
          stroke="#00d2ff"
          strokeWidth="2.5"
        />

        {/* High-Precision Thermal Heat Shield Rim */}
        <line x1="120" y1="165" x2="136" y2="165" stroke="#ff3366" strokeWidth="5" strokeLinecap="round" />
        <line x1="264" y1="165" x2="280" y2="165" stroke="#ff3366" strokeWidth="5" strokeLinecap="round" />

        {/* Floating Quantum Ingredients & Energy Orbs */}
        <g fill="#00f59b">
          <circle cx="168" cy="148" r="4">
            <animateTransform attributeName="transform" type="translate" values="0,0; -12,-22; 0,0" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="138" r="5" fill="#00d2ff">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-26; 0,0" dur="1.9s" repeatCount="indefinite" />
          </circle>
          <circle cx="232" cy="150" r="4" fill="#8b5cf6">
            <animateTransform attributeName="transform" type="translate" values="0,0; 14,-20; 0,0" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Holographic Laser Grid Crosshair */}
        <g stroke="#00f59b" strokeWidth="1" opacity="0.6">
          <circle cx="200" cy="150" r="40" fill="none" strokeDasharray="3 3" />
          <line x1="200" y1="100" x2="200" y2="120" />
          <line x1="200" y1="180" x2="200" y2="200" />
          <line x1="150" y1="150" x2="170" y2="150" />
          <line x1="230" y1="150" x2="250" y2="150" />
        </g>

        {/* Sparkle Telemetry Crosses */}
        <g fill="#00f59b">
          <path d="M125 85 L128 91 L134 94 L128 97 L125 103 L122 97 L116 94 L122 91 Z" className="animate-ping" />
          <path d="M275 75 L277 79 L282 81 L277 83 L275 87 L273 83 L268 81 L273 79 Z" className="animate-pulse" fill="#00d2ff" />
        </g>
      </svg>
    </div>
  );
};
