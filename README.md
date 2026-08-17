# ⚡ ZapBite.ai — Smart Food Ordering & Delivery Logistics OS

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs)](https://nodejs.org/)
[![Deployment](https://img.shields.io/badge/Vercel-Live_Demo-black?logo=vercel)](https://zap-bite.vercel.app/)

**ZapBite.ai** is an ultra-modern, full-stack AI-powered food ordering and restaurant logistics ecosystem. Built with real-time GPS telemetry mapping, Google Maps layers, multi-role portal interfaces, live OTP SMS verification, automated AI payment savings, and an embedded conversational concierge (**BiteBot**).

🌐 **Live Demo**: [https://zap-bite.vercel.app/](https://zap-bite.vercel.app/)  
📂 **GitHub Repository**: [https://github.com/Nivedreddy6/ZapBite](https://github.com/Nivedreddy6/ZapBite)

---

## 🚀 Key Features & System Modules

### 🗺️ 1. Google Maps & Precision Live Geocoding
* **Google Maps Road & Satellite Tile Engine**: High-fidelity Google Maps visual layers for both address selection and live delivery driver route tracking.
* **Google Places Suggest & Multi-API Search**: Real-time autocomplete and street resolution powered by Google Suggest, Komoot Photon, and OpenStreetMap Nominatim.
* **Interactive Tap-to-Pin & GPS Geolocation**: Snap delivery pins anywhere on Earth with browser GPS or direct map clicking with live reverse-geocoding.
* **Custom Location Locking**: Directly apply and remember custom apartment, shop, or colony names.

### 🤖 2. AI-Powered Smart Suite
* **BiteBot AI Floating Chatbot**: Interactive conversational assistant providing dish recommendations, instant promo codes, dietary filters, and live order support.
* **ZapPay AI Payment Shield & Savings Engine**: Automatically calculates optimal coupon savings, provides mock bank gateway authorization, and verifies phone OTP.

### 📱 3. Real SMS Gateway Integration
* **2Factor.in & Fast2SMS Gateway Integration**: Real-time SMS delivery for customer authentication and payment verification across India.
* **Automated Fallback & In-App OTP Simulator**: Seamless fallback mechanism ensuring checkout never blocks even during network carrier delays.

### ✨ 4. Animated Vector Ecosystem Suite
* **Diner Experience**: Interactive mobile device mockup with floating food items, sound waves, and AI order triggers.
* **Kitchen Operating System**: Sizzling chef pan with animated rising steam paths, heat glow, and digital cooking timers.
* **Rider Fleet Dispatch**: Animated delivery scooter following dashed GPS vectors with pulsating destination radar beacons.
* **Platform Intelligence**: Dynamic oscillating bar chart columns with trend curves and real-time revenue badges.

### 👥 5. Multi-Role Ecosystem
* 🛒 **Customer Experience**:
  * Rich menu browsing with category filters, dietary tags (Veg/Non-Veg), spice levels, dynamic search, and live cart drawer.
  * Live stage-by-stage HUD order tracking with live telemetry progress and Google Maps visualization.
  * User profile modal with saved addresses, phone number manager, and past order history.
* 🍕 **Restaurant Kitchen Display (KDS)**:
  * Real-time kitchen order queue with one-click status transitions (Accept → Preparing → Ready).
  * Instant dish stock inventory toggle and custom dish creator.
* 🛵 **Delivery Fleet Portal**:
  * Live rider dispatch view with active order assignments and navigation telemetry.
  * Status toggles for rider availability and OTP customer handoff.
* 📊 **Admin Command Center**:
  * Real-time platform metrics (Total Revenue, Active Fleet, Order Counts, Avg Delivery Time).
  * Graphical analytics powered by Chart.js (Order Breakdown, Fleet Status).

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite 8 |
| **Styling & Animations** | Tailwind CSS v4, Custom SVG Animations, Lucide React, Canvas Confetti |
| **Maps & Geolocation** | Leaflet, Google Maps Tiles, Google Places Suggest, Komoot Photon, OSM Nominatim |
| **Data Visualization** | Chart.js, React-ChartJS-2 |
| **Backend API** | Node.js, Express 5, LowDB |
| **SMS Gateway** | 2Factor.in, Fast2SMS REST APIs |
| **State Management** | React Context API (`AppContext.jsx`) with LocalStorage Persistence |

---

## 📂 Project Architecture

```
zapbite-ai-platform/
├── server/
│   ├── .env.example          # Sample environment variables
│   ├── db.json               # Persistent LowDB database store
│   └── index.js              # Express REST API Server (Port 5000)
├── src/
│   ├── components/           # Multi-role UI components & views
│   │   ├── AdminView.jsx     # Admin Analytics & Fleet Management
│   │   ├── AnimatedFoodBanner.jsx # Hero carousel with dynamic food badges
│   │   ├── BiteBotChatbot.jsx# AI Assistant Floating Widget
│   │   ├── CartDrawer.jsx    # Slide-out interactive cart drawer
│   │   ├── CustomerView.jsx  # Customer Menu, Search & Dish Cards
│   │   ├── DeliveryView.jsx  # Rider Fleet Portal
│   │   ├── EcosystemSvgAnimations.jsx # Custom SVG micro-animations
│   │   ├── LandingPage.jsx   # Role launcher & architecture showcase
│   │   ├── LiveMap.jsx       # Google Maps live delivery telemetry tracker
│   │   ├── LocationPickerModal.jsx # Google Maps interactive pin picker
│   │   ├── LoginPage.jsx     # Authentication & Quick Demo Login
│   │   ├── Navbar.jsx        # Navigation, location badge & role selector
│   │   ├── OrderTracker.jsx  # Live Visual Order Tracker
│   │   ├── PaymentModal.jsx  # ZapPay gateway & OTP verification modal
│   │   ├── RestaurantView.jsx# Kitchen Operating System
│   │   └── UserProfileModal.jsx # Customer profile & saved addresses
│   ├── context/
│   │   └── AppContext.jsx    # Global State & LocalStorage Controller
│   ├── data/
│   │   └── mockData.js       # Preloaded Restaurants, Items, Orders
│   ├── utils/
│   │   └── aiPayments.js     # ZapPay AI Engine Algorithms
│   ├── App.jsx               # Main Application Root
│   ├── index.css             # Tailwind v4 Base Styles & Keyframes
│   └── main.jsx              # React Entry Point
├── package.json              # Project Dependencies & NPM Scripts
├── vite.config.js            # Vite Bundler Setup
└── README.md                 # Complete Documentation
```

---

## 🚦 Getting Started

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

## ⚡ Running the Platform Locally

To experience the full features with backend API integration, run both the backend server and frontend client.

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

## 🔑 Demo Access Credentials

You can test any role instantly using the built-in quick login modal:

| Role | Email / ID | Demo Focus |
| :--- | :--- | :--- |
| **Customer** | `rahul@zapbite.ai` | Ordering, Google Maps Location, AI Cart |
| **Restaurant Kitchen** | `kitchen@spicyjunction.com` | Live Kitchen Orders & Stock Control |
| **Delivery Driver** | `rahul.rider@zapbite.ai` | Fleet Dispatch & Route Completion |
| **Admin** | `admin@zapbite.ai` | System Analytics & Fleet Overview |

---

Made with ❤️ by [Nived Reddy](https://github.com/Nivedreddy6)
