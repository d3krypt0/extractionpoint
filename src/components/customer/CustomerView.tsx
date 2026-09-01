import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Category, MenuItem, MainCategoryGroup } from '../../types';
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
  Users, 
  MapPin, 
  Clock, 
  ArrowRight
} from 'lucide-react';

// Section Metadata matching the exact PDF Menu Structure
interface MenuSectionDef {
  id: Category;
  title: string;
  group: MainCategoryGroup;
  subtitle?: string;
  pairedWith?: Category; // Paired column in 2-col editorial layout
}

const MENU_SECTIONS: MenuSectionDef[] = [
  // FOOD
  {
    id: 'pasta',
    title: 'PASTA',
    group: 'food',
    subtitle: 'Served with seared chicken and garlic bread.',
    pairedWith: 'patatas',
  },
  {
    id: 'patatas',
    title: 'PATATAS ET. AL',
    group: 'food',
    pairedWith: 'pasta',
  },
  {
    id: 'croissants',
    title: 'CROISSANTS',
    group: 'food',
    subtitle: 'PS*** We source our ingredients fresh every day so you get top-notch quality in every dish. Nothing fancy, just proper food done right.',
  },

  // COFFEE
  {
    id: 'hot_coffee',
    title: 'HOT COFFEE',
    group: 'coffee',
    pairedWith: 'iced_coffee',
  },
  {
    id: 'iced_coffee',
    title: 'ICED COFFEE',
    group: 'coffee',
    pairedWith: 'hot_coffee',
  },
  {
    id: 'signature_drinks',
    title: 'SIGNATURE DRINKS',
    group: 'coffee',
    pairedWith: 'crafted_coffee',
  },
  {
    id: 'crafted_coffee',
    title: 'CRAFTED COFFEE',
    group: 'coffee',
    pairedWith: 'signature_drinks',
  },
  {
    id: 'half_and_half',
    title: 'HALF & HALF',
    group: 'coffee',
    subtitle: 'A smooth, velvety texture and creamy richness to your iced coffee, creating a perfectly balanced sip.',
  },

  // NON-COFFEE
  {
    id: 'milkers',
    title: 'MILKSERS',
    group: 'non_coffee',
    subtitle: 'It’s a fizzy little number with a splash of milk and a smooth, flavoured foam on top. Light, creamy, and just the thing when you’re after something refreshing but a bit different. Goes down easy and hits the spot.',
    pairedWith: 'potions',
  },
  {
    id: 'potions',
    title: 'POTIONS',
    group: 'non_coffee',
    subtitle: 'A smooth, velvety texture and creamy richness to your drink, creating a perfectly balanced sip.',
    pairedWith: 'milkers',
  },
  {
    id: 'infusions',
    title: 'INFUSIONS -TEA',
    group: 'non_coffee',
    pairedWith: 'elixirs',
  },
  {
    id: 'elixirs',
    title: 'ELIXIRS',
    group: 'non_coffee',
    pairedWith: 'infusions',
  },

  // MATCHA
  {
    id: 'matcha_classic',
    title: 'CLASSIC MATCHA',
    group: 'matcha',
    pairedWith: 'matcha_crafted',
  },
  {
    id: 'matcha_crafted',
    title: 'CRAFTED',
    group: 'matcha',
    pairedWith: 'matcha_classic',
  },
];

const MAIN_GROUPS: { id: 'all' | MainCategoryGroup; name: string; icon?: string }[] = [
  { id: 'all', name: 'ALL MENU' },
  { id: 'coffee', name: 'COFFEE' },
  { id: 'matcha', name: 'MATCHA' },
  { id: 'non_coffee', name: 'NON-COFFEE' },
  { id: 'food', name: 'FOOD' },
];

