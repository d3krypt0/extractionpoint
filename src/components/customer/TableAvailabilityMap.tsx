import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Table, TableStatus } from '../../types';
import { 
  X, 
  Check, 
  Users, 
  Coffee, 
  CheckCircle2,
  Radio,
  Sparkles,
  Clock,
  Ban
} from 'lucide-react';

interface TableAvailabilityMapProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTable?: (tableNumber: number) => void;
  selectedTableNumber?: number | null;
}

const STATUS_OPTIONS: { id: TableStatus; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'available', label: 'Available', icon: <Check className="w-3 h-3 text-emerald-100" />, color: 'bg-emerald-600 text-white' },
  { id: 'occupied', label: 'Occupied', icon: <Ban className="w-3 h-3 text-rose-100" />, color: 'bg-rose-600 text-white' },
  { id: 'reserved', label: 'Reserved', icon: <Clock className="w-3 h-3 text-purple-100" />, color: 'bg-purple-600 text-white' },
  { id: 'cleaning', label: 'Sanitizing', icon: <Sparkles className="w-3 h-3 text-amber-100" />, color: 'bg-amber-600 text-white' },
];

export const TableAvailabilityMap: React.FC<TableAvailabilityMapProps> = ({
  isOpen,
  onClose,
  onSelectTable,
  selectedTableNumber,
}) => {
  const { 
    tables, 
    updateTableStatus, 
    isQrCustomerMode, 
    isStaffAuthenticated,
    isOnline
  } = useApp();
  
  const [editingTableId, setEditingTableId] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Staff mode is active whenever staff has entered their PIN (isStaffAuthenticated is true) and not picking table for checkout
  const isStaff = isStaffAuthenticated && !isQrCustomerMode && !onSelectTable;

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
        return 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300';
      case 'occupied':
        return 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/60 text-rose-900 dark:text-rose-300';
      case 'reserved':
        return 'bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800/60 text-purple-900 dark:text-purple-300';
      case 'cleaning':
        return 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-300';
    }
  };

  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-sans font-bold bg-emerald-600 text-white shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>Available</span>
          </span>
        );
      case 'occupied':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-sans font-bold bg-rose-600 text-white shadow-xs">
            <span>Occupied</span>
          </span>
        );
      case 'reserved':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-sans font-bold bg-purple-600 text-white shadow-xs">
            <span>Reserved</span>
          </span>
        );
      case 'cleaning':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-sans font-bold bg-amber-600 text-white shadow-xs">
            <Sparkles className="w-3 h-3" />
            <span>Sanitizing</span>
          </span>
        );
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
    const isEditing = editingTableId === table.id && isStaff;

    return (
      <div
        key={table.id}
        onClick={() => {
          if (isAvailable && onSelectTable) {
            onSelectTable(table.number);
            onClose();
          }
        }}
        className={`relative p-4 sm:p-5 rounded-2xl border-2 flex flex-col justify-between transition-all shadow-sm ${
          isSelected
            ? 'ring-2 ring-[#c5a880] border-[#c5a880] bg-[#c5a880]/15'
            : getStatusColor(table.status)
        } ${isAvailable && onSelectTable ? 'cursor-pointer hover:scale-[1.02] hover:shadow-md' : ''}`}
      >
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="font-sans font-black text-base sm:text-lg text-gray-950 dark:text-white tracking-tight">
                {table.name}
              </span>
              <div className="flex items-center space-x-1.5 text-xs font-sans font-semibold text-gray-600 dark:text-gray-400 mt-0.5">
                <Users className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>{table.capacity} Seats</span>
              </div>
            </div>

            {/* Status Badge */}
            {isStaff ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingTableId(isEditing ? null : table.id);
                }}
                className="hover:opacity-90 active:scale-95 transition-transform flex-shrink-0"
                title="Staff: Tap to switch table status"
              >
                {getStatusBadge(table.status)}
              </button>
            ) : (
              <div className="flex-shrink-0">{getStatusBadge(table.status)}</div>
            )}
          </div>

          {/* Guest Name if Occupied */}
          {table.status === 'occupied' && table.activeCustomerName && (
            <div className="mt-2 text-xs font-sans font-semibold text-rose-800 dark:text-rose-300 bg-rose-500/10 px-2 py-1 rounded-md truncate">
              Guest: {table.activeCustomerName}
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 space-y-2">
          
          {/* STAFF ONLY: If Sanitizing, show One-Click "Mark Sanitized & Available" */}
          {isStaff && isCleaning && (
            <button
              type="button"
              onClick={(e) => handleQuickStatusChange(table, 'available', e)}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-sans font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Sanitized & Available</span>
            </button>
          )}

          {/* CUSTOMER MODE: If Available & Customer selecting table for ordering */}
          {isAvailable && onSelectTable && (
            <button
              type="button"
              onClick={() => {
                onSelectTable(table.number);
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black font-sans font-bold text-xs flex items-center justify-center space-x-1 hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>{isSelected ? 'Selected Table' : 'Reserve & Sit Here'}</span>
            </button>
          )}

          {/* STAFF ONLY: 2x2 Responsive Grid with Full Readable Labels */}
          {isStaff && (
            <div className="space-y-1">
              <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-gray-500 text-center">
                Set Table Status
              </div>
              <div className="grid grid-cols-2 gap-1.5 w-full">
                {STATUS_OPTIONS.map((opt) => {
                  const isActive = table.status === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={(e) => handleQuickStatusChange(table, opt.id, e)}
                      className={`w-full py-1.5 px-2 rounded-xl text-xs font-sans font-bold flex items-center justify-center space-x-1 transition-all shadow-xs ${
                        isActive
                          ? `${opt.color} font-black ring-2 ring-black/20 dark:ring-white/20 scale-[1.02]`
                          : 'bg-white/80 dark:bg-[#1f1f25] text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#282830] border border-black/5 dark:border-white/5'
                      }`}
                    >
                      {opt.icon}
                      <span className="leading-none">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn select-none">
      <div 
        className="relative w-full max-w-4xl bg-[#faf8f5] dark:bg-[#121215] rounded-3xl shadow-2xl border border-[#ded8ce] dark:border-[#26262b] overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#e8e2d8] dark:border-[#222226] flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Coffee className="w-4 h-4 text-[#c5a880]" />
              <span className="text-xs font-sans font-bold tracking-widest uppercase text-[#9d7f57] dark:text-[#dfcca9] flex items-center space-x-1.5">
                <span>Live Seating Floor Plan</span>
                <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  <span>Real-Time Sync</span>
                </span>
              </span>
            </div>
            <h3 className="font-sans font-black text-xl sm:text-2xl text-gray-950 dark:text-white mt-0.5 tracking-tight">
              Extraction Point Table Availability
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-[#eae4db] dark:hover:bg-[#222226] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Bar */}
        <div className="px-5 py-3.5 bg-[#ede7dc] dark:bg-[#18181c] border-b border-[#ded8ce] dark:border-[#26262b] flex flex-wrap items-center justify-between gap-3 text-xs font-sans font-bold">
          <div className="flex items-center space-x-3 sm:space-x-5 flex-wrap gap-y-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-gray-800 dark:text-gray-200">
                <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-sm">{availableCount}</strong> Available
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-gray-800 dark:text-gray-200">
                <strong className="text-rose-700 dark:text-rose-400 font-mono text-sm">{occupiedCount}</strong> Occupied
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-gray-800 dark:text-gray-200">
                <strong className="text-amber-700 dark:text-amber-400 font-mono text-sm">{sanitizingCount}</strong> Sanitizing
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span className="text-gray-800 dark:text-gray-200">
                <strong className="text-purple-700 dark:text-purple-400 font-mono text-sm">{reservedCount}</strong> Reserved
              </span>
            </div>
          </div>

          {/* STAFF ONLY: Batch Action Button */}
          {isStaff && sanitizingCount > 0 && (
            <button
              onClick={handleMarkAllSanitizedAsAvailable}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark All {sanitizingCount} Sanitized Tables Available</span>
            </button>
          )}
        </div>

        {/* Floor Plan Sections */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Indoor Main Lounge */}
          {indoorTables.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-sans font-black text-sm uppercase tracking-wider text-gray-900 dark:text-white">
                  Indoor Main Hall (Airconditioned)
                </h4>
                <span className="text-xs font-sans font-semibold text-gray-500">
                  {indoorTables.length} Tables
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {indoorTables.map(renderTableCard)}
              </div>
            </div>
          )}

          {/* Espresso Bar Counter */}
          {barTables.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-sans font-black text-sm uppercase tracking-wider text-gray-900 dark:text-white">
                  Espresso Bar Counter (Solo Seats)
                </h4>
                <span className="text-xs font-sans font-semibold text-gray-500">
                  {barTables.length} Bar Stools
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {barTables.map(renderTableCard)}
              </div>
            </div>
          )}

          {/* Outdoor Patio */}
          {patioTables.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-sans font-black text-sm uppercase tracking-wider text-gray-900 dark:text-white">
                  Outdoor Garden Patio (Smoking Area)
                </h4>
                <span className="text-xs font-sans font-semibold text-gray-500">
                  {patioTables.length} Tables
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {patioTables.map(renderTableCard)}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#ede7dc] dark:bg-[#18181c] border-t border-[#ded8ce] dark:border-[#26262b] flex items-center justify-between text-xs font-sans">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            {isStaff 
              ? '💡 Barista Controls: Select any status button to instantly broadcast table status in real time.'
              : isOnline
              ? '🟢 Live table status syncs instantly with Extraction Point host & barista counter.'
              : '🟠 Offline mode: Showing cached table availability.'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white dark:bg-white dark:text-black font-sans font-bold text-xs shadow-sm transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
