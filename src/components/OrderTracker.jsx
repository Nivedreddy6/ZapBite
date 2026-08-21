import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Zap, 
  ShoppingBag,
  Navigation,
  Activity,
  Radio,
  Gauge,
  AlertCircle,
  Cpu
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

  const [telemetrySpeed, setTelemetrySpeed] = useState(34);
  const [signalStrength, setSignalStrength] = useState(99);

  // Dynamic telemetry pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetrySpeed(Math.floor(28 + Math.random() * 10));
      setSignalStrength(Math.floor(98 + Math.random() * 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const activeOrder = orders.find((o) => o.id === activeTrackingOrderId) || orders[0];
  const partner = deliveryPartners.find((p) => p.id === activeOrder?.deliveryPartnerId) || deliveryPartners[0];

  const stages = [
    { key: 'Placed', label: 'Order Queued', desc: 'Received in Quantum DB' },
    { key: 'Accepted', label: 'Reactor Locked', desc: 'Verified by Chef' },
    { key: 'Preparing', label: 'Thermal Synthesis', desc: 'Active Kitchen Prep' },
    { key: 'Ready', label: 'Thermal Sealed', desc: 'Staged at Dispatch' },
    { key: 'Out for Delivery', label: 'Hyper Transit', desc: 'Drone & Rider En Route' },
    { key: 'Delivered', label: 'Doorstep Handoff', desc: 'Enjoy Fresh Meal!' }
  ];

  const getStageIndex = (status) => stages.findIndex((s) => s.key === status);
  const currentStageIdx = activeOrder ? getStageIndex(activeOrder.status) : 0;
  const isOrderAccepted = activeOrder && activeOrder.status !== 'Placed';

  if (!activeOrder) {
    return (
      <div className="p-12 text-center text-slate-400">
        <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-2" />
        <p className="font-bold text-slate-400">No active orders queued in telemetry.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-100 font-sans">

      {/* Multiple Orders Selector Tabs */}
      {orders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <span className="text-xs text-slate-400 font-mono font-bold shrink-0">ACTIVE NODES:</span>
          {orders.map((ord) => (
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

      {/* Main Container Card */}
      <div className="bg-[#0d1527]/90 rounded-3xl p-6 border border-emerald-500/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-6 backdrop-blur-xl">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-[#111c33] text-emerald-300 text-xs font-mono font-black px-3 py-1 rounded-xl border border-emerald-500/40">
                {activeOrder.id}
              </span>
              <h2 className="text-xl font-black text-white">{activeOrder.restaurantName}</h2>
              <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2 py-0.5 rounded-md font-mono font-black border border-emerald-500/40 flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
                LIVE GPS HUD
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Queued at {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {activeOrder.paymentMode} ({activeOrder.paymentStatus})
            </p>
          </div>

          {/* ETA & Simulator Controls */}
          <div className="flex items-center gap-3">
            <div className="bg-[#070b14] px-4 py-2.5 rounded-2xl border border-emerald-500/30 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">ESTIMATED ETA</div>
              <div className="text-lg font-black text-emerald-400 font-mono flex items-center gap-1.5 justify-end">
                <Clock className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                {activeOrder.status === 'Delivered' ? 'Delivered 🎉' : `${activeOrder.estimatedDeliveryMins} Mins`}
              </div>
            </div>

            {activeOrder.status !== 'Delivered' && (
              <button
                onClick={() => fastForwardOrder(activeOrder.id)}
                className="bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 hover:from-emerald-400 text-slate-950 font-black text-xs px-3.5 py-2.5 rounded-2xl shadow-[0_0_15px_rgba(0,245,155,0.3)] flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                title="Simulate Next Dispatch Step"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                Simulate Step
              </button>
            )}
          </div>
        </div>

        {/* Live Interactive Telemetry Map */}
        <LiveMap 
          orderStatus={activeOrder.status}
          restaurantName={activeOrder.restaurantName}
          deliveryAddress={activeOrder.deliveryAddress}
          partnerName={partner?.name}
        />

        {/* Stepper Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-black text-emerald-400 uppercase tracking-wider">// DISPATCH PIPELINE STATUS</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {stages.map((stg, index) => {
              const isCompleted = index <= currentStageIdx;
              const isCurrent = index === currentStageIdx;

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
                      <CheckCircle2 className={`w-5 h-5 ${isCurrent ? 'text-emerald-400 animate-pulse' : 'text-emerald-500'}`} />
                    ) : (
                      <Clock className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <h4 className="font-black text-xs">{stg.label}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight font-mono">{stg.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* DELIVERY PARTNER CARD */}
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
                    ASSIGNED DRONE RIDER
                  </span>
                  <span className="bg-[#111c33] text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md border border-amber-500/40">
                    ★ {partner.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">{partner.vehicle} • Thermal Insulated Containment</p>
              </div>
            </div>

            <a
              href={`tel:${partner.phone}`}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              Direct Comms
            </a>
          </div>
        ) : (
          <div className="bg-[#1a1708] p-4 rounded-2xl border border-amber-500/40 flex items-center gap-3 text-xs text-amber-300">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
            <div>
              <span className="font-black block text-amber-200">Order Queued & Awaiting Kitchen Acceptance</span>
              <span className="text-[11px] text-amber-400 font-mono">
                Kitchen reactor is verifying ingredients. Delivery drone telemetry will initialize immediately upon acceptance!
              </span>
            </div>
          </div>
        )}

        {/* Items Summary */}
        <div className="bg-[#070b14] p-4 rounded-2xl border border-slate-800">
          <h4 className="font-mono font-black text-xs text-emerald-400 uppercase tracking-wider mb-2.5">CALIBRATED ORDER ITEMS</h4>
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
            <span>TOTAL AMOUNT</span>
            <span className="text-emerald-400 text-base">₹{activeOrder.totalAmount}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
