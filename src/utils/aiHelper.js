import { INITIAL_MENU_ITEMS } from '../data/mockData';

const API_BASE = 'http://localhost:5000/api';

export async function fetchBiteBotAIResponse(userMessage, activeOrders = [], cart = []) {
  try {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, activeOrders })
    });

    if (res.ok) {
      const data = await res.json();
      const localResult = getBiteBotResponse(userMessage, activeOrders, cart);
      return {
        ...localResult,
        text: data.text || localResult.text,
        isGemini: Boolean(data.isGemini),
        suggestions: data.suggestions || localResult.suggestions,
        actions: data.actions || localResult.actions
      };
    }
  } catch (err) {
    console.log('AI API offline, using local smart engine', err);
  }

  return getBiteBotResponse(userMessage, activeOrders, cart);
}

export function getBiteBotResponse(userMessage, activeOrders = [], cart = []) {
  const query = userMessage.toLowerCase().trim();

  // 1. Order Tracking Queries
  if (
    query.includes('order') || 
    query.includes('track') || 
    query.includes('status') || 
    query.includes('where is') || 
    query.includes('delivery time') || 
    query.includes('eta')
  ) {
    if (activeOrders.length === 0) {
      return {
        text: `You don't have any active orders at the moment. Browse our menu and place a delicious order! 🍔🍕`,
        suggestions: ['🔥 Best Biryani under ₹300', '🥗 Healthy Veg Bowls', '⚡ Quick 15 min items'],
        actions: []
      };
    }

    const latestOrder = activeOrders[0];
    let statusMsg = '';
    switch (latestOrder.status) {
      case 'Placed':
        statusMsg = `Order **${latestOrder.id}** has been received and sent to **${latestOrder.restaurantName}**! Chef is reviewing it. ⏱️`;
        break;
      case 'Accepted':
      case 'Preparing':
        statusMsg = `👨‍🍳 **${latestOrder.restaurantName}** is currently cooking your order **${latestOrder.id}**! ETA: approx ${latestOrder.estimatedDeliveryMins} mins.`;
        break;
      case 'Ready':
        statusMsg = `📦 Order **${latestOrder.id}** is freshly packed at **${latestOrder.restaurantName}** and waiting for rider pickup!`;
        break;
      case 'Out for Delivery':
        statusMsg = `🛵 Rider is on the way with your order **${latestOrder.id}**! Arriving in approx 10-12 mins.`;
        break;
      case 'Delivered':
        statusMsg = `🎉 Order **${latestOrder.id}** was delivered! Enjoy your meal! ✨`;
        break;
      default:
        statusMsg = `Order **${latestOrder.id}** is in progress (${latestOrder.status}).`;
    }

    return {
      text: statusMsg,
      suggestions: ['📍 Open Interactive HUD Map', '📞 Call Restaurant', '🍔 Order Dessert'],
      actions: [
        { type: 'TRACK_ORDER', orderId: latestOrder.id, label: '📍 View Interactive HUD Delivery Map' }
      ]
    };
  }

  // 2. Budget Queries
  const budgetMatch = query.match(/(?:under|below|less than|budget|cheap|within)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i) || query.match(/(\d+)\s*(?:rs|rupees|inr)/i);
  if (budgetMatch || query.includes('budget') || query.includes('cheap')) {
    const maxPrice = budgetMatch ? parseInt(budgetMatch[1]) : 250;
    const affordableItems = INITIAL_MENU_ITEMS.filter(item => item.price <= maxPrice && item.inStock);

    if (affordableItems.length > 0) {
      return {
        text: `Here are top delicious dishes under ₹${maxPrice} curated by ZapBot AI:`,
        items: affordableItems.slice(0, 3),
        suggestions: ['🌱 Show Veg Only', '🌶️ Spicy Starters', '🛒 View My Cart'],
        actions: []
      };
    } else {
      return {
        text: `I couldn't find items under ₹${maxPrice}. How about our top items under ₹250?`,
        items: INITIAL_MENU_ITEMS.filter(item => item.price <= 250).slice(0, 3),
        suggestions: ['🔥 Biryani Deals', '🍕 Cheesy Garlic Bread'],
        actions: []
      };
    }
  }

  // 3. Category / Cuisine Queries
  if (query.includes('biryani') || query.includes('rice')) {
    const biryanis = INITIAL_MENU_ITEMS.filter(i => i.category === 'Biryani' || i.name.toLowerCase().includes('biryani'));
    return {
      text: `🌶️ Craving Biryani? Check out our authentic Hyderabadi & Dum Biryanis:`,
      items: biryanis,
      suggestions: ['🍗 Chicken Biryani', '🧀 Veg Paneer Biryani', '📍 Track Order'],
      actions: []
    };
  }

  if (query.includes('pizza') || query.includes('garlic bread') || query.includes('italian')) {
    const pizzas = INITIAL_MENU_ITEMS.filter(i => i.category === 'Pizzas' || i.name.toLowerCase().includes('pizza') || i.name.toLowerCase().includes('bread'));
    return {
      text: `🍕 Freshly baked woodfired pizzas & crispy garlic bread:`,
      items: pizzas,
      suggestions: ['🌶️ Pepperoni Supreme', '🧄 Cheesy Garlic Bread'],
      actions: []
    };
  }

  if (query.includes('burger') || query.includes('fries')) {
    const burgers = INITIAL_MENU_ITEMS.filter(i => i.category === 'Burgers' || i.category === 'Sides');
    return {
      text: `🍔 Juicy flame-grilled burgers & loaded peri-peri fries:`,
      items: burgers,
      suggestions: ['🥓 Smoked Bacon Burger', '🍟 Peri Peri Fries'],
      actions: []
    };
  }

  if (query.includes('veg') || query.includes('vegetarian') || query.includes('pure veg')) {
    const vegItems = INITIAL_MENU_ITEMS.filter(i => i.isVeg);
    return {
      text: `🌱 Here are top rated 100% Pure Veg delicacies:`,
      items: vegItems.slice(0, 4),
      suggestions: ['🫓 Ghee Roast Dosa', '🥗 Buddha Protein Bowl', '🧇 Chocolate Waffle'],
      actions: []
    };
  }

  if (query.includes('healthy') || query.includes('diet') || query.includes('protein') || query.includes('salad')) {
    const healthyItems = INITIAL_MENU_ITEMS.filter(i => i.category === 'Healthy' || i.calories.includes('320') || i.isVeg);
    return {
      text: `🥗 Stay fit! Here are high-protein and healthy nutrient-rich options:`,
      items: healthyItems.slice(0, 3),
      suggestions: ['🥑 Avocado Buddha Bowl', '🌱 Paneer Kathi Roll'],
      actions: []
    };
  }

  if (query.includes('dessert') || query.includes('sweet') || query.includes('shake') || query.includes('waffle')) {
    const desserts = INITIAL_MENU_ITEMS.filter(i => i.category === 'Desserts');
    return {
      text: `🍨 Sweet teeth alert! Indulge in warm Belgian waffles & Ferrero Rocher shakes:`,
      items: desserts,
      suggestions: ['🧇 Belgian Chocolate Waffle', '🥤 Nutella Shake'],
      actions: []
    };
  }

  // Default Greeting / Help
  return {
    text: `Greetings! I am **ZapBot AI** ⚡ (Powered by ZapBite AI). How can I assist you today?
- Ask me for dish recommendations (*"Spicy biryani under ₹300"*)
- Filter by diet (*"Pure veg healthy bowls"*)
- Track your live delivery (*"Where is my order?"*)`,
    suggestions: ['🔥 Biryani Specials', '🍔 Gourmet Burgers under ₹250', '🥗 Healthy Bowls', '📍 Track Live Order'],
    actions: []
  };
}
