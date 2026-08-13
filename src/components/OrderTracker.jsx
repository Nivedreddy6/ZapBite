import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  Phone, 
  ShieldCheck, 
  ChevronRight, 
  Zap, 
  ShoppingBag,
  Sparkles,
  UserCheck,
  Compass,
  AlertCircle
} from 'lucide-react';

export const OrderTracker = () => {
  const { 
    orders, 
    activeTrackingOrderId, 
    setActiveTrackingOrderId, 
    deliveryPartners, 
    fastForwardOrder 
  } = useApp();

  const activeOrder = orders.find((o) => o.id === activeTrackingOrderId) || orders[0];
  
  // Find paired delivery partner
  const partner = deliveryPartners.find((p) => p.id === activeOrder?.deliveryPartnerId) || deliveryPartners[0];

  const stages = [
    { key: 'Placed', label: 'Order Placed', desc: 'Received by ZapBite.ai' },
    { key: 'Accepted', label: 'Kitchen Confirmed', desc: 'Order verified by chef' },
    { key: 'Preparing', label: 'Culinary Prep', desc: 'Cooking fresh ingredients' },
    { key: 'Ready', label: 'Ready for Dispatch', desc: 'Packed at dispatch station' },
    { key: 'Out for Delivery', label: 'Express Delivery', desc: 'Rider en route to doorstep' },
    { key: 'Delivered', label: 'Delivered', desc: 'Enjoy your meal!' }
  ];

  const getStageIndex = (status) => {
    return stages.findIndex((s) => s.key === status);
  };

  const currentStageIdx = activeOrder ? getStageIndex(activeOrder.status) : 0;
  const isOrderAccepted = activeOrder && activeOrder.status !== 'Placed';

  if (!activeOrder) {
    return (
      <div className="p-12 text-center text-slate-400">
        <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto mb-2" />
        <p>No active orders queued for tracking.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-100 font-sans">

      {/* Multiple Orders Tabs */}
      {orders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <span className="text-xs text-slate-400 font-bold shrink-0">Your Active Orders:</span>
          {orders.map((ord) => (
            <button
              key={ord.id}
              onClick={() => setActiveTrackingOrderId(ord.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition-all ${
                ord.id === activeOrder.id
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white border-rose-400 shadow-md'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {ord.id} • {ord.status}
            </button>
          ))}
        </div>
      )}

      {/* Tracking Card */}
      <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-700/80 shadow-2xl space-y-6 backdrop-blur-xl">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="bg-rose-500/20 text-rose-300 text-xs font-black px-3 py-1 rounded-xl border border-rose-500/40 font-mono">
                {activeOrder.id}
              </span>
              <h2 className="text-xl font-black text-white">{activeOrder.restaurantName}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Placed at {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {activeOrder.paymentMode} ({activeOrder.paymentStatus})
            </p>
          </div>

          {/* ETA & Fast Forward Button */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Estimated Arrival</div>
              <div className="text-lg font-black text-cyan-400 flex items-center gap-1.5 justify-end">
                <Clock className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                {activeOrder.status === 'Delivered' ? 'Delivered' : `${activeOrder.estimatedDeliveryMins} Mins`}
              </div>
            </div>

            {/* Fast Forward Step Simulation */}
            {activeOrder.status !== 'Delivered' && (
              <button
                onClick={() => fastForwardOrder(activeOrder.id)}
                className="bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-purple-700 text-white font-black text-xs px-3.5 py-2.5 rounded-2xl shadow-lg flex items-center gap-1.5 active:scale-95 transition-all border border-rose-400/30"
                title="Simulate Next Dispatch Step (Accept Order -> Preparing -> Out for Delivery)"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                Simulate Next Step
              </button>
            )}
          </div>
        </div>

        {/* Animated Rider Map Route */}
        <div className="relative h-48 bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden p-4 flex flex-col justify-between shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 z-10">
            <div className="flex items-center gap-1.5 font-extrabold text-slate-200">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>{activeOrder.restaurantName}</span>
            </div>
            <div className="flex items-center gap-1.5 font-extrabold text-slate-200">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>{activeOrder.deliveryAddress}</span>
            </div>
          </div>

          {/* Road Bar */}
          <div className="relative my-auto w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-400 transition-all duration-700 rounded-full"
              style={{ width: `${Math.min(100, Math.max(15, ((currentStageIdx + 1) / stages.length) * 100))}%` }}
            />
          </div>

          {/* Rider Icon */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-700"
            style={{ left: `${Math.min(88, Math.max(5, (currentStageIdx / (stages.length - 1)) * 88))}%` }}
          >
            <div className="bg-gradient-to-tr from-rose-500 to-purple-600 text-white p-2 rounded-full shadow-lg shadow-rose-500/50 animate-bounce">
              <Truck className="w-5 h-5 fill-white" />
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono z-10">
            <span>Dispatch Hub</span>
            <span className="text-cyan-400 font-extrabold">{activeOrder.status}</span>
            <span>Customer Location</span>
          </div>
        </div>

        {/* Stepper Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Live Status Timeline</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {stages.map((stg, index) => {
              const isCompleted = index <= currentStageIdx;
              const isCurrent = index === currentStageIdx;

              return (
                <div
                  key={stg.key}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-rose-500/20 border-rose-500 text-white ring-2 ring-rose-500/30'
                      : isCompleted
                      ? 'bg-slate-950 border-cyan-500/40 text-slate-300'
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex justify-center mb-1.5">
                    {isCompleted ? (
                      <CheckCircle2 className={`w-5 h-5 ${isCurrent ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
                    ) : (
                      <Clock className="w-5 h-5 text-slate-700" />
                    )}
                  </div>
                  <h4 className="font-extrabold text-xs">{stg.label}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{stg.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* DELIVERY PARTNER SECTION: Shows ONLY after order is Accepted by Kitchen! */}
        {isOrderAccepted ? (
          <div className="bg-slate-950 p-4.5 rounded-2xl border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg animate-fade-in-up">
            <div className="flex items-center gap-3">
              <img
                src={partner.avatar}
                alt={partner.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-rose-500/80 shadow-md shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-white">{partner.name}</h4>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded-md">
                    Assigned Delivery Rider
                  </span>
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md">
                    ★ {partner.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{partner.vehicle} • Thermal Insulated Bag</p>
              </div>
            </div>

            <a
              href={`tel:${partner.phone}`}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow active:scale-95 transition-all shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Rider
            </a>
          </div>
        ) : (
          <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-500/40 flex items-center gap-3 text-xs text-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
            <div>
              <span className="font-extrabold block">Order Placed & Awaiting Kitchen Acceptance</span>
              <span className="text-[11px] text-amber-300/80">
                Kitchen staff is currently reviewing your order. Delivery partner details will be assigned and displayed here immediately after acceptance!
              </span>
            </div>
          </div>
        )}

        {/* Items Summary */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <h4 className="font-black text-xs text-slate-400 uppercase tracking-wider mb-2.5">Order Items</h4>
          <div className="divide-y divide-slate-800">
            {activeOrder.items.map((it, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${it.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="text-white font-bold">{it.name} x {it.quantity}</span>
                </div>
                <span className="font-black text-slate-300">₹{it.price * it.quantity}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-black text-white mt-2">
            <span>Total Amount</span>
            <span className="text-rose-400">₹{activeOrder.totalAmount}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
