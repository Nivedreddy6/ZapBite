import express from 'express';
import cors from 'cors';
import { 
  INITIAL_RESTAURANTS, 
  INITIAL_MENU_ITEMS, 
  INITIAL_DELIVERY_PARTNERS, 
  INITIAL_ORDERS 
} from '../src/data/mockData.js';
import { getSmartPaymentRecommendation, generatePaymentSecurityScore } from '../src/utils/aiPayments.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let restaurants = [...INITIAL_RESTAURANTS];
let menuItems = [...INITIAL_MENU_ITEMS];
let deliveryPartners = [...INITIAL_DELIVERY_PARTNERS];
let orders = [...INITIAL_ORDERS];

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
        <span class="badge">⚡ Express REST API Engine Online</span>
        <h1>ZapBite.ai Backend</h1>
        <p>You have connected to the REST API server running on port <strong>5000</strong>.</p>
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
    service: 'ZapBite.ai Express REST API Backend & ZapPay AI Payment Shield',
    timestamp: new Date().toISOString(),
    stats: {
      totalRestaurants: restaurants.length,
      totalMenuItems: menuItems.length,
      totalOrders: orders.length,
      activePartners: deliveryPartners.filter(p => p.status !== 'Offline').length
    }
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
  res.status(201).json(newItem);
});

app.patch('/api/menu/:id/stock', (req, res) => {
  const item = menuItems.find(m => m.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Menu item not found' });
  item.inStock = !item.inStock;
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
    paymentStatus: paymentMode === 'Cash on Delivery' ? 'Pending' : 'Paid (ZapPay Verified)',
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
  res.status(201).json(newOrder);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { status, note } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = status;
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

  res.json(order);
});

// 6. Partners API
app.get('/api/partners', (req, res) => res.json(deliveryPartners));

app.patch('/api/partners/:id/status', (req, res) => {
  const partner = deliveryPartners.find(p => p.id === req.params.id);
  if (!partner) return res.status(404).json({ error: 'Partner not found' });
  partner.status = partner.status === 'Available' ? 'Offline' : 'Available';
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
  console.log(`⚡ ZapBite.ai Express Backend + ZapPay AI Payment Shield running on http://localhost:${PORT}`);
});
