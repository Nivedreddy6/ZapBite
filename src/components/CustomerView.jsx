import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getSmartPaymentRecommendation } from '../utils/aiPayments';
import { AnimatedFoodBanner } from './AnimatedFoodBanner';
import { AnimatedDeliveryIcon } from './AnimatedDeliveryIcon';
import {
  Search,
  Clock,
  Star,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  Utensils,
  Tag,
  Zap,
  Flame,
  Radio,
  SlidersHorizontal,
  Layers,
  Cpu
} from 'lucide-react';

export const CustomerView = () => {
  const {
    restaurants,
    menuItems,
    cart,
    addToCart,
    updateCartQuantity,
    setIsCartOpen,
    setIsBiteBotOpen,
    selectedLocation
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPureVeg, setIsPureVeg] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [activeMood, setActiveMood] = useState('⚡ Fast Fuel');

  const categories = ['All', 'Biryani', 'Burgers', 'Pizzas', 'South Indian', 'Asian', 'Healthy', 'Desserts'];

  const moodMatrix = [
    { label: '⚡ Fast Fuel', icon: '⚡', filter: 'Burgers' },
    { label: '🌶️ Spicy Rush', icon: '🌶️', filter: 'Biryani' },
    { label: '🍕 Matrix Pizza', icon: '🍕', filter: 'Pizzas' },
    { label: '🥗 Clean Keto', icon: '🥗', filter: 'Healthy' },
    { label: '🍜 Asian Synth', icon: '🍜', filter: 'Asian' },
    { label: '🧁 Cyber Sweets', icon: '🧁', filter: 'Desserts' }
  ];

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSelectedRestaurantId(null);
  };

  const handleMoodSelect = (mood) => {
    setActiveMood(mood.label);
    setSelectedCategory(mood.filter);
    setSelectedRestaurantId(null);
  };

  // Filter partner kitchens
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

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 pb-24">

      {/* Cyber Hero Telemetry Terminal */}
      <div className="bg-gradient-to-b from-[#0e172a] via-[#090e1c] to-[#070b14] border-b border-emerald-500/20 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            
            {/* Left Main Terminal HUD */}
            <div className="lg:col-span-2 bg-[#0d1527]/90 rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-[0_0_30px_rgba(0,245,155,0.08)] flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
              
              {/* Background Cyber Circuit Decals */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-black uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>FAST & FRESH FOOD DELIVERY • 25 MIN SLA</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Hot & Delicious Food Delivered to Your Doorstep in <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">25 Mins</span>
                </h1>

                <p className="text-sm text-slate-300 mt-2 max-w-xl font-normal leading-relaxed">
                  Order from top-rated restaurants, track your live delivery rider on the map, and enjoy instant discounts with ZapPay.
                </p>

                {/* Mood & Craving Synthesis Pill Buttons */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-emerald-400 font-bold mr-1 flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3" /> CRAVING:
                  </span>
                  {moodMatrix.map((m) => (
                    <button
                      key={m.label}
                      onClick={() => handleMoodSelect(m)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeMood === m.label
                          ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(0,245,155,0.5)] font-black'
                          : 'bg-[#131e36] text-slate-300 hover:text-white hover:bg-[#1a2c4e] border border-slate-700/80'
                      }`}
                    >
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* AI Concierge Launch Button */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsBiteBotOpen(true)}
                    className="bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 hover:from-emerald-400 hover:to-indigo-400 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(0,245,155,0.4)] flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    Ask BiteBot AI Assistant
                  </button>

                  <button
                    onClick={() => setSelectedCategory('Biryani')}
                    className="bg-[#111c33] hover:bg-[#192b4f] text-emerald-300 font-bold text-xs px-4 py-3 rounded-2xl border border-emerald-500/30 transition-colors flex items-center gap-1.5"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Trending Biryani Specials
                  </button>
                </div>
              </div>

              {/* Holographic Cloche Animation Graphic */}
              <div className="w-48 sm:w-56 shrink-0 relative z-10 mt-4 sm:mt-0">
                <AnimatedFoodBanner />
              </div>
            </div>

            {/* SLA Telemetry & Drone Guarantee HUD */}
            <div className="rounded-3xl bg-[#0d1527]/90 p-6 border border-cyan-500/30 flex flex-col justify-between shadow-[0_0_30px_rgba(6,182,212,0.08)] backdrop-blur-xl h-full">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-black uppercase tracking-wider">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    FLEET TELEMETRY
                  </div>
                  <AnimatedDeliveryIcon />
                </div>

                <h3 className="text-xl font-black text-white mt-2">20-25 Min SLA Protocol</h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-normal">
                  Real-time rider assignment, live satellite route telemetry, and thermal sealed containment.
                </p>

                {/* Telemetry Metrics Bar */}
                <div className="mt-4 grid grid-cols-2 gap-2 bg-[#070b14] p-2.5 rounded-xl border border-slate-800 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[9px]">ACTIVE FLEET</span>
                    <span className="text-emerald-400 font-bold">42 DRONES & RIDERS</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">TEMP SEAL</span>
                    <span className="text-cyan-300 font-bold">68°C THERMAL LOCK</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-black text-white">4.92 / 5.0 Rating</span>
                </div>
                <span className="text-emerald-300 font-mono font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/40 text-[10px]">
                  ● 100% DISPATCHED
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Menu Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Search & Dynamic Filter Terminal */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, biryani, pizzas, burgers, ramen, waffles..."
              className="w-full bg-[#0d1527] text-white text-xs sm:text-sm pl-11 pr-4 py-3 rounded-2xl border border-emerald-500/30 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 placeholder-slate-400 shadow-inner font-medium"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPureVeg(!isPureVeg)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-black transition-all cursor-pointer ${
                isPureVeg
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-400 shadow-[0_0_15px_rgba(0,245,155,0.3)]'
                  : 'bg-[#0d1527] text-slate-300 border-slate-700/80 hover:bg-[#131e36]'
              }`}
            >
              <div className={`w-3.5 h-3.5 border-2 rounded flex items-center justify-center ${isPureVeg ? 'border-emerald-400 bg-emerald-400' : 'border-slate-500'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isPureVeg ? 'bg-slate-950' : 'bg-transparent'}`} />
              </div>
              <span>⚡ Veg Laser Core</span>
            </button>

            {selectedRestaurantId && (
              <button
                onClick={() => setSelectedRestaurantId(null)}
                className="text-xs text-rose-400 hover:text-rose-300 hover:underline font-black bg-rose-950/40 border border-rose-800/60 px-3 py-2 rounded-xl"
              >
                Clear Filter ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Horizon */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,245,155,0.4)] border border-emerald-300/50 scale-105'
                  : 'bg-[#0d1527] text-slate-300 hover:text-white hover:bg-[#14203b] border border-slate-800'
              }`}
            >
              {cat === 'All' ? '⚡ All Delicacies' : cat}
            </button>
          ))}
        </div>

        {/* Partner Kitchen Nodes */}
        {!selectedRestaurantId && filteredRestaurants.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-400" />
                {selectedCategory === 'All' ? 'Top Verified Partner Restaurants' : `Restaurants Serving ${selectedCategory}`}
              </h3>
              <span className="text-xs font-mono text-emerald-400">{filteredRestaurants.length} Restaurants Active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((rest) => (
                <div
                  key={rest.id}
                  onClick={() => setSelectedRestaurantId(rest.id)}
                  className="bg-[#0d1527]/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(0,245,155,0.15)] hover:-translate-y-1 transition-all cursor-pointer group backdrop-blur-md"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={rest.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80'}
                      alt={rest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-[#070b14]/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-mono font-black text-emerald-300 border border-emerald-500/40">
                      ⚡ {rest.tag}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-[#070b14]/90 backdrop-blur-md text-amber-300 text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1 border border-amber-500/30">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {rest.rating} ({rest.ratingCount})
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-base text-white group-hover:text-emerald-300 transition-colors">
                        {rest.name}
                      </h4>
                      {rest.isPureVeg && (
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                          PURE VEG
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 truncate">{rest.cuisine}</p>
                    <div className="flex items-center justify-between mt-3 text-xs text-slate-300 pt-2.5 border-t border-slate-800 font-mono">
                      <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        {rest.deliveryTimeMins} mins
                      </span>
                      <span className="font-bold text-slate-200">{rest.priceForTwo} for two</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dish Items Grid */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-cyan-400" />
              {selectedRestaurantId
                ? `Menu for ${restaurants.find((r) => r.id === selectedRestaurantId)?.name}`
                : selectedCategory === 'All'
                ? 'Popular Dishes & Delicacies'
                : `Popular ${selectedCategory} Dishes`}
            </h3>
            <div className="flex items-center gap-2">
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="text-xs text-emerald-400 hover:underline font-bold"
                >
                  Show All ✕
                </button>
              )}
              <span className="text-xs font-mono font-bold text-slate-400">{filteredMenuItems.length} Dishes Available</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenuItems.map((item) => {
              const inCartItem = cart.find((c) => c.item.id === item.id);
              const quantity = inCartItem ? inCartItem.quantity : 0;

              return (
                <div
                  key={item.id}
                  className="bg-[#0d1527]/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(0,245,155,0.12)] transition-all flex flex-col justify-between backdrop-blur-md group"
                >
                  <div>
                    {/* Item Image & Decals */}
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-[#070b14]/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-mono font-black text-emerald-300 border border-emerald-500/40">
                        {item.tag}
                      </div>

                      {/* Veg / Non-Veg Laser Indicator */}
                      <div className="absolute top-3 right-3 bg-[#070b14]/90 p-1.5 rounded-lg border border-slate-700">
                        <div className={`w-3 h-3 border-2 flex items-center justify-center ${item.isVeg ? 'border-emerald-400' : 'border-rose-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                        </div>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-black text-sm text-white group-hover:text-emerald-300 transition-colors leading-snug">
                          {item.name}
                        </h4>
                        <span className="bg-[#111c33] text-amber-300 border border-amber-500/40 text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                          ★ {item.rating}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                        {item.description}
                      </p>

                      <div className="text-[11px] text-cyan-400 font-mono mt-2 flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        <span>{item.calories}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Add to Cart Controls */}
                  <div className="p-4 pt-0 flex items-center justify-between mt-2 border-t border-slate-800/80 pt-3">
                    <span className="text-base font-black text-white font-mono">₹{item.price}</span>

                    {quantity > 0 ? (
                      <div className="flex items-center gap-2 bg-[#111c33] text-emerald-300 border border-emerald-500/40 rounded-xl px-2 py-1 shadow-[0_0_10px_rgba(0,245,155,0.2)]">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="hover:bg-emerald-500/20 p-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black min-w-[16px] text-center font-mono">{quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="hover:bg-emerald-500/20 p-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-[0_0_12px_rgba(0,245,155,0.3)] active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
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
