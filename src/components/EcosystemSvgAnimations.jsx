import React from 'react';

// 1. Diner Experience & AI Concierge Animated SVG
export const DinerExperienceSvg = () => (
  <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-rose-50/80 via-white to-rose-100/50 border border-rose-100/80 p-2 relative overflow-hidden flex items-center justify-center group mb-4 shadow-inner">
    <style>{`
      @keyframes floatSlow {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-5px) rotate(2deg); }
      }
      @keyframes pulseAura {
        0%, 100% { transform: scale(1); opacity: 0.4; }
        50% { transform: scale(1.15); opacity: 0.8; }
      }
      @keyframes radarPing {
        0% { transform: scale(0.6); opacity: 0.9; }
        100% { transform: scale(1.6); opacity: 0; }
      }
      @keyframes sparklePop {
        0%, 100% { transform: scale(0.8) rotate(0deg); opacity: 0.4; }
        50% { transform: scale(1.2) rotate(45deg); opacity: 1; }
      }
      @keyframes waveStream {
        0% { transform: translateX(0); }
        100% { transform: translateX(-20px); }
      }
      .anim-float { animation: floatSlow 3.5s ease-in-out infinite; }
      .anim-aura { animation: pulseAura 2.8s ease-in-out infinite; }
      .anim-radar { transform-origin: center; animation: radarPing 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite; }
      .anim-sparkle { transform-origin: center; animation: sparklePop 2s ease-in-out infinite; }
    `}</style>

    <svg viewBox="0 0 240 120" className="w-full h-full max-w-[240px]">
      <defs>
        <radialGradient id="roseGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="phoneGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffe4e6" />
        </linearGradient>
        <linearGradient id="aiWaveGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="50%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
      </defs>

      {/* Background Pulsing Auras */}
      <circle cx="120" cy="60" r="50" fill="url(#roseGlow)" className="anim-aura" />
      <circle cx="120" cy="60" r="38" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />

      {/* AI Voice Radar Waves */}
      <circle cx="120" cy="60" r="30" fill="none" stroke="#f43f5e" strokeWidth="1.5" className="anim-radar" />
      <circle cx="120" cy="60" r="45" fill="none" stroke="#fb7185" strokeWidth="1" className="anim-radar" style={{ animationDelay: '0.7s' }} />

      {/* Central Phone Mockup */}
      <g className="anim-float">
        <rect x="94" y="22" width="52" height="76" rx="10" fill="url(#phoneGrad)" stroke="#f43f5e" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(244,63,94,0.15))" />
        
        {/* Phone Notch & Screen Header */}
        <rect x="108" y="26" width="24" height="3" rx="1.5" fill="#fda4af" />
        <circle cx="102" cy="36" r="3" fill="#f43f5e" />
        <rect x="108" y="34" width="28" height="4" rx="2" fill="#fecdd3" />

        {/* AI Concierge Sound Wave Banner */}
        <rect x="98" y="44" width="44" height="18" rx="5" fill="#fff1f2" stroke="#fda4af" strokeWidth="0.8" />
        <path d="M103 53 Q107 47 111 53 T119 53 T127 53 T135 53" fill="none" stroke="url(#aiWaveGrad)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="137" cy="53" r="1.5" fill="#f43f5e" />

        {/* Mini Food Recommendation Pill */}
        <rect x="98" y="66" width="44" height="14" rx="4" fill="#f43f5e" />
        <text x="120" y="76" fontSize="7" fill="#ffffff" fontWeight="bold" textAnchor="middle">✨ AI Order</text>

        {/* Home Button Pill */}
        <rect x="112" y="88" width="16" height="2" rx="1" fill="#fda4af" />
      </g>

      {/* Floating Interactive Food Elements */}
      {/* 1. Burger / Dish Left */}
      <g transform="translate(36, 38)" className="anim-float" style={{ animationDelay: '0.4s' }}>
        <circle cx="16" cy="16" r="16" fill="#ffffff" stroke="#fecdd3" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
        <path d="M9 16 C9 11 23 11 23 16 Z" fill="#fb923c" />
        <rect x="8" y="17" width="16" height="3" rx="1" fill="#22c55e" />
        <rect x="8" y="21" width="16" height="3" rx="1.5" fill="#f97316" />
      </g>

      {/* 2. Pizza / Ramen Right */}
      <g transform="translate(172, 38)" className="anim-float" style={{ animationDelay: '0.8s' }}>
        <circle cx="16" cy="16" r="16" fill="#ffffff" stroke="#fecdd3" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
        <path d="M16 8 L24 22 L8 22 Z" fill="#facc15" stroke="#f59e0b" strokeWidth="1" />
        <circle cx="15" cy="17" r="2" fill="#ef4444" />
        <circle cx="18" cy="14" r="1.5" fill="#ef4444" />
      </g>

      {/* Sparkles */}
      <path d="M68 25 L70 29 L74 31 L70 33 L68 37 L66 33 L62 31 L66 29 Z" fill="#f43f5e" className="anim-sparkle" />
      <path d="M178 84 L180 87 L183 88 L180 89 L178 92 L176 89 L173 88 L176 87 Z" fill="#fb7185" className="anim-sparkle" style={{ animationDelay: '1s' }} />
    </svg>
  </div>
);

