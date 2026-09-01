import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Table, TableStatus } from '../../types';
import { 
  X, 
  Check, 
  Users, 
  Coffee, 
  CheckCircle2
} from 'lucide-react';

interface TableAvailabilityMapProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTable?: (tableNumber: number) => void;
  selectedTableNumber?: number | null;
}

const STATUS_OPTIONS: { id: TableStatus; label: string; color: string }[] = [
  { id: 'available', label: 'Available', color: 'bg-emerald-500 text-white' },
  { id: 'occupied', label: 'Occupied', color: 'bg-rose-500 text-white' },
  { id: 'reserved', label: 'Reserved', color: 'bg-purple-500 text-white' },
  { id: 'cleaning', label: 'Sanitizing', color: 'bg-amber-500 text-white' },
];

export const TableAvailabilityMap: React.FC<TableAvailabilityMapProps> = ({
  isOpen,
  onClose,
  onSelectTable,
  selectedTableNumber,
}) => {
  const { tables, updateTableStatus } = useApp();
  const [editingTableId, setEditingTableId] = useState<string | null>(null);

  if (!isOpen) return null;

  const indoorTables = tables.filter((t) => t.section === 'indoor');
  const patioTables = tables.filter((t) => t.section === 'patio');
  const barTables = tables.filter((t) => t.section === 'bar');

  const availableCount = tables.filter((t) => t.status === 'available').length;
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const sanitizingCount = tables.filter((t) => t.status === 'cleaning').length;
  const reservedCount = tables.filter((t) => t.status === 'reserved').length;

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:border-emerald-500';
      case 'occupied':
        return 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400';
      case 'reserved':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-400';
      case 'cleaning':
        return 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-400';
    }
  };

  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">Available</span>;
      case 'occupied':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-700 dark:text-rose-300">Occupied</span>;
      case 'reserved':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300">Reserved</span>;
      case 'cleaning':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">Sanitizing</span>;
    }
  };

  const handleQuickStatusChange = (table: Table, nextStatus: TableStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    updateTableStatus(table.id, nextStatus);
    setEditingTableId(null);
  };

  const handleMarkAllSanitizedAsAvailable = () => {
    tables.forEach((t) => {
      if (t.status === 'cleaning') {
        updateTableStatus(t.id, 'available');
      }
    });
  };

  const renderTableCard = (table: Table) => {
    const isSelected = selectedTableNumber === table.number;
    const isAvailable = table.status === 'available';
    const isCleaning = table.status === 'cleaning';
    const isEditing = editingTableId === table.id;

    return (
      <div
        key={table.id}
        className={`relative p-4 rounded-2xl border flex flex-col justify-between transition-all shadow-sm ${
          isSelected
            ? 'ring-2 ring-[#c5a880] border-[#c5a880] bg-[#c5a880]/15'
            : getStatusColor(table.status)
        }`}
      >
        <div>
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div>
              <span className="font-serif font-bold text-base text-[#111111] dark:text-[#f8f7f4]">
                {table.name}
              </span>
              <div className="flex items-center space-x-1 text-xs text-[#666666] dark:text-[#a0a0a5] mt-0.5">
                <Users className="w-3 h-3" />
                <span>{table.capacity} seats</span>
              </div>
            </div>

            {/* Clickable Status Badge to open quick selector */}
            <button
              onClick={() => setEditingTableId(isEditing ? null : table.id)}
              className="hover:scale-105 transition-transform"
              title="Click to change table status"
            >
              {getStatusBadge(table.status)}
            </button>
          </div>

          {table.status === 'occupied' && table.activeCustomerName && (
            <div className="mt-2 text-xs font-medium text-[#777777] dark:text-[#888890] truncate">
              Guest: {table.activeCustomerName}
            </div>
          )}
        </div>

        {/* Quick Staff Action Bar */}
        <div className="mt-3.5 pt-2.5 border-t border-black/5 dark:border-white/5 space-y-2">
          {/* If Sanitizing: One-Click "Mark Available" */}
          {isCleaning && (
            <button
              type="button"
              onClick={(e) => handleQuickStatusChange(table, 'available', e)}
              className="w-full py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Sanitized & Available</span>
            </button>
          )}

          {/* If Available & Customer selecting */}
          {isAvailable && onSelectTable && (
            <button
              type="button"
              onClick={() => {
                onSelectTable(table.number);
                onClose();
              }}
              className="w-full py-1.5 px-2 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black font-bold text-xs flex items-center justify-center space-x-1 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSelected ? 'Selected' : 'Sit at This Table'}</span>
            </button>
          )}

          {/* Quick Status Selector Pills for Barista */}
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pt-1">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={(e) => handleQuickStatusChange(table, opt.id, e)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  table.status === opt.id
                    ? `${opt.color} shadow-xs scale-105`
                    : 'bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-black/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-[#faf8f5] dark:bg-[#121215] rounded-3xl shadow-2xl border border-[#ded8ce] dark:border-[#26262b] overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#e8e2d8] dark:border-[#222226] flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Coffee className="w-4 h-4 text-[#c5a880]" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#c5a880] dark:text-[#dfcca9]">
                Live Floor Plan & Seating Manager
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#111111] dark:text-[#f8f7f4] mt-0.5">
              Extraction Point Table Availability
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#777777] dark:text-[#999999] hover:bg-[#eae4db] dark:hover:bg-[#222226] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar with Instant Barista Batch Actions */}
        <div className="px-5 py-3.5 bg-[#ede7dc] dark:bg-[#18181c] border-b border-[#ded8ce] dark:border-[#26262b] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3 sm:space-x-4 flex-wrap gap-y-1">
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
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-[#444444] dark:text-[#c0c0c8]">
                <strong>{sanitizingCount}</strong> Sanitizing
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span className="text-[#444444] dark:text-[#c0c0c8]">
                <strong>{reservedCount}</strong> Reserved
              </span>
            </div>
          </div>

          {/* Barista Quick Action */}
          {sanitizingCount > 0 && (
            <button
              onClick={handleMarkAllSanitizedAsAvailable}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all animate-pulse"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark All {sanitizingCount} Sanitized Tables Available</span>
            </button>
          )}
        </div>

        {/* Floor Plan Sections */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Indoor Main Lounge */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif font-bold text-base text-[#111111] dark:text-[#f8f7f4]">
                Indoor Main Hall (Airconditioned)
              </h4>
              <span className="text-xs text-[#777777] dark:text-[#999999]">6 Tables</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {indoorTables.map(renderTableCard)}
            </div>
          </div>

          {/* Espresso Bar Counter */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif font-bold text-base text-[#111111] dark:text-[#f8f7f4]">
                Espresso Bar Counter (Solo Seats)
              </h4>
              <span className="text-xs text-[#777777] dark:text-[#999999]">3 Bar Stools</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {barTables.map(renderTableCard)}
            </div>
          </div>

          {/* Patio Garden */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif font-bold text-base text-[#111111] dark:text-[#f8f7f4]">
                Outdoor Patio & Garden
              </h4>
              <span className="text-xs text-[#777777] dark:text-[#999999]">3 Tables</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {patioTables.map(renderTableCard)}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#e8e2d8] dark:border-[#222226] bg-[#f5f1ea] dark:bg-[#16161a] flex items-center justify-between text-xs">
          <span className="text-[#666666] dark:text-[#9999a0]">
            💡 Baristas can click any status button (Available, Occupied, Reserved, Sanitizing) on a table to update it in real time.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] font-bold text-xs shadow-sm hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
