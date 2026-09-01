import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MENU_CATEGORIES } from '../../data/menuData';
import { Category, MenuItem } from '../../types';
import { formatPhp } from '../../utils/phCurrency';
import { ItemCustomizerModal } from './ItemCustomizerModal';
import { TableAvailabilityMap } from './TableAvailabilityMap';
import { QueueSystemModal } from './QueueSystemModal';
import { CartCheckoutModal } from './CartCheckoutModal';
import { 
  Search, 
  Plus, 
  Flame, 
  Star, 
  Coffee, 
  Leaf, 
  Users,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';

export const CustomerView: React.FC = () => {
  const { 
    menuItems, 
    addToCart, 
    cartTotals, 
    tables, 
    queue, 
    trackedOrderId, 
    setActiveView 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Modals state
  const [selectedItemForCustomizer, setSelectedItemForCustomizer] = useState<MenuItem | null>(null);
  const [isTableMapOpen, setIsTableMapOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Stats
  const availableTables = tables.filter((t) => t.status === 'available').length;
  const waitingParties = queue.filter((q) => q.status === 'waiting').length;

  // Filtered Menu Items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesSubtitle = item.subtitle?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesSubtitle) return false;
      }
      if (activeFilter === 'best_seller' && !item.isBestSeller) return false;
      if (activeFilter === 'signature' && !item.isSignature) return false;
      if (activeFilter === 'spicy' && !item.spicyLevel) return false;
      if (activeFilter === 'vegetarian' && !item.tags?.includes('vegetarian')) return false;

      return true;
    });
  }, [menuItems, activeCategory, searchQuery, activeFilter]);

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.isSoldOut) return;
    addToCart(item, {}, 1);
  };

  return (
    <div className="min-h-screen pb-28">
      
      {/* Compact Editorial Hero Banner (Optimized for Tablet & Mobile) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111111] via-[#161619] to-[#1c1c20] text-white py-8 sm:py-12 px-4 sm:px-6 border-b border-[#2a2a30]">
        
        {/* Subtle decorative glow */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#c5a880]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-3.5">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-semibold text-[#dfcca9] tracking-wider uppercase">
            <span>Specialty Coffee • Stone-Milled Matcha • Pastas</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#fbfaf8] leading-tight">
            Your Day Deserves <span className="text-[#c5a880] italic font-normal">Better Caffeine.</span>
          </h2>
          
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto font-light leading-relaxed">
            Crafted with Single-Origin Vietnam Arabica, Shizuoka Nami Matcha, and artisan pantry ingredients.
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              onClick={() => setIsTableMapOpen(true)}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-xs font-bold text-white transition-all shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tables: <strong className="text-emerald-400 font-mono">{availableTables}/12 Free</strong></span>
            </button>

            <button
              onClick={() => setIsQueueOpen(true)}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-xs font-bold text-white transition-all shadow-sm"
            >
              <Users className="w-3.5 h-3.5 text-[#dfcca9]" />
              <span>Queue: <strong className="text-[#dfcca9] font-mono">{waitingParties} waiting</strong></span>
            </button>

            {trackedOrderId && (
              <button
                onClick={() => setActiveView('tracker')}
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#c5a880]/20 hover:bg-[#c5a880]/30 border border-[#c5a880]/40 text-xs font-bold text-[#dfcca9] transition-all animate-pulse"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Track Active Order</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Specialty Highlights (Side-by-Side on Tablet) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          
          {/* Coffee Spotlight */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#151518] shadow-md border border-[#e2dcd2] dark:border-[#26262c] flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#261710] text-[#dfcca9] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Coffee className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-[#111111] dark:text-[#f8f7f4]">
                  Vietnam Arabica
                </span>
                <span className="text-[10px] font-bold text-[#c5a880] uppercase tracking-wider">
                  1000+ MASL
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                Medium Dark Roast • Chocolate, Molasses & Vanilla
              </p>
            </div>
          </div>

          {/* Matcha Spotlight */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#151518] shadow-md border border-[#e2dcd2] dark:border-[#26262c] flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#1c2e17] text-[#84cc16] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-[#111111] dark:text-[#f8f7f4]">
                  Nami Matcha
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Shizuoka, Japan
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                Single Cultivar Yabukita • 100% First Flush Harvest
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Menu Catalog */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-5">
        
        {/* Search Bar & Dietary Filter Pills */}
        <div className="flex flex-col md:flex-row gap-3.5 items-stretch md:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search coffee, matcha, pasta, potions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-[#161619] border border-[#ded8ce] dark:border-[#26262b] text-sm font-medium text-[#111111] dark:text-[#f8f7f4] focus:outline-none focus:border-[#c5a880] shadow-sm transition-all"
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: 'All Menu' },
              { id: 'best_seller', label: 'Best Sellers', icon: <Star className="w-4 h-4 text-amber-500" /> },
              { id: 'signature', label: 'Signatures', icon: <Coffee className="w-4 h-4 text-[#c5a880]" /> },
              { id: 'spicy', label: 'Spicy', icon: <Flame className="w-4 h-4 text-rose-500" /> },
              { id: 'vegetarian', label: 'Veggie', icon: <Leaf className="w-4 h-4 text-emerald-500" /> },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  activeFilter === f.id
                    ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] shadow-md'
                    : 'bg-white dark:bg-[#18181c] text-[#555555] dark:text-[#9999a0] border border-[#ded8ce] dark:border-[#26262b] hover:bg-[#ede7dc]/50'
                }`}
              >
                {f.icon}
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Navigation Bar (Touch-friendly scroll) */}
        <div className="flex items-center space-x-2.5 overflow-x-auto no-scrollbar py-2.5 border-b border-[#e5dfd5] dark:border-[#222227]">
          {MENU_CATEGORIES.map((cat) => {
            const isCatActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as Category)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isCatActive
                    ? 'bg-[#c5a880] text-black shadow-md font-black scale-105'
                    : 'bg-white/60 dark:bg-[#161619] text-[#666666] dark:text-[#a0a0a8] hover:text-black dark:hover:text-white border border-[#e5dfd5]/60 dark:border-[#26262c]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Items Grid (Mobile-First Generous Sizing) */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#26262b] space-y-3">
            <Coffee className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-200">
              No matching items found
            </h3>
            <p className="font-brand text-xs sm:text-sm text-gray-500">
              Try adjusting your search query or switching to another category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredItems.map((item) => {
              const isSoldOut = !!item.isSoldOut;

              return (
                <div
                  key={item.id}
                  onClick={() => !isSoldOut && setSelectedItemForCustomizer(item)}
                  className={`group relative p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#131316] border transition-all flex flex-col justify-between ${
                    isSoldOut
                      ? 'opacity-60 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900/50 cursor-not-allowed'
                      : 'border-[#ded8ce] dark:border-[#222227] hover:border-[#c5a880] dark:hover:border-[#c5a880] hover:shadow-xl hover:-translate-y-1 cursor-pointer shadow-sm'
                  }`}
                >
                  {/* Card Top: Category & Badges */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-brand text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-[#c5a880]">
                        {item.category.replace('_', ' ')}
                      </span>

                      <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                        {item.isBestSeller && (
                          <span className="px-2.5 py-1 rounded-full font-brand text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-amber-500/15 text-amber-700 dark:text-amber-400">
                            Popular
                          </span>
                        )}
                        {item.isSignature && (
                          <span className="px-2.5 py-1 rounded-full font-brand text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-[#c5a880]/20 text-[#8f744e] dark:text-[#dfcca9]">
                            Signature
                          </span>
                        )}
                        {item.spicyLevel && item.spicyLevel > 0 && (
                          <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400">
                            🌶️ {item.spicyLevel > 1 ? '🌶️' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Subtitle Matching PDF Menu Editorial Serif */}
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#111111] dark:text-[#f8f7f4] group-hover:text-[#c5a880] transition-colors leading-snug tracking-tight">
                      {item.name}
                    </h3>
                    {item.subtitle && (
                      <p className="font-brand text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase mt-1">
                        {item.subtitle}
                      </p>
                    )}

                    {/* Description */}
                    <p className="font-brand text-xs sm:text-sm text-[#4a4a52] dark:text-[#a5a5b0] mt-3 line-clamp-3 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Bottom: Price & Clear Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-[#f0ebe3] dark:border-[#202025] flex items-center justify-between">
                    <div>
                      <span className="font-serif text-xl sm:text-2xl font-black italic text-[#111111] dark:text-[#f8f7f4]">
                        {formatPhp(item.price)}
                      </span>
                    </div>

                    {isSoldOut ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-gray-200 dark:bg-gray-800 font-brand text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
                        Sold Out
                      </span>
                    ) : (
                      <div className="flex items-center space-x-2.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItemForCustomizer(item);
                          }}
                          className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl font-brand text-xs sm:text-sm font-bold bg-[#ede7dc] dark:bg-[#202026] text-[#333333] dark:text-[#f0f0f0] hover:bg-[#c5a880] hover:text-black transition-all"
                        >
                          Customize
                        </button>
                        
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(item, e)}
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] inline-flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-md"
                          title="Quick Add to Cart"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar */}
      {cartTotals.itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-40 animate-slideUp">
          <div 
            onClick={() => setIsCartOpen(true)}
            className="p-3.5 sm:p-4 rounded-2xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] shadow-2xl flex items-center justify-between cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all border border-[#333338] dark:border-[#eaeaea]"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#c5a880] text-black inline-flex items-center justify-center font-mono font-black text-sm">
                {cartTotals.itemCount}
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm">Proceed to Checkout</div>
                <div className="text-[11px] text-gray-400 dark:text-gray-600 font-medium">
                  {cartTotals.itemCount} item{cartTotals.itemCount > 1 ? 's' : ''} in your order
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="font-mono text-base sm:text-lg font-black text-[#c5a880] dark:text-[#9d7f57]">
                {formatPhp(cartTotals.subtotal)}
              </span>
              <div className="p-2 rounded-xl bg-white/10 dark:bg-black/10">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customizer Modal */}
      <ItemCustomizerModal
        item={selectedItemForCustomizer}
        isOpen={!!selectedItemForCustomizer}
        onClose={() => setSelectedItemForCustomizer(null)}
        onAddToCart={addToCart}
      />

      {/* Table Availability Map */}
      <TableAvailabilityMap
        isOpen={isTableMapOpen}
        onClose={() => setIsTableMapOpen(false)}
      />

      {/* Queue Modal */}
      <QueueSystemModal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
      />

      {/* Cart & Checkout Modal */}
      <CartCheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenTableMap={() => {
          setIsCartOpen(false);
          setIsTableMapOpen(true);
        }}
      />
    </div>
  );
};
