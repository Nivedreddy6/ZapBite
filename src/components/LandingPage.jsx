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
  CheckCircle2
} from 'lucide-react';

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
      role: 'Food Enthusiast • MVP Colony',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      rating: 5,
      orderedItem: 'Hyderabadi Dum Biryani',
      comment: 'Fastest food delivery in Vizag! My biryani arrived steaming hot in just 18 minutes. ZapBot AI suggested the exact spicy level I wanted!'
    },
    {
      id: 2,
      name: 'David Miller',
      role: 'Tech Executive & Foodie',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      rating: 5,
      orderedItem: 'Double Truffle Burger Feast',
      comment: 'ZapPay AI automatically applied the ZAPBITE50 code saving me ₹100 instantly! The live map tracking is insanely accurate.'
    },
    {
      id: 3,
      name: 'Priya & Arjun V.',
      role: 'Weekend Gourmet Diners',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      rating: 5,
      orderedItem: 'Woodfired Pizza Combo',
      comment: 'The multi-role portal is amazing. I can watch the kitchen accept my order, track the rider live on the HUD map, and enjoy fresh food!'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-900 font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-3.5 py-1.5 rounded-full border border-orange-200 text-xs font-extrabold shadow-xs">
                <Sparkles className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                <span>ZapBite.ai — Smart Food & Delivery OS</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Ultra-Fast Food Delivery Powered by <span className="bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">ZapBite AI</span>
              </h1>

              <p className="text-base text-slate-600 font-medium leading-relaxed max-w-xl">
                Experience next-generation dining with real-time multi-role logistics tracking, BiteBot AI natural language concierge, and automated ZapPay promo savings.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => handleRoleLaunch('customer')}
                  className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-orange-600 text-white font-extrabold text-sm px-6 py-4 rounded-2xl shadow-md shadow-orange-500/20 flex items-center gap-2 active:scale-95 transition-all"
                >
                  Explore Customer App
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex items-center gap-6 text-xs text-slate-600 border-t border-slate-200/60">
                <div className="flex items-center gap-1.5 font-bold">
                  <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified 25 Min SLA</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>4.9 Rated Fleet</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <Cpu className="w-4 h-4 text-rose-500" />
                  <span>ZapBite Neural Engine</span>
                </div>
              </div>
            </div>

            {/* Right Graphic Banner */}
            <div className="relative flex justify-center">
              <AnimatedFoodBanner />
            </div>

          </div>

        </div>
      </section>

      {/* Clean Informative Platform Overview Section */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How ZapBite.ai Powers Ultra-Fast Delivery
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              An end-to-end intelligent ecosystem connecting diners, kitchens, riders, and platform logistics in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature Card 1 */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    Diner Experience
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900">
                  Customer Ordering & AI Concierge
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  Rich menu discovery with intelligent recommendation engine and live delivery telemetry tracking.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>ZapBot AI search & dietary filters</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Live HUD map vector tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Automated ZapPay promo savings</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                    Kitchen Display
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900">
                  Kitchen Operating System
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  Automated kitchen queue management system for restaurant chefs to prepare orders instantly.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Real-time order queue alerts</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cooking & dispatch workflow</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant stock inventory toggle</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Smart Logistics
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900">
                  Rider Fleet Dispatch
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  Optimized rider routing and active order assignments ensuring 25-minute SLA delivery times.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>GPS route vector navigation</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Rider availability status management</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Express pickup to doorstep handoff</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Platform Intelligence
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900">
                  Analytics & Operations
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  Centralized platform monitoring for revenue tracking, peak hour load management, and fleet logs.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Real-time revenue monitoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Peak hour Chart.js analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Persistent database audit trail</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Loved by Diners & Foodies</h2>
            <p className="text-slate-600 text-sm mt-2 font-medium">See what our customers say about ZapBite.ai</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {happyCustomers.map((cust) => (
              <div key={cust.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(cust.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] bg-orange-50 text-orange-700 border border-orange-200 font-extrabold px-2.5 py-0.5 rounded-full">
                      {cust.orderedItem}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium italic">"{cust.comment}"</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                  <img src={cust.image} alt={cust.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs" />
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">{cust.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{cust.role}</p>
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
