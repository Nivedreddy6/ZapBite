import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Navigation, 
  Wallet, 
  Star, 
  Power,
  Package,
  Award
} from 'lucide-react';

export const DeliveryView = () => {
  const { 
    deliveryPartners, 
    orders, 
    updateOrderStatus, 
    togglePartnerStatus 
  } = useApp();

  const [selectedPartnerId, setSelectedPartnerId] = useState('all'); // Default to All Active Delivery Fleet

  const partner = deliveryPartners.find((p) => p.id === selectedPartnerId) || deliveryPartners[0];
  const assignedOrders = orders.filter((o) => {
    if (o.status === 'Delivered') return false;
    if (selectedPartnerId === 'all') return true;
    return o.deliveryPartnerId === partner?.id || !o.deliveryPartnerId;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-100">
      
      {/* Rider Header & Profile */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <img
              src={partner.avatar}
              alt={partner.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{selectedPartnerId === 'all' ? 'All Active Fleet Operations' : partner.name}</h2>
                <span className="bg-amber-400/20 text-amber-300 text-xs font-extrabold px-2 py-0.5 rounded-md">
                  ★ {partner.rating}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{partner.vehicle}</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
                <Navigation className="w-3 h-3" />
                <span>Near {partner.location.area}</span>
              </div>
            </div>
          </div>

          {/* Partner Selector Dropdown & Duty Switch */}
          <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="bg-slate-950 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none"
            >
              <option value="all">🌐 All Active Fleet Tasks ({orders.filter(o => o.status !== 'Delivered').length} Live)</option>
              {deliveryPartners.map((p) => (
                <option key={p.id} value={p.id}>
                  🛵 {p.name} ({p.status})
                </option>
              ))}
            </select>

            <button
              onClick={() => togglePartnerStatus(partner.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow ${
                partner.status === 'Offline'
                  ? 'bg-red-950 text-red-400 border border-red-500/40'
                  : 'bg-emerald-600 text-white shadow-emerald-600/30'
              }`}
            >
              <Power className="w-4 h-4" />
              {partner.status === 'Offline' ? 'Duty Offline' : 'Duty Online'}
            </button>
          </div>
        </div>

        {/* Today's Earnings & Performance Bar */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <Wallet className="w-4 h-4 text-emerald-400" />
              Today's Earnings
            </div>
            <div className="text-xl font-black text-emerald-400 mt-1">₹680.00</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <Package className="w-4 h-4 text-orange-400" />
              Completed
            </div>
            <div className="text-xl font-black text-white mt-1">{partner.deliveriesCount} trips</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <Award className="w-4 h-4 text-amber-400" />
              Satisfaction
            </div>
            <div className="text-xl font-black text-amber-300 mt-1">98% Positive</div>
          </div>
        </div>

        {/* Assigned Active Delivery Tasks */}
        <div>
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Truck className="w-4 h-4 text-orange-500" />
            Active Delivery Orders ({assignedOrders.length})
          </h3>

          {assignedOrders.length === 0 ? (
            <div className="text-center py-16 bg-slate-950 rounded-2xl border border-slate-800 text-slate-400">
              <Truck className="w-12 h-12 text-slate-700 mx-auto mb-2" />
              <p className="font-bold text-sm text-slate-300">No active delivery assignments right now.</p>
              <p className="text-xs text-slate-500 mt-1">You are online and queued for the next customer order nearby.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignedOrders.map((order) => (
                <div key={order.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  
                  {/* Order Top Strip */}
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <div>
                      <span className="font-mono font-extrabold text-xs text-orange-400">{order.id}</span>
                      <h4 className="font-bold text-sm text-white">Earn ₹55 (Base + Tip)</h4>
                    </div>
                    <span className="bg-orange-500/20 text-orange-400 text-xs font-extrabold px-3 py-1 rounded-full border border-orange-500/30">
                      {order.status}
                    </span>
                  </div>

                  {/* Pickup & Drop Addresses */}
                  <div className="space-y-3 bg-slate-900 p-4 rounded-xl text-xs">
                    
                    {/* Pickup */}
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        A
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold">PICKUP FROM RESTAURANT</div>
                        <div className="font-extrabold text-white text-xs">{order.restaurantName}</div>
                      </div>
                    </div>

                    <div className="ml-3 border-l-2 border-dashed border-slate-700 h-4" />

                    {/* Drop */}
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        B
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold">DELIVER TO CUSTOMER</div>
                        <div className="font-extrabold text-white text-xs">{order.customerName}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{order.deliveryAddress}</div>
                      </div>
                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Customer
                    </a>

                    {order.status === 'Ready' || order.status === 'Preparing' || order.status === 'Accepted' || order.status === 'Placed' ? (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Out for Delivery', 'Rider picked up order from kitchen', partner.id)}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs py-2.5 rounded-xl shadow active:scale-95 transition-all"
                      >
                        Confirm Pickup from Kitchen
                      </button>
                    ) : (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Delivered', 'Order successfully handed over to customer', partner.id)}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Mark Order Delivered
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
