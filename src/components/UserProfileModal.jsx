import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  MoreVertical,
  CheckCircle2,
  Star,
  ChevronRight,
  LogOut,
  User,
  ShoppingBag,
  X,
  HelpCircle,
  Sparkles,
  Phone,
  Mail,
  Zap,
  Radio
} from 'lucide-react';

export const UserProfileModal = ({ isOpen, onClose }) => {
  const {
    user,
    orders,
    menuItems,
    rateOrder,
    addToCart,
    setIsCartOpen,
    showNotification,
    logout,
    setIsLoginModalOpen
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isOpen) return null;

  const displayOrders = orders || [];

  const handleRateOrder = (orderId, type, rating) => {
    if (type === 'food') {
      rateOrder(orderId, { foodRating: rating });
      showNotification(`⭐ Rated Food ${rating}/5 stars for order ${orderId}!`, 'success');
    } else {
      rateOrder(orderId, { deliveryRating: rating });
      showNotification(`🛵 Rated Delivery ${rating}/5 stars for order ${orderId}!`, 'success');
    }
  };

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    
    order.items.forEach((item) => {
      const matched = (menuItems || []).find(m => m.id === item.id || m.name.toLowerCase() === item.name.toLowerCase());
      const itemImage = item.image || matched?.image || order.restaurantImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80';

      addToCart({
        id: item.id || matched?.id || `item-${Date.now()}`,
        restaurantId: order.restaurantId || matched?.restaurantId || 'rest-1',
        name: item.name,
        price: item.price,
        isVeg: item.isVeg !== undefined ? item.isVeg : (matched?.isVeg || false),
        image: itemImage,
        description: item.description || matched?.description || 'Calibrated delicacy'
      });
    });

    showNotification(`🛒 Re-synthesized items from ${order.restaurantName || 'past order'} into vault!`, 'success');
    if (onClose) onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#040711]/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in font-sans">
      <div className="bg-[#0d1527] max-w-lg w-full max-h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-emerald-500/30 relative text-slate-100">

        {/* 1. Header Card with Cyber Neon Gradient */}
        <div className="bg-gradient-to-r from-[#0e2a22] via-[#091f2c] to-[#12163a] p-6 text-white relative overflow-hidden shrink-0 border-b border-emerald-500/30">
          <div className="absolute -right-10 -bottom-14 w-48 h-48 rounded-full bg-emerald-500/10 pointer-events-none blur-xl" />

          {/* Top Navbar inside Header Card */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#070b14]/70 hover:bg-[#070b14] text-white transition-colors cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => showNotification("ZapBite AI Terminal: 24/7 Concierge Active", "info")}
                className="bg-[#070b14]/70 hover:bg-[#070b14] text-emerald-300 font-mono font-bold text-xs px-3.5 py-1.5 rounded-xl border border-emerald-500/30 transition-all cursor-pointer"
              >
                Help Desk
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl bg-[#070b14]/70 hover:bg-[#070b14] text-white transition-colors cursor-pointer"
                title="Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Options Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-10 w-48 bg-[#070b14] text-slate-200 rounded-2xl shadow-2xl border border-slate-700 py-1.5 z-30 text-xs font-bold font-mono">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onClose();
                      setIsLoginModalOpen(true);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#111c33] flex items-center gap-2 text-slate-300"
                  >
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>Switch Node</span>
                  </button>
                  <hr className="my-1 border-slate-800" />
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                      onClose();
                      setIsLoginModalOpen(true);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-rose-950/60 text-rose-400 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Disconnect Node</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">QUANTUM IDENTITY MATRIX</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
              {user ? user.name : 'Nived Reddy Tamma'}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-emerald-300">
              {user ? user.phone : '+91 77026 18534'}
            </p>
            <p className="text-xs font-mono text-slate-400">
              {user ? user.email : 'nivedreddy6@gmail.com'}
            </p>
          </div>
        </div>

        {/* 2. Past Orders Section */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col min-h-0 bg-[#070b14]/90">
          
          <div className="flex items-center justify-between mb-4 shrink-0 font-mono">
            <h3 className="text-xs font-black tracking-wider text-emerald-400 uppercase">
              // TELEMETRY LOGS: PAST ORDERS ({displayOrders.length})
            </h3>
          </div>

          {/* Orders Scrollable Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {displayOrders.length === 0 ? (
              <div className="text-center py-10 bg-[#0d1527] rounded-3xl border border-slate-800 p-6">
                <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-mono font-bold text-slate-400">No past orders in telemetry logs.</p>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">Place an order to see it logged here!</p>
              </div>
            ) : (
              displayOrders.map((order) => (
                <div key={order.id} className="bg-[#0d1527] rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-md space-y-3.5 hover:border-emerald-500/40 transition-all">
                  
                  {/* Restaurant Info & Delivered Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={order.restaurantImage || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80'}
                        alt={order.restaurantName || 'Restaurant'}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div>
                        <h4 className="text-sm font-black text-white leading-snug">
                          {order.restaurantName || 'Quantum Kitchen'}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono">
                          {order.restaurantLocation || 'Sector 4 Radar'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-300 font-mono font-bold text-xs bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/40 shrink-0">
                      <span>{order.status === 'Delivered' || !order.status ? 'Delivered' : order.status}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </div>
                  </div>

                  {/* Items List Pill */}
                  <div className="flex items-center gap-2.5 bg-[#070b14] p-2.5 rounded-xl border border-slate-800 font-mono">
                    <span className="bg-[#111c33] text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0">
                      {order.items?.[0]?.quantity || 1}X
                    </span>
                    <span className="text-xs text-slate-200 truncate">
                      {order.items?.map((i) => i.name).join(', ') || 'Delicacy Combo'}
                    </span>
                  </div>

                  <hr className="border-slate-800" />

                  {/* Star Ratings Section */}
                  <div className="grid grid-cols-2 gap-2 text-center divide-x divide-slate-800 py-1 font-mono">
                    {/* Food Rating */}
                    <div className="pr-2 space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold">CULINARY RATING</p>
                      <div className="flex items-center justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRateOrder(order.id, 'food', star)}
                            className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                            title={`Rate Food ${star}/5 stars`}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                star <= (order.foodRating || 0)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-600 hover:text-amber-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Rating */}
                    <div className="pl-2 space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold">FLEET RATING</p>
                      <div className="flex items-center justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRateOrder(order.id, 'delivery', star)}
                            className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                            title={`Rate Delivery ${star}/5 stars`}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                star <= (order.deliveryRating || 0)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-600 hover:text-amber-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RE-SYNTHESIZE / REORDER Button */}
                  <button
                    onClick={() => handleReorder(order)}
                    className="w-full bg-[#111c33] hover:bg-[#1a2c4e] text-emerald-300 hover:text-white font-mono font-black text-xs py-3 rounded-2xl border border-emerald-500/40 transition-all flex items-center justify-center gap-1 uppercase tracking-wider active:scale-98 shadow-[0_0_12px_rgba(0,245,155,0.15)] cursor-pointer"
                  >
                    <span>⚡ RE-SYNTHESIZE ORDER</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </button>

                  {/* Footer details */}
                  <div className="text-[10px] text-slate-400 font-mono text-center pt-0.5">
                    Order Total: <span className="font-bold text-emerald-400">₹{order.totalAmount}</span>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
