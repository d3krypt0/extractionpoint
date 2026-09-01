import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPhp } from '../../utils/phCurrency';
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
  Home
} from 'lucide-react';

export const LiveOrderTracker: React.FC = () => {
  const { 
    orders, 
    trackedOrderId, 
    setTrackedOrderId, 
    clearTrackedOrder, 
    deleteOrder, 
    setActiveView,
    isQrCustomerMode,
    qrTableNumber,
    activeView
  } = useApp();

  const [showReceipt, setShowReceipt] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Determine if viewing as customer or staff
  const isCustomer = isQrCustomerMode || Boolean(qrTableNumber) || activeView === 'customer';

  // Filter orders visible to this device / table
  const visibleOrders = useMemo(() => {
    // 1. If at a specific QR table (e.g. ?table=1)
    if (qrTableNumber) {
      return orders.filter((o) => o.tableNumber === qrTableNumber || o.id === trackedOrderId);
    }
    // 2. If customer mode without QR table (e.g. placed takeaway order or self-order)
    if (isCustomer) {
      if (trackedOrderId) {
        return orders.filter((o) => o.id === trackedOrderId);
      }
      return [];
    }
    // 3. Staff monitoring view: can inspect any order in cafe
    return orders;
  }, [orders, qrTableNumber, isCustomer, trackedOrderId]);

  // Active order to display
  const activeOrder = useMemo(() => {
    if (trackedOrderId) {
      const matched = visibleOrders.find((o) => o.id === trackedOrderId);
      if (matched) return matched;
    }
    // If QR table has an in-progress order, show that
    if (qrTableNumber) {
      const inProgress = visibleOrders.find(
        (o) => o.tableNumber === qrTableNumber && o.status !== 'completed' && o.status !== 'served'
      );
      if (inProgress) return inProgress;
    }
    return visibleOrders[0] || null;
  }, [visibleOrders, trackedOrderId, qrTableNumber]);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!activeOrder) return;
    const start = activeOrder.prepStartedAt || activeOrder.createdAt;

    // Freeze timer when order is finished, served, or ready
    if (activeOrder.status === 'served' || activeOrder.status === 'completed' || activeOrder.status === 'ready') {
      const finishTime = activeOrder.completedAt || activeOrder.readyAt || Date.now();
      const fixedSecs = Math.floor((finishTime - start) / 1000);
      setElapsedSeconds(fixedSecs > 0 ? fixedSecs : 0);
      return;
    }

    // Active real-time counter while brewing / in prep
    const updateTime = () => {
      const secs = Math.floor((Date.now() - start) / 1000);
      setElapsedSeconds(secs > 0 ? secs : 0);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [activeOrder]);

  const handleBypassAndDeleteOrder = () => {
    if (!activeOrder) return;
    deleteOrder(activeOrder.id);
    setShowDeleteConfirm(false);
    setActiveView('customer');
  };

  if (!activeOrder) {
    return (
      <div className="max-w-2xl mx-auto p-8 sm:p-12 text-center space-y-5 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-[#c5a880]/15 text-[#c5a880] flex items-center justify-center mx-auto shadow-sm">
          <Clock className="w-8 h-8" />
        </div>
        
        <div className="space-y-1.5">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] dark:text-[#f8f7f4]">
            {qrTableNumber ? `No Active Orders for Table #${qrTableNumber}` : 'No Active Orders'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            {qrTableNumber 
              ? `There are currently no active orders for Table #${qrTableNumber}. Browse our menu and place an order to track it live.`
              : 'You have no orders currently being prepared. Explore our specialty coffee, matcha, and kitchen food menu!'}
          </p>
        </div>

        <button
          onClick={() => setActiveView('customer')}
          className="px-6 py-3 rounded-2xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black font-bold text-xs sm:text-sm shadow-md hover:opacity-90 active:scale-95 transition-all inline-flex items-center space-x-2"
        >
          <Coffee className="w-4 h-4" />
          <span>Browse Extraction Point Menu</span>
        </button>
      </div>
    );
  }

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

  const currentStepIdx = getStepIndex(activeOrder.status);
  const isFinished = activeOrder.status === 'served' || activeOrder.status === 'completed';

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Top Breadcrumb & Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => setActiveView('customer')}
          className="flex items-center space-x-1.5 text-xs font-bold text-[#666666] dark:text-[#9999a0] hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {visibleOrders.length > 1 && (
            <select
              value={activeOrder.id}
              onChange={(e) => setTrackedOrderId(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-[#ede7dc] dark:bg-[#202024] text-[11px] font-bold border border-[#ded8ce] dark:border-[#2a2a30] text-[#111111] dark:text-white"
            >
              {visibleOrders.map((o) => (
                <option key={o.id} value={o.id}>
                  Order {o.orderNumber} ({o.status})
                </option>
              ))}
            </select>
          )}

          {/* STAFF ONLY: Force Delete / Bypass Button */}
          {!isCustomer && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition-colors"
              title="Staff: Bypass / Force Delete Stuck Order"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-[#ede7dc] dark:bg-[#202024] text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white border border-[#ded8ce] dark:border-[#2a2a30]"
            title="Share Order Tracker Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* STAFF ONLY: Delete / Bypass Confirmation Dialog */}
      {!isCustomer && showDeleteConfirm && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3 animate-fadeIn">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-sm text-rose-700 dark:text-rose-400">
                Bypass & Force Clear Order {activeOrder.orderNumber}?
              </h4>
              <p className="text-xs text-rose-600/80 dark:text-rose-300/80">
                This will immediately purge this ticket, free up Table #{activeOrder.tableNumber || 'N/A'}, and clear the tracker badge.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBypassAndDeleteOrder}
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Yes, Bypass & Delete Order
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-1.5 rounded-xl bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Order Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121215] shadow-xl border border-[#ded8ce] dark:border-[#242429] space-y-8">
        
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#eee8df] dark:border-[#202025]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-2xl sm:text-3xl font-black text-[#111111] dark:text-[#f8f7f4]">
                {activeOrder.orderNumber}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                activeOrder.status === 'ready'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-pulse'
                  : activeOrder.status === 'in_prep'
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  : activeOrder.status === 'served' || activeOrder.status === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                  : 'bg-[#c5a880]/20 text-[#8f744e] dark:text-[#dfcca9]'
              }`}>
                {activeOrder.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-[#777777] dark:text-[#8e8e96] mt-1">
              Guest: <strong>{activeOrder.customerName}</strong> • {new Date(activeOrder.createdAt).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-[#f5f1ea] dark:bg-[#18181c] border border-[#e8e2d8] dark:border-[#26262c] text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                {activeOrder.type === 'dine_in' ? 'Dine-In Table' : 'Order Type'}
              </span>
              <div className="font-serif font-bold text-base text-[#111111] dark:text-white mt-0.5 flex items-center justify-center space-x-1">
                {activeOrder.type === 'dine_in' ? (
                  <>
                    <Utensils className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>Table #{activeOrder.tableNumber || 'N/A'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>Takeaway</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#f5f1ea] dark:bg-[#18181c] border border-[#e8e2d8] dark:border-[#26262c] text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Prep Time
              </span>
              <div className="font-mono font-bold text-base text-[#c5a880] mt-0.5 flex items-center justify-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(elapsedSeconds)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Progress Bar & Milestones */}
        <div className="space-y-4">
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-gray-200 dark:bg-gray-800 -z-0">
              <div
                className="h-full bg-[#c5a880] transition-all duration-500"
                style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>

            {/* Nodes */}
            <div className="relative z-10 flex justify-between">
              {steps.map((s, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={s.key} className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isPassed
                          ? 'bg-[#c5a880] text-black font-bold ring-4 ring-[#c5a880]/20 shadow-md'
                          : 'bg-white dark:bg-[#1f1f24] text-gray-400 border-2 border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      {s.icon}
                    </div>
                    <span className={`text-[11px] mt-2 font-medium text-center max-w-[80px] sm:max-w-none ${
                      isCurrent
                        ? 'font-bold text-[#111111] dark:text-[#f8f7f4]'
                        : isPassed
                        ? 'text-gray-700 dark:text-gray-300'
                        : 'text-gray-400'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current State Message */}
          <div className="p-4 rounded-2xl bg-[#ede7dc]/70 dark:bg-[#18181d] border border-[#ded8ce] dark:border-[#28282f] text-center space-y-3">
            {activeOrder.status === 'placed' && (
              <p className="text-xs text-gray-700 dark:text-gray-300">
                Your order has been transmitted to our kitchen. Baristas are preparing the ingredients!
              </p>
            )}
            {activeOrder.status === 'in_prep' && (
              <p className="text-xs text-[#8f744e] dark:text-[#dfcca9] font-medium animate-pulse">
                ☕ Barista & kitchen team are crafting your order right now.
              </p>
            )}
            {activeOrder.status === 'ready' && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                🎉 Order is ready! {activeOrder.type === 'dine_in' ? `Our staff is serving it to Table #${activeOrder.tableNumber}.` : 'Please pick it up at the counter.'}
              </p>
            )}
            {isFinished && (
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Served & Completed. Thank you for dining with Extraction Point!</span>
                </div>
                <button
                  onClick={() => {
                    clearTrackedOrder();
                    setActiveView('customer');
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black font-bold text-xs sm:text-sm hover:opacity-90 active:scale-95 transition-all shadow-md inline-flex items-center space-x-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Return to Menu / Start New Order</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Itemized Order Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-sm text-[#111111] dark:text-[#f8f7f4]">
              Ordered Items
            </h4>
            <button
              onClick={() => setShowReceipt(!showReceipt)}
              className="flex items-center space-x-1 text-xs text-[#c5a880] hover:underline font-medium"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>{showReceipt ? 'Hide Receipt' : 'View Official BIR Receipt'}</span>
            </button>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800 border-t border-b border-gray-100 dark:border-gray-800">
            {activeOrder.items.map((item) => (
              <div key={item.cartId} className="py-3 flex justify-between items-start text-xs">
                <div>
                  <div className="font-bold text-[#111111] dark:text-[#f8f7f4]">
                    {item.quantity}x {item.menuItem.name}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5 space-x-1">
                    {item.customization.temperature && <span className="capitalize">{item.customization.temperature}</span>}
                    {item.customization.sweetness !== undefined && <span>• {item.customization.sweetness}% sugar</span>}
                    {item.customization.milk && item.customization.milk !== 'regular' && <span>• {item.customization.milk} milk (+₱50)</span>}
                    {item.customization.extraEspressoShots ? <span>• +{item.customization.extraEspressoShots} espresso</span> : null}
                    {item.customization.specialInstructions && <span className="italic">• "{item.customization.specialInstructions}"</span>}
                  </div>
                </div>
                <span className="font-mono font-bold text-[#111111] dark:text-[#f8f7f4]">
                  {formatPhp(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-2 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono">{formatPhp(activeOrder.subtotal)}</span>
            </div>
            {activeOrder.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Senior / PWD 20% Discount:</span>
                <span className="font-mono">-{formatPhp(activeOrder.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm text-[#111111] dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
              <span>Total Paid ({activeOrder.paymentMethod.toUpperCase()}):</span>
              <span className="font-mono text-base text-[#c5a880]">{formatPhp(activeOrder.total)}</span>
            </div>
          </div>
        </div>

        {/* BIR Official Receipt Print Simulation Preview */}
        {showReceipt && (
          <div className="p-6 rounded-2xl bg-[#faf8f5] dark:bg-[#18181c] border-2 border-dashed border-[#ded8ce] dark:border-[#333338] font-mono text-[11px] text-[#111111] dark:text-[#f0f0f4] space-y-2 animate-fadeIn select-text">
            <div className="text-center pb-2 border-b border-dashed border-gray-300 dark:border-gray-700">
              <div className="font-bold text-xs uppercase">EXTRACTION POINT CAFE</div>
              <div>TIN: 432-876-109-00000 VAT</div>
              <div>Your Day Deserves Better Caffeine</div>
              <div>Socials: @ext.point_</div>
            </div>

            <div className="flex justify-between">
              <span>Receipt #:</span>
              <span>{activeOrder.paymentDetails?.receiptNumber || 'EXT-OR-2026-001'}</span>
            </div>
            <div className="flex justify-between">
              <span>Date/Time:</span>
              <span>{new Date(activeOrder.createdAt).toLocaleString('en-PH')}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="uppercase">{activeOrder.paymentMethod} {activeOrder.paymentDetails?.gcashRef ? `(${activeOrder.paymentDetails.gcashRef})` : ''}</span>
            </div>
            {activeOrder.paymentDetails?.seniorPwdId && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>SC/PWD ID:</span>
                <span>{activeOrder.paymentDetails.seniorPwdId}</span>
              </div>
            )}

            <div className="py-2 border-t border-b border-dashed border-gray-300 dark:border-gray-700 space-y-1">
              {activeOrder.items.map((i) => (
                <div key={i.cartId} className="flex justify-between">
                  <span>{i.quantity}x {i.menuItem.name}</span>
                  <span>{formatPhp(i.totalPrice)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex justify-between">
                <span>VATable Sales:</span>
                <span>{formatPhp(activeOrder.vatExemptAmount > 0 ? 0 : activeOrder.subtotal / 1.12)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (12%):</span>
                <span>{formatPhp(activeOrder.vatAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT-Exempt Sales:</span>
                <span>{formatPhp(activeOrder.vatExemptAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-xs pt-1 border-t border-dashed border-gray-300 dark:border-gray-700">
                <span>AMOUNT DUE:</span>
                <span>{formatPhp(activeOrder.total)}</span>
              </div>
            </div>

            <div className="text-center pt-3 text-[10px] text-gray-500 border-t border-dashed border-gray-300 dark:border-gray-700">
              THIS SERVES AS AN OFFICIAL RECEIPT.<br />
              Thank you for visiting Extraction Point!
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
