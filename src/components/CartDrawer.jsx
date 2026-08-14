import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getSmartPaymentRecommendation } from '../utils/aiPayments';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Sparkles, 
  MapPin 
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-slate-900 border-l border-slate-200 flex flex-col shadow-2xl animate-slide-in-right">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-500" />
              <h3 className="font-extrabold text-base text-slate-900">Your Checkout Basket</h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full border border-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-extrabold text-base text-slate-700">Your basket is empty!</p>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Explore our delicacies menu and add dishes to unlock automated ZapPay AI discounts.
                </p>
              </div>
            ) : (
              cart.map((c) => (
                <div
                  key={c.item.id}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
                >
                  <img
                    src={c.item.image}
                    alt={c.item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-xs text-slate-900 truncate">{c.item.name}</h4>
                    <div className="text-xs font-extrabold text-rose-600 mt-0.5">₹{c.item.price * c.quantity}</div>
                  </div>

                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-2xs">
                    <button
                      onClick={() => updateCartQuantity(c.item.id, -1)}
                      className="text-slate-600 hover:text-slate-900 p-0.5"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black min-w-[14px] text-center">{c.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(c.item.id, 1)}
                      className="text-slate-600 hover:text-slate-900 p-0.5"
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
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-4 max-h-[60vh] overflow-y-auto">
              
              {/* AI Promo Shield Notice */}
              {aiDiscount > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{aiPaymentRec.aiAdvice}</span>
                </div>
              )}

              {/* Summary Charges */}
              <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{cartSubtotal}</span>
                </div>
                {aiDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-extrabold">
                    <span>ZapPay AI Discount ({aiPaymentRec.bestOffer?.code})</span>
                    <span>-₹{aiDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & GST (5%)</span>
                  <span>₹{taxes}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-rose-600">₹{grandTotal}</span>
                </div>
              </div>

              {/* Customer Delivery Details Form */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>Saved Delivery Address</span>
                  </label>
                  <span className="text-[10px] bg-rose-50 text-rose-700 font-extrabold px-2 py-0.5 rounded border border-rose-200">
                    {selectedLocation?.area || 'MVP Colony'}, {selectedLocation?.city || 'Vizag'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Name"
                    className="bg-white text-slate-900 text-xs p-2.5 rounded-xl border border-slate-200 font-bold"
                    required
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="bg-white text-slate-900 text-xs p-2.5 rounded-xl border border-slate-200 font-bold"
                    required
                  />
                </div>

                <input
                  type="text"
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="House / Flat / Door No. & Building Name"
                  className="w-full bg-white text-slate-900 text-xs p-2.5 rounded-xl border border-slate-200 font-bold"
                  required
                />

                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street / Colony / Area Name"
                  className="w-full bg-white text-slate-900 text-xs p-2.5 rounded-xl border border-slate-200 font-bold"
                  required
                />

                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Nearby Landmark (Optional e.g. Near Metro Station)"
                  className="w-full bg-white text-slate-900 text-xs p-2.5 rounded-xl border border-slate-200 font-medium"
                />

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={shouldSaveAddress}
                    onChange={(e) => setShouldSaveAddress(e.target.checked)}
                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-[11px] text-slate-600 font-semibold">Save address for future 1-click checkouts</span>
                </label>
              </div>

              {/* Payment Mode Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full bg-white text-slate-900 text-xs p-2.5 rounded-xl border border-slate-200 font-bold"
                >
                  <option value="UPI (PhonePe)">UPI (PhonePe / GooglePay)</option>
                  <option value="Credit Card">Credit / Debit Card</option>
                  <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                </select>
              </div>

              <button
                onClick={handleOpenPaymentModal}
                className="w-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-orange-600 text-white font-extrabold py-3.5 rounded-2xl shadow-md shadow-orange-500/20 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Real-Time Payment Gateway (Pay ₹{grandTotal})</span>
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

