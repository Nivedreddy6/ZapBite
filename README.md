# ⚡ ZapBite.ai — Smart Food Ordering & Delivery Logistics OS

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs)](https://nodejs.org/)

**ZapBite.ai** is a next-generation, full-stack AI-driven food delivery and restaurant management ecosystem. Designed with high-performance real-time logistics tracking, multi-role portal interfaces, automated AI payment optimization, and an embedded conversational assistant (**BiteBot**).

---

## 🚀 Key Features & Highlights

### 🤖 1. AI-Powered Smart Suite
* **BiteBot AI Floating Chatbot**: Interactive conversational assistant providing dish recommendations, instant promo codes, and live support.
* **ZapPay AI Payment Shield & Savings Engine**: Automatically calculates optimal coupon savings, validates checkout transactions, and assesses security scores on every transaction.

### 👥 2. Multi-Role Portal System
* 🛒 **Customer Experience**:
  * Rich menu browsing with category filters, dietary tags (Veg/Non-Veg), search, and real-time cart.
  * Live stage-by-stage order tracking (Placed → Accepted → Preparing → Ready → Out for Delivery → Delivered).
  * Interactive stage fast-forward simulator for demo testing.
* 🍕 **Restaurant Dashboard**:
  * Real-time kitchen order stream & status workflow manager.
  * Menu stock toggle & custom dish creator.
* 🛵 **Delivery Fleet Portal**:
  * Live rider dispatch view with active delivery assignments.
  * Status toggles for rider availability and one-click order updates.
* 📊 **Admin Command Center**:
  * Real-time platform metrics (Total Revenue, Active Fleet, Order Counts, Avg Delivery Time).
  * Graphical analytics powered by Chart.js (Order Breakdown, Fleet Status).

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite 8 |
| **Styling & Icons** | Tailwind CSS v4, Lucide React, Canvas Confetti |
| **Data Visualization** | Chart.js, React-ChartJS-2 |
| **Backend API** | Node.js, Express 5 |
| **State Management** | React Context API (`AppContext.jsx`) |
| **Code Quality** | Oxlint |

---

## 📂 Project Architecture

```
zapbite-ai-platform/
├── server/
│   └── index.js              # Express REST API Server (Port 5000)
├── src/
│   ├── components/           # Multi-role UI components & views
│   │   ├── AdminView.jsx     # Admin Analytics & Fleet Management
│   │   ├── BiteBotChatbot.jsx# AI Assistant Floating Widget
│   │   ├── CustomerView.jsx  # Customer Menu, Cart & Checkout
│   │   ├── DeliveryView.jsx  # Rider Fleet Portal
│   │   ├── LandingPage.jsx   # Landing Showcase Page
│   │   ├── LoginPage.jsx     # Authentication & Quick Demo Login
│   │   ├── Navbar.jsx        # Navigation & Role Selector
│   │   ├── OrderTracker.jsx  # Live Visual Order Tracker
│   │   └── RestaurantView.jsx# Kitchen Operating System
│   ├── context/
│   │   └── AppContext.jsx    # Global State & Sync Controller
│   ├── data/
│   │   └── mockData.js       # Preloaded Restaurants, Items, Orders
│   ├── utils/
│   │   └── aiPayments.js     # ZapPay AI Engine Algorithms
│   ├── App.jsx               # Main Application Component
│   ├── index.css             # Tailwind v4 Base Styles
│   └── main.jsx              # React Entry Point
├── package.json              # Project Dependencies & NPM Scripts
├── vite.config.js            # Vite Bundler Setup
└── README.md                 # Documentation
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

## ⚡ Running the Platform

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

* `npm run dev` — Starts the Vite development web server.
* `npm run server` — Starts the Express REST API backend.
* `npm run build` — Bundles production-ready assets.
* `npm run preview` — Previews the production build locally.
* `npm run lint` — Runs `oxlint` to check code quality.

---

## 🔑 Demo Access Credentials

You can test any role instantly using the built-in quick login modal:

| Role | Email / ID | Demo Focus |
| :--- | :--- | :--- |
| **Customer** | `rahul@zapbite.ai` | Ordering, AI Cart, Live Order Tracking |
| **Restaurant** | `kitchen@spicyjunction.com` | Live Kitchen Orders & Stock Control |
| **Delivery Driver** | `rahul.rider@zapbite.ai` | Fleet Dispatch & Delivery Completion |
| **Admin** | `admin@zapbite.ai` | System Analytics & Fleet Overview |

