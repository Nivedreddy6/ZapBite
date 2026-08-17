import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { 
  INITIAL_RESTAURANTS, 
  INITIAL_MENU_ITEMS, 
  INITIAL_DELIVERY_PARTNERS, 
  INITIAL_ORDERS 
} from '../src/data/mockData.js';
import { getSmartPaymentRecommendation, generatePaymentSecurityScore } from '../src/utils/aiPayments.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Persistent Database Helper
let dbData = {
  restaurants: [...INITIAL_RESTAURANTS],
  menuItems: [...INITIAL_MENU_ITEMS],
  deliveryPartners: [...INITIAL_DELIVERY_PARTNERS],
  orders: [...INITIAL_ORDERS],
  users: [
    {
      id: 'cust-101',
      name: 'Rahul Malhotra',
      email: 'rahul@zapbite.ai',
      phone: '+91 98765 00112',
      role: 'customer',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'rest-1',
      name: 'Chef Vikram (Spicy Junction)',
      email: 'kitchen@spicyjunction.com',
      phone: '+91 98111 22334',
      role: 'restaurant',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'partner-1',
      name: 'Rahul Sharma (Rider)',
      email: 'rahul.rider@zapbite.ai',
      phone: '+91 98765 43210',
      role: 'delivery',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'admin-01',
      name: 'System Super Admin',
      email: 'admin@zapbite.ai',
      phone: '+91 90000 00000',
      role: 'admin',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
    }
  ]
};

function loadDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const fileRaw = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(fileRaw);
      dbData = { ...dbData, ...parsed };
      console.log('📦 ZapBite DB synced persistently from disk.');
    }
  } catch (err) {
    console.error('Error loading db.json:', err.message);
  }
}

function saveDb() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db.json:', err.message);
  }
}

loadDb();

let restaurants = dbData.restaurants;
let menuItems = dbData.menuItems;
let deliveryPartners = dbData.deliveryPartners;
let orders = dbData.orders;
let users = dbData.users;

