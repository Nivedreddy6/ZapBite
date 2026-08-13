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
        backgroundColor: 'rgba(249, 115, 22, 0.85)',
        borderColor: '#f97316',
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
        backgroundColor: '#0f172a',
        titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' },
        bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Plus Jakarta Sans', size: 10, weight: 'bold' } } },
      y: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b', font: { family: 'Plus Jakarta Sans', size: 10 } } }
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
          '#f97316',
          '#06b6d4',
          '#10b981',
        ],
        borderColor: '#ffffff',
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
          color: '#334155',
          font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' },
          padding: 14,
          usePointStyle: true,
        }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 text-slate-900 font-sans space-y-6">
      
      {/* Top Banner & Control Strip */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-50 text-orange-600 border border-orange-200 text-xs font-extrabold px-3 py-1 rounded-xl">
              System Admin HUD
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">Platform Analytics Command Center</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Real-time revenue monitoring & delivery fleet logistics matrix</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
          <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>System Status: 100% Operational</span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-bold">Total Platform Revenue</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">₹{totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last week
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-bold">Total Orders Placed</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalOrdersCount} Orders</div>
            <div className="text-[11px] text-slate-500 font-bold mt-1">Live DB Persistent</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-bold">Avg Delivery SLA</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{avgDeliveryTime} Mins</div>
            <div className="text-[11px] text-emerald-600 font-bold mt-1">Under 25m target</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-bold">Active Fleet Riders</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{activePartnersCount} / {deliveryPartners.length}</div>
            <div className="text-[11px] text-slate-500 font-bold mt-1">Available for dispatch</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Peak Hour Order Volume</h3>
              <p className="text-xs text-slate-500">Hourly order processing load across Vizag hubs</p>
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
              Peak: 8 PM (89 Orders)
            </span>
          </div>

          <div className="h-64">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Chart 2: Doughnut */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">Live Order Lifecycle</h3>
            <p className="text-xs text-slate-500">Real-time status breakdown</p>
          </div>

          <div className="h-64 flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

      </div>

      {/* Delivery Fleet Status Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-extrabold text-base text-slate-900">Delivery Fleet Telemetry Overview</h3>
          <span className="text-xs text-slate-500 font-bold">{deliveryPartners.length} Active Drivers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px]">
                <th className="py-2.5 px-3">Rider Name</th>
                <th className="py-2.5 px-3">Vehicle Details</th>
                <th className="py-2.5 px-3">Current Status</th>
                <th className="py-2.5 px-3">Completed Trips</th>
                <th className="py-2.5 px-3">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deliveryPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-3 flex items-center gap-2 font-extrabold text-slate-900">
                    <img src={partner.avatar} alt={partner.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                    {partner.name}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">{partner.vehicle}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                      partner.status === 'Offline'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : partner.status === 'On Delivery'
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {partner.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-extrabold text-slate-900">{partner.deliveriesCount} trips</td>
                  <td className="py-3 px-3 font-extrabold text-amber-600">★ {partner.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
