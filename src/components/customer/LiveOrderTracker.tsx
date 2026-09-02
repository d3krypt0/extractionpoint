import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPhp } from '../../utils/phCurrency';
import { sounds } from '../../utils/audio';
import { Order, OrderStatus } from '../../types';
import { 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Coffee, 
  Receipt, 
  ShoppingBag, 
  Utensils, 
  ArrowLeft, 
  Share2, 
  Check, 
  Trash2, 
  Home,
  Flame,
  Search,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  RotateCcw,
  CheckSquare,
  Square,
  ChevronRight,
  Pin
} from 'lucide-react';

// Sticky Note Color Schemes based on order status & state
interface NoteTheme {
  bg: string;
  darkBg: string;
  border: string;
  darkBorder: string;
  tape: string;
  darkTape: string;
  text: string;
  darkText: string;
  accent: string;
  pillBg: string;
  darkPillBg: string;
  pillText: string;
  tagLabel: string;
}

const getNoteTheme = (status: OrderStatus, isRush?: boolean): NoteTheme => {
  if (isRush && status !== 'completed' && status !== 'served') {
    return {
      bg: 'bg-[#fff1f2]',
      darkBg: 'dark:bg-[#2e141a]',
      border: 'border-rose-400/80',
      darkBorder: 'dark:border-rose-600/70',
      tape: 'bg-rose-500/80 text-white',
      darkTape: 'dark:bg-rose-600/80 dark:text-white',
      text: 'text-rose-950',
      darkText: 'dark:text-rose-100',
      accent: 'text-rose-600 dark:text-rose-400',
      pillBg: 'bg-rose-500',
      darkPillBg: 'dark:bg-rose-500',
      pillText: 'text-white',
      tagLabel: 'RUSH PRIORITY',
    };
  }

  switch (status) {
    case 'placed':
      return {
        bg: 'bg-[#fefce8]',
        darkBg: 'dark:bg-[#262312]',
        border: 'border-amber-300/80',
        darkBorder: 'dark:border-amber-600/50',
        tape: 'bg-amber-300/70 text-amber-900',
        darkTape: 'dark:bg-amber-500/40 dark:text-amber-200',
        text: 'text-amber-950',
        darkText: 'dark:text-amber-100',
        accent: 'text-amber-600 dark:text-amber-400',
        pillBg: 'bg-amber-400/30',
        darkPillBg: 'dark:bg-amber-500/20',
        pillText: 'text-amber-900 dark:text-amber-300',
        tagLabel: 'QUEUED',
      };
    case 'in_prep':
      return {
        bg: 'bg-[#fff7ed]',
        darkBg: 'dark:bg-[#2b1c12]',
        border: 'border-orange-300/80',
        darkBorder: 'dark:border-orange-600/50',
        tape: 'bg-orange-300/70 text-orange-950',
        darkTape: 'dark:bg-orange-500/40 dark:text-orange-200',
        text: 'text-orange-950',
        darkText: 'dark:text-orange-100',
        accent: 'text-orange-600 dark:text-orange-400',
        pillBg: 'bg-orange-500/25',
        darkPillBg: 'dark:bg-orange-500/20',
        pillText: 'text-orange-950 dark:text-orange-300',
        tagLabel: 'BREWING / PREPPING',
      };
    case 'ready':
      return {
        bg: 'bg-[#f0fdf4]',
        darkBg: 'dark:bg-[#122416]',
        border: 'border-emerald-300/80',
        darkBorder: 'dark:border-emerald-600/50',
        tape: 'bg-emerald-300/70 text-emerald-950',
        darkTape: 'dark:bg-emerald-500/40 dark:text-emerald-200',
        text: 'text-emerald-950',
        darkText: 'dark:text-emerald-100',
        accent: 'text-emerald-600 dark:text-emerald-400',
        pillBg: 'bg-emerald-500/25',
        darkPillBg: 'dark:bg-emerald-500/20',
        pillText: 'text-emerald-950 dark:text-emerald-300',
        tagLabel: 'READY FOR PICKUP',
      };
    case 'served':
    case 'completed':
    default:
      return {
        bg: 'bg-[#f8f6f0]',
        darkBg: 'dark:bg-[#1a1917]',
        border: 'border-[#ded7cb]',
        darkBorder: 'dark:border-[#2d2a27]',
        tape: 'bg-[#e5ded2]/80 text-[#554e44]',
        darkTape: 'dark:bg-[#2d2a27] dark:text-[#a8a196]',
        text: 'text-[#332f29]',
        darkText: 'dark:text-[#d6d0c4]',
        accent: 'text-[#8c7b66] dark:text-[#a89982]',
        pillBg: 'bg-gray-200/60',
        darkPillBg: 'dark:bg-zinc-800',
        pillText: 'text-gray-700 dark:text-gray-300',
        tagLabel: 'SERVED & COMPLETED',
      };
  }
};

