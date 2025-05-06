
import React, { useState } from 'react';
import InputForm from '@/components/InputForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import { EventParameters, MenuRecommendation } from '@/data/cuisineData';
import { generateMenuRecommendation } from '@/utils/menuGenerator';

const Index = () => {
  const [recommendation, setRecommendation] = useState<MenuRecommendation | null>(null);

  const handleFormSubmit = (params: EventParameters) => {
    const menuRecommendation = generateMenuRecommendation(params);
    setRecommendation(menuRecommendation);
  };

  const handleReset = () => {
    setRecommendation(null);
  };

  return (
    <div className="min-h-screen gradient-pattern">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Indian Cuisine Compass</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Create the perfect Indian menu for your event based on attendee demographics
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center">
          {!recommendation ? (
            <InputForm onSubmit={handleFormSubmit} />
          ) : (
            <ResultsDisplay recommendation={recommendation} onReset={handleReset} />
          )}
        </div>
        
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>This algorithm calculates optimal menu recommendations based on regional preferences and dietary needs</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