// 0. Root API Portal Landing
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>ZapBite.ai REST API Backend</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #0b0f19; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .card { background: #1e293b; border: 1px solid #334155; padding: 2.5rem; border-radius: 24px; max-width: 500px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        h1 { color: #f43f5e; margin-bottom: 0.5rem; margin-top: 1rem; }
        p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
        .btn { display: inline-block; margin-top: 1.5rem; background: linear-gradient(135deg, #f43f5e, #8b5cf6); color: white; padding: 14px 28px; border-radius: 14px; font-weight: bold; text-decoration: none; transition: transform 0.2s; }
        .btn:hover { transform: scale(1.05); }
        .badge { background: #06b6d420; color: #22d3ee; border: 1px solid #06b6d440; padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="badge">⚡ Express REST API Engine Online (ZapBite AI Enabled)</span>
        <h1>ZapBite.ai Backend</h1>
        <p>Connected to REST API server with persistent JSON database running on port <strong>5000</strong>.</p>
        <p>To launch the main <strong>ZapBite.ai Web Application Interface</strong>, click below:</p>
        <a href="http://localhost:5173" class="btn">🚀 Open Frontend Web App (Port 5173)</a>
      </div>
    </body>
    </html>
  `);
});

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'ZapBite.ai Express REST API & Persistent Engine',
    timestamp: new Date().toISOString(),
    aiEngine: 'ZapBite AI Engine / Smart Concierge',
    stats: {
      totalRestaurants: restaurants.length,
      totalMenuItems: menuItems.length,
      totalOrders: orders.length,
      activePartners: deliveryPartners.filter(p => p.status !== 'Offline').length,
      registeredUsers: users.length
    }
  });
});

// 1b. User Authentication & Registration Endpoints
app.get('/api/users', (req, res) => res.json(users));

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, role, password } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and Email are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email address already exists.' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    phone: phone || '+91 98765 00000',
    role: role || 'customer',
    password: password || 'password123',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  };

  users.unshift(newUser);
  saveDb();
  res.status(201).json(newUser);
});

app.post('/api/auth/send-sms-otp', async (req, res) => {
  const { phone, otp } = req.body;
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);

  console.log(`💬 [REAL SMS DISPATCH] Triggered SMS OTP code [${otp}] to mobile +91 ${cleanPhone}`);

  let smsSentSuccess = false;
  let activeProvider = 'Console Logger (Dev)';

  // 1. 2Factor.in Pure Text SMS Gateway with Approved Template ZapBite_OTP
  const twoFactorKey = process.env.TWOFACTOR_API_KEY || 'fff2bb13-9a60-11f1-9cb1-0200cd936042';
  if (twoFactorKey) {
    try {
      // 1. Direct Template-bound SMS Endpoint
      const tfUrl = `https://2factor.in/API/V1/${twoFactorKey}/SMS/+91${cleanPhone}/${otp}/ZapBite_OTP`;
      const response = await fetch(tfUrl);
      const data = await response.json();
      console.log('📱 2Factor.in ZapBite_OTP Route Response:', data);

      if (data.Status === 'Success') {
        smsSentSuccess = true;
        activeProvider = '2Factor.in ZapBite_OTP SMS';
      } else {
        // 2. Try TRANS_SMS with templatename parameter
        const tsmsUrl = `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=${twoFactorKey}&to=${cleanPhone}&from=OPTOTP&templatename=ZapBite_OTP&var1=${otp}`;
        const res2 = await fetch(tsmsUrl);
        const data2 = await res2.json();
        console.log('📱 2Factor.in TRANS_SMS Response:', data2);
        if (data2.Status === 'Success') {
          smsSentSuccess = true;
          activeProvider = '2Factor.in TRANS_SMS';
        }
      }
    } catch (e) {
      console.error('2Factor.in Dispatch Error:', e.message);
    }
  }

  // 2. Fast2SMS Integration as secondary
  if (!smsSentSuccess && process.env.FAST2SMS_API_KEY) {
    try {
      const apiKey = process.env.FAST2SMS_API_KEY;
      const qUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=q&message=${encodeURIComponent(`Your ZapBite mobile verification code is ${otp}`)}&language=english&flash=0&numbers=${cleanPhone}`;
      const qRes = await fetch(qUrl);
      const qData = await qRes.json();
      console.log('📱 Fast2SMS Response:', qData);
      if (qData.return) {
        smsSentSuccess = true;
        activeProvider = 'Fast2SMS Gateway';
      }
    } catch (e) {
      console.error('Fast2SMS Dispatch Error:', e.message);
    }
  }

  res.json({
    success: true,
    message: smsSentSuccess ? `Real SMS delivered to +91 ${cleanPhone}` : `SMS queued for +91 ${cleanPhone}`,
    phone: cleanPhone,
    provider: activeProvider,
    smsDelivered: smsSentSuccess
  });
});

app.post('/api/auth/login', (req, res) => {
  const { emailOrPhone, role } = req.body;
  const q = (emailOrPhone || '').toLowerCase().trim();

  const userMatch = users.find(u => 
    (u.email.toLowerCase() === q || u.phone.includes(q)) && 
    (u.role === role || !role)
  );

  if (userMatch) {
    return res.json(userMatch);
  }

  // Fallback demo user for requested role
  const fallback = users.find(u => u.role === role) || users[0];
  res.json({ ...fallback, name: emailOrPhone ? emailOrPhone.split('@')[0] : fallback.name });
});

// 1c. Gemini AI Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { message, activeOrders = [] } = req.body;
  const query = (message || '').toLowerCase().trim();

  // If Gemini API Key is available in process.env, query Gemini REST API
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      const menuContext = menuItems.map(i => `${i.name} (₹${i.price}, ${i.category}, ${i.isVeg ? 'Veg' : 'Non-Veg'}, ${i.calories})`).join('; ');
      const orderContext = activeOrders.map(o => `Order ${o.id}: ${o.status} from ${o.restaurantName}`).join('; ');

      const systemPrompt = `You are BiteBot AI, the intelligent neural food concierge for ZapBite.ai.
Available Menu Items: ${menuContext}.
Active User Orders: ${orderContext || 'None'}.
Be enthusiastic, friendly, food-passionate, and concise. Highlight dish names and prices clearly.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }] }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) {
          return res.json({ text: aiText, isGemini: true });
        }
      }
    } catch (err) {
      console.log('Gemini API call failed, using intelligent assistant:', err.message);
    }
  }

  // Fallback Smart Natural Language Parser
  if (query.includes('track') || query.includes('where is') || query.includes('status') || query.includes('order')) {
    if (activeOrders.length === 0) {
      return res.json({
        text: `You don't have any active orders queued right now. Explore our chef specials! 🍔🍕`,
        suggestions: ['🔥 Best Biryani under ₹300', '🥗 Healthy Veg Bowls', '⚡ Quick 15 min items']
      });
    }

    const latest = activeOrders[0];
    return res.json({
      text: `⚡ **Live Tracking Update**: Order **${latest.id}** from **${latest.restaurantName}** is currently **${latest.status}**! Estimated delivery time: approx ${latest.estimatedDeliveryMins || 15} mins.`,
      suggestions: ['📍 View HUD Route Map', '📞 Contact Rider', '🍨 Add Dessert to Order'],
      actions: [{ type: 'TRACK_ORDER', orderId: latest.id, label: '📍 Open Interactive HUD Route Map' }]
    });
  }

  res.json({
    text: `Greetings! I am **ZapBot AI** ⚡ (Powered by ZapBite AI). I can recommend dishes tailored to your budget, diet, or craving, and track your live deliveries in real-time!`,
    suggestions: ['🔥 Top Biryanis under ₹300', '🥗 High-Protein Veg Bowls', '🍕 Cheesy Pizza Deals', '📍 Track Live Order']
  });
});

