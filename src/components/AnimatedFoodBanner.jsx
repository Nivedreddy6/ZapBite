import React from 'react';

export const AnimatedFoodBanner = () => {
  return (
    <div className="relative w-full h-44 sm:h-52 flex items-center justify-center overflow-hidden select-none">
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full filter drop-shadow-[0_0_20px_rgba(255,46,99,0.35)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FF0055" />
            <stop offset="50%" stopColor="#FF5200" />
            <stop offset="100%" stopColor="#FFD166" />
          </linearGradient>

          <linearGradient id="wokGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F5D4" />
            <stop offset="50%" stopColor="#7B2CBF" />
            <stop offset="100%" stopColor="#FF2E63" />
          </linearGradient>

          {/* Glowing Filters */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated Outer Orbit Ring */}
        <circle
          cx="200"
          cy="160"
          r="100"
          stroke="url(#ringGrad)"
          strokeWidth="2"
          strokeDasharray="12 8"
          className="animate-spin-slow opacity-60"
        />

        {/* Animated Floating Steam Waves */}
        <g stroke="#00F5D4" strokeWidth="3" strokeLinecap="round" opacity="0.8" filter="url(#neonGlow)">
          <path d="M175 110 Q165 90 175 70 Q185 50 175 30" className="animate-pulse">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,10; 0,-15; 0,10"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M200 110 Q210 90 200 70 Q190 50 200 30" className="animate-pulse">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,5; 0,-20; 0,5"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M225 110 Q215 90 225 70 Q235 50 225 30" className="animate-pulse">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,12; 0,-12; 0,12"
              dur="3.2s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Animated Flames Under Pan */}
        <path
          d="M170 210 Q185 170 190 190 Q200 160 210 190 Q215 170 230 210 Z"
          fill="url(#flameGrad)"
          filter="url(#neonGlow)"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1,1; 1.08,1.15; 1,1"
            pivot="200 210"
            dur="0.8s"
            repeatCount="indefinite"
          />
        </path>

        {/* Cooking Wok Bowl */}
        <path
          d="M140 170 C140 220 260 220 260 170 Z"
          fill="url(#wokGrad)"
          stroke="#334155"
          strokeWidth="3"
        />

        {/* Wok Handles */}
        <path d="M125 170 L140 170" stroke="#FF2E63" strokeWidth="6" strokeLinecap="round" />
        <path d="M260 170 L275 170" stroke="#FF2E63" strokeWidth="6" strokeLinecap="round" />

        {/* Animated Spicy Food Ingredients (Flying Veggie Dots & Rice Grains) */}
        <g fill="#FFD166">
          <circle cx="170" cy="150" r="4">
            <animateTransform attributeName="transform" type="translate" values="0,0; -10,-20; 0,0" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="140" r="5" fill="#FF2E63">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-25; 0,0" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="230" cy="155" r="4" fill="#00F5D4">
            <animateTransform attributeName="transform" type="translate" values="0,0; 12,-18; 0,0" dur="1.4s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Sparkle Stars */}
        <g fill="#00F5D4">
          <path d="M130 90 L133 96 L140 99 L133 102 L130 108 L127 102 L120 99 L127 96 Z" className="animate-ping" />
          <path d="M270 80 L272 84 L277 86 L272 88 L270 92 L268 88 L263 86 L268 84 Z" className="animate-pulse" />
        </g>
      </svg>
    </div>
  );
};