export const CustomerView: React.FC = () => {
  const { 
    menuItems, 
    cart,
    addToCart, 
    cartTotals, 
    tables, 
    queue, 
    trackedOrderId, 
    setActiveView,
    qrTableNumber,
  } = useApp();

  const [activeMainGroup, setActiveMainGroup] = useState<'all' | MainCategoryGroup>('all');
  const [activeSubCategory, setActiveSubCategory] = useState<Category | 'all'>('all');
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
      if (activeMainGroup !== 'all' && item.group !== activeMainGroup) {
        return false;
      }
      if (activeSubCategory !== 'all' && item.category !== activeSubCategory) {
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

      return true;
    });
  }, [menuItems, activeMainGroup, activeSubCategory, searchQuery, activeFilter]);

  // Group items by category for the editorial layout
  const itemsByCategory = useMemo(() => {
    const map = new Map<Category, MenuItem[]>();
    filteredItems.forEach((item) => {
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    });
    return map;
  }, [filteredItems]);

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.isSoldOut) return;
    addToCart(item, {}, 1);
  };

  // Get current quantity in cart for an item
  const getItemCartQuantity = (itemId: string) => {
    return cart
      .filter((ci) => ci.menuItem.id === itemId)
      .reduce((sum, ci) => sum + ci.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#0b0b0d] text-[#111111] dark:text-[#f5f5f7] pb-32 transition-colors">
      
      {/* Top Editorial Cover Header */}
      <section className="border-b border-[#e6e0d5] dark:border-[#1e1e24] bg-[#f5f1ea] dark:bg-[#111114] py-8 sm:py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="font-brand text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#888888] dark:text-[#99999f]">
            EXTRACTION POINT • SPECIALTY COFFEE & KITCHEN
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#111111] dark:text-[#ffffff] uppercase">
            M E N U
          </h1>

          <p className="font-serif italic text-sm sm:text-base text-[#666666] dark:text-[#a0a0aa] max-w-md mx-auto">
            "Your day deserves better caffeine."
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setIsTableMapOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1a1a1f] border border-[#ded8ce] dark:border-[#2a2a30] text-xs font-bold text-[#111111] dark:text-white shadow-sm hover:border-[#c5a880] transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>Tables: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{availableTables}/12 Free</strong></span>
            </button>

            <button
              onClick={() => setIsQueueOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1a1a1f] border border-[#ded8ce] dark:border-[#2a2a30] text-xs font-bold text-[#111111] dark:text-white shadow-sm hover:border-[#c5a880] transition-all"
            >
              <Users className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Queue: <strong className="text-[#c5a880] font-mono">{waitingParties} waiting</strong></span>
            </button>

            {trackedOrderId && (
              <button
                onClick={() => setActiveView('tracker')}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black text-xs font-bold transition-all shadow-md animate-pulse"
              >
                <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Track Active Order</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Navigation Controls Bar */}
      <div className="sticky top-16 sm:top-18 z-30 bg-[#faf8f5]/95 dark:bg-[#0b0b0d]/95 backdrop-blur-md border-b border-[#e8e2d6] dark:border-[#1c1c22] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 space-y-2.5">
          
          {/* Main Category Tabs (FOOD, COFFEE, NON-COFFEE, MATCHA) */}
          <div className="flex items-center justify-start sm:justify-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar py-0.5">
            {MAIN_GROUPS.map((grp) => {
              const isActive = activeMainGroup === grp.id;
              return (
                <button
                  key={grp.id}
                  onClick={() => {
                    setActiveMainGroup(grp.id);
                    setActiveSubCategory('all');
                  }}
                  className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-serif uppercase tracking-widest font-black whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black shadow-md scale-105'
                      : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {grp.name}
                </button>
              );
            })}
          </div>

          {/* Search Bar & Quick Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1 border-t border-[#eee8dc] dark:border-[#1e1e24]">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search dish, bean, or drink..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-[#161619] border border-[#ded8ce] dark:border-[#26262b] text-xs text-[#111111] dark:text-[#f8f7f4] focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            {/* Quick Dietary Filters */}
            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All' },
                { id: 'best_seller', label: 'Best Sellers', icon: <Star className="w-3 h-3 text-amber-500" /> },
                { id: 'signature', label: 'Signatures', icon: <Coffee className="w-3 h-3 text-[#c5a880]" /> },
                { id: 'spicy', label: 'Spicy', icon: <Flame className="w-3 h-3 text-rose-500" /> },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                    activeFilter === f.id
                      ? 'bg-[#c5a880] text-black shadow-xs font-black'
                      : 'bg-white/80 dark:bg-[#161619] text-gray-600 dark:text-gray-400 border border-[#ded8ce] dark:border-[#26262b]'
                  }`}
                >
                  {f.icon}
                  <span>{f.label}</span>
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* Main Editorial Menu Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-12">
        
        {/* Dine-In Seated Table Prominent Banner */}
        {qrTableNumber && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#111111] dark:bg-[#141417] text-white border-2 border-[#c5a880] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center space-x-3.5 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-xl bg-[#c5a880] text-black font-black flex items-center justify-center font-mono text-2xl shadow-md flex-shrink-0">
                #{qrTableNumber}
              </div>
              <div>
                <div className="font-sans font-black text-base sm:text-lg tracking-wide uppercase text-white flex items-center space-x-2">
                  <span>Dine-In • Seated at Table #{qrTableNumber}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">DINE-IN</span>
                </div>
                <p className="text-xs text-gray-300 font-sans mt-0.5">
                  Your ordered coffee, drinks, and food will be served directly to <strong>Table #{qrTableNumber}</strong>.
                </p>
              </div>
            </div>
            <div className="w-full sm:w-auto text-left sm:text-right flex-shrink-0">
              <span className="text-[11px] font-mono text-[#dfcca9] bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 inline-block">
                Self-Order Table #{qrTableNumber}
              </span>
            </div>
          </div>
        )}
        
        {/* Render Each Super Category Page */}
        {(['food', 'coffee', 'non_coffee', 'matcha'] as MainCategoryGroup[]).map((superGroup) => {
          // If a specific main tab is active and not 'all', skip other super groups
          if (activeMainGroup !== 'all' && activeMainGroup !== superGroup) {
            return null;
          }

          // Collect all predefined sections belonging to this super group
          const groupSections = MENU_SECTIONS.filter((s) => s.group === superGroup);
          const allSectionsInGroup: MenuSectionDef[] = [...groupSections];
          
          // Safety fallback: if any items exist in itemsByCategory for this superGroup without a static section definition, include it
          itemsByCategory.forEach((items, cat) => {
            if (items.some((it) => it.group === superGroup) && !allSectionsInGroup.some((s) => s.id === cat)) {
              allSectionsInGroup.push({
                id: cat,
                title: cat.replace('_', ' ').toUpperCase(),
                group: superGroup,
              });
            }
          });

          // Check if there are any matching items in this super group
          const hasItemsInGroup = allSectionsInGroup.some((s) => {
            const items = itemsByCategory.get(s.id);
            return items && items.length > 0;
          });

          if (!hasItemsInGroup) return null;

          const superGroupTitle = 
            superGroup === 'food' ? 'F O O D' :
            superGroup === 'coffee' ? 'C O F F E E' :
            superGroup === 'non_coffee' ? 'N O N - C O F F E E' :
            'M A T C H A';

          return (
            <section key={superGroup} className="space-y-8 animate-fadeIn">
              
              {/* Distinctive PDF Super Header */}
              <div className="text-center space-y-2 py-4">
                <div className="flex items-center justify-center space-x-4">
                  <div className="h-px bg-[#111111] dark:bg-[#f8f7f4] flex-1 max-w-[120px] opacity-40"></div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-[0.25em] text-[#111111] dark:text-[#f8f7f4] uppercase">
                    {superGroupTitle}
                  </h2>
                  <div className="h-px bg-[#111111] dark:bg-[#f8f7f4] flex-1 max-w-[120px] opacity-40"></div>
                </div>

                {/* Shizuoka Nami Matcha Origin Story if Matcha section */}
                {superGroup === 'matcha' && (
                  <p className="font-serif italic text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed pt-1">
                    Made from first flush tea leaves, carefully grown in the highlands of Shizuoka. Being stone milled, it keeps that fine, silky texture and full flavour. Rich umami, soft natural sweetness, low bitterness, with a fresh vegetal edge.
                  </p>
                )}
              </div>

              {/* Grid of Distinctive Black Banner Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
                {allSectionsInGroup.map((section) => {
                  const items = itemsByCategory.get(section.id) || [];
                  if (items.length === 0) return null;

                  return (
                    <div 
                      key={section.id} 
                      className="space-y-4 bg-white/70 dark:bg-[#131317]/70 p-5 sm:p-6 rounded-3xl border border-[#ded8ce] dark:border-[#222227] shadow-sm hover:border-[#c5a880]/50 transition-all"
                    >
                      {/* Solid Black Header Banner (Signature PDF Style) */}
                      <div className="bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black py-2.5 px-4 rounded-lg shadow-sm flex items-center justify-between">
                        <h3 className="font-serif font-black text-sm sm:text-base tracking-[0.2em] uppercase">
                          {section.title}
                        </h3>
                        <span className="text-[10px] font-mono font-bold opacity-70">
                          {items.length} item{items.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Section Subtitle / Chef Note if present */}
                      {section.subtitle && (
                        <p className="font-serif italic text-xs text-gray-600 dark:text-gray-400 leading-relaxed px-1">
                          {section.subtitle}
                        </p>
                      )}

                      {/* Items List */}
                      <div className="divide-y divide-[#eee7dc] dark:divide-[#202026] space-y-1">
                        {items.map((item) => {
                          const isSoldOut = !!item.isSoldOut;
                          const qtyInCart = getItemCartQuantity(item.id);

                          return (
                            <div
                              key={item.id}
                              onClick={() => !isSoldOut && setSelectedItemForCustomizer(item)}
                              className={`pt-3 pb-3.5 first:pt-1 group cursor-pointer transition-all ${
                                isSoldOut ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02] -mx-2 px-2 rounded-xl'
                              }`}
                            >
                              {/* Top Row: Title + Price */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-1.5 flex-wrap">
                                    <h4 className="font-serif font-bold text-base sm:text-lg text-[#111111] dark:text-[#f8f7f4] group-hover:text-[#c5a880] transition-colors leading-tight uppercase tracking-tight">
                                      {item.name}
                                    </h4>

                                    {/* Dietary Badges */}
                                    {item.isBestSeller && (
                                      <span className="px-1.5 py-0.2 text-[8px] font-bold tracking-wider uppercase rounded bg-amber-500/15 text-amber-700 dark:text-amber-400">
                                        Popular
                                      </span>
                                    )}
                                    {item.isSignature && (
                                      <span className="px-1.5 py-0.2 text-[8px] font-bold tracking-wider uppercase rounded bg-[#c5a880]/20 text-[#8f744e] dark:text-[#dfcca9]">
                                        Signature
                                      </span>
                                    )}
                                    {item.spicyLevel && item.spicyLevel > 0 && (
                                      <span className="text-[10px]" title="Spicy">
                                        🌶️{item.spicyLevel > 1 ? '🌶️' : ''}
                                      </span>
                                    )}
                                  </div>

                                  {/* Subtitle if available (e.g. UNSWEETENED, Strawberries x Superberries) */}
                                  {item.subtitle && (
                                    <span className="block font-brand text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-0.5">
                                      {item.subtitle}
                                    </span>
                                  )}
                                </div>

                                {/* Price in PDF Italic Style */}
                                <div className="text-right flex-shrink-0">
                                  <span className="font-serif text-base sm:text-lg font-bold italic text-[#111111] dark:text-[#f8f7f4]">
                                    {formatPhp(item.price)}
                                  </span>
                                </div>
                              </div>

                              {/* Description Body */}
                              <p className="font-brand text-xs sm:text-[13px] text-[#555555] dark:text-[#9999a0] mt-1.5 leading-relaxed font-normal">
                                {item.description}
                              </p>

                              {/* Action Row */}
                              <div className="flex items-center justify-between mt-2.5 pt-2">
                                <div className="flex items-center space-x-2">
                                  {qtyInCart > 0 && (
                                    <span className="px-2 py-0.5 rounded-md bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black font-mono font-bold text-[10px]">
                                      {qtyInCart} in cart
                                    </span>
                                  )}
                                </div>

                                {isSoldOut ? (
                                  <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                                    86'd (Sold Out)
                                  </span>
                                ) : (
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedItemForCustomizer(item);
                                      }}
                                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#ede7dc] dark:bg-[#202026] text-[#444444] dark:text-[#dedede] hover:bg-[#c5a880] hover:text-black transition-colors"
                                    >
                                      Customize
                                    </button>

                                    <button
                                      type="button"
                                      onClick={(e) => handleQuickAdd(item, e)}
                                      className="px-3 py-1 rounded-lg bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-black text-xs font-bold inline-flex items-center space-x-1 hover:opacity-90 active:scale-95 transition-all shadow-xs"
                                      title="Quick Add to Order"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>Add</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

            </section>
          );
        })}

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#141417] border border-[#ded8ce] dark:border-[#26262b] space-y-3 max-w-lg mx-auto">
            <Coffee className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-200">
              No matching items found
            </h3>
            <p className="font-brand text-xs sm:text-sm text-gray-500">
              Try clearing your search query or choosing another category above.
            </p>
          </div>
        )}

      </main>

      {/* Floating Bottom Cart Bar */}
      {cartTotals.itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-40 animate-slideUp">
          <div 
            onClick={() => setIsCartOpen(true)}
            className="p-3.5 sm:p-4 rounded-3xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] shadow-2xl flex items-center justify-between cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all border border-[#333338] dark:border-[#eaeaea]"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#c5a880] text-black font-mono font-black flex items-center justify-center shadow-sm">
                {cartTotals.itemCount}
              </div>
              <div>
                <span className="font-serif font-bold text-sm sm:text-base block leading-tight">
                  View Order Basket
                </span>
                <span className="text-[11px] text-[#c5a880] dark:text-[#8f744e] font-semibold">
                  Tap to Review & Place Order
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-serif text-lg sm:text-xl font-bold italic">
                {formatPhp(cartTotals.subtotal)}
              </span>
              <div className="w-8 h-8 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <CartCheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenTableMap={() => {
          setIsCartOpen(false);
          setIsTableMapOpen(true);
        }}
      />

      <TableAvailabilityMap
        isOpen={isTableMapOpen}
        onClose={() => setIsTableMapOpen(false)}
      />

      <QueueSystemModal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
      />

      {/* Item Customizer Modal */}
      <ItemCustomizerModal
        item={selectedItemForCustomizer}
        isOpen={!!selectedItemForCustomizer}
        onClose={() => setSelectedItemForCustomizer(null)}
        onAddToCart={(item, custom, qty) => {
          addToCart(item, custom, qty);
          setSelectedItemForCustomizer(null);
        }}
      />

    </div>
  );
};
