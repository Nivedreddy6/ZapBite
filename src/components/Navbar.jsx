import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LocationPickerModal } from './LocationPickerModal';
import { 
  ShoppingBag, 
  ChevronDown, 
  Zap,
  Sparkles,
  LogIn,
  LogOut,
  Home,
  MapPin,
  Bot,
  Layers,
  Radio
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    user,
    logout,
    cart, 
    setIsCartOpen, 
    isBiteBotOpen, 
    setIsBiteBotOpen,
    setIsLoginModalOpen,
    setIsProfileModalOpen,
    setIsLandingPageOpen,
    orders,
    selectedLocation
  } = useApp();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const totalCartItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-xl text-slate-100 border-b border-emerald-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo & Cyber Branding */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div 
                onClick={() => setIsLandingPageOpen(true)}
                className="flex items-center gap-2.5 cursor-pointer group"
                title="Return to Welcome Landing Page"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-400 to-indigo-500 p-0.5 shadow-[0_0_15px_rgba(0,245,155,0.4)] group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
                    <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400 group-hover:text-cyan-300 transition-colors animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-black tracking-tight text-white font-sans">
                      Zap<span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">Bite</span>
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                      AI 3.0
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wide">Smart Food & AI Logistics</p>
                </div>
              </div>

              {/* Holographic GPS Location Trigger */}
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="hidden md:flex items-center gap-2 text-xs text-slate-200 bg-[#111c33]/80 hover:bg-[#162544] px-3.5 py-2 rounded-xl border border-emerald-500/30 hover:border-emerald-400 transition-all font-bold group cursor-pointer shadow-[0_0_12px_rgba(0,245,155,0.1)]"
                title="Change GPS Coordinates (Live Satellite HUD)"
              >
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <span className="font-extrabold text-white truncate max-w-[130px] sm:max-w-[190px]">
                  {selectedLocation?.area || 'Sector 4 Radar'}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">| {selectedLocation?.city || 'Vizag'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Tactical Role Switcher Terminal */}
            <div className="hidden lg:flex items-center bg-[#0d1527] p-1 rounded-2xl border border-slate-700/80 shadow-inner">
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="bg-[#131e36] text-emerald-300 text-xs font-black px-3.5 py-2 rounded-xl border border-emerald-500/30 focus:outline-none focus:border-emerald-400 cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              >
                <option value="customer">🍽️ Customer Hub & Synthesis</option>
                <option value="restaurant">👨‍🍳 Kitchen OS & Reactor ({orders.filter(o => o.status === 'Placed' || o.status === 'Preparing').length} Live)</option>
                <option value="delivery">🛵 Rider Drone Fleet HUD</option>
                <option value="admin">📊 ZapBite Analytics Matrix</option>
              </select>
            </div>

            {/* Action Launchers & Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Landing Page Showcase Trigger */}
              <button
                onClick={() => setIsLandingPageOpen(true)}
                className="bg-[#111c33] hover:bg-[#192b4f] text-slate-300 hover:text-white border border-slate-700/80 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                title="System Overview & Landing"
              >
                <Home className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline">Overview</span>
              </button>

              {/* User Profile / Access Authentication */}
              <button
                onClick={() => {
                  if (user) {
                    setIsProfileModalOpen(true);
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }}
                className="flex items-center gap-2 bg-[#111c33] hover:bg-[#192b4f] text-slate-200 border border-slate-700/80 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                title={user ? "ZapBite User Profile" : "Authenticate Identity"}
              >
                {user ? (
                  <>
                    <img src={user.avatar} alt="avatar" className="w-5 h-5 rounded-full object-cover border border-emerald-400" />
                    <span className="hidden sm:inline max-w-[90px] truncate font-extrabold text-emerald-300">{user.name.split(' ')[0]}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Sign In</span>
                  </>
                )}
              </button>

              {/* Logout Button */}
              {user && (
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 bg-rose-950/80 hover:bg-rose-900/90 text-rose-300 border border-rose-800/80 px-2.5 py-2 rounded-xl text-xs font-bold transition-all"
                  title="Disconnect Node"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden md:inline">Exit</span>
                </button>
              )}

              {/* BiteBot AI Quantum Concierge Trigger */}
              <button
                onClick={() => setIsBiteBotOpen(!isBiteBotOpen)}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-slate-950 border border-emerald-400/50 px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,245,155,0.35)] transition-all active:scale-95 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>BiteBot AI</span>
              </button>

              {/* Quantum Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border border-cyan-400/40 px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-95 ml-0.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden xs:inline">Vault</span>

                {totalCartItems > 0 && (
                  <span className="bg-emerald-400 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-emerald-200 animate-pulse">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>

      </header>

      {/* GPS Map Location Modal */}
      <LocationPickerModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
      />
    </>
  );
};
