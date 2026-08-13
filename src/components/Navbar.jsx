import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  ChevronDown, 
  Zap,
  Sparkles,
  Compass,
  LogIn,
  LogOut,
  Home,
  MapPin,
  Search,
  X,
  Check
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    user,
    logout,
    cart, 
    setIsCartOpen, 
    isBiteBotOpen, 
    setIsBiteBotOpen,
    setIsLoginModalOpen,
    setIsLandingPageOpen,
    orders,
    selectedLocation,
    setSelectedLocation
  } = useApp();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');

  const totalCartItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  const indianCities = [
    {
      name: 'Visakhapatnam (Vizag)',
      shortName: 'Vizag',
      icon: '🏖️',
      areas: ['MVP Colony', 'Siripuram', 'Beach Road', 'Gajuwaka', 'Jagadamba Junction', 'Madhurawada', 'Seethammadhara']
    },
    {
      name: 'Hyderabad',
      shortName: 'Hyderabad',
      icon: '🏰',
      areas: ['Banjara Hills', 'Jubilee Hills', 'Hitec City', 'Gachibowli', 'Madhapur', 'Kondapur', 'Begumpet']
    },
    {
      name: 'Bengaluru',
      shortName: 'Bengaluru',
      icon: '🌆',
      areas: ['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'MG Road', 'Jayanagar', 'JP Nagar']
    },
    {
      name: 'Mumbai',
      shortName: 'Mumbai',
      icon: '🌊',
      areas: ['Bandra West', 'Powai', 'Andheri West', 'Juhu', 'Lower Parel', 'Colaba', 'Malad West']
    },
    {
      name: 'Delhi NCR',
      shortName: 'Delhi NCR',
      icon: '🏛️',
      areas: ['Connaught Place', 'Cyber City Gurgaon', 'Hauz Khas', 'Noida Sec 18', 'Greater Kailash', 'Saket']
    },
    {
      name: 'Chennai',
      shortName: 'Chennai',
      icon: '⛵',
      areas: ['T. Nagar', 'Adyar', 'Velachery', 'Anna Nagar', 'Nungambakkam', 'Mylapore', 'Besant Nagar']
    }
  ];

  const filteredCities = indianCities.map(cityObj => ({
    ...cityObj,
    areas: cityObj.areas.filter(a => 
      a.toLowerCase().includes(citySearch.toLowerCase()) || 
      cityObj.name.toLowerCase().includes(citySearch.toLowerCase())
    )
  })).filter(cityObj => cityObj.areas.length > 0);

  const handleSelectLocality = (area, cityShort) => {
    setSelectedLocation({ area, city: cityShort });
    setIsLocationModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200/80 shadow-xs transition-all font-sans">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-[11px] font-bold px-4 py-1 text-center text-white flex items-center justify-center gap-2 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
        <span>ZapBite.ai — Smart Food Ordering & Real-Time Delivery Ecosystem</span>
        <span className="bg-black/20 border border-white/20 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider text-amber-100">
          {user ? `Logged in: ${user.role.toUpperCase()}` : 'Pan-India Delivery Network'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand */}
          <div className="flex items-center gap-5">
            <div 
              onClick={() => setIsLandingPageOpen(true)}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="Return to Welcome Landing Page"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 p-0.5 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-rose-500 fill-rose-500 group-hover:text-orange-500 transition-colors" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                    Zap<span className="bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">Bite</span>
                  </span>
                  <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-extrabold px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                    .AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide">Smart Food & Logistics OS</p>
              </div>
            </div>

            {/* Interactive Location Selector Button */}
            {currentRole === 'customer' && (
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="hidden md:flex items-center gap-2 text-xs text-slate-700 bg-slate-50 hover:bg-orange-50/60 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-orange-300 transition-all font-bold group"
                title="Change Delivery City & Area"
              >
                <Compass className="w-3.5 h-3.5 text-rose-500 shrink-0 group-hover:rotate-45 transition-transform" />
                <span className="font-extrabold text-slate-900">{selectedLocation?.area || 'MVP Colony'}</span>
                <span className="text-slate-400 font-medium">| {selectedLocation?.city || 'Vizag'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>

          {/* Compact Role Switcher Selector */}
          <div className="hidden lg:flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200">
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="bg-white text-slate-800 text-xs font-extrabold px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="customer">🍽️ Customer Ordering Portal</option>
              <option value="restaurant">👨‍🍳 Kitchen Operating System ({orders.filter(o => o.status === 'Placed' || o.status === 'Preparing').length} Live)</option>
              <option value="delivery">🛵 Delivery Rider Fleet</option>
              <option value="admin">📊 Admin Command Center</option>
            </select>
          </div>

          {/* Action Buttons & User Profile */}
          <div className="flex items-center gap-2">
            
            {/* Landing Page Button */}
            <button
              onClick={() => setIsLandingPageOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              title="Overview Landing Page"
            >
              <Home className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden xl:inline">About</span>
            </button>

            {/* User Profile Button */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              title="Switch Account / Login"
            >
              {user ? (
                <>
                  <img src={user.avatar} alt="avatar" className="w-5 h-5 rounded-full object-cover border border-orange-400" />
                  <span className="hidden sm:inline max-w-[90px] truncate font-extrabold">{user.name.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 text-orange-500" />
                  <span className="hidden sm:inline">Sign In</span>
                </>
              )}
            </button>

            {/* Logout Button */}
            {user && (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition-all"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden md:inline">Logout</span>
              </button>
            )}

            {/* ZapBot AI Launcher */}
            <button
              onClick={() => setIsBiteBotOpen(!isBiteBotOpen)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border border-amber-300/40 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>ZapBot AI</span>
            </button>

            {/* Cart Slide-Over Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white border border-rose-300/40 px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 ml-1"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>

              {totalCartItems > 0 && (
                <span className="bg-white text-rose-600 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-rose-200">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

    </header>

    {/* Interactive Location Selector Modal */}
    {isLocationModalOpen && (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col p-6 border border-slate-200 shadow-2xl space-y-4 relative overflow-hidden">
          
          {/* Close Button */}
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full border border-slate-200 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="shrink-0 pr-10">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-extrabold text-slate-900">Select Delivery Location</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Choose your city & locality across India for ultra-fast food delivery</p>
          </div>

          {/* Search Input */}
          <div className="relative shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              placeholder="Search your city or area (e.g. Banjara Hills, Koramangala)..."
              className="w-full bg-slate-50 text-slate-900 text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>

          {/* Cities & Localities Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {filteredCities.map((cObj) => (
              <div key={cObj.name} className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 sticky top-0 z-10 backdrop-blur-md">
                  <span>{cObj.icon}</span>
                  <span>{cObj.name}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-1">
                  {cObj.areas.map((areaName) => {
                    const isSelected = selectedLocation?.area === areaName && selectedLocation?.city === cObj.shortName;

                    return (
                      <button
                        key={areaName}
                        onClick={() => handleSelectLocality(areaName, cObj.shortName)}
                        className={`p-2.5 rounded-xl text-xs text-left font-bold border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-xs'
                            : 'bg-white hover:bg-orange-50 border-slate-200 text-slate-700 hover:border-orange-300'
                        }`}
                      >
                        <span className="truncate">{areaName}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Notice */}
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center font-medium shrink-0">
            💡 Selecting a location updates live delivery rider SLAs and restaurant dispatch distances.
          </div>

        </div>
      </div>
    )}
    </>
  );
};
