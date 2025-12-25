import React from 'react';
import { createRoot } from 'react-dom/client';
import BottomNav from './src/components/BottomNav';

const DemoApp = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 pb-20">
        <div className="card mb-6">
          <h1 className="page-title">Bottom Navigation Demo</h1>
          <p className="page-subtitle">
            This demo showcases the enhanced bottom navigation bar with square-shaped icons 
            that fill with the primary color on hover.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="card-title">Features</h2>
            <ul className="list-disc pl-5 space-y-2 text-primary">
              <li>Square-shaped icons with consistent sizing</li>
              <li>Icons fill with primary color (#076653) on hover</li>
              <li>Active state shows filled icon with white text</li>
              <li>Rounded corners for modern appearance</li>
              <li>Haptic feedback on tap for mobile devices</li>
              <li>Fully responsive design</li>
            </ul>
          </div>
          
          <div className="card">
            <h2 className="card-title">Implementation</h2>
            <p className="text-primary mb-3">
              The bottom navigation bar uses custom CSS classes defined in index.css for consistent styling.
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <code className="text-sm">
                {`<button className="bottom-nav-button active">
  <div className="bottom-nav-icon-container">
    <Icon className="bottom-nav-icon active" />
  </div>
  <span className="bottom-nav-label active">Label</span>
</button>`}
              </code>
            </div>
          </div>
        </div>
        
        <div className="card mt-6">
          <h2 className="card-title">Color Palette</h2>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded bg-[#076653] mr-2"></div>
              <span className="text-sm">Primary: #076653</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded bg-[#E3EF26] mr-2"></div>
              <span className="text-sm">Accent: #E3EF26</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded bg-[#0C342C] mr-2"></div>
              <span className="text-sm">Dark: #0C342C</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

// Render the demo app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<DemoApp />);