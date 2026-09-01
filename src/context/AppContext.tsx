import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  ActiveView,
  CartItem,
  CustomizationOption,
  InventoryItem,
  KitchenStation,
  MenuItem,
  Order,
  OrderStatus,
  OrderType,
  QueueTicket,
  Table,
  TableStatus,
  WasteLog,
  ZReadingReport,
} from '../types';
import { MENU_ITEMS } from '../data/menuData';
import { INITIAL_INVENTORY } from '../data/initialInventory';
import { INITIAL_TABLES } from '../data/initialTables';
import { INITIAL_ORDERS, INITIAL_QUEUE } from '../data/initialOrders';
import { calculatePhilippineTaxesAndDiscounts, generateReceiptNumber } from '../utils/phCurrency';
import { sounds } from '../utils/audio';

interface AppContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isOnline: boolean;
  soundEnabled: boolean;
  toggleSound: () => void;
  kdsStationFilter: KitchenStation;
  setKdsStationFilter: (station: KitchenStation) => void;

  // Menu & Cart
  menuItems: MenuItem[];
  toggleSoldOut: (itemId: string) => void;
  cart: CartItem[];
  addToCart: (item: MenuItem, customization?: CustomizationOption, quantity?: number) => void;
  updateCartQuantity: (cartId: string, quantity: number) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  cartTotals: {
    itemCount: number;
    subtotal: number;
  };

  // Orders
  orders: Order[];
  activeOrders: Order[];
  completedOrders: Order[];
  trackedOrderId: string | null;
  setTrackedOrderId: (orderId: string | null) => void;
  placeOrder: (details: {
    type: OrderType;
    tableNumber?: number;
    customerName: string;
    customerPhone?: string;
    paymentMethod: 'gcash' | 'cash';
    paymentDetails?: {
      gcashRef?: string;
      gcashMobile?: string;
      cashTendered?: number;
      changeGiven?: number;
      discountType?: 'senior_pwd' | 'promo' | 'none';
      seniorPwdId?: string;
      receiptNumber?: string;
    };
    discountType?: 'senior_pwd' | 'promo' | 'none';
    seniorPwdId?: string;
    isRush?: boolean;
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  toggleOrderItemCheck: (orderId: string, cartId: string) => void;

  // Tables
  tables: Table[];
  updateTableStatus: (tableId: string, status: TableStatus, customerName?: string) => void;
  selectedTableForOrdering: number | null;
  setSelectedTableForOrdering: (tableNumber: number | null) => void;

  // Queue
  queue: QueueTicket[];
  joinQueue: (data: {
    customerName: string;
    phone: string;
    partySize: number;
    preferredSection?: 'indoor' | 'patio' | 'any';
  }) => QueueTicket;
  callQueueTicket: (ticketId: string) => void;
  seatQueueTicket: (ticketId: string, tableNumber?: number) => void;
  cancelQueueTicket: (ticketId: string) => void;

  // Inventory & Waste
  inventory: InventoryItem[];
  restockInventory: (ingredientId: string, quantityToAdd: number) => void;
  wasteLogs: WasteLog[];
  logFoodWaste: (log: {
    itemId: string;
    itemName: string;
    quantity: number;
    unit: string;
    costPhp: number;
    reason: 'barista_error' | 'expired_spoilage' | 'spill_accident' | 'quality_rejection' | 'sampling';
    loggedBy: string;
    notes?: string;
  }) => void;

  // Analytics & Z-Reading
  zReports: ZReadingReport[];
  generateZReading: (closedBy: string, cashOnHandActual: number, beginningCash?: number) => ZReadingReport;

  // QR Table Self-Ordering Mode
  isQrCustomerMode: boolean;
  setIsQrCustomerMode: (mode: boolean) => void;
  qrTableNumber: number | null;
  setQrTableNumber: (table: number | null) => void;
  enterCustomerQrMode: (tableNumber?: number) => void;
  exitCustomerQrMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Storage Keys
const STORAGE_PREFIX = 'ext_point_';
const CHANNEL_NAME = 'extraction_point_sync_channel';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme & App Navigation
  const [activeView, setActiveView] = useState<ActiveView>('customer');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}theme`);
    return saved === 'light' ? 'light' : 'dark'; // Default to dark luxury editorial theme
  });
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [kdsStationFilter, setKdsStationFilter] = useState<KitchenStation>('all');
  const [selectedTableForOrdering, setSelectedTableForOrdering] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get('table');
      if (tableParam) {
        const num = parseInt(tableParam, 10);
        if (!isNaN(num) && num > 0) return num;
      }
    }
    return null;
  });

  // QR Customer Mode (Auto-enabled if URL has ?table=X or ?mode=customer_qr)
  const [isQrCustomerMode, setIsQrCustomerMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.has('table') || params.get('mode') === 'customer_qr' || params.get('mode') === 'qr';
    }
    return false;
  });

  const [qrTableNumber, setQrTableNumber] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get('table');
      if (tableParam) {
        const num = parseInt(tableParam, 10);
        if (!isNaN(num) && num > 0) return num;
      }
    }
    return null;
  });

  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(() => {
    return localStorage.getItem(`${STORAGE_PREFIX}trackedOrderId`) || 'ord-101';
  });

  // Menu items with sold-out persistence
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}menu`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return MENU_ITEMS;
  });

  // Active Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}cart`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  // Orders with item validation fallback
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}orders`);
    if (saved) {
      try {
        const parsed: Order[] = JSON.parse(saved);
        return parsed.map((o) => ({
          ...o,
          items: (o.items || []).map((it) => ({
            ...it,
            menuItem: it.menuItem || MENU_ITEMS[0],
          })),
        }));
      } catch {}
    }
    return INITIAL_ORDERS;
  });

  // Tables
  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}tables`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_TABLES;
  });

  // Queue
  const [queue, setQueue] = useState<QueueTicket[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}queue`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_QUEUE;
  });

  // Inventory
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}inventory`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_INVENTORY;
  });

  // Waste Logs
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}waste`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'w-01',
        timestamp: Date.now() - 1000 * 60 * 60 * 3,
        itemId: 'ing-fresh-milk',
        itemName: 'Fresh Dairy Barista Milk',
        quantity: 1.5,
        unit: 'L',
        costPhp: 165,
        reason: 'barista_error',
        loggedBy: 'Barista Carlo',
        notes: 'Over-steamed and scalded milk pitcher',
      },
      {
        id: 'w-02',
        timestamp: Date.now() - 1000 * 60 * 60 * 5,
        itemId: 'ing-croissant',
        itemName: 'French Butter Croissants',
        quantity: 2,
        unit: 'pcs',
        costPhp: 90,
        reason: 'quality_rejection',
        loggedBy: 'Kitchen Chef Mark',
        notes: 'Uneven oven rise',
      }
    ];
  });

  // Z-Reading Reports
  const [zReports, setZReports] = useState<ZReadingReport[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}zReports`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  // Broadcast Channel for Instant Multi-Tab Synchronous Updates
  const syncChannel = useMemo(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      return new BroadcastChannel(CHANNEL_NAME);
    }
    return null;
  }, []);

  const broadcastStateChange = useCallback((type: string, payload?: unknown) => {
    if (syncChannel) {
      syncChannel.postMessage({ type, payload, timestamp: Date.now() });
    }
  }, [syncChannel]);

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync with theme classes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(`${STORAGE_PREFIX}theme`, theme);
  }, [theme]);

  // Listen to BroadcastChannel for multi-tab sync
  useEffect(() => {
    if (!syncChannel) return;

    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data;
      if (type === 'MENU_UPDATE' && payload?.menuItems) {
        setMenuItems(payload.menuItems);
      } else if (type === 'SYNC_ALL' || type === 'ORDER_PLACED' || type === 'ORDER_UPDATED') {
        const savedOrders = localStorage.getItem(`${STORAGE_PREFIX}orders`);
        if (savedOrders) setOrders(JSON.parse(savedOrders));
        const savedTables = localStorage.getItem(`${STORAGE_PREFIX}tables`);
        if (savedTables) setTables(JSON.parse(savedTables));
        const savedQueue = localStorage.getItem(`${STORAGE_PREFIX}queue`);
        if (savedQueue) setQueue(JSON.parse(savedQueue));
        const savedInventory = localStorage.getItem(`${STORAGE_PREFIX}inventory`);
        if (savedInventory) setInventory(JSON.parse(savedInventory));
        const savedMenu = localStorage.getItem(`${STORAGE_PREFIX}menu`);
        if (savedMenu) setMenuItems(JSON.parse(savedMenu));

        if (type === 'ORDER_PLACED' && soundEnabled) {
          sounds.playNewOrderChime();
        }
      }
    };

    syncChannel.addEventListener('message', handleMessage);
    return () => syncChannel.removeEventListener('message', handleMessage);
  }, [syncChannel, soundEnabled]);

  // Persistent storage writers
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}menu`, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}cart`, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}tables`, JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}queue`, JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}inventory`, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}waste`, JSON.stringify(wasteLogs));
  }, [wasteLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}zReports`, JSON.stringify(zReports));
  }, [zReports]);

  useEffect(() => {
    if (trackedOrderId) {
      localStorage.setItem(`${STORAGE_PREFIX}trackedOrderId`, trackedOrderId);
    }
  }, [trackedOrderId]);

  // Toggle Theme
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Toggle Sound
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  // Menu: Toggle 86'd (Sold Out) with instant multi-tab sync
  const toggleSoldOut = useCallback((itemId: string) => {
    setMenuItems((prev) => {
      const updated = prev.map((item) =>
        item.id === itemId ? { ...item, isSoldOut: !item.isSoldOut } : item
      );
      localStorage.setItem(`${STORAGE_PREFIX}menu`, JSON.stringify(updated));
      broadcastStateChange('MENU_UPDATE', { menuItems: updated });
      return updated;
    });
  }, [broadcastStateChange]);

  // QR Self-Ordering mode triggers
  const enterCustomerQrMode = useCallback((tableNumber?: number) => {
    setIsQrCustomerMode(true);
    setActiveView('customer');
    if (tableNumber) {
      setQrTableNumber(tableNumber);
      setSelectedTableForOrdering(tableNumber);
    }
  }, []);

  const exitCustomerQrMode = useCallback(() => {
    setIsQrCustomerMode(false);
    setQrTableNumber(null);
  }, []);

  // Cart Operations
  const addToCart = useCallback((item: MenuItem, customization: CustomizationOption = {}, quantity: number = 1) => {
    let unitPrice = item.price;
    // Add milk substitute charge (+₱50)
    if (customization.milk && customization.milk !== 'regular') {
      unitPrice += 50;
    }
    // Add extra espresso shot (+₱80)
    if (customization.extraEspressoShots && customization.extraEspressoShots > 0) {
      unitPrice += customization.extraEspressoShots * 80;
    }
    // Horchata espresso shot
    if (customization.addEspressoShot) {
      unitPrice += 80;
    }

    const cartId = `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newCartItem: CartItem = {
      cartId,
      menuItem: item,
      quantity,
      customization,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };

    setCart((prev) => [...prev, newCartItem]);
  }, []);

  const updateCartQuantity = useCallback((cartId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.cartId !== cartId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
            : item
        )
      );
    }
  }, []);

  const removeFromCart = useCallback((cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotals = useMemo(() => {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    return { itemCount, subtotal };
  }, [cart]);

  // Deplete inventory based on order recipe ingredients
  const depleteInventoryForOrder = useCallback((orderItems: CartItem[]) => {
    setInventory((prevInventory) => {
      const updated = [...prevInventory];
      
      orderItems.forEach((cartItem) => {
        const recipe = cartItem.menuItem.recipeIngredients;
        if (!recipe) return;

        recipe.forEach((rec) => {
          const invIndex = updated.findIndex((inv) => inv.id === rec.ingredientId);
          if (invIndex !== -1) {
            const inv = updated[invIndex];
            // Convert units if needed (g to kg, ml to L)
            let deductAmount = rec.amount * cartItem.quantity;
            if (inv.unit === 'kg' && rec.unit === 'g') {
              deductAmount = deductAmount / 1000;
            } else if (inv.unit === 'L' && rec.unit === 'ml') {
              deductAmount = deductAmount / 1000;
            }
            
            const newStock = Math.max(0, Math.round((inv.currentStock - deductAmount) * 1000) / 1000);
            updated[invIndex] = { ...inv, currentStock: newStock };
          }
        });

        // Handle milk substitutions
        if (cartItem.customization.milk && cartItem.customization.milk !== 'regular') {
          const milkId = `ing-${cartItem.customization.milk}-milk`;
          const milkIndex = updated.findIndex((inv) => inv.id === milkId);
          if (milkIndex !== -1) {
            const milkInv = updated[milkIndex];
            const deduct = (0.16 * cartItem.quantity); // ~160ml
            updated[milkIndex] = {
              ...milkInv,
              currentStock: Math.max(0, Math.round((milkInv.currentStock - deduct) * 100) / 100),
            };
          }
        }
      });

      return updated;
    });
  }, []);

  // Place Order
  const placeOrder = useCallback(
    (details: {
      type: OrderType;
      tableNumber?: number;
      customerName: string;
      customerPhone?: string;
      paymentMethod: 'gcash' | 'cash';
      paymentDetails?: {
        gcashRef?: string;
        gcashMobile?: string;
        cashTendered?: number;
        changeGiven?: number;
        discountType?: 'senior_pwd' | 'promo' | 'none';
        seniorPwdId?: string;
        receiptNumber?: string;
      };
      discountType?: 'senior_pwd' | 'promo' | 'none';
      seniorPwdId?: string;
      isRush?: boolean;
      notes?: string;
    }): Order => {
      const orderCount = orders.length + 1;
      const orderNumber = `#EXT-${(100 + orderCount).toString()}`;
      const receiptNumber = generateReceiptNumber();

      const grossAmount = cartTotals.subtotal;
      const discountType = details.discountType || 'none';
      const calc = calculatePhilippineTaxesAndDiscounts(grossAmount, discountType);

      const initialItemStatuses: { [cartId: string]: boolean } = {};
      cart.forEach((i) => {
        initialItemStatuses[i.cartId] = false;
      });

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        type: details.type,
        tableNumber: details.tableNumber,
        customerName: details.customerName || 'Walk-in Guest',
        customerPhone: details.customerPhone,
        items: [...cart],
        itemStatuses: initialItemStatuses,
        status: 'placed',
        paymentMethod: details.paymentMethod,
        paymentStatus: 'paid',
        paymentDetails: {
          ...details.paymentDetails,
          receiptNumber,
          seniorPwdId: details.seniorPwdId,
          discountType,
        },
        subtotal: calc.subtotalGross,
        discountAmount: calc.discountAmount,
        vatExemptAmount: calc.vatExemptSales,
        vatAmount: calc.vatAmount,
        total: calc.totalPayable,
        createdAt: Date.now(),
        isRush: details.isRush,
        notes: details.notes,
      };

      // 1. Update orders list
      setOrders((prev) => [newOrder, ...prev]);

      // 2. Deplete inventory
      depleteInventoryForOrder(cart);

      // 3. If dine-in table specified, mark table as occupied
      if (details.type === 'dine_in' && details.tableNumber) {
        setTables((prev) =>
          prev.map((tbl) =>
            tbl.number === details.tableNumber
              ? {
                  ...tbl,
                  status: 'occupied',
                  activeOrderId: newOrder.id,
                  activeCustomerName: details.customerName,
                  lastOccupiedAt: Date.now(),
                }
              : tbl
          )
        );
      }

      // 4. Set as tracked order for customer live tracker
      setTrackedOrderId(newOrder.id);

      // 5. Clear cart
      clearCart();

      // 6. Play Audio sound
      if (soundEnabled) {
        sounds.playNewOrderChime();
      }

      // 7. Broadcast sync to all other open tabs (KDS, POS, Analytics)
      broadcastStateChange('ORDER_PLACED', newOrder);

      return newOrder;
    },
    [cart, cartTotals, orders.length, depleteInventoryForOrder, clearCart, soundEnabled, broadcastStateChange]
  );

  // Update Order Status (KDS / Barista lifecycle)
  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== orderId) return order;

          const updated: Order = { ...order, status };
          if (status === 'in_prep' && !order.prepStartedAt) {
            updated.prepStartedAt = Date.now();
          } else if (status === 'ready' && !order.readyAt) {
            updated.readyAt = Date.now();
            if (soundEnabled) sounds.playOrderReadyChime();
          } else if (status === 'served' || status === 'completed') {
            updated.completedAt = Date.now();
            // Free up table if dine in
            if (order.tableNumber) {
              setTables((prevTables) =>
                prevTables.map((tbl) =>
                  tbl.number === order.tableNumber
                    ? { ...tbl, status: 'cleaning', activeOrderId: undefined, activeCustomerName: undefined }
                    : tbl
                )
              );
            }
          }
          return updated;
        })
      );
      broadcastStateChange('ORDER_UPDATED', { orderId, status });
    },
    [soundEnabled, broadcastStateChange]
  );

  // Toggle single item strike-through on KDS ticket
  const toggleOrderItemCheck = useCallback(
    (orderId: string, cartId: string) => {
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== orderId) return order;
          const current = order.itemStatuses[cartId] ?? false;
          return {
            ...order,
            itemStatuses: {
              ...order.itemStatuses,
              [cartId]: !current,
            },
          };
        })
      );
      broadcastStateChange('ORDER_UPDATED', { orderId, cartId });
    },
    [broadcastStateChange]
  );

  // Table Management
  const updateTableStatus = useCallback(
    (tableId: string, status: TableStatus, customerName?: string) => {
      setTables((prev) =>
        prev.map((tbl) =>
          tbl.id === tableId
            ? {
                ...tbl,
                status,
                activeCustomerName: status === 'occupied' ? customerName || tbl.activeCustomerName : undefined,
                lastOccupiedAt: status === 'occupied' ? Date.now() : tbl.lastOccupiedAt,
              }
            : tbl
        )
      );
      broadcastStateChange('SYNC_ALL');
    },
    [broadcastStateChange]
  );

  // Queue Management
  const joinQueue = useCallback(
    (data: {
      customerName: string;
      phone: string;
      partySize: number;
      preferredSection?: 'indoor' | 'patio' | 'any';
    }): QueueTicket => {
      const waitingCount = queue.filter((q) => q.status === 'waiting').length;
      const ticketNum = `Q-${(waitingCount + 1).toString().padStart(3, '0')}`;
      const estimatedWait = Math.max(5, (waitingCount + 1) * 8);

      const newTicket: QueueTicket = {
        id: `q-${Date.now()}`,
        ticketNumber: ticketNum,
        customerName: data.customerName,
        phone: data.phone,
        partySize: data.partySize,
        preferredSection: data.preferredSection || 'any',
        status: 'waiting',
        createdAt: Date.now(),
        estimatedWaitMinutes: estimatedWait,
      };

      setQueue((prev) => [...prev, newTicket]);
      broadcastStateChange('SYNC_ALL');
      return newTicket;
    },
    [queue, broadcastStateChange]
  );

  const callQueueTicket = useCallback(
    (ticketId: string) => {
      setQueue((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, status: 'called', calledAt: Date.now(), estimatedWaitMinutes: 0 }
            : ticket
        )
      );
      if (soundEnabled) sounds.playQueueBell();
      broadcastStateChange('SYNC_ALL');
    },
    [soundEnabled, broadcastStateChange]
  );

  const seatQueueTicket = useCallback(
    (ticketId: string, tableNumber?: number) => {
      setQueue((prev) =>
        prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, status: 'seated' } : ticket))
      );
      if (tableNumber) {
        setTables((prev) =>
          prev.map((tbl) =>
            tbl.number === tableNumber
              ? { ...tbl, status: 'occupied', lastOccupiedAt: Date.now() }
              : tbl
          )
        );
      }
      broadcastStateChange('SYNC_ALL');
    },
    [broadcastStateChange]
  );

  const cancelQueueTicket = useCallback(
    (ticketId: string) => {
      setQueue((prev) =>
        prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, status: 'cancelled' } : ticket))
      );
      broadcastStateChange('SYNC_ALL');
    },
    [broadcastStateChange]
  );

  // Inventory Restock
  const restockInventory = useCallback(
    (ingredientId: string, quantityToAdd: number) => {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === ingredientId
            ? {
                ...item,
                currentStock: Math.round((item.currentStock + quantityToAdd) * 1000) / 1000,
                lastRestocked: Date.now(),
              }
            : item
        )
      );
      broadcastStateChange('SYNC_ALL');
    },
    [broadcastStateChange]
  );

  // Food Waste Logger
  const logFoodWaste = useCallback(
    (log: {
      itemId: string;
      itemName: string;
      quantity: number;
      unit: string;
      costPhp: number;
      reason: 'barista_error' | 'expired_spoilage' | 'spill_accident' | 'quality_rejection' | 'sampling';
      loggedBy: string;
      notes?: string;
    }) => {
      const newLog: WasteLog = {
        id: `w-${Date.now()}`,
        timestamp: Date.now(),
        ...log,
      };

      setWasteLogs((prev) => [newLog, ...prev]);

      // Also deduct from inventory
      setInventory((prev) =>
        prev.map((item) =>
          item.id === log.itemId
            ? {
                ...item,
                currentStock: Math.max(0, Math.round((item.currentStock - log.quantity) * 1000) / 1000),
              }
            : item
        )
      );

      broadcastStateChange('SYNC_ALL');
    },
    [broadcastStateChange]
  );

  // Z-Reading Shift Closing Generator (Philippine Compliance)
  const generateZReading = useCallback(
    (closedBy: string, cashOnHandActual: number, beginningCash: number = 2000): ZReadingReport => {
      const todayStr = new Date().toISOString().slice(0, 10);
      
      const grossSales = orders.reduce((sum, o) => sum + o.subtotal, 0);
      const seniorPwdDiscounts = orders.reduce((sum, o) => sum + o.discountAmount, 0);
      const vatableSales = orders.reduce((sum, o) => sum + o.vatAmount / 0.12, 0);
      const vatAmount = orders.reduce((sum, o) => sum + o.vatAmount, 0);
      const vatExemptSales = orders.reduce((sum, o) => sum + o.vatExemptAmount, 0);
      const netSales = orders.reduce((sum, o) => sum + o.total, 0);
      
      const gcashTotal = orders
        .filter((o) => o.paymentMethod === 'gcash')
        .reduce((sum, o) => sum + o.total, 0);
      const cashTotal = orders
        .filter((o) => o.paymentMethod === 'cash')
        .reduce((sum, o) => sum + o.total, 0);

      const cashOnHandExpected = beginningCash + cashTotal;
      const discrepancy = cashOnHandActual - cashOnHandExpected;

      const report: ZReadingReport = {
        id: `z-rep-${Date.now()}`,
        date: todayStr,
        openedAt: Date.now() - 1000 * 60 * 60 * 10,
        closedAt: Date.now(),
        beginningCash,
        grossSales,
        vatableSales,
        vatAmount,
        vatExemptSales,
        seniorPwdDiscounts,
        netSales,
        gcashTotal,
        cashTotal,
        totalOrdersCount: orders.length,
        cashOnHandExpected,
        cashOnHandActual,
        discrepancy,
        closedBy,
      };

      setZReports((prev) => [report, ...prev]);
      broadcastStateChange('SYNC_ALL');
      return report;
    },
    [orders, broadcastStateChange]
  );

  // Active / Completed order filters
  const activeOrders = useMemo(() => {
    return orders.filter((o) => ['placed', 'in_prep', 'ready'].includes(o.status));
  }, [orders]);

  const completedOrders = useMemo(() => {
    return orders.filter((o) => ['served', 'completed'].includes(o.status));
  }, [orders]);

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        theme,
        toggleTheme,
        isOnline,
        soundEnabled,
        toggleSound,
        kdsStationFilter,
        setKdsStationFilter,

        menuItems,
        toggleSoldOut,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotals,

        orders,
        activeOrders,
        completedOrders,
        trackedOrderId,
        setTrackedOrderId,
        placeOrder,
        updateOrderStatus,
        toggleOrderItemCheck,

        tables,
        updateTableStatus,
        selectedTableForOrdering,
        setSelectedTableForOrdering,

        queue,
        joinQueue,
        callQueueTicket,
        seatQueueTicket,
        cancelQueueTicket,

        inventory,
        restockInventory,
        wasteLogs,
        logFoodWaste,

        zReports,
        generateZReading,

        // QR Self-Ordering mode
        isQrCustomerMode,
        setIsQrCustomerMode,
        qrTableNumber,
        setQrTableNumber,
        enterCustomerQrMode,
        exitCustomerQrMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
