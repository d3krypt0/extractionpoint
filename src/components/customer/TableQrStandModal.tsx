import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  initialTableNumber?: number;
}

export const TableQrStandModal: React.FC<TableQrStandModalProps> = ({
  isOpen,
  onClose,
  initialTableNumber = 1,
}) => {
  const { tables } = useApp();
  const [selectedTableNum, setSelectedTableNum] = useState<number>(initialTableNumber);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const tableUrl = `${currentUrl}/?table=${selectedTableNum}&mode=customer_qr`;

  // High-resolution SVG QR Code with high-contrast pattern
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${encodeURIComponent(
    tableUrl
  )}&bgcolor=ffffff&color=111111&margin=12`;

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
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#e5dfd5] dark:border-[#222227] flex items-center justify-between bg-white dark:bg-[#16161a]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#c5a880]/15 text-[#9d7f57] dark:text-[#dfcca9]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#111111] dark:text-[#f8f7f4]">
                Table QR Self-Ordering Stand
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-sans">
                Scan stand to access the live menu, see real-time 86'd items, and place table orders.
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
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-brand font-bold uppercase tracking-wider text-gray-500">
                Select Table Stand (1 - 12)
              </label>
              <span className="text-[11px] font-mono text-[#c5a880] font-bold">
                Table #{selectedTableNum} Active
              </span>
            </div>
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
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-4 sm:p-6 rounded-2xl bg-[#f5f1ea] dark:bg-[#161619] border border-[#ded8cf] dark:border-[#242429]">
            
            {/* The Physical Table Stand Card (Printable with Menu Font) */}
            <div 
              id="printable-table-qr-stand"
              className="w-full max-w-[300px] bg-[#0e0e10] text-[#fbfaf8] p-6 sm:p-7 rounded-3xl border-2 border-[#c5a880]/70 shadow-2xl flex flex-col items-center text-center space-y-4 relative overflow-hidden select-none"
            >
              {/* Subtle gold ambient glow background */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#c5a880]/20 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#c5a880]/15 rounded-full blur-2xl pointer-events-none"></div>

              {/* Brand Emblem & Typography matching Menu */}
              <div className="flex flex-col items-center space-y-1.5 pt-1">
                {/* Always-crisp white emblem */}
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src="/brand/logo_cropped_white.png"
                    alt="Extraction Point"
                    className="h-full w-auto object-contain select-none filter drop-shadow-md"
                    draggable={false}
                  />
                </div>

                <div className="space-y-0.5">
                  <span className="font-brand text-[8.5px] uppercase font-bold tracking-[0.28em] text-[#c5a880] block">
                    SPECIALTY COFFEE & KITCHEN
                  </span>
                  <h3 className="font-serif text-2xl font-bold tracking-wider text-white uppercase leading-none">
                    EXTRACTION POINT
                  </h3>
                  <p className="font-serif italic text-xs text-[#ded8ce] tracking-normal pt-0.5">
                    "Your day deserves better caffeine."
                  </p>
                </div>
              </div>

              {/* Table Seated Pill Badge */}
              <div className="px-4 py-1.5 rounded-full bg-[#c5a880] text-black font-brand font-black text-[11px] uppercase tracking-[0.16em] shadow-md">
                TABLE {selectedTableNum < 10 ? `0${selectedTableNum}` : selectedTableNum} • DINE-IN
              </div>

              {/* High-Resolution QR Code Container */}
              <div className="p-3 bg-white rounded-2xl shadow-xl border-2 border-[#c5a880]/40 flex items-center justify-center">
                <img
                  src={qrSvgUrl}
                  alt={`QR Code for Table ${selectedTableNum}`}
                  className="w-40 h-40 object-contain rounded-xl"
                />
              </div>

              {/* Editorial Scan Instructions matching Menu typography */}
              <div className="space-y-1 pt-0.5">
                <h4 className="font-serif text-base sm:text-lg font-bold uppercase tracking-wider text-white">
                  SCAN TO VIEW MENU & ORDER
                </h4>
                <p className="font-serif italic text-xs text-[#dfcca9] leading-relaxed max-w-[230px] mx-auto">
                  Browse specialty espresso, matcha & kitchen menu. Pay via GCash or Cash at counter.
                </p>
              </div>

              {/* Footnote */}
              <div className="pt-2.5 border-t border-white/10 w-full flex items-center justify-between text-[9px] font-mono text-[#888888]">
                <span>extractionpoint.cafe</span>
                <span>TABLE #{selectedTableNum}</span>
              </div>
            </div>

            {/* Actions & Live Simulation Controls */}
            <div className="flex-1 space-y-4 max-w-sm">
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-base sm:text-lg text-[#111111] dark:text-[#f8f7f4] flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-[#c5a880]" />
                  <span>Customer Phone QR Experience</span>
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                  When customers scan this QR code with their mobile phone camera:
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 list-disc list-inside font-sans">
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
