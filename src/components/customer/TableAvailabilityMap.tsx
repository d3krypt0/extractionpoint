import React from 'react';
import { useApp } from '../../context/AppContext';
import { Table, TableStatus } from '../../types';
import { X, Check, Users, Coffee } from 'lucide-react';

interface TableAvailabilityMapProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTable?: (tableNumber: number) => void;
  selectedTableNumber?: number | null;
}

export const TableAvailabilityMap: React.FC<TableAvailabilityMapProps> = ({
  isOpen,
  onClose,
  onSelectTable,
  selectedTableNumber,
}) => {
  const { tables } = useApp();

  if (!isOpen) return null;

  const indoorTables = tables.filter((t) => t.section === 'indoor');
  const patioTables = tables.filter((t) => t.section === 'patio');
  const barTables = tables.filter((t) => t.section === 'bar');

  const availableCount = tables.filter((t) => t.status === 'available').length;
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/25';
      case 'occupied':
        return 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-400 cursor-not-allowed';
      case 'reserved':
        return 'bg-purple-500/15 border-purple-500/30 text-purple-700 dark:text-purple-400 cursor-not-allowed';
      case 'cleaning':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-400';
    }
  };

  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Available</span>;
      case 'occupied':
        return <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">Occupied</span>;
      case 'reserved':
        return <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">Reserved</span>;
      case 'cleaning':
        return <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Sanitizing</span>;
    }
  };

  const renderTableCard = (table: Table) => {
    const isSelected = selectedTableNumber === table.number;
    const isAvailable = table.status === 'available';

    return (
      <div
        key={table.id}
        onClick={() => {
          if (isAvailable && onSelectTable) {
            onSelectTable(table.number);
            onClose();
          }
        }}
        className={`relative p-3.5 rounded-xl border flex flex-col justify-between transition-all select-none ${
          isSelected
            ? 'ring-2 ring-[#c5a880] border-[#c5a880] bg-[#c5a880]/15'
            : getStatusColor(table.status)
        } ${isAvailable ? 'cursor-pointer hover:scale-[1.02] shadow-sm' : ''}`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="font-serif font-bold text-sm text-[#111111] dark:text-[#f8f7f4]">
              {table.name}
            </span>
            <div className="flex items-center space-x-1 text-[11px] text-[#666666] dark:text-[#a0a0a5] mt-0.5">
              <Users className="w-3 h-3" />
              <span>{table.capacity} seats</span>
            </div>
          </div>
          {getStatusBadge(table.status)}
        </div>

        {table.status === 'occupied' && table.activeCustomerName && (
          <div className="mt-2 text-[10px] font-medium text-[#777777] dark:text-[#888890] truncate">
            Guest: {table.activeCustomerName}
          </div>
        )}

        {isAvailable && onSelectTable && (
          <div className="mt-2.5 pt-2 border-t border-emerald-500/20 flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              {isSelected ? 'Selected' : 'Tap to Sit Here'}
            </span>
            {isSelected && <Check className="w-3.5 h-3.5 text-[#c5a880]" />}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-[#faf8f5] dark:bg-[#121215] rounded-2xl shadow-2xl border border-[#ded8ce] dark:border-[#26262b] overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#e8e2d8] dark:border-[#222226] flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Coffee className="w-4 h-4 text-[#c5a880]" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#c5a880] dark:text-[#dfcca9]">
                Live Floor Plan
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-[#f8f7f4] mt-0.5">
              Extraction Point Table Availability
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#777777] dark:text-[#999999] hover:bg-[#eae4db] dark:hover:bg-[#222226] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-5 py-3 bg-[#ede7dc] dark:bg-[#18181c] border-b border-[#ded8ce] dark:border-[#26262b] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-[#444444] dark:text-[#c0c0c8]">
                <strong>{availableCount}</strong> Available
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-[#444444] dark:text-[#c0c0c8]">
                <strong>{occupiedCount}</strong> Occupied
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span className="text-[#444444] dark:text-[#c0c0c8]">Reserved</span>
            </div>
          </div>
          <div className="text-[11px] text-[#666666] dark:text-[#888890] italic">
            Updates in real-time across devices
          </div>
        </div>

        {/* Floor Plan Sections */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          
          {/* Indoor Main Lounge */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif font-bold text-sm text-[#111111] dark:text-[#f8f7f4]">
                Indoor Main Hall (Airconditioned)
              </h4>
              <span className="text-[11px] text-[#777777] dark:text-[#999999]">6 Tables</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {indoorTables.map(renderTableCard)}
            </div>
          </div>

          {/* Espresso Bar Counter */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif font-bold text-sm text-[#111111] dark:text-[#f8f7f4]">
                Espresso Bar Counter (Solo Seats)
              </h4>
              <span className="text-[11px] text-[#777777] dark:text-[#999999]">3 Bar Stools</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {barTables.map(renderTableCard)}
            </div>
          </div>

          {/* Patio Garden */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif font-bold text-sm text-[#111111] dark:text-[#f8f7f4]">
                Outdoor Patio & Garden
              </h4>
              <span className="text-[11px] text-[#777777] dark:text-[#999999]">3 Tables</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {patioTables.map(renderTableCard)}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e8e2d8] dark:border-[#222226] bg-[#f5f1ea] dark:bg-[#16161a] flex items-center justify-between text-xs">
          <span className="text-[#666666] dark:text-[#9999a0]">
            {selectedTableNumber
              ? `Currently seated at Table #${selectedTableNumber}`
              : 'Dine-in guests can select an available table to receive order directly.'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
