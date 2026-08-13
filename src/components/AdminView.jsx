import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Truck, 
  DollarSign, 
  ShoppingBag, 
  CheckCircle2, 
  ShieldCheck, 
  Users,
  Activity,
  Cpu
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export const AdminView = () => {
  const { orders, deliveryPartners, restaurants } = useApp();

  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const avgDeliveryTime = 22.4;
  const activePartnersCount = deliveryPartners.filter((p) => p.status !== 'Offline').length;

  // Chart 1: Order Volume Peak Hours (Custom Sunset Crimson & Violet Bars)
  const hourlyData = {
    labels: ['11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM'],
    datasets: [
      {
        label: 'Orders Delivered',
        data: [14, 32, 58, 36, 22, 28, 44, 76, 68, 42],
        backgroundColor: 'rgba(255, 46, 99, 0.85)',
        borderColor: '#ff2e63',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 11, weight: 'bold' } },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
    },
  };

  // Chart 2: Partner Performance Horizontal Bar
  const partnerPerformanceData = {
    labels: deliveryPartners.map((p) => p.name),
    datasets: [
      {
        label: 'Completed Trips',
        data: deliveryPartners.map((p) => p.deliveriesCount),
        backgroundColor: [
          'rgba(0, 245, 212, 0.85)',
          'rgba(123, 44, 191, 0.85)',
          'rgba(255, 46, 99, 0.85)',
          'rgba(245, 158, 11, 0.85)',
        ],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const horizontalOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#f8fafc', font: { size: 11, weight: 'bold' } },
      },
    },
  };

  // Chart 3: Order Status Mix (Doughnut Chart)
  const statusCounts = {
    Placed: orders.filter((o) => o.status === 'Placed').length,
    Preparing: orders.filter((o) => o.status === 'Preparing' || o.status === 'Accepted').length,
    Ready: orders.filter((o) => o.status === 'Ready').length,
    'Out for Delivery': orders.filter((o) => o.status === 'Out for Delivery').length,
    Delivered: orders.filter((o) => o.status === 'Delivered').length,
  };

  const doughnutData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ['#f59e0b', '#7b2cbf', '#00f5d4', '#ff2e63', '#10b981'],
        borderWidth: 2,
        borderColor: '#0b0f19',
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 text-slate-100 space-y-6">

      {/* Admin Dashboard Header */}
      <div className="bg-[#0b0f19] p-6 rounded-3xl border border-slate-800 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-rose-500/25">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">ZapBite.ai Neural Analytics Dashboard</h2>
            <p className="text-xs text-slate-400">Executive platform metrics, delivery fleet velocity, and real-time transaction logs</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 px-4 py-2 rounded-2xl text-xs font-black shadow-[0_0_15px_rgba(0,245,212,0.15)]">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          Neural Engine: 100% Active
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="bg-[#0b0f19] p-5 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Total Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">₹{totalRevenue.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +22.4% vs last cycle
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0b0f19] p-5 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Total Orders Volume</span>
            <ShoppingBag className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{totalOrdersCount} Orders</div>
          <p className="text-[11px] text-slate-400 mt-1 font-semibold">Active dispatch queue</p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0b0f19] p-5 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Avg Delivery Speed</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300 mt-2">{avgDeliveryTime} Mins</div>
          <p className="text-[11px] text-cyan-400 font-bold mt-1">SLA Target &lt; 25 mins (Optimized)</p>
        </div>

        {/* Card 4 */}
        <div className="bg-[#0b0f19] p-5 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Active Fleet Riders</span>
            <Truck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300 mt-2">{activePartnersCount} Active</div>
          <p className="text-[11px] text-slate-400 mt-1 font-semibold">Out of {deliveryPartners.length} registered</p>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hourly Volume */}
        <div className="lg:col-span-2 bg-[#0b0f19] p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-sm text-white">Order Dispatch Peak Hours</h3>
            <span className="text-[11px] text-slate-400 font-mono">Today's Distribution</span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Bar data={hourlyData} options={barOptions} />
          </div>
        </div>

        {/* Status Mix Doughnut */}
        <div className="bg-[#0b0f19] p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <h3 className="font-black text-sm text-white mb-2">Live Order Status Mix</h3>
          <div className="h-56 flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

      </div>

      {/* Ranking & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Partner Rankings */}
        <div className="bg-[#0b0f19] p-6 rounded-3xl border border-slate-800 shadow-xl">
          <h3 className="font-black text-sm text-white mb-4">Delivery Partner Performance Ranking</h3>
          <div className="h-56 flex items-center justify-center">
            <Bar data={partnerPerformanceData} options={horizontalOptions} />
          </div>
        </div>

        {/* Audit Event Logs */}
        <div className="bg-[#0b0f19] p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col h-[320px]">
          <h3 className="font-black text-sm text-white mb-3.5">Real-Time System Audit Logs</h3>
          
          <div className="flex-1 overflow-y-auto space-y-2.5 text-xs pr-1">
            {orders.flatMap((o) => o.history).reverse().slice(0, 8).map((hist, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(255,46,99,0.8)]" />
                  <span className="font-black text-white">{hist.status}:</span>
                  <span className="text-slate-400 truncate max-w-[200px] font-medium">{hist.note}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">{hist.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
