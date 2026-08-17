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
  Mail
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
        description: item.description || matched?.description || 'Delicious gourmet preparation'
      });
    });

    showNotification(`🛒 Reordered items from ${order.restaurantName || 'past order'}!`, 'success');
    if (onClose) onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in font-sans">
      <div className="bg-slate-50 max-w-lg w-full max-h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 relative">

        {/* 1. Header Card with Coral/Red Gradient (Exact Match to Image 1) */}
        <div className="bg-gradient-to-r from-[#e53935] via-[#d32f2f] to-[#c62828] p-6 text-white relative overflow-hidden shrink-0 shadow-md">
          {/* Subtle geometric circles matching screenshot design */}
          <div className="absolute -right-10 -bottom-14 w-48 h-48 rounded-full bg-white/10 pointer-events-none blur-xl" />
          <div className="absolute right-4 bottom-1 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

          {/* Top Navbar inside Header Card */}
          <div className="flex items-center justify-between mb-8 relative z-10">
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 text-white transition-colors active:scale-95"
              title="Back"
            >
              <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => showNotification("ZapBite Help Desk: Customer support available 24/7", "info")}
                className="bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-xs transition-all active:scale-95"
              >
                Help
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
                title="Options"
              >
                <MoreVertical className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Options Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-10 w-48 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 py-1.5 z-30 text-xs font-bold animate-in fade-in">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onClose();
                      setIsLoginModalOpen(true);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-slate-100 flex items-center gap-2 text-slate-700"
                  >
                    <User className="w-4 h-4 text-orange-500" />
                    <span>Switch Account / Sign In</span>
                  </button>
                  <hr className="my-1 border-slate-100" />
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                      onClose();
                      setIsLoginModalOpen(true);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="relative z-10 space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
              {user ? user.name : 'Nived Reddy Tamma'}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-white/90 tracking-wide font-sans">
              {user ? user.phone : '+91 - 7702618534'}
            </p>
            <p className="text-xs sm:text-sm font-medium text-white/80 tracking-wide font-sans">
              {user ? user.email : 'nivedreddy6@gmail.com'}
            </p>
          </div>
        </div>

        {/* 2. Past Orders Section (Exact Match to Image 2) */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col min-h-0 bg-[#f8f9fa]">
          
          {/* Header Title */}
          <div className="flex items-center justify-between mb-3 shrink-0">
            <h3 className="text-xs font-extrabold tracking-wider text-slate-800 uppercase font-sans">
              PAST ORDERS
            </h3>
          </div>



          {/* Orders Scrollable Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {displayOrders.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-3xl border border-slate-200/80 p-6">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">No {orderTab} orders found yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">Place an order from the menu to see it listed here!</p>
              </div>
            ) : (
              displayOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3.5 hover:shadow-md transition-all">
                  
                  {/* Restaurant Info & Delivered Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={order.restaurantImage || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80'}
                        alt={order.restaurantName || 'Restaurant'}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                          {order.restaurantName || 'Highway Drive In'}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">
                          {order.restaurantLocation || 'Madhurawada'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 shrink-0">
                      <span>{order.status === 'Delivered' || !order.status ? 'Delivered' : order.status}</span>
                      <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white shrink-0" />
                    </div>
                  </div>

                  {/* Items List Pill */}
                  <div className="flex items-center gap-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="bg-slate-200/90 text-slate-700 text-[11px] font-extrabold px-2 py-0.5 rounded-md shrink-0">
                      {order.items?.[0]?.quantity || 1}X
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {order.items?.map((i) => i.name).join(', ') || 'White Rice with Chicken Curry'}
                    </span>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Star Ratings Section */}
                  <div className="grid grid-cols-2 gap-2 text-center divide-x divide-slate-200 py-1">
                    {/* Your Food Rating */}
                    <div className="pr-2 space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-700">Your Food Rating</p>
                      <div className="flex items-center justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRateOrder(order.id, 'food', star)}
                            className="p-0.5 hover:scale-125 transition-transform"
                            title={`Rate Food ${star}/5 stars`}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= (order.foodRating || 0)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300 hover:text-amber-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Rating */}
                    <div className="pl-2 space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-700">Delivery Rating</p>
                      <div className="flex items-center justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRateOrder(order.id, 'delivery', star)}
                            className="p-0.5 hover:scale-125 transition-transform"
                            title={`Rate Delivery ${star}/5 stars`}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= (order.deliveryRating || 0)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300 hover:text-amber-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* REORDER > Button */}
                  <button
                    onClick={() => handleReorder(order)}
                    className="w-full bg-[#fff4ed] hover:bg-[#ffe7d6] text-[#f25200] font-extrabold text-xs py-3 rounded-2xl border border-orange-200/80 transition-all flex items-center justify-center gap-1 uppercase tracking-wider active:scale-98 shadow-xs"
                  >
                    <span>REORDER</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </button>

                  {/* Footer details */}
                  <div className="text-[11px] text-slate-500 font-medium text-center pt-0.5">
                    Ordered: {order.formattedDate || 'August 13, 8:56 PM'} • Bill Total: <span className="font-extrabold text-slate-800">₹{order.totalAmount}</span>
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