// 2. Kitchen Operating System Animated SVG
export const KitchenOsSvg = () => (
  <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-orange-50/80 via-white to-amber-100/50 border border-orange-100/80 p-2 relative overflow-hidden flex items-center justify-center group mb-4 shadow-inner">
    <style>{`
      @keyframes riseSteam {
        0% { transform: translateY(0) scaleX(1); opacity: 0.8; }
        50% { transform: translateY(-8px) scaleX(1.1); opacity: 0.5; }
        100% { transform: translateY(-16px) scaleX(1.2); opacity: 0; }
      }
      @keyframes rotateTimer {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes flameFlicker {
        0%, 100% { transform: scale(1); opacity: 0.85; }
        50% { transform: scale(1.12, 1.08); opacity: 1; }
      }
      @keyframes panSizzle {
        0%, 100% { transform: translateY(0px); }
        25% { transform: translateY(-2px) rotate(-1deg); }
        75% { transform: translateY(1px) rotate(1deg); }
      }
      .anim-steam-1 { animation: riseSteam 2.2s infinite linear; }
      .anim-steam-2 { animation: riseSteam 2.2s infinite linear 0.7s; }
      .anim-steam-3 { animation: riseSteam 2.2s infinite linear 1.4s; }
      .anim-flame { transform-origin: 120px 88px; animation: flameFlicker 1.8s ease-in-out infinite; }
      .anim-clock { transform-origin: 180px 40px; animation: rotateTimer 8s linear infinite; }
      .anim-pan { animation: panSizzle 2s ease-in-out infinite; }
    `}</style>

    <svg viewBox="0 0 240 120" className="w-full h-full max-w-[240px]">
      <defs>
        <radialGradient id="orangeAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="panGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="ticketGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fff7ed" />
        </linearGradient>
      </defs>

      {/* Warm Background Heat Aura */}
      <circle cx="120" cy="65" r="55" fill="url(#orangeAura)" />

      {/* Burner Flame Glow */}
      <g className="anim-flame">
        <path d="M102 92 Q120 76 138 92 Q120 86 102 92 Z" fill="#ea580c" opacity="0.9" />
        <path d="M110 92 Q120 80 130 92 Q120 87 110 92 Z" fill="#facc15" />
      </g>

      {/* Sizzling Chef Wok / Skillet */}
      <g className="anim-pan">
        {/* Pan Body */}
        <path d="M85 64 Q120 90 155 64 Z" fill="url(#panGrad)" stroke="#ea580c" strokeWidth="1.5" />
        <ellipse cx="120" cy="64" rx="35" ry="7" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
        
        {/* Pan Handle */}
        <path d="M154 65 Q182 60 190 62" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
        
        {/* Food Sizzle Contents */}
        <ellipse cx="120" cy="64" rx="28" ry="4" fill="#ea580c" opacity="0.6" />
        <circle cx="112" cy="64" r="2.5" fill="#22c55e" />
        <circle cx="125" cy="63" r="2" fill="#facc15" />
        <circle cx="132" cy="65" r="2" fill="#ef4444" />
      </g>

      {/* Rising Sizzle Steam Paths */}
      <g>
        <path d="M110 54 Q106 44 112 36 T108 24" fill="none" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" className="anim-steam-1" />
        <path d="M120 52 Q124 40 118 30 T122 18" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" className="anim-steam-2" />
        <path d="M130 54 Q134 44 128 34 T132 22" fill="none" stroke="#fb923c" strokeWidth="1.8" strokeLinecap="round" className="anim-steam-3" />
      </g>

      {/* Live Order Queue Ticket Left */}
      <g transform="translate(24, 26)" className="anim-pan" style={{ animationDelay: '0.5s' }}>
        <rect x="0" y="0" width="48" height="64" rx="6" fill="url(#ticketGrad)" stroke="#fdba74" strokeWidth="1.5" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.06))" />
        <rect x="6" y="8" width="36" height="5" rx="2" fill="#f97316" />
        <rect x="6" y="18" width="28" height="3" rx="1.5" fill="#cbd5e1" />
        <rect x="6" y="25" width="34" height="3" rx="1.5" fill="#cbd5e1" />
        <rect x="6" y="32" width="20" height="3" rx="1.5" fill="#cbd5e1" />
        
        {/* Cooking Status Tag */}
        <rect x="6" y="44" width="36" height="12" rx="3" fill="#ffedd5" stroke="#f97316" strokeWidth="0.8" />
        <text x="24" y="53" fontSize="6.5" fill="#ea580c" fontWeight="bold" textAnchor="middle">🔥 PREPARING</text>
      </g>

      {/* Digital Speed Clock Right */}
      <g transform="translate(170, 24)">
        <circle cx="16" cy="16" r="16" fill="#ffffff" stroke="#f97316" strokeWidth="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
        <circle cx="16" cy="16" r="2" fill="#ea580c" />
        {/* Clock Hands */}
        <line x1="16" y1="16" x2="16" y2="6" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" className="anim-clock" />
        <line x1="16" y1="16" x2="23" y2="16" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
        
        <rect x="-4" y="36" width="40" height="12" rx="3" fill="#ea580c" />
        <text x="16" y="45" fontSize="7" fill="#ffffff" fontWeight="bold" textAnchor="middle">12:00 MIN</text>
      </g>
    </svg>
  </div>
);

