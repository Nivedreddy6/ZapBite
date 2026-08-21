import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Gauge, 
  Activity, 
  Locate, 
  Maximize2
} from 'lucide-react';

// Real coordinates (Vizag Restaurant Hub -> Customer Doorstep)
const KITCHEN_COORDS = [17.7231, 83.3012];
const DOORSTEP_COORDS = [17.7395, 83.3168];

// Route 1: Rider approaching restaurant from nearby sector
const APPROACH_ROUTE_POINTS = [
  [17.7160, 83.2920],
  [17.7175, 83.2940],
  [17.7190, 83.2965],
  [17.7208, 83.2985],
  [17.7220, 83.2998],
  [17.7231, 83.3012]  // Reaches Kitchen
];

// Route 2: Delivery route from Restaurant to Customer Doorstep
const DELIVERY_ROUTE_POINTS = [
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
  standard: {
    name: 'Street Vector',
    url: 'https://{s}.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps'
  },
  satellite: {
    name: 'Satellite HUD',
    url: 'https://{s}.google.com/vt/lyrs=s,h&hl=en&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps'
  },
  dark: {
    name: 'Cyber Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO'
  }
};

export const LiveMap = ({ 
  orderStatus, 
  restaurantName, 
  deliveryAddress, 
  partnerName,
  createdAt,
  estimatedDeliveryMins = 32 
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const completedPolylineRef = useRef(null);
  const remainingPolylineRef = useRef(null);

  const [activeTheme, setActiveTheme] = useState('standard');
  const [telemetrySpeed, setTelemetrySpeed] = useState(0);
  const [distanceLeftKm, setDistanceLeftKm] = useState('2.8 km remaining');
  const [headingMessage, setHeadingMessage] = useState('Rider tracking initialized');

  // Synchronized Realistic GPS Position calculation based on elapsed delivery time
  useEffect(() => {
    const updateRiderPosition = () => {
      const createdTime = createdAt ? new Date(createdAt).getTime() : Date.now();
      const elapsedMins = Math.max(0, (Date.now() - createdTime) / 60000);
      const totalMins = estimatedDeliveryMins || 32;

      let currentPos = KITCHEN_COORDS;
      let progressRatio = 0;

      if (orderStatus === 'Delivered') {
        currentPos = DOORSTEP_COORDS;
        progressRatio = 1.0;
        setDistanceLeftKm('0.0 km (Delivered)');
        setHeadingMessage('Order Delivered 🎉');
        setTelemetrySpeed(0);

        if (completedPolylineRef.current && remainingPolylineRef.current) {
          completedPolylineRef.current.setLatLngs(DELIVERY_ROUTE_POINTS);
          remainingPolylineRef.current.setLatLngs([]);
        }
      } else if (orderStatus === 'Out for Delivery') {
        // Delivery transit phase (e.g. from 45% of total time to 100% of total time)
        const transitStartMins = totalMins * 0.45; // ~14 mins
        const transitDurationMins = totalMins - transitStartMins; // ~18 mins
        const transitElapsed = Math.max(0, elapsedMins - transitStartMins);
        
        // Strictly compute progress ratio from 0.05 to 0.95 during transit
        progressRatio = Math.min(0.95, Math.max(0.05, transitElapsed / transitDurationMins));

        const totalSegments = DELIVERY_ROUTE_POINTS.length - 1;
        const scaledIndex = progressRatio * totalSegments;
        const segIndex = Math.min(Math.floor(scaledIndex), totalSegments - 1);
        const fraction = scaledIndex - segIndex;

        const p1 = DELIVERY_ROUTE_POINTS[segIndex];
        const p2 = DELIVERY_ROUTE_POINTS[segIndex + 1] || p1;

        currentPos = [
          p1[0] + (p2[0] - p1[0]) * fraction,
          p1[1] + (p2[1] - p1[1]) * fraction
        ];

        const remDist = (2.8 * (1 - progressRatio)).toFixed(1);
        setDistanceLeftKm(`${remDist} km to doorstep`);
        setHeadingMessage('Rider on the way to your doorstep');
        setTelemetrySpeed(Math.floor(30 + Math.random() * 8));

        if (completedPolylineRef.current && remainingPolylineRef.current) {
          const completedPts = DELIVERY_ROUTE_POINTS.slice(0, segIndex + 1);
          completedPts.push(currentPos);
          completedPolylineRef.current.setLatLngs(completedPts);

          const remainingPts = [currentPos, ...DELIVERY_ROUTE_POINTS.slice(segIndex + 1)];
          remainingPolylineRef.current.setLatLngs(remainingPts);
        }
      } else if (orderStatus === 'Preparing' || orderStatus === 'Ready') {
        // Rider is AT the restaurant waiting for cooking & packaging
        currentPos = KITCHEN_COORDS;
        progressRatio = 0;
        setDistanceLeftKm('2.8 km to doorstep');
        setHeadingMessage(`Rider at restaurant picking up order`);
        setTelemetrySpeed(0);

        if (completedPolylineRef.current && remainingPolylineRef.current) {
          completedPolylineRef.current.setLatLngs([KITCHEN_COORDS]);
          remainingPolylineRef.current.setLatLngs(DELIVERY_ROUTE_POINTS);
        }
      } else {
        // Placed or Accepted (Rider approaching restaurant)
        const approachDuration = Math.max(1, totalMins * 0.1); // ~3 mins
        const approachRatio = Math.min(0.98, Math.max(0.05, elapsedMins / approachDuration));

        const totalSegments = APPROACH_ROUTE_POINTS.length - 1;
        const scaledIndex = approachRatio * totalSegments;
        const segIndex = Math.min(Math.floor(scaledIndex), totalSegments - 1);
        const fraction = scaledIndex - segIndex;

        const p1 = APPROACH_ROUTE_POINTS[segIndex];
        const p2 = APPROACH_ROUTE_POINTS[segIndex + 1] || p1;

        currentPos = [
          p1[0] + (p2[0] - p1[0]) * fraction,
          p1[1] + (p2[1] - p1[1]) * fraction
        ];

        const remDist = (1.5 * (1 - approachRatio)).toFixed(1);
        setDistanceLeftKm(`${remDist} km to restaurant`);
        setHeadingMessage(`Rider heading to ${restaurantName || 'Restaurant'}`);
        setTelemetrySpeed(Math.floor(26 + Math.random() * 8));

        if (completedPolylineRef.current && remainingPolylineRef.current) {
          completedPolylineRef.current.setLatLngs([KITCHEN_COORDS]);
          remainingPolylineRef.current.setLatLngs(DELIVERY_ROUTE_POINTS);
        }
      }

      // Update rider Leaflet marker
      if (riderMarkerRef.current) {
        riderMarkerRef.current.setLatLng(currentPos);
      }
    };

    updateRiderPosition();
    const interval = setInterval(updateRiderPosition, 1000); // Live update synchronized every second
    return () => clearInterval(interval);
  }, [orderStatus, createdAt, estimatedDeliveryMins, restaurantName]);

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
      maxZoom: 20,
      subdomains: tileConfig.subdomains || 'abc'
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Custom DivIcon for Restaurant
    const kitchenIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="relative flex flex-col items-center select-none">
          <div class="w-10 h-10 rounded-2xl bg-[#070b14] border-2 border-emerald-400 shadow-[0_0_15px_rgba(0,245,155,0.6)] flex items-center justify-center text-emerald-400 font-extrabold text-sm animate-pulse">
            👨‍🍳
          </div>
          <div class="mt-1 bg-[#070b14]/95 text-emerald-300 text-[10px] font-mono font-black px-2 py-0.5 rounded-md shadow-md border border-emerald-500/40 whitespace-nowrap">
            ${restaurantName || 'Restaurant'}
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
        <div class="relative flex flex-col items-center select-none">
          <div class="w-10 h-10 rounded-2xl bg-[#070b14] border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)] flex items-center justify-center text-cyan-300 font-extrabold text-sm">
            📍
          </div>
          <div class="mt-1 bg-[#070b14]/95 text-cyan-300 text-[10px] font-mono font-black px-2 py-0.5 rounded-md shadow-md border border-cyan-500/40 whitespace-nowrap">
            Your Location
          </div>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 45]
    });

    // Custom DivIcon for Animated Moving Rider
    const riderIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="relative flex flex-col items-center select-none transition-transform duration-300">
          <div class="relative w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-cyan-400 to-indigo-500 p-0.5 shadow-[0_0_20px_rgba(0,245,155,0.8)]">
            <div class="w-full h-full bg-[#070b14] rounded-full flex items-center justify-center text-emerald-400 text-lg border border-emerald-400/40">
              🛵
            </div>
            <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
            </span>
          </div>
          <div class="mt-1 bg-[#070b14] text-emerald-300 text-[10px] font-mono font-black px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap border border-emerald-500/50">
            ${partnerName || 'Rahul Sharma'}
          </div>
        </div>
      `,
      iconSize: [48, 55],
      iconAnchor: [24, 50]
    });

    // Add Kitchen Marker
    L.marker(KITCHEN_COORDS, { icon: kitchenIcon })
      .addTo(map)
      .bindPopup(`<b>${restaurantName || 'Restaurant'}</b><br/>Order verified & dispatched.`);

    // Add Doorstep Marker
    L.marker(DOORSTEP_COORDS, { icon: doorstepIcon })
      .addTo(map)
      .bindPopup(`<b>Your Delivery Location</b><br/>${deliveryAddress || 'Customer Doorstep'}`);

    // Add Live Moving Rider Marker
    const riderMarker = L.marker(APPROACH_ROUTE_POINTS[0], { icon: riderIcon, zIndexOffset: 1000 }).addTo(map);
    riderMarker.bindPopup(`<b>${partnerName || 'Delivery Rider'}</b><br/>Live GPS Telemetry Active.`);
    riderMarkerRef.current = riderMarker;

    // Completed Route Polyline (Laser Emerald)
    const completedPolyline = L.polyline([DELIVERY_ROUTE_POINTS[0]], {
      color: '#00f59b',
      weight: 6,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);
    completedPolylineRef.current = completedPolyline;

    // Remaining Route Polyline (Dashed Cyan)
    const remainingPolyline = L.polyline(DELIVERY_ROUTE_POINTS, {
      color: '#00d2ff',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.7,
      lineCap: 'round'
    }).addTo(map);
    remainingPolylineRef.current = remainingPolyline;

    // Fit map bounds to encompass all points
    const bounds = L.latLngBounds([...APPROACH_ROUTE_POINTS, ...DELIVERY_ROUTE_POINTS]);
    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when theme changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const tileConfig = TILE_SERVERS[activeTheme];
    const newLayer = L.tileLayer(tileConfig.url, {
      maxZoom: 20,
      subdomains: tileConfig.subdomains || 'abc'
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  }, [activeTheme]);

  const handleCenterRider = () => {
    if (mapInstanceRef.current && riderMarkerRef.current) {
      mapInstanceRef.current.flyTo(riderMarkerRef.current.getLatLng(), 16, { duration: 0.8 });
    }
  };

  const handleFitRoute = () => {
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds([...APPROACH_ROUTE_POINTS, ...DELIVERY_ROUTE_POINTS]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] rounded-3xl overflow-hidden border border-emerald-500/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] font-sans">
      
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0 bg-[#070b14]" />

      {/* Top Left Live Status Banner */}
      <div className="absolute top-4 left-4 z-10 bg-[#070b14]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-500/40 shadow-xl flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span className="text-xs font-mono font-black text-white">{headingMessage}</span>
        </div>
        <span className="text-slate-600">|</span>
        <span className="text-xs font-mono font-bold text-emerald-400">{distanceLeftKm}</span>
      </div>

      {/* Top Right Speed & Telemetry HUD */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-[#070b14]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-emerald-500/30 text-xs font-mono shadow-xl">
        <div className="flex items-center gap-1.5 text-emerald-400 font-black">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <span>{telemetrySpeed} km/h</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-1 text-emerald-300 font-bold">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>GPS 100%</span>
        </div>
      </div>

      {/* Bottom Floating Map View Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        {/* Layer Selector */}
        <div className="bg-[#070b14]/90 backdrop-blur-md p-1 rounded-2xl border border-slate-800 flex gap-1 text-[11px] font-mono shadow-xl">
          {Object.keys(TILE_SERVERS).map((themeKey) => (
            <button
              key={themeKey}
              onClick={() => setActiveTheme(themeKey)}
              className={`px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
                activeTheme === themeKey
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,245,155,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {TILE_SERVERS[themeKey].name}
            </button>
          ))}
        </div>

        {/* Center Rider Button */}
        <button
          onClick={handleCenterRider}
          className="bg-[#070b14]/90 hover:bg-[#111c33] text-emerald-400 p-2.5 rounded-2xl border border-emerald-500/40 shadow-xl transition-all active:scale-95 cursor-pointer flex items-center gap-1 text-xs font-mono font-bold"
          title="Track Rider Position"
        >
          <Locate className="w-4 h-4" />
          <span className="hidden sm:inline">Track Rider</span>
        </button>

        {/* Fit Route Button */}
        <button
          onClick={handleFitRoute}
          className="bg-[#070b14]/90 hover:bg-[#111c33] text-cyan-400 p-2.5 rounded-2xl border border-cyan-500/40 shadow-xl transition-all active:scale-95 cursor-pointer"
          title="View Full Route"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Left Live Route Waypoints */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 bg-[#070b14]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 text-[11px] font-mono shadow-xl">
        <span className="text-emerald-400 font-bold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          {restaurantName || 'Restaurant'}
        </span>
        <span className="text-slate-500">➔</span>
        <span className="text-cyan-400 font-bold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
          {deliveryAddress ? deliveryAddress.slice(0, 24) + '...' : 'Your Location'}
        </span>
      </div>

    </div>
  );
};
