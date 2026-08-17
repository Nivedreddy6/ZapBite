import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ArrowLeft, 
  Search, 
  Crosshair, 
  MapPin, 
  Navigation, 
  Check, 
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

  const [addressTitle, setAddressTitle] = useState('Locating address...');
  const [fullAddress, setFullAddress] = useState('Fetching live street & building details...');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // 100% Pure Dynamic Reverse Geocoding from Live APIs (Nominatim + BigDataCloud)
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
          'Selected Location';

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
          const primaryTitle = customTitle || bdc.locality || bdc.city || 'Selected Location';
          const fullAddr = [bdc.locality, bdc.city, bdc.principalSubdivision, bdc.postcode, bdc.countryName].filter(Boolean).join(', ');
          setAddressTitle(primaryTitle);
          setFullAddress(fullAddr);
          return;
        }
      } catch (err) {}

      setAddressTitle(customTitle || 'Current Location');
      setFullAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Live GPS locator (queries device browser GPS anywhere on Earth)
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showNotification('GPS Geolocation is not supported by your browser.', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = pos.coords.latitude;
        const newLng = pos.coords.longitude;
        setCoords({ lat: newLat, lng: newLng });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([newLat, newLng], 17, { duration: 1.2 });
        }
        reverseGeocode(newLat, newLng);
        setIsLocating(false);
      },
      (err) => {
        console.log('GPS error', err);
        setIsLocating(false);
        showNotification('Could not detect GPS. Drag the map to pin your location.', 'info');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // 100% Pure Live API Autocomplete Search across entire India
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const normalizedQuery = searchQuery
          .replace(/vizag/gi, 'Visakhapatnam')
          .replace(/pm palem|pm\b/gi, 'Pothinamallayya Palem')
          .replace(/hyd\b/gi, 'Hyderabad')
          .replace(/blr\b|bangalore/gi, 'Bengaluru')
          .replace(/[\s,]+/g, ' ')
          .trim();

        const cleanKeywords = normalizedQuery
          .replace(/\b(near|opp|opposite|behind|beside|in|at|near by|mall|malls|road|street|colony|apartments?|flats?)\b/gi, '')
          .replace(/\s+/g, ' ')
          .trim();

        const searchKeyword = cleanKeywords || normalizedQuery;

        // 1. Google Places / Map Suggest API
        const googlePromise = fetch(`https://suggestqueries.google.com/complete/search?client=chrome&hl=en&gl=in&q=${encodeURIComponent(searchKeyword)}`)
          .then(r => r.ok ? r.json() : [])
          .then(async (data) => {
            const suggestions = (data && data[1]) ? data[1].slice(0, 4) : [];
            // Resolve coordinates for top Google suggestions via Photon
            const resolved = await Promise.all(suggestions.map(async (sug) => {
              try {
                const r = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(sug)}&limit=1&lat=${coords.lat}&lon=${coords.lng}`);
                const d = await r.json();
                if (d.features && d.features[0]) {
                  const f = d.features[0];
                  return {
                    name: sug,
                    display_name: sug + ', India',
                    lat: f.geometry?.coordinates[1]?.toString(),
                    lon: f.geometry?.coordinates[0]?.toString(),
                    city: f.properties?.city || f.properties?.state || 'India',
                    isGoogle: true
                  };
                }
              } catch (e) {}
              return null;
            }));
            return resolved.filter(Boolean);
          })
          .catch(() => []);

        // 2. Komoot Photon API (Global OSM POIs, buildings, streets with proximity)
        const photonPromise = fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchKeyword)}&limit=12&lat=${coords.lat}&lon=${coords.lng}`)
          .then(r => r.ok ? r.json() : { features: [] })
          .then(d => (d.features || []).map(f => {
            const props = f.properties || {};
            const cityName = props.city || props.town || props.district || props.state || '';
            const disp = [props.name, props.street, props.suburb, props.city, props.state, props.postcode, 'India']
              .filter(Boolean)
              .join(', ')
              .replace(/Anakapalli - Visakhapatnam - Anandapuram Main Road - /gi, '')
              .replace(/Old NH16 Road, /gi, '');

            return {
              name: props.name || disp.split(',')[0],
              display_name: disp,
              lat: f.geometry?.coordinates[1]?.toString(),
              lon: f.geometry?.coordinates[0]?.toString(),
              city: cityName
            };
          }))
          .catch(() => []);

        // 3. OpenStreetMap Nominatim Live Search API (with full address details)
        const nominatimPromise = fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchKeyword)}&countrycodes=in&limit=12&addressdetails=1&accept-language=en`)
          .then(r => r.ok ? r.json() : [])
          .then(data => data.map(item => {
            const addr = item.address || {};
            const cityName = addr.city || addr.town || addr.county || addr.state_district || addr.state || '';
            const disp = item.display_name
              .replace(/Anakapalli - Visakhapatnam - Anandapuram Main Road - /gi, '')
              .replace(/Old NH16 Road, /gi, '');

            return {
              name: item.name || disp.split(',')[0],
              display_name: disp,
              lat: item.lat,
              lon: item.lon,
              city: cityName
            };
          }))
          .catch(() => []);

        // 4. Open-Meteo Geocoding Live Search API (Zero-rate-limit global search)
        const meteoPromise = fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanKeywords || normalizedQuery)}&count=10&language=en&format=json`)
          .then(r => r.ok ? r.json() : { results: [] })
          .then(d => (d.results || []).map(r => ({
            name: r.name,
            display_name: [r.name, r.admin2, r.admin1, r.country].filter(Boolean).join(', '),
            lat: r.latitude.toString(),
            lon: r.longitude.toString(),
            city: r.admin1 || r.country
          })))
          .catch(() => []);

        const [googleResults, photonResults, nominatimResults, meteoResults] = await Promise.all([
          googlePromise, 
          photonPromise, 
          nominatimPromise, 
          meteoPromise
        ]);

        // Merge and deduplicate all live API results
        const merged = [];
        const seen = new Set();

        for (const item of [...googleResults, ...photonResults, ...nominatimResults, ...meteoResults]) {
          if (!item.lat || !item.lon) continue;
          const key = `${parseFloat(item.lat).toFixed(3)}_${parseFloat(item.lon).toFixed(3)}`;
          if (!seen.has(key)) {
            seen.add(key);
            merged.push(item);
          }
        }

        setSearchResults(merged);
      } catch (e) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Search item select
  const handleSelectSearchItem = (item) => {
    const newLat = parseFloat(item.lat);
    const newLng = parseFloat(item.lon);
    const placeTitle = item.name ? item.name.split('(')[0].trim() : item.display_name.split(',')[0];

    setCoords({ lat: newLat, lng: newLng });
    setSearchQuery('');
    setSearchResults([]);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([newLat, newLng], 17, { duration: 1.2 });
    }
    reverseGeocode(newLat, newLng, placeTitle);
  };

  // Direct Pin Button click handler (Applies custom searched place name or #1 match)
  const handleDirectPin = () => {
    if (searchResults.length > 0) {
      handleSelectSearchItem(searchResults[0]);
      return;
    }

    const rawSearch = searchQuery.trim();
    if (!rawSearch) return;

    setAddressTitle(rawSearch);
    setSearchQuery('');
    setSearchResults([]);
    reverseGeocode(coords.lat, coords.lng, rawSearch);
    showNotification(`📍 Pinned at: ${rawSearch}`, 'success');
  };

  // Initialize Map
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

        // Click anywhere on map to instantly fly and pin exact spot
        map.on('click', (e) => {
          map.flyTo(e.latlng, 17, { duration: 0.8 });
          setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
          reverseGeocode(e.latlng.lat, e.latlng.lng);
        });

        mapInstanceRef.current = map;

        // Auto trigger GPS on open
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
    // Extract dynamic city from address tokens
    const addrParts = fullAddress.split(',').map(s => s.trim()).filter(Boolean);
    const dynamicCity = addrParts.length >= 3 
      ? addrParts[addrParts.length - 3] 
      : (addrParts[addrParts.length - 2] || 'India');

    const locObj = {
      area: addressTitle || 'Selected Location',
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

    showNotification(`📍 Delivery address set to ${addressTitle}!`, 'success');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full h-full sm:h-[90vh] sm:max-w-lg sm:rounded-3xl flex flex-col relative overflow-hidden shadow-2xl">
        
        {/* Top Header & Search Bar (Swiggy Style) */}
        <div className="p-3 sm:p-4 bg-white border-b border-slate-100 z-[500] relative space-y-3 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-extrabold text-slate-900">Select Your Location</h2>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search an area or address"
              className="w-full bg-slate-50 text-slate-900 text-xs pl-10 pr-10 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-orange-500 font-medium transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {isSearching ? (
              <Loader2 className="w-4 h-4 text-orange-500 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
            ) : searchQuery ? (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}

            {/* Search Autocomplete Suggestions Dropdown */}
            {(searchResults.length > 0 || (searchQuery.trim().length > 1 && !isSearching)) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[600] max-h-72 overflow-y-auto">
                {searchQuery.trim() && (
                  <button
                    onClick={handleDirectPin}
                    className="w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs flex items-center justify-between border-b border-orange-400 transition-colors"
                  >
                    <span className="truncate">📍 Pin as: "<b>{searchQuery.trim()}</b>"</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white shrink-0 ml-2">Apply →</span>
                  </button>
                )}

                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSearchItem(item)}
                    className="w-full px-4 py-3 text-left hover:bg-orange-50/70 border-b border-slate-100 flex items-start justify-between gap-3 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 group-hover:text-orange-600 truncate">
                          {item.name || item.display_name.split(',')[0]}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">
                          {item.display_name}
                        </div>
                      </div>
                    </div>
                    {item.city && (
                      <span className="shrink-0 text-[10px] font-extrabold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md border border-orange-200">
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
        <div className="flex-1 relative bg-slate-100">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Central Pin Marker (Swiggy / Google style) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-[400] pointer-events-none flex flex-col items-center select-none">
            <div className="relative">
              {/* Outer Pin Graphic */}
              <div className="w-10 h-10 bg-gradient-to-tr from-rose-600 to-orange-500 rounded-full p-0.5 shadow-2xl shadow-rose-500/50 flex items-center justify-center border-2 border-white animate-bounce-short">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                </div>
              </div>
              <div className="w-1.5 h-3 bg-slate-900 mx-auto rounded-b -mt-0.5"></div>
            </div>
            {/* Shadow beneath pin */}
            <div className="w-4 h-1.5 bg-black/30 rounded-full blur-[1px] mt-0.5"></div>
          </div>

          {/* Floating 'Current location' Target Button */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="absolute bottom-6 right-6 z-[400] bg-white text-slate-800 hover:text-orange-600 font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Crosshair className={`w-4 h-4 text-orange-500 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Current location'}</span>
          </button>
        </div>

        {/* Bottom Address Sheet (Exact Swiggy Match) */}
        <div className="bg-white p-4 sm:p-5 border-t border-slate-100 space-y-3 z-20 shadow-xl">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Place the pin at exact delivery location</span>
            <button 
              onClick={() => setIsEditingTitle(!isEditingTitle)}
              className="text-orange-600 hover:underline capitalize text-xs font-extrabold"
            >
              {isEditingTitle ? 'Done' : 'Edit building name'}
            </button>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-rose-600" />
            </div>
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={addressTitle}
                  onChange={(e) => setAddressTitle(e.target.value)}
                  placeholder="e.g. Sri Sai Paradise / Flat 201"
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-1.5 rounded-xl border border-orange-400 focus:outline-none font-bold"
                  autoFocus
                />
              ) : (
                <h3 className="text-sm font-extrabold text-slate-900 truncate">
                  {isGeocoding ? (
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" /> Pinning exact address...
                    </span>
                  ) : (
                    addressTitle
                  )}
                </h3>
              )}
              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 font-medium">
                {fullAddress}
              </p>
            </div>
          </div>

          {/* Confirm & Proceed Button */}
          <button
            onClick={handleConfirmLocation}
            className="w-full bg-[#ff5200] hover:bg-[#e04800] text-white font-black text-sm py-3.5 rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <span>Confirm & proceed</span>
          </button>
        </div>

      </div>
    </div>
  );
};
