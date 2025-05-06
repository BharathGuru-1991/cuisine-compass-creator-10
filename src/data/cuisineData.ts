
// Define types for our cuisine data
export type DishType = 'veg' | 'non-veg';
export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type EventType = 'casual' | 'wedding' | 'corporate';
export type CuisineOrigin = 'south-indian' | 'north-indian' | 'universal';
export type DietaryRestriction = 'none' | 'jain' | 'gluten-free';

export interface Dish {
  id: string;
  name: string;
  type: DishType;
  origin: CuisineOrigin;
  spiceLevel: number; // 1-5 scale
  popularity: number; // 1-5 scale
  mealTypes: MealType[];
  eventTypes: EventType[];
  isJainFriendly: boolean;
  isGlutenFree: boolean;
  servingUnit: string;
  servingSize: number; // per person
  description: string;
  category: 'main' | 'side' | 'dessert' | 'bread' | 'rice' | 'starter';
}

// Define our dishes database
export const dishes: Dish[] = [
  // South Indian Dishes
  {
    id: 'dosa',
    name: 'Dosa',
    type: 'veg',
    origin: 'south-indian',
    spiceLevel: 2,
    popularity: 5,
    mealTypes: ['breakfast', 'dinner'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: true,
    isGlutenFree: true,
    servingUnit: 'pieces',
    servingSize: 2,
    description: 'Crispy, fermented rice and lentil crepes',
    category: 'main'
  },
  {
    id: 'idli',
    name: 'Idli',
    type: 'veg',
    origin: 'south-indian',
    spiceLevel: 1,
    popularity: 5,
    mealTypes: ['breakfast'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: true,
    isGlutenFree: true,
    servingUnit: 'pieces',
    servingSize: 3,
    description: 'Steamed rice cakes, soft and fluffy',
    category: 'main'
  },
  {
    id: 'vada',
    name: 'Vada',
    type: 'veg',
    origin: 'south-indian',
    spiceLevel: 2,
    popularity: 4,
    mealTypes: ['breakfast'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: true,
    isGlutenFree: true,
    servingUnit: 'pieces',
    servingSize: 2,
    description: 'Deep-fried lentil donuts with a crispy exterior',
    category: 'side'
  },
  {
    id: 'sambar',
    name: 'Sambar',
    type: 'veg',
    origin: 'south-indian',
    spiceLevel: 3,
    popularity: 5,
    mealTypes: ['breakfast', 'lunch', 'dinner'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: false,
    isGlutenFree: true,
    servingUnit: 'ml',
    servingSize: 150,
    description: 'Lentil-based vegetable stew with tamarind',
    category: 'side'
  },
  {
    id: 'curd-rice',
    name: 'Curd Rice',
    type: 'veg',
    origin: 'south-indian',
    spiceLevel: 1,
    popularity: 4,
    mealTypes: ['lunch', 'dinner'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: true,
    isGlutenFree: true,
    servingUnit: 'grams',
    servingSize: 150,
    description: 'Cooling yogurt mixed with rice, tempered with spices',
    category: 'rice'
  },
  {
    id: 'bisibelebath',
    name: 'Bisi Bele Bath',
    type: 'veg',
    origin: 'south-indian',
    spiceLevel: 3,
    popularity: 4,
    mealTypes: ['lunch', 'dinner'],
    eventTypes: ['casual', 'wedding'],
    isJainFriendly: false,
    isGlutenFree: true,
    servingUnit: 'grams',
    servingSize: 200,
    description: 'Spicy rice dish with lentils and vegetables',
    category: 'main'
  },
  {
    id: 'mysore-pak',
    name: 'Mysore Pak',
    type: 'veg',
    origin: 'south-indian',
    spiceLevel: 1,
    popularity: 4,
    mealTypes: ['dinner'],
    eventTypes: ['wedding', 'corporate'],
    isJainFriendly: true,
    isGlutenFree: false,
    servingUnit: 'pieces',
    servingSize: 2,
    description: 'Rich sweet made from gram flour, ghee and sugar',
    category: 'dessert'
  },
  {
    id: 'chicken-chettinad',
    name: 'Chicken Chettinad',
    type: 'non-veg',
    origin: 'south-indian',
    spiceLevel: 5,
    popularity: 5,
    mealTypes: ['lunch', 'dinner'],
    eventTypes: ['casual', 'wedding'],
    isJainFriendly: false,
    isGlutenFree: true,
    servingUnit: 'grams',
    servingSize: 200,
    description: 'Spicy chicken curry with distinctive chettinad spices',
    category: 'main'
  },
  {
    id: 'fish-moilee',
    name: 'Fish Moilee',
    type: 'non-veg',
    origin: 'south-indian',
    spiceLevel: 3,
    popularity: 4,
    mealTypes: ['lunch', 'dinner'],
    eventTypes: ['casual', 'wedding'],
    isJainFriendly: false,
    isGlutenFree: true,
    servingUnit: 'grams',
    servingSize: 180,
    description: 'Kerala-style fish curry cooked in coconut milk',
    category: 'main'
  },
  
  // North Indian Dishes
  {
    id: 'butter-chicken',
    name: 'Butter Chicken',
    type: 'non-veg',
    origin: 'north-indian',
    spiceLevel: 3,
    popularity: 5,
    mealTypes: ['lunch', 'dinner'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: false,
    isGlutenFree: true,
    servingUnit: 'grams',
    servingSize: 200,
    description: 'Tender chicken in a rich, buttery tomato sauce',
    category: 'main'
  },
  {
    id: 'paneer-butter-masala',
    name: 'Paneer Butter Masala',
    type: 'veg',
    origin: 'north-indian',
    spiceLevel: 3,
    popularity: 5,
    mealTypes: ['lunch', 'dinner'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: true,
    isGlutenFree: true,
    servingUnit: 'grams',
    servingSize: 180,
    description: 'Cottage cheese cubes in a creamy tomato sauce',
    category: 'main'
  },
  {
    id: 'dal-makhani',
    name: 'Dal Makhani',
    type: 'veg',
    origin: 'north-indian',
    spiceLevel: 2,
    popularity: 5,
    mealTypes: ['lunch', 'dinner'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: true,
    isGlutenFree: true,
    servingUnit: 'grams',
    servingSize: 150,
    description: 'Creamy black lentils slow-cooked with butter and cream',
    category: 'main'
  },
  {
    id: 'chole-bhature',
    name: 'Chole Bhature',
    type: 'veg',
    origin: 'north-indian',
    spiceLevel: 4,
    popularity: 5,
    mealTypes: ['lunch'],
    eventTypes: ['casual', 'wedding'],
    isJainFriendly: true,
    isGlutenFree: false,
    servingUnit: 'plate',
    servingSize: 1,
    description: 'Spicy chickpea curry with deep-fried bread',
    category: 'main'
  },
  {
    id: 'naan',
    name: 'Naan',
    type: 'veg',
    origin: 'north-indian',
    spiceLevel: 1,
    popularity: 5,
    mealTypes: ['lunch', 'dinner'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: true,
    isGlutenFree: false,
    servingUnit: 'pieces',
    servingSize: 2,
    description: 'Soft, leavened flatbread baked in a tandoor oven',
    category: 'bread'
  },
  {
    id: 'gulab-jamun',
    name: 'Gulab Jamun',
    type: 'veg',
    origin: 'north-indian',
    spiceLevel: 1,
    popularity: 5,
    mealTypes: ['dinner'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: true,
    isGlutenFree: false,
    servingUnit: 'pieces',
    servingSize: 2,
    description: 'Deep-fried milk solids soaked in sugar syrup',
    category: 'dessert'
  },
  {
    id: 'aloo-paratha',
    name: 'Aloo Paratha',
    type: 'veg',
    origin: 'north-indian',
    spiceLevel: 2,
    popularity: 4,
    mealTypes: ['breakfast'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: true,
    isGlutenFree: false,
    servingUnit: 'pieces',
    servingSize: 2,
    description: 'Stuffed flatbread with spiced potato filling',
    category: 'main'
  },
  {
    id: 'tandoori-chicken',
    name: 'Tandoori Chicken',
    type: 'non-veg',
    origin: 'north-indian',
    spiceLevel: 4,
    popularity: 5,
    mealTypes: ['lunch', 'dinner'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: false,
    isGlutenFree: true,
    servingUnit: 'pieces',
    servingSize: 2,
    description: 'Marinated chicken cooked in a clay oven',
    category: 'main'
  },
  
  // Universal Dishes
  {
    id: 'jeera-rice',
    name: 'Jeera Rice',
    type: 'veg',
    origin: 'universal',
    spiceLevel: 1,
    popularity: 5,
    mealTypes: ['lunch', 'dinner'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: true,
    isGlutenFree: true,
    servingUnit: 'grams',
    servingSize: 150,
    description: 'Fragrant basmati rice with cumin tempering',
    category: 'rice'
  },
  {
    id: 'mixed-vegetable-curry',
    name: 'Mixed Vegetable Curry',
    type: 'veg',
    origin: 'universal',
    spiceLevel: 2,
    popularity: 4,
    mealTypes: ['lunch', 'dinner'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: false,
    isGlutenFree: true,
    servingUnit: 'grams',
    servingSize: 180,
    description: 'Assorted vegetables in a mildly spiced gravy',
    category: 'main'
  },
  {
    id: 'dal-tadka',
    name: 'Dal Tadka',
    type: 'veg',
    origin: 'universal',
    spiceLevel: 2,
    popularity: 4,
    mealTypes: ['lunch', 'dinner'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: true,
    isGlutenFree: true,
    servingUnit: 'grams',
    servingSize: 150,
    description: 'Yellow lentils tempered with cumin, garlic and spices',
    category: 'main'
  },
  {
    id: 'raita',
    name: 'Raita',
    type: 'veg',
    origin: 'universal',
    spiceLevel: 1,
    popularity: 4,
    mealTypes: ['lunch', 'dinner'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: true,
    isGlutenFree: true,
    servingUnit: 'grams',
    servingSize: 100,
    description: 'Yogurt with cucumber and mild spices',
    category: 'side'
  },
  {
    id: 'green-salad',
    name: 'Green Salad',
    type: 'veg',
    origin: 'universal',
    spiceLevel: 1,
    popularity: 3,
    mealTypes: ['lunch', 'dinner'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: true,
    isGlutenFree: true,
    servingUnit: 'grams',
    servingSize: 100,
    description: 'Fresh mix of cucumber, tomato, onion and lettuce',
    category: 'side'
  },
  {
    id: 'fruit-custard',
    name: 'Fruit Custard',
    type: 'veg',
    origin: 'universal',
    spiceLevel: 1,
    popularity: 4,
    mealTypes: ['dinner'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: true,
    isGlutenFree: true,
    servingUnit: 'cups',
    servingSize: 1,
    description: 'Sweet custard with mixed fruits',
    category: 'dessert'
  },
  {
    id: 'papad',
    name: 'Papad',
    type: 'veg',
    origin: 'universal',
    spiceLevel: 2,
    popularity: 4,
    mealTypes: ['lunch', 'dinner'],
    eventTypes: ['casual', 'wedding', 'corporate'],
    isJainFriendly: true,
    isGlutenFree: true,
    servingUnit: 'pieces',
    servingSize: 1,
    description: 'Thin, crisp disc made from lentil or rice flour',
    category: 'side'
  }
];

export interface AttendeeMix {
  southIndian: number;
  northIndian: number;
  foreigners: number;
  others: number;
}

export interface EventParameters {
  attendeeMix: AttendeeMix;
  vegNonVegRatio: number; // 0 to 1, representing percentage of vegetarian
  dietaryRestrictions: DietaryRestriction[];
  mealType: MealType;
  eventType: EventType;
}

export interface DishRecommendation {
  dish: Dish;
  quantity: number;
  quantityUnit: string;
  preparationTip?: string;
}

export interface MenuRecommendation {
  dishes: DishRecommendation[];
  cuisineProportions: Record<CuisineOrigin, number>;
}
