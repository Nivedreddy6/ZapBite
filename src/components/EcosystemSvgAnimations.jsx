import React from 'react';

// 1. Quantum Diner & AI Concierge Holographic Synthesizer
export const DinerExperienceSvg = () => (
  <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-[#0d1527] via-[#090e1c] to-[#040711] border border-emerald-500/30 p-2 relative overflow-hidden flex items-center justify-center group mb-4 shadow-[0_0_25px_rgba(0,245,155,0.08)]">
    <style>{`
      @keyframes floatCyberDiner {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-6px) rotate(1.5deg); }
      }
      @keyframes pulseNeonRing {
        0%, 100% { transform: scale(1); opacity: 0.3; }
        50% { transform: scale(1.18); opacity: 0.8; }
      }
      @keyframes radarSweepScan {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes soundBarOscillate {
        0%, 100% { height: 6px; }
        50% { height: 18px; }
      }
      .anim-diner-float { animation: floatCyberDiner 3.6s ease-in-out infinite; }
      .anim-neon-pulse { animation: pulseNeonRing 3s ease-in-out infinite; }
      .anim-radar-sweep { transform-origin: 120px 60px; animation: radarSweepScan 4s linear infinite; }
    `}</style>

    <svg viewBox="0 0 240 120" className="w-full h-full max-w-[240px]">
      <defs>
        <radialGradient id="cyberEmeraldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00f59b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00f59b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cyberDeviceGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="neonLaserGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00f59b" />
          <stop offset="50%" stopColor="#00d2ff" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="neonBlur">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Cyber Background Grid & Pulse Auras */}
      <circle cx="120" cy="60" r="54" fill="url(#cyberEmeraldGlow)" className="anim-neon-pulse" />
      <circle cx="120" cy="60" r="44" fill="none" stroke="#00f59b" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
      
      {/* Rotating Radar Scanner Line */}
      <line x1="120" y1="60" x2="160" y2="60" stroke="#00f59b" strokeWidth="1.5" opacity="0.6" className="anim-radar-sweep" />

      {/* Central Quantum Telemetry Terminal */}
      <g className="anim-diner-float">
        <rect x="92" y="18" width="56" height="84" rx="12" fill="url(#cyberDeviceGrad)" stroke="#00f59b" strokeWidth="1.8" filter="url(#neonBlur)" />
        
        {/* Top Camera & Sensor */}
        <circle cx="120" cy="24" r="2" fill="#00d2ff" />
        
        {/* Holographic Waveform Screen */}
        <rect x="98" y="32" width="44" height="24" rx="6" fill="#070b14" stroke="#00d2ff" strokeWidth="0.8" />
        
        {/* AI Audio Soundbars */}
        <g fill="#00f59b">
          <rect x="103" y="40" width="2" height="8" rx="1">
            <animate attributeName="height" values="4;14;6;16;4" dur="1.2s" repeatCount="indefinite" />
          </rect>
          <rect x="108" y="38" width="2" height="12" rx="1" fill="#00d2ff">
            <animate attributeName="height" values="8;16;4;12;8" dur="1s" repeatCount="indefinite" />
          </rect>
          <rect x="113" y="36" width="2" height="16" rx="1" fill="#8b5cf6">
            <animate attributeName="height" values="12;6;16;8;12" dur="1.4s" repeatCount="indefinite" />
          </rect>
          <rect x="118" y="38" width="2" height="12" rx="1" fill="#00f59b">
            <animate attributeName="height" values="6;16;8;14;6" dur="0.9s" repeatCount="indefinite" />
          </rect>
          <rect x="123" y="40" width="2" height="8" rx="1" fill="#00d2ff">
            <animate attributeName="height" values="4;12;6;14;4" dur="1.1s" repeatCount="indefinite" />
          </rect>
          <rect x="128" y="39" width="2" height="10" rx="1" fill="#8b5cf6">
            <animate attributeName="height" values="8;4;14;6;8" dur="1.3s" repeatCount="indefinite" />
          </rect>
          <rect x="133" y="42" width="2" height="6" rx="1" fill="#00f59b">
            <animate attributeName="height" values="4;10;5;12;4" dur="1s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* AI Sensory Synthesis Capsule Button */}
        <rect x="98" y="62" width="44" height="16" rx="6" fill="url(#neonLaserGrad)" />
        <text x="120" y="73" fontSize="6.5" fill="#070b14" fontWeight="900" textAnchor="middle" letterSpacing="0.5">⚡ AI SYNTH</text>
        
        {/* Bottom Biometric Sensor */}
        <circle cx="120" cy="89" r="4" fill="none" stroke="#00f59b" strokeWidth="1.2" opacity="0.8" />
        <circle cx="120" cy="89" r="1.5" fill="#00d2ff" />
      </g>

      {/* Floating Holographic Flavor Orbs */}
      <g transform="translate(30, 32)" className="anim-diner-float" style={{ animationDelay: '0.4s' }}>
        <circle cx="16" cy="16" r="15" fill="#0f172a" stroke="#00d2ff" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="10" fill="none" stroke="#00f59b" strokeWidth="1" strokeDasharray="3 2" />
        <text x="16" y="20" fontSize="11" textAnchor="middle">🍕</text>
      </g>

      <g transform="translate(178, 32)" className="anim-diner-float" style={{ animationDelay: '0.8s' }}>
        <circle cx="16" cy="16" r="15" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="10" fill="none" stroke="#00d2ff" strokeWidth="1" strokeDasharray="3 2" />
        <text x="16" y="20" fontSize="11" textAnchor="middle">🍜</text>
      </g>

      {/* Holographic Sparkle Stars */}
      <path d="M64 22 L66 26 L70 28 L66 30 L64 34 L62 30 L58 28 L62 26 Z" fill="#00f59b" filter="url(#neonBlur)" opacity="0.8" />
      <path d="M176 86 L178 89 L181 90 L178 91 L176 94 L174 91 L171 90 L174 89 Z" fill="#00d2ff" filter="url(#neonBlur)" opacity="0.8" />
    </svg>
  </div>
);

