import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PackageCheck, 
  ChefHat, 
  Plus, 
  Power
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 text-slate-900 font-sans">
      
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-rose-500" />
            <h2 className="text-xl font-extrabold text-slate-900">Kitchen OS Dashboard</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Real-time kitchen order queue & stock availability toggle</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Restaurant Filter Dropdown */}
          <select
            value={selectedRestId}
            onChange={(e) => setSelectedRestId(e.target.value)}
            className="bg-slate-50 text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none"
          >
            <option value="all">🏬 All Kitchen Partners ({restaurants.length})</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          {/* Tab Controls */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex gap-1 text-xs">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'orders' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Orders ({restOrders.filter(o => o.status !== 'Delivered').length})
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'menu' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col h-[650px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                <h3 className="font-extrabold text-sm text-slate-900">New Incoming</h3>
              </div>
              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-2 py-0.5 rounded-full">
                {restOrders.filter(o => o.status === 'Placed').length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {restOrders.filter(o => o.status === 'Placed').length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs font-medium">No new orders</div>
              ) : (
                restOrders.filter(o => o.status === 'Placed').map((order) => (
                  <div key={order.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-rose-600">{order.id}</span>
                          <span className="text-[10px] bg-white text-slate-700 font-bold px-1.5 py-0.5 rounded border border-slate-200">
                            {order.restaurantName || 'Kitchen'}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">{order.customerName}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-700 font-medium">
                          <span>{it.name} x {it.quantity}</span>
                          <span className="font-extrabold text-slate-900">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="font-extrabold text-sm text-slate-900">₹{order.totalAmount}</span>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Preparing', 'Kitchen accepted order')}
                        className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs active:scale-95 transition-all"
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
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col h-[650px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500 animate-bounce" />
                <h3 className="font-extrabold text-sm text-slate-900">Kitchen Cooking</h3>
              </div>
              <span className="bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold px-2 py-0.5 rounded-full">
                {restOrders.filter(o => o.status === 'Preparing' || o.status === 'Accepted').length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {restOrders.filter(o => o.status === 'Preparing' || o.status === 'Accepted').length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs font-medium">Kitchen clear</div>
              ) : (
                restOrders.filter(o => o.status === 'Preparing' || o.status === 'Accepted').map((order) => (
                  <div key={order.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-bold text-xs text-orange-600">{order.id}</span>
                        <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">{order.customerName}</h4>
                      </div>
                      <span className="text-[10px] text-orange-600 font-extrabold bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                        Cooking
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-700 font-medium">
                          <span>{it.name} x {it.quantity}</span>
                          <span className="font-extrabold text-slate-900">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="font-extrabold text-sm text-slate-900">₹{order.totalAmount}</span>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Ready', 'Packed & ready for pickup')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs active:scale-95 transition-all"
                      >
                        Mark Packed & Ready
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 3: Dispatch Ready & Out */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col h-[650px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-slate-900">Ready & Dispatched</h3>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2 py-0.5 rounded-full">
                {restOrders.filter(o => o.status === 'Ready' || o.status === 'Out for Delivery').length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {restOrders.filter(o => o.status === 'Ready' || o.status === 'Out for Delivery').length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs font-medium">No ready items</div>
              ) : (
                restOrders.filter(o => o.status === 'Ready' || o.status === 'Out for Delivery').map((order) => (
                  <div key={order.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-xs text-emerald-600">{order.id}</span>
                      <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {order.status}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900">{order.customerName}</h4>
                    <p className="text-[11px] text-slate-500">{order.items.length} Items • Total ₹{order.totalAmount}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      ) : (
        /* Menu Items Stock Toggle List */
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">Kitchen Dish Inventory</h3>
            <button
              onClick={() => setNewItemModal(true)}
              className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add Custom Dish
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restMenuItems.map((item) => (
              <div key={item.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-xs text-slate-900 truncate">{item.name}</h4>
                  <div className="text-xs font-bold text-rose-600">₹{item.price} • {item.category}</div>
                </div>

                <button
                  onClick={() => toggleMenuItemStock(item.id)}
                  className={`p-2 rounded-xl border transition-all ${
                    item.inStock
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-rose-50 text-rose-700 border-rose-300'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl max-w-md w-full text-slate-900 space-y-4">
            <h3 className="font-extrabold text-lg">Add New Dish to Kitchen</h3>
            
            <form onSubmit={handleAddItemSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Dish Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Special Mutton Dum Biryani"
                  className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 font-bold"
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
                  <label className="font-bold text-slate-700 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="290"
                    className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="veg"
                  checked={isVeg}
                  onChange={(e) => setIsVeg(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="veg" className="font-bold text-slate-700">100% Pure Veg Dish</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewItemModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-extrabold py-2.5 rounded-xl"
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
