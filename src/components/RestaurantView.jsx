import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PackageCheck, 
  ChefHat, 
  Plus, 
  Power,
  Flame,
  Clock,
  Radio,
  Sparkles,
  Zap,
  CheckCircle2,
  X,
  Layers
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

  const [selectedRestId, setSelectedRestId] = useState('all');
  const [activeTab, setActiveTab] = useState('orders');
  const [newItemModal, setNewItemModal] = useState(false);

  // New Item Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Biryani');
  const [price, setPrice] = useState('');
  const [isVeg, setIsVeg] = useState(false);
  const [description, setDescription] = useState('');
  const [image] = useState('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80');

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
      description: description || 'Fresh kitchen special',
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      tag: 'Chef Choice',
      calories: '450 kcal'
    });

    setName('');
    setPrice('');
    setDescription('');
    setNewItemModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 text-slate-100 font-sans">
      
      {/* Header & Controls */}
      <div className="bg-[#0d1527]/90 rounded-3xl p-6 border border-amber-500/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Kitchen Reactor OS Terminal</h2>
              <p className="text-xs text-amber-300/80 font-mono">Real-time culinary queue & induction stock telemetry</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Restaurant Filter Dropdown */}
          <select
            value={selectedRestId}
            onChange={(e) => setSelectedRestId(e.target.value)}
            className="bg-[#070b14] text-emerald-300 text-xs font-mono font-black px-3.5 py-2.5 rounded-xl border border-emerald-500/30 focus:outline-none cursor-pointer"
          >
            <option value="all">🏬 ALL KITCHEN REACTORS ({restaurants.length})</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          {/* Tab Controls */}
          <div className="bg-[#070b14] p-1 rounded-xl border border-slate-800 flex gap-1 text-xs font-mono">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                activeTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              ACTIVE QUEUE ({restOrders.filter(o => o.status !== 'Delivered').length})
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                activeTab === 'menu' ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              DISH INVENTORY ({restMenuItems.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'orders' ? (
        /* Orders Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Placed / Incoming */}
          <div className="bg-[#0d1527]/80 p-4 rounded-3xl border border-amber-500/20 shadow-xl flex flex-col h-[650px] backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="font-mono font-black text-sm text-white">NEW INCOMING</h3>
              </div>
              <span className="bg-[#111c33] text-amber-300 border border-amber-500/40 text-xs font-mono font-black px-2.5 py-0.5 rounded-full">
                {restOrders.filter(o => o.status === 'Placed').length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {restOrders.filter(o => o.status === 'Placed').length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs font-mono">No incoming orders queued</div>
              ) : (
                restOrders.filter(o => o.status === 'Placed').map((order) => (
                  <div key={order.id} className="bg-[#070b14] p-4 rounded-2xl border border-slate-800 space-y-3 shadow-md hover:border-amber-500/40 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono font-black text-xs text-amber-400">{order.id}</span>
                          <span className="text-[10px] bg-[#111c33] text-slate-300 font-mono px-1.5 py-0.5 rounded border border-slate-700">
                            {order.restaurantName || 'Kitchen'}
                          </span>
                        </div>
                        <h4 className="font-black text-sm text-white mt-0.5">{order.customerName}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="bg-[#111c33]/70 p-2.5 rounded-xl border border-slate-800 space-y-1 font-mono text-xs">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-slate-300">
                          <span>{it.name} x {it.quantity}</span>
                          <span className="font-black text-white">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="font-mono font-black text-sm text-emerald-400">₹{order.totalAmount}</span>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Preparing', 'Kitchen accepted order')}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        Accept & Cook
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: In Kitchen Preparing */}
          <div className="bg-[#0d1527]/80 p-4 rounded-3xl border border-orange-500/20 shadow-xl flex flex-col h-[650px] backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
                <h3 className="font-mono font-black text-sm text-white">INDUCTION PREP</h3>
              </div>
              <span className="bg-[#111c33] text-orange-300 border border-orange-500/40 text-xs font-mono font-black px-2.5 py-0.5 rounded-full">
                {restOrders.filter(o => o.status === 'Preparing' || o.status === 'Accepted').length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {restOrders.filter(o => o.status === 'Preparing' || o.status === 'Accepted').length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs font-mono">Induction clear</div>
              ) : (
                restOrders.filter(o => o.status === 'Preparing' || o.status === 'Accepted').map((order) => (
                  <div key={order.id} className="bg-[#070b14] p-4 rounded-2xl border border-slate-800 space-y-3 shadow-md hover:border-orange-500/40 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-black text-xs text-orange-400">{order.id}</span>
                        <h4 className="font-black text-sm text-white mt-0.5">{order.customerName}</h4>
                      </div>
                      <span className="text-[10px] text-orange-300 font-mono font-black bg-orange-950 px-2 py-0.5 rounded-full border border-orange-500/40">
                        COOKING
                      </span>
                    </div>

                    <div className="bg-[#111c33]/70 p-2.5 rounded-xl border border-slate-800 space-y-1 font-mono text-xs">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-slate-300">
                          <span>{it.name} x {it.quantity}</span>
                          <span className="font-black text-white">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="font-mono font-black text-sm text-emerald-400">₹{order.totalAmount}</span>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Ready', 'Packed & ready for pickup')}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        Mark Sealed & Ready
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 3: Dispatch Ready & Out */}
          <div className="bg-[#0d1527]/80 p-4 rounded-3xl border border-emerald-500/20 shadow-xl flex flex-col h-[650px] backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-mono font-black text-sm text-white">READY & DISPATCHED</h3>
              </div>
              <span className="bg-[#111c33] text-emerald-300 border border-emerald-500/40 text-xs font-mono font-black px-2.5 py-0.5 rounded-full">
                {restOrders.filter(o => o.status === 'Ready' || o.status === 'Out for Delivery').length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {restOrders.filter(o => o.status === 'Ready' || o.status === 'Out for Delivery').length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs font-mono">No staged dispatches</div>
              ) : (
                restOrders.filter(o => o.status === 'Ready' || o.status === 'Out for Delivery').map((order) => (
                  <div key={order.id} className="bg-[#070b14] p-4 rounded-2xl border border-slate-800 space-y-2 shadow-md hover:border-emerald-500/40 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-black text-xs text-emerald-400">{order.id}</span>
                      <span className="text-[10px] text-emerald-300 font-mono font-black bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/40">
                        {order.status}
                      </span>
                    </div>
                    <h4 className="font-black text-xs text-white">{order.customerName}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">{order.items.length} Items • Total ₹{order.totalAmount}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      ) : (
        /* Menu Items Stock Toggle List */
        <div className="bg-[#0d1527]/90 rounded-3xl p-6 border border-emerald-500/30 shadow-xl space-y-4 backdrop-blur-xl">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-black text-base text-white">Kitchen Dish Matrix & Stock Status</h3>
              <p className="text-xs text-slate-400 font-mono">Instant toggle for ingredients & live availability</p>
            </div>
            <button
              onClick={() => setNewItemModal(true)}
              className="bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 hover:from-emerald-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,245,155,0.3)] active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Custom Dish Node
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restMenuItems.map((item) => (
              <div key={item.id} className="bg-[#070b14] p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 shadow-md hover:border-emerald-500/30 transition-colors">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-xs text-white truncate">{item.name}</h4>
                  <div className="text-xs font-mono font-bold text-emerald-400">₹{item.price} • {item.category}</div>
                </div>

                <button
                  onClick={() => toggleMenuItemStock(item.id)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    item.inStock
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(0,245,155,0.3)]'
                      : 'bg-rose-950 text-rose-300 border-rose-500/40'
                  }`}
                  title="Toggle In Stock"
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Dish Modal */}
      {newItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040711]/85 backdrop-blur-md">
          <div className="bg-[#0d1527] rounded-3xl p-6 border border-emerald-500/40 shadow-2xl max-w-md w-full text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-black text-lg text-white">Add New Dish Node</h3>
              <button
                onClick={() => setNewItemModal(false)}
                className="p-1.5 rounded-xl bg-[#111c33] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddItemSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-mono font-bold text-slate-300 block mb-1">DISH NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Special Quantum Dum Biryani"
                  className="w-full bg-[#070b14] text-white p-3 rounded-xl border border-slate-700 font-bold focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono font-bold text-slate-300 block mb-1">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#070b14] text-white p-3 rounded-xl border border-slate-700 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="Biryani">Biryani</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Pizzas">Pizzas</option>
                    <option value="Starters">Starters</option>
                    <option value="Healthy">Healthy</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono font-bold text-slate-300 block mb-1">PRICE (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="290"
                    className="w-full bg-[#070b14] text-white p-3 rounded-xl border border-slate-700 font-mono font-bold focus:border-emerald-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="veg"
                  checked={isVeg}
                  onChange={(e) => setIsVeg(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded border-slate-700"
                />
                <label htmlFor="veg" className="font-mono font-bold text-emerald-300">100% Pure Veg Laser Dish</label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setNewItemModal(false)}
                  className="flex-1 bg-[#111c33] hover:bg-[#192b4f] text-slate-300 font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
                >
                  Save Dish Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
