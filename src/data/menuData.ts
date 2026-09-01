import { MenuItem } from '../types';

export const MENU_CATEGORIES = [
  { id: 'all', name: 'Full Menu', group: 'all' },
  { id: 'pasta', name: 'Pasta', group: 'food' },
  { id: 'patatas', name: 'Patatas et. al', group: 'food' },
  { id: 'croissants', name: 'Croissants', group: 'food' },
  { id: 'hot_coffee', name: 'Hot Coffee', group: 'coffee' },
  { id: 'iced_coffee', name: 'Iced Coffee', group: 'coffee' },
  { id: 'signature_drinks', name: 'Signature Drinks', group: 'coffee' },
  { id: 'crafted_coffee', name: 'Crafted Coffee', group: 'coffee' },
  { id: 'half_and_half', name: 'Half & Half', group: 'coffee' },
  { id: 'milkers', name: 'Milkers', group: 'non_coffee' },
  { id: 'potions', name: 'Potions', group: 'non_coffee' },
  { id: 'infusions', name: 'Infusions - Tea', group: 'non_coffee' },
  { id: 'elixirs', name: 'Elixirs', group: 'non_coffee' },
  { id: 'matcha_classic', name: 'Classic Matcha', group: 'matcha' },
  { id: 'matcha_crafted', name: 'Crafted Matcha', group: 'matcha' },
] as const;

