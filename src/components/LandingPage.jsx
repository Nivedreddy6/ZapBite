import React from 'react';
import { useApp } from '../context/AppContext';
import { AnimatedFoodBanner } from './AnimatedFoodBanner';
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Cpu, 
  Utensils, 
  Truck, 
  BarChart3, 
  BadgeCheck, 
  CheckCircle2,
  Radio,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { 
  DinerExperienceSvg, 
  KitchenOsSvg, 
  RiderFleetSvg, 
  AnalyticsOpsSvg 
} from './EcosystemSvgAnimations';

export const LandingPage = ({ onGetStarted }) => {
  const { setCurrentRole } = useApp();

  const handleRoleLaunch = (roleKey) => {
    setCurrentRole(roleKey);
    if (onGetStarted) onGetStarted();
  };

  const happyCustomers = [
    {
      id: 1,
      name: 'Ananya Sharma',
      role: 'Culinary Enthusiast • Sector 4 Node',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      rating: 5,
      orderedItem: 'Hyderabadi Dum Biryani Reactor',
      comment: 'Steaming hot dum biryani reached my pod in 17 minutes! The BiteBot AI neural concierge recommended the exact spice calibration.'
    },
    {
      id: 2,
      name: 'David Miller',
      role: 'Tech Lead & Cyber Gourmet',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      rating: 5,
      orderedItem: 'Double Truffle Burger Capsule',
      comment: 'ZapPay AI vault applied the ZAPBITE50 promo instantly with biometric verification! Live satellite telemetry tracking is mind-blowing.'
    },
    {
      id: 3,
      name: 'Priya & Arjun V.',
      role: 'Gourmet Diners',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      rating: 5,
      orderedItem: 'Woodfired Matrix Pizza',
      comment: 'Multi-role portal transparency is incredible. Watching the kitchen reactor prepare food, tracking the drone fleet, and savoring fresh meals!'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        
        {/* Background Glowing Ambient Orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-[#0d1f19] text-emerald-300 px-3.5 py-1.5 rounded-full border border-emerald-500/40 text-xs font-mono font-black shadow-[0_0_15px_rgba(0,245,155,0.2)]">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>ZAPBITE AI 3.0 • ULTRA-FAST FOOD DELIVERY</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
                Smart Food Ordering & Lightning Delivery by <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">ZapBite</span>
              </h1>

              <p className="text-base text-slate-300 font-normal leading-relaxed max-w-xl">
                Experience next-generation culinary intelligence with real-time multi-role logistics tracking, BiteBot conversational AI concierge, and automated ZapPay algorithmic promo savings.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => handleRoleLaunch('customer')}
                  className="bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 hover:from-emerald-400 hover:to-indigo-400 text-slate-950 font-black text-sm px-7 py-4 rounded-2xl shadow-[0_0_25px_rgba(0,245,155,0.4)] flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  Order Food Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-800">
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  <span>25 Min Fast Delivery</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>4.92 / 5.0 Rating</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>ZapBite AI Engine</span>
                </div>
              </div>
            </div>

            {/* Right Graphic Holographic Banner */}
            <div className="relative flex justify-center">
              <AnimatedFoodBanner />
            </div>

          </div>

        </div>
      </section>

      {/* Cyber Platform Ecosystem Section */}
      <section className="py-20 bg-[#040711] border-y border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase">
              ⚡ COMPLETE FOOD DELIVERY ECOSYSTEM
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              How ZapBite Delivers Delicious Food in Minutes
            </h2>
            <p className="text-slate-400 text-sm font-normal">
              A seamlessly connected platform bringing hungry diners, master kitchens, speedy delivery riders, and smart system management together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature Card 1: Diner */}
            <div className="bg-[#0d1527]/80 rounded-3xl p-6 border border-emerald-500/20 shadow-xl space-y-4 flex flex-col justify-between backdrop-blur-md hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(0,245,155,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-[0_0_12px_rgba(0,245,155,0.2)]">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    Diner Node
                  </span>
                </div>
                <DinerExperienceSvg />
                <h3 className="text-lg font-black text-white">
                  Customer Hub & AI Concierge
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Natural language craving synthesis with automated ZapPay discount algorithms and live telemetry HUD.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>BiteBot AI recommendation engine</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Live satellite HUD vector telemetry</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>ZapPay AI instant promo vault</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 2: Kitchen */}
            <div className="bg-[#0d1527]/80 rounded-3xl p-6 border border-amber-500/20 shadow-xl space-y-4 flex flex-col justify-between backdrop-blur-md hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">
                    Kitchen OS
                  </span>
                </div>
                <KitchenOsSvg />
                <h3 className="text-lg font-black text-white">
                  Kitchen Reactor System
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Real-time kitchen order queue management with digital timers and automated cooking state pipelines.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Live order queue acoustic alerts</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Stage-by-stage preparation timers</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Instant dish stock inventory toggle</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 3: Logistics */}
            <div className="bg-[#0d1527]/80 rounded-3xl p-6 border border-cyan-500/20 shadow-xl space-y-4 flex flex-col justify-between backdrop-blur-md hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    Fleet Dispatch
                  </span>
                </div>
                <RiderFleetSvg />
                <h3 className="text-lg font-black text-white">
                  Rider Fleet Dispatch HUD
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Optimized waypoint routing and active order assignments ensuring 25-minute SLA delivery times.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>GPS route vector navigation</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Rider availability telemetry toggle</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Express pickup to doorstep handoff</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 4: Analytics */}
            <div className="bg-[#0d1527]/80 rounded-3xl p-6 border border-violet-500/20 shadow-xl space-y-4 flex flex-col justify-between backdrop-blur-md hover:border-violet-500/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-violet-950/80 border border-violet-500/40 text-violet-400 flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.2)]">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-500/40">
                    Intelligence
                  </span>
                </div>
                <AnalyticsOpsSvg />
                <h3 className="text-lg font-black text-white">
                  Quantum Analytics Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Centralized platform monitoring for revenue streaming, peak hour load balancing, and fleet telemetry logs.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>Real-time revenue telemetry</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>Peak hour Chart.js analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>Persistent database audit trail</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Customer Testimonials in Cyber Cards */}
      <section className="py-20 bg-[#070b14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-white tracking-tight">Verified Diner Testimonials</h2>
            <p className="text-slate-400 text-sm mt-2">Diners across the network sharing their ZapBite experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {happyCustomers.map((cust) => (
              <div key={cust.id} className="bg-[#0d1527]/80 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(cust.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] bg-[#111c33] text-emerald-300 border border-emerald-500/40 font-mono font-bold px-2.5 py-0.5 rounded-full">
                      {cust.orderedItem}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">"{cust.comment}"</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-3">
                  <img src={cust.image} alt={cust.name} className="w-10 h-10 rounded-full object-cover border border-emerald-400 shadow-xs" />
                  <div>
                    <h4 className="font-bold text-xs text-white">{cust.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{cust.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
