import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Bot, 
  ChevronDown, 
  UtensilsCrossed, 
  Truck, 
  BarChart3, 
  UserCheck, 
  Zap,
  Sparkles,
  Compass,
  LogIn,
  LogOut,
  Home,
  ShieldCheck
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
    setIsLandingPageOpen,
    orders 
  } = useApp();

  const totalCartItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  // Role-based visibility logic:
  // If logged in as customer, hide kitchen, delivery, admin pills unless admin or logged out/demo mode!
  const isCustomerRole = user?.role === 'customer';
  const isAdminRole = user?.role === 'admin' || !user;

  return (
    <header className="sticky top-0 z-40 bg-[#0b1329]/95 backdrop-blur-xl text-white border-b border-slate-700/80 shadow-2xl">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-[11px] font-bold px-4 py-1 text-center text-white flex items-center justify-center gap-2 shadow-inner">
        <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
        <span>ZapBite.ai Next-Gen Food & Delivery Platform Engine</span>
        <span className="bg-black/40 border border-white/20 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider text-cyan-300">
          {user ? `Logged in: ${user.role.toUpperCase()}` : 'Live Multi-Role Sync'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand */}
          <div className="flex items-center gap-5">
            <div 
              onClick={() => setIsLandingPageOpen(true)}
              className="flex items-center gap-3 cursor-pointer group"
              title="Return to Welcome Landing Page"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0b1329] rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-rose-400 fill-rose-400 group-hover:text-cyan-300 transition-colors" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-white font-sans">
                    Zap<span className="bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">Bite</span>
                  </span>
                  <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-[0_0_10px_rgba(0,245,212,0.2)]">
                    .AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium tracking-wide">Next-Gen Food & Delivery OS</p>
              </div>
            </div>

            {/* Location Selector (Customer Only) */}
            {currentRole === 'customer' && (
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-200 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-700 hover:border-cyan-500/50 cursor-pointer transition-all shadow-inner">
                <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-spin-slow" />
                <span className="font-bold text-white">MVP Colony</span>
                <span className="text-slate-400">| Vizag</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            )}
          </div>

          {/* Role Navigation Pills - Filtered strictly by logged in user role! */}
          <div className="hidden lg:flex items-center bg-[#070d1e] p-1.5 rounded-2xl border border-slate-700/80 shadow-inner gap-1">
            
            {/* Customer Tab */}
            {(isCustomerRole || isAdminRole || currentRole === 'customer') && (
              <button
                onClick={() => setCurrentRole('customer')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentRole === 'customer'
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/30 font-extrabold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Customer Portal
              </button>
            )}

            {/* Kitchen Hub Tab (Only if Kitchen Staff or Admin/Demo mode) */}
            {(!isCustomerRole || isAdminRole) && (
              <button
                onClick={() => setCurrentRole('restaurant')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentRole === 'restaurant'
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/30 font-extrabold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                Kitchen Hub
                {orders.filter(o => o.status === 'Placed' || o.status === 'Preparing').length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </button>
            )}

            {/* Delivery Fleet Tab (Only if Rider or Admin/Demo mode) */}
            {(!isCustomerRole || isAdminRole) && (
              <button
                onClick={() => setCurrentRole('delivery')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentRole === 'delivery'
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/30 font-extrabold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                Delivery Fleet
              </button>
            )}

            {/* Admin Intelligence Tab (Only if Admin or Demo mode) */}
            {(!isCustomerRole || isAdminRole) && (
              <button
                onClick={() => setCurrentRole('admin')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentRole === 'admin'
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/30 font-extrabold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Admin Intelligence
              </button>
            )}
          </div>

          {/* Action Buttons & User Profile / Logout */}
          <div className="flex items-center gap-2">
            
            {/* Overview / Landing Page Toggle Button */}
            <button
              onClick={() => setIsLandingPageOpen(true)}
              className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              title="Overview Landing Page"
            >
              <Home className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden xl:inline">About</span>
            </button>

            {/* User Profile / Switch Account Button */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              title="Switch Account / Open Login Modal"
            >
              {user ? (
                <>
                  <img src={user.avatar} alt="avatar" className="w-5 h-5 rounded-full object-cover border border-rose-500" />
                  <span className="hidden sm:inline max-w-[90px] truncate font-extrabold">{user.name.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Sign In</span>
                </>
              )}
            </button>

            {/* Logout Button */}
            {user && (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 bg-red-950/80 hover:bg-red-900/90 text-red-200 border border-red-500/50 px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shadow"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden md:inline">Logout</span>
              </button>
            )}

            {/* ZapBot AI Launcher */}
            <button
              onClick={() => setIsBiteBotOpen(!isBiteBotOpen)}
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                isBiteBotOpen
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-900 text-cyan-300 border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/60'
              }`}
            >
              <Bot className="w-4 h-4 text-cyan-300 animate-bounce" />
              <span className="hidden sm:inline">ZapBot AI</span>
            </button>

            {/* Customer Cart Button */}
            {currentRole === 'customer' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-purple-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-rose-500/25 active:scale-95 transition-all border border-rose-400/30"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {totalCartItems > 0 && (
                  <span className="bg-white text-rose-600 font-black text-[11px] px-1.5 py-0.2 rounded-full min-w-[20px] text-center shadow">
                    {totalCartItems}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Role Switcher Bar */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-800 gap-1 text-[11px]">
          <button
            onClick={() => setCurrentRole('customer')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center font-bold ${
              currentRole === 'customer' ? 'bg-rose-600 text-white shadow' : 'text-slate-300'
            }`}
          >
            Customer
          </button>
          
          {(!isCustomerRole || isAdminRole) && (
            <>
              <button
                onClick={() => setCurrentRole('restaurant')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-center font-bold ${
                  currentRole === 'restaurant' ? 'bg-rose-600 text-white shadow' : 'text-slate-300'
                }`}
              >
                Kitchen
              </button>
              <button
                onClick={() => setCurrentRole('delivery')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-center font-bold ${
                  currentRole === 'delivery' ? 'bg-rose-600 text-white shadow' : 'text-slate-300'
                }`}
              >
                Rider
              </button>
              <button
                onClick={() => setCurrentRole('admin')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-center font-bold ${
                  currentRole === 'admin' ? 'bg-rose-600 text-white shadow' : 'text-slate-300'
                }`}
              >
                Admin
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
