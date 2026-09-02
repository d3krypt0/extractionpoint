import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderType } from '../../types';
import { formatPhp, calculatePhilippineTaxesAndDiscounts } from '../../utils/phCurrency';
import { GCashPaymentModal } from './GCashPaymentModal';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Utensils, 
  ShoppingBag as BagIcon, 
  CreditCard, 
  Banknote, 
  ShieldCheck,
  Flame
} from 'lucide-react';

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTableMap?: () => void;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({
  isOpen,
  onClose,
  onOpenTableMap,
}) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotals,
    placeOrder,
    tables,
    selectedTableForOrdering,
    setSelectedTableForOrdering,
    setActiveView,
  } = useApp();

  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'cash'>('gcash');
  
  // Philippine Senior / PWD Discount
  const [isSeniorOrPwd, setIsSeniorOrPwd] = useState(false);
  const [seniorPwdId, setSeniorPwdId] = useState('');

  const [isRush, setIsRush] = useState(false);
  const [notes, setNotes] = useState('');
  const [isGCashModalOpen, setIsGCashModalOpen] = useState(false);

  if (!isOpen) return null;

  const discountType = isSeniorOrPwd ? 'senior_pwd' : 'none';
  const calculation = calculatePhilippineTaxesAndDiscounts(cartTotals.subtotal, discountType);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (orderType === 'dine_in') {
      if (!selectedTableForOrdering) {
        alert('Please select your table number for dine-in.');
        return;
      }
      const targetTable = tables.find((t) => t.number === selectedTableForOrdering);
      if (targetTable && targetTable.status !== 'available') {
        alert(`Table #${selectedTableForOrdering} is currently ${targetTable.status.toUpperCase()}. Please choose an available table.`);
        return;
      }
    }

    if (paymentMethod === 'gcash') {
      setIsGCashModalOpen(true);
    } else {
      // Cash at counter
      placeOrder({
        type: orderType,
        tableNumber: orderType === 'dine_in' ? selectedTableForOrdering || undefined : undefined,
        customerName: customerName.trim() || 'Guest Customer',
        customerPhone: customerPhone.trim() || undefined,
        paymentMethod: 'cash',
        discountType,
        seniorPwdId: isSeniorOrPwd ? seniorPwdId : undefined,
        isRush,
        notes: notes.trim() || undefined,
      });
      onClose();
      setActiveView('tracker');
    }
  };

  const handleGCashSuccess = (details: { gcashRef: string; gcashMobile: string }) => {
    setIsGCashModalOpen(false);
    if (orderType === 'dine_in' && selectedTableForOrdering) {
      const targetTable = tables.find((t) => t.number === selectedTableForOrdering);
      if (targetTable && targetTable.status !== 'available') {
        alert(`Table #${selectedTableForOrdering} is currently ${targetTable.status.toUpperCase()}. Please choose an available table.`);
        return;
      }
    }

    placeOrder({
      type: orderType,
      tableNumber: orderType === 'dine_in' ? selectedTableForOrdering || undefined : undefined,
      customerName: customerName.trim() || 'Guest Customer',
      customerPhone: customerPhone.trim() || details.gcashMobile,
      paymentMethod: 'gcash',
      paymentDetails: {
        gcashRef: details.gcashRef,
        gcashMobile: details.gcashMobile,
      },
      discountType,
      seniorPwdId: isSeniorOrPwd ? seniorPwdId : undefined,
      isRush,
      notes: notes.trim() || undefined,
    });
    onClose();
    setActiveView('tracker');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
        <div 
          className="relative w-full max-w-2xl bg-[#faf8f5] dark:bg-[#121215] rounded-2xl shadow-2xl border border-[#ded8ce] dark:border-[#26262b] overflow-hidden max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-[#e8e2d8] dark:border-[#222226] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-[#c5a880]/15 text-[#9d7f57] dark:text-[#dfcca9]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-[#f8f7f4]">
                  Your Order Summary
                </h3>
                <span className="text-xs text-[#777777] dark:text-[#9999a0]">
                  {cartTotals.itemCount} item{cartTotals.itemCount !== 1 ? 's' : ''} in cart
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#777777] dark:text-[#999999] hover:bg-[#eae4db] dark:hover:bg-[#222226] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm">
            
            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-[#ded8ce] dark:border-[#28282e] space-y-2">
                <ShoppingBag className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="text-sm font-medium text-gray-500">Your shopping cart is empty</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-4 py-2 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black font-bold text-xs"
                >
                  Explore Extraction Point Menu
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#555555] dark:text-[#a0a0a5]">
                    Selected Items
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-500 hover:underline flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {cart.map((item) => (
                    <div
                      key={item.cartId}
                      className="p-3.5 rounded-xl bg-white dark:bg-[#18181c] border border-[#ded8ce] dark:border-[#28282e] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
                          <h4 className="font-bold text-sm text-[#111111] dark:text-[#f8f7f4]">
                            {item.menuItem.name}
                          </h4>
                          <span className="font-mono text-xs font-bold text-[#c5a880]">
                            {formatPhp(item.unitPrice)} ea
                          </span>
                        </div>

                        {/* Modifiers summary */}
                        <div className="text-[11px] text-[#777777] dark:text-[#9999a0] mt-1 space-x-2 flex flex-wrap">
                          {item.customization.temperature && (
                            <span className="capitalize">{item.customization.temperature}</span>
                          )}
                          {item.customization.sweetness !== undefined && (
                            <span>• {item.customization.sweetness}% sugar</span>
                          )}
                          {item.customization.milk && item.customization.milk !== 'regular' && (
                            <span>• {item.customization.milk} milk (+₱50)</span>
                          )}
                          {item.customization.extraEspressoShots ? (
                            <span>• +{item.customization.extraEspressoShots} shot(s) (+₱{item.customization.extraEspressoShots * 80})</span>
                          ) : null}
                          {item.customization.addEspressoShot && (
                            <span>• + Dirty Shot (+₱80)</span>
                          )}
                          {item.customization.specialInstructions && (
                            <span className="italic">• "{item.customization.specialInstructions}"</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
                        <div className="flex items-center space-x-1.5 bg-[#f0ebe3] dark:bg-[#202024] p-1 rounded-xl border border-[#ded8ce] dark:border-[#2a2a30]">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 inline-flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 active:scale-95 transition-all"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono font-bold text-xs w-6 text-center text-[#111111] dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 inline-flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 active:scale-95 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-mono font-bold text-xs text-[#111111] dark:text-[#f8f7f4] w-20 text-right">
                          {formatPhp(item.totalPrice)}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cartId)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Details Form */}
            {cart.length > 0 && (
              <form onSubmit={handleCheckout} className="space-y-4 pt-2">
                
                {/* Dining Option: Dine-In vs Takeaway */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] dark:text-[#a0a0a5] mb-2">
                    Dining Option
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType('dine_in')}
                      className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl border font-bold text-xs transition-all ${
                        orderType === 'dine_in'
                          ? 'border-[#111111] dark:border-[#f8f7f4] bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black shadow-sm'
                          : 'border-[#ded8ce] dark:border-[#2a2a30] text-[#555555] dark:text-[#a0a0a5] hover:bg-[#ede7dc]/40'
                      }`}
                    >
                      <Utensils className="w-4 h-4" />
                      <span>Dine-In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('takeaway')}
                      className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl border font-bold text-xs transition-all ${
                        orderType === 'takeaway'
                          ? 'border-[#111111] dark:border-[#f8f7f4] bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black shadow-sm'
                          : 'border-[#ded8ce] dark:border-[#2a2a30] text-[#555555] dark:text-[#a0a0a5] hover:bg-[#ede7dc]/40'
                      }`}
                    >
                      <BagIcon className="w-4 h-4" />
                      <span>Takeaway (To-Go)</span>
                    </button>
                  </div>
                </div>

                {/* Table Selector for Dine-In */}
                {orderType === 'dine_in' && (
                  <div className="p-3.5 rounded-xl bg-[#ede7dc] dark:bg-[#18181c] border border-[#ded8ce] dark:border-[#26262b] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#111111] dark:text-[#f8f7f4]">
                        Table Assignment:
                      </span>
                      <p className="text-[11px] text-[#777777] dark:text-[#9999a0]">
                        {selectedTableForOrdering
                          ? `Table #${selectedTableForOrdering} selected`
                          : 'Select an available table'}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedTableForOrdering || ''}
                        onChange={(e) => setSelectedTableForOrdering(Number(e.target.value) || null)}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#202024] border border-[#ded8ce] dark:border-[#2c2c32] text-xs font-bold text-[#111111] dark:text-white"
                      >
                        <option value="">Choose Table...</option>
                        {tables.map((tbl) => {
                          const isAvail = tbl.status === 'available';
                          return (
                            <option key={tbl.id} value={tbl.number} disabled={!isAvail}>
                              {tbl.name} ({tbl.capacity}pax) — {isAvail ? 'Available' : `[${tbl.status.toUpperCase()}]`}
                            </option>
                          );
                        })}
                      </select>

                      {onOpenTableMap && (
                        <button
                          type="button"
                          onClick={onOpenTableMap}
                          className="px-2.5 py-1.5 rounded-lg bg-[#c5a880] text-black font-bold text-xs hover:bg-[#d5baa0] transition-colors"
                        >
                          Map
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Customer Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#555555] dark:text-[#a0a0a5] mb-1">
                      Guest Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maria Santos"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#18181c] border border-[#ded8ce] dark:border-[#2a2a30] text-xs text-[#111111] dark:text-[#f8f7f4] focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#555555] dark:text-[#a0a0a5] mb-1">
                      Contact Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="0917-xxx-xxxx"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#18181c] border border-[#ded8ce] dark:border-[#2a2a30] text-xs text-[#111111] dark:text-[#f8f7f4] focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>

                {/* Philippine Senior Citizen / PWD 20% Discount */}
                <div className="p-3.5 rounded-xl bg-[#ede7dc] dark:bg-[#18181c] border border-[#ded8ce] dark:border-[#26262b] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
                      <span className="text-xs font-bold text-[#111111] dark:text-[#f8f7f4]">
                        Senior Citizen / PWD Discount (RA 9994 / RA 10754)
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSeniorOrPwd}
                      onChange={(e) => setIsSeniorOrPwd(e.target.checked)}
                      className="w-4 h-4 accent-[#c5a880] rounded cursor-pointer"
                    />
                  </div>

                  {isSeniorOrPwd && (
                    <div className="pt-2 border-t border-[#ded8cf] dark:border-[#28282e] animate-fadeIn">
                      <label className="block text-[10px] font-bold uppercase text-[#666666] dark:text-[#9999a0] mb-1">
                        OSCA Senior ID or PWD ID Number
                      </label>
                      <input
                        type="text"
                        required={isSeniorOrPwd}
                        placeholder="e.g. SC-NCR-2024-98765"
                        value={seniorPwdId}
                        onChange={(e) => setSeniorPwdId(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#202024] border border-[#ded8ce] dark:border-[#2c2c32] text-xs text-[#111111] dark:text-white focus:outline-none focus:border-[#c5a880]"
                      />
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">
                        ✓ 20% Discount applied + 12% VAT Exemption as mandated by Philippine Law.
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] dark:text-[#a0a0a5] mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('gcash')}
                      className={`flex items-center justify-center space-x-2 py-3 rounded-xl border font-bold text-xs transition-all ${
                        paymentMethod === 'gcash'
                          ? 'border-[#007DFE] bg-[#007DFE] text-white shadow-sm'
                          : 'border-[#ded8ce] dark:border-[#2a2a30] text-[#555555] dark:text-[#a0a0a5] hover:bg-[#ede7dc]/40'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>GCash Mobile QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex items-center justify-center space-x-2 py-3 rounded-xl border font-bold text-xs transition-all ${
                        paymentMethod === 'cash'
                          ? 'border-[#111111] dark:border-[#f8f7f4] bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black shadow-sm'
                          : 'border-[#ded8ce] dark:border-[#2a2a30] text-[#555555] dark:text-[#a0a0a5] hover:bg-[#ede7dc]/40'
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      <span>Cash at Counter</span>
                    </button>
                  </div>
                </div>

                {/* Rush & Special Order Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#ede7dc] dark:bg-[#18181c] border border-[#ded8ce] dark:border-[#26262b]">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-rose-500" />
                      <span className="text-xs font-bold text-[#111111] dark:text-[#f8f7f4]">
                        Mark as Rush Order
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isRush}
                      onChange={(e) => setIsRush(e.target.checked)}
                      className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Special order notes for kitchen..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full h-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#18181c] border border-[#ded8ce] dark:border-[#2a2a30] text-xs text-[#111111] dark:text-[#f8f7f4] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#18181c] border border-[#ded8ce] dark:border-[#26262b] space-y-2 text-xs">
                  <div className="flex justify-between text-[#666666] dark:text-[#9999a0]">
                    <span>Gross Subtotal:</span>
                    <span className="font-mono">{formatPhp(calculation.subtotalGross)}</span>
                  </div>

                  {calculation.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Senior / PWD 20% Discount:</span>
                      <span className="font-mono">-{formatPhp(calculation.discountAmount)}</span>
                    </div>
                  )}

                  {calculation.vatExemptSales > 0 ? (
                    <div className="flex justify-between text-[#666666] dark:text-[#9999a0]">
                      <span>VAT-Exempt Sales:</span>
                      <span className="font-mono">{formatPhp(calculation.vatExemptSales)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-[#666666] dark:text-[#9999a0]">
                        <span>VATable Sales (Net of 12%):</span>
                        <span className="font-mono">{formatPhp(calculation.vatableSales)}</span>
                      </div>
                      <div className="flex justify-between text-[#666666] dark:text-[#9999a0]">
                        <span>12% VAT:</span>
                        <span className="font-mono">{formatPhp(calculation.vatAmount)}</span>
                      </div>
                    </>
                  )}

                  <div className="pt-2 border-t border-[#ded8cf] dark:border-[#28282e] flex justify-between items-baseline text-sm font-bold text-[#111111] dark:text-[#f8f7f4]">
                    <span>Total Amount Payable:</span>
                    <span className="font-mono text-xl text-[#c5a880] dark:text-[#dfcca9]">
                      {formatPhp(calculation.totalPayable)}
                    </span>
                  </div>
                </div>

                {/* Submit Checkout Button */}
                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-[0.98] ${
                    paymentMethod === 'gcash'
                      ? 'bg-[#007DFE] text-white hover:bg-[#006bd9]'
                      : 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] hover:opacity-90'
                  }`}
                >
                  {paymentMethod === 'gcash' ? (
                    <>
                      <span>Pay with GCash</span>
                      <span className="font-mono">({formatPhp(calculation.totalPayable)})</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order & Pay Cash at Counter</span>
                      <span className="font-mono">({formatPhp(calculation.totalPayable)})</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      </div>

      {/* GCash Modal */}
      <GCashPaymentModal
        isOpen={isGCashModalOpen}
        onClose={() => setIsGCashModalOpen(false)}
        totalAmount={calculation.totalPayable}
        onPaymentSuccess={handleGCashSuccess}
      />
    </>
  );
};
