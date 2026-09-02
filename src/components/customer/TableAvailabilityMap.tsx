import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Table, TableStatus } from '../../types';
import { 
  X, 
  Check, 
  Users, 
  Coffee, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  QrCode, 
  Store
} from 'lucide-react';
import { TableQrStandModal } from './TableQrStandModal';

interface TableAvailabilityMapProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectTable?: (tableNumber: number) => void;
  selectedTableNumber?: number | null;
  isPageInline?: boolean;
}

const STATUS_OPTIONS: { id: TableStatus; label: string; dotColor: string; activeClass: string }[] = [
  { 
    id: 'available', 
    label: 'Available', 
    dotColor: 'bg-emerald-500', 
    activeClass: 'bg-emerald-600 text-white shadow-xs' 
  },
  { 
    id: 'occupied', 
    label: 'Occupied', 
    dotColor: 'bg-rose-500', 
    activeClass: 'bg-rose-600 text-white shadow-xs' 
  },
  { 
    id: 'reserved', 
    label: 'Reserved', 
    dotColor: 'bg-purple-500', 
    activeClass: 'bg-purple-600 text-white shadow-xs' 
  },
  { 
    id: 'cleaning', 
    label: 'Sanitizing', 
    dotColor: 'bg-amber-500', 
    activeClass: 'bg-amber-600 text-white shadow-xs' 
  },
];

