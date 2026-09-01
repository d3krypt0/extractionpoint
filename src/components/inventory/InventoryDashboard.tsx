import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPhp } from '../../utils/phCurrency';
import { InventoryCategory, InventoryItem } from '../../types';
import { WasteManagementModal } from './WasteManagementModal';
import { 
  Package, 
  Search, 
  CheckCircle2, 
  Trash2, 
  Sliders,
  Edit2,
  Plus,
  X,
  Save
} from 'lucide-react';

const CATEGORY_OPTIONS: { id: InventoryCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Items' },
  { id: 'coffee', label: 'Coffee Beans' },
  { id: 'dairy', label: 'Milks & Dairy' },
  { id: 'tea_matcha', label: 'Matcha & Tea' },
  { id: 'syrup_flavor', label: 'Syrups & Flavors' },
  { id: 'food_ingredient', label: 'Food & Proteins' },
  { id: 'packaging', label: 'Packaging' },
];

const UNIT_OPTIONS = ['kg', 'L', 'pcs', 'g', 'ml', 'pack', 'can', 'bottle'];

export const InventoryDashboard: React.FC = () => {
  const { 
    inventory, 
    restockInventory, 
    updateInventoryItem, 
    addInventoryItem, 
    deleteInventoryItem, 
    menuItems, 
    toggleSoldOut 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);
  
  // Restock Modal
  const [restockItemId, setRestockItemId] = useState<string | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(5);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    category: InventoryCategory;
    currentStock: number;
    unit: string;
    minThreshold: number;
    unitCostPhp: number;
  }>({
    name: '',
    category: 'coffee',
    currentStock: 0,
    unit: 'kg',
    minThreshold: 0,
    unitCostPhp: 0,
  });

  // Add New Item Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<{
    name: string;
    category: InventoryCategory;
    currentStock: number;
    unit: string;
    minThreshold: number;
    unitCostPhp: number;
  }>({
    name: '',
    category: 'coffee',
    currentStock: 10,
    unit: 'kg',
    minThreshold: 3,
    unitCostPhp: 600,
  });

  // Metrics
  const totalAssetValue = useMemo(() => {
    return inventory.reduce((sum, item) => sum + item.currentStock * item.unitCostPhp, 0);
  }, [inventory]);

  const lowStockCount = useMemo(() => {
    return inventory.filter((item) => item.currentStock <= item.minThreshold).length;
  }, [inventory]);

  const soldOutMenuItems = useMemo(() => {
    return menuItems.filter((i) => i.isSoldOut);
  }, [menuItems]);

  // Filtered inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [inventory, activeCategory, searchQuery]);

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockItemId || restockAmount <= 0) return;
    restockInventory(restockItemId, restockAmount);
    setRestockItemId(null);
    setRestockAmount(5);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setEditForm({
      name: item.name,
      category: item.category,
      currentStock: item.currentStock,
      unit: item.unit,
      minThreshold: item.minThreshold,
      unitCostPhp: item.unitCostPhp,
    });
  };

  // Save Edit Item
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    updateInventoryItem(editingItem.id, {
      name: editForm.name.trim() || editingItem.name,
      category: editForm.category,
      currentStock: Math.max(0, Number(editForm.currentStock)),
      unit: editForm.unit,
      minThreshold: Math.max(0, Number(editForm.minThreshold)),
      unitCostPhp: Math.max(0, Number(editForm.unitCostPhp)),
    });

    setEditingItem(null);
  };

  // Save New Item
  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim()) return;

    addInventoryItem({
      name: addForm.name.trim(),
      category: addForm.category,
      currentStock: Math.max(0, Number(addForm.currentStock)),
      unit: addForm.unit,
      minThreshold: Math.max(0, Number(addForm.minThreshold)),
      unitCostPhp: Math.max(0, Number(addForm.unitCostPhp)),
    });

    setIsAddModalOpen(false);
    setAddForm({
      name: '',
      category: 'coffee',
      currentStock: 10,
      unit: 'kg',
      minThreshold: 3,
      unitCostPhp: 600,
    });
  };

  // Delete Item
  const handleDeleteItem = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
      deleteInventoryItem(id);
      if (editingItem?.id === id) setEditingItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3efe8] dark:bg-[#0c0c0e] p-4 sm:p-6 space-y-6 transition-colors">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-[#111111] dark:text-[#f8f7f4]">
              Inventory & Stocks Management
            </h2>
            <p className="text-[11px] text-gray-500">
              Ingredient-level tracking, real-time stock levels & manual overrides
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black font-bold text-xs hover:opacity-90 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Ingredient / Item</span>
          </button>

          <button
            onClick={() => setIsWasteModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-400 font-bold text-xs hover:bg-rose-500/25 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Log Food Waste</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-500">
            Total Inventory Value (PHP)
          </span>
          <div className="font-mono text-2xl font-black text-[#111111] dark:text-[#f8f7f4]">
            {formatPhp(totalAssetValue)}
          </div>
          <div className="text-[11px] text-gray-500">
            {inventory.length} raw ingredients tracked
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-500">
            Low Stock Warnings
          </span>
          <div className={`font-mono text-2xl font-black ${
            lowStockCount > 0 ? 'text-amber-500' : 'text-emerald-500'
          }`}>
            {lowStockCount} item{lowStockCount !== 1 ? 's' : ''}
          </div>
          <div className="text-[11px] text-gray-500">
            {lowStockCount > 0 ? 'Needs reordering soon' : 'All stocks healthy'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-500">
            86'd / Sold Out Menu Dishes
          </span>
          <div className="font-mono text-2xl font-black text-purple-600 dark:text-purple-400">
            {soldOutMenuItems.length}
          </div>
          <div className="text-[11px] text-gray-500">
            Hidden from customer ordering
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-500">
            Real-Time Recipe Depletion
          </span>
          <div className="font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-5 h-5" />
            <span>ACTIVE</span>
          </div>
          <div className="text-[11px] text-gray-500">
            Stock auto-deducts on order placement
          </div>
        </div>

      </div>

      {/* Main Table Panel */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] shadow-sm space-y-4">
        
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ingredient or material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#f8f6f2] dark:bg-[#1e1e24] border border-[#ded8ce] dark:border-[#2a2a30] text-xs text-[#111111] dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
            {CATEGORY_OPTIONS.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === c.id
                    ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black'
                    : 'bg-[#ede7dc] dark:bg-[#1f1f24] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Ingredient / Item</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Stock Level</th>
                <th className="py-3 px-3">Min Threshold</th>
                <th className="py-3 px-3">Unit Cost</th>
                <th className="py-3 px-3">Total Value</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {filteredInventory.map((item) => {
                const isLow = item.currentStock <= item.minThreshold;
                const isCritical = item.currentStock <= item.minThreshold * 0.4;
                const itemTotalValue = item.currentStock * item.unitCostPhp;

                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1f] transition-colors group">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#111111] dark:text-[#f8f7f4]">
                        {item.name}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-500 uppercase text-[10px] font-semibold">
                      {item.category.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-sm">
                      <span className={isCritical ? 'text-red-500 font-black' : isLow ? 'text-amber-500 font-black' : 'text-gray-900 dark:text-white'}>
                        {item.currentStock} {item.unit}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-500">
                      {item.minThreshold} {item.unit}
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-700 dark:text-gray-300 font-semibold">
                      {formatPhp(item.unitCostPhp)} <span className="text-[10px] text-gray-400 font-normal">/{item.unit}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-gray-900 dark:text-gray-100">
                      {formatPhp(itemTotalValue)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isCritical
                          ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                          : isLow
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {isCritical ? 'Critical' : isLow ? 'Low Stock' : 'Healthy'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setRestockItemId(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#c5a880] text-black font-bold text-[11px] hover:bg-[#d8c09d] transition-colors"
                          title="Quick Restock"
                        >
                          + Restock
                        </button>
                        
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg border border-[#ded8ce] dark:border-[#2a2a30] hover:bg-gray-200 dark:hover:bg-[#26262c] text-gray-700 dark:text-gray-300 transition-colors"
                          title="Edit Stock, Threshold & Cost"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-1.5 rounded-lg border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Delete Ingredient"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Package className="w-8 h-8 text-gray-400" />
                      <p className="text-xs text-gray-500 font-medium">
                        No inventory or stock items found matching this filter.
                      </p>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black font-bold text-xs flex items-center space-x-1.5 shadow-sm hover:opacity-90"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Ingredient / Item</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* 86'd / Sold-Out Menu Items Quick Manager */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#222226] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#c5a880]" />
            <h3 className="font-serif font-bold text-sm text-[#111111] dark:text-[#f8f7f4]">
              Customer Menu 86'd (Sold Out) Control
            </h3>
          </div>
          <span className="text-[11px] text-gray-500">
            Click any item to toggle its availability on customer self-ordering
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 max-h-44 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleSoldOut(item.id)}
              className={`p-2.5 rounded-xl border text-left flex flex-col justify-between text-xs transition-all ${
                item.isSoldOut
                  ? 'border-red-400 bg-red-500/10 text-red-700 dark:text-red-400 font-bold'
                  : 'border-[#ded8ce] dark:border-[#242429] bg-[#faf8f5] dark:bg-[#1a1a1f] text-gray-700 dark:text-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="truncate font-medium">{item.name}</span>
              <span className={`text-[10px] font-bold mt-1 ${item.isSoldOut ? 'text-red-500' : 'text-emerald-500'}`}>
                {item.isSoldOut ? '✕ 86\'d (Sold Out)' : '✓ In Stock'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Restock Modal */}
      {restockItemId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="w-full max-w-sm bg-white dark:bg-[#141417] p-5 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-serif font-bold text-base text-[#111111] dark:text-white">
              Restock Ingredient
            </h4>
            <p className="text-xs text-gray-500">
              {inventory.find((i) => i.id === restockItemId)?.name}
            </p>

            <form onSubmit={handleRestockSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                  Quantity to Add ({inventory.find((i) => i.id === restockItemId)?.unit})
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1e1e24] border font-mono text-sm font-bold"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockItemId(null)}
                  className="flex-1 py-2 rounded-xl border text-xs font-bold text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Full Edit Modal (Stock Level, Min Threshold, Unit Cost) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="w-full max-w-md bg-white dark:bg-[#141417] p-5 sm:p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <Edit2 className="w-4 h-4 text-[#c5a880]" />
                <h4 className="font-serif font-bold text-base text-[#111111] dark:text-white">
                  Manual Edit: {editingItem.name}
                </h4>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                  Item / Material Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1e1e24] border text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value as InventoryCategory })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1e1e24] border text-xs font-medium"
                  >
                    {CATEGORY_OPTIONS.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                    Unit of Measure
                  </label>
                  <select
                    value={editForm.unit}
                    onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1e1e24] border text-xs font-medium"
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3 Core Fields: Stock Level, Min Threshold, Unit Cost */}
              <div className="p-3.5 rounded-xl bg-[#faf8f5] dark:bg-[#1b1b20] border border-[#ded8ce] dark:border-[#2a2a30] space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                    Stock Level ({editForm.unit})
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    value={editForm.currentStock}
                    onChange={(e) => setEditForm({ ...editForm, currentStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#25252c] border border-gray-300 dark:border-gray-700 font-mono text-sm font-bold text-black dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                      Min Threshold ({editForm.unit})
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      required
                      value={editForm.minThreshold}
                      onChange={(e) => setEditForm({ ...editForm, minThreshold: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#25252c] border border-gray-300 dark:border-gray-700 font-mono text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                      Unit Cost (PHP)
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      required
                      value={editForm.unitCostPhp}
                      onChange={(e) => setEditForm({ ...editForm, unitCostPhp: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#25252c] border border-gray-300 dark:border-gray-700 font-mono text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Total Value Live Calculation */}
                <div className="pt-1 flex items-center justify-between text-xs font-bold border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Computed Total Value:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatPhp(editForm.currentStock * editForm.unitCostPhp)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleDeleteItem(editingItem.id, editingItem.name)}
                  className="px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-xl border text-xs font-bold text-gray-600 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black text-xs font-bold hover:opacity-90 flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Inventory Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="w-full max-w-md bg-white dark:bg-[#141417] p-5 sm:p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-emerald-500" />
                <h4 className="font-serif font-bold text-base text-[#111111] dark:text-white">
                  Add New Ingredient / Item
                </h4>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewItem} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                  Ingredient Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vanilla Bean Pods, Organic Oat Milk"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1e1e24] border text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                    Category
                  </label>
                  <select
                    value={addForm.category}
                    onChange={(e) => setAddForm({ ...addForm, category: e.target.value as InventoryCategory })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1e1e24] border text-xs font-medium"
                  >
                    {CATEGORY_OPTIONS.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
                    Unit of Measure
                  </label>
                  <select
                    value={addForm.unit}
                    onChange={(e) => setAddForm({ ...addForm, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1e1e24] border text-xs font-medium"
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3 Core Fields: Stock Level, Min Threshold, Unit Cost */}
              <div className="p-3.5 rounded-xl bg-[#faf8f5] dark:bg-[#1b1b20] border border-[#ded8ce] dark:border-[#2a2a30] space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                    Initial Stock Level ({addForm.unit})
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    value={addForm.currentStock}
                    onChange={(e) => setAddForm({ ...addForm, currentStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#25252c] border border-gray-300 dark:border-gray-700 font-mono text-sm font-bold text-black dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                      Min Threshold ({addForm.unit})
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      required
                      value={addForm.minThreshold}
                      onChange={(e) => setAddForm({ ...addForm, minThreshold: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#25252c] border border-gray-300 dark:border-gray-700 font-mono text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                      Unit Cost (PHP)
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      required
                      value={addForm.unitCostPhp}
                      onChange={(e) => setAddForm({ ...addForm, unitCostPhp: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#25252c] border border-gray-300 dark:border-gray-700 font-mono text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs font-bold border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Initial Asset Value:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatPhp(addForm.currentStock * addForm.unitCostPhp)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center space-x-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Item to Stocks</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Food Waste Logger Modal */}
      <WasteManagementModal
        isOpen={isWasteModalOpen}
        onClose={() => setIsWasteModalOpen(false)}
      />
    </div>
  );
};
