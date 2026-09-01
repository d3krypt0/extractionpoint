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
  ShoppingBag, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Wifi, 
  WifiOff, 
  MapPin, 
  QrCode, 
  Users,
  Unlock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { TableQrStandModal } from '../customer/TableQrStandModal';

interface HeaderProps {
  onOpenCart?: () => void;
  onOpenTableMap?: () => void;
  onOpenQueue?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  onOpenTableMap,
  onOpenQueue,
}) => {
  const {
    activeView,
    setActiveView,
    theme,
    toggleTheme,
    isOnline,
    soundEnabled,
    toggleSound,
    cartTotals,
    activeOrders,
    orders,
    trackedOrderId,
    queue,
    qrTableNumber,
    lockStaffMode,
    isAdminRoute,
    navigateTo,
  } = useApp();

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const waitingQueueCount = queue.filter((q) => q.status === 'waiting').length;
  const activeTrackedOrder = orders.find((o) => o.id === trackedOrderId);
  const isTrackerBadgeActive = activeTrackedOrder && activeTrackedOrder.status !== 'completed' && activeTrackedOrder.status !== 'served';

  // Admin Console Navigation (POS as default / first tab)
  const adminNavItems: { id: ActiveView; fullLabel: string; shortLabel: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'pos', fullLabel: 'Counter POS', shortLabel: 'POS', icon: <Store className="w-3.5 h-3.5" /> },
    { id: 'kitchen', fullLabel: 'Kitchen KDS', shortLabel: 'KDS', icon: <UtensilsCrossed className="w-3.5 h-3.5" />, badge: activeOrders.length },
    { id: 'inventory', fullLabel: 'Inventory & Stocks', shortLabel: 'Stocks', icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'analytics', fullLabel: 'Sales & Z-Report', shortLabel: 'Z-Report', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'tracker', fullLabel: 'Order Tracker', shortLabel: 'Tracker', icon: <Clock className="w-3.5 h-3.5" />, badge: isTrackerBadgeActive ? 1 : 0 },
    { id: 'customer', fullLabel: 'Menu Preview', shortLabel: 'Menu', icon: <Coffee className="w-3.5 h-3.5" /> },
  ];

  // Customer Navigation
  const customerNavItems: { id: ActiveView; fullLabel: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'customer', fullLabel: 'Menu Ordering', icon: <Coffee className="w-4 h-4" /> },
    { id: 'tracker', fullLabel: 'Live Order Tracker', icon: <Clock className="w-4 h-4" />, badge: isTrackerBadgeActive ? 1 : 0 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#faf8f5]/95 dark:bg-[#0c0c0e]/95 backdrop-blur-md border-b border-[#e5e0d8] dark:border-[#222226] transition-colors select-none w-full">
        <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6">
          
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            
            {/* Left: Brand Logo */}
            <div 
              onClick={() => {
                if (isAdminRoute) {
                  setActiveView('pos');
                } else {
                  setActiveView('customer');
                }
              }}
              className="flex items-center cursor-pointer group hover:opacity-90 transition-opacity flex-shrink-0"
            >
              <BrandLogo variant="horizontal" size="sm" showTagline={false} />
              {isAdminRoute && (
                <span className="hidden xl:inline-flex items-center space-x-1 ml-2.5 px-2 py-0.5 rounded-md bg-[#c5a880]/20 text-[#c5a880] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#c5a880]/30">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Console</span>
                </span>
              )}
            </div>

            {/* Center: NAVIGATION AREA */}
            <div className="flex-1 flex items-center justify-center min-w-0 px-1 sm:px-3">
              {isAdminRoute ? (
                /* ADMIN CONSOLE TABS */
                <nav className="hidden md:flex items-center space-x-1 bg-[#ede8e1]/70 dark:bg-[#18181c]/90 p-1 rounded-2xl border border-[#ded8cf] dark:border-[#2a2a30] max-w-full overflow-x-auto no-scrollbar">
                  {adminNavItems.map((item) => {
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`inline-flex items-center justify-center space-x-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-brand font-bold transition-all relative whitespace-nowrap flex-shrink-0 ${
                          isActive
                            ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] shadow-sm'
                            : 'text-[#555555] dark:text-[#a0a0aa] hover:text-[#111111] dark:hover:text-[#f8f7f4] hover:bg-[#e4ded5]/50 dark:hover:bg-[#26262c]/50'
                        }`}
                      >
                        {item.icon}
                        <span className="hidden 2xl:inline">{item.fullLabel}</span>
                        <span className="inline 2xl:hidden">{item.shortLabel}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={`ml-1 px-1.5 py-0.2 text-[9px] rounded-full font-bold font-mono ${
                              isActive
                                ? 'bg-[#c5a880] text-black'
                                : 'bg-[#c5a880]/25 text-[#9d7f57] dark:text-[#dfcca9]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              ) : qrTableNumber ? (
                /* CUSTOMER QR MODE: Prominent High-Legibility Table Badge (ONLY if scanned from a QR table) */
                <div className="flex items-center space-x-2 bg-[#111111] dark:bg-black text-white px-3.5 sm:px-4 py-1.5 rounded-full border-2 border-[#c5a880] shadow-md flex-shrink-0 animate-fadeIn">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <MapPin className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                  <span className="font-sans font-black text-xs sm:text-sm tracking-wide uppercase text-white whitespace-nowrap">
                    TABLE <span className="text-[#c5a880] font-mono text-sm sm:text-base font-black px-1.5 py-0.5 rounded bg-white/10 ml-0.5">{qrTableNumber}</span>
                    <span className="hidden xs:inline ml-1.5 text-[10.5px] font-bold text-gray-300 font-sans tracking-normal">(DINE-IN)</span>
                  </span>
                </div>
              ) : (
                /* DEFAULT CUSTOMER VIEW: Clean Online Storefront Navigation */
                <nav className="hidden sm:flex items-center space-x-1 bg-[#ede8e1]/70 dark:bg-[#18181c]/90 p-1 rounded-2xl border border-[#ded8cf] dark:border-[#2a2a30]">
                  {customerNavItems.map((item) => {
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-brand font-bold transition-all ${
                          isActive
                            ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] shadow-sm'
                            : 'text-[#555555] dark:text-[#a0a0aa] hover:text-[#111111] dark:hover:text-[#f8f7f4]'
                        }`}
                      >
                        {item.icon}
                        <span>{item.fullLabel}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={`ml-1 px-1.5 py-0.2 text-[9.5px] rounded-full font-bold font-mono ${
                              isActive ? 'bg-[#c5a880] text-black' : 'bg-[#c5a880]/25 text-[#9d7f57]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>

            {/* Right Action Icons & Controls */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
              
              {/* ADMIN CONSOLE: QR Stand Generator Button */}
              {isAdminRoute && (
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-brand font-bold bg-[#c5a880]/15 text-[#9d7f57] dark:text-[#dfcca9] hover:bg-[#c5a880]/25 border border-[#c5a880]/30 transition-all"
                  title="Print Table QR Stands or Generate QR Codes"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span className="hidden sm:inline">Table QRs</span>
                </button>
              )}

              {/* ADMIN CONSOLE: View Customer Storefront Button */}
              {isAdminRoute && (
                <button
                  onClick={() => navigateTo('/')}
                  className="hidden xl:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-brand font-bold bg-white dark:bg-[#1a1a1f] text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white border border-[#ded8ce] dark:border-[#2a2a30] transition-all"
                  title="Open Online Customer Storefront"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Customer Storefront</span>
                </button>
              )}

              {/* ADMIN CONSOLE: Lock / Logout Button */}
              {isAdminRoute && (
                <button
                  onClick={lockStaffMode}
                  className="p-1.5 sm:p-2 rounded-xl text-amber-500 hover:bg-amber-500/10 border border-amber-500/30 transition-colors"
                  title="Lock Admin Console & Logout"
                >
                  <Unlock className="w-3.5 h-3.5" />
                </button>
              )}

              {/* CUSTOMER STOREFRONT ONLY: Reserve Seats / Floor Map */}
              {!isAdminRoute && onOpenTableMap && (
                <button
                  onClick={onOpenTableMap}
                  className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-brand font-bold bg-[#efeae1] dark:bg-[#1e1e23] text-[#333333] dark:text-[#dedede] hover:border-[#c5a880] border border-[#ded8ce] dark:border-[#2a2a32] transition-all"
                  title="View Table Availability & Reserve Dine-In Seat"
                >
                  <Store className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span className="hidden md:inline">Reserve Seats</span>
                  <span className="inline md:hidden">Tables</span>
                </button>
              )}

              {/* CUSTOMER STOREFRONT ONLY: Live Waiting Queue Button */}
              {!isAdminRoute && onOpenQueue && (
                <button
                  onClick={onOpenQueue}
                  className="hidden md:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-brand font-bold bg-[#efeae1] dark:bg-[#1e1e23] text-[#333333] dark:text-[#dedede] hover:border-[#c5a880] border border-[#ded8ce] dark:border-[#2a2a32] transition-all"
                  title="Join Live Waiting Queue"
                >
                  <Users className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Queue:</span>
                  <span className="font-mono text-[#c5a880] font-black">{waitingQueueCount}</span>
                </button>
              )}

              {/* Online Status Dot */}
              <div
                title={isOnline ? 'System Online & Synced' : 'Offline Mode Active'}
                className="p-1.5 sm:p-2 rounded-xl text-gray-500 hover:bg-[#eae4db] dark:hover:bg-[#222226] transition-colors"
              >
                {isOnline ? (
                  <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                )}
              </div>

              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                className="p-1.5 sm:p-2 rounded-xl text-[#666666] dark:text-[#999999] hover:bg-[#eae4db] dark:hover:bg-[#222226] border border-transparent hover:border-[#ded8ce] dark:hover:border-[#2a2a32] transition-colors"
                title={soundEnabled ? 'Mute Sound Chimes' : 'Enable Sound Chimes'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#111111] dark:text-white" /> : <VolumeX className="w-3.5 h-3.5 text-red-500" />}
              </button>

              {/* Dark / Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-xl text-[#666666] dark:text-[#999999] hover:bg-[#eae4db] dark:hover:bg-[#222226] border border-transparent hover:border-[#ded8ce] dark:hover:border-[#2a2a32] transition-colors"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#dfcca9]" /> : <Moon className="w-3.5 h-3.5 text-[#111111]" />}
              </button>

              {/* Cart Drawer Trigger (Storefront) */}
              {!isAdminRoute && onOpenCart && (
                <button
                  onClick={onOpenCart}
                  className="relative inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] hover:opacity-90 active:scale-95 transition-all shadow-md font-brand font-bold text-xs flex-shrink-0"
                  title="View Cart & Checkout"
                >
                  <ShoppingBag className="w-3.5 h-3.5 sm:mr-1" />
                  <span className="hidden sm:inline">Cart</span>
                  {cartTotals.itemCount > 0 ? (
                    <span className="ml-1 px-1.5 py-0.2 rounded-md bg-[#c5a880] text-black font-black font-mono text-[10px]">
                      {cartTotals.itemCount}
                    </span>
                  ) : null}
                </button>
              )}
            </div>
          </div>

          {/* Admin Mobile View Switcher (Under 768px in /admin only) */}
          {isAdminRoute && (
            <div className="flex md:hidden overflow-x-auto py-2 space-x-1.5 no-scrollbar border-t border-[#eae4db] dark:border-[#1e1e22]">
              {adminNavItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-brand font-bold transition-all flex-shrink-0 ${
                      isActive
                        ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] shadow-sm'
                        : 'bg-[#ede8e1]/80 dark:bg-[#18181c] text-[#555555] dark:text-[#a0a0aa] border border-[#ded8cf] dark:border-[#26262b]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.shortLabel}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-[#c5a880] text-black font-mono font-black">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

        </div>
      </header>

      {/* Table QR Stand Generator Modal */}
      <TableQrStandModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </>
  );
};
