import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MENU_CATEGORIES } from '../../data/menuData';
import { Category, MainCategoryGroup, OrderType } from '../../types';
import { formatPhp, calculatePhilippineTaxesAndDiscounts } from '../../utils/phCurrency';
import { GCashPaymentModal } from '../customer/GCashPaymentModal';
import { 
  Store, 
  Search, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  CheckCircle2,
  Printer
} from 'lucide-react';

export const PosDashboard: React.FC = () => {
  const {
    menuItems,
    cart,
    addToCart,
    updateCartQuantity,
    cartTotals,
    placeOrder,
    tables,
    selectedTableForOrdering,
    setSelectedTableForOrdering,
    orders,
  } = useApp();

  const [activeGroup, setActiveGroup] = useState<MainCategoryGroup>('all');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'gcash'>('cash');
  
  // Philippine Senior / PWD Discount
  const [isSeniorOrPwd, setIsSeniorOrPwd] = useState(false);
  const [seniorPwdId, setSeniorPwdId] = useState('');

  // Cash Tender Calculator
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [isGCashModalOpen, setIsGCashModalOpen] = useState(false);
  const [printedOrder, setPrintedOrder] = useState<any>(null);

  const discountType = isSeniorOrPwd ? 'senior_pwd' : 'none';
  const calculation = calculatePhilippineTaxesAndDiscounts(cartTotals.subtotal, discountType);
  const changeDue = Math.max(0, cashTendered - calculation.totalPayable);

  // Filtered categories based on selected group
  const filteredCategories = useMemo(() => {
    if (activeGroup === 'all') return MENU_CATEGORIES;
    return MENU_CATEGORIES.filter((c) => c.group === activeGroup || c.id === 'all');
  }, [activeGroup]);

  // Filtered Menu Items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (activeGroup !== 'all' && item.group !== activeGroup) return false;
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [menuItems, activeGroup, activeCategory, searchQuery]);

  const selectedTableObj = useMemo(() => {
    if (!selectedTableForOrdering) return null;
    return tables.find((t) => t.number === selectedTableForOrdering) || null;
  }, [tables, selectedTableForOrdering]);

  const handleCashTenderPreset = (amount: number) => {
    setCashTendered(amount);
  };

  const handleCompleteSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (orderType === 'dine_in') {
      if (!selectedTableForOrdering) {
        alert('Please select a table number for dine-in.');
        return;
      }
      const targetTable = tables.find((t) => t.number === selectedTableForOrdering);
      if (targetTable && targetTable.status !== 'available') {
        const confirmOverride = window.confirm(
          `⚠️ Table ${selectedTableForOrdering} is currently marked as ${targetTable.status.toUpperCase()}${
            targetTable.activeCustomerName ? ` (Guest: ${targetTable.activeCustomerName})` : ''
          }.\n\nDo you want to add/override this order on Table ${selectedTableForOrdering}?`
        );
        if (!confirmOverride) return;
      }
    }

    if (paymentMethod === 'cash' && cashTendered < calculation.totalPayable) {
      alert(`Insufficient cash tendered. Total is ${formatPhp(calculation.totalPayable)}`);
      return;
    }

    if (paymentMethod === 'gcash') {
      setIsGCashModalOpen(true);
      return;
    }

    // Process Cash Sale
    const newOrder = placeOrder({
      type: orderType,
      tableNumber: orderType === 'dine_in' ? selectedTableForOrdering || undefined : undefined,
      customerName: customerName.trim() || 'Walk-in Customer',
      paymentMethod: 'cash',
      paymentDetails: {
        cashTendered,
        changeGiven: changeDue,
      },
      discountType,
      seniorPwdId: isSeniorOrPwd ? seniorPwdId : undefined,
    });

    setPrintedOrder(newOrder);
    setCashTendered(0);
    setCustomerName('Walk-in Customer');
    setIsSeniorOrPwd(false);
    setSeniorPwdId('');
  };

  const handleGCashSuccess = (details: { gcashRef: string; gcashMobile: string }) => {
    setIsGCashModalOpen(false);
    const newOrder = placeOrder({
      type: orderType,
      tableNumber: orderType === 'dine_in' ? selectedTableForOrdering || undefined : undefined,
      customerName: customerName.trim() || 'Walk-in Customer',
      paymentMethod: 'gcash',
      paymentDetails: {
        gcashRef: details.gcashRef,
        gcashMobile: details.gcashMobile,
      },
      discountType,
      seniorPwdId: isSeniorOrPwd ? seniorPwdId : undefined,
    });

    setPrintedOrder(newOrder);
    setCustomerName('Walk-in Customer');
    setIsSeniorOrPwd(false);
    setSeniorPwdId('');
  };

  return (
    <div className="min-h-screen bg-[#f3efe8] dark:bg-[#0b0b0d] p-3 sm:p-5 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Left Column: Quick Item Catalog (7 cols on tablet & desktop) */}
        <div className="md:col-span-7 space-y-4">
          
          {/* Top Search & Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-[#c5a880]" />
                <h2 className="font-serif font-bold text-base text-[#111111] dark:text-[#f8f7f4]">
                  Counter Point-of-Sale (POS)
                </h2>
              </div>
              <span className="text-xs text-gray-500 font-mono">
                {orders.length} orders today
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search menu items for quick punch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#f7f5f0] dark:bg-[#1c1c20] border border-[#ded8ce] dark:border-[#2a2a30] text-xs font-medium text-[#111111] dark:text-white focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            {/* Main Category Group Tabs */}
            <div className="flex items-center space-x-1 p-1 bg-[#ede7dc]/80 dark:bg-[#18181c] rounded-xl border border-[#ded8cf] dark:border-[#26262b] overflow-x-auto no-scrollbar text-xs font-bold">
              {[
                { id: 'all', label: 'All Menu' },
                { id: 'food', label: '🍝 Food' },
                { id: 'coffee', label: '☕ Coffee' },
                { id: 'matcha', label: '🍵 Matcha' },
                { id: 'non_coffee', label: '✨ Non-Coffee' },
              ].map((grp) => {
                const isActive = activeGroup === grp.id;
                return (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => {
                      setActiveGroup(grp.id as MainCategoryGroup);
                      setActiveCategory('all');
                    }}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black shadow-xs font-black'
                        : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {grp.label}
                  </button>
                );
              })}
            </div>

            {/* Sub-Category Pills with Full Flex-Wrap (Zero Hidden/Clipped Pills) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {filteredCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id as Category)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      isActive
                        ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black border-transparent shadow-xs'
                        : 'bg-[#f5f1ea] dark:bg-[#1e1e24] text-gray-700 dark:text-gray-300 border-[#ded8ce] dark:border-[#2a2a30] hover:bg-[#c5a880] hover:text-black hover:border-[#c5a880]'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Touch-Ready Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[calc(100vh-250px)] overflow-y-auto p-1">
            {filteredItems.map((item) => {
              const isSoldOut = !!item.isSoldOut;
              return (
                <button
                  key={item.id}
                  disabled={isSoldOut}
                  onClick={() => addToCart(item, {}, 1)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all select-none ${
                    isSoldOut
                      ? 'opacity-40 border-gray-200 bg-gray-100 dark:bg-zinc-900 cursor-not-allowed'
                      : 'border-[#ded8ce] dark:border-[#242429] bg-white dark:bg-[#141417] hover:border-[#c5a880] hover:shadow-md active:scale-95'
                  }`}
                >
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#c5a880] block truncate">
                      {item.category.replace('_', ' ')}
                    </span>
                    <h4 className="font-bold text-xs text-[#111111] dark:text-[#f8f7f4] mt-0.5 line-clamp-2">
                      {item.name}
                    </h4>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <span className="font-mono text-xs font-bold text-[#111111] dark:text-white">
                      {formatPhp(item.price)}
                    </span>
                    {isSoldOut ? (
                      <span className="text-[9px] text-red-500 font-bold">SOLD OUT</span>
                    ) : (
                      <div className="w-5 h-5 rounded-lg bg-[#c5a880]/20 text-[#c5a880] flex items-center justify-center">
                        <Plus className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Register & Bill Settlement (5 cols on tablet & desktop) */}
        <div className="md:col-span-5 space-y-4">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] shadow-md space-y-4">
            
            {/* Header / Table & Type */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setOrderType('dine_in')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    orderType === 'dine_in'
                      ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black'
                      : 'bg-gray-100 dark:bg-[#202024] text-gray-500'
                  }`}
                >
                  Dine-In
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    orderType === 'takeaway'
                      ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black'
                      : 'bg-gray-100 dark:bg-[#202024] text-gray-500'
                  }`}
                >
                  Takeaway
                </button>
              </div>

              {orderType === 'dine_in' && (
                <div className="flex items-center space-x-1.5">
                  <select
                    value={selectedTableForOrdering || ''}
                    onChange={(e) => setSelectedTableForOrdering(Number(e.target.value) || null)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      selectedTableObj && selectedTableObj.status !== 'available'
                        ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                        : 'bg-[#ede7dc] dark:bg-[#202024] border-[#ded8ce] dark:border-[#2c2c32] text-[#111111] dark:text-white'
                    }`}
                  >
                    <option value="">Select Table...</option>
                    {tables.map((t) => {
                      const isAvail = t.status === 'available';
                      return (
                        <option 
                          key={t.id} 
                          value={t.number}
                          className={!isAvail ? 'text-gray-400 bg-gray-100 dark:bg-zinc-800' : ''}
                        >
                          {t.name} ({isAvail ? 'Available' : t.status.toUpperCase()})
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>

            {/* Warning when selected table is currently occupied / not available */}
            {orderType === 'dine_in' && selectedTableObj && selectedTableObj.status !== 'available' && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span>
                  <strong>Table #{selectedTableForOrdering}</strong> is currently <strong>{selectedTableObj.status.toUpperCase()}</strong>{selectedTableObj.activeCustomerName ? ` (${selectedTableObj.activeCustomerName})` : ''}.
                </span>
              </div>
            )}

            {/* Customer Name */}
            <div>
              <input
                type="text"
                placeholder="Customer / Table Reference"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#f7f5f0] dark:bg-[#1c1c20] border border-[#ded8ce] dark:border-[#2a2a30] text-xs font-medium text-[#111111] dark:text-white focus:outline-none"
              />
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-[180px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
              {cart.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  Cart is empty. Tap items on the left to punch orders.
                </div>
              ) : (
                cart.map((i) => (
                  <div key={i.cartId} className="pt-2 flex items-center justify-between text-xs">
                    <div className="flex-1 pr-2 truncate">
                      <div className="font-bold text-[#111111] dark:text-white truncate">
                        {i.quantity}x {i.menuItem.name}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {formatPhp(i.unitPrice)} ea
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(i.cartId, i.quantity - 1)}
                          className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="font-mono font-bold w-4 text-center">{i.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(i.cartId, i.quantity + 1)}
                          className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <span className="font-mono font-bold w-16 text-right">
                        {formatPhp(i.totalPrice)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Philippine Senior / PWD Discount Check */}
            <div className="p-3 rounded-xl bg-[#ede7dc] dark:bg-[#1c1c20] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#111111] dark:text-white">
                  Senior Citizen / PWD (20% + VAT Exemption)
                </span>
                <input
                  type="checkbox"
                  checked={isSeniorOrPwd}
                  onChange={(e) => setIsSeniorOrPwd(e.target.checked)}
                  className="w-4 h-4 accent-[#c5a880] cursor-pointer"
                />
              </div>
              {isSeniorOrPwd && (
                <input
                  type="text"
                  placeholder="OSCA / PWD ID Number..."
                  value={seniorPwdId}
                  onChange={(e) => setSeniorPwdId(e.target.value)}
                  className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-[#25252b] border border-[#ded8ce] dark:border-[#333339] text-xs text-[#111111] dark:text-white"
                />
              )}
            </div>

            {/* Payment Method Switcher */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center space-x-1.5 ${
                  paymentMethod === 'cash'
                    ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black border-[#111111]'
                    : 'bg-white dark:bg-[#1a1a1e] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Cash Tender</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('gcash')}
                className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center space-x-1.5 ${
                  paymentMethod === 'gcash'
                    ? 'bg-[#007DFE] text-white border-[#007DFE]'
                    : 'bg-white dark:bg-[#1a1a1e] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>GCash QR</span>
              </button>
            </div>

            {/* Cash Tender Presets & Change Calculator */}
            {paymentMethod === 'cash' && (
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#18181c] border border-gray-200 dark:border-gray-800 space-y-2">
                <span className="text-[10px] font-bold uppercase text-gray-500">
                  Quick Cash Preset (PHP)
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    Math.ceil(calculation.totalPayable / 50) * 50,
                    100,
                    200,
                    500,
                    1000,
                    1500,
                    2000,
                  ].filter((v, idx, arr) => arr.indexOf(v) === idx && v >= calculation.totalPayable).slice(0, 4).map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleCashTenderPreset(amt)}
                      className="py-1 rounded-lg bg-white dark:bg-[#222228] border text-xs font-mono font-bold hover:border-[#c5a880]"
                    >
                      ₱{amt}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <label className="text-[10px] text-gray-500 block">Cash Received:</label>
                    <input
                      type="number"
                      value={cashTendered || ''}
                      onChange={(e) => setCashTendered(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#222228] border font-mono text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block">Change Due:</label>
                    <div className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 pt-1.5">
                      {formatPhp(changeDue)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Total Due & Punch Order CTA */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-baseline font-bold">
                <span className="text-xs text-gray-600 dark:text-gray-300">Total Payable:</span>
                <span className="font-mono text-2xl text-[#c5a880] dark:text-[#dfcca9]">
                  {formatPhp(calculation.totalPayable)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCompleteSale}
                disabled={cart.length === 0}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-40"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Sale & Send to KDS</span>
              </button>
            </div>

          </div>

          {/* Printed Order Receipt Mini Card if recently settled */}
          {printedOrder && (
            <div className="p-4 rounded-2xl bg-white dark:bg-[#141417] border border-emerald-500/40 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sale Completed: {printedOrder.orderNumber}</span>
                </span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[10px] font-bold flex items-center space-x-1 hover:bg-gray-200"
                >
                  <Printer className="w-3 h-3" />
                  <span>Print Receipt</span>
                </button>
              </div>
              <p className="text-[11px] text-gray-500">
                Receipt #{printedOrder.paymentDetails?.receiptNumber} • Total: {formatPhp(printedOrder.total)} ({printedOrder.paymentMethod.toUpperCase()})
              </p>
            </div>
          )}

        </div>
      </div>

      {/* GCash Modal */}
      <GCashPaymentModal
        isOpen={isGCashModalOpen}
        onClose={() => setIsGCashModalOpen(false)}
        totalAmount={calculation.totalPayable}
        onPaymentSuccess={handleGCashSuccess}
      />
    </div>
  );
};
