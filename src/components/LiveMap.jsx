import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Gauge, 
  Activity, 
  Locate, 
  Maximize2
} from 'lucide-react';


// Default mock coordinates (Vizag City Hub -> Beach Road Sector 4)
const KITCHEN_COORDS = [17.7231, 83.3012];
const DOORSTEP_COORDS = [17.7395, 83.3168];

// Real street-following waypoints simulating real GPS telemetry
const FULL_ROUTE_POINTS = [
  [17.7231, 83.3012], // Kitchen Hub
  [17.7245, 83.3028],
  [17.7262, 83.3045],
  [17.7280, 83.3070],
  [17.7298, 83.3092],
  [17.7315, 83.3110],
  [17.7335, 83.3128],
  [17.7358, 83.3142],
  [17.7378, 83.3155],
  [17.7395, 83.3168]  // Doorstep
];

const TILE_SERVERS = {
  swiggy: {
    name: 'Swiggy Clean',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
  },
  dark: {
    name: 'Cyber Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
  },
  streets: {
    name: 'OSM Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  }
};

export const LiveMap = ({ orderStatus, restaurantName, deliveryAddress, partnerName }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const completedPolylineRef = useRef(null);
  const remainingPolylineRef = useRef(null);

  const [activeTheme, setActiveTheme] = useState('swiggy');
  const [currentProgress, setCurrentProgress] = useState(0.5); // 0 to 1
  const [riderCoords, setRiderCoords] = useState(FULL_ROUTE_POINTS[0]);
  const [telemetrySpeed, setTelemetrySpeed] = useState(32);
  const [distanceLeftKm, setDistanceLeftKm] = useState('1.4');

  // Compute progress ratio based on order status
  useEffect(() => {
    let targetProgress = 0.05;
    if (orderStatus === 'Placed') targetProgress = 0.05;
    else if (orderStatus === 'Accepted') targetProgress = 0.12;
    else if (orderStatus === 'Preparing') targetProgress = 0.20;
    else if (orderStatus === 'Ready') targetProgress = 0.30;
    else if (orderStatus === 'Out for Delivery') targetProgress = 0.65;
    else if (orderStatus === 'Delivered') targetProgress = 1.0;

    setCurrentProgress(targetProgress);
  }, [orderStatus]);

  // Live animation loop for "Out for Delivery" rider movement
  useEffect(() => {
    let animationInterval;
    if (orderStatus === 'Out for Delivery') {
      animationInterval = setInterval(() => {
        setCurrentProgress((prev) => {
          if (prev >= 0.95) return 0.95;
          return prev + 0.012;
        });
        setTelemetrySpeed(Math.floor(28 + Math.random() * 8));
      }, 2000);
    } else if (orderStatus === 'Delivered') {
      setCurrentProgress(1.0);
      setTelemetrySpeed(0);
    } else {
      setTelemetrySpeed(0);
    }

    return () => clearInterval(animationInterval);
  }, [orderStatus]);

  // Interpolate rider coordinates based on currentProgress
  useEffect(() => {
    const totalSegments = FULL_ROUTE_POINTS.length - 1;
    const scaledIndex = currentProgress * totalSegments;
    const segIndex = Math.min(Math.floor(scaledIndex), totalSegments - 1);
    const fraction = scaledIndex - segIndex;

    const p1 = FULL_ROUTE_POINTS[segIndex];
    const p2 = FULL_ROUTE_POINTS[segIndex + 1] || p1;

    const lat = p1[0] + (p2[0] - p1[0]) * fraction;
    const lng = p1[1] + (p2[1] - p1[1]) * fraction;

    const newRiderPos = [lat, lng];
    setRiderCoords(newRiderPos);

    // Calculate approximate distance remaining
    const totalDist = 2.8; // km
    const remDist = (totalDist * (1 - currentProgress)).toFixed(1);
    setDistanceLeftKm(remDist > 0 ? remDist : '0.0');

    // Update marker on Leaflet map if initialized
    if (riderMarkerRef.current) {
      riderMarkerRef.current.setLatLng(newRiderPos);
    }

    // Update completed & remaining polyline path splits
    if (completedPolylineRef.current && remainingPolylineRef.current) {
      const completedPts = FULL_ROUTE_POINTS.slice(0, segIndex + 1);
      completedPts.push(newRiderPos);
      completedPolylineRef.current.setLatLngs(completedPts);

      const remainingPts = [newRiderPos, ...FULL_ROUTE_POINTS.slice(segIndex + 1)];
      remainingPolylineRef.current.setLatLngs(remainingPts);
    }
  }, [currentProgress]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: KITCHEN_COORDS,
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Add Tile Layer
    const tileConfig = TILE_SERVERS[activeTheme];
    const tileLayer = L.tileLayer(tileConfig.url, { maxZoom: 19 }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Custom DivIcon for Kitchen Hub
    const kitchenIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="relative flex flex-col items-center group">
          <div class="w-10 h-10 rounded-2xl bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center text-white font-extrabold text-sm animate-pulse">
            🏪
          </div>
          <div class="mt-1 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md border border-slate-700 whitespace-nowrap">
            ${restaurantName || 'Kitchen Hub'}
          </div>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 45]
    });

    // Custom DivIcon for Customer Doorstep
    const doorstepIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="relative flex flex-col items-center group">
          <div class="w-10 h-10 rounded-2xl bg-emerald-500 border-2 border-white shadow-xl flex items-center justify-center text-white font-extrabold text-sm">
            📍
          </div>
          <div class="mt-1 bg-slate-900/90 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md border border-emerald-500/40 whitespace-nowrap">
            Doorstep Delivery
          </div>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 45]
    });

    // Custom DivIcon for Rider
    const riderIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="relative flex flex-col items-center group">
          <div class="relative w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 p-0.5 shadow-2xl animate-bounce">
            <div class="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-amber-400 text-lg border border-white/20">
              🛵
            </div>
            <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
          </div>
          <div class="mt-1 bg-orange-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap border border-orange-300">
            ${partnerName || 'ZapRider'} • Live GPS
          </div>
        </div>
      `,
      iconSize: [48, 55],
      iconAnchor: [24, 50]
    });

    // Add Kitchen Marker
    L.marker(KITCHEN_COORDS, { icon: kitchenIcon })
      .addTo(map)
      .bindPopup(`<b>${restaurantName || 'Kitchen Hub'}</b><br/>Order verified & dispatched here.`);

    // Add Doorstep Marker
    L.marker(DOORSTEP_COORDS, { icon: doorstepIcon })
      .addTo(map)
      .bindPopup(`<b>Destination</b><br/>${deliveryAddress || 'Customer Doorstep'}`);

    // Add Live Rider Marker
    const riderMarker = L.marker(FULL_ROUTE_POINTS[0], { icon: riderIcon, zIndexOffset: 1000 }).addTo(map);
    riderMarker.bindPopup(`<b>${partnerName || 'Delivery Rider'}</b><br/>Live GPS Telemetry Active.`);
    riderMarkerRef.current = riderMarker;

    // Completed Route Polyline (Solid Vibrant Rose/Orange)
    const completedPolyline = L.polyline([FULL_ROUTE_POINTS[0]], {
      color: '#f97316',
      weight: 6,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);
    completedPolylineRef.current = completedPolyline;

    // Remaining Route Polyline (Dashed Light Grey/Rose)
    const remainingPolyline = L.polyline(FULL_ROUTE_POINTS, {
      color: '#94a3b8',
      weight: 5,
      dashArray: '8, 8',
      opacity: 0.6,
      lineCap: 'round'
    }).addTo(map);
    remainingPolylineRef.current = remainingPolyline;

    // Fit map bounds to encompass full route
    const bounds = L.latLngBounds(FULL_ROUTE_POINTS);
    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Theme switch effect
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const config = TILE_SERVERS[activeTheme];
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    tileLayerRef.current = L.tileLayer(config.url, { maxZoom: 19 }).addTo(mapInstanceRef.current);
  }, [activeTheme]);

  // Center on Rider action
  const handleRecenterRider = () => {
    if (mapInstanceRef.current && riderCoords) {
      mapInstanceRef.current.flyTo(riderCoords, 16, { duration: 1.2 });
    }
  };

  // Fit Full Route action
  const handleFitRoute = () => {
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds(FULL_ROUTE_POINTS);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return (
    <div className="relative w-full h-[420px] rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 group">

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Telemetry Overlay Header */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Status Badge */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/80 shadow-lg text-white flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Live Swiggy Telemetry</div>
            <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <span>{orderStatus}</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-400 font-mono">{distanceLeftKm} km to doorstep</span>
            </div>
          </div>
        </div>

        {/* Right Telemetry Stats Pill */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-700/80 shadow-lg flex items-center gap-4 text-white font-mono text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <span>{telemetrySpeed} km/h</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-cyan-300">
            <Activity className="w-4 h-4" />
            <span>GPS 99%</span>
          </div>
        </div>
      </div>

      {/* Map Control Buttons Overlay (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        
        {/* Theme Switcher Toggle */}
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 shadow-xl flex items-center gap-1">
          {Object.keys(TILE_SERVERS).map((themeKey) => (
            <button
              key={themeKey}
              onClick={() => setActiveTheme(themeKey)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all ${
                activeTheme === themeKey
                  ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {TILE_SERVERS[themeKey].name}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleRecenterRider}
            className="bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-orange-400 p-2.5 rounded-2xl border border-slate-700/80 shadow-xl flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95"
            title="Recenter on Rider"
          >
            <Locate className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline">Track Rider</span>
          </button>

          <button
            onClick={handleFitRoute}
            className="bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-slate-300 p-2.5 rounded-2xl border border-slate-700/80 shadow-xl transition-all active:scale-95"
            title="Fit Full Route"
          >
            <Maximize2 className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Bottom Floating Route Info Bar (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 max-w-[280px] sm:max-w-xs bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 shadow-xl text-white text-xs space-y-1">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span>Route Trajectory</span>
          <span className="text-orange-400 font-mono">{Math.round(currentProgress * 100)}% Progress</span>
        </div>
        <div className="flex items-center gap-2 text-slate-200 font-semibold truncate text-xs">
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          <span className="truncate">{restaurantName || 'Kitchen Hub'}</span>
          <span className="text-slate-500 font-mono">→</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="truncate">{deliveryAddress || 'Doorstep'}</span>
        </div>
      </div>

    </div>
  );
};
