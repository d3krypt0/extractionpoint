import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPhp } from '../../utils/phCurrency';
import { 
  X, 
  Trash2, 
  Plus, 
  Lightbulb, 
  CheckCircle2 
} from 'lucide-react';

interface WasteManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WasteManagementModal: React.FC<WasteManagementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { inventory, wasteLogs, logFoodWaste, deleteWasteLog } = useApp();

  const [selectedIngredientId, setSelectedIngredientId] = useState(inventory[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<'barista_error' | 'expired_spoilage' | 'spill_accident' | 'quality_rejection' | 'sampling'>('barista_error');
  const [loggedBy, setLoggedBy] = useState('Barista Shift Lead');
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const selectedItem = inventory.find((i) => i.id === selectedIngredientId) || inventory[0];
  const calculatedCost = selectedItem ? selectedItem.unitCostPhp * quantity : 0;

  const totalWasteCost = wasteLogs.reduce((sum, w) => sum + w.costPhp, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || quantity <= 0) return;

    logFoodWaste({
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      quantity,
      unit: selectedItem.unit,
      costPhp: Math.round(calculatedCost * 100) / 100,
      reason,
      loggedBy: loggedBy.trim() || 'Staff',
      notes: notes.trim() || undefined,
    });

    setSuccessMsg(true);
    setNotes('');
    setQuantity(1);
    setTimeout(() => setSuccessMsg(false), 2500);
  };

  const handleDeleteLog = (logId: string, name: string) => {
    if (window.confirm(`Delete waste record for "${name}"?`)) {
      deleteWasteLog(logId);
    }
  };

  const getReasonLabel = (r: string) => {
    switch (r) {
      case 'barista_error': return 'Barista Prep Error';
      case 'expired_spoilage': return 'Spoilage / Expired';
      case 'spill_accident': return 'Spill / Accidental Drop';
      case 'quality_rejection': return 'Quality Rejection';
      case 'sampling': return 'Staff Tasting / Calibration';
      default: return r;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-[#faf8f5] dark:bg-[#121215] rounded-2xl shadow-2xl border border-[#ded8ce] dark:border-[#26262b] overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e8e2d8] dark:border-[#222226] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-rose-500">
                Cost Control & Sustainability
              </span>
              <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-[#f8f7f4]">
                Food & Ingredient Waste Logger
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-black dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* Waste Reduction Tips Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-transparent border border-emerald-500/20 flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-gray-900 dark:text-white">
                Extraction Point Waste Minimization Best Practices
              </span>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Calibrate grinders every morning to prevent wasted espresso pucks. Use First-In, First-Out (FIFO) on barista milks and prep pasta batches based on daily lunch rush analytics.
              </p>
            </div>
          </div>

          {/* Form & Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left: Logger Form (7 cols) */}
            <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#18181c] border border-[#ded8ce] dark:border-[#28282e] space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#111111] dark:text-[#f8f7f4]">
                Log Wasted Ingredient / Portion
              </h4>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Select Ingredient */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                    Ingredient / Raw Material
                  </label>
                  <select
                    value={selectedIngredientId}
                    onChange={(e) => setSelectedIngredientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f8f6f2] dark:bg-[#202024] border border-[#ded8ce] dark:border-[#2c2c32] text-xs font-bold text-[#111111] dark:text-white"
                  >
                    {inventory.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.name} ({inv.currentStock} {inv.unit} in stock - {formatPhp(inv.unitCostPhp)}/{inv.unit})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity & Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                      Wasted Quantity ({selectedItem?.unit})
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#f8f6f2] dark:bg-[#202024] border border-[#ded8ce] dark:border-[#2c2c32] font-mono text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                      Calculated Loss (PHP)
                    </label>
                    <div className="w-full px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                      {formatPhp(calculatedCost)}
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                    Primary Reason
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f8f6f2] dark:bg-[#202024] border border-[#ded8ce] dark:border-[#2c2c32] text-xs font-medium"
                  >
                    <option value="barista_error">Barista Prep Error (Over-steamed / Shot defect)</option>
                    <option value="expired_spoilage">Spoilage / Expired Date</option>
                    <option value="spill_accident">Spill / Dropped on Floor</option>
                    <option value="quality_rejection">Quality Rejection (Uneven bake / off flavor)</option>
                    <option value="sampling">Dial-In & Recipe Calibration</option>
                  </select>
                </div>

                {/* Logged By & Notes */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                      Logged By
                    </label>
                    <input
                      type="text"
                      value={loggedBy}
                      onChange={(e) => setLoggedBy(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#f8f6f2] dark:bg-[#202024] border border-[#ded8ce] dark:border-[#2c2c32] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                      Specific Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Milk scalded at 75°C"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#f8f6f2] dark:bg-[#202024] border border-[#ded8ce] dark:border-[#2c2c32] text-xs"
                    />
                  </div>
                </div>

                {successMsg && (
                  <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center space-x-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Waste logged and stock updated automatically!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Waste & Deplete Stock</span>
                </button>
              </form>
            </div>

            {/* Right: Summary Metrics & Recent Logs (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Metric Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-[#ded8ce] dark:border-[#28282e] space-y-1">
                <span className="text-[10px] font-bold uppercase text-gray-500">
                  Total Tracked Waste Cost (PHP)
                </span>
                <div className="font-mono text-2xl font-black text-rose-600 dark:text-rose-400">
                  {formatPhp(totalWasteCost)}
                </div>
                <div className="text-[11px] text-gray-500">
                  Across {wasteLogs.length} logged incident{wasteLogs.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Waste Logs List */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#18181c] border border-[#ded8ce] dark:border-[#28282e] space-y-3">
                <h5 className="font-bold text-xs text-[#111111] dark:text-[#f8f7f4]">
                  Recent Waste Records
                </h5>
                {wasteLogs.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-400">
                    No waste recorded yet.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                    {wasteLogs.map((log) => (
                      <div key={log.id} className="pt-2 flex items-start justify-between group">
                        <div>
                          <div className="font-bold text-gray-900 dark:text-gray-100">
                            {log.quantity} {log.unit} • {log.itemName}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {getReasonLabel(log.reason)} ({log.loggedBy})
                          </div>
                          {log.notes && (
                            <div className="text-[10px] italic text-gray-400">"{log.notes}"</div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-rose-500">
                            -{formatPhp(log.costPhp)}
                          </span>
                          <button
                            onClick={() => handleDeleteLog(log.id, log.itemName)}
                            className="text-gray-400 hover:text-rose-500 transition-colors p-1"
                            title="Delete log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e8e2d8] dark:border-[#222226] bg-[#f5f1ea] dark:bg-[#16161a] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
