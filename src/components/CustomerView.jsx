import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getSmartPaymentRecommendation, generatePaymentSecurityScore } from '../utils/aiPayments';
import { AnimatedFoodBanner } from './AnimatedFoodBanner';
import { AnimatedDeliveryIcon } from './AnimatedDeliveryIcon';
import confetti from 'canvas-confetti';
import {
  Search,
  Flame,
  Clock,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  X,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Banknote,
  Utensils,
  MapPin,
  Tag,
  ArrowRight,
  Zap,
  Layers,
  QrCode,
  Lock,
  Percent
} from 'lucide-react';

export const CustomerView = () => {
  const {
    restaurants,
    menuItems,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    placeOrder,
    isCartOpen,
    setIsCartOpen,
    setActiveTrackingOrderId,
    setIsBiteBotOpen
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPureVeg, setIsPureVeg] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  // Checkout Form & ZapPay AI State
  const [customerName, setCustomerName] = useState('Rahul Malhotra');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 00112');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 301, Sunshine Heights, MVP Colony, Vizag');
  const [paymentMode, setPaymentMode] = useState('UPI (PhonePe)');
  const [isPlacing, setIsPlacing] = useState(false);

  const categories = ['All', 'Biryani', 'Burgers', 'Pizzas', 'South Indian', 'Asian', 'Healthy', 'Desserts'];

  // Filter menu items
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesVeg = !isPureVeg || item.isVeg;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRest = !selectedRestaurantId || item.restaurantId === selectedRestaurantId;
    return matchesCategory && matchesVeg && matchesSearch && matchesRest && item.inStock;
  });

  const cartSubtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const aiPaymentRec = getSmartPaymentRecommendation(cart.map(c => c.item), cartSubtotal);
  const aiDiscount = aiPaymentRec.savings || 0;

  const deliveryFee = cartSubtotal > 500 ? 0 : 35;
  const taxes = Math.round(cartSubtotal * 0.05);
  const grandTotal = Math.max(0, cartSubtotal + deliveryFee + taxes - aiDiscount);

  const securityInfo = generatePaymentSecurityScore(paymentMode, grandTotal);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsPlacing(true);

    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ff2e63', '#7b2cbf', '#00f5d4', '#f59e0b']
      });
    } catch (e) {
      console.log(e);
    }

    setTimeout(async () => {
      const orderId = await placeOrder({
        customerName,
        customerPhone,
        deliveryAddress,
        paymentMode
      });
      setIsPlacing(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1329] via-[#0f172a] to-[#1e1b4b] text-slate-100 pb-24">

      {/* Cyber Mesh Hero Section with SVG Animations */}
      <div className="relative pt-6 pb-6 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">

            {/* Animated SVG Hero Banner */}
            <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-900/80 via-purple-900/80 to-slate-900 p-6 text-white border border-rose-500/40 shadow-2xl shadow-rose-950/40 flex flex-col md:flex-row items-center justify-between gap-4">

              <div className="relative z-10 flex-1">
                <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3 backdrop-blur-md">
                  <Zap className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  ZapBite.ai Express Pass
                </div>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
                  FLAT 50% OFF <span className="bg-gradient-to-r from-rose-400 to-purple-300 bg-clip-text text-transparent">+ ZapPay AI Discount</span>
                </h2>

                <p className="text-xs sm:text-sm text-slate-200 mt-1.5 font-medium max-w-md">
                  Experience ultra-fast culinary dispatch. Auto-apply coupon <span className="font-mono bg-rose-500/30 border border-rose-400/40 px-2 py-0.5 rounded font-extrabold text-white">ZAPBITE50</span> at checkout!
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedCategory('Biryani')}
                    className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-rose-500/30 transition-transform active:scale-95 flex items-center gap-2 border border-rose-400/30"
                  >
                    Order Spicy Biryani <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIsBiteBotOpen(true)}
                    className="bg-cyan-950/90 hover:bg-cyan-900/90 border border-cyan-500/50 text-cyan-300 text-xs font-extrabold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,212,0.2)]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Ask AI Recommendation
                  </button>
                </div>
              </div>

              {/* SVG Animated Cooking Pan & Steam Graphic */}
              <div className="w-48 sm:w-56 shrink-0 relative z-10">
                <AnimatedFoodBanner />
              </div>
            </div>

            {/* ZapPay AI Guarantee Card with Animated Delivery Bike */}
            <div className="rounded-3xl bg-slate-900/90 p-5 border border-slate-700/80 flex flex-col justify-between shadow-xl backdrop-blur-xl">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-extrabold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Zap Delivery Engine
                  </div>
                  {/* SVG Animated Rider */}
                  <AnimatedDeliveryIcon />
                </div>

                <h3 className="text-xl font-black text-white mt-1">20-25 Mins SLA Guarantee</h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-medium">
                  Real-time rider assignment & automated kitchen dispatch matrix for ultimate freshness.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-extrabold text-white">4.9 Star Fleet</span>
                </div>
                <span className="text-cyan-300 font-extrabold bg-cyan-500/15 px-2.5 py-1 rounded-lg border border-cyan-500/40 text-[11px]">
                  100% Insulated
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, biryani, pizzas, burgers, ramen, waffles..."
              className="w-full bg-slate-900/90 text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-slate-700/80 focus:outline-none focus:border-cyan-500/80 placeholder-slate-400 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPureVeg(!isPureVeg)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-extrabold transition-all ${isPureVeg
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:text-white'
                }`}
            >
              <div className={`w-3.5 h-3.5 border-2 rounded flex items-center justify-center ${isPureVeg ? 'border-emerald-400 bg-emerald-500/40' : 'border-slate-500'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isPureVeg ? 'bg-emerald-400' : 'bg-transparent'}`} />
              </div>
              Pure Veg Only
            </button>

            {selectedRestaurantId && (
              <button
                onClick={() => setSelectedRestaurantId(null)}
                className="text-xs text-rose-400 hover:underline font-extrabold"
              >
                Clear Kitchen Filter ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${selectedCategory === cat
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/30 border border-rose-400/40'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
                }`}
            >
              {cat === 'All' ? '🍽️ All Delicacies' : cat}
            </button>
          ))}
        </div>

        {/* Kitchen Partners */}
        {!selectedRestaurantId && (
          <div className="mb-8">
            <h3 className="text-lg font-black text-white mb-3.5 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-rose-500" />
              Verified Partner Kitchens
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {restaurants.map((rest) => (
                <div
                  key={rest.id}
                  onClick={() => setSelectedRestaurantId(rest.id)}
                  className="bg-slate-900/90 rounded-3xl overflow-hidden border border-slate-700/80 hover:border-rose-500/50 transition-all cursor-pointer group shadow-xl hover:shadow-2xl hover:shadow-rose-950/30 backdrop-blur-xl"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={rest.image}
                      alt={rest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                    {rest.tag && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg border border-rose-400/30">
                        {rest.tag}
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <div className="flex items-center gap-1 bg-emerald-950/90 text-emerald-300 font-extrabold px-2 py-0.5 rounded-lg border border-emerald-500/40">
                        <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                        {rest.rating} ({rest.ratingCount})
                      </div>
                      <div className="flex items-center gap-1 bg-slate-950/90 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-slate-700 text-[11px] font-bold text-slate-200">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {rest.deliveryTimeMins} mins
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="font-extrabold text-base text-white group-hover:text-rose-400 transition-colors">
                      {rest.name}
                    </h4>
                    <p className="text-xs text-slate-300 truncate mt-0.5">{rest.cuisine}</p>
                    <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {rest.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              {selectedRestaurantId
                ? `Menu from ${restaurants.find(r => r.id === selectedRestaurantId)?.name}`
                : 'Trending Dishes'}
            </h3>
            <span className="text-xs text-slate-300 font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
              {filteredMenuItems.length} Items Available
            </span>
          </div>

          {filteredMenuItems.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/90 rounded-3xl border border-slate-700/80">
              <Utensils className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-extrabold text-white">No dishes matched your filter</h4>
              <p className="text-xs text-slate-400 mt-1">Try resetting your search query or dietary preferences</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setIsPureVeg(false);
                  setSelectedRestaurantId(null);
                }}
                className="mt-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMenuItems.map((item) => {
                const cartItem = cart.find((i) => i.item.id === item.id);

                return (
                  <div
                    key={item.id}
                    className="bg-slate-900/90 rounded-3xl p-4 border border-slate-700/80 flex gap-4 shadow-xl hover:border-rose-500/40 transition-all group backdrop-blur-xl"
                  >
                    <div className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden bg-slate-950">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-slate-950/90 p-0.5 rounded border border-slate-700">
                        <div className={`w-3.5 h-3.5 border-2 rounded flex items-center justify-center ${item.isVeg ? 'border-emerald-500' : 'border-red-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className="font-extrabold text-sm text-white truncate">{item.name}</h4>
                        <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <span className="text-base font-black text-rose-400">₹{item.price}</span>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                            <span className="text-amber-400 font-bold flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-400" /> {item.rating}
                            </span>
                            <span>•</span>
                            <span className="text-cyan-300 font-semibold">{item.calories}</span>
                          </div>
                        </div>

                        {cartItem ? (
                          <div className="flex items-center bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-xl font-bold text-xs p-1 shadow-lg shadow-rose-500/25">
                            <button
                              onClick={() => updateCartQuantity(item.id, -1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-black/20 rounded-lg transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center font-extrabold">{cartItem.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-black/20 rounded-lg transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-slate-950 hover:bg-gradient-to-r hover:from-rose-500 hover:to-purple-600 hover:text-white text-rose-400 border border-rose-500/40 px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1 transition-all active:scale-95 shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            ADD
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Slide-Over Cart Drawer with ZapPay AI */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#0f172a] text-white shadow-2xl flex flex-col border-l border-slate-700">

              {/* Header */}
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-rose-500" />
                  <h3 className="font-black text-base text-white">Your Culinary Cart</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-24 text-slate-400">
                    <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-3" />
                    <p className="font-extrabold text-base text-slate-200">Your basket is empty!</p>
                    <p className="text-xs text-slate-400 mt-1">Browse menu delicacies or ask ZapBot AI for recommendations.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {cart.map(({ item, quantity }) => (
                        <div
                          key={item.id}
                          className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-700/80 flex items-center justify-between gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              <h5 className="font-extrabold text-xs text-white truncate">{item.name}</h5>
                            </div>
                            <span className="text-xs text-rose-400 font-bold">₹{item.price} x {quantity}</span>
                          </div>

                          <div className="flex items-center bg-slate-950 rounded-xl text-xs font-extrabold border border-slate-800">
                            <button
                              onClick={() => updateCartQuantity(item.id, -1)}
                              className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white"
                            >
                              -
                            </button>
                            <span className="w-5 text-center">{quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, 1)}
                              className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-black text-xs text-white w-14 text-right">
                            ₹{item.price * quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* ZapPay AI Smart Coupon Optimizer Banner */}
                    <div className="bg-gradient-to-r from-rose-900/90 via-purple-900/90 to-slate-900 p-3.5 rounded-2xl border border-rose-500/40 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                          <Percent className="w-4 h-4 text-rose-400" />
                          <span className="font-black text-white">ZapPay AI Promo Optimizer</span>
                        </div>
                        {aiDiscount > 0 && (
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            Auto-Applied
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-200 mt-1.5 leading-relaxed font-medium">
                        {aiPaymentRec.aiAdvice}
                      </p>

                      {aiPaymentRec.bestOffer && (
                        <div className="mt-2 text-xs font-mono font-bold text-rose-300 bg-rose-500/20 px-2.5 py-1 rounded-xl border border-rose-400/30 inline-block">
                          Coupon Code: {aiPaymentRec.bestOffer.code} (-₹{aiDiscount})
                        </div>
                      )}
                    </div>

                    {/* Customer Details Form */}
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                      <h4 className="font-black text-xs text-cyan-400 uppercase tracking-wider">Dispatch Address & Payment Mode</h4>

                      <div>
                        <label className="text-[11px] text-slate-400 font-bold block mb-1">Customer Name</label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-slate-950 text-xs text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 font-bold block mb-1">Delivery Address</label>
                        <input
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full bg-slate-950 text-xs text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 font-bold block mb-1">Payment Method</label>
                        <select
                          value={paymentMode}
                          onChange={(e) => setPaymentMode(e.target.value)}
                          className="w-full bg-slate-950 text-xs text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-semibold"
                        >
                          <option value="UPI (PhonePe)">⚡ Instant UPI (PhonePe / GPay / Paytm)</option>
                          <option value="Credit/Debit Card">💳 Credit / Debit Card (ZapPay Shielded)</option>
                          <option value="Cash on Delivery">💵 Cash on Delivery (COD)</option>
                        </select>
                      </div>
                    </div>

                    {/* Dynamic Simulated UPI QR Code Generator */}
                    {paymentMode.includes('UPI') && (
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-2">
                        <div className="flex items-center justify-center gap-1.5 text-xs text-cyan-400 font-bold">
                          <QrCode className="w-4 h-4" />
                          <span>ZapPay AI Dynamic QR Code Generator</span>
                        </div>

                        {/* Simulated QR Code Graphic */}
                        <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-md">
                          <div className="w-full h-full border-2 border-black grid grid-cols-4 gap-1 p-1">
                            <div className="bg-black rounded-sm" />
                            <div className="bg-black rounded-sm" />
                            <div className="bg-slate-300 rounded-sm" />
                            <div className="bg-black rounded-sm" />
                            <div className="bg-slate-300 rounded-sm" />
                            <div className="bg-black rounded-sm" />
                            <div className="bg-black rounded-sm" />
                            <div className="bg-slate-300 rounded-sm" />
                            <div className="bg-black rounded-sm" />
                            <div className="bg-slate-300 rounded-sm" />
                            <div className="bg-black rounded-sm" />
                            <div className="bg-black rounded-sm" />
                            <div className="bg-black rounded-sm" />
                            <div className="bg-black rounded-sm" />
                            <div className="bg-slate-300 rounded-sm" />
                            <div className="bg-black rounded-sm" />
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-400">
                          Scan with PhonePe, GPay, or Paytm for instant ₹{grandTotal} payment
                        </p>
                      </div>
                    )}

                    {/* Bill Breakdown with AI Savings */}
                    <div className="mt-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
                      <div className="flex justify-between text-slate-400 font-medium">
                        <span>Items Subtotal</span>
                        <span>₹{cartSubtotal}</span>
                      </div>

                      {aiDiscount > 0 && (
                        <div className="flex justify-between text-emerald-400 font-extrabold">
                          <span>ZapPay AI Promo Savings</span>
                          <span>-₹{aiDiscount}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-slate-400 font-medium">
                        <span>Express Delivery Fee</span>
                        <span>{deliveryFee === 0 ? <span className="text-emerald-400 font-extrabold">FREE</span> : `₹${deliveryFee}`}</span>
                      </div>

                      <div className="flex justify-between text-slate-400 font-medium">
                        <span>GST & Packaging Charge</span>
                        <span>₹{taxes}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex justify-between font-black text-sm text-white">
                        <span>Grand Total</span>
                        <span className="text-rose-400">₹{grandTotal}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Checkout Button */}
              {cart.length > 0 && (
                <div className="p-4 bg-slate-950 border-t border-slate-800">
                  <button
                    onClick={handleCheckout}
                    disabled={isPlacing}
                    className="w-full bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-purple-700 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-rose-500/30 flex items-center justify-center gap-2 text-sm transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isPlacing ? (
                      <span>ZapPay AI Verifying & Dispatching...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-cyan-300" />
                        <span>Pay ₹{grandTotal} via ZapPay AI</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
