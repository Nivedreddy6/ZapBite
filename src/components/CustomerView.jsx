import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getSmartPaymentRecommendation, generatePaymentSecurityScore } from '../utils/aiPayments';
import { AnimatedFoodBanner } from './AnimatedFoodBanner';
import { AnimatedDeliveryIcon } from './AnimatedDeliveryIcon';
import confetti from 'canvas-confetti';
import {
  Search,
  Clock,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  X,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Banknote,
  Utensils,
  Tag,
  Zap,
  Lock
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
    setIsBiteBotOpen,
    selectedLocation,
    savedAddress,
    saveUserAddress
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPureVeg, setIsPureVeg] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  // Checkout Form State (Structured Saved Address)
  const [customerName, setCustomerName] = useState('Rahul Malhotra');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 00112');
  const [houseNo, setHouseNo] = useState(savedAddress?.houseNo || 'Flat 402, Sea Breeze Apartments');
  const [street, setStreet] = useState(savedAddress?.street || 'Beach Road, MVP Colony');
  const [landmark, setLandmark] = useState(savedAddress?.landmark || 'Near Siripuram Circle');
  const [shouldSaveAddress, setShouldSaveAddress] = useState(true);
  const [paymentMode, setPaymentMode] = useState('UPI (PhonePe)');
  const [isPlacing, setIsPlacing] = useState(false);


  const categories = ['All', 'Biryani', 'Burgers', 'Pizzas', 'South Indian', 'Asian', 'Healthy', 'Desserts'];

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSelectedRestaurantId(null);
  };


  // Filter partner kitchens based on category, veg preference, and search
  const filteredRestaurants = restaurants.filter((rest) => {
    if (isPureVeg && !rest.isPureVeg) return false;
    if (selectedCategory === 'All') return true;
    const catLower = selectedCategory.toLowerCase();
    const cuisineLower = rest.cuisine.toLowerCase();
    const hasMatchingDishes = menuItems.some(
      (m) => m.restaurantId === rest.id && m.category === selectedCategory
    );
    return cuisineLower.includes(catLower) || hasMatchingDishes;
  });

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

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0 || isPlacing) return;

    setIsPlacing(true);

    const fullDeliveryAddress = `${houseNo}${street ? `, ${street}` : ''}${landmark ? ` (Landmark: ${landmark})` : ''}, ${selectedLocation?.area || 'MVP Colony'}, ${selectedLocation?.city || 'Vizag'}`;

    if (shouldSaveAddress) {
      saveUserAddress({
        houseNo,
        street,
        landmark,
        city: selectedLocation?.city || 'Vizag'
      });
    }

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log(err);
    }

    setTimeout(async () => {
      const orderId = await placeOrder({
        customerName,
        customerPhone,
        deliveryAddress: fullDeliveryAddress,
        paymentMode
      });

      setIsPlacing(false);
      if (orderId) {
        setActiveTrackingOrderId(orderId);
      }
    }, 600);
  };


  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-900 pb-20">

      {/* Gourmet Hero Section */}
      <div className="bg-gradient-to-b from-orange-100/60 via-amber-50/40 to-[#fcfbf9] border-b border-orange-200/50 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            
            {/* Left Hero Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-rose-600 text-xs font-extrabold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-orange-500 fill-orange-500" />
                  Smart Neural Concierge & Delivery
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Hot, Delicious Meals Delivered to Your Door in <span className="bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">25 Mins</span>
                </h1>
                <p className="text-sm text-slate-600 mt-2 max-w-xl font-medium leading-relaxed">
                  Browse authentic Hyderabadi biryani, woodfired pizzas, and healthy bowls with automated AI promo savings.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsBiteBotOpen(true)}
                    className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-orange-600 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md shadow-orange-500/20 flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    Ask ZapBot AI Concierge
                  </button>

                  <button
                    onClick={() => setSelectedCategory('Biryani')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-4 py-3 rounded-2xl border border-slate-200 transition-colors"
                  >
                    🌶️ Trending Biryanis
                  </button>
                </div>
              </div>

              {/* Cooking Graphic */}
              <div className="w-48 sm:w-56 shrink-0 relative z-10 mt-4 sm:mt-0">
                <AnimatedFoodBanner />
              </div>
            </div>

            {/* SLA Guarantee Card */}
            <div className="rounded-3xl bg-white p-6 border border-slate-200/80 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600 text-xs font-extrabold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Zap Delivery Engine
                  </div>
                  <AnimatedDeliveryIcon />
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mt-2">20-25 Mins SLA Guarantee</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                  Real-time rider assignment & automated kitchen dispatch matrix for ultimate freshness.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-extrabold text-slate-900">4.9 Star Fleet</span>
                </div>
                <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-[11px]">
                  100% Insulated
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Menu Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* Search & Filters Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-orange-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, biryani, pizzas, burgers, ramen, waffles..."
              className="w-full bg-white text-slate-900 text-xs sm:text-sm pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-orange-500/80 placeholder-slate-400 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPureVeg(!isPureVeg)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-extrabold transition-all ${
                isPureVeg
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`w-3.5 h-3.5 border-2 rounded flex items-center justify-center ${isPureVeg ? 'border-emerald-600 bg-emerald-500' : 'border-slate-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isPureVeg ? 'bg-white' : 'bg-transparent'}`} />
              </div>
              Pure Veg Only
            </button>

            {selectedRestaurantId && (
              <button
                onClick={() => setSelectedRestaurantId(null)}
                className="text-xs text-rose-600 hover:underline font-extrabold"
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
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md shadow-orange-500/20 border border-orange-400/40 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'All' ? '🍽️ All Delicacies' : cat}
            </button>
          ))}
        </div>

        {/* Partner Kitchen Cards */}
        {!selectedRestaurantId && filteredRestaurants.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-extrabold text-slate-900 mb-3.5 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-rose-500" />
              {selectedCategory === 'All' ? 'Verified Partner Kitchens' : `Kitchens Serving ${selectedCategory}`}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRestaurants.map((rest) => (
                <div
                  key={rest.id}
                  onClick={() => setSelectedRestaurantId(rest.id)}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={rest.image}
                      alt={rest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-extrabold text-slate-900 shadow-xs border border-slate-200">
                      {rest.tag}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {rest.rating} ({rest.ratingCount})
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-base text-slate-900 group-hover:text-rose-600 transition-colors">
                        {rest.name}
                      </h4>
                      {rest.isPureVeg && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          Pure Veg
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 truncate">{rest.cuisine}</p>
                    <div className="flex items-center justify-between mt-3 text-xs text-slate-600 pt-2.5 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        {rest.deliveryTimeMins} mins
                      </span>
                      <span className="font-extrabold text-slate-900">{rest.priceForTwo} for two</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dish Items Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-orange-500" />
              {selectedRestaurantId
                ? `Menu for ${restaurants.find((r) => r.id === selectedRestaurantId)?.name}`
                : selectedCategory === 'All'
                ? 'Available Menu Delicacies'
                : `Popular ${selectedCategory} Delicacies`}
            </h3>
            <div className="flex items-center gap-2">
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="text-xs text-rose-600 hover:underline font-bold"
                >
                  Show All Categories ✕
                </button>
              )}
              <span className="text-xs font-bold text-slate-500">{filteredMenuItems.length} Items Available</span>
            </div>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMenuItems.map((item) => {
              const inCartItem = cart.find((c) => c.item.id === item.id);
              const quantity = inCartItem ? inCartItem.quantity : 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Item Image */}
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-extrabold text-slate-900 border border-slate-200">
                        {item.tag}
                      </div>

                      {/* Veg / Non-Veg Indicator */}
                      <div className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-lg border border-slate-200">
                        <div className={`w-3 h-3 border-2 flex items-center justify-center ${item.isVeg ? 'border-emerald-600' : 'border-rose-600'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        </div>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{item.name}</h4>
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                          ★ {item.rating}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                        {item.description}
                      </p>

                      <div className="text-[11px] text-slate-400 font-mono mt-2">
                        {item.calories}
                      </div>
                    </div>
                  </div>

                  {/* Price & Add to Cart Controls */}
                  <div className="p-4 pt-0 flex items-center justify-between mt-2">
                    <span className="text-base font-extrabold text-slate-900">₹{item.price}</span>

                    {quantity > 0 ? (
                      <div className="flex items-center gap-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-xl px-2 py-1">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="hover:bg-orange-100 p-1 rounded-lg transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black min-w-[16px] text-center">{quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="hover:bg-orange-100 p-1 rounded-lg transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        ADD
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

