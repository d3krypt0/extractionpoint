import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPhp } from '../../utils/phCurrency';
import { 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Coffee, 
  Sparkles, 
  Receipt, 
  ShoppingBag, 
  Utensils, 
  ArrowLeft,
  Share2,
  Check
} from 'lucide-react';

export const LiveOrderTracker: React.FC = () => {
  const { orders, trackedOrderId, setTrackedOrderId, setActiveView } = useApp();
  const [showReceipt, setShowReceipt] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeOrder = orders.find((o) => o.id === trackedOrderId) || orders[0];

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!activeOrder) return;
    const interval = setInterval(() => {
      const start = activeOrder.prepStartedAt || activeOrder.createdAt;
      const secs = Math.floor((Date.now() - start) / 1000);
      setElapsedSeconds(secs > 0 ? secs : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeOrder]);

  if (!activeOrder) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#c5a880]/15 text-[#c5a880] flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#f8f7f4]">
          No Active Orders
        </h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          You haven't placed an order yet. Explore our handcrafted coffee, Nami matcha, and signature menu items!
        </p>
        <button
          onClick={() => setActiveView('customer')}
          className="px-5 py-2.5 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black font-bold text-xs"
        >
          View Extraction Point Menu
        </button>
      </div>
    );
  }

  const steps = [
    { key: 'placed', label: 'Order Received', icon: <Coffee className="w-4 h-4" /> },
    { key: 'in_prep', label: 'Brewing & In Kitchen', icon: <ChefHat className="w-4 h-4" /> },
    { key: 'ready', label: 'Ready for Serving', icon: <Sparkles className="w-4 h-4" /> },
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
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('customer')}
          className="flex items-center space-x-1.5 text-xs font-bold text-[#666666] dark:text-[#9999a0] hover:text-black dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <div className="flex items-center space-x-2">
          {orders.length > 1 && (
            <select
              value={activeOrder.id}
              onChange={(e) => setTrackedOrderId(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-[#ede7dc] dark:bg-[#202024] text-[11px] font-bold border border-[#ded8ce] dark:border-[#2a2a30] text-[#111111] dark:text-white"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  Order {o.orderNumber} ({o.status})
                </option>
              ))}
            </select>
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
          <div className="p-4 rounded-2xl bg-[#ede7dc]/70 dark:bg-[#18181d] border border-[#ded8ce] dark:border-[#28282f] text-center">
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
            {(activeOrder.status === 'served' || activeOrder.status === 'completed') && (
              <p className="text-xs text-gray-600 dark:text-gray-300">
                ✨ Served & Completed. Thank you for dining with Extraction Point!
              </p>
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