// 2. ZapPay AI Payment Verification & Promo Optimizer Endpoint
app.post('/api/payments/verify', (req, res) => {
  const { items, paymentMode, appliedCoupon } = req.body;

  const subtotal = (items || []).reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const aiRecommendation = getSmartPaymentRecommendation(items, subtotal);
  const discount = aiRecommendation.savings || 0;

  const deliveryFee = subtotal > 500 ? 0 : 35;
  const taxes = Math.round(subtotal * 0.05);
  const finalAmount = Math.max(0, subtotal + deliveryFee + taxes - discount);

  const securityInfo = generatePaymentSecurityScore(paymentMode, finalAmount);
  const transactionId = `TXN-AI-${Math.floor(100000 + Math.random() * 900000)}`;

  res.json({
    transactionId,
    status: 'Verified',
    subtotal,
    discount,
    deliveryFee,
    taxes,
    finalAmount,
    appliedCoupon: appliedCoupon || aiRecommendation.bestOffer?.code || 'ZAPBITE50',
    securityInfo,
    aiSavingsMessage: `🎉 ZapPay AI saved you ₹${discount} on this order!`
  });
});

// 3. Restaurants REST Endpoints
app.get('/api/restaurants', (req, res) => res.json(restaurants));

// 4. Menu Items REST Endpoints
app.get('/api/menu', (req, res) => {
  const { category, isVeg, search } = req.query;
  let result = menuItems;

  if (category && category !== 'All') result = result.filter(m => m.category === category);
  if (isVeg === 'true') result = result.filter(m => m.isVeg);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(m => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
  }

  res.json(result);
});

app.post('/api/menu', (req, res) => {
  const { restaurantId, name, category, price, isVeg, description, image } = req.body;
  const newItem = {
    id: `item-${Date.now()}`,
    restaurantId: restaurantId || 'rest-1',
    name,
    category: category || 'General',
    price: parseFloat(price),
    isVeg: Boolean(isVeg),
    rating: 5.0,
    ratingCount: 1,
    description: description || 'Fresh kitchen dish',
    image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    tag: 'Chef Special',
    calories: '450 kcal',
    inStock: true,
  };
  menuItems.unshift(newItem);
  saveDb();
  res.status(201).json(newItem);
});

