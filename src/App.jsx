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

import { Utensils, MapPin, CheckCircle2, X } from 'lucide-react';


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
    setIsLandingPageOpen
  } = useApp();
  
  const [customerSubTab, setCustomerSubTab] = useState('menu');

  if (isLandingPageOpen) {
    return (
      <>
        <LandingPage onGetStarted={() => setIsLandingPageOpen(false)} />

        {/* Login Modal on top of Landing Page */}
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
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
    <div className="min-h-screen bg-[#fcfbf9] text-slate-900 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Top Sticky Navbar */}
      <Navbar />

      {/* Global Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-fade-in-up">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2.5 backdrop-blur-md ${
            notification.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification.msg}</span>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 z-20 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full border border-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <LoginPage onLoginSuccess={() => setIsLoginModalOpen(false)} />
          </div>
        </div>
      )}

      {/* User Profile Modal (Swiggy Profile & Past Orders Replica) */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Role View Container */}
      <main className="flex-1">
        {currentRole === 'customer' && (
          <div>
            {/* Customer Sub-Nav Tabs */}
            <div className="bg-white border-b border-slate-200/80 px-4 py-2.5 shadow-xs">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setCustomerSubTab('menu')}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl transition-all ${
                      customerSubTab === 'menu'
                        ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-xs font-extrabold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" /> Explore Menu & Order
                  </button>

                  <button
                    onClick={() => setCustomerSubTab('track')}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl transition-all ${
                      customerSubTab === 'track'
                        ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-xs font-extrabold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-300 animate-pulse" /> Track Live Order
                  </button>
                </div>

                <span className="hidden md:inline-block text-xs text-slate-500 font-medium">
                  Active Order: <span className="font-mono text-rose-600 font-extrabold">{activeTrackingOrderId}</span>
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

      {/* Global Checkout Cart Drawer */}
      <CartDrawer />

      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />

      {/* Login & Registration Modal Overlay */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-md my-auto">
            <LoginPage 
              onClose={() => setIsLoginModalOpen(false)}
              onLoginSuccess={() => {
                setIsLoginModalOpen(false);
              }} 
            />
          </div>
        </div>
      )}


      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p className="font-extrabold text-slate-800">ZapBite.ai • Smart Food & Delivery Management OS</p>
        <p className="text-[11px] text-slate-400 mt-1">
          Next-Gen Food Ordering & Real-Time Logistics Matrix
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
