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
  const [currentRole, setCurrentRoleState] = useState(() => {
    return localStorage.getItem('zapbite_role') || 'customer';
  });

  const setCurrentRole = (role) => {
    setCurrentRoleState(role);
    localStorage.setItem('zapbite_role', role);
  };

  const [user, setUserState] = useState(() => {
    const saved = localStorage.getItem('zapbite_user');
    if (saved && saved !== 'null' && saved !== 'undefined') {
      try { 
        const parsed = JSON.parse(saved); 
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (e) {}
    }
    return null;
  });

  const setUser = (userObj) => {
    setUserState(userObj);
    if (userObj) {
      localStorage.setItem('zapbite_user', JSON.stringify(userObj));
    } else {
      localStorage.removeItem('zapbite_user');
    }
  };

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('zapbite_registered_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [isLandingPageOpen, setIsLandingPageOpenState] = useState(() => {
    return sessionStorage.getItem('zapbite_landing_dismissed') !== 'true';
  });

  const setIsLandingPageOpen = (isOpen) => {
    setIsLandingPageOpenState(isOpen);
    if (!isOpen) {
      sessionStorage.setItem('zapbite_landing_dismissed', 'true');
    } else {
      sessionStorage.removeItem('zapbite_landing_dismissed');
    }
  };

  const [customerSubTab, setCustomerSubTab] = useState('menu');
  const [selectedLocation, setSelectedLocationState] = useState(() => {
    const saved = localStorage.getItem('zapbite_location');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      area: 'Madhapur',
      city: 'Hyderabad',
      isGPS: false
    };
  });

  const setSelectedLocation = (loc) => {
    setSelectedLocationState(loc);
    if (loc) {
      localStorage.setItem('zapbite_location', JSON.stringify(loc));
    }
  };

  const [savedAddress, setSavedAddressState] = useState(() => {
    const saved = localStorage.getItem('zapbite_saved_address');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      houseNo: 'Flat 402, High-Tech Tower',
      street: 'Hitec City Main Road',
      landmark: 'Near Cyber Towers',
      city: 'Hyderabad'
    };
  });

  const saveUserAddress = (addressObj) => {
    setSavedAddressState(addressObj);
    localStorage.setItem('zapbite_saved_address', JSON.stringify(addressObj));
  };

  const detectGPSLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        showNotification('GPS Geolocation is not supported by your browser.', 'error');
        resolve(null);
        return;
      }

      showNotification('🛰️ Pinpointing live GPS coordinates...', 'info');

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          let detectedArea = 'MVP Colony';
          let detectedCity = 'Vizag';
          let detectedStreet = '';

          try {
            // 1. Try OpenStreetMap Nominatim with detailed address breakdown
            const nomRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
            if (nomRes.ok) {
              const nomData = await nomRes.json();
              const addr = nomData.address || {};
              
              detectedStreet = addr.road || addr.pedestrian || addr.street || '';
              const locality = addr.suburb || addr.neighbourhood || addr.residential || addr.subdistrict || addr.quarter || '';
              const city = addr.city || addr.town || addr.municipality || addr.state_district || 'Vizag';

              if (locality && locality.toLowerCase() !== city.toLowerCase()) {
                detectedArea = detectedStreet ? `${detectedStreet}, ${locality}` : locality;
              } else if (detectedStreet) {
                detectedArea = detectedStreet;
              } else {
                detectedArea = addr.county || 'Main Area';
              }

              detectedCity = city.replace(/district/gi, '').trim() || 'Vizag';
            }
          } catch (e) {
            try {
              // 2. Fallback to BigDataCloud
              const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
              if (res.ok) {
                const data = await res.json();
                detectedArea = data.locality || (data.localityInfo?.administrative?.[3]?.name) || 'MVP Colony';
                detectedCity = data.city || data.principalSubdivision || 'Vizag';
              }
            } catch (err) {}
          }

          // If area is same as city (e.g. Visakhapatnam | Visakhapatnam), make area more specific
          if (detectedArea.toLowerCase() === detectedCity.toLowerCase()) {
            detectedArea = 'Beach Road & Central';
          }

          const gpsLoc = {
            area: detectedArea,
            city: detectedCity,
            lat,
            lng,
            isGPS: true
          };

          setSelectedLocation(gpsLoc);
          showNotification(`🎯 GPS Locked! Location: ${detectedArea}, ${detectedCity}`, 'success');
          resolve(gpsLoc);
        },
        async (error) => {
          console.log('GPS error:', error);
          // Try IP-based location estimation
          try {
            const ipRes = await fetch('https://ipapi.co/json/');
            if (ipRes.ok) {
              const ipData = await ipRes.json();
              const ipLoc = {
                area: ipData.city || 'Central Area',
                city: ipData.region || ipData.city || 'Hyderabad',
                lat: ipData.latitude,
                lng: ipData.longitude,
                isGPS: false
              };
              setSelectedLocation(ipLoc);
              showNotification(`📍 Estimated Location: ${ipLoc.area}, ${ipLoc.city}`, 'info');
              resolve(ipLoc);
              return;
            }
          } catch (err) {}

          const fallback = { area: 'Madhapur', city: 'Hyderabad', isGPS: false };
          setSelectedLocation(fallback);
          showNotification('Could not access GPS. Please choose location manually.', 'info');
          resolve(fallback);
        },
        { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
      );
    });
  };

  const [restaurants, setRestaurants] = useState(INITIAL_RESTAURANTS);
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [deliveryPartners, setDeliveryPartners] = useState(INITIAL_DELIVERY_PARTNERS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [cart, setCart] = useState([]);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBiteBotOpen, setIsBiteBotOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const registerUser = async (userPayload) => {
    let created = null;

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
      });

      if (res.ok) {
        created = await res.json();
      } else {
        const errData = await res.json();
        throw new Error(errData.error || 'Registration failed');
      }
    } catch (e) {
      console.log('Registering locally / offline fallback:', e);
      if (e.message && e.message !== 'Failed to fetch') {
        throw e;
      }
      created = {
        id: `user-${Date.now()}`,
        ...userPayload,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
      };
    }

    setRegisteredUsers((prev) => {
      const updated = [created, ...prev.filter(u => u.email !== created.email)];
      localStorage.setItem('zapbite_registered_users', JSON.stringify(updated));
      return updated;
    });

    setUser(created);
    setCurrentRole(created.role || 'customer');
    return created;
  };

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

        if (resRest.ok && resMenu.ok) {
          setRestaurants(await resRest.json());
          setMenuItems(await resMenu.json());
        }
        if (resOrders.ok) {
          const o = await resOrders.json();
          setOrders(o);
          const active = o.find(item => item.status !== 'Delivered');
          if (active) setActiveTrackingOrderId(active.id);
        }
        if (resPartners.ok) setDeliveryPartners(await resPartners.json());
        setIsBackendConnected(true);
      } catch (err) {
        console.log('Using local fallback state (backend offline):', err);
        setIsBackendConnected(false);
      }
    };

    fetchBackendData();
  }, []);

  // Realistic 30-35 Minute Real-Time Order Lifecycle
  useEffect(() => {
    const checkOrderProgress = () => {
      const statusMessages = {
        Accepted: '👨‍🍳 Restaurant confirmed your order! Kitchen is preparing.',
        Preparing: '🍳 Chef started cooking your fresh meal.',
        Ready: '📦 Food is packed & sealed! Delivery partner is picking it up.',
        'Out for Delivery': '🛵 Delivery partner picked up your food and is on the way!',
        Delivered: '🎉 Order delivered to your doorstep! Enjoy your meal.'
      };

      setOrders((prevOrders) => {
        let hasChanges = false;
        const updated = prevOrders.map((ord) => {
          if (ord.status === 'Delivered') return ord;

          const createdTime = new Date(ord.createdAt).getTime();
          const elapsedMins = Math.max(0, (Date.now() - createdTime) / 60000);
          const totalMins = ord.estimatedDeliveryMins || 32;

          let targetStatus = ord.status;

          if (elapsedMins >= totalMins) {
            targetStatus = 'Delivered';
          } else if (elapsedMins >= totalMins * 0.45) { // ~14-16 mins
            targetStatus = 'Out for Delivery';
          } else if (elapsedMins >= totalMins * 0.35) { // ~11-12 mins
            targetStatus = 'Ready';
          } else if (elapsedMins >= totalMins * 0.1) {  // ~3-4 mins
            targetStatus = 'Preparing';
          } else if (elapsedMins >= 1) {               // ~1-2 mins
            targetStatus = 'Accepted';
          }

          if (targetStatus !== ord.status) {
            hasChanges = true;
            showNotification(statusMessages[targetStatus] || `Order ${ord.id}: ${targetStatus}`, 'success');
            return {
              ...ord,
              status: targetStatus,
              history: [
                ...(ord.history || []),
                {
                  status: targetStatus,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  note: statusMessages[targetStatus] || targetStatus
                }
              ]
            };
          }

          return ord;
        });

        return hasChanges ? updated : prevOrders;
      });
    };

    // Check progress every 60 seconds (1 minute update)
    const interval = setInterval(checkOrderProgress, 60000);
    return () => clearInterval(interval);
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
        setCustomerSubTab('track');
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
      deliveryPartnerId: deliveryPartners.find(p => p.status === 'Available')?.id || 'partner-1',
      history: [{ status: 'Placed', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Placed order' }]
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveTrackingOrderId(newOrderId);
    setCustomerSubTab('track');
    setIsCartOpen(false);
    showNotification(`🎉 Order ${newOrderId} placed! Waiting for kitchen to accept...`, 'success');
    return newOrderId;
  };

  const updateOrderStatus = async (orderId, newStatus, note = '', partnerIdOverride = null) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note, deliveryPartnerId: partnerIdOverride })
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
          const partnerId = partnerIdOverride || ord.deliveryPartnerId || 'partner-1';
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

  const rateOrder = (orderId, ratingObj) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            foodRating: ratingObj.foodRating !== undefined ? ratingObj.foodRating : o.foodRating,
            deliveryRating: ratingObj.deliveryRating !== undefined ? ratingObj.deliveryRating : o.deliveryRating,
          };
        }
        return o;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        isLandingPageOpen,
        setIsLandingPageOpen,
        customerSubTab,
        setCustomerSubTab,
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
        isProfileModalOpen,
        setIsProfileModalOpen,
        rateOrder,
        notification,
        showNotification,
        toggleMenuItemStock,
        addMenuItem,
        togglePartnerStatus,
        isBackendConnected,
        registerUser,
        registeredUsers,
        selectedLocation,
        setSelectedLocation,
        savedAddress,
        saveUserAddress,
        detectGPSLocation
      }}

    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
