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
  TrendingUp, 
  Clock, 
  Truck, 
  DollarSign, 
  ShoppingBag, 
  Activity,
  Cpu,
  Radio
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
  const { orders, deliveryPartners } = useApp();

  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const avgDeliveryTime = 22.4;
  const activePartnersCount = deliveryPartners.filter((p) => p.status !== 'Offline').length;

  // Chart 1: Order Volume Peak Hours
  const barChartData = {
    labels: ['12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'],
    datasets: [
      {
        label: 'Orders Processed',
        data: [28, 45, 18, 62, 89, 42],
        backgroundColor: 'rgba(0, 245, 155, 0.85)',
        borderColor: '#00f59b',
        borderWidth: 1.5,
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#070b14',
        titleColor: '#00f59b',
        bodyColor: '#f1f5f9',
        borderColor: 'rgba(0, 245, 155, 0.3)',
        borderWidth: 1,
        titleFont: { family: 'Space Grotesk', size: 12, weight: 'bold' },
        bodyFont: { family: 'Space Grotesk', size: 12 },
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: { 
        grid: { display: false }, 
        ticks: { color: '#64748b', font: { family: 'monospace', size: 10, weight: 'bold' } } 
      },
      y: { 
        grid: { color: 'rgba(30, 41, 59, 0.5)' }, 
        ticks: { color: '#64748b', font: { family: 'monospace', size: 10 } } 
      }
    }
  };

  // Chart 2: Order Status Breakdown
  const orderStatusCounts = {
    Placed: orders.filter(o => o.status === 'Placed').length,
    Preparing: orders.filter(o => o.status === 'Preparing' || o.status === 'Accepted').length,
    Dispatched: orders.filter(o => o.status === 'Out for Delivery' || o.status === 'Ready').length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
  };

  const doughnutData = {
    labels: ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'],
    datasets: [
      {
        data: [
          orderStatusCounts.Placed || 1,
          orderStatusCounts.Preparing || 2,
          orderStatusCounts.Dispatched || 1,
          orderStatusCounts.Delivered || 4,
        ],
        backgroundColor: [
          '#f59e0b',
          '#ff3366',
          '#00d2ff',
          '#00f59b',
        ],
        borderColor: '#070b14',
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          font: { family: 'monospace', size: 11, weight: 'bold' },
          padding: 14,
          usePointStyle: true,
        }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 text-slate-100 font-sans space-y-6">
      
      {/* Top Banner & Control Strip */}
      <div className="bg-[#0d1527]/90 rounded-3xl p-6 border border-violet-500/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#111c33] text-violet-300 border border-violet-500/40 text-xs font-mono font-black px-3 py-1 rounded-xl">
              SYSTEM COMMAND MATRIX
            </span>
            <h2 className="text-xl font-black text-white">Quantum Analytics HUD</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">Real-time revenue telemetry & autonomous drone logistics matrix</p>
        </div>

        <div className="flex items-center gap-2 bg-[#070b14] px-3.5 py-2 rounded-xl border border-emerald-500/30 text-xs font-mono font-bold text-emerald-400">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>SYSTEM STATUS: 100% OPERATIONAL</span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-[#0d1527]/80 p-5 rounded-3xl border border-emerald-500/20 shadow-xl flex items-center justify-between backdrop-blur-md hover:border-emerald-500/40 transition-colors">
          <div>
            <div className="text-xs text-slate-400 font-mono font-bold">TOTAL PLATFORM REVENUE</div>
            <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">₹{totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% this cycle
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,245,155,0.2)]">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0d1527]/80 p-5 rounded-3xl border border-cyan-500/20 shadow-xl flex items-center justify-between backdrop-blur-md hover:border-cyan-500/40 transition-colors">
          <div>
            <div className="text-xs text-slate-400 font-mono font-bold">ORDERS DISPATCHED</div>
            <div className="text-2xl font-black text-cyan-300 mt-1 font-mono">{totalOrdersCount} Orders</div>
            <div className="text-[11px] text-cyan-400 font-mono mt-1">Live DB Persistent</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0d1527]/80 p-5 rounded-3xl border border-amber-500/20 shadow-xl flex items-center justify-between backdrop-blur-md hover:border-amber-500/40 transition-colors">
          <div>
            <div className="text-xs text-slate-400 font-mono font-bold">AVG DELIVERY SLA</div>
            <div className="text-2xl font-black text-amber-300 mt-1 font-mono">{avgDeliveryTime} Mins</div>
            <div className="text-[11px] text-amber-400 font-mono mt-1">Target: Under 25 Mins</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-950 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#0d1527]/80 p-5 rounded-3xl border border-violet-500/20 shadow-xl flex items-center justify-between backdrop-blur-md hover:border-violet-500/40 transition-colors">
          <div>
            <div className="text-xs text-slate-400 font-mono font-bold">ACTIVE DRONE PILOTS</div>
            <div className="text-2xl font-black text-violet-300 mt-1 font-mono">{activePartnersCount} / {deliveryPartners.length}</div>
            <div className="text-[11px] text-violet-400 font-mono mt-1">Available on channel</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-violet-950 text-violet-400 border border-violet-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.2)]">
            <Truck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Bar Chart */}
        <div className="lg:col-span-2 bg-[#0d1527]/90 rounded-3xl p-6 border border-emerald-500/30 shadow-xl space-y-4 backdrop-blur-xl">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <div>
              <h3 className="font-black text-base text-white">Peak Hour Culinary Load</h3>
              <p className="text-xs text-slate-400 font-mono">Hourly processing throughput across sector hubs</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-500/40">
              Peak: 8 PM (89 Orders)
            </span>
          </div>

          <div className="h-64">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Chart 2: Doughnut */}
        <div className="bg-[#0d1527]/90 rounded-3xl p-6 border border-cyan-500/30 shadow-xl space-y-4 backdrop-blur-xl">
          <div className="pb-2 border-b border-slate-800">
            <h3 className="font-black text-base text-white">Order Pipeline Lifecycle</h3>
            <p className="text-xs text-slate-400 font-mono">Real-time status breakdown</p>
          </div>

          <div className="h-64 flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

      </div>

      {/* Delivery Fleet Status Table */}
      <div className="bg-[#0d1527]/90 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-black text-base text-white">Delivery Fleet Telemetry Overview</h3>
          <span className="text-xs font-mono font-bold text-emerald-400">{deliveryPartners.length} Active Drivers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-black uppercase text-[10px]">
                <th className="py-2.5 px-3">Pilot Name</th>
                <th className="py-2.5 px-3">Vehicle Details</th>
                <th className="py-2.5 px-3">Current Status</th>
                <th className="py-2.5 px-3">Completed Trips</th>
                <th className="py-2.5 px-3">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {deliveryPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-[#111c33]/60 transition-colors">
                  <td className="py-3 px-3 flex items-center gap-2 font-bold text-white">
                    <img src={partner.avatar} alt={partner.name} className="w-7 h-7 rounded-full object-cover border border-emerald-400" />
                    {partner.name}
                  </td>
                  <td className="py-3 px-3 text-slate-400">{partner.vehicle}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      partner.status === 'Offline'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                        : partner.status === 'On Delivery'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {partner.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-white">{partner.deliveriesCount} trips</td>
                  <td className="py-3 px-3 font-bold text-amber-400">★ {partner.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
