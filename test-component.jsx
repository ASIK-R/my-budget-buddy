import React from 'react';
import ResponsiveStatCard from './src/components/ResponsiveStatCard';

// Simple test to verify the component works
const TestComponent = () => {
  return (
    <div>
      <h1>Test ResponsiveStatCard</h1>
      <ResponsiveStatCard 
        title="Test Card" 
        value="$1000" 
        iconColor="text-blue-500"
        valueColor="text-green-500"
      />
    </div>
  );
};

export default TestComponent;