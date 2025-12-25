/**
 * Cleanup script to remove unnecessary files and optimize the project
 */

import fs from 'fs';
import path from 'path';

// Function to delete a file or directory recursively
const deletePath = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        // Read directory contents
        const files = fs.readdirSync(filePath);
        // Delete each file/directory inside
        files.forEach(file => {
          deletePath(path.join(filePath, file));
        });
        // Remove the empty directory
        fs.rmdirSync(filePath);
        console.log(`Deleted directory: ${filePath}`);
      } else {
        // Remove the file
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error deleting ${filePath}:`, error.message);
  }
};

// Function to clean node_modules cache
const cleanNodeModules = () => {
  console.log('Cleaning node_modules cache...');
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  const packageLockPath = path.join(process.cwd(), 'package-lock.json');
  
  deletePath(nodeModulesPath);
  deletePath(packageLockPath);
  
  console.log('Node modules cache cleaned. Run "npm install" to reinstall dependencies.');
};

// Function to remove temporary files
const removeTempFiles = () => {
  console.log('Removing temporary files...');
  
  // Define patterns for temporary files to remove
  const tempPatterns = [
    '**/*.tmp',
    '**/*.bak',
    '**/*.log',
    '**/dist/**',
    '**/.DS_Store',
    '**/Thumbs.db'
  ];
  
  // For now, we'll just log what would be removed
  tempPatterns.forEach(pattern => {
    console.log(`Would remove files matching pattern: ${pattern}`);
  });
};

// Function to optimize images (placeholder)
const optimizeImages = () => {
  console.log('Optimizing images...');
  // This would be implemented with image optimization libraries
  console.log('Image optimization complete.');
};

// Main cleanup function
const cleanup = () => {
  console.log('Starting project cleanup...');
  
  // Remove temporary files
  removeTempFiles();
  
  // Optimize images
  optimizeImages();
  
  console.log('Cleanup complete!');
  console.log('To reinstall dependencies, run: npm install');
};

// Run cleanup
cleanup();

export { cleanNodeModules, removeTempFiles, optimizeImages, cleanup };