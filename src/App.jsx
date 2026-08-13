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
import { Utensils, MapPin, CheckCircle2, X } from 'lucide-react';

const MainAppContent = () => {
  const { 
    currentRole, 
    notification, 
    activeTrackingOrderId, 
    isLoginModalOpen, 
    setIsLoginModalOpen,
    isLandingPageOpen,
    setIsLandingPageOpen
  } = useApp();
  
  const [customerSubTab, setCustomerSubTab] = useState('menu'); // 'menu' | 'track'

  if (isLandingPageOpen) {
    return (
      <>
        <LandingPage onGetStarted={() => setIsLandingPageOpen(false)} />

        {/* Login Modal on top of Landing Page */}
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white bg-slate-900/80 p-1.5 rounded-full border border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <LoginPage onLoginSuccess={() => {
                setIsLoginModalOpen(false);
                setIsLandingPageOpen(false);
              }} />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1329] via-[#0f172a] to-[#1e1b4b] text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Top Sticky Navbar */}
      <Navbar />

      {/* Global Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-4">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2.5 backdrop-blur-md ${
            notification.type === 'error'
              ? 'bg-red-950/90 text-red-300 border-red-500/50'
              : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification.msg}</span>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white bg-slate-900/80 p-1.5 rounded-full border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <LoginPage onLoginSuccess={() => setIsLoginModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Role View Container */}
      <main className="flex-1">
        {currentRole === 'customer' && (
          <div>
            {/* Customer Sub-Nav Tabs */}
            <div className="bg-[#0f172a]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-2.5">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs font-bold shadow-inner">
                  <button
                    onClick={() => setCustomerSubTab('menu')}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl transition-all ${
                      customerSubTab === 'menu'
                        ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" /> Explore Menu & Order
                  </button>

                  <button
                    onClick={() => setCustomerSubTab('track')}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl transition-all ${
                      customerSubTab === 'track'
                        ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-300 animate-pulse" /> Track Live Order
                  </button>
                </div>

                <span className="hidden md:inline-block text-xs text-slate-400 font-medium">
                  Active Order: <span className="font-mono text-rose-400 font-bold">{activeTrackingOrderId}</span>
                </span>
              </div>
            </div>

            {customerSubTab === 'menu' ? <CustomerView /> : <OrderTracker />}
          </div>
        )}

        {currentRole === 'restaurant' && <RestaurantView />}
        {currentRole === 'delivery' && <DeliveryView />}
        {currentRole === 'admin' && <AdminView />}
      </main>

      {/* ZapBot AI Floating Widget */}
      <BiteBotChatbot />

      {/* Footer */}
      <footer className="bg-[#090d1a] border-t border-slate-800/80 py-6 text-center text-xs text-slate-400">
        <p className="font-extrabold text-slate-300">ZapBite.ai • Smart Food & Delivery Management OS</p>
        <p className="text-[11px] text-slate-500 mt-1">
          Next-Gen AI Food Ordering & Delivery Logistics Matrix
        </p>
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
