import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  Phone, 
  Zap, 
  ShoppingBag,
  Navigation,
  Activity,
  Radio,
  Gauge,
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

  const [telemetrySpeed, setTelemetrySpeed] = useState(32);
  const [signalStrength, setSignalStrength] = useState(99);

  // Dynamic telemetry pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetrySpeed(Math.floor(26 + Math.random() * 10));
      setSignalStrength(Math.floor(97 + Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const activeOrder = orders.find((o) => o.id === activeTrackingOrderId) || orders[0];
  const partner = deliveryPartners.find((p) => p.id === activeOrder?.deliveryPartnerId) || deliveryPartners[0];

  const stages = [
    { key: 'Placed', label: 'Order Placed', desc: 'Received by ZapBite.ai' },
    { key: 'Accepted', label: 'Kitchen Confirmed', desc: 'Order verified by chef' },
    { key: 'Preparing', label: 'Culinary Prep', desc: 'Cooking fresh ingredients' },
    { key: 'Ready', label: 'Ready for Dispatch', desc: 'Packed at dispatch station' },
    { key: 'Out for Delivery', label: 'Express Delivery', desc: 'Rider en route to doorstep' },
    { key: 'Delivered', label: 'Delivered', desc: 'Enjoy your meal!' }
  ];

  const getStageIndex = (status) => stages.findIndex((s) => s.key === status);
  const currentStageIdx = activeOrder ? getStageIndex(activeOrder.status) : 0;
  const isOrderAccepted = activeOrder && activeOrder.status !== 'Placed';

  if (!activeOrder) {
    return (
      <div className="p-12 text-center text-slate-400">
        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
        <p className="font-extrabold text-slate-600">No active orders queued for tracking.</p>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.max(10, ((currentStageIdx + 1) / stages.length) * 100));

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-900 font-sans">

      {/* Multiple Orders Selector Tabs */}
      {orders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <span className="text-xs text-slate-500 font-bold shrink-0">Your Active Orders:</span>
          {orders.map((ord) => (
            <button
              key={ord.id}
              onClick={() => setActiveTrackingOrderId(ord.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition-all ${
                ord.id === activeOrder.id
                  ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white border-orange-400 shadow-xs font-extrabold'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
            >
              {ord.id} • {ord.status}
            </button>
          ))}
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="bg-rose-50 text-rose-700 text-xs font-mono font-extrabold px-3 py-1 rounded-xl border border-rose-200">
                {activeOrder.id}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">{activeOrder.restaurantName}</h2>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-md font-extrabold border border-emerald-200 flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-600 animate-ping" />
                Live GPS Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Placed at {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {activeOrder.paymentMode} ({activeOrder.paymentStatus})
            </p>
          </div>

          {/* ETA & Simulator Controls */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Estimated Arrival</div>
              <div className="text-lg font-extrabold text-rose-600 flex items-center gap-1.5 justify-end">
                <Clock className="w-4 h-4 text-orange-500 animate-spin-slow" />
                {activeOrder.status === 'Delivered' ? 'Delivered 🎉' : `${activeOrder.estimatedDeliveryMins} Mins`}
              </div>
            </div>

            {activeOrder.status !== 'Delivered' && (
              <button
                onClick={() => fastForwardOrder(activeOrder.id)}
                className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-2xl shadow-xs flex items-center gap-1.5 active:scale-95 transition-all border border-orange-300/30"
                title="Simulate Next Dispatch Step (Accept -> Cooking -> En Route -> Delivered)"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                Simulate Step
              </button>
            )}
          </div>
        </div>

        {/* HUD Map Canvas */}
        <div className="relative h-64 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden p-4 flex flex-col justify-between shadow-inner text-white">
          
          {/* Map Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px), radial-gradient(#fb7185 1px, #0f172a 1px)',
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px'
            }}
          />

          {/* HUD Top Bar */}
          <div className="flex items-center justify-between text-xs text-slate-300 z-10 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="font-extrabold text-white text-xs">{activeOrder.restaurantName}</span>
              <span className="text-[10px] text-slate-500 font-mono">→</span>
              <span className="font-extrabold text-amber-300 text-xs truncate max-w-[200px]">{activeOrder.deliveryAddress}</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono">
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <Gauge className="w-3.5 h-3.5" />
                <span>{activeOrder.status === 'Out for Delivery' ? `${telemetrySpeed} km/h` : '0 km/h'}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-cyan-300">
                <Activity className="w-3.5 h-3.5" />
                <span>GPS {signalStrength}%</span>
              </div>
              <div className="hidden md:block bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-extrabold border border-emerald-500/30">
                Traffic: Smooth
              </div>
            </div>
          </div>

          {/* Animated Route Vector Path SVG */}
          <div className="relative my-auto w-full h-20 flex items-center justify-center">
            <svg className="absolute w-full h-full inset-0 pointer-events-none" viewBox="0 0 600 80">
              <path
                d="M 40 40 Q 200 10, 300 40 T 560 40"
                fill="none"
                stroke="#1e293b"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 40 40 Q 200 10, 300 40 T 560 40"
                fill="none"
                stroke="url(#warm-gradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="600"
                strokeDashoffset={600 - (600 * progressPercent) / 100}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="warm-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Waypoint 1: Kitchen Hub */}
            <div className="absolute left-[6%] top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="w-9 h-9 rounded-xl bg-rose-950 border border-rose-500 text-rose-300 flex items-center justify-center shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-slate-300 mt-1 font-bold">Kitchen Hub</span>
            </div>

            {/* Rider Position Icon */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out z-20"
              style={{ left: `${Math.min(88, Math.max(8, progressPercent * 0.88))}%` }}
            >
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 p-0.5 shadow-lg shadow-orange-500/40 animate-bounce">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-orange-400">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-orange-950/90 text-orange-300 text-[9px] font-mono px-2 py-0.5 rounded-full border border-orange-500/40">
                  Rider Node #01
                </div>
              </div>
            </div>

            {/* Waypoint 2: Destination Drop */}
            <div className="absolute right-[6%] top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 flex items-center justify-center shadow-xs">
                <Navigation className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-slate-300 mt-1 font-bold">Doorstep</span>
            </div>
          </div>

          {/* HUD Bottom Strip */}
          <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono z-10 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <span>Dispatch Location: Sector 4, Vizag</span>
            <span className="text-orange-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
              {activeOrder.status}
            </span>
            <span>Target ETA: {activeOrder.estimatedDeliveryMins} mins</span>
          </div>
        </div>

        {/* Stepper Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Live Status Timeline</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {stages.map((stg, index) => {
              const isCompleted = index <= currentStageIdx;
              const isCurrent = index === currentStageIdx;

              return (
                <div
                  key={stg.key}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/30'
                      : isCompleted
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex justify-center mb-1.5">
                    {isCompleted ? (
                      <CheckCircle2 className={`w-5 h-5 ${isCurrent ? 'text-rose-600 animate-pulse' : 'text-emerald-600'}`} />
                    ) : (
                      <Clock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <h4 className="font-extrabold text-xs">{stg.label}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight font-medium">{stg.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* DELIVERY PARTNER CARD */}
        {isOrderAccepted ? (
          <div className="bg-slate-50 p-4.5 rounded-2xl border border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <img
                src={partner.avatar}
                alt={partner.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-rose-400 shadow-xs shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900">{partner.name}</h4>
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                    Assigned Delivery Rider
                  </span>
                  <span className="bg-amber-50 text-amber-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-amber-200">
                    ★ {partner.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">{partner.vehicle} • Thermal Insulated Bag</p>
              </div>
            </div>

            <a
              href={`tel:${partner.phone}`}
              className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Rider
            </a>
          </div>
        ) : (
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center gap-3 text-xs text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 animate-pulse" />
            <div>
              <span className="font-extrabold block">Order Placed & Awaiting Kitchen Acceptance</span>
              <span className="text-[11px] text-amber-800 font-medium">
                Kitchen staff is currently reviewing your order. Delivery partner details will be assigned and displayed here immediately after acceptance!
              </span>
            </div>
          </div>
        )}

        {/* Items Summary */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider mb-2.5">Order Items</h4>
          <div className="divide-y divide-slate-200">
            {activeOrder.items.map((it, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${it.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                  <span className="text-slate-900 font-extrabold">{it.name} x {it.quantity}</span>
                </div>
                <span className="font-extrabold text-slate-900">₹{it.price * it.quantity}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-900 mt-2">
            <span>Total Amount</span>
            <span className="text-rose-600">₹{activeOrder.totalAmount}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
