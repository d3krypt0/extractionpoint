import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { 
  Clock, 
  CheckCircle2, 
  Flame, 
  Utensils, 
  ShoppingBag, 
  Check, 
  ArrowRight, 
  RotateCcw
} from 'lucide-react';

interface OrderTicketCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onToggleItemCheck: (orderId: string, cartId: string) => void;
}

export const OrderTicketCard: React.FC<OrderTicketCardProps> = ({
  order,
  onUpdateStatus,
  onToggleItemCheck,
}) => {
  const [elapsedMins, setElapsedMins] = useState(0);
  const [elapsedSecs, setElapsedSecs] = useState(0);

  useEffect(() => {
    const calc = () => {
      const start = order.prepStartedAt || order.createdAt;
      const totalSecs = Math.floor((Date.now() - start) / 1000);
      setElapsedMins(Math.floor(totalSecs / 60));
      setElapsedSecs(totalSecs % 60);
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [order]);

  // Color threshold: Green < 5m, Amber 5-10m, Red > 10m
  const isOverdue = elapsedMins >= 10;
  const isWarning = elapsedMins >= 5 && elapsedMins < 10;

  const timerColor = isOverdue
    ? 'bg-rose-500 text-white animate-pulse'
    : isWarning
    ? 'bg-amber-500 text-black font-bold'
    : 'bg-emerald-600/90 text-white';

  return (
    <div
      className={`rounded-2xl border flex flex-col justify-between overflow-hidden transition-all shadow-md ${
        order.isRush
          ? 'ring-2 ring-rose-500 bg-[#fffdfa] dark:bg-[#181515] border-rose-400'
          : order.status === 'ready'
          ? 'border-emerald-500/50 bg-[#f9fdfa] dark:bg-[#131a15]'
          : 'border-[#ded8ce] dark:border-[#2a2a30] bg-white dark:bg-[#151518]'
      }`}
    >
      {/* Ticket Header */}
      <div className="p-3.5 sm:p-4 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-lg sm:text-xl font-black text-[#111111] dark:text-[#f8f7f4]">
              {order.orderNumber}
            </span>
            {order.isRush && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white flex items-center space-x-1 animate-bounce">
                <Flame className="w-3 h-3" />
                <span>RUSH</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
            <div className="flex items-center space-x-1 font-bold text-gray-800 dark:text-gray-200">
              {order.type === 'dine_in' ? (
                <>
                  <Utensils className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Table #{order.tableNumber || 'N/A'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Takeaway</span>
                </>
              )}
            </div>
            <span>•</span>
            <span className="truncate max-w-[120px]">{order.customerName}</span>
          </div>
        </div>

        {/* Live Elapsed Timer */}
        <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center space-x-1 shadow-sm ${timerColor}`}>
          <Clock className="w-3.5 h-3.5" />
          <span>
            {elapsedMins}:{elapsedSecs.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Ticket Items Checklist */}
      <div className="p-3.5 sm:p-4 space-y-2.5 flex-1 overflow-y-auto max-h-[300px]">
        {(order.items || []).map((item) => {
          const isDone = Boolean(order.itemStatuses && order.itemStatuses[item.cartId]);
          const itemName = item?.menuItem?.name || 'Item';
          const categoryName = item?.menuItem?.category ? item.menuItem.category.replace('_', ' ') : 'Specialty';

          return (
            <div
              key={item.cartId}
              onClick={() => onToggleItemCheck(order.id, item.cartId)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none flex items-start space-x-2.5 ${
                isDone
                  ? 'bg-gray-100/70 dark:bg-zinc-900/60 border-gray-200 dark:border-gray-800 opacity-60'
                  : 'bg-[#faf8f5] dark:bg-[#1a1a1f] border-[#e8e2d8] dark:border-[#2a2a32] hover:border-[#c5a880]'
              }`}
            >
              {/* Checkbox */}
              <div className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isDone
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-gray-400 bg-white dark:bg-gray-800'
              }`}>
                {isDone && <Check className="w-3.5 h-3.5" />}
              </div>

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold text-[#111111] dark:text-[#f8f7f4] ${
                    isDone ? 'line-through text-gray-500' : ''
                  }`}>
                    {item.quantity}x {itemName}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-[#c5a880]">
                    {categoryName}
                  </span>
                </div>

                {/* Modifiers */}
                <div className="text-[11px] text-gray-600 dark:text-gray-400 space-x-1.5 flex flex-wrap mt-0.5">
                  {item.customization?.temperature && (
                    <span className="font-semibold capitalize text-blue-500 dark:text-blue-400">
                      [{item.customization.temperature}]
                    </span>
                  )}
                  {item.customization?.sweetness !== undefined && (
                    <span>Sugar: {item.customization.sweetness}%</span>
                  )}
                  {item.customization?.milk && item.customization.milk !== 'regular' && (
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      Milk: {item.customization.milk.toUpperCase()}
                    </span>
                  )}
                  {item.customization?.extraEspressoShots ? (
                    <span className="font-bold text-red-600 dark:text-red-400">
                      +{item.customization.extraEspressoShots} SHOT
                    </span>
                  ) : null}
                  {item.customization?.specialInstructions && (
                    <span className="italic text-purple-600 dark:text-purple-400 font-medium">
                      Note: "{item.customization.specialInstructions}"
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {order.notes && (
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300">
            <strong>Order Note:</strong> {order.notes}
          </div>
        )}
      </div>

      {/* Ticket Action Footer */}
      <div className="p-3 sm:p-4 border-t border-gray-100 dark:border-gray-800 bg-[#f5f1ea] dark:bg-[#16161a] flex items-center justify-between gap-2">
        {order.status === 'placed' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'in_prep')}
            className="w-full py-2.5 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] font-bold text-xs flex items-center justify-center space-x-1.5 hover:opacity-90 active:scale-98 transition-all"
          >
            <span>Start Brewing / Prep</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {order.status === 'in_prep' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'ready')}
            className="w-full py-2.5 rounded-xl bg-[#c5a880] text-black font-black text-xs flex items-center justify-center space-x-1.5 hover:bg-[#d5baa0] active:scale-98 transition-all shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Ready for Serving</span>
          </button>
        )}

        {order.status === 'ready' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'served')}
            className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center space-x-1.5 hover:bg-emerald-700 active:scale-98 transition-all shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Bump & Complete Order</span>
          </button>
        )}

        {(order.status === 'served' || order.status === 'completed') && (
          <button
            onClick={() => onUpdateStatus(order.id, 'in_prep')}
            className="w-full py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold flex items-center justify-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recall Order Ticket</span>
          </button>
        )}
      </div>
    </div>
  );
};
