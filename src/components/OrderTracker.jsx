import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ShoppingBag, 
  Navigation, 
  Radio, 
  AlertCircle,
  ChefHat,
  Package,
  Bike,
  Sparkles,
  Star,
  ArrowRight,
  Utensils
} from 'lucide-react';
import { LiveMap } from './LiveMap';

export const OrderTracker = () => {
  const { 
    orders, 
    activeTrackingOrderId, 
    setActiveTrackingOrderId, 
    deliveryPartners,
    setCustomerSubTab,
    rateOrder,
    showNotification
  } = useApp();

  const [etaRemainingMins, setEtaRemainingMins] = useState(22);

  // Active ongoing orders (excluding delivered past orders)
  const ongoingOrders = orders.filter((o) => o.status !== 'Delivered');

  // Active Order: prioritize matching activeTrackingOrderId, otherwise first ongoing order, otherwise most recent order
  const activeOrder = orders.find((o) => o.id === activeTrackingOrderId) || ongoingOrders[0] || orders[0];
  const partner = deliveryPartners.find((p) => p.id === activeOrder?.deliveryPartnerId) || deliveryPartners[0];

  // Authentic Food Delivery Milestones
  const stages = [
    { key: 'Placed', label: 'Order Placed', desc: 'Sent to restaurant', icon: ShoppingBag },
    { key: 'Accepted', label: 'Order Confirmed', desc: 'Restaurant accepted', icon: CheckCircle2 },
    { key: 'Preparing', label: 'Preparing Food', desc: 'Chef is cooking your meal', icon: ChefHat },
    { key: 'Ready', label: 'Food Packed', desc: 'Ready for rider pickup', icon: Package },
    { key: 'Out for Delivery', label: 'On the Way', desc: 'Rider heading to your location', icon: Bike },
    { key: 'Delivered', label: 'Delivered', desc: 'Enjoy your delicious meal!', icon: Sparkles }
  ];

  const getStageIndex = (status) => stages.findIndex((s) => s.key === status);
  const currentStageIdx = activeOrder ? getStageIndex(activeOrder.status) : 0;
  const isOrderAccepted = activeOrder && activeOrder.status !== 'Placed';
  const isDelivered = activeOrder?.status === 'Delivered';

  // Live dynamic ETA timer that updates every minute based on 30-35 mins delivery estimate
  useEffect(() => {
    if (!activeOrder) return;
    if (activeOrder.status === 'Delivered') {
      setEtaRemainingMins(0);
      return;
    }

    const updateEta = () => {
      const createdTime = new Date(activeOrder.createdAt).getTime();
      const elapsedMins = Math.floor((Date.now() - createdTime) / 60000);
      const totalMins = activeOrder.estimatedDeliveryMins || 32;
      const remaining = Math.max(1, totalMins - elapsedMins);
      setEtaRemainingMins(remaining);
    };

    updateEta();
    const interval = setInterval(updateEta, 60000);
    return () => clearInterval(interval);
  }, [activeOrder?.createdAt, activeOrder?.status, activeOrder?.estimatedDeliveryMins]);

  const handleRate = (type, rating) => {
    if (!activeOrder) return;
    if (type === 'food') {
      rateOrder(activeOrder.id, { foodRating: rating });
      showNotification(`⭐ Rated food ${rating}/5 stars!`, 'success');
    } else {
      rateOrder(activeOrder.id, { deliveryRating: rating });
      showNotification(`🛵 Rated delivery partner ${rating}/5 stars!`, 'success');
    }
  };

  // If no orders exist at all
  if (!activeOrder) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center text-slate-400 font-sans space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#0d1527] border border-slate-800 flex items-center justify-center mx-auto shadow-xl">
          <ShoppingBag className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-black text-white">No Active Deliveries</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          You don't have any ongoing food orders right now. Explore the menu and enjoy delicious food delivered to your doorstep!
        </p>
        <button
          onClick={() => setCustomerSubTab('menu')}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(0,245,155,0.4)] inline-flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <Utensils className="w-4 h-4" />
          Browse Food Menu
        </button>
      </div>
    );
  }

  // Smooth live delivery progress calculation
  const totalMins = activeOrder.estimatedDeliveryMins || 32;
  const createdTime = new Date(activeOrder.createdAt).getTime();
  const elapsedMins = Math.max(0, (Date.now() - createdTime) / 60000);
  const progressPercent = isDelivered
    ? 100
    : Math.min(95, Math.max(10, Math.round((elapsedMins / totalMins) * 100)));

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-100 font-sans space-y-6">

      {/* Multiple Ongoing Orders Selector Tabs (only shows active undelivered orders) */}
      {ongoingOrders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs text-slate-400 font-mono font-bold shrink-0">ACTIVE ORDERS:</span>
          {ongoingOrders.map((ord) => (
            <button
              key={ord.id}
              onClick={() => setActiveTrackingOrderId(ord.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-black shrink-0 border transition-all cursor-pointer ${
                ord.id === activeOrder.id
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 border-emerald-400 shadow-[0_0_12px_rgba(0,245,155,0.4)]'
                  : 'bg-[#0d1527] text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {ord.id} • {ord.status}
            </button>
          ))}
        </div>
      )}

      {/* Main Order Card */}
      <div className="bg-[#0d1527]/90 rounded-3xl p-6 border border-emerald-500/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-6 backdrop-blur-xl">

        {/* Top Header & Status Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-[#111c33] text-emerald-300 text-xs font-mono font-black px-3 py-1 rounded-xl border border-emerald-500/40">
                {activeOrder.id}
              </span>
              <h2 className="text-xl font-black text-white">{activeOrder.restaurantName}</h2>
              {isDelivered ? (
                <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-md font-mono font-black border border-emerald-500/40 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  DELIVERED
                </span>
              ) : (
                <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-md font-mono font-black border border-emerald-500/40 flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
                  LIVE GPS TRACKING
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Ordered at {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {activeOrder.paymentMode} ({activeOrder.paymentStatus})
            </p>
          </div>

          {/* Real-Time ETA Card */}
          <div className="bg-[#070b14] px-5 py-3 rounded-2xl border border-emerald-500/30 text-right shrink-0">
            <div className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">
              {isDelivered ? 'ORDER STATUS' : 'ESTIMATED ARRIVAL'}
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono flex items-center gap-1.5 justify-end mt-0.5">
              <Clock className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              {isDelivered ? 'Delivered 🎉' : `${etaRemainingMins} Mins`}
            </div>
          </div>
        </div>

        {/* Order Completed Reset Banner (Shown when delivery is completed) */}
        {isDelivered && (
          <div className="bg-gradient-to-r from-emerald-950/80 via-[#0d2218] to-slate-900 p-5 rounded-2xl border border-emerald-500/40 space-y-4 animate-fade-in shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(0,245,155,0.4)]">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">Order Delivered Successfully! 🎉</h3>
                  <p className="text-xs text-emerald-300/80">Your hot meal has been delivered. Enjoy your food!</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setCustomerSubTab('menu');
                }}
                className="bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 hover:from-emerald-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-[0_0_15px_rgba(0,245,155,0.4)] flex items-center gap-2 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <span>Order More Food</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Star Rating Strip */}
            <div className="pt-3 border-t border-emerald-500/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="flex items-center justify-between bg-[#070b14]/70 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-300 font-bold">Rate Food:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate('food', star)}
                      className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${star <= (activeOrder.foodRating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-600 hover:text-amber-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#070b14]/70 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-300 font-bold">Rate Rider:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate('delivery', star)}
                      className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${star <= (activeOrder.deliveryRating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-600 hover:text-amber-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Interactive Map with Google Maps Layer */}
        <LiveMap 
          orderStatus={activeOrder.status}
          restaurantName={activeOrder.restaurantName}
          deliveryAddress={activeOrder.deliveryAddress}
          partnerName={partner?.name}
          createdAt={activeOrder.createdAt}
          estimatedDeliveryMins={activeOrder.estimatedDeliveryMins || 32}
        />

        {/* Real-Time Delivery Progress Stepper */}
        <div className="space-y-3 bg-[#070b14]/70 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              LIVE ORDER PROGRESS
            </h3>
            <span className="text-xs font-mono font-bold text-slate-400">{progressPercent}% Completed</span>
          </div>

          {/* Progress Bar Line */}
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 h-full transition-all duration-700 ease-out rounded-full shadow-[0_0_12px_rgba(0,245,155,0.6)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 6 Stage Timeline Steps */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-2">
            {stages.map((stg, index) => {
              const isCompleted = index <= currentStageIdx;
              const isCurrent = index === currentStageIdx;
              const StepIcon = stg.icon;

              return (
                <div
                  key={stg.key}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-[#111c33] border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(0,245,155,0.25)] ring-1 ring-emerald-400'
                      : isCompleted
                      ? 'bg-[#0d2218] border-emerald-500/40 text-emerald-300'
                      : 'bg-[#070b14] border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex justify-center mb-1.5">
                    {isCompleted ? (
                      <StepIcon className={`w-5 h-5 ${isCurrent ? 'text-emerald-400 animate-bounce' : 'text-emerald-500'}`} />
                    ) : (
                      <StepIcon className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <h4 className="font-black text-xs">{stg.label}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight font-mono">{stg.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assigned Delivery Partner Card */}
        {isOrderAccepted ? (
          <div className="bg-[#070b14] p-4.5 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <img
                src={partner.avatar}
                alt={partner.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400 shadow-[0_0_12px_rgba(0,245,155,0.3)] shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-black text-sm text-white">{partner.name}</h4>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                    ASSIGNED DELIVERY PARTNER
                  </span>
                  <span className="bg-[#111c33] text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md border border-amber-500/40">
                    ★ {partner.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">{partner.vehicle} • Insulated Fresh Packaging</p>
              </div>
            </div>

            <a
              href={`tel:${partner.phone}`}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Rider
            </a>
          </div>
        ) : (
          <div className="bg-[#1a1708] p-4 rounded-2xl border border-amber-500/40 flex items-center gap-3 text-xs text-amber-300">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
            <div>
              <span className="font-black block text-amber-200">Order Placed & Sent to Restaurant</span>
              <span className="text-[11px] text-amber-400 font-mono">
                Restaurant is reviewing and confirming your order. Rider assignment will initialize immediately upon confirmation!
              </span>
            </div>
          </div>
        )}

        {/* Order Items Summary & Total Bill */}
        <div className="bg-[#070b14] p-4.5 rounded-2xl border border-slate-800">
          <h4 className="font-mono font-black text-xs text-emerald-400 uppercase tracking-wider mb-2.5">ORDER ITEMS SUMMARY</h4>
          <div className="divide-y divide-slate-800 font-mono">
            {activeOrder.items.map((it, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${it.isVeg ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                  <span className="text-white font-bold">{it.name} x {it.quantity}</span>
                </div>
                <span className="font-black text-slate-200">₹{it.price * it.quantity}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-black text-white mt-2 font-mono">
            <span>TOTAL BILL PAID</span>
            <span className="text-emerald-400 text-base">₹{activeOrder.totalAmount}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
