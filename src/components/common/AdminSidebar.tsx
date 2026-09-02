import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveView } from '../../types';
import { 
  Coffee, 
  UtensilsCrossed, 
  Store, 
  Package, 
  BarChart3, 
  Clock, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Wifi, 
  WifiOff, 
  QrCode, 
  Unlock, 
  ExternalLink, 
  ShieldCheck, 
  LayoutGrid,
  Menu as MenuIcon,
  X,
  ChevronRight
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { TableQrStandModal } from '../customer/TableQrStandModal';

interface AdminSidebarProps {
  onOpenQrModal?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onOpenQrModal }) => {
  const {
    activeView,
    setActiveView,
    theme,
    toggleTheme,
    isOnline,
    soundEnabled,
    toggleSound,
    activeOrders,
    orders,
    tables,
    trackedOrderId,
    qrTableNumber,
    lockStaffMode,
    navigateTo,
  } = useApp();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const activeTrackedOrder = qrTableNumber 
    ? orders.find((o) => o.tableNumber === qrTableNumber && o.status !== 'completed' && o.status !== 'served')
    : trackedOrderId 
    ? orders.find((o) => o.id === trackedOrderId && !o.tableNumber && o.status !== 'completed' && o.status !== 'served')
    : null;
  const isTrackerBadgeActive = Boolean(activeTrackedOrder);
  const occupiedTablesCount = tables.filter((t) => t.status === 'occupied').length;

  interface NavItem {
    id: ActiveView;
    title: string;
    description: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }

  const operationsItems: NavItem[] = [
    {
      id: 'pos',
      title: 'Counter POS',
      description: 'Point-of-Sale register & punch orders',
      icon: <Store className="w-4 h-4" />,
    },
    {
      id: 'kitchen',
      title: 'Kitchen KDS',
      description: 'Order tickets & preparation queues',
      icon: <UtensilsCrossed className="w-4 h-4" />,
      badge: activeOrders.length > 0 ? activeOrders.length : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'tables',
      title: 'Table Floor Plan',
      description: 'Dine-in seating map & table availability',
      icon: <LayoutGrid className="w-4 h-4" />,
      badge: occupiedTablesCount > 0 ? occupiedTablesCount : undefined,
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      id: 'tracker',
      title: 'Order Tracker Board',
      description: 'Sticky note barista ticketing pinboard',
      icon: <Clock className="w-4 h-4" />,
      badge: isTrackerBadgeActive ? 1 : undefined,
      badgeColor: 'bg-amber-500 text-black',
    },
  ];

  const managementItems: NavItem[] = [
    {
      id: 'inventory',
      title: 'Inventory & Stocks',
      description: 'Ingredient depletion & recipes',
      icon: <Package className="w-4 h-4" />,
    },
    {
      id: 'analytics',
      title: 'Sales & Z-Report',
      description: 'Revenue, discounts & daily totals',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'customer',
      title: 'Menu Preview',
      description: 'Customer digital menu catalog',
      icon: <Coffee className="w-4 h-4" />,
    },
  ];

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setIsMobileOpen(false);
  };

  const handleOpenQr = () => {
    if (onOpenQrModal) {
      onOpenQrModal();
    } else {
      setIsQrModalOpen(true);
    }
    setIsMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#f6f2ec] dark:bg-[#0e0e11] border-r border-[#e5dfd5] dark:border-[#222227] text-[#1a1715] dark:text-[#f4f2ee] select-none">
      
      {/* 1. BRAND HEADER */}
      <div className="p-4 sm:p-5 border-b border-[#e5dfd5] dark:border-[#1e1e24] bg-[#ede7dc]/60 dark:bg-[#131317]/80">
        <div 
          onClick={() => handleNavClick('pos')} 
          className="cursor-pointer group hover:opacity-90 transition-opacity"
        >
          <BrandLogo variant="horizontal" size="sm" showTagline={false} />
          
          <div className="mt-2.5 flex items-center justify-between">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#c5a880]/20 text-[#8c6b3e] dark:text-[#dfcca9] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#c5a880]/30">
              <ShieldCheck className="w-3 h-3 text-[#c5a880]" />
              <span>Admin Console</span>
            </span>

            <div className="flex items-center space-x-1.5 text-[11px] text-gray-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION LIST (Scrollable, Full Text Wrapping) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        
        {/* Operations Section */}
        <div className="space-y-1.5">
          <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#888888] dark:text-[#777780]">
            Core Operations
          </div>
          
          <div className="space-y-1">
            {operationsItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start space-x-3 group relative ${
                    isActive
                      ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] shadow-md font-bold'
                      : 'text-[#444444] dark:text-[#b0b0b8] hover:bg-[#eae3d8] dark:hover:bg-[#1a1a20] hover:text-[#111111] dark:hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg flex-shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#c5a880] text-black shadow-xs'
                      : 'bg-[#ede7dc] dark:bg-[#202026] text-[#777777] dark:text-[#9999a0] group-hover:text-[#111111] dark:group-hover:text-white group-hover:bg-[#ded6c9] dark:group-hover:bg-[#2a2a34]'
                  }`}>
                    {item.icon}
                  </div>

                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold leading-tight break-words">
                        {item.title}
                      </span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-1.5 py-0.5 text-[9.5px] rounded-full font-mono font-black shadow-xs ${
                          item.badgeColor || 'bg-[#c5a880] text-black'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-[10.5px] leading-snug mt-0.5 line-clamp-2 ${
                      isActive ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Management Section */}
        <div className="space-y-1.5">
          <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#888888] dark:text-[#777780]">
            Management & Reports
          </div>
          
          <div className="space-y-1">
            {managementItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start space-x-3 group relative ${
                    isActive
                      ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] shadow-md font-bold'
                      : 'text-[#444444] dark:text-[#b0b0b8] hover:bg-[#eae3d8] dark:hover:bg-[#1a1a20] hover:text-[#111111] dark:hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg flex-shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#c5a880] text-black shadow-xs'
                      : 'bg-[#ede7dc] dark:bg-[#202026] text-[#777777] dark:text-[#9999a0] group-hover:text-[#111111] dark:group-hover:text-white group-hover:bg-[#ded6c9] dark:group-hover:bg-[#2a2a34]'
                  }`}>
                    {item.icon}
                  </div>

                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold leading-tight break-words">
                        {item.title}
                      </span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-1.5 py-0.5 text-[9.5px] rounded-full font-mono font-black shadow-xs ${
                          item.badgeColor || 'bg-[#c5a880] text-black'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-[10.5px] leading-snug mt-0.5 line-clamp-2 ${
                      isActive ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Tools & Shortcuts */}
        <div className="space-y-1.5">
          <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#888888] dark:text-[#777780]">
            Quick Tools
          </div>

          <div className="space-y-1.5">
            <button
              onClick={handleOpenQr}
              className="w-full text-left p-2.5 rounded-xl border border-[#ded8ce] dark:border-[#222228] bg-[#ede7dc]/50 dark:bg-[#151519] hover:bg-[#c5a880]/15 hover:border-[#c5a880]/50 text-gray-700 dark:text-gray-300 transition-all flex items-center space-x-3 group"
            >
              <div className="p-2 rounded-lg bg-[#c5a880]/20 text-[#c5a880] group-hover:scale-105 transition-transform flex-shrink-0">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold block leading-tight text-[#111111] dark:text-white">
                  Table QR Stands
                </span>
                <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">
                  Generate & print table QR codes
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#c5a880] transition-colors" />
            </button>

            <button
              onClick={() => navigateTo('/')}
              className="w-full text-left p-2.5 rounded-xl border border-[#ded8ce] dark:border-[#222228] bg-[#ede7dc]/50 dark:bg-[#151519] hover:bg-[#c5a880]/15 hover:border-[#c5a880]/50 text-gray-700 dark:text-gray-300 transition-all flex items-center space-x-3 group"
            >
              <div className="p-2 rounded-lg bg-white dark:bg-[#202026] text-[#c5a880] group-hover:scale-105 transition-transform flex-shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold block leading-tight text-[#111111] dark:text-white">
                  Customer Storefront
                </span>
                <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">
                  Open public online menu
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#c5a880] transition-colors" />
            </button>
          </div>
        </div>

      </div>

      {/* 3. SYSTEM CONTROLS & LOCK FOOTER */}
      <div className="p-3.5 border-t border-[#e5dfd5] dark:border-[#1e1e24] bg-[#ede7dc]/60 dark:bg-[#131317]/80 space-y-2.5">
        
        {/* System Toolbar: Theme, Sound, Online */}
        <div className="flex items-center justify-between px-1">
          
          {/* Online status indicator */}
          <div className="flex items-center space-x-1.5 text-[11px] text-gray-600 dark:text-gray-400">
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-mono text-[10px] font-bold">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span className="font-mono text-[10px] font-bold text-amber-500">Offline</span>
              </>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {/* Sound Mute/Unmute */}
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-lg text-[#666666] dark:text-[#999999] hover:bg-[#ded7cc] dark:hover:bg-[#222228] transition-colors"
              title={soundEnabled ? 'Mute Sound Chimes' : 'Enable Sound Chimes'}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-[#111111] dark:text-white" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-red-500" />
              )}
            </button>

            {/* Dark/Light Mode */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-[#666666] dark:text-[#999999] hover:bg-[#ded7cc] dark:hover:bg-[#222228] transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-[#dfcca9]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#111111]" />
              )}
            </button>
          </div>
        </div>

        {/* Lock Console Button */}
        <button
          onClick={lockStaffMode}
          className="w-full py-2 px-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-98"
        >
          <Unlock className="w-3.5 h-3.5 text-amber-500" />
          <span>Lock Admin Console</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* DESKTOP / TABLET FIXED LEFT SIDEBAR (>= md) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 flex-shrink-0 min-h-screen sticky top-0 z-40">
        {sidebarContent}
      </aside>

      {/* MOBILE TOP BAR WITH HAMBURGER TOGGLE (< md) */}
      <header className="md:hidden sticky top-0 z-40 bg-[#f6f2ec]/95 dark:bg-[#0e0e11]/95 backdrop-blur-md border-b border-[#e5dfd5] dark:border-[#222227] px-4 py-3 flex items-center justify-between">
        <div 
          onClick={() => handleNavClick('pos')} 
          className="flex items-center space-x-2 cursor-pointer"
        >
          <BrandLogo variant="horizontal" size="sm" showTagline={false} />
          <span className="px-2 py-0.5 rounded-md bg-[#c5a880]/20 text-[#8c6b3e] dark:text-[#dfcca9] text-[9px] font-mono font-bold uppercase tracking-wider">
            Admin
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl bg-[#ede7dc] dark:bg-[#1a1a20] text-[#111111] dark:text-white border border-[#ded8ce] dark:border-[#2a2a32]"
            aria-label="Open Navigation Menu"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MOBILE SLIDE-OUT DRAWER (< md) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fadeIn">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
            onClick={() => setIsMobileOpen(false)} 
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 flex flex-col">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-3 z-50 p-1.5 rounded-full bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300"
              aria-label="Close Navigation Menu"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Table QR Stand Generator Modal */}
      <TableQrStandModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </>
  );
};
