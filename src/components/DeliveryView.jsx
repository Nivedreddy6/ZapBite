import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Truck, 
  Phone, 
  CheckCircle2, 
  Navigation, 
  Wallet, 
  Power,
  Package,
  Award,
  Radio,
  Gauge,
  Zap,
  MapPin
} from 'lucide-react';

export const DeliveryView = () => {
  const { 
    deliveryPartners, 
    orders, 
    updateOrderStatus, 
    togglePartnerStatus 
  } = useApp();

  const [selectedPartnerId, setSelectedPartnerId] = useState('all');

  const partner = deliveryPartners.find((p) => p.id === selectedPartnerId) || deliveryPartners[0];
  const assignedOrders = orders.filter((o) => {
    if (o.status === 'Delivered') return false;
    if (selectedPartnerId === 'all') return true;
    return o.deliveryPartnerId === partner?.id || !o.deliveryPartnerId;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-100 font-sans">
      
      {/* Rider Header & Profile */}
      <div className="bg-[#0d1527]/90 rounded-3xl p-6 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-6 backdrop-blur-xl">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <img
              src={partner.avatar}
              alt={partner.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-[0_0_15px_rgba(0,245,155,0.4)]"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white">
                  {selectedPartnerId === 'all' ? 'All Active Drone Fleet Units' : partner.name}
                </h2>
                <span className="bg-[#111c33] text-amber-300 border border-amber-500/40 text-xs font-mono font-black px-2 py-0.5 rounded-md">
                  ★ {partner.rating}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">{partner.vehicle} • Thermal Seal Locked</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono font-bold mt-1">
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sector Node: {partner.location.area}</span>
              </div>
            </div>
          </div>

          {/* Partner Selector & Duty Switch */}
          <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="bg-[#070b14] text-cyan-300 text-xs font-mono font-bold px-3.5 py-2 rounded-xl border border-cyan-500/30 focus:outline-none cursor-pointer"
            >
              <option value="all">🌐 ALL FLEET NODES ({orders.filter(o => o.status !== 'Delivered').length} Live)</option>
              {deliveryPartners.map((p) => (
                <option key={p.id} value={p.id}>
                  🛵 {p.name} ({p.status})
                </option>
              ))}
            </select>

            <button
              onClick={() => togglePartnerStatus(partner.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-black flex items-center gap-2 transition-all cursor-pointer ${
                partner.status === 'Offline'
                  ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_12px_rgba(0,245,155,0.4)]'
              }`}
            >
              <Power className="w-4 h-4" />
              {partner.status === 'Offline' ? 'FLEET OFFLINE' : 'FLEET ACTIVE (ONLINE)'}
            </button>
          </div>
        </div>

        {/* Performance Metrics Bar */}
        <div className="grid grid-cols-3 gap-3 font-mono">
          <div className="bg-[#070b14] p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
              <Wallet className="w-4 h-4 text-emerald-400" />
              TODAY'S PAYOUT
            </div>
            <div className="text-xl font-black text-emerald-400 mt-1">₹680.00</div>
          </div>

          <div className="bg-[#070b14] p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
              <Package className="w-4 h-4 text-cyan-400" />
              COMPLETED
            </div>
            <div className="text-xl font-black text-white mt-1">{partner.deliveriesCount} trips</div>
          </div>

          <div className="bg-[#070b14] p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
              <Award className="w-4 h-4 text-amber-400" />
              SLA SCORE
            </div>
            <div className="text-xl font-black text-amber-300 mt-1">99.2% ON-TIME</div>
          </div>
        </div>

        {/* Active Delivery Orders */}
        <div>
          <h3 className="text-sm font-mono font-black text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" />
            Active Fleet Missions ({assignedOrders.length})
          </h3>

          {assignedOrders.length === 0 ? (
            <div className="text-center py-16 bg-[#070b14] rounded-2xl border border-slate-800 text-slate-400 font-mono">
              <Truck className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="font-bold text-sm text-white">No active delivery assignments queued.</p>
              <p className="text-xs text-slate-400 mt-1">Fleet unit online and listening on dispatch channel.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignedOrders.map((order) => (
                <div key={order.id} className="bg-[#070b14] p-5 rounded-2xl border border-slate-800 space-y-4 shadow-lg hover:border-cyan-500/40 transition-colors">
                  
                  {/* Order Header */}
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800 font-mono">
                    <div>
                      <span className="font-black text-xs text-cyan-400">{order.id}</span>
                      <h4 className="font-black text-sm text-white">Bounty: ₹55.00 (Base + Thermal Tip)</h4>
                    </div>
                    <span className="bg-[#111c33] text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                      {order.status}
                    </span>
                  </div>

                  {/* Waypoint Routing Breakdown */}
                  <div className="space-y-3 bg-[#111c33]/70 p-4 rounded-xl border border-slate-800 text-xs font-mono">
                    
                    {/* Pickup */}
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        A
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold">PICKUP FROM KITCHEN REACTOR</div>
                        <div className="font-black text-white text-xs">{order.restaurantName}</div>
                      </div>
                    </div>

                    <div className="ml-3 border-l-2 border-dashed border-slate-700 h-4" />

                    {/* Drop */}
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        B
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold">DELIVER TO TARGET WAYPOINT</div>
                        <div className="font-black text-white text-xs">{order.customerName}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{order.deliveryAddress}</div>
                      </div>
                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="bg-[#111c33] hover:bg-[#192b4f] text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 border border-slate-700"
                    >
                      <Phone className="w-3.5 h-3.5 text-cyan-400" /> Comm Direct
                    </a>

                    {order.status === 'Ready' || order.status === 'Preparing' || order.status === 'Accepted' || order.status === 'Placed' ? (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Out for Delivery', 'Rider picked up order from kitchen', partner.id)}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        Confirm Sealed Pickup from Kitchen
                      </button>
                    ) : (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Delivered', 'Order successfully handed over to customer', partner.id)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-[0_0_15px_rgba(0,245,155,0.4)] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Complete Doorstep Handoff
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
