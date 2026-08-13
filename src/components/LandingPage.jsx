import React from 'react';
import { useApp } from '../context/AppContext';
import { AnimatedFoodBanner } from './AnimatedFoodBanner';
import { AnimatedDeliveryIcon } from './AnimatedDeliveryIcon';
import { 
  Zap, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  ShieldCheck, 
  Star,
  CheckCircle2,
  Cpu,
  Bot,
  Heart,
  Quote,
  Clock,
  MapPin,
  Utensils,
  Truck,
  BarChart3,
  Phone,
  Mail,
  Award,
  BadgeCheck
} from 'lucide-react';

export const LandingPage = ({ onGetStarted }) => {
  const { setCurrentRole, setIsLoginModalOpen } = useApp();

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
      orderedItem: 'Woodfired Pepperoni Pizza',
      comment: 'Insulated thermal delivery is real! Crust was perfectly crispy as if eaten straight from the woodfired oven. 10/10 service!'
    },
    {
      id: 4,
      name: 'Dr. K. Rajesh',
      role: 'Healthcare Professional',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      rating: 5,
      orderedItem: 'Avocado Quinoa Power Salad',
      comment: 'Loved the Pure Veg filter toggle and calorie count breakdown. Perfect healthy option after long hospital shifts.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1329] via-[#0f172a] to-[#1e1b4b] text-slate-100 selection:bg-rose-500 selection:text-white flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-rose-600/20 rounded-full filter blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-[140px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/15 rounded-full filter blur-[180px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Sticky Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex items-center justify-between relative z-10 border-b border-slate-800/80">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => handleRoleLaunch('customer')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform duration-300">
            <div className="w-full h-full bg-[#0b1329] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-rose-400 fill-rose-400 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-white font-sans">
                Zap<span className="bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">Bite</span>
              </span>
              <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider animate-bounce">
                .AI
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium">Next-Gen Food Ordering & Delivery OS</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleRoleLaunch('customer')}
            className="hidden sm:flex bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-extrabold px-4.5 py-2.5 rounded-xl text-xs shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95 border border-rose-400/30"
          >
            Explore Menu & Order
          </button>

          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all hover:border-cyan-400 hover:scale-105 active:scale-95"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Role Sign In Portal</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-16 flex-1">
        
        {/* Section 1: Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in-up">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight font-sans">
              Ultra-Fast Food Delivery <br />
              <span className="bg-gradient-to-r from-rose-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent animate-neon-glow">
                Powered by ZapBot AI & Smart Dispatch Engine
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              Welcome to <span className="font-extrabold text-white">ZapBite.ai</span> — experience 20-minute SLA food delivery with real-time kitchen Kanban dispatch, thermal rider fleet tracking, and automated promo discounts!
            </p>

            {/* Launch Role Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => handleRoleLaunch('customer')}
                className="bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-purple-700 text-white font-black px-7 py-4 rounded-2xl shadow-xl shadow-rose-500/30 flex items-center gap-2.5 text-sm transition-all hover:scale-105 active:scale-95 border border-rose-400/40"
              >
                <span>Launch Customer Platform</span>
                <ArrowRight className="w-4 h-4 animate-pulse" />
              </button>

              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 font-extrabold px-6 py-4 rounded-2xl text-sm transition-all hover:border-cyan-400 hover:scale-105 active:scale-95"
              >
                <Lock className="w-4 h-4 text-cyan-300" />
                <span>Choose Role Sign In</span>
              </button>
            </div>
          </div>

          {/* SVG Animated Hero Banner */}
          <div className="lg:col-span-5 relative bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 shadow-2xl shadow-rose-950/40 space-y-4 animate-float-delayed hover:border-rose-500/50 transition-all backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-300 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
                <span>ZapBite Live Dispatch Wok</span>
              </div>
              <span className="bg-emerald-950 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                Live 20-25 Mins SLA
              </span>
            </div>

            <AnimatedFoodBanner />

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <AnimatedDeliveryIcon />
                <div>
                  <div className="font-extrabold text-white">4.9★ Fleet Riders</div>
                  <div className="text-[10px] text-slate-400">Insulated thermal dispatch</div>
                </div>
              </div>
              <span className="text-rose-300 font-extrabold bg-rose-500/15 px-2.5 py-1 rounded-xl border border-rose-500/40 shadow">
                100% Fresh
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: About ZapBite.ai Platform */}
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-700/80 shadow-2xl space-y-8 animate-fade-in-up backdrop-blur-xl">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-cyan-300 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
              <Award className="w-3.5 h-3.5 text-cyan-300 animate-spin-slow" />
              About ZapBite.ai Technology
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Why Foodies & Kitchens Choose ZapBite.ai
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Built with modern React state sync, AI concierges, and instant rider routing matrix for ultimate culinary freshness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-rose-500/50 transition-all hover:-translate-y-1 duration-300 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-extrabold text-base text-white">20-25 Mins Express SLA</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Automated order routing directly matches nearby available delivery partners the instant kitchen staff marks dishes ready.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-purple-500/50 transition-all hover:-translate-y-1 duration-300 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Bot className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="font-extrabold text-base text-white">ZapBot AI Concierge</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Find dishes by diet, budget, or mood using natural language queries. Add recommended dishes directly to cart inside chat.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-cyan-500/50 transition-all hover:-translate-y-1 duration-300 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-extrabold text-base text-white">ZapPay Fraud Shield</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Auto-applies best promotional codes (ZAPBITE50), generates dynamic UPI QR codes, and ensures 99.8% safe checkout.
              </p>
            </div>

          </div>
        </div>

        {/* Section 3: Happy Customers & Verified 5-Star Reviews */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              <Heart className="w-3.5 h-3.5 fill-amber-400 animate-ping" />
              Customer Love & Testimonials
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Happy Foodies Loving ZapBite.ai
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Over 50,000+ satisfied food lovers across Vizag & MVP Colony rating us 4.9/5 stars!
            </p>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {happyCustomers.map((cust) => (
              <div
                key={cust.id}
                className="bg-slate-900/90 rounded-3xl p-5 border border-slate-700/80 flex flex-col justify-between shadow-xl hover:border-rose-500/50 transition-all duration-300 hover:-translate-y-2 group backdrop-blur-xl"
              >
                <div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(cust.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-slate-200 leading-relaxed italic relative font-medium">
                    <Quote className="w-6 h-6 text-slate-800 absolute -top-2 -left-2 -z-10" />
                    "{cust.comment}"
                  </p>

                  <div className="mt-3 inline-block bg-rose-500/15 text-rose-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-rose-500/30">
                    Ordered: {cust.orderedItem}
                  </div>
                </div>

                {/* Customer Photo Profile */}
                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-3">
                  <img
                    src={cust.image}
                    alt={cust.name}
                    className="w-11 h-11 rounded-2xl object-cover border-2 border-rose-500/50 shadow-md group-hover:scale-110 transition-transform duration-300"
                  />
                  <div>
                    <h4 className="font-extrabold text-xs text-white flex items-center gap-1">
                      {cust.name}
                      <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    </h4>
                    <p className="text-[10px] text-slate-400">{cust.role}</p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Comprehensive Professional Footer */}
      <footer className="bg-[#090d1a] border-t border-slate-800/80 pt-12 pb-8 text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Column 1: Brand & Tagline */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-rose-500/30">
                  <div className="w-full h-full bg-[#0b1329] rounded-[10px] flex items-center justify-center">
                    <Zap className="w-4 h-4 text-rose-400 fill-rose-400" />
                  </div>
                </div>
                <span className="text-xl font-black text-white tracking-tight">
                  Zap<span className="bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">Bite</span>.ai
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px] max-w-sm font-medium">
                ZapBite.ai is an ultra-fast food delivery operating system connecting hungry foodies with top culinary partner kitchens & thermal rider fleets.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Live Multi-Role Order Engine Connected
                </span>
              </div>
            </div>

            {/* Column 2: System Roles */}
            <div className="space-y-2.5">
              <h4 className="font-extrabold text-white uppercase text-[11px] tracking-wider text-rose-400">System Role Portals</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button onClick={() => handleRoleLaunch('customer')} className="hover:text-rose-400 transition-colors">
                    👤 Customer Ordering Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => handleRoleLaunch('restaurant')} className="hover:text-purple-400 transition-colors">
                    👨‍🍳 Kitchen Staff Hub
                  </button>
                </li>
                <li>
                  <button onClick={() => handleRoleLaunch('delivery')} className="hover:text-cyan-400 transition-colors">
                    🛵 Delivery Fleet Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => handleRoleLaunch('admin')} className="hover:text-amber-400 transition-colors">
                    📊 Admin Intelligence Dashboard
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: AI & Payment Engine */}
            <div className="space-y-2.5">
              <h4 className="font-extrabold text-white uppercase text-[11px] tracking-wider text-cyan-400">AI & Payment Engine</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li className="flex items-center gap-1.5">
                  <Bot className="w-3 h-3 text-cyan-400" />
                  <span>ZapBot AI Concierge</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-rose-400" />
                  <span>ZapPay Fraud Shield</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-purple-400" />
                  <span>Dynamic UPI QR Generator</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-emerald-400" />
                  <span>Smart Logistics Order Engine</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Location */}
            <div className="space-y-2.5">
              <h4 className="font-extrabold text-white uppercase text-[11px] tracking-wider text-purple-400">Support & Location</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>MVP Colony, Beach Road, Vizag</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>support@zapbite.ai</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>+91 1800-ZAPBITE (24/7)</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
            <p className="font-bold text-slate-300">
              © 2026 ZapBite.ai Platform • All Rights Reserved
            </p>

            <div className="flex items-center gap-4 text-slate-300">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>20-25 Mins SLA Guarantee</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
