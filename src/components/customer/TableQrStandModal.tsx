import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import { 
  X, 
  Printer, 
  ExternalLink, 
  QrCode, 
  Smartphone, 
  Check, 
  Copy
} from 'lucide-react';

interface TableQrStandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableQrStandModal: React.FC<TableQrStandModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { tables } = useApp();
  const [selectedTableNum, setSelectedTableNum] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const tableUrl = `${currentUrl}/?table=${selectedTableNum}&mode=customer_qr`;

  // Generate an authentic SVG QR Code representation with crisp data pattern
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    tableUrl
  )}&bgcolor=ffffff&color=111111&margin=10`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(tableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleOpenSimulatedCustomer = () => {
    window.open(tableUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#faf8f5] dark:bg-[#121215] w-full max-w-3xl rounded-3xl border border-[#ded8cf] dark:border-[#26262c] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e5dfd5] dark:border-[#222227] flex items-center justify-between bg-white dark:bg-[#16161a]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#c5a880]/15 text-[#9d7f57] dark:text-[#dfcca9]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111111] dark:text-[#f8f7f4]">
                Table QR Code Self-Ordering Stand
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Customers scan this stand on their table to browse the menu, see real-time sold-out items, and place orders.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Table Selector Pills */}
          <div>
            <label className="block text-xs font-brand font-bold uppercase tracking-wider text-gray-500 mb-2">
              Select Table Stand (1 - 12)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1.5">
              {tables.map((table) => {
                const isSelected = selectedTableNum === table.number;
                return (
                  <button
                    key={table.id}
                    onClick={() => setSelectedTableNum(table.number)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] border-[#111111] dark:border-[#f8f7f4] shadow-md scale-105'
                        : 'bg-white dark:bg-[#18181c] text-gray-700 dark:text-gray-300 border-[#ded8ce] dark:border-[#2a2a30] hover:border-[#c5a880]'
                    }`}
                  >
                    T-{table.number}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Printable Table Stand Preview */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#161619] border border-[#ded8cf] dark:border-[#242429] shadow-inner">
            
            {/* The Physical Table Stand Card (Printable) */}
            <div 
              id="printable-table-qr-stand"
              className="w-full max-w-[280px] bg-[#111111] text-[#fbfaf8] p-6 rounded-2xl border-2 border-[#c5a880]/60 shadow-2xl flex flex-col items-center text-center space-y-4 relative overflow-hidden"
            >
              {/* Subtle luxury glow background */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#c5a880]/15 rounded-full blur-2xl pointer-events-none"></div>

              {/* Brand Logo & Name */}
              <div className="space-y-1">
                <BrandLogo variant="stacked" size="md" showTagline={true} />
              </div>

              {/* Table Number Pill */}
              <div className="px-4 py-1.5 rounded-full bg-[#c5a880] text-black font-brand font-black text-xs uppercase tracking-[0.2em] shadow-md">
                Table {selectedTableNum < 10 ? `0${selectedTableNum}` : selectedTableNum} • Dine-In
              </div>

              {/* QR Code Container */}
              <div className="p-3 bg-white rounded-2xl shadow-lg border border-white/20">
                <img
                  src={qrSvgUrl}
                  alt={`QR Code for Table ${selectedTableNum}`}
                  className="w-36 h-36 object-contain rounded-lg"
                />
              </div>

              {/* Scan Instructions */}
              <div className="space-y-1">
                <span className="font-brand text-[11px] font-bold uppercase tracking-wider text-[#dfcca9] block">
                  Scan to View Menu & Order
                </span>
                <p className="text-[9.5px] text-gray-400 font-light leading-snug">
                  Browse specialty coffee, matcha & food. Pay via GCash or Cash at counter.
                </p>
              </div>

              <div className="text-[8.5px] text-gray-500 font-mono pt-1">
                extractionpoint.cafe • Table {selectedTableNum}
              </div>
            </div>

            {/* Actions & Live Simulation Controls */}
            <div className="flex-1 space-y-4 max-w-sm">
              <div className="space-y-2">
                <h4 className="font-brand font-bold text-sm text-[#111111] dark:text-[#f8f7f4] flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-[#c5a880]" />
                  <span>Customer Phone QR Experience</span>
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  When customers scan this QR code with their mobile phone camera:
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 list-disc list-inside">
                  <li>They enter <strong>Customer-Only Mode</strong> (staff tabs hidden).</li>
                  <li>Their order automatically locks to <strong>Table {selectedTableNum}</strong>.</li>
                  <li>Real-time <strong>Sold Out (86'd)</strong> items reflect instantly.</li>
                  <li>Placed orders immediately ring on the <strong>Kitchen KDS</strong> & <strong>POS</strong>.</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleOpenSimulatedCustomer}
                  className="w-full py-3 px-4 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] font-brand font-bold text-xs flex items-center justify-center space-x-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
                >
                  <Smartphone className="w-4 h-4 text-[#c5a880]" />
                  <span>Open Customer Phone View (New Tab)</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white dark:bg-[#1a1a1f] border border-[#ded8ce] dark:border-[#2a2a30] text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-[#c5a880] flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Table Link'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="py-2.5 px-4 rounded-xl bg-[#c5a880] text-black font-brand font-bold text-xs flex items-center space-x-1.5 hover:opacity-90 transition-opacity"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Stand</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
