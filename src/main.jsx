import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Optimize React rendering
const rootElement = document.getElementById('root');
const loaderEl = document.getElementById('initial-loader');

if (rootElement) {
  try {
    // Clear any static fallback content from index.html to ensure React mounts cleanly
    rootElement.innerHTML = '';

    // Create root once and reuse
    const root = ReactDOM.createRoot(rootElement);
    
    // Render the app with optimized settings
    root.render(<App />);

    // Fade out and remove the initial loader once React mounts
    if (loaderEl) {
      // Use microtask to ensure render kicked off
      setTimeout(() => {
        loaderEl.style.transition = 'opacity 0.3s ease-out';
        loaderEl.style.opacity = '0';
        // Remove from DOM after transition to avoid overlaying clicks
        setTimeout(() => {
          if (loaderEl.parentNode) {
            loaderEl.parentNode.removeChild(loaderEl);
          }
        }, 300);
      }, 0);
    }
  } catch (error) {
    console.error('Failed to render app:', error);
    if (loaderEl && loaderEl.parentNode) {
      loaderEl.parentNode.removeChild(loaderEl);
    }
    // Fallback UI in case of error
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:16px;background-color:#f8fafc;color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <div style="font-size:18px;font-weight:600;color:#ef4444;">Application Error</div>
          <div style="font-size:14px;text-align:center;padding:0 20px;">Failed to load the application. Please check the console for details.</div>
          <button onclick="location.reload()" style="padding:10px 16px;border-radius:12px;border:none;background:#22c55e;color:white;font-weight:600;cursor:pointer;margin-top:10px;">Reload Page</button>
        </div>
      `;
    }
  }
} else {
  // Fallback if root element is not found
  document.body.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:16px;background-color:#f8fafc;color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="font-size:18px;font-weight:600;color:#ef4444;">Application Error</div>
      <div style="font-size:14px;text-align:center;padding:0 20px;">Root element not found. Please check your HTML structure.</div>
    </div>
  `;
}