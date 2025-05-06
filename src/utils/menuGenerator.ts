
import {
  dishes,
  Dish,
  DishType,
  MealType,
  EventType,
  CuisineOrigin,
  AttendeeMix,
  EventParameters,
  DishRecommendation,
  MenuRecommendation,
  DietaryRestriction
} from '../data/cuisineData';

// Calculate the total number of attendees
const getTotalAttendees = (attendeeMix: AttendeeMix): number => {
  return attendeeMix.southIndian + attendeeMix.northIndian + attendeeMix.foreigners + attendeeMix.others;
};

// Calculate cuisine proportions based on attendee mix
const calculateCuisineProportions = (attendeeMix: AttendeeMix): Record<CuisineOrigin, number> => {
  const total = getTotalAttendees(attendeeMix);
  
  if (total === 0) return { 'south-indian': 0, 'north-indian': 0, 'universal': 0 };
  
  // Base proportions from attendee demographics
  let southProportion = attendeeMix.southIndian / total;
  let northProportion = attendeeMix.northIndian / total;
  
  // Allocate 'others' based on south/north ratio, or equally if both are 0
  const othersRatio = attendeeMix.others / total;
  if (southProportion + northProportion > 0) {
    const distributionBase = southProportion + northProportion;
    southProportion += (southProportion / distributionBase) * othersRatio;
    northProportion += (northProportion / distributionBase) * othersRatio;
  } else {
    southProportion += othersRatio / 2;
    northProportion += othersRatio / 2;
  }
  
  // Calculate universal proportion based on foreigners percentage
  // and a base amount that everyone appreciates
  let universalProportion = (attendeeMix.foreigners / total) + 0.15;
  
  // Adjust south and north proportions to make room for universal
  const nonUniversalTotal = southProportion + northProportion;
  if (nonUniversalTotal > 0) {
    southProportion = southProportion * (1 - universalProportion);
    northProportion = northProportion * (1 - universalProportion);
  } else {
    universalProportion = 1.0;
    southProportion = 0;
    northProportion = 0;
  }
  
  // Round to 2 decimal places and ensure they add up to 1
  southProportion = Math.round(southProportion * 100) / 100;
  northProportion = Math.round(northProportion * 100) / 100;
  universalProportion = Math.round(universalProportion * 100) / 100;
  
  const sum = southProportion + northProportion + universalProportion;
  if (sum !== 1) {
    universalProportion = 1 - (southProportion + northProportion);
  }
  
  return {
    'south-indian': southProportion,
    'north-indian': northProportion,
    'universal': universalProportion
  };
};

// Filter dishes based on event parameters
const filterDishesByParameters = (
  params: EventParameters,
  dishType: DishType | 'both'
): Dish[] => {
  return dishes.filter(dish => {
    // Filter by meal type
    if (!dish.mealTypes.includes(params.mealType)) {
      return false;
    }

    // Filter by event type
    if (!dish.eventTypes.includes(params.eventType)) {
      return false;
    }

    // Filter by veg/non-veg
    if (dishType !== 'both' && dish.type !== dishType) {
      return false;
    }

    // Filter by dietary restrictions
    if (params.dietaryRestrictions.includes('jain') && !dish.isJainFriendly) {
      return false;
    }
    
    if (params.dietaryRestrictions.includes('gluten-free') && !dish.isGlutenFree) {
      return false;
    }

    return true;
  });
};

// Score dishes based on popularity, spice level for foreigners, etc.
const scoreDish = (dish: Dish, params: EventParameters): number => {
  let score = dish.popularity * 10; // Base score from popularity (0-50)
  
  // Reduce score for very spicy dishes if many foreigners
  const foreignerRatio = params.attendeeMix.foreigners / getTotalAttendees(params.attendeeMix);
  if (foreignerRatio > 0.2 && dish.spiceLevel > 3) {
    score -= (dish.spiceLevel - 3) * 5 * foreignerRatio * 10;
  }
  
  // Boost score for dishes that match the dominant demographic
  const southRatio = params.attendeeMix.southIndian / getTotalAttendees(params.attendeeMix);
  const northRatio = params.attendeeMix.northIndian / getTotalAttendees(params.attendeeMix);
  
  if (dish.origin === 'south-indian' && southRatio > 0.4) {
    score += 10 * southRatio;
  } else if (dish.origin === 'north-indian' && northRatio > 0.4) {
    score += 10 * northRatio;
  }
  
  // Universal dishes always get a small boost
  if (dish.origin === 'universal') {
    score += 5;
  }
  
  // Adjust scores for specific meal types
  if (params.mealType === 'breakfast' && dish.category === 'main') {
    score += 10;
  }
  
  if ((params.mealType === 'lunch' || params.mealType === 'dinner') && 
      (dish.category === 'main' || dish.category === 'rice')) {
    score += 8;
  }
  
  // Special occasion boost
  if (params.eventType === 'wedding' && dish.popularity >= 4) {
    score += 10;
  } else if (params.eventType === 'corporate' && dish.spiceLevel <= 3) {
    score += 8; // Less spicy is better for corporate events
  }
  
  return score;
};