export const LiveOrderTracker: React.FC = () => {
  const { 
    orders, 
    trackedOrderId, 
    setTrackedOrderId, 
    clearTrackedOrder, 
    updateOrderStatus,
    toggleOrderItemCheck,
    deleteOrder, 
    setActiveView,
    isQrCustomerMode,
    qrTableNumber,
    activeView,
    soundEnabled,
    toggleSound,
    isAdminRoute,
  } = useApp();

  // State
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'placed' | 'in_prep' | 'ready' | 'completed'>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | 'dine_in' | 'takeaway'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Clock ticker for real-time prep calculation
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine viewing mode: If on Storefront (!isAdminRoute), ALWAYS customer mode!
  const isCustomer = !isAdminRoute || isQrCustomerMode || Boolean(qrTableNumber) || activeView === 'customer';

  // Visible orders for current session
  const visibleOrders = useMemo(() => {
    // 1. If at a specific QR table (e.g. ?table=4)
    if (qrTableNumber) {
      // STRICT ISOLATION: Only return orders placed for THIS table
      return orders.filter((o) => o.tableNumber === qrTableNumber);
    }
    // 2. Customer tracking on Storefront without table QR
    if (isCustomer) {
      if (trackedOrderId) {
        // Only return customer's own tracked order if it is takeaway or unassigned
        return orders.filter((o) => o.id === trackedOrderId && (!o.tableNumber || !qrTableNumber));
      }
      return [];
    }
    // 3. Barista/Staff view: all cafe orders
    return orders;
  }, [orders, qrTableNumber, isCustomer, trackedOrderId]);

  // Filtered orders for Centralized Barista Pinboard
  const filteredBaristaOrders = useMemo(() => {
    return visibleOrders.filter((order) => {
      // Status Filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'completed') {
          if (order.status !== 'completed' && order.status !== 'served') return false;
        } else if (order.status !== statusFilter) {
          return false;
        }
      }

      // Order Type Filter
      if (orderTypeFilter === 'dine_in' && order.type !== 'dine_in') {
        return false;
      }
      if (orderTypeFilter === 'takeaway' && order.type !== 'takeaway') {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNumber = order.orderNumber.toLowerCase().includes(q);
        const matchesCustomer = order.customerName.toLowerCase().includes(q);
        const matchesTable = order.tableNumber ? `table ${order.tableNumber}`.includes(q) || String(order.tableNumber) === q : false;
        const matchesItems = order.items.some((i) => i.menuItem.name.toLowerCase().includes(q));
        if (!matchesNumber && !matchesCustomer && !matchesTable && !matchesItems) return false;
      }

      return true;
    });
  }, [visibleOrders, statusFilter, orderTypeFilter, searchQuery]);

  // Active customer order
  const activeCustomerOrder = useMemo(() => {
    // 1. If at a specific table QR (e.g. ?table=4)
    if (qrTableNumber) {
      const tableOrders = visibleOrders.filter((o) => o.tableNumber === qrTableNumber);
      if (tableOrders.length === 0) return null;

      // If trackedOrderId belongs to this table, use it
      if (trackedOrderId) {
        const match = tableOrders.find((o) => o.id === trackedOrderId);
        if (match) return match;
      }

      // Otherwise show an active in-progress order for this table
      const inProg = tableOrders.find(
        (o) => o.status !== 'completed' && o.status !== 'served'
      );
      return inProg || null;
    }

    // 2. Customer without table QR
    if (isCustomer) {
      if (trackedOrderId) {
        const found = visibleOrders.find((o) => o.id === trackedOrderId);
        if (found) return found;
      }
      return null;
    }

    return visibleOrders[0] || null;
  }, [visibleOrders, trackedOrderId, qrTableNumber, isCustomer]);

  // Counts for Top Barista Toolbar
  const placedCount = useMemo(() => orders.filter((o) => o.status === 'placed').length, [orders]);
  const inPrepCount = useMemo(() => orders.filter((o) => o.status === 'in_prep').length, [orders]);
  const readyCount = useMemo(() => orders.filter((o) => o.status === 'ready').length, [orders]);
  const completedCount = useMemo(() => orders.filter((o) => o.status === 'completed' || o.status === 'served').length, [orders]);
  const overdueCount = useMemo(() => {
    return orders.filter((o) => {
      if (o.status === 'completed' || o.status === 'served') return false;
      const start = o.prepStartedAt || o.createdAt;
      return (currentTime - start) > 1000 * 60 * 10;
    }).length;
  }, [orders, currentTime]);

  // Format Elapsed Time (Mins:Secs)
  const formatTimer = (order: Order) => {
    const start = order.prepStartedAt || order.createdAt;
    let totalSecs = 0;
    if (order.status === 'served' || order.status === 'completed') {
      const finish = order.completedAt || order.readyAt || currentTime;
      totalSecs = Math.max(0, Math.floor((finish - start) / 1000));
    } else {
      totalSecs = Math.max(0, Math.floor((currentTime - start) / 1000));
    }
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOverdue = (order: Order) => {
    if (order.status === 'completed' || order.status === 'served') return false;
    const start = order.prepStartedAt || order.createdAt;
    return (currentTime - start) > 1000 * 60 * 10;
  };

  // Status progression action for Baristas
  const handleAdvanceStatus = (order: Order, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (order.status === 'placed') {
      updateOrderStatus(order.id, 'in_prep');
      if (soundEnabled) sounds.playNewOrderChime();
    } else if (order.status === 'in_prep') {
      updateOrderStatus(order.id, 'ready');
      if (soundEnabled) sounds.playOrderReadyChime();
    } else if (order.status === 'ready') {
      updateOrderStatus(order.id, 'completed');
      if (soundEnabled) sounds.playPaymentSuccess();
    } else if (order.status === 'completed' || order.status === 'served') {
      updateOrderStatus(order.id, 'in_prep');
    }
  };

  const handleShareLink = (order: Order, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText(window.location.origin + `?tracked=${order.id}`);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBypassDelete = (orderId: string) => {
    deleteOrder(orderId);
    setDeleteConfirmId(null);
    if (selectedOrderForModal?.id === orderId) {
      setSelectedOrderForModal(null);
    }
  };

  // -------------------------------------------------------------
  // 1. CUSTOMER VIEW: Single Centerpiece Sticky Note Live Tracker
  // -------------------------------------------------------------
  if (isCustomer && !activeCustomerOrder) {
    return (
      <div className="max-w-xl mx-auto p-8 sm:p-12 text-center space-y-6 animate-fadeIn min-h-[70vh] flex flex-col justify-center items-center">
        {/* Post-it Empty Slate */}
        <div className="relative p-8 rounded-3xl bg-[#fefce8] dark:bg-[#262312] border-2 border-amber-300/80 dark:border-amber-600/50 shadow-xl max-w-md w-full text-center space-y-5 transform -rotate-1">
          {/* Top Washi Tape */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1 rounded-sm washi-tape bg-amber-300/80 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-950 shadow-sm">
            <span>EXTRACTION POINT • ORDER BOARD</span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto shadow-sm mt-2">
            <Coffee className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950 dark:text-amber-100">
              {qrTableNumber ? `Table #${qrTableNumber} is Ready` : 'No Active Order Found'}
            </h3>
            <p className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-200/80 leading-relaxed font-sans">
              {qrTableNumber 
                ? `You're currently seated at Table #${qrTableNumber}. Explore our specialty espresso, matcha, and comfort kitchen menu to place an order!`
                : 'You do not have an order currently in preparation. Browse our menu and order live!'}
            </p>
          </div>

          <button
            onClick={() => setActiveView('customer')}
            className="px-6 py-3 rounded-2xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black font-bold text-xs sm:text-sm shadow-md hover:opacity-90 active:scale-95 transition-all inline-flex items-center space-x-2 w-full justify-center"
          >
            <Coffee className="w-4 h-4" />
            <span>Browse Extraction Point Menu</span>
          </button>
        </div>
      </div>
    );
  }

  // Customer tracking with an active order
  if (isCustomer && activeCustomerOrder) {
    const theme = getNoteTheme(activeCustomerOrder.status, activeCustomerOrder.isRush);
    const steps = [
      { key: 'placed', label: 'Order Received', icon: <Coffee className="w-4 h-4" /> },
      { key: 'in_prep', label: 'Brewing & In Kitchen', icon: <ChefHat className="w-4 h-4" /> },
      { key: 'ready', label: 'Ready for Serving', icon: <Check className="w-4 h-4" /> },
      { key: 'completed', label: 'Completed', icon: <CheckCircle2 className="w-4 h-4" /> },
    ];
    const getStepIndex = (status: string) => {
      switch (status) {
        case 'placed': return 0;
        case 'in_prep': return 1;
        case 'ready': return 2;
        case 'served':
        case 'completed': return 3;
        default: return 0;
      }
    };
    const currentStepIdx = getStepIndex(activeCustomerOrder.status);

    return (
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 space-y-6 animate-fadeIn">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveView('customer')}
            className="flex items-center space-x-1.5 text-xs font-bold text-[#666666] dark:text-[#9999a0] hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </button>

          <div className="flex items-center space-x-2">
            {visibleOrders.length > 1 && (
              <select
                value={activeCustomerOrder.id}
                onChange={(e) => setTrackedOrderId(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-[#ede7dc] dark:bg-[#202024] text-[11px] font-bold border border-[#ded8ce] dark:border-[#2a2a30] text-[#111111] dark:text-white"
              >
                {visibleOrders.map((o) => (
                  <option key={o.id} value={o.id}>
                    Sticky Note: {o.orderNumber} ({o.status})
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => handleShareLink(activeCustomerOrder)}
              className="p-2 rounded-xl bg-[#ede7dc] dark:bg-[#202024] text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white border border-[#ded8ce] dark:border-[#2a2a30] transition-all"
              title="Share Live Tracker"
            >
              {copiedId === activeCustomerOrder.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* The Master Customer Sticky Note */}
        <div className={`relative p-6 sm:p-8 rounded-3xl ${theme.bg} ${theme.darkBg} border-2 ${theme.border} ${theme.darkBorder} sticky-shadow space-y-6 select-none transition-all`}>
          
          {/* Washi Tape Header */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-6 py-1 rounded-sm washi-tape shadow-sm flex items-center space-x-2">
            <Pin className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
              {theme.tagLabel} • TICKET #{activeCustomerOrder.orderNumber}
            </span>
          </div>

          {/* Sticky Note Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-b border-black/10 dark:border-white/10 pb-5">
            <div>
              <div className="flex items-center space-x-3">
                <span className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-[#111111] dark:text-white">
                  {activeCustomerOrder.orderNumber}
                </span>
                {activeCustomerOrder.isRush && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white flex items-center space-x-1 shadow-sm animate-pulse">
                    <Flame className="w-3 h-3" />
                    <span>RUSH</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-medium">
                Guest: <strong className="text-black dark:text-white">{activeCustomerOrder.customerName}</strong> • Placed at {new Date(activeCustomerOrder.createdAt).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="px-3.5 py-2 rounded-2xl bg-white/60 dark:bg-black/40 border border-black/10 dark:border-white/10 text-center min-w-[100px] shadow-sm">
                <span className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider block">
                  {activeCustomerOrder.type === 'dine_in' ? 'Table Stand' : 'Packaging'}
                </span>
                <div className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center justify-center space-x-1 mt-0.5">
                  {activeCustomerOrder.type === 'dine_in' ? (
                    <>
                      <Utensils className="w-3.5 h-3.5 text-[#c5a880]" />
                      <span>Table <strong className="font-mono font-black">{activeCustomerOrder.tableNumber || 'N/A'}</strong></span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 text-[#c5a880]" />
                      <span>Takeaway</span>
                    </>
                  )}
                </div>
              </div>

              <div className="px-3.5 py-2 rounded-2xl bg-white/60 dark:bg-black/40 border border-black/10 dark:border-white/10 text-center min-w-[90px] shadow-sm">
                <span className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider block">
                  Prep Timer
                </span>
                <div className={`font-mono font-bold text-sm sm:text-base flex items-center justify-center space-x-1 mt-0.5 ${isOverdue(activeCustomerOrder) ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-[#8f744e] dark:text-[#dfcca9]'}`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimer(activeCustomerOrder)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Milestone Progress Bar */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1.5 bg-black/10 dark:bg-white/10 rounded-full -z-0">
                <div
                  className="h-full bg-[#c5a880] rounded-full transition-all duration-500"
                  style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>

              <div className="relative z-10 flex justify-between">
                {steps.map((s, idx) => {
                  const isPassed = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div key={s.key} className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          isPassed
                            ? 'bg-[#c5a880] text-black font-bold ring-4 ring-[#c5a880]/30 shadow-md scale-105'
                            : 'bg-white/80 dark:bg-[#1f1f24] text-gray-400 border border-black/20 dark:border-white/20'
                        }`}
                      >
                        {s.icon}
                      </div>
                      <span className={`text-[10.5px] mt-1.5 font-medium text-center max-w-[75px] sm:max-w-none ${
                        isCurrent
                          ? 'font-bold text-black dark:text-white'
                          : isPassed
                          ? 'text-gray-800 dark:text-gray-200'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current State Message */}
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-black/30 border border-black/10 dark:border-white/10 text-center space-y-2">
              {activeCustomerOrder.status === 'placed' && (
                <p className="text-xs text-gray-800 dark:text-gray-200">
                  🔔 Your order is lined up on the barista board. Brewing starts shortly!
                </p>
              )}
              {activeCustomerOrder.status === 'in_prep' && (
                <p className="text-xs text-[#9a3412] dark:text-[#fdba74] font-bold animate-pulse flex items-center justify-center space-x-1.5">
                  <ChefHat className="w-4 h-4" />
                  <span>Barista & kitchen are handcrafting your order right now.</span>
                </p>
              )}
              {activeCustomerOrder.status === 'ready' && (
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center space-x-1.5">
                  <span>🎉 Order is ready! {activeCustomerOrder.type === 'dine_in' ? `Staff is serving to Table #${activeCustomerOrder.tableNumber}.` : 'Please pick it up at the counter.'}</span>
                </p>
              )}
              {(activeCustomerOrder.status === 'served' || activeCustomerOrder.status === 'completed') && (
                <div className="space-y-3">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Served & Completed. Enjoy your Extraction Point coffee!</span>
                  </p>
                  <button
                    onClick={() => {
                      clearTrackedOrder();
                      setActiveView('customer');
                    }}
                    className="px-5 py-2 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-black font-bold text-xs shadow-md inline-flex items-center space-x-1.5 hover:opacity-90 transition-all"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Order More Items</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Note Item Checklist */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
              <span className="font-serif font-bold text-sm text-gray-900 dark:text-white">
                Ordered Items ({activeCustomerOrder.items.length})
              </span>
              <button
                onClick={() => setShowReceipt(!showReceipt)}
                className="flex items-center space-x-1 text-xs text-[#8f744e] dark:text-[#dfcca9] font-bold hover:underline"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>{showReceipt ? 'Hide Receipt' : 'View BIR Receipt'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {activeCustomerOrder.items.map((item) => {
                const isChecked = Boolean(activeCustomerOrder.itemStatuses?.[item.cartId]);
                return (
                  <div 
                    key={item.cartId}
                    className={`p-2.5 rounded-xl bg-white/60 dark:bg-black/30 border border-black/5 dark:border-white/5 flex items-start justify-between text-xs transition-opacity ${isChecked ? 'opacity-70 line-through' : ''}`}
                  >
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white flex items-center space-x-1.5">
                        <span className="w-5 h-5 rounded-md bg-[#c5a880]/20 text-[#8f744e] dark:text-[#dfcca9] flex items-center justify-center text-[10px] font-mono font-black">
                          {item.quantity}x
                        </span>
                        <span>{item.menuItem.name}</span>
                      </div>
                      <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 pl-6 space-x-1">
                        {item.customization.temperature && <span className="capitalize">{item.customization.temperature}</span>}
                        {item.customization.sweetness !== undefined && <span>• {item.customization.sweetness}% sweetness</span>}
                        {item.customization.milk && item.customization.milk !== 'regular' && (
                          <span className="highlighter-yellow">• {item.customization.milk} milk (+₱50)</span>
                        )}
                        {item.customization.extraEspressoShots ? <span className="highlighter-yellow">• +{item.customization.extraEspressoShots} shot</span> : null}
                        {item.customization.specialInstructions && (
                          <span className="italic block mt-0.5 text-amber-900 dark:text-amber-200">"{item.customization.specialInstructions}"</span>
                        )}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">
                      {formatPhp(item.totalPrice)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Total Paid */}
            <div className="pt-2 flex justify-between items-center text-xs font-bold text-gray-800 dark:text-gray-200 border-t border-black/10 dark:border-white/10">
              <span>Paid via {activeCustomerOrder.paymentMethod.toUpperCase()}:</span>
              <span className="font-mono text-base text-[#8f744e] dark:text-[#dfcca9] font-black">
                {formatPhp(activeCustomerOrder.total)}
              </span>
            </div>
          </div>

          {/* BIR Receipt Viewer Drawer */}
          {showReceipt && (
            <div className="p-4 rounded-2xl bg-white dark:bg-[#141416] border-2 border-dashed border-gray-300 dark:border-gray-700 font-mono text-[11px] text-gray-800 dark:text-gray-200 space-y-2 animate-fadeIn select-text">
              <div className="text-center pb-2 border-b border-dashed border-gray-300 dark:border-gray-700">
                <div className="font-bold text-xs uppercase">EXTRACTION POINT CAFE</div>
                <div className="text-[10px] text-gray-500">TIN: 432-876-109-00000 VAT</div>
                <div className="text-[10px] text-gray-500">Your Day Deserves Better Caffeine</div>
              </div>
              <div className="flex justify-between">
                <span>Receipt #:</span>
                <span>{activeCustomerOrder.paymentDetails?.receiptNumber || 'EXT-OR-2026-001'}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(activeCustomerOrder.createdAt).toLocaleString('en-PH')}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-bold">{formatPhp(activeCustomerOrder.total)}</span>
              </div>
              <div className="text-center pt-2 text-[10px] text-gray-400 border-t border-dashed border-gray-200 dark:border-gray-800">
                THIS SERVES AS AN OFFICIAL RECEIPT.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. BARISTA / STAFF PINBOARD VIEW: Multi Sticky Note Order Board
  // -------------------------------------------------------------
  return (
    <div className="min-h-[85vh] corkboard-pattern p-4 sm:p-6 lg:p-8 space-y-6 transition-colors select-none">
      
      {/* Top Header & Sticky Board Controls */}
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Main Title & Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-3xl bg-white/90 dark:bg-[#141417]/90 backdrop-blur-md border border-[#ded8ce] dark:border-[#222226] shadow-sm">
          
          {/* Title & Live Badge */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black flex items-center justify-center shadow-sm">
              <Pin className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-[#111111] dark:text-[#f8f7f4]">
                  Barista Order Tracker Board
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  STICKY NOTES
                </span>
              </div>
              <p className="text-[11px] text-gray-500">Live order tickets with item strikethroughs & fast-status routing</p>
            </div>
          </div>

          {/* Quick Sound & View Controls */}
          <div className="flex items-center flex-wrap gap-2">
            
            {/* Search Bar */}
            <div className="relative min-w-[200px] sm:min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search order #, table, guest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-[#f4efe8] dark:bg-[#1c1c20] border border-[#ded8ce] dark:border-[#2b2b32] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#c5a880]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
                soundEnabled
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 border-gray-200 dark:border-gray-700'
              }`}
              title={soundEnabled ? 'Order Audio Chimes: Enabled' : 'Order Audio Chimes: Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Filter Pills Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl bg-white/70 dark:bg-[#141417]/70 backdrop-blur-md border border-[#ded8ce] dark:border-[#222226] text-xs">
          
          {/* Status Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Sticky Notes', count: visibleOrders.length },
              { id: 'placed', label: '🟡 Placed', count: placedCount },
              { id: 'in_prep', label: '🟠 Brewing', count: inPrepCount },
              { id: 'ready', label: '🟢 Ready', count: readyCount },
              { id: 'completed', label: '⚪ Done', count: completedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-[#ede7dc]/50 dark:hover:bg-[#202025]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  statusFilter === tab.id ? 'bg-[#c5a880] text-black' : 'bg-gray-200 dark:bg-zinc-800'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}

            {overdueCount > 0 && (
              <div className="px-2.5 py-1 rounded-xl bg-rose-500 text-white font-bold text-[11px] flex items-center space-x-1 animate-pulse shadow-sm whitespace-nowrap">
                <Flame className="w-3.5 h-3.5" />
                <span>{overdueCount} Overdue (&gt;10m)</span>
              </div>
            )}
          </div>

          {/* Order Type Filter Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'dine_in', label: '🍽️ Dine-In' },
              { id: 'takeaway', label: '🛍️ Takeaway' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setOrderTypeFilter(st.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  orderTypeFilter === st.id
                    ? 'bg-[#c5a880] text-black shadow-sm'
                    : 'bg-[#ede7dc]/60 dark:bg-[#1e1e23] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Sticky Note Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredBaristaOrders.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/60 dark:bg-[#141417]/60 border-2 border-dashed border-[#ded8ce] dark:border-[#2a2a30] space-y-4 my-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-600 dark:text-amber-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-lg text-gray-900 dark:text-gray-100">
                All Clear! No Matching Orders on the Board
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {searchQuery 
                  ? `No sticky notes matched "${searchQuery}". Clear your search or change filters.`
                  : 'There are currently no active orders matching this filter. New tickets will automatically pin here!'}
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-black text-xs font-bold"
              >
                Clear Search Query
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
            {filteredBaristaOrders.map((order, idx) => {
              const theme = getNoteTheme(order.status, order.isRush);
              const overdue = isOverdue(order);
              const isFinished = order.status === 'completed' || order.status === 'served';

              // Subtle rotation per card for realistic sticky note pinboard aesthetic
              const rotations = ['-rotate-1', 'rotate-1', '-rotate-0.5', 'rotate-0.5', '-rotate-1.5', 'rotate-1.5'];
              const cardRotation = rotations[idx % rotations.length];

              return (
                <div
                  key={order.id}
                  className={`relative p-5 rounded-3xl ${theme.bg} ${theme.darkBg} border-2 ${theme.border} ${theme.darkBorder} sticky-shadow sticky-shadow-hover transition-all duration-200 transform ${cardRotation} hover:rotate-0 hover:-translate-y-1 flex flex-col justify-between group min-h-[360px]`}
                >
                  {/* Top Washi Tape Strip with Pin */}
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-sm washi-tape shadow-sm flex items-center space-x-1.5 z-10 ${theme.tape} ${theme.darkTape}`}>
                    <Pin className="w-3 h-3 text-rose-500 fill-rose-500 flex-shrink-0" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider whitespace-nowrap">
                      {theme.tagLabel}
                    </span>
                  </div>

                  <div>
                    {/* Note Header: Order #, Table/Takeaway, Timer */}
                    <div className="flex items-start justify-between gap-2 pt-2 pb-3 border-b border-black/10 dark:border-white/10">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                            {order.orderNumber}
                          </span>
                          {order.isRush && (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500 text-white flex items-center space-x-0.5 animate-pulse">
                              <Flame className="w-2.5 h-2.5" />
                              <span>RUSH</span>
                            </span>
                          )}
                        </div>

                        {/* Customer & Time Placed */}
                        <div className="text-[11px] text-gray-700 dark:text-gray-300 mt-0.5 font-medium truncate max-w-[150px]">
                          <strong>{order.customerName}</strong>
                          <span className="text-gray-500 text-[10px] ml-1">
                            • {new Date(order.createdAt).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Right: Table Badge & Live Timer */}
                      <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
                        {/* Table or Takeaway Pill */}
                        <div className="px-2.5 py-1 rounded-xl bg-white/70 dark:bg-black/40 border border-black/10 dark:border-white/10 text-[11px] font-bold text-gray-800 dark:text-gray-200 flex items-center space-x-1 shadow-2xs">
                          {order.type === 'dine_in' ? (
                            <>
                              <Utensils className="w-3 h-3 text-[#c5a880]" />
                              <span>T-{order.tableNumber || 'N/A'}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3 h-3 text-[#c5a880]" />
                              <span>Takeaway</span>
                            </>
                          )}
                        </div>

                        {/* Elapsed Timer */}
                        <div className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold flex items-center space-x-1 shadow-2xs ${
                          overdue 
                            ? 'bg-rose-500 text-white animate-pulse' 
                            : isFinished 
                            ? 'bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-300' 
                            : 'bg-white/80 dark:bg-black/50 text-[#8f744e] dark:text-[#dfcca9]'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{formatTimer(order)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Item Checklist (Baristas click to strike off items) */}
                    <div className="py-3 space-y-2 max-h-[220px] overflow-y-auto no-scrollbar">
                      {(order.items || []).map((item) => {
                        const isDone = Boolean(order.itemStatuses?.[item.cartId]);
                        return (
                          <div
                            key={item.cartId}
                            onClick={() => toggleOrderItemCheck(order.id, item.cartId)}
                            className={`p-2 rounded-xl bg-white/70 dark:bg-black/30 border border-black/5 dark:border-white/5 transition-all cursor-pointer hover:border-[#c5a880] flex items-start space-x-2 select-none ${
                              isDone ? 'opacity-60' : ''
                            }`}
                            title="Click to check off drink / food"
                          >
                            <button
                              type="button"
                              className="mt-0.5 text-gray-400 hover:text-black dark:hover:text-white flex-shrink-0"
                            >
                              {isDone ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className={`text-xs font-bold text-gray-900 dark:text-white flex items-center justify-between gap-1 ${
                                isDone ? 'line-through text-gray-500 dark:text-gray-400' : ''
                              }`}>
                                <span className="truncate">
                                  {item.quantity}x {item.menuItem.name}
                                </span>
                                <span className="font-mono text-[11px] text-gray-700 dark:text-gray-300 flex-shrink-0">
                                  {formatPhp(item.totalPrice)}
                                </span>
                              </div>

                              {/* Customization Details & Barista Highlighting */}
                              <div className="text-[10.5px] text-gray-600 dark:text-gray-400 mt-0.5 space-x-1 flex flex-wrap items-center">
                                {item.customization.temperature && (
                                  <span className="capitalize font-medium">{item.customization.temperature}</span>
                                )}
                                {item.customization.sweetness !== undefined && (
                                  <span>• {item.customization.sweetness}% sugar</span>
                                )}
                                {item.customization.milk && item.customization.milk !== 'regular' && (
                                  <span className="highlighter-yellow font-bold text-amber-950 dark:text-amber-200">
                                    • {item.customization.milk}
                                  </span>
                                )}
                                {item.customization.extraEspressoShots ? (
                                  <span className="highlighter-yellow font-bold text-amber-950 dark:text-amber-200">
                                    • +{item.customization.extraEspressoShots} shot
                                  </span>
                                ) : null}
                              </div>

                              {item.customization.specialInstructions && (
                                <div className="text-[10px] italic text-amber-900 dark:text-amber-200 bg-amber-200/40 dark:bg-amber-900/40 px-1.5 py-0.5 rounded mt-1">
                                  "{item.customization.specialInstructions}"
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Note Footer: One-Tap Barista Status Progression & Utilities */}
                  <div className="pt-3 border-t border-black/10 dark:border-white/10 space-y-2">
                    
                    {/* Main Barista Progression Button */}
                    <button
                      onClick={(e) => handleAdvanceStatus(order, e)}
                      className={`w-full py-2 px-3 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 active:scale-95 ${
                        order.status === 'placed'
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : order.status === 'in_prep'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                          : order.status === 'ready'
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                      }`}
                    >
                      {order.status === 'placed' && (
                        <>
                          <Coffee className="w-3.5 h-3.5" />
                          <span>Start Brewing ➔ In Prep</span>
                        </>
                      )}
                      {order.status === 'in_prep' && (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>🔔 Mark Ready & Ding!</span>
                        </>
                      )}
                      {order.status === 'ready' && (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>✓ Complete & Serve Order</span>
                        </>
                      )}
                      {isFinished && (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Served • Re-open Ticket</span>
                        </>
                      )}
                    </button>

                    {/* Secondary Controls Bar */}
                    <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400 pt-1">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setSelectedOrderForModal(order)}
                          className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors flex items-center space-x-1"
                          title="Focus & View Full Receipt"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">Details</span>
                        </button>

                        <button
                          onClick={(e) => handleShareLink(order, e)}
                          className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors"
                          title="Copy Customer Tracking Link"
                        >
                          {copiedId === order.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Staff Bypass / Delete Button */}
                      <button
                        onClick={() => setDeleteConfirmId(order.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/10 text-gray-400 hover:text-rose-600 transition-colors"
                        title="Bypass & Purge Order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          3. MODAL: DETAILED STICKY NOTE FOCUS & BIR OFFICIAL RECEIPT
      ------------------------------------------------------------- */}
      {selectedOrderForModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedOrderForModal(null)}
        >
          <div 
            className="relative max-w-xl w-full rounded-3xl bg-[#faf8f5] dark:bg-[#151518] border border-[#ded8ce] dark:border-[#2a2a30] shadow-2xl overflow-hidden animate-slideUp select-text max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1a1a1f]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#c5a880]/20 text-[#8f744e] dark:text-[#dfcca9] flex items-center justify-center font-bold">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white">
                    Order Ticket Details • {selectedOrderForModal.orderNumber}
                  </h3>
                  <p className="text-[11px] text-gray-500">Official BIR Sales Receipt & Milestone Breakdown</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-black dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Order Quick Summary Card */}
              <div className="p-4 rounded-2xl bg-[#ede7dc]/60 dark:bg-[#202025] flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Guest & Table</span>
                  <div className="font-bold text-sm text-gray-900 dark:text-white mt-0.5">
                    {selectedOrderForModal.customerName} • {selectedOrderForModal.type === 'dine_in' ? `Table #${selectedOrderForModal.tableNumber}` : 'Takeaway'}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Current Status</span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 mt-0.5">
                    {selectedOrderForModal.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-gray-900 dark:text-white">
                  Ticket Items ({selectedOrderForModal.items.length})
                </h4>
                <div className="divide-y divide-gray-100 dark:divide-gray-800 border-t border-b border-gray-100 dark:border-gray-800">
                  {selectedOrderForModal.items.map((item) => (
                    <div key={item.cartId} className="py-2.5 flex justify-between items-start text-xs">
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {item.quantity}x {item.menuItem.name}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5 space-x-1">
                          {item.customization.temperature && <span className="capitalize">{item.customization.temperature}</span>}
                          {item.customization.sweetness !== undefined && <span>• {item.customization.sweetness}% sweetness</span>}
                          {item.customization.milk && item.customization.milk !== 'regular' && <span>• {item.customization.milk} milk (+₱50)</span>}
                          {item.customization.extraEspressoShots ? <span>• +{item.customization.extraEspressoShots} espresso shot</span> : null}
                          {item.customization.specialInstructions && (
                            <span className="italic block text-amber-700 dark:text-amber-300">"{item.customization.specialInstructions}"</span>
                          )}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">
                        {formatPhp(item.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BIR Simulated Receipt Box */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#101012] border-2 border-dashed border-gray-300 dark:border-gray-700 font-mono text-[11px] text-gray-800 dark:text-gray-200 space-y-2 select-text">
                <div className="text-center pb-2 border-b border-dashed border-gray-300 dark:border-gray-700">
                  <div className="font-bold text-xs uppercase">EXTRACTION POINT CAFE</div>
                  <div className="text-[10px] text-gray-500">TIN: 432-876-109-00000 VAT</div>
                  <div className="text-[10px] text-gray-500">Your Day Deserves Better Caffeine</div>
                  <div className="text-[10px] text-gray-500">Socials: @ext.point_</div>
                </div>

                <div className="flex justify-between">
                  <span>Receipt #:</span>
                  <span>{selectedOrderForModal.paymentDetails?.receiptNumber || 'EXT-OR-2026-001'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date/Time:</span>
                  <span>{new Date(selectedOrderForModal.createdAt).toLocaleString('en-PH')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <span className="uppercase">{selectedOrderForModal.paymentMethod} {selectedOrderForModal.paymentDetails?.gcashRef ? `(${selectedOrderForModal.paymentDetails.gcashRef})` : ''}</span>
                </div>
                {selectedOrderForModal.paymentDetails?.seniorPwdId && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>SC/PWD ID:</span>
                    <span>{selectedOrderForModal.paymentDetails.seniorPwdId}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-dashed border-gray-300 dark:border-gray-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPhp(selectedOrderForModal.subtotal)}</span>
                  </div>
                  {selectedOrderForModal.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Senior / PWD 20% Discount:</span>
                      <span>-{formatPhp(selectedOrderForModal.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>VAT (12%):</span>
                    <span>{formatPhp(selectedOrderForModal.vatAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs pt-1 border-t border-dashed border-gray-300 dark:border-gray-700">
                    <span>TOTAL AMOUNT DUE:</span>
                    <span className="text-[#8f744e] dark:text-[#dfcca9]">{formatPhp(selectedOrderForModal.total)}</span>
                  </div>
                </div>

                <div className="text-center pt-2 text-[9.5px] text-gray-400 border-t border-dashed border-gray-200 dark:border-gray-800">
                  THIS SERVES AS AN OFFICIAL RECEIPT. THANK YOU!
                </div>
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1f] flex items-center justify-between">
              <button
                onClick={() => handleShareLink(selectedOrderForModal)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-colors flex items-center space-x-1.5"
              >
                {copiedId === selectedOrderForModal.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedId === selectedOrderForModal.id ? 'Copied Link!' : 'Share Tracking Link'}</span>
              </button>

              <button
                onClick={() => {
                  handleAdvanceStatus(selectedOrderForModal);
                  setSelectedOrderForModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-black text-xs font-bold shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center space-x-1.5"
              >
                <span>Advance Order Status</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          4. MODAL: STAFF BYPASS & FORCE DELETE CONFIRMATION
      ------------------------------------------------------------- */}
      {deleteConfirmId && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div 
            className="p-6 rounded-3xl bg-white dark:bg-[#151518] border border-rose-500/30 shadow-2xl max-w-md w-full space-y-4 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-rose-700 dark:text-rose-400">
                  Force Clear & Purge Ticket?
                </h4>
                <p className="text-xs text-gray-500">Immediate removal from barista board</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              This will immediately delete this ticket, free up the associated table stand, and remove it from the live order tracker.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBypassDelete(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Yes, Purge Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
