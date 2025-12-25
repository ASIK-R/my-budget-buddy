#!/usr/bin/env node

import { existsSync } from 'fs'
import { join } from 'path'

console.log('Expense Tracker APK Creation Script')
console.log('====================================')

// Check if dist folder exists
const distPath = join(process.cwd(), 'dist')
if (!existsSync(distPath)) {
  console.error('Error: dist folder not found. Please run "npm run build" first.')
  process.exit(1)
}

console.log('✓ Dist folder found')

// Check if required files exist
const requiredFiles = ['index.html', 'manifest.webmanifest']
for (const file of requiredFiles) {
  if (!existsSync(join(distPath, file))) {
    console.error(`Error: Required file ${file} not found in dist folder.`)
    process.exit(1)
  }
}

console.log('✓ Required PWA files found')

console.log('\nTo create an APK from this PWA, follow these steps:')
console.log('\n1. The PWA is already being served at http://localhost:58102')
console.log('\n2. Visit https://www.pwabuilder.com in your browser')
console.log('\n3. Enter the URL: http://localhost:58102')
console.log('\n4. Click "Start"')
console.log('\n5. After analysis, click "Build Package"')
console.log('\n6. Select "Android" as the platform')
console.log('\n7. Fill in the package information:')
console.log('   - Package ID: com.expensetracker.app')
console.log('   - App name: Expense Tracker')
console.log('   - App version: 1.0.0')
console.log('   - App version code: 1')
console.log('   - Host URL: http://localhost:58102 (for testing only)')
console.log('   - Manifest URL: http://localhost:58102/manifest.webmanifest')
console.log('   - Theme color: #6366f1')
console.log('   - Background color: #ffffff')
console.log('\n8. Click "Generate"')
console.log('\n9. Download the generated APK file')
console.log('\nFor production deployment:')
console.log('- Deploy the contents of the "dist" folder to a web server')
console.log('- Use the public URL instead of localhost in PWABuilder')
console.log('- Sign the APK with your own keystore for distribution')

console.log('\nYour PWA is ready! Open http://localhost:58102 in your browser to test it.')