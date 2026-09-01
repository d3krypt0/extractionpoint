import React, { useState, useEffect } from 'react';
import { useApp, AppProvider } from './context/AppContext';
import { Header } from './components/common/Header';
import { CustomerView } from './components/customer/CustomerView';
import { KitchenDashboard } from './components/kitchen/KitchenDashboard';
import { PosDashboard } from './components/pos/PosDashboard';
import { InventoryDashboard } from './components/inventory/InventoryDashboard';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { LiveOrderTracker } from './components/customer/LiveOrderTracker';
import { CartCheckoutModal } from './components/customer/CartCheckoutModal';
import { TableAvailabilityMap } from './components/customer/TableAvailabilityMap';
import { QueueSystemModal } from './components/customer/QueueSystemModal';
import { BrandLogo } from './components/common/BrandLogo';
import { WifiOff } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeView, isOnline } = useApp();

  // Global modals controlled from header or hotkeys
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTableMapOpen, setIsTableMapOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  // Global Keyboard Shortcuts (POS & Kitchen Fast Toggles)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes open modals
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        setIsTableMapOpen(false);
        setIsQueueOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] dark:bg-[#0a0a0a] text-[#1a1715] dark:text-[#f4f2ee] transition-colors duration-200">
      
      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-black px-4 py-2 text-xs font-bold flex items-center justify-center space-x-2 shadow-md">
          <WifiOff className="w-4 h-4" />
          <span>Offline Mode Active: Local caching enabled. Orders and updates will sync once reconnected.</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTableMap={() => setIsTableMapOpen(true)}
        onOpenQueue={() => setIsQueueOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {activeView === 'customer' && <CustomerView />}
        {activeView === 'kitchen' && <KitchenDashboard />}
        {activeView === 'pos' && <PosDashboard />}
        {activeView === 'inventory' && <InventoryDashboard />}
        {activeView === 'analytics' && <AnalyticsDashboard />}
        {activeView === 'tracker' && <LiveOrderTracker />}
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#0d0d0f] border-t border-[#e8e2d8] dark:border-[#1e1e24] py-8 px-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo variant="horizontal" size="sm" showTagline={true} />

          <div className="flex items-center space-x-4 text-[11px]">
            <a 
              href="https://instagram.com/ext.point_" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-[#c5a880] transition-colors"
            >
              Instagram: @ext.point_
            </a>
            <span>•</span>
            <a 
              href="https://www.facebook.com/ExtractionPointPh" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-[#c5a880] transition-colors"
            >
              Facebook: @ExtractionPointPh
            </a>
          </div>

          <div className="text-[11px] text-gray-400">
            © {new Date().getFullYear()} Extraction Point Specialty Cafe. All Rights Reserved.
          </div>
        </div>
      </footer>

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
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
