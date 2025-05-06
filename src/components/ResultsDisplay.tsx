
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MenuRecommendation, CuisineOrigin, DishRecommendation } from '@/data/cuisineData';

interface ResultsDisplayProps {
  recommendation: MenuRecommendation;
  onReset: () => void;
}

// Helper function to capitalize and format strings
const formatText = (text: string): string => {
  return text
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper function to get color based on cuisine
const getCuisineColor = (origin: CuisineOrigin): string => {
  switch (origin) {
    case 'south-indian':
      return 'bg-primary text-primary-foreground';
    case 'north-indian':
      return 'bg-secondary text-secondary-foreground';
    case 'universal':
      return 'bg-accent text-accent-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

// Group dishes by category
const groupDishesByCategory = (dishes: DishRecommendation[]) => {
  return dishes.reduce((acc, dish) => {
    const category = dish.dish.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(dish);
    return acc;
  }, {} as Record<string, DishRecommendation[]>);
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ recommendation, onReset }) => {
  const { dishes, cuisineProportions } = recommendation;
  const groupedDishes = groupDishesByCategory(dishes);
  
  // Categories in preferred display order
  const categoryOrder = ['main', 'side', 'rice', 'bread', 'starter', 'dessert'];
  
  // Get percentage for each cuisine
  const southPercent = Math.round(cuisineProportions['south-indian'] * 100);
  const northPercent = Math.round(cuisineProportions['north-indian'] * 100);
  const universalPercent = Math.round(cuisineProportions['universal'] * 100);

  return (
    <Card className="w-full max-w-3xl shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white">
        <CardTitle className="text-2xl font-bold">Your Customized Menu</CardTitle>
        <CardDescription className="text-white/90">
          Balanced meal plan based on your event demographics
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="menu">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="menu">Menu List</TabsTrigger>
            <TabsTrigger value="proportions">Cuisine Breakdown</TabsTrigger>
            <TabsTrigger value="quantities">Quantities</TabsTrigger>
          </TabsList>
          
          {/* Menu List Tab */}
          <TabsContent value="menu">
            <div className="space-y-6">
              {categoryOrder.map(category => {
                if (!groupedDishes[category]) return null;
                return (
                  <div key={category} className="space-y-3">
                    <h3 className="font-semibold text-lg capitalize">{formatText(category)}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groupedDishes[category].map((item, index) => (
                        <div 
                          key={item.dish.id} 
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow animate-dish-appear"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h4 className="font-semibold">{item.dish.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.dish.description}
                              </p>
                            </div>
                            <Badge 
                              className={`${getCuisineColor(item.dish.origin)}`}
                            >
                              {formatText(item.dish.origin)}
                            </Badge>
                          </div>
                          
                          <div className="mt-2 flex items-center gap-3">
                            <Badge 
                              variant={item.dish.type === 'veg' ? 'outline' : 'destructive'}
                              className={item.dish.type === 'veg' 
                                ? 'border-green-500 text-green-600 bg-green-50'
                                : ''
                              }
                            >
                              {item.dish.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                            </Badge>
                            
                            <div className="flex items-center gap-1">
                              <span className="text-sm">Spice:</span>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span 
                                    key={i} 
                                    className={`w-2 h-2 rounded-full mx-px ${
                                      i < item.dish.spiceLevel 
                                      ? 'bg-red-500' 
                                      : 'bg-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {item.preparationTip && (
                            <div className="mt-2 text-sm text-blue-600 italic">
                              Tip: {item.preparationTip}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <Separator className="mt-4" />
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          {/* Cuisine Proportions Tab */}
          <TabsContent value="proportions">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-block p-6 rounded-full bg-gray-100">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* South Indian */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="transparent" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth="10"
                        strokeDasharray={`${southPercent} ${100 - southPercent}`}
                        strokeDashoffset="25"
                        className="transition-all duration-700"
                      />
                      
                      {/* North Indian */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="35" 
                        fill="transparent" 
                        stroke="hsl(var(--secondary))" 
                        strokeWidth="10"
                        strokeDasharray={`${northPercent} ${100 - northPercent}`}
                        strokeDashoffset="25"
                        className="transition-all duration-700"
                      />
                      
                      {/* Universal */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="25" 
                        fill="transparent" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth="10"
                        strokeDasharray={`${universalPercent} ${100 - universalPercent}`}
                        strokeDashoffset="25"
                        className="transition-all duration-700"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-primary mr-2"></div>
                      <span>South Indian</span>
                    </div>
                    <span className="font-semibold">{southPercent}%</span>
                  </div>
                  <Progress value={southPercent} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-secondary mr-2"></div>
                      <span>North Indian</span>
                    </div>
                    <span className="font-semibold">{northPercent}%</span>
                  </div>
                  <Progress value={northPercent} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-accent mr-2"></div>
                      <span>Universal</span>
                    </div>
                    <span className="font-semibold">{universalPercent}%</span>
                  </div>
                  <Progress value={universalPercent} className="h-2" />
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Quantities Tab */}
          <TabsContent value="quantities">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dish</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dishes.map((item) => (
                  <TableRow key={item.dish.id}>
                    <TableCell className="font-medium">{item.dish.name}</TableCell>
                    <TableCell>
                      {item.quantity} {item.quantityUnit}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getCuisineColor(item.dish.origin)}`}>
                        {formatText(item.dish.origin)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.dish.type === 'veg' ? 'outline' : 'destructive'}
                        className={item.dish.type === 'veg' 
                          ? 'border-green-500 text-green-600 bg-green-50'
                          : ''
                        }
                      >
                        {item.dish.type === 'veg' ? 'Veg' : 'Non-Veg'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onReset}>
          Start Over
        </Button>
        <Button onClick={() => window.print()}>
          Print Menu
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResultsDisplay;
