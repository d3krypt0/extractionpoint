import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPhp } from '../../utils/phCurrency';
import { ZReadingModal } from './ZReadingModal';
import { 
  BarChart3, 
  TrendingUp, 
  FileSpreadsheet, 
  Receipt,
  Award
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { orders, wasteLogs } = useApp();
  const [isZModalOpen, setIsZModalOpen] = useState(false);

  // Revenue & Metrics
  const grossRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.subtotal, 0);
  }, [orders]);

  const netRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const totalDiscounts = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.discountAmount, 0);
  }, [orders]);

  const avgOrderValue = useMemo(() => {
    return orders.length > 0 ? netRevenue / orders.length : 0;
  }, [netRevenue, orders.length]);

  const gcashTotal = useMemo(() => {
    return orders.filter((o) => o.paymentMethod === 'gcash').reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const cashTotal = useMemo(() => {
    return orders.filter((o) => o.paymentMethod === 'cash').reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const gcashPercent = netRevenue > 0 ? Math.round((gcashTotal / netRevenue) * 100) : 50;
  const cashPercent = 100 - gcashPercent;

  const totalWasteCost = useMemo(() => {
    return wasteLogs.reduce((sum, w) => sum + w.costPhp, 0);
  }, [wasteLogs]);

  // Top Selling Items
  const topSellingItems = useMemo(() => {
    const counts: { [name: string]: { name: string; qty: number; revenue: number; category: string } } = {};
    
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const name = item.menuItem.name;
        if (!counts[name]) {
          counts[name] = {
            name,
            qty: 0,
            revenue: 0,
            category: item.menuItem.category,
          };
        }
        counts[name].qty += item.quantity;
        counts[name].revenue += item.totalPrice;
      });
    });

    return Object.values(counts).sort((a, b) => b.qty - a.qty).slice(0, 8);
  }, [orders]);

  // Category Breakdown
  const categoryBreakdown = useMemo(() => {
    const catMap: { [group: string]: { label: string; revenue: number; color: string } } = {
      coffee: { label: 'Coffee & Espresso', revenue: 0, color: 'bg-[#c5a880]' },
      matcha: { label: 'Nami Matcha', revenue: 0, color: 'bg-emerald-600' },
      non_coffee: { label: 'Milkers & Potions', revenue: 0, color: 'bg-purple-500' },
      food: { label: 'Pastas & Sammys', revenue: 0, color: 'bg-amber-600' },
    };

    orders.forEach((o) => {
      o.items.forEach((i) => {
        const g = i.menuItem.group;
        if (catMap[g]) {
          catMap[g].revenue += i.totalPrice;
        }
      });
    });

    const totalGroupRev = Object.values(catMap).reduce((s, g) => s + g.revenue, 0) || 1;

    return Object.entries(catMap).map(([key, data]) => ({
      key,
      ...data,
      percent: Math.round((data.revenue / totalGroupRev) * 100),
    }));
  }, [orders]);

  // Hourly Peak Simulation (7 AM to 10 PM)
  const hourlyPeakData = [
    { hour: '7 AM', sales: 450, orders: 3 },
    { hour: '8 AM', sales: 1250, orders: 8 },
    { hour: '9 AM', sales: 1890, orders: 12 },
    { hour: '10 AM', sales: 1400, orders: 9 },
    { hour: '11 AM', sales: 2100, orders: 14 },
    { hour: '12 PM', sales: 3450, orders: 20 },
    { hour: '1 PM', sales: 2900, orders: 16 },
    { hour: '2 PM', sales: 1800, orders: 11 },
    { hour: '3 PM', sales: 2400, orders: 15 },
    { hour: '4 PM', sales: 3100, orders: 18 },
    { hour: '5 PM', sales: 2750, orders: 16 },
    { hour: '6 PM', sales: 2200, orders: 13 },
    { hour: '7 PM', sales: 1950, orders: 10 },
  ];

  const maxHourlySales = Math.max(...hourlyPeakData.map((d) => d.sales));

  const exportCSV = () => {
    let csv = 'Order ID,Order Number,Type,Customer,Payment,Subtotal,Discount,Total,Date\n';
    orders.forEach((o) => {
      csv += `"${o.id}","${o.orderNumber}","${o.type}","${o.customerName}","${o.paymentMethod}",${o.subtotal},${o.discountAmount},${o.total},"${new Date(o.createdAt).toISOString()}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Extraction_Point_Sales_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#f3efe8] dark:bg-[#0c0c0e] p-4 sm:p-6 space-y-6 transition-colors">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-[#111111] dark:text-[#f8f7f4]">
              Sales Performance & Cafe Analytics
            </h2>
            <p className="text-[11px] text-gray-500">
              Philippine Peso sales, product mix, hourly peak traffic & BIR reporting
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#ede7dc] dark:bg-[#202024] border border-[#ded8ce] dark:border-[#2a2a30] text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-[#c5a880] hover:text-black transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsZModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black font-bold text-xs hover:opacity-90 transition-all shadow-sm"
          >
            <Receipt className="w-4 h-4 text-[#c5a880]" />
            <span>Generate Z-Reading</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            Total Net Sales (PHP)
          </span>
          <div className="font-mono text-3xl font-black text-[#111111] dark:text-[#f8f7f4]">
            {formatPhp(netRevenue)}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Gross: {formatPhp(grossRevenue)} (Discounts: -{formatPhp(totalDiscounts)})</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            Orders Count & Basket Size
          </span>
          <div className="font-mono text-3xl font-black text-[#111111] dark:text-[#f8f7f4]">
            {orders.length} <span className="text-sm font-sans font-normal text-gray-500">tickets</span>
          </div>
          <div className="text-[11px] text-gray-500">
            Average Order: <strong>{formatPhp(avgOrderValue)}</strong>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            Payment Mix (GCash vs Cash)
          </span>
          <div className="font-mono text-2xl font-black text-[#007DFE] flex items-center space-x-2">
            <span>{gcashPercent}%</span>
            <span className="text-sm font-normal text-gray-400">GCash</span>
            <span className="text-xs text-gray-300">/</span>
            <span className="text-base text-gray-700 dark:text-gray-300">{cashPercent}% Cash</span>
          </div>
          <div className="text-[11px] text-gray-500">
            GCash: {formatPhp(gcashTotal)} • Cash: {formatPhp(cashTotal)}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            Tracked Food Waste Loss
          </span>
          <div className="font-mono text-3xl font-black text-rose-600 dark:text-rose-400">
            {formatPhp(totalWasteCost)}
          </div>
          <div className="text-[11px] text-gray-500">
            {wasteLogs.length} incidents logged today
          </div>
        </div>

      </div>

      {/* Visual Analytics Sections: Hourly Peak Heatmap & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Hourly Sales Volume Heatmap (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-[#111111] dark:text-[#f8f7f4]">
                Hourly Traffic & Peak Hours Heatmap
              </h3>
              <p className="text-xs text-gray-500">
                Identify lunch & afternoon rush periods for barista scheduling
              </p>
            </div>
            <span className="text-xs font-bold text-[#c5a880] font-mono">
              Peak: 12 PM - 1 PM
            </span>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="pt-4 flex items-end justify-between gap-1.5 h-48 border-b border-gray-100 dark:border-gray-800 pb-2">
            {hourlyPeakData.map((slot) => {
              const heightPercent = Math.max(15, (slot.sales / maxHourlySales) * 100);
              const isPeak = slot.sales >= 3000;

              return (
                <div key={slot.hour} className="flex-1 flex flex-col items-center group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] py-1 px-1.5 rounded font-mono pointer-events-none whitespace-nowrap z-20">
                    {formatPhp(slot.sales)} ({slot.orders} orders)
                  </div>

                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      isPeak
                        ? 'bg-[#c5a880] group-hover:bg-[#d8c09d]'
                        : 'bg-[#ede7dc] dark:bg-[#202026] group-hover:bg-[#c5a880]/60'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  ></div>

                  <span className="text-[9px] text-gray-500 mt-2 font-medium">
                    {slot.hour.replace(' ', '')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Category Revenue Share (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-[#111111] dark:text-[#f8f7f4]">
            Category Revenue Share
          </h3>

          <div className="space-y-3 pt-1">
            {categoryBreakdown.map((cat) => (
              <div key={cat.key} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-800 dark:text-gray-200">
                  <span>{cat.label}</span>
                  <span className="font-mono">{formatPhp(cat.revenue)} ({cat.percent}%)</span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className={`h-full ${cat.color} transition-all duration-500`}
                    style={{ width: `${cat.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
            Coffee & Signature handcrafted drinks lead total daily cafe gross receipts.
          </div>
        </div>

      </div>

      {/* Top Best Sellers Breakdown Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-[#c5a880]" />
            <h3 className="font-serif font-bold text-base text-[#111111] dark:text-[#f8f7f4]">
              Top 8 Best-Selling Items by Volume & Gross (PHP)
            </h3>
          </div>
          <span className="text-xs text-gray-500">Ranked by tickets placed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Menu Item</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-center">Units Sold</th>
                <th className="py-2.5 px-3 text-right">Total Revenue (PHP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {topSellingItems.map((item, idx) => (
                <tr key={item.name} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1f] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-gray-400">
                    #{idx + 1}
                  </td>
                  <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="py-3 px-3 text-gray-500 uppercase text-[10px]">
                    {item.category.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-center">
                    {item.qty} cups/plates
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-gray-900 dark:text-white">
                    {formatPhp(item.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Z-Reading Modal */}
      <ZReadingModal
        isOpen={isZModalOpen}
        onClose={() => setIsZModalOpen(false)}
      />
    </div>
  );
};
