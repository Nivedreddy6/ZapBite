import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LocationPickerModal } from './LocationPickerModal';
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
    setIsProfileModalOpen,
    setIsLandingPageOpen,
    orders,
    selectedLocation,
    setSelectedLocation,
    detectGPSLocation
  } = useApp();


  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');

  const totalCartItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  const indianCities = [
    {
      name: 'Visakhapatnam (Vizag)',
      shortName: 'Vizag',
      icon: '🏖️',
      areas: [
        'MVP Colony (Sector 1-12)',
        'Siripuram (Dutt Island)',
        'Beach Road (RK Beach)',
        'Madhurawada (IT SEZ)',
        'Dwaraka Nagar (RTC Complex)',
        'Rushikonda (GITAM Univ)',
        'Seethammadhara (HB Colony)',
        'Waltair Uplands (Siripuram)',
        'Lawsons Bay Colony',
        'Gajuwaka (Steel Plant)',
        'Jagadamba Junction',
        'Yendada & Sagar Nagar',
        'Pendurthi & Simhachalam',
        'Kurmannapalem & Duvvada'
      ]
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

            {/* Interactive Live Delivery Location Button (Swiggy / Zomato Style) */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden md:flex items-center gap-2 text-xs text-slate-700 bg-slate-50 hover:bg-orange-50/80 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-orange-300 transition-all font-bold group cursor-pointer shadow-xs"
              title="Change Delivery Location (Live GPS Map)"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-extrabold text-slate-900 truncate max-w-[130px] sm:max-w-[190px]">
                {selectedLocation?.area || 'Locate Me'}
              </span>
              <span className="text-slate-400 font-medium">| {selectedLocation?.city || 'Vizag'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
            </button>
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

            {/* User Profile / Sign In Button */}
            <button
              onClick={() => {
                if (user) {
                  setIsProfileModalOpen(true);
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              title={user ? "View Profile & Past Orders" : "Sign In to ZapBite"}
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

    {/* Live Interactive Map Location Selector Modal */}
    <LocationPickerModal 
      isOpen={isLocationModalOpen} 
      onClose={() => setIsLocationModalOpen(false)} 
    />
    </>
  );
};
