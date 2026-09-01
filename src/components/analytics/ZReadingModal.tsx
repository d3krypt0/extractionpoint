import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ZReadingReport } from '../../types';
import { formatPhp } from '../../utils/phCurrency';
import { X, Printer, CheckCircle2, Receipt } from 'lucide-react';

interface ZReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZReadingModal: React.FC<ZReadingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { generateZReading, orders } = useApp();

  const [cashierName, setCashierName] = useState('Senior Barista / Supervisor');
  const [beginningCash, setBeginningCash] = useState<number>(2000);
  const [actualCash, setActualCash] = useState<number>(0);
  const [activeReport, setActiveReport] = useState<ZReadingReport | null>(null);

  if (!isOpen) return null;

  const currentCashSales = orders
    .filter((o) => o.paymentMethod === 'cash')
    .reduce((sum, o) => sum + o.total, 0);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const rep = generateZReading(cashierName, actualCash, beginningCash);
    setActiveReport(rep);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#faf8f5] dark:bg-[#121215] rounded-2xl shadow-2xl border border-[#ded8ce] dark:border-[#26262b] overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e8e2d8] dark:border-[#222226] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#c5a880]/15 text-[#9d7f57] dark:text-[#dfcca9]">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#c5a880]">
                BIR Philippine Compliance
              </span>
              <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-[#f8f7f4]">
                Daily Z-Reading & Shift End Report
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

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* Shift Close Form if not generated */}
          {!activeReport ? (
            <form onSubmit={handleGenerate} className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#18181c] border border-[#ded8ce] dark:border-[#26262b] space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#111111] dark:text-white">
                Perform Shift Reconciliation
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                    Supervisor / Cashier Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cashierName}
                    onChange={(e) => setCashierName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f8f6f2] dark:bg-[#202024] border text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                    Beginning Cash Float (PHP)
                  </label>
                  <input
                    type="number"
                    required
                    value={beginningCash}
                    onChange={(e) => setBeginningCash(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#f8f6f2] dark:bg-[#202024] border font-mono text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                  Actual Counted Cash on Hand in Drawer (PHP)
                </label>
                <input
                  type="number"
                  required
                  placeholder={String(beginningCash + currentCashSales)}
                  value={actualCash || ''}
                  onChange={(e) => setActualCash(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f2] dark:bg-[#202024] border font-mono text-base font-bold text-[#111111] dark:text-white"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Expected Cash: {formatPhp(beginningCash + currentCashSales)} (Float + Cash Sales)
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] font-bold text-xs hover:opacity-90 transition-all shadow-md"
              >
                Generate Official Z-Reading Report
              </button>
            </form>
          ) : (
            /* Official BIR-Style Printable Z-Reading Slip */
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Z-Reading Generated Successfully</span>
                </span>

                <div className="flex space-x-2">
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black font-bold text-xs flex items-center space-x-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Z-Report</span>
                  </button>
                  <button
                    onClick={() => setActiveReport(null)}
                    className="px-3 py-1.5 rounded-xl border text-xs font-bold text-gray-600 dark:text-gray-300"
                  >
                    Re-Calculate
                  </button>
                </div>
              </div>

              {/* Thermal Tape Mock */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#18181c] border-2 border-dashed border-[#ded8ce] dark:border-[#333338] font-mono text-xs text-[#111111] dark:text-[#f0f0f4] space-y-2 select-text">
                <div className="text-center pb-3 border-b border-dashed border-gray-300 dark:border-gray-700">
                  <div className="font-bold text-sm uppercase tracking-wider">EXTRACTION POINT CAFE</div>
                  <div>TIN: 432-876-109-00000 VAT REG</div>
                  <div>BOHOL / CEBU, PHILIPPINES</div>
                  <div className="font-bold text-xs uppercase pt-1">*** OFFICIAL Z-READING REPORT ***</div>
                </div>

                <div className="flex justify-between">
                  <span>Report ID:</span>
                  <span>{activeReport.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{activeReport.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cashier / Supervisor:</span>
                  <span>{activeReport.closedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction Count:</span>
                  <span>{activeReport.totalOrdersCount} orders</span>
                </div>

                <div className="py-2 border-t border-b border-dashed border-gray-300 dark:border-gray-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Beginning Cash Float:</span>
                    <span>{formatPhp(activeReport.beginningCash)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>GROSS SALES:</span>
                    <span>{formatPhp(activeReport.grossSales)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>VATable Sales (Net):</span>
                    <span>{formatPhp(activeReport.vatableSales)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>12% VAT Collected:</span>
                    <span>{formatPhp(activeReport.vatAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>VAT-Exempt Sales:</span>
                    <span>{formatPhp(activeReport.vatExemptSales)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Senior / PWD Discounts:</span>
                    <span>-{formatPhp(activeReport.seniorPwdDiscounts)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm pt-1 border-t border-dashed border-gray-200 dark:border-gray-700">
                    <span>NET SALES:</span>
                    <span>{formatPhp(activeReport.netSales)}</span>
                  </div>
                </div>

                <div className="py-2 border-b border-dashed border-gray-300 dark:border-gray-700 space-y-1">
                  <div className="font-bold text-[11px] uppercase">PAYMENT BREAKDOWN:</div>
                  <div className="flex justify-between text-[#007DFE]">
                    <span>GCash E-Wallet Total:</span>
                    <span>{formatPhp(activeReport.gcashTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cash Sales Total:</span>
                    <span>{formatPhp(activeReport.cashTotal)}</span>
                  </div>
                </div>

                <div className="pt-1 space-y-1 font-bold">
                  <div className="flex justify-between">
                    <span>Expected Cash in Drawer:</span>
                    <span>{formatPhp(activeReport.cashOnHandExpected)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actual Counted Cash:</span>
                    <span>{formatPhp(activeReport.cashOnHandActual)}</span>
                  </div>
                  <div className={`flex justify-between text-sm pt-1 border-t border-dashed ${
                    activeReport.discrepancy < 0 ? 'text-red-500' : activeReport.discrepancy > 0 ? 'text-blue-500' : 'text-emerald-500'
                  }`}>
                    <span>OVER / (SHORT):</span>
                    <span>{formatPhp(activeReport.discrepancy)}</span>
                  </div>
                </div>

                <div className="text-center pt-4 text-[10px] text-gray-500 border-t border-dashed border-gray-300 dark:border-gray-700 space-y-1">
                  <div>END OF SHIFT Z-READING ACKNOWLEDGED</div>
                  <div>Certified Correct by Manager / Supervisor</div>
                </div>
              </div>
            </div>
          )}

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
