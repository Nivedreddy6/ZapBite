import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { BiteBotChatbot } from './components/BiteBotChatbot';
import { CustomerView } from './components/CustomerView';
import { OrderTracker } from './components/OrderTracker';
import { RestaurantView } from './components/RestaurantView';
import { DeliveryView } from './components/DeliveryView';
import { AdminView } from './components/AdminView';
import { LoginPage } from './components/LoginPage';
import { CartDrawer } from './components/CartDrawer';
import { UserProfileModal } from './components/UserProfileModal';

import { Utensils, MapPin, CheckCircle2, AlertCircle, X, ShieldAlert, Sparkles, Activity } from 'lucide-react';

const MainAppContent = () => {
  const { 
    currentRole, 
    notification, 
    activeTrackingOrderId, 
    isLoginModalOpen, 
    setIsLoginModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isLandingPageOpen,
    setIsLandingPageOpen,
    customerSubTab,
    setCustomerSubTab
  } = useApp();

  if (isLandingPageOpen) {
    return (
      <>
        <LandingPage onGetStarted={() => setIsLandingPageOpen(false)} />

        {/* Login Modal on top of Landing Page */}
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#070b14]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
            <div className="relative w-full max-w-md my-auto">
              <LoginPage 
                onClose={() => setIsLoginModalOpen(false)}
                onLoginSuccess={() => {
                  setIsLoginModalOpen(false);
                  setIsLandingPageOpen(false);
                }} 
              />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Top Sticky Cyber Navbar */}
      <Navbar />

      {/* Global Cyber Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.6)] border text-xs font-black flex items-center gap-2.5 backdrop-blur-xl ${
            notification.type === 'error'
              ? 'bg-rose-950/90 text-rose-300 border-rose-500/50 shadow-rose-900/30'
              : 'bg-[#0d1f19]/90 text-emerald-300 border-emerald-500/50 shadow-emerald-900/30'
          }`}>
            {notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
            )}
            <span className="tracking-wide">{notification.msg}</span>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#070b14]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 z-20 text-slate-400 hover:text-emerald-400 bg-slate-900/80 p-1.5 rounded-full border border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <LoginPage onLoginSuccess={() => setIsLoginModalOpen(false)} />
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Role View Main Content */}
      <main className="flex-1">
        {currentRole === 'customer' && (
          <div>
            {/* Customer Futuristic HUD Sub-Nav Tabs */}
            <div className="bg-[#0b1120]/90 border-b border-slate-800/80 px-4 py-3 shadow-lg sticky top-16 z-30 backdrop-blur-md">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex bg-[#111c33] p-1 rounded-2xl border border-slate-700/60 text-xs font-black">
                  <button
                    onClick={() => setCustomerSubTab('menu')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      customerSubTab === 'menu'
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,245,155,0.4)] font-black'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" /> ZapBite Menu & Hub
                  </button>

                  <button
                    onClick={() => setCustomerSubTab('track')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      customerSubTab === 'track'
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,245,155,0.4)] font-black'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-300 animate-pulse" /> Live Telemetry Tracker
                  </button>
                </div>

                <div className="hidden md:flex items-center gap-3 bg-[#111c33]/70 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    LIVE TELEMETRY
                  </span>
                  <span>|</span>
                  <span>Active Order: <span className="font-mono text-cyan-300 font-black">{activeTrackingOrderId || 'None'}</span></span>
                </div>
              </div>
            </div>

            {customerSubTab === 'menu' ? <CustomerView /> : <OrderTracker />}
          </div>
        )}

        {currentRole === 'restaurant' && <RestaurantView />}
        {currentRole === 'delivery' && <DeliveryView />}
        {currentRole === 'admin' && <AdminView />}
      </main>

      {/* BiteBot AI Floating Concierge */}
      <BiteBotChatbot />

      {/* Quantum Cart Drawer */}
      <CartDrawer />

      {/* Footer */}
      <footer className="bg-[#040711] border-t border-slate-800/80 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-black text-slate-200 tracking-wider">⚡ ZAPBITE AI</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">v3.0 ECOSYSTEM</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Next-Gen Autonomous Culinary Dispatch & AI Payment Matrix
          </p>
          <p className="text-[10px] text-slate-400 font-mono">256-BIT ENCRYPTED • ZERO LATENCY</p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