// 3. Rider Fleet Dispatch Animated SVG
export const RiderFleetSvg = () => (
  <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-yellow-100/50 border border-amber-100/80 p-2 relative overflow-hidden flex items-center justify-center group mb-4 shadow-inner">
    <style>{`
      @keyframes dashMove {
        to { stroke-dashoffset: -40; }
      }
      @keyframes scooterBob {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-3px) rotate(1deg); }
      }
      @keyframes spinWheel {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes beaconPing {
        0% { transform: scale(0.6); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }
      .anim-dash { stroke-dasharray: 6 4; animation: dashMove 1.5s linear infinite; }
      .anim-scooter { animation: scooterBob 1.8s ease-in-out infinite; }
      .anim-wheel { transform-origin: center; animation: spinWheel 1.2s linear infinite; }
      .anim-beacon { transform-origin: 196px 74px; animation: beaconPing 2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite; }
    `}</style>

    <svg viewBox="0 0 240 120" className="w-full h-full max-w-[240px]">
      <defs>
        <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="scooterBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Map Grid Vector Background */}
      <circle cx="120" cy="60" r="55" fill="url(#amberGlow)" />
      <path d="M20 90 L80 40 L160 85 L220 35" fill="none" stroke="#fde68a" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      
      {/* Animated Glowing GPS Vector Path */}
      <path d="M20 90 L80 40 L160 85 L220 35" fill="none" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="anim-dash" />

      {/* Start Point Radar Beacon */}
      <circle cx="20" cy="90" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />

      {/* Destination Doorstep Ping */}
      <g>
        <circle cx="218" cy="36" r="14" fill="none" stroke="#ef4444" strokeWidth="1.5" className="anim-beacon" style={{ transformOrigin: '218px 36px' }} />
        <circle cx="218" cy="36" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
        {/* Destination Pin Icon */}
        <path d="M218 24 C213 24 210 28 210 32 C210 37 218 45 218 45 C218 45 226 37 226 32 C226 28 223 24 218 24 Z" fill="#ef4444" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.2))" />
        <circle cx="218" cy="31" r="2.5" fill="#ffffff" />
      </g>

      {/* Animated Electric Delivery Scooter */}
      <g transform="translate(100, 48)" className="anim-scooter">
        {/* Headlight Beam */}
        <polygon points="34,16 54,8 54,24" fill="#fef08a" opacity="0.6" />

        {/* Scooter Chassis & Thermal Delivery Box */}
        <rect x="0" y="4" width="16" height="16" rx="3" fill="#ea580c" stroke="#ffffff" strokeWidth="1" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.15))" />
        <text x="8" y="15" fontSize="7" fill="#ffffff" fontWeight="bold" textAnchor="middle">⚡</text>

        {/* Scooter Main Body Frame */}
        <path d="M12 18 L24 18 L28 10 L34 10" fill="none" stroke="url(#scooterBody)" strokeWidth="3" strokeLinecap="round" />
        
        {/* Rider Helmet */}
        <circle cx="18" cy="4" r="5" fill="#1e293b" />
        <path d="M18 4 L22 5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />

        {/* Left Wheel */}
        <g transform="translate(6, 22)">
          <circle cx="0" cy="0" r="6" fill="#334155" stroke="#ffffff" strokeWidth="1" />
          <circle cx="0" cy="0" r="2.5" fill="#94a3b8" />
        </g>

        {/* Right Wheel */}
        <g transform="translate(26, 22)">
          <circle cx="0" cy="0" r="6" fill="#334155" stroke="#ffffff" strokeWidth="1" />
          <circle cx="0" cy="0" r="2.5" fill="#94a3b8" />
        </g>
      </g>

      {/* Floating 25-Min SLA Badge */}
      <g transform="translate(42, 14)">
        <rect x="0" y="0" width="56" height="16" rx="4" fill="#ffffff" stroke="#f59e0b" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
        <circle cx="8" cy="8" r="4" fill="#22c55e" />
        <text x="32" y="11" fontSize="7.5" fill="#b45309" fontWeight="bold" textAnchor="middle">⚡ 25m SLA</text>
      </g>
    </svg>
  </div>
);

