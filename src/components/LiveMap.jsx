import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Gauge, 
  Activity, 
  Locate, 
  Maximize2
} from 'lucide-react';

// Default coordinates (Vizag Node -> Beach Road Sector 4)
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
  dark: {
    name: 'Cyber Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO'
  },
  satellite: {
    name: 'Satellite HUD',
    url: 'https://{s}.google.com/vt/lyrs=s,h&hl=en&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps'
  },
  standard: {
    name: 'Street Vector',
    url: 'https://{s}.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps'
  }
};

export const LiveMap = ({ orderStatus, restaurantName, deliveryAddress, partnerName }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const completedPolylineRef = useRef(null);
  const remainingPolylineRef = useRef(null);

  const [activeTheme, setActiveTheme] = useState('standard');
  const [currentProgress, setCurrentProgress] = useState(0.5); // 0 to 1
  const [riderCoords, setRiderCoords] = useState(FULL_ROUTE_POINTS[0]);
  const [telemetrySpeed, setTelemetrySpeed] = useState(34);
  const [distanceLeftKm, setDistanceLeftKm] = useState('1.4');

  // Compute progress ratio based on order status
  useEffect(() => {
    let targetProgress = 0.05;
    if (orderStatus === 'Placed') targetProgress = 0.05;
    else if (orderStatus === 'Accepted') targetProgress = 0.15;
    else if (orderStatus === 'Preparing') targetProgress = 0.30;
    else if (orderStatus === 'Ready') targetProgress = 0.45;
    else if (orderStatus === 'Out for Delivery') targetProgress = 0.70;
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
          return prev + 0.015;
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

    // Update marker on Leaflet map
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
    const tileLayer = L.tileLayer(tileConfig.url, { 
      maxZoom: 19,
      subdomains: tileConfig.subdomains || 'abc'
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Custom DivIcon for Kitchen Hub
    const kitchenIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="relative flex flex-col items-center">
          <div class="w-10 h-10 rounded-2xl bg-[#070b14] border-2 border-emerald-400 shadow-[0_0_15px_rgba(0,245,155,0.6)] flex items-center justify-center text-emerald-400 font-extrabold text-sm animate-pulse">
            👨‍🍳
          </div>
          <div class="mt-1 bg-[#070b14]/90 text-emerald-300 text-[10px] font-mono font-black px-2 py-0.5 rounded-md shadow-md border border-emerald-500/40 whitespace-nowrap">
            ${restaurantName || 'Kitchen Reactor'}
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
        <div class="relative flex flex-col items-center">
          <div class="w-10 h-10 rounded-2xl bg-[#070b14] border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)] flex items-center justify-center text-cyan-300 font-extrabold text-sm">
            📍
          </div>
          <div class="mt-1 bg-[#070b14]/90 text-cyan-300 text-[10px] font-mono font-black px-2 py-0.5 rounded-md shadow-md border border-cyan-500/40 whitespace-nowrap">
            Target Waypoint
          </div>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 45]
    });

    // Custom DivIcon for Cyber Rider
    const riderIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="relative flex flex-col items-center">
          <div class="relative w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-cyan-400 to-indigo-500 p-0.5 shadow-[0_0_20px_rgba(0,245,155,0.7)] animate-bounce">
            <div class="w-full h-full bg-[#070b14] rounded-full flex items-center justify-center text-emerald-400 text-lg border border-emerald-400/40">
              🛵
            </div>
            <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
            </span>
          </div>
          <div class="mt-1 bg-[#070b14] text-emerald-300 text-[10px] font-mono font-black px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap border border-emerald-500/50">
            ${partnerName || 'ZapDrone-1'} • 34 km/h
          </div>
        </div>
      `,
      iconSize: [48, 55],
      iconAnchor: [24, 50]
    });

    // Add Kitchen Marker
    L.marker(KITCHEN_COORDS, { icon: kitchenIcon })
      .addTo(map)
      .bindPopup(`<b>${restaurantName || 'Kitchen Reactor'}</b><br/>Order verified & dispatched.`);

    // Add Doorstep Marker
    L.marker(DOORSTEP_COORDS, { icon: doorstepIcon })
      .addTo(map)
      .bindPopup(`<b>Destination Waypoint</b><br/>${deliveryAddress || 'Customer Doorstep'}`);

    // Add Live Rider Marker
    const riderMarker = L.marker(FULL_ROUTE_POINTS[0], { icon: riderIcon, zIndexOffset: 1000 }).addTo(map);
    riderMarker.bindPopup(`<b>${partnerName || 'Delivery Rider'}</b><br/>Live GPS Telemetry Active.`);
    riderMarkerRef.current = riderMarker;

    // Completed Route Polyline (Laser Cyber Emerald)
    const completedPolyline = L.polyline([FULL_ROUTE_POINTS[0]], {
      color: '#00f59b',
      weight: 6,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);
    completedPolylineRef.current = completedPolyline;

    // Remaining Route Polyline (Dashed Neon Cyan)
    const remainingPolyline = L.polyline(FULL_ROUTE_POINTS, {
      color: '#00d2ff',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.55,
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
    tileLayerRef.current = L.tileLayer(config.url, { 
      maxZoom: 19,
      subdomains: config.subdomains || 'abc'
    }).addTo(mapInstanceRef.current);
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
    <div className="relative w-full h-[420px] rounded-3xl overflow-hidden border border-emerald-500/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] bg-[#070b14] group">

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Telemetry Overlay Header */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Status Badge */}
        <div className="pointer-events-auto bg-[#070b14]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-emerald-500/40 shadow-lg text-white flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div>
            <div className="text-[10px] text-emerald-400 uppercase font-mono font-black tracking-wider">LIVE TELEMETRY HUD</div>
            <div className="text-xs font-black text-white flex items-center gap-1.5 font-mono">
              <span>{orderStatus}</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-300 font-bold">{distanceLeftKm} km to doorstep</span>
            </div>
          </div>
        </div>

        {/* Right Telemetry Stats Pill */}
        <div className="pointer-events-auto bg-[#070b14]/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-emerald-500/40 shadow-lg flex items-center gap-4 text-white font-mono text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <span>{telemetrySpeed} km/h</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-cyan-300">
            <Activity className="w-4 h-4" />
            <span>GPS 99.8%</span>
          </div>
        </div>
      </div>

      {/* Map Control Buttons Overlay */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        
        {/* Theme Switcher Toggle */}
        <div className="bg-[#070b14]/90 backdrop-blur-md p-1 rounded-2xl border border-emerald-500/30 shadow-xl flex items-center gap-1">
          {Object.keys(TILE_SERVERS).map((themeKey) => (
            <button
              key={themeKey}
              onClick={() => setActiveTheme(themeKey)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-black transition-all cursor-pointer ${
                activeTheme === themeKey
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(0,245,155,0.4)]'
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
            className="bg-[#070b14]/90 hover:bg-[#111c33] backdrop-blur-md text-emerald-400 p-2.5 rounded-2xl border border-emerald-500/40 shadow-xl flex items-center gap-1.5 text-xs font-black transition-all active:scale-95 cursor-pointer"
            title="Recenter on Rider"
          >
            <Locate className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline font-mono">Lock Rider</span>
          </button>

          <button
            onClick={handleFitRoute}
            className="bg-[#070b14]/90 hover:bg-[#111c33] backdrop-blur-md text-cyan-300 p-2.5 rounded-2xl border border-cyan-500/40 shadow-xl transition-all active:scale-95 cursor-pointer"
            title="Fit Full Route"
          >
            <Maximize2 className="w-4 h-4 text-cyan-300" />
          </button>
        </div>
      </div>

      {/* Bottom Floating Route Info Bar */}
      <div className="absolute bottom-4 left-4 z-10 max-w-[280px] sm:max-w-xs bg-[#070b14]/90 backdrop-blur-md p-3 rounded-2xl border border-emerald-500/30 shadow-xl text-white text-xs space-y-1">
        <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">
          <span>VECTOR TRAJECTORY</span>
          <span className="text-cyan-300 font-mono">{Math.round(currentProgress * 100)}% COMPLETED</span>
        </div>
        <div className="flex items-center gap-2 text-slate-200 font-mono text-xs truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="truncate">{restaurantName || 'Kitchen Reactor'}</span>
          <span className="text-cyan-400">→</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
          <span className="truncate">{deliveryAddress || 'Target Waypoint'}</span>
        </div>
      </div>

    </div>
  );
};
