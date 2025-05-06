
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { EventParameters, DietaryRestriction, MealType, EventType } from '@/data/cuisineData';

// Define form schema with zod
const formSchema = z.object({
  southIndian: z.coerce.number().int().min(0, "Must be a non-negative number"),
  northIndian: z.coerce.number().int().min(0, "Must be a non-negative number"),
  foreigners: z.coerce.number().int().min(0, "Must be a non-negative number"),
  others: z.coerce.number().int().min(0, "Must be a non-negative number"),
  vegRatio: z.number().min(0).max(1),
  jain: z.boolean().default(false),
  glutenFree: z.boolean().default(false),
  mealType: z.enum(["breakfast", "lunch", "dinner"]),
  eventType: z.enum(["casual", "wedding", "corporate"])
});

type FormValues = z.infer<typeof formSchema>;

interface InputFormProps {
  onSubmit: (params: EventParameters) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [vegPercent, setVegPercent] = useState(80);

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      southIndian: 60,
      northIndian: 30,
      foreigners: 10,
      others: 0,
      vegRatio: 0.8,
      jain: false,
      glutenFree: false,
      mealType: "dinner" as MealType,
      eventType: "casual" as EventType
    }
  });

  // Handle form submission
  const handleFormSubmit = (values: FormValues) => {
    const dietaryRestrictions: DietaryRestriction[] = [];
    if (values.jain) dietaryRestrictions.push("jain");
    if (values.glutenFree) dietaryRestrictions.push("gluten-free");
    if (dietaryRestrictions.length === 0) dietaryRestrictions.push("none");

    const params: EventParameters = {
      attendeeMix: {
        southIndian: values.southIndian,
        northIndian: values.northIndian,
        foreigners: values.foreigners,
        others: values.others
      },
      vegNonVegRatio: values.vegRatio,
      dietaryRestrictions,
      mealType: values.mealType as MealType,
      eventType: values.eventType as EventType
    };
    
    onSubmit(params);
  };

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const vegRatio = value[0] / 100;
    setVegPercent(value[0]);
    form.setValue("vegRatio", vegRatio);
  };

  return (
    <Card className="w-full max-w-lg shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white">
        <CardTitle className="text-2xl font-bold">Indian Cuisine Compass</CardTitle>
        <CardDescription className="text-white/90">
          Enter your event details for a customized menu recommendation
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Attendee Demographics</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="southIndian"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>South Indians</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="northIndian"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>North Indians</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="foreigners"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foreigners</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="others"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Others</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dietary Preferences</h3>
              
              <FormItem>
                <FormLabel>Vegetarian / Non-Vegetarian Ratio</FormLabel>
                <div className="space-y-2">
                  <Slider
                    defaultValue={[80]}
                    max={100}
                    min={0}
                    step={5}
                    onValueChange={handleSliderChange}
                  />
                  <div className="flex justify-between text-sm">
                    <span>Non-Veg: {100 - vegPercent}%</span>
                    <span>Veg: {vegPercent}%</span>
                  </div>
                </div>
              </FormItem>
              
              <div className="flex flex-col space-y-2">
                <FormField
                  control={form.control}
                  name="jain"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Jain dietary restrictions</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="glutenFree"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Gluten-free options needed</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mealType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meal Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select meal type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="casual">Casual Gathering</SelectItem>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              Generate Menu Recommendations
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InputForm;