// 2. Kitchen Operating System & Plasma Reactor SVG
export const KitchenOsSvg = () => (
  <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-[#0d1527] via-[#090e1c] to-[#040711] border border-amber-500/30 p-2 relative overflow-hidden flex items-center justify-center group mb-4 shadow-[0_0_25px_rgba(245,158,11,0.08)]">
    <style>{`
      @keyframes plasmaFlameOscillate {
        0%, 100% { transform: scaleY(1) scaleX(1); }
        50% { transform: scaleY(1.25) scaleX(0.92); }
      }
      @keyframes steamRiseCycle {
        0% { transform: translateY(0px); opacity: 0.8; }
        100% { transform: translateY(-16px); opacity: 0; }
      }
      .anim-plasma-flame { transform-origin: 120px 88px; animation: plasmaFlameOscillate 0.6s ease-in-out infinite alternate; }
      .anim-steam-rise { animation: steamRiseCycle 2s linear infinite; }
    `}</style>

    <svg viewBox="0 0 240 120" className="w-full h-full max-w-[240px]">
      <defs>
        <linearGradient id="plasmaFlameGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ff3366" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#00f59b" />
        </linearGradient>
        <radialGradient id="amberReactorGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Plasma Reactor Glow */}
      <circle cx="120" cy="65" r="50" fill="url(#amberReactorGlow)" />

      {/* Kitchen HUD Status Ring */}
      <circle cx="120" cy="60" r="48" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />

      {/* Animated Rising Cyber Steam */}
      <g stroke="#00f59b" strokeWidth="2" strokeLinecap="round" opacity="0.8" className="anim-steam-rise">
        <path d="M106 48 Q102 36 108 26 T104 14" fill="none" />
        <path d="M120 44 Q126 32 120 22 T124 10" fill="none" style={{ animationDelay: '0.5s' }} />
        <path d="M134 48 Q130 36 136 26 T132 14" fill="none" style={{ animationDelay: '1s' }} />
      </g>

      {/* Plasma Flames */}
      <g className="anim-plasma-flame">
        <path d="M102 88 Q110 66 114 74 Q120 54 126 74 Q130 66 138 88 Z" fill="url(#plasmaFlameGrad)" />
      </g>

      {/* Cyber Induction Wok Pan */}
      <path d="M88 64 C88 92 152 92 152 64 Z" fill="#0f172a" stroke="#00d2ff" strokeWidth="2" />
      <line x1="80" y1="64" x2="88" y2="64" stroke="#ff3366" strokeWidth="4" strokeLinecap="round" />
      <line x1="152" y1="64" x2="160" y2="64" stroke="#ff3366" strokeWidth="4" strokeLinecap="round" />

      {/* Digital HUD Cooking Timer Badge */}
      <g transform="translate(94, 20)">
        <rect x="0" y="0" width="52" height="15" rx="4" fill="#070b14" stroke="#00f59b" strokeWidth="1" />
        <circle cx="8" cy="7.5" r="2.5" fill="#00f59b" />
        <text x="30" y="11" fontSize="7" fill="#00f59b" fontWeight="bold" fontFamily="monospace" textAnchor="middle">READY 98%</text>
      </g>

      {/* Sizzling Particle Sparks */}
      <circle cx="108" cy="56" r="1.5" fill="#ffd166">
        <animate attributeName="cy" values="56;40;56" dur="1s" repeatCount="indefinite" />
        <animate attributeName="cx" values="108;104;108" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="128" cy="54" r="1.5" fill="#00f59b">
        <animate attributeName="cy" values="54;38;54" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="cx" values="128;132;128" dur="1.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  </div>
);

// 3. Cyber Rider & Drone Fleet Telemetry SVG
export const RiderFleetSvg = () => (
  <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-[#0d1527] via-[#090e1c] to-[#040711] border border-cyan-500/30 p-2 relative overflow-hidden flex items-center justify-center group mb-4 shadow-[0_0_25px_rgba(6,182,212,0.08)]">
    <style>{`
      @keyframes cyberDriveGrid {
        0% { transform: translateX(0); }
        100% { transform: translateX(-30px); }
      }
      @keyframes droneHoverCycle {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-5px) rotate(-1deg); }
      }
      @keyframes thrusterGlowPulse {
        0%, 100% { opacity: 0.6; transform: scaleX(1); }
        50% { opacity: 1; transform: scaleX(1.4); }
      }
      .anim-drone-hover { animation: droneHoverCycle 2.4s ease-in-out infinite; }
      .anim-thruster { transform-origin: 86px 62px; animation: thrusterGlowPulse 0.4s ease-in-out infinite alternate; }
      .anim-road-grid { animation: cyberDriveGrid 0.8s linear infinite; }
    `}</style>

    <svg viewBox="0 0 240 120" className="w-full h-full max-w-[240px]">
      <defs>
        <radialGradient id="cyanRadarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00d2ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Radar Pulse Background */}
      <circle cx="190" cy="55" r="35" fill="url(#cyanRadarGlow)" />
      <circle cx="190" cy="55" r="25" fill="none" stroke="#00d2ff" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
      <circle cx="190" cy="55" r="4" fill="#00f59b" />

      {/* Cyber Neon Road Lanes */}
      <line x1="10" y1="92" x2="230" y2="92" stroke="#00d2ff" strokeWidth="2" opacity="0.6" />
      <g className="anim-road-grid">
        <line x1="20" y1="98" x2="45" y2="98" stroke="#00f59b" strokeWidth="2" />
        <line x1="65" y1="98" x2="90" y2="98" stroke="#00f59b" strokeWidth="2" />
        <line x1="110" y1="98" x2="135" y2="98" stroke="#00f59b" strokeWidth="2" />
        <line x1="155" y1="98" x2="180" y2="98" stroke="#00f59b" strokeWidth="2" />
        <line x1="200" y1="98" x2="225" y2="98" stroke="#00f59b" strokeWidth="2" />
        <line x1="245" y1="98" x2="270" y2="98" stroke="#00f59b" strokeWidth="2" />
      </g>

      {/* Cyber Hover-Drone & Smart Delivery Vehicle */}
      <g className="anim-drone-hover">
        {/* Thruster Jet Flame */}
        <polygon points="86,60 62,62 86,64" fill="#00f59b" className="anim-thruster" />
        <polygon points="86,61 70,62 86,63" fill="#00d2ff" />

        {/* Chassis Body */}
        <path d="M88 64 L102 48 L142 48 L156 64 L146 76 L96 76 Z" fill="#0f172a" stroke="#00d2ff" strokeWidth="1.8" />
        
        {/* Cockpit Visor / Glass */}
        <polygon points="106,50 134,50 144,62 100,62" fill="#00f59b" opacity="0.3" stroke="#00f59b" strokeWidth="1" />
        
        {/* Cyber Wheels / Repulsor Discs */}
        <circle cx="102" cy="78" r="10" fill="#070b14" stroke="#00f59b" strokeWidth="2" />
        <circle cx="102" cy="78" r="5" fill="#00d2ff" />
        <circle cx="144" cy="78" r="10" fill="#070b14" stroke="#00f59b" strokeWidth="2" />
        <circle cx="144" cy="78" r="5" fill="#00d2ff" />

        {/* Insulated Food Pod Box */}
        <rect x="88" y="38" width="22" height="18" rx="3" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1.5" />
        <text x="99" y="50" fontSize="7" fill="#8b5cf6" fontWeight="bold" textAnchor="middle">ZAP</text>
        
        {/* Headlight Laser Beam */}
        <polygon points="156,62 205,48 205,74 156,66" fill="#00d2ff" opacity="0.18" />
      </g>

      {/* Target Destination Radar Pin */}
      <g transform="translate(190, 32)">
        <polygon points="0,0 8,18 0,14 -8,18" fill="#ff3366" />
        <circle cx="0" cy="0" r="3" fill="#ffffff" />
      </g>
    </svg>
  </div>
);

// 4. Quantum Analytics & Neural Platform OS SVG
export const AnalyticsOpsSvg = () => (
  <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-[#0d1527] via-[#090e1c] to-[#040711] border border-violet-500/30 p-2 relative overflow-hidden flex items-center justify-center group mb-4 shadow-[0_0_25px_rgba(139,92,246,0.08)]">
    <style>{`
      @keyframes barMatrixOscillate {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(1.3); }
      }
      .anim-bar-1 { transform-origin: 70px 90px; animation: barMatrixOscillate 1.8s ease-in-out infinite; }
      .anim-bar-2 { transform-origin: 95px 90px; animation: barMatrixOscillate 2.2s ease-in-out infinite 0.3s; }
      .anim-bar-3 { transform-origin: 120px 90px; animation: barMatrixOscillate 1.6s ease-in-out infinite 0.6s; }
      .anim-bar-4 { transform-origin: 145px 90px; animation: barMatrixOscillate 2s ease-in-out infinite 0.9s; }
      .anim-bar-5 { transform-origin: 170px 90px; animation: barMatrixOscillate 1.7s ease-in-out infinite 1.2s; }
    `}</style>

    <svg viewBox="0 0 240 120" className="w-full h-full max-w-[240px]">
      <defs>
        <linearGradient id="barNeonGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00f59b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="barNeonGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00d2ff" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="barNeonGrad3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Grid Lines */}
      <line x1="40" y1="30" x2="200" y2="30" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="40" y1="60" x2="200" y2="60" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="40" y1="90" x2="200" y2="90" stroke="#334155" strokeWidth="1.5" />

      {/* 3D Isometric Neon Bars */}
      <rect x="62" y="55" width="16" height="35" rx="3" fill="url(#barNeonGrad1)" stroke="#00f59b" strokeWidth="1" className="anim-bar-1" />
      <rect x="87" y="42" width="16" height="48" rx="3" fill="url(#barNeonGrad2)" stroke="#00d2ff" strokeWidth="1" className="anim-bar-2" />
      <rect x="112" y="28" width="16" height="62" rx="3" fill="url(#barNeonGrad3)" stroke="#8b5cf6" strokeWidth="1" className="anim-bar-3" />
      <rect x="137" y="46" width="16" height="44" rx="3" fill="url(#barNeonGrad1)" stroke="#00f59b" strokeWidth="1" className="anim-bar-4" />
      <rect x="162" y="34" width="16" height="56" rx="3" fill="url(#barNeonGrad2)" stroke="#00d2ff" strokeWidth="1" className="anim-bar-5" />

      {/* Growth Trend Vector Curve */}
      <path d="M50 82 Q85 68 112 36 T180 24" fill="none" stroke="#00f59b" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="180" cy="24" r="4" fill="#00f59b" />
      <circle cx="180" cy="24" r="8" fill="none" stroke="#00f59b" strokeWidth="1" opacity="0.6">
        <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Metric Badge */}
      <g transform="translate(142, 10)">
        <rect x="0" y="0" width="56" height="14" rx="4" fill="#070b14" stroke="#00f59b" strokeWidth="1" />
        <text x="28" y="10" fontSize="7.5" fill="#00f59b" fontWeight="900" fontFamily="monospace" textAnchor="middle">▲ 99.4% SLA</text>
      </g>
    </svg>
  </div>
);
