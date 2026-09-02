export type Category = 
  | 'all'
  | 'pasta'
  | 'patatas'
  | 'croissants'
  | 'hot_coffee'
  | 'iced_coffee'
  | 'signature_drinks'
  | 'crafted_coffee'
  | 'half_and_half'
  | 'milkers'
  | 'potions'
  | 'infusions'
  | 'elixirs'
  | 'matcha_classic'
  | 'matcha_crafted';

export type MainCategoryGroup = 
  | 'all'
  | 'coffee'
  | 'matcha'
  | 'non_coffee'
  | 'food';

export type DietaryTag = 
  | 'vegetarian' 
  | 'spicy' 
  | 'best_seller' 
  | 'signature' 
  | 'dairy_free_avail' 
  | 'dairy_free' 
  | 'premium' 
  | 'high_caffeine' 
  | 'artisan' 
  | 'dessert' 
  | 'refreshing' 
  | 'unsweetened' 
  | 'pure';

export type MilkOption = 'regular' | 'oat' | 'coconut' | 'almond' | 'soy';

export type SweetnessLevel = 0 | 25 | 50 | 75 | 100;

export type Temperature = 'hot' | 'iced';

export interface CustomizationOption {
  temperature?: Temperature;
  sweetness?: SweetnessLevel;
  milk?: MilkOption;
  extraEspressoShots?: number;
  addEspressoShot?: boolean; // for Horchata
  specialInstructions?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  group: MainCategoryGroup;
  price: number;
  description: string;
  subtitle?: string;
  tags?: DietaryTag[];
  spicyLevel?: number; // 1-3
  isSoldOut?: boolean;
  isBestSeller?: boolean;
  isSignature?: boolean;
  recipeIngredients?: { ingredientId: string; amount: number; unit: string }[];
  customizable?: {
    allowTemp?: boolean;
    allowSweetness?: boolean;
    allowMilk?: boolean;
    allowExtraShot?: boolean;
    allowHorchataShot?: boolean;
  };
}

export interface CartItem {
  cartId: string;
  menuItem: MenuItem;
  quantity: number;
  customization: CustomizationOption;
  unitPrice: number;
  totalPrice: number;
}

export type OrderType = 'dine_in' | 'takeaway';

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export interface Table {
  id: string;
  number: number;
  name: string;
  capacity: number;
  section: 'indoor' | 'patio' | 'bar';
  status: TableStatus;
  activeOrderId?: string;
  activeCustomerName?: string;
  lastOccupiedAt?: number;
}

export type QueueStatus = 'waiting' | 'called' | 'seated' | 'cancelled';

export interface QueueTicket {
  id: string;
  ticketNumber: string; // e.g. Q-014
  customerName: string;
  phone: string;
  partySize: number;
  preferredSection?: 'indoor' | 'patio' | 'any';
  status: QueueStatus;
  createdAt: number;
  calledAt?: number;
  estimatedWaitMinutes: number;
}

export type OrderStatus = 'placed' | 'in_prep' | 'ready' | 'served' | 'completed' | 'cancelled';

export type KitchenStation = 'all' | 'barista' | 'cold_bar' | 'kitchen';

export interface Order {
  id: string;
  orderNumber: string; // e.g. #EXT-104
  type: OrderType;
  tableNumber?: number;
  customerName: string;
  customerPhone?: string;
  items: CartItem[];
  itemStatuses: { [cartId: string]: boolean }; // Checklist progress per item
  status: OrderStatus;
  paymentMethod: 'gcash' | 'cash';
  paymentStatus: 'pending' | 'paid';
  paymentDetails?: {
    gcashRef?: string;
    gcashMobile?: string;
    cashTendered?: number;
    changeGiven?: number;
    discountType?: 'senior_pwd' | 'promo' | 'none';
    seniorPwdId?: string;
    isVatExempt?: boolean;
    receiptNumber?: string;
  };
  subtotal: number;
  discountAmount: number;
  vatExemptAmount: number;
  vatAmount: number;
  total: number;
  createdAt: number;
  prepStartedAt?: number;
  readyAt?: number;
  completedAt?: number;
  isRush?: boolean;
  notes?: string;
}

export type InventoryCategory = 'coffee' | 'dairy' | 'tea_matcha' | 'syrup_flavor' | 'food_ingredient' | 'packaging';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  currentStock: number;
  unit: string;
  minThreshold: number;
  unitCostPhp: number;
  lastRestocked?: number;
}

export interface WasteLog {
  id: string;
  timestamp: number;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  costPhp: number;
  reason: 'barista_error' | 'expired_spoilage' | 'spill_accident' | 'quality_rejection' | 'sampling';
  loggedBy: string;
  notes?: string;
}

export interface ZReadingReport {
  id: string;
  date: string;
  openedAt: number;
  closedAt: number;
  beginningCash: number;
  grossSales: number;
  vatableSales: number;
  vatAmount: number;
  vatExemptSales: number;
  seniorPwdDiscounts: number;
  netSales: number;
  gcashTotal: number;
  cashTotal: number;
  totalOrdersCount: number;
  cashOnHandExpected: number;
  cashOnHandActual: number;
  discrepancy: number;
  closedBy: string;
}

export type ActiveView = 'customer' | 'kitchen' | 'pos' | 'inventory' | 'analytics' | 'tracker' | 'tables';
