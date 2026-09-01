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
import { AdminLoginView } from './components/admin/AdminLoginView';
import { StaffPinModal } from './components/common/StaffPinModal';
import { BrandLogo } from './components/common/BrandLogo';
import { WifiOff, Lock } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    activeView, 
    isOnline, 
    isStaffAuthenticated, 
    isAdminRoute,
    navigateTo 
  } = useApp();

  // Global modals controlled from header or hotkeys
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTableMapOpen, setIsTableMapOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  // Global Keyboard Shortcuts (POS & Kitchen Fast Toggles)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        setIsTableMapOpen(false);
        setIsQueueOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 1. IF ON /admin AND NOT AUTHENTICATED: Show Dedicated Staff Admin Login
  if (isAdminRoute && !isStaffAuthenticated) {
    return <AdminLoginView />;
  }

  // 2. MAIN LAYOUT (Customer Storefront / or Authenticated Admin /admin)
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
        {isAdminRoute ? (
          /* ADMIN CONSOLE VIEWS */
          <>
            {activeView === 'kitchen' && <KitchenDashboard />}
            {activeView === 'pos' && <PosDashboard />}
            {activeView === 'inventory' && <InventoryDashboard />}
            {activeView === 'analytics' && <AnalyticsDashboard />}
            {activeView === 'tracker' && <LiveOrderTracker />}
            {activeView === 'customer' && <CustomerView />}
          </>
        ) : (
          /* CUSTOMER ONLINE STOREFRONT VIEWS */
          <>
            {activeView === 'tracker' ? <LiveOrderTracker /> : <CustomerView />}
          </>
        )}
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

          <div className="flex items-center space-x-3 text-[11px] text-gray-400">
            <span>© {new Date().getFullYear()} Extraction Point Specialty Cafe.</span>
            {!isAdminRoute && (
              <button
                onClick={() => navigateTo('/admin')}
                className="hover:text-[#c5a880] text-gray-400/80 flex items-center space-x-1 transition-colors underline"
                title="Staff & Management Login"
              >
                <Lock className="w-3 h-3" />
                <span>Staff Portal</span>
              </button>
            )}
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

      {/* Staff PIN Keypad Modal */}
      <StaffPinModal />
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