export const MENU_ITEMS: MenuItem[] = [
  // ==========================================
  // PAGE 3: FOOD - PASTA (Served with seared chicken & garlic bread)
  // ==========================================
  {
    id: 'pasta-fiery-pomodoro',
    name: 'Fiery Pomodoro',
    category: 'pasta',
    group: 'food',
    price: 180,
    subtitle: 'Served with seared chicken and garlic bread',
    description: 'A bold red sauce pasta with roasted capsicum and bright marinara, finished with a lively spicy kick. Fresh, vibrant, and full of character.',
    spicyLevel: 2,
    tags: ['spicy', 'signature'],
    recipeIngredients: [
      { ingredientId: 'ing-pasta', amount: 120, unit: 'g' },
      { ingredientId: 'ing-chicken', amount: 80, unit: 'g' },
      { ingredientId: 'ing-pomodoro-sauce', amount: 150, unit: 'ml' },
      { ingredientId: 'ing-garlic-bread', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'pasta-chicken-cremora',
    name: 'Chicken Cremora Shrooms',
    category: 'pasta',
    group: 'food',
    price: 200,
    subtitle: 'Served with seared chicken and garlic bread',
    description: 'Pan-seared chicken and mushrooms folded through a silky parmesan cream sauce. Smooth, savoury, and effortlessly satisfying.',
    tags: ['best_seller'],
    isBestSeller: true,
    recipeIngredients: [
      { ingredientId: 'ing-pasta', amount: 120, unit: 'g' },
      { ingredientId: 'ing-chicken', amount: 80, unit: 'g' },
      { ingredientId: 'ing-mushrooms', amount: 50, unit: 'g' },
      { ingredientId: 'ing-parmesan-cream', amount: 140, unit: 'ml' },
      { ingredientId: 'ing-garlic-bread', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'pasta-forest-ember',
    name: 'Forest Ember Piccante',
    category: 'pasta',
    group: 'food',
    price: 250,
    subtitle: 'Served with seared chicken and garlic bread',
    description: 'Creamy white sauce pasta layered with mushrooms sauce, umami, gentle spice, and a savoury depth.',
    spicyLevel: 1,
    tags: ['spicy', 'signature'],
    recipeIngredients: [
      { ingredientId: 'ing-pasta', amount: 120, unit: 'g' },
      { ingredientId: 'ing-chicken', amount: 80, unit: 'g' },
      { ingredientId: 'ing-mushrooms', amount: 60, unit: 'g' },
      { ingredientId: 'ing-white-sauce', amount: 140, unit: 'ml' },
      { ingredientId: 'ing-garlic-bread', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'pasta-bolognese',
    name: 'Pasta Bolognese',
    category: 'pasta',
    group: 'food',
    price: 250,
    subtitle: 'Served with seared chicken and garlic bread',
    description: 'Slow-simmered beef ragù made with patience and no shortcuts. Deep, savoury flavours wrapped around perfectly coated pasta.',
    tags: ['best_seller'],
    isBestSeller: true,
    recipeIngredients: [
      { ingredientId: 'ing-pasta', amount: 120, unit: 'g' },
      { ingredientId: 'ing-beef-ragu', amount: 160, unit: 'g' },
      { ingredientId: 'ing-garlic-bread', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'pasta-la-trufa',
    name: 'Pasta La Trufa',
    category: 'pasta',
    group: 'food',
    price: 300,
    subtitle: 'Served with seared chicken and garlic bread',
    description: 'A refined truffle cream pasta with earthy richness and a silky finish. Elegant, aromatic, and made for truffle lovers.',
    tags: ['premium', 'signature'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-pasta', amount: 120, unit: 'g' },
      { ingredientId: 'ing-chicken', amount: 80, unit: 'g' },
      { ingredientId: 'ing-truffle-oil', amount: 15, unit: 'ml' },
      { ingredientId: 'ing-parmesan-cream', amount: 140, unit: 'ml' },
      { ingredientId: 'ing-garlic-bread', amount: 1, unit: 'pcs' },
    ]
  },

  // ==========================================
  // PAGE 3: FOOD - PATATAS ET. AL
  // ==========================================
  {
    id: 'patatas-fries',
    name: 'This is Friesssss!',
    category: 'patatas',
    group: 'food',
    price: 130,
    subtitle: 'Battered Fries with Signature Dip',
    description: 'Golden battered fries, extra crispy and served with our signature house blend dip.',
    recipeIngredients: [
      { ingredientId: 'ing-fries', amount: 200, unit: 'g' },
      { ingredientId: 'ing-house-dip', amount: 40, unit: 'ml' },
    ]
  },
  {
    id: 'patatas-wedges',
    name: 'Wedges',
    category: 'patatas',
    group: 'food',
    price: 150,
    subtitle: 'Thick-cut Battered Wedges',
    description: 'Thick-cut battered wedges with a crisp finish, paired with our house blend dip.',
    recipeIngredients: [
      { ingredientId: 'ing-wedges', amount: 220, unit: 'g' },
      { ingredientId: 'ing-house-dip', amount: 40, unit: 'ml' },
    ]
  },
  {
    id: 'patatas-nuggets-chips',
    name: 'Nuggets & Chips',
    category: 'patatas',
    group: 'food',
    price: 180,
    subtitle: 'Chicken Nuggets with Fries & BBQ Dip',
    description: 'Crispy chicken nuggets with a side of battered fries, served with BBQ sauce and our house blend dip. Perfect for sharing, even better kept to yourself.',
    recipeIngredients: [
      { ingredientId: 'ing-nuggets', amount: 6, unit: 'pcs' },
      { ingredientId: 'ing-fries', amount: 150, unit: 'g' },
      { ingredientId: 'ing-house-dip', amount: 40, unit: 'ml' },
    ]
  },
  {
    id: 'patatas-chili-con-tatas',
    name: 'Chili Con Tatas',
    category: 'patatas',
    group: 'food',
    price: 200,
    subtitle: 'Loaded Chilli Con Carne Fries',
    description: 'Crispy fries loaded with hearty chilli con carne, fresh tomato, cucumber, onion, and melted cheese.',
    spicyLevel: 1,
    tags: ['spicy', 'best_seller'],
    isBestSeller: true,
    recipeIngredients: [
      { ingredientId: 'ing-fries', amount: 200, unit: 'g' },
      { ingredientId: 'ing-chili-con-carne', amount: 100, unit: 'g' },
      { ingredientId: 'ing-melted-cheese', amount: 50, unit: 'g' },
    ]
  },
  {
    id: 'patatas-fish-and-chips',
    name: 'Fish & Chips',
    category: 'patatas',
    group: 'food',
    price: 200,
    subtitle: 'Aussie Style Battered Cobbler',
    description: 'Our take on an Aussie favourite. Crispy battered cobbler, skin-on fries, house tartare, and our signature dip on the side.',
    tags: ['signature'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-fish-fillet', amount: 180, unit: 'g' },
      { ingredientId: 'ing-fries', amount: 150, unit: 'g' },
      { ingredientId: 'ing-tartare', amount: 40, unit: 'ml' },
    ]
  },
  {
    id: 'patatas-edited-potato',
    name: 'The Edited Potato',
    category: 'patatas',
    group: 'food',
    price: 250,
    subtitle: 'Crispy Wedges with Pork, Beans & Bacon',
    description: 'Our new take on the classic loaded spud. Crispy wedges topped with pork and beans, crispy bacon, and melted cheese.',
    recipeIngredients: [
      { ingredientId: 'ing-wedges', amount: 220, unit: 'g' },
      { ingredientId: 'ing-bacon', amount: 50, unit: 'g' },
      { ingredientId: 'ing-beans', amount: 80, unit: 'g' },
      { ingredientId: 'ing-melted-cheese', amount: 50, unit: 'g' },
    ]
  },

  // ==========================================
  // PAGE 4: FOOD - CROISSANTS & SANDWICHES
  // ==========================================
  {
    id: 'croissant-plain-butter',
    name: 'Plain Butter',
    category: 'croissants',
    group: 'food',
    price: 120,
    subtitle: 'Served with jam or butter',
    description: 'Freshly toasted and served with your choice of blueberry, strawberry, mango jam, or simply butter.',
    recipeIngredients: [
      { ingredientId: 'ing-croissant', amount: 1, unit: 'pcs' },
      { ingredientId: 'ing-butter', amount: 20, unit: 'g' },
    ]
  },
  {
    id: 'sandwich-turkey-ham',
    name: 'Turkey Ham Sandwich',
    category: 'croissants',
    group: 'food',
    price: 180,
    subtitle: 'Fresh Bread with Tomato & Lettuce',
    description: 'An everyday classic. Turkey ham layered with tomato, lettuce, and cucumber on fresh bread.',
    recipeIngredients: [
      { ingredientId: 'ing-bread', amount: 2, unit: 'pcs' },
      { ingredientId: 'ing-turkey-ham', amount: 80, unit: 'g' },
      { ingredientId: 'ing-vegetables', amount: 40, unit: 'g' },
    ]
  },
  {
    id: 'croissant-ham-and-cheese',
    name: 'Ham & Cheese',
    category: 'croissants',
    group: 'food',
    price: 180,
    subtitle: 'Quality Ham & Melted Cheese',
    description: 'Simple, timeless, and satisfying. Quality ham and cheese, done right.',
    tags: ['best_seller'],
    isBestSeller: true,
    recipeIngredients: [
      { ingredientId: 'ing-croissant', amount: 1, unit: 'pcs' },
      { ingredientId: 'ing-ham', amount: 60, unit: 'g' },
      { ingredientId: 'ing-cheese', amount: 40, unit: 'g' },
    ]
  },
  {
    id: 'sandwich-truffle-sammys',
    name: 'Truffle Sammys',
    category: 'croissants',
    group: 'food',
    price: 200,
    subtitle: 'Sautéed Mushrooms & Truffle Mayo',
    description: 'Sautéed mushrooms, truffle mayo, and rich cheese sauce stacked in a sandwich made to impress.',
    tags: ['signature', 'premium'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-bread', amount: 2, unit: 'pcs' },
      { ingredientId: 'ing-mushrooms', amount: 60, unit: 'g' },
      { ingredientId: 'ing-truffle-oil', amount: 10, unit: 'ml' },
      { ingredientId: 'ing-cheese', amount: 40, unit: 'g' },
    ]
  },

  // ==========================================
  // PAGE 6: COFFEE - HOT COFFEE (Vietnam Arabica 1000+ MASL)
  // ==========================================
  {
    id: 'hot-americano',
    name: 'Americano',
    category: 'hot_coffee',
    group: 'coffee',
    price: 100,
    subtitle: 'HOT • UNSWEETENED',
    description: 'UNSWEETENED. Bold, classic black coffee with nothing but pure espresso and hot water.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-cup-hot', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'hot-flat-white',
    name: 'Flat White',
    category: 'hot_coffee',
    group: 'coffee',
    price: 120,
    subtitle: 'HOT • UNSWEETENED',
    description: 'UNSWEETENED. A velvety blend of espresso and micro-foamed milk for a rich, full-bodied coffee experience.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-cup-hot', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'hot-cappucino',
    name: 'Cappucino',
    category: 'hot_coffee',
    group: 'coffee',
    price: 120,
    subtitle: 'HOT • UNSWEETENED',
    description: 'UNSWEETENED. Espresso topped with a mix of steamed and frothed milk, offering a balanced coffee flavor with a light, foamy texture.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 160, unit: 'ml' },
      { ingredientId: 'ing-cup-hot', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'hot-latte',
    name: 'Latte',
    category: 'hot_coffee',
    group: 'coffee',
    price: 120,
    subtitle: 'HOT • UNSWEETENED',
    description: 'UNSWEETENED. Smooth and creamy espresso mixed with steamed milk for a balanced, comforting drink.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 200, unit: 'ml' },
      { ingredientId: 'ing-cup-hot', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'hot-flavored-latte',
    name: 'Flavored Latte',
    category: 'hot_coffee',
    group: 'coffee',
    price: 130,
    subtitle: 'HOT • Hazelnut / French Vanilla / Toasted Almond',
    description: 'Your choice of Hazelnut, French Vanilla, or Toasted Almond syrup added to a creamy latte for a sweet twist.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 200, unit: 'ml' },
      { ingredientId: 'ing-flavored-syrup', amount: 20, unit: 'ml' },
      { ingredientId: 'ing-cup-hot', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'hot-spanish-latte',
    name: 'Spanish Latte',
    category: 'hot_coffee',
    group: 'coffee',
    price: 130,
    subtitle: 'HOT • Sweetened Condensed Milk',
    description: 'Sweetened with condensed milk, this latte brings a rich, creamy sweetness to your coffee.',
    tags: ['best_seller'],
    isBestSeller: true,
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-condensed-milk', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-cup-hot', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'hot-mocha',
    name: 'Mocha',
    category: 'hot_coffee',
    group: 'coffee',
    price: 130,
    subtitle: 'HOT • Classic Chocolate Sauce',
    description: 'Espresso with the classic chocolate sauce for a sweet and bold coffee.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-chocolate-sauce', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-cup-hot', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'hot-white-mocha',
    name: 'White Mocha',
    category: 'hot_coffee',
    group: 'coffee',
    price: 130,
    subtitle: 'HOT • White Chocolate Sauce',
    description: 'Espresso with white chocolate sauce for a sweet and bold coffee.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-white-choco-sauce', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-cup-hot', amount: 1, unit: 'pcs' },
    ]
  },

  // ==========================================
  // PAGE 6: COFFEE - ICED COFFEE
  // ==========================================
  {
    id: 'iced-americano',
    name: 'Americano',
    category: 'iced_coffee',
    group: 'coffee',
    price: 100,
    subtitle: 'ICED • UNSWEETENED',
    description: 'UNSWEETENED. A refreshing cold brew of espresso and water for a smooth, strong coffee.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'iced-cafe-latte',
    name: 'Cafe Latte',
    category: 'iced_coffee',
    group: 'coffee',
    price: 120,
    subtitle: 'ICED • UNSWEETENED',
    description: 'UNSWEETENED. Cool and creamy, with espresso and milk served over ice.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 200, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'iced-cappucino',
    name: 'Cappucino',
    category: 'iced_coffee',
    group: 'coffee',
    price: 120,
    subtitle: 'ICED • UNSWEETENED',
    description: 'UNSWEETENED. Chilled espresso with milk and a touch of froth, giving a refreshing twist to this classic.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'iced-flavored-latte',
    name: 'Flavored Latte',
    category: 'iced_coffee',
    group: 'coffee',
    price: 140,
    subtitle: 'ICED • Hazelnut / French Vanilla / Toasted Almond',
    description: 'Your choice of Hazelnut, French Vanilla, or Toasted Almond syrup added to a creamy latte for a sweet twist.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 200, unit: 'ml' },
      { ingredientId: 'ing-flavored-syrup', amount: 25, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'iced-spanish-latte',
    name: 'Spanish Latte',
    category: 'iced_coffee',
    group: 'coffee',
    price: 140,
    subtitle: 'ICED • Condensed Milk',
    description: 'Cold and creamy, with a sweet touch of condensed milk.',
    tags: ['best_seller'],
    isBestSeller: true,
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-condensed-milk', amount: 35, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'iced-vietnamese-latte',
    name: 'Vietnamese Latte',
    category: 'iced_coffee',
    group: 'coffee',
    price: 130,
    subtitle: 'ICED • Slow Dripped Over Sweet Condensed Milk',
    description: 'Bold and smooth coffee dripped slowly over sweetened condensed milk for a rich, creamy.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 20, unit: 'g' },
      { ingredientId: 'ing-condensed-milk', amount: 40, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'iced-coco-cafe-latte',
    name: 'Coco Cafe Latte',
    category: 'iced_coffee',
    group: 'coffee',
    price: 180,
    subtitle: 'ICED • Sweet Coconut Twist',
    description: 'A smooth latte with a sweet coconut twist—creamy, tropical, and comforting.',
    tags: ['signature'],
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-coconut-milk', amount: 200, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'iced-cafe-oat-latte',
    name: 'Cafe Oat Latte',
    category: 'iced_coffee',
    group: 'coffee',
    price: 180,
    subtitle: 'ICED • Oat Milk with Agave',
    description: 'Light, smooth, and gently sweetened with agave, finished with a warm, nutty note.',
    tags: ['dairy_free'],
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-oat-milk', amount: 200, unit: 'ml' },
      { ingredientId: 'ing-agave', amount: 15, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'iced-off-white',
    name: 'Off White',
    category: 'iced_coffee',
    group: 'coffee',
    price: 180,
    subtitle: 'ICED • Shaken Espresso with Oat Milk & Brown Sugar',
    description: 'Bold shaken espresso with oat milk and brown sugar, topped with a smooth foam and subtle sweetness.',
    tags: ['signature', 'best_seller'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 20, unit: 'g' },
      { ingredientId: 'ing-oat-milk', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-brown-sugar', amount: 15, unit: 'g' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },

  // ==========================================
  // PAGE 7: COFFEE - SIGNATURE DRINKS
  // ==========================================
  {
    id: 'sig-white-mocha',
    name: 'White Mocha',
    category: 'signature_drinks',
    group: 'coffee',
    price: 170,
    subtitle: 'Chilled Espresso & White Chocolate Blend',
    description: 'Chilled espresso with white chocolate, blended for a refreshing treat.',
    tags: ['signature'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-white-choco-sauce', amount: 35, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'sig-dark-mocha',
    name: 'Dark Mocha',
    category: 'signature_drinks',
    group: 'coffee',
    price: 170,
    subtitle: 'Chilled Espresso & Dark Chocolate Blend',
    description: 'Chilled espresso with dark chocolate, blended for a refreshing treat.',
    tags: ['signature'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-chocolate-sauce', amount: 35, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'sig-tibuok-latte',
    name: 'Tibuok Latte',
    category: 'signature_drinks',
    group: 'coffee',
    price: 170,
    subtitle: 'Topped with Artisanal Tibuok Salt',
    description: 'A sweet and salty delight topped with Tibuok salt for a unique finishing touch.',
    tags: ['signature', 'best_seller'],
    isSignature: true,
    isBestSeller: true,
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-tibuok-salt', amount: 2, unit: 'g' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'sig-teddy-grahams',
    name: 'Teddy Grahams',
    category: 'signature_drinks',
    group: 'coffee',
    price: 170,
    subtitle: 'Espresso, Milk, Cinnamon & Honey',
    description: 'A little twist on the classic Teddy Grahams, smooth espresso, creamy milk, and a cozy mix of cinnamon and honey. It’s sweet, warm, and just right.',
    tags: ['signature'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-cinnamon-honey', amount: 25, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'sig-ext-signature',
    name: 'EXT Signature',
    category: 'signature_drinks',
    group: 'coffee',
    price: 220,
    subtitle: 'Quad Shot (4-Shot) Powerful Espresso Kick',
    description: 'Not for the faint-hearted, this strong, creamy coffee is made with four shots of espresso for a powerful kick.',
    tags: ['signature', 'high_caffeine'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 36, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 160, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },

  // ==========================================
  // PAGE 7: COFFEE - CRAFTED COFFEE
  // ==========================================
  {
    id: 'crafted-ysla',
    name: 'Ysla',
    category: 'crafted_coffee',
    group: 'coffee',
    price: 200,
    subtitle: 'Double Espresso, Coconut Milk & Guimaras Tultul Salt',
    description: 'A vibrant twist on your usual latte — made with a smooth double shot of espresso and creamy coconut barista milk. It’s topped with crafted coco milk foam and a light sprinkle of Tultul salt from Guimaras. Like a tiny island getaway in a cup.',
    tags: ['signature', 'artisan'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 20, unit: 'g' },
      { ingredientId: 'ing-coconut-milk', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-tultul-salt', amount: 1, unit: 'g' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'crafted-sevilla-oscuro',
    name: 'Sevilla Oscuro',
    category: 'crafted_coffee',
    group: 'coffee',
    price: 200,
    subtitle: 'House Sauce, Rich Chocolate & Light Cocoa Foam',
    description: 'Crafted for those who need their caffeine fix but don’t really want to taste it. This one’s for you. Smooth, chocolatey, and comforting, it’s a creamy blend of House sauce and rich chocolate, finished with light foam and a dusting of cocoa. Sweet, bold, and easy to love in every sip.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-chocolate-sauce', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'crafted-tuscan-triffle',
    name: 'Tuscan Triffle',
    category: 'crafted_coffee',
    group: 'coffee',
    price: 200,
    subtitle: 'Tiramisu Inspired with Mascarpone Milk Foam',
    description: 'A tiramisu-inspired drink topped with mascarpone milk foam—creamy, dessert-like, and perfect.',
    tags: ['signature', 'dessert'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 160, unit: 'ml' },
      { ingredientId: 'ing-mascarpone-foam', amount: 40, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'crafted-cheesecake-latte',
    name: 'Cheesecake Latte',
    category: 'crafted_coffee',
    group: 'coffee',
    price: 200,
    subtitle: 'Cheesecake Flavor with Crushed Grahams',
    description: 'Creamy and sweet with a cheesecake-like flavor, finished with crushed grahams on top.',
    tags: ['dessert'],
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-cheesecake-syrup', amount: 25, unit: 'ml' },
      { ingredientId: 'ing-crushed-grahams', amount: 10, unit: 'g' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'crafted-cookie-crumbs',
    name: 'Cookie Crumbs Coffee',
    category: 'crafted_coffee',
    group: 'coffee',
    price: 200,
    subtitle: 'Espresso with Chocolate & Biscuit Notes',
    description: 'A rich espresso latte layered with chocolate and biscuit-like notes, reminiscent of a freshly baked chocolate cookie.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-cookie-syrup', amount: 25, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'crafted-pistache-fleur',
    name: 'Pistache Fleur',
    category: 'crafted_coffee',
    group: 'coffee',
    price: 200,
    subtitle: 'Nutty Pistachio meets Delicate Rose',
    description: 'Nutty pistachio meets delicate rose for a smooth, floral coffee experience that’s unexpectedly addictive.',
    tags: ['signature'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-pistachio-sauce', amount: 25, unit: 'ml' },
      { ingredientId: 'ing-rose-syrup', amount: 10, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },

  // ==========================================
  // PAGE 8: COFFEE - HALF & HALF
  // ==========================================
  {
    id: 'hh-rich-iced-latte',
    name: 'Rich Iced Latte',
    category: 'half_and_half',
    group: 'coffee',
    price: 150,
    subtitle: 'Rich & Creamy Velvety Sip',
    description: 'A creamy latte that brings a rich flavor in every sip, perfect for a refreshing pick-me-up.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-half-and-half', amount: 200, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'hh-cafe-dulce',
    name: 'Café Dulce',
    category: 'half_and_half',
    group: 'coffee',
    price: 180,
    subtitle: 'Creamier Spanish Latte',
    description: 'A creamier take on the classic Spanish latte, offering a delightful sweetness that warms the soul.',
    tags: ['best_seller'],
    isBestSeller: true,
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-half-and-half', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-condensed-milk', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'hh-cafe-blanc',
    name: 'Café Blanc',
    category: 'half_and_half',
    group: 'coffee',
    price: 180,
    subtitle: 'White Chocolate & Creamy Goodness',
    description: 'A smooth blend of creamy goodness with a hint of white chocolate, making it a sweet treat for any time of day.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-half-and-half', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-white-choco-sauce', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'hh-white-hazelnut',
    name: 'White Hazelnut',
    category: 'half_and_half',
    group: 'coffee',
    price: 180,
    subtitle: 'Rich Hazelnut & Creamy Milk',
    description: 'A cozy combination of rich hazelnut flavor and creamy milk, creating a comforting coffee experience.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-half-and-half', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-hazelnut-syrup', amount: 25, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'hh-mocha-almonds',
    name: 'Mocha Almonds',
    category: 'half_and_half',
    group: 'coffee',
    price: 180,
    subtitle: 'Rich Mocha & Nutty Almond',
    description: 'A delicious blend of rich mocha and nutty almond notes, perfect for those who crave a chocolatey treat with a twist.',
    recipeIngredients: [
      { ingredientId: 'ing-beans-arabica', amount: 18, unit: 'g' },
      { ingredientId: 'ing-half-and-half', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-chocolate-sauce', amount: 25, unit: 'ml' },
      { ingredientId: 'ing-almond-syrup', amount: 15, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },

  // ==========================================
  // PAGE 9: NON-COFFEE - MILKERS
  // ==========================================
  {
    id: 'milker-strawburst',
    name: 'Strawburst',
    category: 'milkers',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Strawberries x Superberries',
    description: 'Strawberries x Superberries. A bright, fruity fizz with a mix of sweet strawberries and superberries, splashed with milk and crowned with berry-flavored foam. A fun and refreshing pick-me-up.',
    tags: ['refreshing'],
    recipeIngredients: [
      { ingredientId: 'ing-berry-syrup', amount: 35, unit: 'ml' },
      { ingredientId: 'ing-soda-water', amount: 120, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 50, unit: 'ml' },
      { ingredientId: 'ing-berry-foam', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'milker-nebula-blast',
    name: 'Nebula Blast',
    category: 'milkers',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Raspberry x Blueberries',
    description: 'Raspberry x Blueberries. Tart raspberries and juicy blueberries come together in this fizzy drink, finished with a smooth berry foam. Sweet, tangy, and totally sippable.',
    tags: ['refreshing'],
    recipeIngredients: [
      { ingredientId: 'ing-berry-syrup', amount: 35, unit: 'ml' },
      { ingredientId: 'ing-soda-water', amount: 120, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 50, unit: 'ml' },
      { ingredientId: 'ing-berry-foam', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'milker-dark-bloom',
    name: 'Dark Bloom',
    category: 'milkers',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Blackberry x Blueberries',
    description: 'Blackberry x Blueberries. A perfect blend of dark berries with a fizzy kick and creamy touch, topped with a luscious foam. Rich in flavor, light on the palate.',
    recipeIngredients: [
      { ingredientId: 'ing-berry-syrup', amount: 35, unit: 'ml' },
      { ingredientId: 'ing-soda-water', amount: 120, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 50, unit: 'ml' },
      { ingredientId: 'ing-berry-foam', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'milker-orchard-spark',
    name: 'Orchard Spark',
    category: 'milkers',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Lychee x Green Apple',
    description: 'Lychee x Green Apple. Light, crisp, and playful — a fizzy mix of lychee and green apple, softened with milk and a touch of fruity foam on top. A sip of orchard freshness.',
    recipeIngredients: [
      { ingredientId: 'ing-lychee-syrup', amount: 20, unit: 'ml' },
      { ingredientId: 'ing-apple-syrup', amount: 20, unit: 'ml' },
      { ingredientId: 'ing-soda-water', amount: 120, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 50, unit: 'ml' },
      { ingredientId: 'ing-fruit-foam', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'milker-nocturne',
    name: 'Nocturne',
    category: 'milkers',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Black Currant x Blackberry',
    description: 'Black Currant x Blackberry. Bold, fruity, and refreshing with deep berry flavors in every sip.',
    recipeIngredients: [
      { ingredientId: 'ing-blackcurrant-syrup', amount: 35, unit: 'ml' },
      { ingredientId: 'ing-soda-water', amount: 120, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 50, unit: 'ml' },
      { ingredientId: 'ing-berry-foam', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'milker-love-pink',
    name: 'Love, Pink',
    category: 'milkers',
    group: 'non_coffee',
    price: 150,
    subtitle: 'Rose x Lychee',
    description: 'Rose x Lychee. A pretty pink floral refresher. Light, fragrant, and refreshingly crisp.',
    tags: ['signature'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-rose-syrup', amount: 20, unit: 'ml' },
      { ingredientId: 'ing-lychee-syrup', amount: 20, unit: 'ml' },
      { ingredientId: 'ing-soda-water', amount: 120, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 50, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },

  // ==========================================
  // PAGE 9: NON-COFFEE - POTIONS
  // ==========================================
  {
    id: 'potion-og-choco',
    name: 'OG Choco',
    category: 'potions',
    group: 'non_coffee',
    price: 100,
    subtitle: 'Classic Nostalgic Chocolate',
    description: 'A classic chocolate drink—sweet, creamy, and perfectly nostalgic.',
    recipeIngredients: [
      { ingredientId: 'ing-chocolate-sauce', amount: 40, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 200, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'potion-secret-drink',
    name: 'Secret Drink',
    category: 'potions',
    group: 'non_coffee',
    price: 100,
    subtitle: 'Strawberry Milk Drink',
    description: 'Basically a strawberry milk drink.',
    recipeIngredients: [
      { ingredientId: 'ing-strawberry-syrup', amount: 40, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 200, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'potion-choco-almonds',
    name: 'Choco Almonds',
    category: 'potions',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Creamy Chocolate with Subtle Almond Hint',
    description: 'Creamy chocolate with a subtle almond hint for a rich, cozy flavor.',
    recipeIngredients: [
      { ingredientId: 'ing-chocolate-sauce', amount: 35, unit: 'ml' },
      { ingredientId: 'ing-almond-syrup', amount: 15, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 200, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'potion-hazelnut-choc',
    name: 'Hazelnut Choc',
    category: 'potions',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Smooth Chocolate with Hazelnut',
    description: 'Smooth chocolate blended with a touch of hazelnut—sweet, creamy, and comforting.',
    recipeIngredients: [
      { ingredientId: 'ing-chocolate-sauce', amount: 35, unit: 'ml' },
      { ingredientId: 'ing-hazelnut-syrup', amount: 15, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 200, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'potion-horchata',
    name: 'Horchata',
    category: 'potions',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Creamy Rice Milk with Cinnamon (Add Espresso +₱80)',
    description: 'Creamy rice milk with a gentle cinnamon finish. You can add your espresso (+80) for another finished.',
    tags: ['signature'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-rice-milk', amount: 200, unit: 'ml' },
      { ingredientId: 'ing-cinnamon-syrup', amount: 25, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'potion-pistachio-milk',
    name: 'Pistachio Milk',
    category: 'potions',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Creamy Milk with Rich Pistachio Finish',
    description: 'Creamy milk with a rich pistachio finish. Simple, smooth and satisfying.',
    recipeIngredients: [
      { ingredientId: 'ing-pistachio-sauce', amount: 35, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 200, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'potion-choconut',
    name: 'Choconut',
    category: 'potions',
    group: 'non_coffee',
    price: 150,
    subtitle: 'Chocolate with Creamy Peanut Foam & Grated Chocolate',
    description: 'A rich chocolate blend topped with creamy peanut foam, finished with grated chocolate for a nostalgic, dessert-like finish.',
    tags: ['best_seller'],
    isBestSeller: true,
    recipeIngredients: [
      { ingredientId: 'ing-chocolate-sauce', amount: 40, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-peanut-foam', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'potion-dark-forest',
    name: 'Dark Forest',
    category: 'potions',
    group: 'non_coffee',
    price: 150,
    subtitle: 'Chocolate with Sweet Cherry Notes',
    description: 'Rich chocolate layered with sweet cherry notes. Velvety, decadent, and elegantly crafted.',
    tags: ['signature'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-chocolate-sauce', amount: 35, unit: 'ml' },
      { ingredientId: 'ing-cherry-syrup', amount: 20, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'potion-cookie-crumble',
    name: 'Cookie Crumble',
    category: 'potions',
    group: 'non_coffee',
    price: 160,
    subtitle: 'Like your favorite cookie in a glass',
    description: 'Like your favorite cookie, only better in a glass.',
    recipeIngredients: [
      { ingredientId: 'ing-cookie-syrup', amount: 35, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-crushed-cookies', amount: 15, unit: 'g' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'potion-choco-pistachio',
    name: 'Choco Pistachio',
    category: 'potions',
    group: 'non_coffee',
    price: 160,
    subtitle: 'Chocolate and Pistachio',
    description: 'Chocolate and pistachio. Rich, smooth, and perfectly balanced.',
    recipeIngredients: [
      { ingredientId: 'ing-chocolate-sauce', amount: 25, unit: 'ml' },
      { ingredientId: 'ing-pistachio-sauce', amount: 25, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },

  // ==========================================
  // PAGE 10: NON-COFFEE - INFUSIONS - TEA
  // ==========================================
  {
    id: 'infusion-thai-tea-latte',
    name: 'Thai Tea Latte',
    category: 'infusions',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Classic Thai Tea with Crafted Milk',
    description: 'Classic Thai tea blended with our signature crafted milk for a rich, creamy flavor.',
    tags: ['best_seller'],
    isBestSeller: true,
    recipeIngredients: [
      { ingredientId: 'ing-thai-tea', amount: 100, unit: 'ml' },
      { ingredientId: 'ing-crafted-milk', amount: 120, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'infusion-peach-tea',
    name: 'Peach Tea',
    category: 'infusions',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Peach, Black Tea, Butterfly Pea & Rosemary',
    description: 'A refreshing blend of peach, black tea, and citrus, enhanced with butterfly pea juice and garnished with rosemary.',
    recipeIngredients: [
      { ingredientId: 'ing-black-tea', amount: 120, unit: 'ml' },
      { ingredientId: 'ing-peach-syrup', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-butterfly-pea', amount: 20, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'infusion-amber',
    name: 'Amber',
    category: 'infusions',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Black Tea with Lychee & Lemon',
    description: 'A refreshing black tea with a hint of lychee and lemon, reminiscent of a classic iced tea.',
    recipeIngredients: [
      { ingredientId: 'ing-black-tea', amount: 140, unit: 'ml' },
      { ingredientId: 'ing-lychee-syrup', amount: 25, unit: 'ml' },
      { ingredientId: 'ing-lemon-juice', amount: 15, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'infusion-apple-tea',
    name: 'Apple Tea',
    category: 'infusions',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Tea Infused with Crisp Apple',
    description: 'Tea infused with crisp apple. Light, nostalgic, and familiar in the best way.',
    recipeIngredients: [
      { ingredientId: 'ing-black-tea', amount: 140, unit: 'ml' },
      { ingredientId: 'ing-apple-syrup', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'infusion-london-fog',
    name: 'London Fog',
    category: 'infusions',
    group: 'non_coffee',
    price: 150,
    subtitle: 'Earl Grey Tea & Lavender-Citrus Crafted Milk',
    description: 'An iced drink featuring Earl Grey tea blended with creamy crafted milk. Enjoy its lavender-like citrusy flavor for a refreshing and unique experience.',
    tags: ['signature'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-earl-grey', amount: 120, unit: 'ml' },
      { ingredientId: 'ing-crafted-milk', amount: 100, unit: 'ml' },
      { ingredientId: 'ing-lavender-syrup', amount: 15, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'infusion-lychee-tea-lemonade',
    name: 'Lychee Tea Lemonade',
    category: 'infusions',
    group: 'non_coffee',
    price: 150,
    subtitle: 'Black Tea, Lychee & Citrus with Basil',
    description: 'Black tea infused with lychee and a splash of citrus, garnished with basil and lemons.',
    recipeIngredients: [
      { ingredientId: 'ing-black-tea', amount: 120, unit: 'ml' },
      { ingredientId: 'ing-lychee-syrup', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-lemon-juice', amount: 20, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'infusion-cascara',
    name: 'Cascara',
    category: 'infusions',
    group: 'non_coffee',
    price: 150,
    subtitle: 'Coffee Berries Brewed as Tea',
    description: 'Coffee berries brewed as tea. Bright, refreshing, and naturally fruity',
    tags: ['artisan'],
    recipeIngredients: [
      { ingredientId: 'ing-cascara-tea', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },

  // ==========================================
  // PAGE 10: NON-COFFEE - ELIXIRS
  // ==========================================
  {
    id: 'elixir-tropics',
    name: 'Tropics',
    category: 'elixirs',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Pineapple, Lime Soda, Grenadine & Mint',
    description: 'A tropical blend of pineapple, lime soda, and grenadine, topped with mint and sun-dried lemon for a zesty refreshment.',
    recipeIngredients: [
      { ingredientId: 'ing-pineapple-juice', amount: 60, unit: 'ml' },
      { ingredientId: 'ing-lime-soda', amount: 120, unit: 'ml' },
      { ingredientId: 'ing-grenadine', amount: 15, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'elixir-azure',
    name: 'Azure',
    category: 'elixirs',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Butterfly Pea Tea, Calamansi & Crushed Cucumber',
    description: 'A refreshing mix of blue butterfly pea tea, soda water, calamansi, and crushed cucumber for a cool, crisp drink.',
    recipeIngredients: [
      { ingredientId: 'ing-butterfly-pea', amount: 60, unit: 'ml' },
      { ingredientId: 'ing-soda-water', amount: 100, unit: 'ml' },
      { ingredientId: 'ing-calamansi', amount: 20, unit: 'ml' },
      { ingredientId: 'ing-cucumber', amount: 20, unit: 'g' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'elixir-sunrays',
    name: 'Sunrays',
    category: 'elixirs',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Orange & Pineapple with Thyme',
    description: 'A classic blend of orange juice and pineapple, garnished with sun-dried oranges and finished with thyme for a bright and zesty beverage.',
    recipeIngredients: [
      { ingredientId: 'ing-orange-juice', amount: 80, unit: 'ml' },
      { ingredientId: 'ing-pineapple-juice', amount: 80, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'elixir-chill-wave',
    name: 'Chill Wave',
    category: 'elixirs',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Sweet Strawberries & Juicy Peaches',
    description: 'A refreshing blend of sweet strawberries and juicy peaches, perfectly balanced for a fruity, vibrant sip. Light, refreshing, and full of summer vibes in every glass.',
    tags: ['best_seller'],
    isBestSeller: true,
    recipeIngredients: [
      { ingredientId: 'ing-strawberry-syrup', amount: 25, unit: 'ml' },
      { ingredientId: 'ing-peach-syrup', amount: 25, unit: 'ml' },
      { ingredientId: 'ing-soda-water', amount: 120, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'elixir-rose',
    name: 'Rosé',
    category: 'elixirs',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Citrusy & Floral Flavors',
    description: 'A vibrant and refreshing drink with a perfect balance of citrusy and floral flavors, offering a delicate and uplifting taste.',
    recipeIngredients: [
      { ingredientId: 'ing-rose-syrup', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-lemon-juice', amount: 20, unit: 'ml' },
      { ingredientId: 'ing-soda-water', amount: 120, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'elixir-andromeda',
    name: 'Andromeda',
    category: 'elixirs',
    group: 'non_coffee',
    price: 130,
    subtitle: 'Cherry Bubblegum, Lime & Curacao',
    description: 'A bright, refreshing mix with hints of cherry bubblegum, lime, and curacao. Fun and vibrant.',
    tags: ['signature'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-curacao-syrup', amount: 20, unit: 'ml' },
      { ingredientId: 'ing-cherry-syrup', amount: 20, unit: 'ml' },
      { ingredientId: 'ing-lime-soda', amount: 120, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },

  // ==========================================
  // PAGE 12: MATCHA - CLASSIC MATCHA (Nami Ceremonial Matcha, Shizuoka 1100 MASL)
  // ==========================================
  {
    id: 'matcha-pure',
    name: 'Pure Matcha',
    category: 'matcha_classic',
    group: 'matcha',
    price: 180,
    subtitle: 'UNSWEETENED • Pure Matcha & Milk',
    description: 'Pure unsweetened matcha combined with milk for a rich, earthy flavor.',
    tags: ['unsweetened', 'pure'],
    recipeIngredients: [
      { ingredientId: 'ing-matcha-powder', amount: 4, unit: 'g' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'matcha-classic',
    name: 'Classic Matcha',
    category: 'matcha_classic',
    group: 'matcha',
    price: 220,
    subtitle: 'Vanilla Infused Sweetened Matcha',
    description: 'Creamy matcha infused with a hint of sweetness and vanilla for a smooth, sweet experience.',
    tags: ['best_seller'],
    isBestSeller: true,
    recipeIngredients: [
      { ingredientId: 'ing-matcha-powder', amount: 4, unit: 'g' },
      { ingredientId: 'ing-vanilla-syrup', amount: 20, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'matcha-strawberry',
    name: 'Strawberry Matcha',
    category: 'matcha_classic',
    group: 'matcha',
    price: 220,
    subtitle: 'Strawberry Milk & Pure Matcha Layer',
    description: 'A delightful blend of strawberry milk and matcha for a fruity refreshing drink.',
    tags: ['best_seller', 'signature'],
    isBestSeller: true,
    recipeIngredients: [
      { ingredientId: 'ing-matcha-powder', amount: 4, unit: 'g' },
      { ingredientId: 'ing-strawberry-syrup', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 160, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'matcha-sakura',
    name: 'Sakura Matcha',
    category: 'matcha_classic',
    group: 'matcha',
    price: 220,
    subtitle: 'Sakura Milk & Pure Matcha Layer',
    description: 'A beautiful pink and green drink infused with sakura milk and pure matcha, offering a floral and earthy flavor.',
    tags: ['signature'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-matcha-powder', amount: 4, unit: 'g' },
      { ingredientId: 'ing-sakura-syrup', amount: 25, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 160, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },

  // ==========================================
  // PAGE 12: MATCHA - CRAFTED MATCHA
  // ==========================================
  {
    id: 'matcha-cocowater',
    name: 'Cocowater Matcha',
    category: 'matcha_crafted',
    group: 'matcha',
    price: 240,
    subtitle: 'Ext Matcha meets Pure Coconut Water',
    description: 'Ext matcha meets coconut water. Clean, crisp, and seriously refreshing',
    tags: ['signature', 'refreshing'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-matcha-powder', amount: 4, unit: 'g' },
      { ingredientId: 'ing-coconut-water', amount: 200, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'matcha-cocomilk',
    name: 'Cocomilk Matcha',
    category: 'matcha_crafted',
    group: 'matcha',
    price: 240,
    subtitle: 'Pure Matcha with Crafted Coconut Milk',
    description: 'A tropical twist on your usual matcha- made with with pure matcha and crafted coconut milk. Refreshing, creamy, and a little nutty in all the right ways.',
    tags: ['dairy_free', 'signature'],
    recipeIngredients: [
      { ingredientId: 'ing-matcha-powder', amount: 4, unit: 'g' },
      { ingredientId: 'ing-coconut-milk', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'matcha-oat',
    name: 'Matcha Oat',
    category: 'matcha_crafted',
    group: 'matcha',
    price: 240,
    subtitle: 'Earthy Matcha with Creamy Oat Milk',
    description: 'Earthy matcha meets creamy oat milk for a smooth, dairyfree, sip with a natural sweetness. Light, comforting, and easy on the tummy.',
    tags: ['dairy_free'],
    recipeIngredients: [
      { ingredientId: 'ing-matcha-powder', amount: 4, unit: 'g' },
      { ingredientId: 'ing-oat-milk', amount: 200, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'matcha-vanillala-foam',
    name: 'Vanillala Foam',
    category: 'matcha_crafted',
    group: 'matcha',
    price: 240,
    subtitle: 'Cold-Whisked Vanilla Latte with Fluffy Vanilla Foam',
    description: 'A cold-whisked vanilla latte topped with fluffy vanilla foam-sweet, creamy, and comfroting.',
    recipeIngredients: [
      { ingredientId: 'ing-matcha-powder', amount: 4, unit: 'g' },
      { ingredientId: 'ing-vanilla-syrup', amount: 25, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 160, unit: 'ml' },
      { ingredientId: 'ing-vanilla-foam', amount: 40, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'matcha-pistachio-oat',
    name: 'Pistachio Oat',
    category: 'matcha_crafted',
    group: 'matcha',
    price: 250,
    subtitle: 'Whisked with Oat Milk & Pistachio Sauce',
    description: 'Matcha whisked with oat milk and pistachio sauce-smooth, nutty, and naturally sweet.',
    tags: ['dairy_free', 'signature'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-matcha-powder', amount: 4, unit: 'g' },
      { ingredientId: 'ing-oat-milk', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-pistachio-sauce', amount: 30, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'matcha-honeydust-cinnamon',
    name: 'Honeydust Cinnamon',
    category: 'matcha_crafted',
    group: 'matcha',
    price: 250,
    subtitle: 'Layered with Oat Milk, Honey, Cinnamon & Silky Milk Foam',
    description: 'Smooth matcha layered with oat milk, honey, and warm cinnamon, crowned with silky milk foam.',
    tags: ['signature'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-matcha-powder', amount: 4, unit: 'g' },
      { ingredientId: 'ing-oat-milk', amount: 180, unit: 'ml' },
      { ingredientId: 'ing-cinnamon-honey', amount: 25, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'matcha-coco-cheesecake',
    name: 'Coco Matcha Cheesecake',
    category: 'matcha_crafted',
    group: 'matcha',
    price: 250,
    subtitle: 'Matcha Twist on Cheesecake with Foam & Grahams',
    description: 'A matcha twist on cheesecake- balanced sweetness, smooth matcha, and topped with foam and grahams.',
    tags: ['dessert', 'signature'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-matcha-powder', amount: 4, unit: 'g' },
      { ingredientId: 'ing-cheesecake-syrup', amount: 25, unit: 'ml' },
      { ingredientId: 'ing-milk-fresh', amount: 160, unit: 'ml' },
      { ingredientId: 'ing-crushed-grahams', amount: 10, unit: 'g' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
  {
    id: 'matcha-breve',
    name: 'Matcha Brevé',
    category: 'matcha_crafted',
    group: 'matcha',
    price: 270,
    subtitle: 'Rich Matcha & Velvety Half-and-Half',
    description: 'A creamy, smooth blend of rich matcha and velvety half-and-half. for a balanced and refreshing sip.',
    tags: ['premium', 'signature'],
    isSignature: true,
    recipeIngredients: [
      { ingredientId: 'ing-matcha-powder', amount: 5, unit: 'g' },
      { ingredientId: 'ing-half-and-half', amount: 200, unit: 'ml' },
      { ingredientId: 'ing-ice', amount: 150, unit: 'g' },
      { ingredientId: 'ing-cup-iced', amount: 1, unit: 'pcs' },
    ]
  },
];
