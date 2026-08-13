import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UtensilsCrossed, 
  Clock, 
  CheckCircle2, 
  Flame, 
  PackageCheck, 
  ChefHat, 
  AlertCircle, 
  Plus, 
  Power,
  Search
} from 'lucide-react';

export const RestaurantView = () => {
  const { 
    orders, 
    updateOrderStatus, 
    menuItems, 
    toggleMenuItemStock, 
    addMenuItem, 
    restaurants 
  } = useApp();

  const [selectedRestId, setSelectedRestId] = useState('all'); // Default to All Restaurants so no incoming orders are hidden
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu'
  const [newItemModal, setNewItemModal] = useState(false);

  // New Item Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Biryani');
  const [price, setPrice] = useState('');
  const [isVeg, setIsVeg] = useState(false);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80');

  const restOrders = orders.filter((o) => o.restaurantId === selectedRestId || selectedRestId === 'all');
  const restMenuItems = menuItems.filter((i) => i.restaurantId === selectedRestId || selectedRestId === 'all');

  const handleAddItemSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    addMenuItem({
      restaurantId: selectedRestId === 'all' ? 'rest-1' : selectedRestId,
      name,
      category,
      price: parseFloat(price),
      isVeg,
      description: description || 'Delicious kitchen creation',
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      tag: 'Chef Special',
      calories: '450 kcal',
    });

    setName('');
    setPrice('');
    setDescription('');
    setNewItemModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 text-slate-100">
      
      {/* Header & Restaurant Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Kitchen Order Dispatch Portal</h2>
            <p className="text-xs text-slate-400">Manage live incoming orders and menu item availability in real-time</p>
          </div>
        </div>

        {/* Restaurant Filter Dropdown & Tab Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedRestId}
            onChange={(e) => setSelectedRestId(e.target.value)}
            className="bg-slate-950 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-orange-500 flex-1 md:flex-initial"
          >
            <option value="all">🌐 All Kitchen Hubs ({orders.filter(o => o.status !== 'Delivered').length} Live)</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                🍳 {r.name} ({orders.filter(o => o.restaurantId === r.id && o.status !== 'Delivered').length})
              </option>
            ))}
          </select>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'orders' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Orders ({restOrders.filter(o => o.status !== 'Delivered').length})
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'menu' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Menu Items ({restMenuItems.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'orders' ? (
        /* Orders Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Placed / Incoming */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col h-[650px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="font-extrabold text-sm text-white">New Incoming</h3>
              </div>
              <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full">
                {restOrders.filter(o => o.status === 'Placed').length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {restOrders.filter(o => o.status === 'Placed').length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs font-medium">No new orders</div>
              ) : (
                restOrders.filter(o => o.status === 'Placed').map((order) => (
                  <div key={order.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-orange-400">{order.id}</span>
                          <span className="text-[10px] bg-slate-900 text-slate-300 font-bold px-1.5 py-0.5 rounded border border-slate-800">
                            {order.restaurantName || restaurants.find(r => r.id === order.restaurantId)?.name || 'Kitchen'}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-white mt-0.5">{order.customerName}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-lg space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-300">
                          <span>{it.name} x {it.quantity}</span>
                          <span className="font-bold">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="font-black text-sm text-white">₹{order.totalAmount}</span>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Preparing', 'Kitchen started preparing items')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg shadow active:scale-95 transition-all"
                      >
                        Accept & Start Cooking
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: In Kitchen Preparing */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col h-[650px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
                <h3 className="font-extrabold text-sm text-white">Kitchen Preparing</h3>
              </div>
              <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-0.5 rounded-full">
                {restOrders.filter(o => o.status === 'Preparing' || o.status === 'Accepted').length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {restOrders.filter(o => o.status === 'Preparing' || o.status === 'Accepted').length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs font-medium">Kitchen clear</div>
              ) : (
                restOrders.filter(o => o.status === 'Preparing' || o.status === 'Accepted').map((order) => (
                  <div key={order.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-orange-400">{order.id}</span>
                          <span className="text-[10px] bg-slate-900 text-slate-300 font-bold px-1.5 py-0.5 rounded border border-slate-800">
                            {order.restaurantName || restaurants.find(r => r.id === order.restaurantId)?.name || 'Kitchen'}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-white mt-0.5">{order.customerName}</h4>
                      </div>
                      <span className="bg-orange-500/20 text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded">
                        Cooking 🔥
                      </span>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-lg space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-300">
                          <span>{it.name} x {it.quantity}</span>
                          <span className="font-bold">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="font-black text-sm text-white">₹{order.totalAmount}</span>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Ready', 'Order packed and ready for rider')}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-lg shadow active:scale-95 transition-all"
                      >
                        Mark Ready for Dispatch
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 3: Ready / Out for Delivery */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col h-[650px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-extrabold text-sm text-white">Dispatch & Dispatched</h3>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full">
                {restOrders.filter(o => o.status === 'Ready' || o.status === 'Out for Delivery').length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {restOrders.filter(o => o.status === 'Ready' || o.status === 'Out for Delivery').length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs font-medium">No ready orders</div>
              ) : (
                restOrders.filter(o => o.status === 'Ready' || o.status === 'Out for Delivery').map((order) => (
                  <div key={order.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 opacity-90">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-orange-400">{order.id}</span>
                          <span className="text-[10px] bg-slate-900 text-slate-300 font-bold px-1.5 py-0.5 rounded border border-slate-800">
                            {order.restaurantName || restaurants.find(r => r.id === order.restaurantId)?.name || 'Kitchen'}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-white mt-0.5">{order.customerName}</h4>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                        {order.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400">
                      Rider: <span className="text-white font-bold">{order.deliveryPartnerId ? 'Assigned' : 'Waiting for Partner'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      ) : (
        /* Menu Management View */
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-extrabold text-white">Manage Kitchen Menu Stock</h3>
            <button
              onClick={() => setNewItemModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Add New Dish
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restMenuItems.map((item) => (
              <div key={item.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-white truncate">{item.name}</h4>
                  <p className="text-xs text-orange-400 font-semibold">₹{item.price}</p>
                </div>
                <button
                  onClick={() => toggleMenuItemStock(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    item.inStock
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : 'bg-red-950 text-red-400 border border-red-500/40'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  {item.inStock ? 'In Stock' : 'Sold Out'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Item Modal */}
      {newItemModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 w-full max-w-md space-y-4">
            <h3 className="font-extrabold text-base text-white">Add New Dish to Kitchen</h3>
            
            <form onSubmit={handleAddItemSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Special Mutton Dum Biryani"
                  className="w-full bg-slate-950 text-white text-xs px-3 py-2 rounded-xl border border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="280"
                    className="w-full bg-slate-950 text-white text-xs px-3 py-2 rounded-xl border border-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs px-3 py-2 rounded-xl border border-slate-800"
                  >
                    <option value="Biryani">Biryani</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Pizzas">Pizzas</option>
                    <option value="South Indian">South Indian</option>
                    <option value="Asian">Asian</option>
                    <option value="Healthy">Healthy</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Dietary Tag</label>
                <button
                  type="button"
                  onClick={() => setIsVeg(!isVeg)}
                  className={`w-full py-2 rounded-xl text-xs font-bold ${
                    isVeg ? 'bg-emerald-950 text-emerald-400 border border-emerald-500' : 'bg-red-950 text-red-400 border border-red-500'
                  }`}
                >
                  {isVeg ? '🌱 Pure Vegetarian' : '🍗 Non-Vegetarian'}
                </button>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Fragrant basmati rice cooked with spicy herbs"
                  className="w-full bg-slate-950 text-white text-xs px-3 py-2 rounded-xl border border-slate-800"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setNewItemModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2.5 rounded-xl shadow"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
