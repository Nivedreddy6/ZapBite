import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ArrowLeft, 
  Search, 
  Crosshair, 
  MapPin, 
  Loader2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LocationPickerModal = ({ isOpen, onClose }) => {
  const { selectedLocation, setSelectedLocation, saveUserAddress, showNotification } = useApp();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Default coords: Vizag
  const [coords, setCoords] = useState({
    lat: selectedLocation?.lat || 17.7231,
    lng: selectedLocation?.lng || 83.3012
  });

  const [addressTitle, setAddressTitle] = useState('Acquiring GPS coordinates...');
  const [fullAddress, setFullAddress] = useState('Fetching live satellite & waypoint details...');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Dynamic Reverse Geocoding from Live APIs
  const reverseGeocode = async (lat, lng, customTitle = null) => {
    setIsGeocoding(true);
    try {
      // 1. Primary Live API: OpenStreetMap Nominatim
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`);
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};

        const primaryTitle = customTitle || 
          addr.building || 
          addr.amenity || 
          addr.residential || 
          addr.suburb || 
          addr.neighbourhood || 
          addr.road || 
          addr.village ||
          addr.town ||
          data.name || 
          'Target Waypoint';

        const fullAddrStr = data.display_name || [
          addr.road,
          addr.neighbourhood || addr.suburb,
          addr.city || addr.town || addr.county || addr.district,
          addr.state,
          addr.postcode,
          addr.country || 'India'
        ]
          .filter(Boolean)
          .join(', ');

        setAddressTitle(primaryTitle);
        setFullAddress(fullAddrStr);
        return;
      }
      throw new Error('Nominatim throttled');
    } catch (e) {
      try {
        // 2. Secondary Live API: BigDataCloud Reverse Geocoding
        const bdcRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
        if (bdcRes.ok) {
          const bdc = await bdcRes.json();
          const primaryTitle = customTitle || bdc.locality || bdc.city || 'Target Waypoint';
          const fullAddr = [bdc.locality, bdc.city, bdc.principalSubdivision, bdc.postcode, bdc.countryName].filter(Boolean).join(', ');
          setAddressTitle(primaryTitle);
          setFullAddress(fullAddr);
          return;
        }
      } catch (err) {}

      setAddressTitle(customTitle || 'Target Waypoint');
      setFullAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Live GPS locator
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showNotification('GPS Geolocation is not supported by your browser.', 'error');
      return;
    }

    setIsLocating(true);
    showNotification('🛰️ Quantum Satellite scanning device coordinates...', 'info');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setCoords({ lat: userLat, lng: userLng });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([userLat, userLng], 17, { duration: 1.2 });
        }

        reverseGeocode(userLat, userLng);
        setIsLocating(false);
        showNotification('✅ Satellite GPS locked successfully!', 'success');
      },
      (err) => {
        console.error('GPS error:', err);
        setIsLocating(false);
        showNotification('GPS signal timeout. You can pan the map or search an address.', 'info');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Search address handler with debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Query Komoot Photon Multi-API
        const photonRes = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery.trim())}&limit=5`);
        if (photonRes.ok) {
          const pData = await photonRes.json();
          if (pData && pData.features && pData.features.length > 0) {
            const photonItems = pData.features.map(f => {
              const p = f.properties || {};
              const nameStr = p.name || p.street || p.district || searchQuery;
              const display = [p.name, p.street, p.district, p.city, p.state, p.country].filter(Boolean).join(', ');
              return {
                lat: f.geometry.coordinates[1],
                lng: f.geometry.coordinates[0],
                name: nameStr,
                display_name: display,
                city: p.city || p.district || p.state || 'India'
              };
            });
            setSearchResults(photonItems);
            setIsSearching(false);
            return;
          }
        }

        // Fallback Nominatim
        const nomRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.trim())}&limit=5&countrycodes=in&addressdetails=1`);
        if (nomRes.ok) {
          const nData = await nomRes.json();
          setSearchResults(nData.map(d => ({
            lat: parseFloat(d.lat),
            lng: parseFloat(d.lon),
            name: d.display_name.split(',')[0],
            display_name: d.display_name,
            city: d.address?.city || d.address?.state_district || 'India'
          })));
        }
      } catch (err) {
        console.log('Search fetch error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSearchItem = (item) => {
    const newLat = parseFloat(item.lat);
    const newLng = parseFloat(item.lng);
    setCoords({ lat: newLat, lng: newLng });
    setAddressTitle(item.name || item.display_name.split(',')[0]);
    setFullAddress(item.display_name);
    setSearchResults([]);
    setSearchQuery('');

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([newLat, newLng], 17, { duration: 1.2 });
    }
  };

  const handleDirectPin = () => {
    if (!searchQuery.trim()) return;
    setAddressTitle(searchQuery.trim());
    setSearchResults([]);
    setSearchQuery('');
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!isOpen) return;

    const initTimer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [coords.lat, coords.lng],
          zoom: 17,
          zoomControl: false,
          attributionControl: false
        });

        L.tileLayer('https://{s}.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }).addTo(map);

        map.on('moveend', () => {
          const center = map.getCenter();
          setCoords({ lat: center.lat, lng: center.lng });
          reverseGeocode(center.lat, center.lng);
        });

        map.on('click', (e) => {
          map.flyTo(e.latlng, 17, { duration: 0.8 });
          setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
          reverseGeocode(e.latlng.lat, e.latlng.lng);
        });

        mapInstanceRef.current = map;
        handleUseCurrentLocation();
      } else {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    return () => {
      clearTimeout(initTimer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  const handleConfirmLocation = () => {
    const addrParts = fullAddress.split(',').map(s => s.trim()).filter(Boolean);
    const dynamicCity = addrParts.length >= 3 
      ? addrParts[addrParts.length - 3] 
      : (addrParts[addrParts.length - 2] || 'Vizag');

    const locObj = {
      area: addressTitle || 'Selected Waypoint',
      city: dynamicCity,
      lat: coords.lat,
      lng: coords.lng,
      isGPS: true,
      fullAddress: fullAddress
    };

    setSelectedLocation(locObj);
    saveUserAddress({
      houseNo: addressTitle,
      street: addrParts.slice(0, 2).join(', '),
      landmark: 'Near ' + addressTitle,
      city: dynamicCity
    });

    showNotification(`📍 Target waypoint calibrated to ${addressTitle}!`, 'success');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#040711]/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-fade-in font-sans">
      <div className="bg-[#0d1527] w-full h-full sm:h-[90vh] sm:max-w-lg sm:rounded-3xl flex flex-col relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-emerald-500/30 text-slate-100">
        
        {/* Top Header & Search Bar */}
        <div className="p-3 sm:p-4 bg-[#070b14] border-b border-emerald-500/20 z-[500] relative space-y-3 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#111c33] hover:bg-[#192b4f] text-slate-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">Calibrate Target Coordinates</h2>
              <span className="bg-emerald-950 text-emerald-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                GPS HUD
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, landmark or colony coordinates..."
              className="w-full bg-[#111c33] text-white text-xs pl-10 pr-10 py-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-emerald-400 font-medium transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {isSearching ? (
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
            ) : searchQuery ? (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}

            {/* Search Autocomplete Suggestions Dropdown */}
            {(searchResults.length > 0 || (searchQuery.trim().length > 1 && !isSearching)) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#070b14] rounded-2xl shadow-2xl border border-emerald-500/30 overflow-hidden z-[600] max-h-72 overflow-y-auto">
                {searchQuery.trim() && (
                  <button
                    onClick={handleDirectPin}
                    className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-between border-b border-emerald-400 transition-colors"
                  >
                    <span className="truncate font-mono">📍 Pin as: "<b>{searchQuery.trim()}</b>"</span>
                    <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded text-white shrink-0 ml-2">Apply →</span>
                  </button>
                )}

                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSearchItem(item)}
                    className="w-full px-4 py-3 text-left hover:bg-[#111c33] border-b border-slate-800 flex items-start justify-between gap-3 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                          {item.name || item.display_name.split(',')[0]}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 font-mono">
                          {item.display_name}
                        </div>
                      </div>
                    </div>
                    {item.city && (
                      <span className="shrink-0 text-[10px] font-mono font-bold bg-[#111c33] text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-500/30">
                        {item.city}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Interactive Map Area */}
        <div className="flex-1 relative bg-[#070b14]">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Central Pin Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-[400] pointer-events-none flex flex-col items-center select-none">
            <div className="relative">
              {/* Outer Pin Graphic */}
              <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 via-cyan-400 to-indigo-500 rounded-full p-0.5 shadow-[0_0_20px_rgba(0,245,155,0.7)] flex items-center justify-center border-2 border-[#070b14] animate-bounce-short">
                <div className="w-4 h-4 bg-[#070b14] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                </div>
              </div>
              <div className="w-1.5 h-3 bg-emerald-400 mx-auto rounded-b -mt-0.5"></div>
            </div>
            {/* Pulsing Radar Ring below pin */}
            <div className="w-6 h-2 bg-emerald-400/40 rounded-full blur-[2px] mt-0.5 animate-ping"></div>
          </div>

          {/* Floating 'Current location' Target Button */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="absolute bottom-6 right-6 z-[400] bg-[#070b14]/90 text-emerald-300 hover:text-white font-mono font-bold text-xs px-4 py-2.5 rounded-2xl shadow-[0_0_15px_rgba(0,245,155,0.3)] border border-emerald-500/40 flex items-center gap-2 transition-all active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <Crosshair className={`w-4 h-4 text-emerald-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Scanning GPS...' : 'Lock GPS'}</span>
          </button>
        </div>

        {/* Bottom Address Sheet */}
        <div className="bg-[#070b14] p-4 sm:p-5 border-t border-slate-800 space-y-3 z-20 shadow-2xl">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
            <span>TARGET COORDINATES ACQUIRED</span>
            <button 
              onClick={() => setIsEditingTitle(!isEditingTitle)}
              className="text-cyan-400 hover:underline capitalize text-xs font-bold"
            >
              {isEditingTitle ? 'Done' : 'Edit label'}
            </button>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={addressTitle}
                  onChange={(e) => setAddressTitle(e.target.value)}
                  placeholder="e.g. Sea Breeze Apts / Flat 402"
                  className="w-full bg-[#111c33] text-white text-xs px-3 py-1.5 rounded-xl border border-emerald-400 focus:outline-none font-bold font-mono"
                  autoFocus
                />
              ) : (
                <h3 className="text-sm font-black text-white truncate font-sans">
                  {isGeocoding ? (
                    <span className="flex items-center gap-1.5 text-slate-400 font-mono">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> Pinning telemetry address...
                    </span>
                  ) : (
                    addressTitle
                  )}
                </h3>
              )}
              <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 font-mono">
                {fullAddress}
              </p>
            </div>
          </div>

          {/* Confirm & Proceed Button */}
          <button
            onClick={handleConfirmLocation}
            className="w-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 hover:from-emerald-400 text-slate-950 font-black text-sm py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,245,155,0.4)] flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <span>Confirm & Lock Waypoint</span>
          </button>
        </div>

      </div>
    </div>
  );
};
