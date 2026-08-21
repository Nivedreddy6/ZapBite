# ⚡ ZapBite — Next-Gen AI Food Delivery & Smart Restaurant Logistics Platform

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs)](https://nodejs.org/)
[![GitHub](https://img.shields.io/badge/GitHub-Nivedreddy6%2FZapBite-181717?logo=github)](https://github.com/Nivedreddy6/ZapBite)

**ZapBite** is a full-stack, AI-powered food delivery and restaurant logistics ecosystem. Built with a cyber-luxe dark glassmorphic design system, real-time Google Maps GPS telemetry, automated realistic 30–35 minute delivery lifecycles, live multi-role portals, SMS OTP verification, and an intelligent food concierge (**BiteBot AI**).

📂 **GitHub Repository**: [https://github.com/Nivedreddy6/ZapBite](https://github.com/Nivedreddy6/ZapBite)  
🌐 **Local Dev Server**: `http://localhost:5173`

---

## 🌟 Key Features & Ecosystem Modules

### 🗺️ 1. Google Maps & Precision GPS Telemetry
* **Google Maps High-Fidelity Tile Engine**: Seamlessly switch between Google Maps **Street Vector**, **Satellite HUD**, and **Cyber Dark** map layers.
* **Synchronized Real-Time Rider Telemetry**: Rider position along street coordinates is directly synchronized with the order's actual delivery timeline (30–35 mins) and live speedometer (30–38 km/h).
* **Two-Phase GPS Journey**:
  * *Phase 1 (Accepted / Cooking)*: Rider moves to the restaurant to collect the hot meal.
  * *Phase 2 (Food Packed / Out for Delivery)*: Rider glides along the street route towards the customer's doorstep with dynamic polyline trailing.
* **Interactive Address Pinning**: Snap delivery pins anywhere on Earth with browser GPS calibration or direct map clicking with live reverse-geocoding.

### 🍕 2. Authentic Real-Time Food Delivery Lifecycle
* **Minute-by-Minute Live Countdown**: Real-time arrival ETA ticks down every 60 seconds (e.g. `32 Mins` ➔ `31 Mins` ➔ `30 Mins` ... ➔ `Delivered 🎉`).
* **Clean 6-Stage Milestone Progress**:
  1. 🛍️ **Order Placed** — Sent to restaurant
  2. ✅ **Order Confirmed** — Restaurant confirmed order
  3. 👨‍🍳 **Preparing Food** — Chef cooking fresh meal
  4. 📦 **Food Packed** — Ready for rider pickup
  5. 🛵 **On the Way** — Rider heading to your doorstep
  6. 🎉 **Delivered** — Handed over with rating feedback and instant "Order More Food" reset
* **Automatic Lifecycle Normalization**: Stale/past session orders are automatically archived upon load so the live tracker only focuses on active ongoing deliveries.
* **Zero Artificial Simulation**: The customer status screen is 100% read-only and automatically advances in real time or via Restaurant / Rider portal actions.

### 🎨 3. Cyber-Luxe Aesthetics & SVG Micro-Animations
* **Bespoke Vector SVG Suite**:
  * *Diner Hologram*: Interactive mobile cloche with glowing neon food badges.
  * *Kitchen Plasma Reactor*: Sizzling chef wok with rising steam paths and heat glow.
  * *Rider Telemetry*: Scooter following live dashed GPS vectors with pulsating radar beacons.
  * *Analytics Matrix*: 3D oscillating bar chart columns with real-time revenue curves.
* **Polished Dark Glassmorphism**: Obsidian backgrounds (`#070b14`), emerald/cyan laser accents, and buttery 60fps micro-interactions.

### 🤖 4. AI-Powered Smart Suite
* **BiteBot AI Concierge**: Embedded conversational assistant offering dish recommendations, spicy/veg dietary filters, and live order assistance.
* **ZapPay AI Payment Shield & Savings Engine**: Automatic coupon optimization, simulated 256-bit quantum encryption, UPI (PhonePe / GPay / Paytm), Card, and 3D Secure OTP verification.

### 👥 5. Multi-Role Ecosystem Portals
* 🛒 **Customer Hub**: Filter by categories (Biryani, Pizzas, Desserts, South Indian, Fast Food), live search, cart vault, and order tracking.
* 🍳 **Restaurant Kitchen Display (KDS)**: Real-time kitchen queue, live status toggles, and dish stock management.
* 🛵 **Delivery Fleet Portal**: Rider availability toggles, active pickup assignments, and navigation metrics.
* 📊 **Admin Analytics Matrix**: Live revenue curves, fleet utilization charts, and performance KPIs powered by Chart.js.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, React Context API |
| **Styling & Animations** | Tailwind CSS v4, Custom SVG Animations, Lucide React, Canvas Confetti |
| **Maps & Geolocation** | Leaflet, Google Maps Tiles, Komoot Photon, OpenStreetMap Nominatim |
| **Charts & Analytics** | Chart.js, React-ChartJS-2 |
| **Backend Server** | Node.js, Express 5, LowDB |
| **State & Persistence** | React Context (`AppContext.jsx`) with LocalStorage & SessionStorage |

---

## 📂 Project Structure

```
ZapBite/
├── server/
│   ├── .env.example          # Sample environment variables
│   ├── db.json               # LowDB persistent JSON store
│   └── index.js              # Express REST API Server (Port 5000)
├── src/
│   ├── components/           # UI Components & Role Portals
│   │   ├── AdminView.jsx     # Admin Analytics & Fleet Overview
│   │   ├── AnimatedFoodBanner.jsx # Dynamic Food Hero Carousel
│   │   ├── BiteBotChatbot.jsx# AI Assistant Floating Widget
│   │   ├── CartDrawer.jsx    # Slide-out Cart Vault Drawer
│   │   ├── CustomerView.jsx  # Customer Menu & Restaurant Hub
│   │   ├── DeliveryView.jsx  # Rider Fleet Portal
│   │   ├── EcosystemSvgAnimations.jsx # Custom SVG micro-animations
│   │   ├── LandingPage.jsx   # Role launcher & Ecosystem Showcase
│   │   ├── LiveMap.jsx       # Google Maps Live Delivery Telemetry
│   │   ├── LocationPickerModal.jsx # Google Maps Interactive Pin Picker
│   │   ├── LoginPage.jsx     # Auth Modal with Quick Demo Logins
│   │   ├── Navbar.jsx        # Top Navigation & Role Switcher
│   │   ├── OrderTracker.jsx  # Real-Time Order Tracking HUD
│   │   ├── PaymentModal.jsx  # ZapPay AI Gateway & OTP Verification
│   │   ├── RestaurantView.jsx# Kitchen Display System (KDS)
│   │   └── UserProfileModal.jsx # Profile & Address Manager
│   ├── context/
│   │   └── AppContext.jsx    # Global State & Real-Time Lifecycle Controller
│   ├── data/
│   │   └── mockData.js       # Preloaded Restaurants, Dishes & Riders
│   ├── App.jsx               # Main Application Component
│   ├── index.css             # Tailwind v4 Base Styles & Keyframes
│   └── main.jsx              # React Entry Point
├── package.json              # NPM Dependencies & Scripts
├── vite.config.js            # Vite Bundler Setup (with db watcher ignore)
└── README.md                 # Project Documentation
```

---

## 🚦 Getting Started Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) and `npm` installed.

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Nivedreddy6/ZapBite.git
   cd ZapBite
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

---

## ⚡ Running the Platform

To experience full functionality with persistent backend API synchronization, run both servers:

### 1. Launch Backend Server (Port 5000)
```bash
npm run server
```
*API Base URL*: `http://localhost:5000/api`

### 2. Launch Frontend Application (Port 5173)
```bash
npm run dev
```
*Web Application*: `http://localhost:5173`

---

## 📜 Available Scripts

* `npm run dev` — Starts the Vite development web server with HMR.
* `npm run server` — Starts the Express REST API backend.
* `npm run build` — Compiles production-ready bundle.
* `npm run preview` — Previews the production build locally.
* `npm run lint` — Runs `oxlint` to check code quality.

---

## 🔑 Quick Demo Login Credentials

You can test any role instantly using the built-in quick login modal:

| Role | Email / ID | Demo Focus |
| :--- | :--- | :--- |
| **Customer** | `rahul@zapbite.ai` | Ordering, Live Google Maps GPS Tracking, AI Cart |
| **Restaurant Kitchen** | `kitchen@spicyjunction.com` | Live Kitchen Display (KDS) & Menu Stock |
| **Delivery Driver** | `rahul.rider@zapbite.ai` | Fleet Dispatch & Route Navigation |
| **Admin** | `admin@zapbite.ai` | Platform Revenue, Chart.js Visuals & Fleet Metrics |

---

Made with ❤️ by [Nived Reddy](https://github.com/Nivedreddy6)
