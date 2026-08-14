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
import { LiveMap } from './LiveMap';




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

        {/* Real Swiggy-Style Live Interactive Map */}
        <LiveMap 
          orderStatus={activeOrder.status}
          restaurantName={activeOrder.restaurantName}
          deliveryAddress={activeOrder.deliveryAddress}
          partnerName={partner?.name}
        />


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
