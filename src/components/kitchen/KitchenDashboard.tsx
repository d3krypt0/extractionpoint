import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { KitchenStation } from '../../types';
import { OrderTicketCard } from './OrderTicketCard';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ChefHat
} from 'lucide-react';

export const KitchenDashboard: React.FC = () => {
  const { 
    activeOrders, 
    completedOrders, 
    updateOrderStatus, 
    toggleOrderItemCheck,
    kdsStationFilter,
    setKdsStationFilter,
    soundEnabled,
    toggleSound,
  } = useApp();

  const [showHistory, setShowHistory] = useState(false);

  // Filter orders by station
  const stationFilteredOrders = useMemo(() => {
    const list = showHistory ? completedOrders.slice(0, 10) : activeOrders;

    if (kdsStationFilter === 'all') return list;

    return list.filter((order) => {
      return order.items.some((item) => {
        const group = item.menuItem.group;

        if (kdsStationFilter === 'barista') {
          return group === 'coffee';
        }
        if (kdsStationFilter === 'cold_bar') {
          return group === 'matcha' || group === 'non_coffee';
        }
        if (kdsStationFilter === 'kitchen') {
          return group === 'food';
        }
        return true;
      });
    });
  }, [showHistory, completedOrders, activeOrders, kdsStationFilter]);

  // Metrics
  const placedCount = activeOrders.filter((o) => o.status === 'placed').length;
  const inPrepCount = activeOrders.filter((o) => o.status === 'in_prep').length;
  const readyCount = activeOrders.filter((o) => o.status === 'ready').length;
  const overdueCount = activeOrders.filter((o) => {
    const start = o.prepStartedAt || o.createdAt;
    return (Date.now() - start) > 1000 * 60 * 10;
  }).length;

  return (
    <div className="min-h-screen bg-[#f3efe8] dark:bg-[#0c0c0e] p-4 sm:p-6 space-y-6 transition-colors">
      
      {/* Top Bar: Station Selector & KDS Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] shadow-sm">
        
        {/* Title & Station Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#111111] dark:text-[#f8f7f4]">
                Kitchen & Barista Display (KDS)
              </h2>
              <p className="text-[11px] text-gray-500">Live Ticket Order Routing</p>
            </div>
          </div>

          {/* Station Filters */}
          <div className="flex items-center space-x-1 bg-[#ede7dc] dark:bg-[#1f1f24] p-1 rounded-xl">
            {[
              { id: 'all', label: 'All Stations' },
              { id: 'barista', label: '☕ Barista Bar' },
              { id: 'cold_bar', label: '🍵 Matcha / Cold' },
              { id: 'kitchen', label: '🍳 Hot Kitchen' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setKdsStationFilter(st.id as KitchenStation);
                  setShowHistory(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  kdsStationFilter === st.id && !showHistory
                    ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Counters & Audio Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto no-scrollbar">
          
          <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-medium flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            <span>Placed: <strong>{placedCount}</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-medium flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>In Prep: <strong>{inPrepCount}</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready: <strong>{readyCount}</strong></span>
          </div>

          {overdueCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold flex items-center space-x-1.5 animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              <span>Overdue (&gt;10m): <strong>{overdueCount}</strong></span>
            </div>
          )}

          {/* Toggle History / Recalls */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
              showHistory
                ? 'bg-[#c5a880] text-black border-[#c5a880]'
                : 'bg-white dark:bg-[#1a1a1e] border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recent Recalls</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-[#ede7dc] dark:bg-[#1f1f24] text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
            title="Toggle Kitchen Sound Alerts"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-red-500" />}
          </button>
        </div>
      </div>

      {/* Tickets Stream Grid */}
      {stationFilteredOrders.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-gray-800 dark:text-gray-200">
            Kitchen All Clear!
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {showHistory
              ? 'No completed orders in history yet.'
              : 'All pending orders have been cooked, brewed, and served. New customer tickets will appear here with live audio chimes.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {stationFilteredOrders.map((order) => (
            <OrderTicketCard
              key={order.id}
              order={order}
              onUpdateStatus={updateOrderStatus}
              onToggleItemCheck={toggleOrderItemCheck}
            />
          ))}
        </div>
      )}
    </div>
  );
};