// Generate menu recommendations based on parameters
export const generateMenuRecommendation = (params: EventParameters): MenuRecommendation => {
  const totalAttendees = getTotalAttendees(params.attendeeMix);
  
  // Calculate how many dishes of each type we need
  const vegCount = Math.round(params.vegNonVegRatio * totalAttendees);
  const nonVegCount = totalAttendees - vegCount;
  
  // Get cuisine proportions
  const cuisineProportions = calculateCuisineProportions(params.attendeeMix);
  
  // Filter dishes based on parameters
  let vegDishes = filterDishesByParameters(params, 'veg');
  const nonVegDishes = filterDishesByParameters(params, 'non-veg');
  
  // Score dishes
  vegDishes = vegDishes
    .map(dish => ({ dish, score: scoreDish(dish, params) }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.dish);
  
  const scoredNonVegDishes = nonVegDishes
    .map(dish => ({ dish, score: scoreDish(dish, params) }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.dish);
  
  // Select dishes based on cuisine proportions and categories
  const selectedDishes: DishRecommendation[] = [];
  const categoryCounts: Record<string, number> = {
    'main': 0,
    'side': 0,
    'bread': 0,
    'rice': 0,
    'dessert': 0,
    'starter': 0
  };
  
  const maxCategoryCounts: Record<string, number> = {
    'main': params.mealType === 'breakfast' ? 2 : 4,
    'side': 3,
    'bread': params.mealType === 'breakfast' ? 1 : 2,
    'rice': params.mealType === 'breakfast' ? 0 : 2,
    'dessert': params.mealType === 'breakfast' ? 0 : 2,
    'starter': params.mealType === 'breakfast' ? 0 : 2
  };
  
  // Get number of dishes we want for each cuisine
  const totalDishes = params.mealType === 'breakfast' ? 6 : 10;
  const cuisineDishCounts = {
    'south-indian': Math.round(cuisineProportions['south-indian'] * totalDishes),
    'north-indian': Math.round(cuisineProportions['north-indian'] * totalDishes),
    'universal': Math.round(cuisineProportions['universal'] * totalDishes)
  };
  
  // Function to select dishes of a specific origin and type
  const selectDishesByOriginAndType = (
    origin: CuisineOrigin,
    dishList: Dish[],
    count: number
  ): Dish[] => {
    return dishList
      .filter(dish => dish.origin === origin)
      .slice(0, count);
  };
  
  // Select vegetarian dishes based on cuisine proportions
  const southIndianVegDishes = selectDishesByOriginAndType('south-indian', vegDishes, cuisineDishCounts['south-indian']);
  const northIndianVegDishes = selectDishesByOriginAndType('north-indian', vegDishes, cuisineDishCounts['north-indian']);
  const universalVegDishes = selectDishesByOriginAndType('universal', vegDishes, cuisineDishCounts['universal']);
  
  // Combine dishes, ensuring we meet category limits
  const allSelectedDishes = [...southIndianVegDishes, ...northIndianVegDishes, ...universalVegDishes];
  
  // Add required categories if missing
  const ensureCategoryPresent = (category: string, dishList: Dish[]) => {
    if (categoryCounts[category] === 0 && maxCategoryCounts[category] > 0) {
      const dishOfCategory = dishList.find(d => d.category === category && 
        !selectedDishes.some(sd => sd.dish.id === d.id));
      if (dishOfCategory) {
        return dishOfCategory;
      }
    }
    return null;
  };
  
  // Ensure we have at least one main dish, one side, and one rice/bread
  if (params.mealType !== 'breakfast') {
    const mainDish = ensureCategoryPresent('main', vegDishes);
    if (mainDish && !selectedDishes.some(d => d.dish.id === mainDish.id)) {
      allSelectedDishes.push(mainDish);
    }
    
    const sideDish = ensureCategoryPresent('side', vegDishes);
    if (sideDish && !selectedDishes.some(d => d.dish.id === sideDish.id)) {
      allSelectedDishes.push(sideDish);
    }
    
    const riceDish = ensureCategoryPresent('rice', vegDishes);
    if (riceDish && !selectedDishes.some(d => d.dish.id === riceDish.id)) {
      allSelectedDishes.push(riceDish);
    }
    
    const breadDish = ensureCategoryPresent('bread', vegDishes);
    if (breadDish && !selectedDishes.some(d => d.dish.id === breadDish.id)) {
      allSelectedDishes.push(breadDish);
    }
    
    const dessertDish = ensureCategoryPresent('dessert', vegDishes);
    if (dessertDish && !selectedDishes.some(d => d.dish.id === dessertDish.id)) {
      allSelectedDishes.push(dessertDish);
    }
  }
  
  // Add non-vegetarian dishes if required
  if (nonVegCount > 0 && scoredNonVegDishes.length > 0) {
    // Add at least one main non-veg dish
    const mainNonVegDish = scoredNonVegDishes.find(d => d.category === 'main');
    if (mainNonVegDish) {
      allSelectedDishes.push(mainNonVegDish);
    }
    
    // Add another non-veg dish if significant non-veg attendance
    if (nonVegCount > totalAttendees * 0.4 && scoredNonVegDishes.length > 1) {
      const secondNonVegDish = scoredNonVegDishes.find(d => d.id !== mainNonVegDish?.id);
      if (secondNonVegDish) {
        allSelectedDishes.push(secondNonVegDish);
      }
    }
  }
  
  // Create final dish recommendations with quantities
  const recommendedDishes = Array.from(new Set(allSelectedDishes))
    .filter(dish => {
      if (categoryCounts[dish.category] < maxCategoryCounts[dish.category]) {
        categoryCounts[dish.category]++;
        return true;
      }
      return false;
    })
    .map(dish => {
      const quantity = calculateDishQuantity(dish, params);
      const preparationTip = generatePreparationTip(dish, params);
      
      return {
        dish,
        quantity: quantity,
        quantityUnit: dish.servingUnit,
        preparationTip
      };
    });
  
  return {
    dishes: recommendedDishes,
    cuisineProportions
  };
};

// Calculate quantity of dish needed based on attendance and dish type
const calculateDishQuantity = (dish: Dish, params: EventParameters): number => {
  const totalAttendees = getTotalAttendees(params.attendeeMix);
  
  // Base calculation using the dish's serving size
  let quantity = totalAttendees * dish.servingSize;
  
  // Adjust for veg/non-veg ratio
  if (dish.type === 'veg') {
    // Add some extra for non-veg people who might eat veg dishes
    quantity = quantity + (totalAttendees * (1 - params.vegNonVegRatio) * 0.3);
  } else {
    // Calculate based only on non-veg attendees
    quantity = totalAttendees * (1 - params.vegNonVegRatio) * dish.servingSize;
  }
  
  // Adjust for meal type (breakfast typically has smaller portions)
  if (params.mealType === 'breakfast') {
    quantity *= 0.8;
  }
  
  // Adjust for event type (weddings typically need more food)
  if (params.eventType === 'wedding') {
    quantity *= 1.2;
  }
  
  // Round the quantity appropriately based on the serving unit
  if (dish.servingUnit === 'pieces') {
    return Math.round(quantity);
  } else {
    return Math.round(quantity * 10) / 10; // Round to 1 decimal place
  }
};

// Generate preparation tips based on dish and parameters
const generatePreparationTip = (dish: Dish, params: EventParameters): string | undefined => {
  const foreignerRatio = params.attendeeMix.foreigners / getTotalAttendees(params.attendeeMix);
  
  if (foreignerRatio > 0.1 && dish.spiceLevel > 3) {
    return `Reduce spice level for a mixed audience with ${Math.round(foreignerRatio * 100)}% foreigners`;
  }
  
  if (dish.origin === 'south-indian' && params.attendeeMix.northIndian > params.attendeeMix.southIndian) {
    return `Consider a moderate spice level to accommodate North Indian palates`;
  }
  
  if (dish.origin === 'north-indian' && params.attendeeMix.southIndian > params.attendeeMix.northIndian) {
    return `South Indians might prefer this slightly spicier`;
  }
  
  if (params.eventType === 'corporate' && dish.spiceLevel > 3) {
    return `Keep spice moderate for a professional setting`;
  }
  
  return undefined;
};
