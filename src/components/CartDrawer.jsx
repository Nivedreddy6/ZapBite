import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getSmartPaymentRecommendation } from '../utils/aiPayments';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Sparkles, 
  MapPin,
  ShieldCheck,
  Zap,
  Lock,
  Cpu
} from 'lucide-react';
import { PaymentModal } from './PaymentModal';

export const CartDrawer = () => {
  const { 
    cart, 
    updateCartQuantity, 
    isCartOpen, 
    setIsCartOpen, 
    placeOrder, 
    setActiveTrackingOrderId, 
    savedAddress, 
    saveUserAddress, 
    selectedLocation,
    user 
  } = useApp();

  const [customerName, setCustomerName] = useState(user?.name || 'Rahul Malhotra');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 98765 00112');
  const [houseNo, setHouseNo] = useState(savedAddress?.houseNo || 'Flat 402, Sea Breeze Apartments');
  const [street, setStreet] = useState(savedAddress?.street || 'Beach Road, MVP Colony');
  const [landmark, setLandmark] = useState(savedAddress?.landmark || 'Near Siripuram Circle');
  const [shouldSaveAddress, setShouldSaveAddress] = useState(true);
  const [paymentMode, setPaymentMode] = useState('UPI (PhonePe)');

  // Real-Time Payment Gateway Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const cartSubtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const aiPaymentRec = getSmartPaymentRecommendation(cart.map(c => c.item), cartSubtotal);
  const aiDiscount = aiPaymentRec.savings || 0;

  const deliveryFee = cartSubtotal > 500 ? 0 : 35;
  const taxes = Math.round(cartSubtotal * 0.05);
  const grandTotal = Math.max(0, cartSubtotal + deliveryFee + taxes - aiDiscount);

  const fullDeliveryAddress = `${houseNo}${street ? `, ${street}` : ''}${landmark ? ` (Landmark: ${landmark})` : ''}, ${selectedLocation?.area || 'MVP Colony'}, ${selectedLocation?.city || 'Vizag'}`;

  const handleOpenPaymentModal = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (shouldSaveAddress) {
      saveUserAddress({
        houseNo,
        street,
        landmark,
        city: selectedLocation?.city || 'Vizag'
      });
    }

    setIsPaymentModalOpen(true);
  };

  const handleFinalPaymentSuccess = async () => {
    setIsPaymentModalOpen(false);

    const orderId = await placeOrder({
      customerName,
      customerPhone,
      deliveryAddress: fullDeliveryAddress,
      paymentMode
    });

    if (orderId) {
      setActiveTrackingOrderId(orderId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop with Blur */}
      <div
        className="absolute inset-0 bg-[#040711]/80 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0d1527] text-slate-100 border-l border-emerald-500/30 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-slide-in-right">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#070b14]/90">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-black text-sm text-white">Quantum Cart Vault</h3>
                <p className="text-[10px] text-emerald-400 font-mono">256-BIT ENCRYPTED DISPATCH</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-slate-400 hover:text-white bg-[#111c33] p-1.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#111c33] border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-black text-base text-white">Your vault is empty!</p>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Explore our delicacies menu and add dishes to activate automatic ZapPay AI discounts.
                </p>
              </div>
            ) : (
              cart.map((c) => (
                <div
                  key={c.item.id}
                  className="p-3 bg-[#111c33]/70 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 shadow-md hover:border-emerald-500/30 transition-colors"
                >
                  <img
                    src={c.item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80'}
                    alt={c.item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-white truncate">{c.item.name}</h4>
                    <div className="text-xs font-black text-emerald-400 font-mono mt-0.5">₹{c.item.price * c.quantity}</div>
                  </div>

                  <div className="flex items-center gap-2 bg-[#070b14] border border-slate-700 rounded-xl px-2 py-1">
                    <button
                      onClick={() => updateCartQuantity(c.item.id, -1)}
                      className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black min-w-[14px] text-center font-mono text-white">{c.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(c.item.id, 1)}
                      className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer & ZapPay AI Shield */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-800 bg-[#070b14] space-y-4 max-h-[60vh] overflow-y-auto">
              
              {/* AI Promo Shield Notice */}
              {aiDiscount > 0 && (
                <div className="bg-[#0d2218] border border-emerald-500/40 p-3 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-300 shadow-[0_0_15px_rgba(0,245,155,0.15)]">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                  <span className="font-semibold">{aiPaymentRec.aiAdvice}</span>
                </div>
              )}

              {/* Summary Charges */}
              <div className="space-y-1.5 text-xs text-slate-300 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cart Subtotal</span>
                  <span className="font-mono font-bold text-white">₹{cartSubtotal}</span>
                </div>
                {aiDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>ZapPay AI Discount ({aiPaymentRec.bestOffer?.code})</span>
                    <span className="font-mono">-₹{aiDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Thermal Delivery Protocol</span>
                  <span className="font-mono">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Taxes & Logistics (5%)</span>
                  <span className="font-mono">₹{taxes}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-black text-white">
                  <span>Grand Total</span>
                  <span className="text-emerald-400 font-mono text-lg">₹{grandTotal}</span>
                </div>
              </div>

              {/* Customer Delivery Details Form */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Waypoint Telemetry</span>
                  </label>
                  <span className="text-[10px] bg-[#111c33] text-cyan-300 font-mono font-bold px-2 py-0.5 rounded border border-cyan-500/30">
                    {selectedLocation?.area || 'MVP Colony'}, {selectedLocation?.city || 'Vizag'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Recipient Name"
                    className="bg-[#111c33] text-white text-xs p-2.5 rounded-xl border border-slate-700 font-bold focus:border-emerald-400 focus:outline-none"
                    required
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Mobile Phone"
                    className="bg-[#111c33] text-white text-xs p-2.5 rounded-xl border border-slate-700 font-bold focus:border-emerald-400 focus:outline-none"
                    required
                  />
                </div>

                <input
                  type="text"
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="House / Flat / Door No. & Building Name"
                  className="w-full bg-[#111c33] text-white text-xs p-2.5 rounded-xl border border-slate-700 font-bold focus:border-emerald-400 focus:outline-none"
                  required
                />

                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street / Colony / Area Name"
                  className="w-full bg-[#111c33] text-white text-xs p-2.5 rounded-xl border border-slate-700 font-bold focus:border-emerald-400 focus:outline-none"
                  required
                />

                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Nearby Landmark (Optional)"
                  className="w-full bg-[#111c33] text-white text-xs p-2.5 rounded-xl border border-slate-700 font-medium focus:border-emerald-400 focus:outline-none"
                />

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={shouldSaveAddress}
                    onChange={(e) => setShouldSaveAddress(e.target.checked)}
                    className="rounded border-slate-600 text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-[11px] text-slate-300 font-semibold">Store coordinates for 1-click checkout</span>
                </label>
              </div>

              {/* Payment Mode Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-200">Gateway Protocol</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full bg-[#111c33] text-emerald-300 text-xs p-2.5 rounded-xl border border-emerald-500/40 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="UPI (PhonePe)">UPI Quantum Gateway (PhonePe / GPay)</option>
                  <option value="Credit Card">Encrypted Credit / Debit Card</option>
                  <option value="Cash on Delivery">Cash on Doorstep Delivery</option>
                </select>
              </div>

              <button
                onClick={handleOpenPaymentModal}
                className="w-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 hover:from-emerald-400 hover:to-indigo-400 text-slate-950 font-black py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,245,155,0.4)] active:scale-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Authorize & Pay ₹{grandTotal}</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Real-Time Interactive Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderData={{
          amount: grandTotal,
          items: cart,
          customerName,
          customerPhone,
          deliveryAddress: fullDeliveryAddress,
          paymentMode
        }}
        onPaymentSuccess={handleFinalPaymentSuccess}
      />
    </div>
  );
};