export const TableAvailabilityMap: React.FC<TableAvailabilityMapProps> = ({
  isOpen = true,
  onClose,
  onSelectTable,
  selectedTableNumber,
  isPageInline = false,
}) => {
  const { 
    tables, 
    updateTableStatus, 
    isStaffAuthenticated,
    isAdminRoute,
    isOnline
  } = useApp();
  
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<'all' | 'indoor' | 'bar' | 'patio'>('all');
  const [qrModalTableNumber, setQrModalTableNumber] = useState<number | null>(null);

  // Close on Escape when rendered as modal
  useEffect(() => {
    if (isPageInline || !onClose) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isPageInline]);

  if (!isOpen && !isPageInline) return null;

  // Staff mode is ONLY active in the Admin Console (/admin) for authenticated staff
  const isStaff = isAdminRoute && isStaffAuthenticated && !onSelectTable;

  const indoorTables = tables.filter((t) => t.section === 'indoor');
  const patioTables = tables.filter((t) => t.section === 'patio');
  const barTables = tables.filter((t) => t.section === 'bar');

  const availableCount = tables.filter((t) => t.status === 'available').length;
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const sanitizingCount = tables.filter((t) => t.status === 'cleaning').length;
  const reservedCount = tables.filter((t) => t.status === 'reserved').length;

  const getSubtleCardStyle = (status: TableStatus, isSelected?: boolean) => {
    if (isSelected) {
      return 'border-[#c5a880] ring-2 ring-[#c5a880] bg-[#c5a880]/10 dark:bg-[#c5a880]/15';
    }
    switch (status) {
      case 'available':
        return 'border-emerald-500/25 dark:border-emerald-500/30 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.06] hover:border-emerald-500/40';
      case 'occupied':
        return 'border-rose-500/25 dark:border-rose-500/30 bg-rose-500/[0.03] dark:bg-rose-500/[0.06] hover:border-rose-500/40';
      case 'reserved':
        return 'border-purple-500/25 dark:border-purple-500/30 bg-purple-500/[0.03] dark:bg-purple-500/[0.06] hover:border-purple-500/40';
      case 'cleaning':
        return 'border-amber-500/25 dark:border-amber-500/30 bg-amber-500/[0.03] dark:bg-amber-500/[0.06] hover:border-amber-500/40';
    }
  };

  const getStatusPill = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Available</span>
          </span>
        );
      case 'occupied':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Occupied</span>
          </span>
        );
      case 'reserved':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
            <Clock className="w-3 h-3" />
            <span>Reserved</span>
          </span>
        );
      case 'cleaning':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3 h-3" />
            <span>Sanitizing</span>
          </span>
        );
    }
  };

  const handleQuickStatusChange = (table: Table, nextStatus: TableStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    updateTableStatus(table.id, nextStatus);
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

    return (
      <div
        key={table.id}
        onClick={() => {
          if (isAvailable && onSelectTable) {
            onSelectTable(table.number);
            if (onClose) onClose();
          }
        }}
        className={`relative p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between ${
          getSubtleCardStyle(table.status, isSelected)
        } ${isAvailable && onSelectTable ? 'cursor-pointer hover:scale-[1.01] hover:shadow-md' : 'shadow-xs'}`}
      >
        <div>
          {/* Top Row: Table Name & Status Badge */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-sans font-black text-base sm:text-lg text-gray-900 dark:text-white tracking-tight">
                  {table.name}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                <Users className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>{table.capacity} Seats</span>
                <span className="text-gray-400 dark:text-gray-600">•</span>
                <span className="capitalize">{table.section}</span>
              </div>
            </div>

            {/* Status Pill Badge */}
            <div className="flex-shrink-0">
              {getStatusPill(table.status)}
            </div>
          </div>

          {/* Active Guest Info if Occupied */}
          {table.status === 'occupied' && table.activeCustomerName && (
            <div className="mt-2.5 text-xs text-gray-600 dark:text-gray-300 bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-xl flex items-center justify-between">
              <span className="truncate">Guest: <strong>{table.activeCustomerName}</strong></span>
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 space-y-2">
          
          {/* CUSTOMER MODE: Checkout Table Selector */}
          {onSelectTable && isAvailable && (
            <button
              type="button"
              onClick={() => {
                onSelectTable(table.number);
                if (onClose) onClose();
              }}
              className="w-full py-2 px-3 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black font-bold text-xs flex items-center justify-center space-x-1.5 hover:opacity-90 active:scale-95 transition-all shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSelected ? 'Selected Table' : 'Select Table for Order'}</span>
            </button>
          )}

          {/* STAFF ONLY: Clean Minimalist Status Switcher */}
          {isStaff && (
            <div className="space-y-2">
              {/* Quick Sanitize Clear */}
              {isCleaning && (
                <button
                  type="button"
                  onClick={(e) => handleQuickStatusChange(table, 'available', e)}
                  className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Sanitized & Ready</span>
                </button>
              )}

              {/* Minimal Segmented Status Control */}
              <div className="flex items-center justify-between bg-white/70 dark:bg-black/30 p-1 rounded-xl border border-black/5 dark:border-white/10 text-[11px] gap-1">
                {STATUS_OPTIONS.map((opt) => {
                  const isActive = table.status === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={(e) => handleQuickStatusChange(table, opt.id, e)}
                      className={`flex-1 py-1 px-1.5 rounded-lg font-bold transition-all flex items-center justify-center space-x-1 ${
                        isActive
                          ? opt.activeClass
                          : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                      title={`Set to ${opt.label}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${opt.dotColor} ${isActive ? 'bg-white' : ''}`}></span>
                      <span className="hidden sm:inline text-[10.5px]">{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* QR Stand Link */}
              <button
                type="button"
                onClick={() => setQrModalTableNumber(table.number)}
                className="w-full py-1 text-[11px] text-[#8f744e] dark:text-[#dfcca9] hover:underline font-bold flex items-center justify-center space-x-1"
              >
                <QrCode className="w-3 h-3" />
                <span>View Stand QR</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const content = (
    <div className={`space-y-6 ${isPageInline ? 'max-w-7xl mx-auto p-4 sm:p-6' : 'p-5 sm:p-6 overflow-y-auto flex-1'}`}>
      
      {/* Top Header for Page Inline Mode */}
      {isPageInline && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black shadow-sm">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-[#111111] dark:text-[#f8f7f4]">
                Table Floor Plan & Seating
              </h2>
              <p className="text-[11px] text-gray-500">Live cafe occupancy and table status management</p>
            </div>
          </div>

          {/* Section Selector */}
          <div className="flex items-center space-x-1 bg-[#ede7dc] dark:bg-[#1f1f24] p-1 rounded-xl text-xs font-bold">
            {[
              { id: 'all', label: 'All Tables' },
              { id: 'indoor', label: 'Indoor Hall' },
              { id: 'bar', label: 'Bar Counter' },
              { id: 'patio', label: 'Patio Garden' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSectionFilter(s.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedSectionFilter === s.id
                    ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Minimalist Summary Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-[#141417]/80 backdrop-blur-md border border-[#ded8ce] dark:border-[#222226] text-xs font-bold shadow-xs">
        <div className="flex items-center space-x-4 sm:space-x-6 flex-wrap gap-y-1">
          <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{availableCount} Available</span>
          </div>
          <div className="flex items-center space-x-1.5 text-rose-700 dark:text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>{occupiedCount} Occupied</span>
          </div>
          <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>{sanitizingCount} Sanitizing</span>
          </div>
          <div className="flex items-center space-x-1.5 text-purple-700 dark:text-purple-400">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>{reservedCount} Reserved</span>
          </div>
        </div>

        {/* Staff Quick Action */}
        {isStaff && sanitizingCount > 0 && (
          <button
            onClick={handleMarkAllSanitizedAsAvailable}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1 shadow-xs transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark All Sanitized Tables Available ({sanitizingCount})</span>
          </button>
        )}
      </div>

      {/* Sections Grid */}
      <div className="space-y-6">
        {/* Indoor Main Lounge */}
        {(selectedSectionFilter === 'all' || selectedSectionFilter === 'indoor') && indoorTables.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#ded8ce] dark:border-[#222226] pb-2">
              <h4 className="font-serif font-bold text-sm text-gray-900 dark:text-white">
                Indoor Main Hall (Airconditioned)
              </h4>
              <span className="text-xs text-gray-500 font-medium">{indoorTables.length} Tables</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {indoorTables.map(renderTableCard)}
            </div>
          </div>
        )}

        {/* Espresso Bar Counter */}
        {(selectedSectionFilter === 'all' || selectedSectionFilter === 'bar') && barTables.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#ded8ce] dark:border-[#222226] pb-2">
              <h4 className="font-serif font-bold text-sm text-gray-900 dark:text-white">
                Espresso Bar Counter (Solo Seats)
              </h4>
              <span className="text-xs text-gray-500 font-medium">{barTables.length} Bar Stools</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {barTables.map(renderTableCard)}
            </div>
          </div>
        )}

        {/* Outdoor Patio */}
        {(selectedSectionFilter === 'all' || selectedSectionFilter === 'patio') && patioTables.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#ded8ce] dark:border-[#222226] pb-2">
              <h4 className="font-serif font-bold text-sm text-gray-900 dark:text-white">
                Outdoor Garden Patio
              </h4>
              <span className="text-xs text-gray-500 font-medium">{patioTables.length} Tables</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {patioTables.map(renderTableCard)}
            </div>
          </div>
        )}
      </div>

      {/* QR Stand Modal */}
      {qrModalTableNumber && (
        <TableQrStandModal
          initialTableNumber={qrModalTableNumber}
          isOpen={true}
          onClose={() => setQrModalTableNumber(null)}
        />
      )}
    </div>
  );

  // If rendered as a dedicated full page in Admin Console
  if (isPageInline) {
    return (
      <div className="min-h-screen bg-[#f3efe8] dark:bg-[#0c0c0e] py-6 transition-colors">
        {content}
      </div>
    );
  }

  // Modal Presentation (for Customer storefront & checkout table selection)
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#9d7f57] dark:text-[#dfcca9]">
                Live Seating Floor Plan
              </span>
            </div>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-gray-950 dark:text-white mt-0.5">
              Table Availability
            </h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-[#eae4db] dark:hover:bg-[#222226] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        {content}

        {/* Modal Footer */}
        {onClose && (
          <div className="p-4 bg-[#ede7dc] dark:bg-[#18181c] border-t border-[#ded8ce] dark:border-[#26262b] flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {isOnline
                ? '🟢 Live table status syncs automatically.'
                : '🟠 Offline mode: Showing cached table availability.'}
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white dark:bg-white dark:text-black font-bold text-xs shadow-xs transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