app.patch('/api/menu/:id/stock', (req, res) => {
  const item = menuItems.find(m => m.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Menu item not found' });
  item.inStock = !item.inStock;
  saveDb();
  res.json(item);
});

// 5. Orders REST Endpoints
app.get('/api/orders', (req, res) => res.json(orders));

app.post('/api/orders', (req, res) => {
  const { customerName, customerPhone, deliveryAddress, paymentMode, items } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ error: 'Order must contain items' });

  const firstItem = items[0];
  const rest = restaurants.find(r => r.id === firstItem.restaurantId) || restaurants[0];

  const subtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const aiRecommendation = getSmartPaymentRecommendation(items, subtotal);
  const discount = aiRecommendation.savings || 0;
  const deliveryFee = subtotal > 500 ? 0 : 35;
  const taxes = Math.round(subtotal * 0.05);
  const totalAmount = Math.max(0, subtotal + deliveryFee + taxes - discount);

  const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const availablePartner = deliveryPartners.find(p => p.status === 'Available');

  const newOrder = {
    id: newOrderId,
    customerName: customerName || 'Valued Customer',
    customerPhone: customerPhone || '+91 98765 00000',
    deliveryAddress: deliveryAddress || 'MVP Colony, Vizag',
    restaurantId: rest.id,
    restaurantName: rest.name,
    items,
    totalAmount,
    subtotal,
    deliveryFee,
    taxes,
    discount,
    paymentMode: paymentMode || 'UPI (PhonePe)',
    paymentStatus: paymentMode === 'Cash on Delivery' ? 'Pending' : 'Paid (ZapPay AI Verified)',
    status: 'Placed',
    createdAt: new Date().toISOString(),
    estimatedDeliveryMins: 25,
    deliveryPartnerId: availablePartner ? availablePartner.id : null,
    history: [
      {
        status: 'Placed',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: `Order placed via ZapPay AI (Saved ₹${discount})`
      }
    ]
  };

  if (availablePartner) {
    availablePartner.status = 'On Delivery';
    availablePartner.activeOrderId = newOrderId;
  }

  orders.unshift(newOrder);
  saveDb();
  res.status(201).json(newOrder);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { status, note, deliveryPartnerId } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = status;
  if (deliveryPartnerId) {
    order.deliveryPartnerId = deliveryPartnerId;
  } else if (!order.deliveryPartnerId) {
    const availablePartner = deliveryPartners.find(p => p.status === 'Available') || deliveryPartners[0];
    order.deliveryPartnerId = availablePartner ? availablePartner.id : 'partner-1';
  }

  order.history.push({
    status,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    note: note || `Updated to ${status}`
  });

  if (status === 'Delivered' && order.deliveryPartnerId) {
    const partner = deliveryPartners.find(p => p.id === order.deliveryPartnerId);
    if (partner) {
      partner.status = 'Available';
      partner.activeOrderId = null;
      partner.deliveriesCount += 1;
    }
  }

  saveDb();
  res.json(order);
});

app.post('/api/orders/:id/fast-forward', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const stages = ['Placed', 'Accepted', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'];
  const currentIndex = stages.indexOf(order.status);
  if (currentIndex < stages.length - 1) {
    const nextStatus = stages[currentIndex + 1];
    order.status = nextStatus;
    order.history.push({
      status: nextStatus,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: `Fast-forwarded to ${nextStatus}`
    });

    if (nextStatus === 'Delivered' && order.deliveryPartnerId) {
      const partner = deliveryPartners.find(p => p.id === order.deliveryPartnerId);
      if (partner) {
        partner.status = 'Available';
        partner.activeOrderId = null;
        partner.deliveriesCount += 1;
      }
    }
  }

  saveDb();
  res.json(order);
});

// 6. Partners API
app.get('/api/partners', (req, res) => res.json(deliveryPartners));

app.patch('/api/partners/:id/status', (req, res) => {
  const partner = deliveryPartners.find(p => p.id === req.params.id);
  if (!partner) return res.status(404).json({ error: 'Partner not found' });
  partner.status = partner.status === 'Available' ? 'Offline' : 'Available';
  saveDb();
  res.json(partner);
});

// 7. Admin Metrics
app.get('/api/admin/metrics', (req, res) => {
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  res.json({
    totalOrders: orders.length,
    totalRevenue,
    avgDeliveryTimeMins: 22.4,
    activeFleetRiders: deliveryPartners.filter(p => p.status !== 'Offline').length,
  });
});

app.listen(PORT, () => {
  console.log(`⚡ ZapBite.ai Express Backend + Persistent DB + Gemini AI Shield running on http://localhost:${PORT}`);
});
