import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { TableQrStandModal } from '../customer/TableQrStandModal';
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
  ShoppingBag,
  Users,
  QrCode,
  MapPin
} from 'lucide-react';
import { ActiveView } from '../../types';

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
    orders,
    activeOrders,
    queue,
    trackedOrderId,
    isQrCustomerMode,
    qrTableNumber,
    exitCustomerQrMode,
  } = useApp();

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const waitingQueueCount = queue.filter((q) => q.status === 'waiting').length;
  const activeTrackedOrder = orders.find((o) => o.id === trackedOrderId);
  const isTrackerBadgeActive = activeTrackedOrder && activeTrackedOrder.status !== 'completed' && activeTrackedOrder.status !== 'served';

  const navItems: { id: ActiveView; fullLabel: string; shortLabel: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'customer', fullLabel: 'Menu Ordering', shortLabel: 'Menu', icon: <Coffee className="w-4 h-4" /> },
    { id: 'kitchen', fullLabel: 'Kitchen KDS', shortLabel: 'KDS', icon: <UtensilsCrossed className="w-4 h-4" />, badge: activeOrders.length },
    { id: 'pos', fullLabel: 'Counter POS', shortLabel: 'POS', icon: <Store className="w-4 h-4" /> },
    { id: 'inventory', fullLabel: 'Inventory & Waste', shortLabel: 'Inventory', icon: <Package className="w-4 h-4" /> },
    { id: 'analytics', fullLabel: 'Sales & Z-Report', shortLabel: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'tracker', fullLabel: 'Order Tracker', shortLabel: 'Tracker', icon: <Clock className="w-4 h-4" />, badge: isTrackerBadgeActive ? 1 : 0 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#faf8f5]/95 dark:bg-[#0c0c0e]/95 backdrop-blur-md border-b border-[#e5e0d8] dark:border-[#222226] transition-colors select-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          
          {/* Single Main Navbar Row - Fixed height, No vertical scrollbar */}
          <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
            
            {/* Logo & Cafe Brand */}
            <div 
              onClick={() => setActiveView('customer')}
              className="flex items-center cursor-pointer group hover:opacity-90 transition-opacity flex-shrink-0"
            >
              <BrandLogo variant="horizontal" size="sm" showTagline={false} />
            </div>

            {/* CUSTOMER QR MODE: If customer scanned table QR code, hide staff tabs and show Table badge */}
            {isQrCustomerMode ? (
              <div className="flex items-center space-x-2 bg-[#111111] dark:bg-[#18181c] text-white px-3.5 py-1.5 rounded-2xl border border-[#c5a880]/40 shadow-sm">
                <MapPin className="w-4 h-4 text-[#c5a880] animate-bounce" />
                <span className="font-brand font-bold text-xs">
                  {qrTableNumber ? `Table ${qrTableNumber} (Dine-In)` : 'Self-Ordering'}
                </span>
                <button
                  type="button"
                  onClick={exitCustomerQrMode}
                  className="ml-2 text-[10px] text-gray-400 hover:text-white underline"
                  title="Switch back to Staff View"
                >
                  Exit QR
                </button>
              </div>
            ) : (
              /* STAFF VIEW: Navigation Tabs for Desktop & Tablet */
              <>
                <nav className="hidden lg:flex items-center space-x-1 bg-[#ede8e1]/70 dark:bg-[#18181c]/90 p-1 rounded-2xl border border-[#ded8cf] dark:border-[#2a2a30]">
                  {navItems.map((item) => {
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-brand font-bold transition-all relative whitespace-nowrap ${
                          isActive
                            ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] shadow-sm'
                            : 'text-[#555555] dark:text-[#a0a0aa] hover:text-[#111111] dark:hover:text-[#f8f7f4] hover:bg-[#e4ded5]/50 dark:hover:bg-[#26262c]/50'
                        }`}
                      >
                        {item.icon}
                        <span className="hidden xl:inline">{item.fullLabel}</span>
                        <span className="inline xl:hidden">{item.shortLabel}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={`ml-1 px-1.5 py-0.2 text-[9.5px] rounded-full font-bold font-mono ${
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

                {/* Tablet Medium Screen Navigation (768px - 1024px) */}
                <nav className="hidden md:flex lg:hidden items-center space-x-1 bg-[#ede8e1]/70 dark:bg-[#18181c]/90 p-1 rounded-2xl border border-[#ded8cf] dark:border-[#2a2a30]">
                  {navItems.map((item) => {
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`inline-flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-brand font-bold transition-all whitespace-nowrap ${
                          isActive
                            ? 'bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] shadow-sm'
                            : 'text-[#555555] dark:text-[#a0a0aa] hover:text-[#111111] dark:hover:text-[#f8f7f4]'
                        }`}
                        title={item.fullLabel}
                      >
                        {item.icon}
                        <span>{item.shortLabel}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={`ml-1 px-1.5 py-0.2 text-[9px] rounded-full font-mono font-bold ${
                              isActive ? 'bg-[#c5a880] text-black' : 'bg-[#c5a880]/25 text-[#9d7f57] dark:text-[#dfcca9]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </>
            )}

            {/* Right Action Icons & Controls */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
              
              {/* QR Stand Print & Generator Button (Staff View) */}
              {!isQrCustomerMode && (
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-brand font-bold bg-[#c5a880]/15 text-[#9d7f57] dark:text-[#dfcca9] hover:bg-[#c5a880]/25 border border-[#c5a880]/30 transition-all"
                  title="Print Table QR Stands or Simulate Customer Phone Scan"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span className="hidden sm:inline">Table QRs</span>
                </button>
              )}

              {/* Live Queue Button (Customer quick access) */}
              {activeView === 'customer' && !isQrCustomerMode && onOpenQueue && (
                <button
                  onClick={onOpenQueue}
                  className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-brand font-bold bg-[#efeae1] dark:bg-[#1e1e23] text-[#333333] dark:text-[#dedede] hover:border-[#c5a880] border border-[#ded8ce] dark:border-[#2a2a32] transition-all"
                  title="View Waiting Queue & Party List"
                >
                  <Users className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Queue:</span>
                  <span className="font-mono text-[#c5a880] font-black">{waitingQueueCount}</span>
                </button>
              )}

              {/* Table Floor Map (Customer quick access) */}
              {activeView === 'customer' && !isQrCustomerMode && onOpenTableMap && (
                <button
                  onClick={onOpenTableMap}
                  className="hidden xl:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-brand font-bold bg-[#efeae1] dark:bg-[#1e1e23] text-[#333333] dark:text-[#dedede] hover:border-[#c5a880] border border-[#ded8ce] dark:border-[#2a2a32] transition-all"
                  title="View Table Availability Map"
                >
                  <Store className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Tables</span>
                </button>
              )}

              {/* Online Status Dot */}
              <div
                title={isOnline ? 'System Online & Synced' : 'Offline Mode Active'}
                className="p-2 rounded-xl text-gray-500 hover:bg-[#eae4db] dark:hover:bg-[#222226] transition-colors"
              >
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-emerald-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-amber-500 animate-pulse" />
                )}
              </div>

              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                className="p-2 rounded-xl text-[#666666] dark:text-[#999999] hover:bg-[#eae4db] dark:hover:bg-[#222226] border border-transparent hover:border-[#ded8ce] dark:hover:border-[#2a2a32] transition-colors"
                title={soundEnabled ? 'Mute Sound Chimes' : 'Enable Sound Chimes'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#111111] dark:text-white" /> : <VolumeX className="w-4 h-4 text-red-500" />}
              </button>

              {/* Dark / Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-[#666666] dark:text-[#999999] hover:bg-[#eae4db] dark:hover:bg-[#222226] border border-transparent hover:border-[#ded8ce] dark:hover:border-[#2a2a32] transition-colors"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-[#dfcca9]" /> : <Moon className="w-4 h-4 text-[#111111]" />}
              </button>

              {/* Cart Drawer Trigger */}
              {onOpenCart && (
                <button
                  onClick={onOpenCart}
                  className="relative inline-flex items-center justify-center px-3 py-2 rounded-xl bg-[#111111] dark:bg-[#f8f7f4] text-white dark:text-[#111111] hover:opacity-90 active:scale-95 transition-all shadow-md font-brand font-bold text-xs"
                  title="View Cart & Checkout"
                >
                  <ShoppingBag className="w-4 h-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">Cart</span>
                  {cartTotals.itemCount > 0 ? (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-md bg-[#c5a880] text-black font-black font-mono text-[10px]">
                      {cartTotals.itemCount}
                    </span>
                  ) : null}
                </button>
              )}
            </div>
          </div>

          {/* Mobile View Switcher (Under 768px only, for staff view) */}
          {!isQrCustomerMode && (
            <div className="flex md:hidden overflow-x-auto py-2 space-x-1.5 no-scrollbar border-t border-[#eae4db] dark:border-[#1e1e22]">
              {navItems.map((item) => {
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
