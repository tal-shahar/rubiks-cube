const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Rubik\'s Cube application...');

try {
  // Build the application
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Build files are in the "build" directory');
  console.log('🌐 To serve the application, you can use:');
  console.log('   npx serve -s build');
  console.log('   or');
  console.log('   npm install -g serve && serve -s build');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 