// 4. Analytics & Operations Animated SVG
export const AnalyticsOpsSvg = () => (
  <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-teal-100/50 border border-emerald-100/80 p-2 relative overflow-hidden flex items-center justify-center group mb-4 shadow-inner">
    <style>{`
      @keyframes barGrow1 { 0%, 100% { height: 26px; y: 64px; } 50% { height: 42px; y: 48px; } }
      @keyframes barGrow2 { 0%, 100% { height: 46px; y: 44px; } 50% { height: 28px; y: 62px; } }
      @keyframes barGrow3 { 0%, 100% { height: 34px; y: 56px; } 50% { height: 52px; y: 38px; } }
      @keyframes barGrow4 { 0%, 100% { height: 56px; y: 34px; } 50% { height: 40px; y: 50px; } }
      @keyframes nodePulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.4); opacity: 1; } }
      .anim-bar-1 { animation: barGrow1 3s ease-in-out infinite; }
      .anim-bar-2 { animation: barGrow2 3s ease-in-out infinite 0.4s; }
      .anim-bar-3 { animation: barGrow3 3s ease-in-out infinite 0.8s; }
      .anim-bar-4 { animation: barGrow4 3s ease-in-out infinite 1.2s; }
      .anim-node { transform-origin: center; animation: nodePulse 2s ease-in-out infinite; }
    `}</style>

    <svg viewBox="0 0 240 120" className="w-full h-full max-w-[240px]">
      <defs>
        <radialGradient id="emeraldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Emerald Background Glow */}
      <circle cx="120" cy="60" r="55" fill="url(#emeraldGlow)" />

      {/* Grid Lines */}
      <line x1="30" y1="35" x2="210" y2="35" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3 3" />
      <line x1="30" y1="60" x2="210" y2="60" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3 3" />
      <line x1="30" y1="90" x2="210" y2="90" stroke="#cbd5e1" strokeWidth="1.2" />

      {/* Animated Growing Bar Chart Columns */}
      <rect x="50" y="64" width="14" height="26" rx="3" fill="url(#barGrad2)" className="anim-bar-1" />
      <rect x="74" y="44" width="14" height="46" rx="3" fill="url(#barGrad1)" className="anim-bar-2" />
      <rect x="98" y="56" width="14" height="34" rx="3" fill="url(#barGrad2)" className="anim-bar-3" />
      <rect x="122" y="34" width="14" height="56" rx="3" fill="url(#barGrad1)" className="anim-bar-4" />
      <rect x="146" y="48" width="14" height="42" rx="3" fill="url(#barGrad2)" className="anim-bar-2" />

      {/* Trend Area Curve & Polyline */}
      <path d="M57 74 Q81 48 105 60 T153 38 L153 90 L57 90 Z" fill="url(#areaGrad)" />
      <path d="M57 74 Q81 48 105 60 T153 38" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />

      {/* Glowing Dynamic Data Nodes */}
      <circle cx="57" cy="74" r="3.5" fill="#ffffff" stroke="#059669" strokeWidth="2" />
      <circle cx="105" cy="60" r="3.5" fill="#ffffff" stroke="#059669" strokeWidth="2" />
      <circle cx="153" cy="38" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" className="anim-node" />

      {/* Floating Revenue Ticker Badge */}
      <g transform="translate(145, 14)">
        <rect x="0" y="0" width="70" height="22" rx="6" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.08))" />
        <circle cx="11" cy="11" r="5" fill="#d1fae5" />
        <path d="M8 12 L11 8 L14 12" stroke="#059669" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="42" y="14" fontSize="8" fill="#047857" fontWeight="extrabold" textAnchor="middle">+48.2%</text>
      </g>
    </svg>
  </div>
);
