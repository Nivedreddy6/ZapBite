import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_RESTAURANTS, 
  INITIAL_MENU_ITEMS, 
  INITIAL_DELIVERY_PARTNERS, 
  INITIAL_ORDERS 
} from '../data/mockData';

const API_BASE = 'http://localhost:5000/api';
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState('customer');
  const [isLandingPageOpen, setIsLandingPageOpen] = useState(true);
  const [user, setUser] = useState({
    id: 'cust-101',
    name: 'Rahul Malhotra',
    email: 'rahul@zapbite.ai',
    phone: '+91 98765 00112',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  });

  const [restaurants, setRestaurants] = useState(INITIAL_RESTAURANTS);
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [deliveryPartners, setDeliveryPartners] = useState(INITIAL_DELIVERY_PARTNERS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [cart, setCart] = useState([]);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState('ORD-8821');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBiteBotOpen, setIsBiteBotOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Sync initial state from Express REST API
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [resRest, resMenu, resOrders, resPartners] = await Promise.all([
          fetch(`${API_BASE}/restaurants`),
          fetch(`${API_BASE}/menu`),
          fetch(`${API_BASE}/orders`),
          fetch(`${API_BASE}/partners`)
        ]);

        if (resRest.ok && resMenu.ok && resOrders.ok && resPartners.ok) {
          const restData = await resRest.json();
          const menuData = await resMenu.json();
          const ordersData = await resOrders.json();
          const partnersData = await resPartners.json();

          setRestaurants(restData);
          setMenuItems(menuData);
          setOrders(ordersData);
          setDeliveryPartners(partnersData);
          setIsBackendConnected(true);
        }
      } catch (err) {
        setIsBackendConnected(false);
      }
    };

    fetchBackendData();
  }, []);

  const playSoundChime = (type = 'success') => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);
      }

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.log('Audio synth unavailable', e);
    }
  };

  const showNotification = (msg, type = 'info') => {
    setNotification({ msg, type, id: Date.now() });
    playSoundChime(type === 'error' ? 'alert' : 'success');
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const logout = () => {
    setUser(null);
    setIsLandingPageOpen(true);
    showNotification('Logged out successfully! 👋', 'info');
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    showNotification(`Added "${item.name}" to cart! 🛒`);
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((i) => i.item.id !== itemId));
  };

  const updateCartQuantity = (itemId, delta) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.item.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCart([]);

  const placeOrder = async ({ customerName, customerPhone, deliveryAddress, paymentMode }) => {
    if (cart.length === 0) return null;

    const itemsPayload = cart.map((c) => ({
      id: c.item.id,
      restaurantId: c.item.restaurantId,
      name: c.item.name,
      price: c.item.price,
      quantity: c.quantity,
      isVeg: c.item.isVeg,
    }));

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: user ? user.name : customerName,
          customerPhone: user ? user.phone : customerPhone,
          deliveryAddress,
          paymentMode,
          items: itemsPayload
        })
      });

      if (res.ok) {
        const createdOrder = await res.json();
        setOrders((prev) => [createdOrder, ...prev]);
        clearCart();
        setActiveTrackingOrderId(createdOrder.id);
        setIsCartOpen(false);
        showNotification(`🎉 Order ${createdOrder.id} placed! Waiting for kitchen to accept...`, 'success');
        return createdOrder.id;
      }
    } catch (e) {
      console.log('Falling back to local order creation', e);
    }

    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);

    const newOrder = {
      id: newOrderId,
      customerName: user ? user.name : customerName,
      customerPhone: user ? user.phone : customerPhone,
      deliveryAddress: deliveryAddress || 'MVP Colony, Vizag',
      restaurantId: cart[0].item.restaurantId,
      restaurantName: restaurants.find(r => r.id === cart[0].item.restaurantId)?.name || 'ZapBite Restaurant',
      items: itemsPayload,
      totalAmount: subtotal + 35,
      subtotal,
      deliveryFee: 35,
      taxes: 15,
      paymentMode: paymentMode || 'UPI (PhonePe)',
      paymentStatus: 'Paid',
      status: 'Placed',
      createdAt: new Date().toISOString(),
      estimatedDeliveryMins: 25,
      deliveryPartnerId: null,
      history: [{ status: 'Placed', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Placed order' }]
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveTrackingOrderId(newOrderId);
    setIsCartOpen(false);
    showNotification(`🎉 Order ${newOrderId} placed! Waiting for kitchen to accept...`, 'success');
    return newOrderId;
  };

  const updateOrderStatus = async (orderId, newStatus, note = '') => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note })
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
        showNotification(`Order ${orderId} status: "${newStatus}"`, 'info');
        return;
      }
    } catch (e) {
      console.log('Updating status locally', e);
    }

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const partnerId = ord.deliveryPartnerId || 'partner-1';
          return { ...ord, status: newStatus, deliveryPartnerId: partnerId };
        }
        return ord;
      })
    );
  };

  const fastForwardOrder = async (orderId) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/fast-forward`, { method: 'POST' });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
        showNotification(`Order ${orderId} updated to "${updatedOrder.status}"`, 'info');
        return;
      }
    } catch (e) {
      console.log(e);
    }

    // Local fallback fast forward
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const statusFlow = ['Placed', 'Accepted', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'];
          const currentIdx = statusFlow.indexOf(ord.status);
          const nextStatus = currentIdx < statusFlow.length - 1 ? statusFlow[currentIdx + 1] : 'Delivered';
          const partnerId = ord.deliveryPartnerId || (nextStatus !== 'Placed' ? 'partner-1' : null);
          return { ...ord, status: nextStatus, deliveryPartnerId: partnerId };
        }
        return ord;
      })
    );
  };

  const toggleMenuItemStock = async (itemId) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, inStock: !item.inStock } : item))
    );
  };

  const addMenuItem = async (newItem) => {
    const item = { ...newItem, id: `item-${Date.now()}`, rating: 5.0, inStock: true };
    setMenuItems((prev) => [item, ...prev]);
  };

  const togglePartnerStatus = async (partnerId) => {
    setDeliveryPartners((prev) =>
      prev.map((p) => (p.id === partnerId ? { ...p, status: p.status === 'Available' ? 'Offline' : 'Available' } : p))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        isLandingPageOpen,
        setIsLandingPageOpen,
        user,
        setUser,
        logout,
        restaurants,
        menuItems,
        deliveryPartners,
        orders,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        fastForwardOrder,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        isCartOpen,
        setIsCartOpen,
        isBiteBotOpen,
        setIsBiteBotOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        notification,
        showNotification,
        toggleMenuItemStock,
        addMenuItem,
        togglePartnerStatus,
        isBackendConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
