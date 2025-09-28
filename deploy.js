const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;
const buildTime = new Date().toISOString();

console.log(`🚀 Building Rubik's Cube application v${version}...`);

try {
  // Set environment variables for build
  process.env.REACT_APP_VERSION = version;
  process.env.REACT_APP_BUILD_TIME = buildTime;
  
  // Build the application
  execSync('npm run build', { stdio: 'inherit' });
  
  // Update service worker with new version
  const swPath = path.join('build', 'sw.js');
  if (fs.existsSync(swPath)) {
    let swContent = fs.readFileSync(swPath, 'utf8');
    swContent = swContent.replace(/v\d+\.\d+\.\d+/g, `v${version}`);
    fs.writeFileSync(swPath, swContent);
    console.log('🔧 Service worker version updated');
  }
  
  // Update HTML file with version and build time
  const htmlPath = path.join('build', 'index.html');
  if (fs.existsSync(htmlPath)) {
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    htmlContent = htmlContent.replace(/content="\d+\.\d+\.\d+"/g, `content="${version}"`);
    htmlContent = htmlContent.replace(/content="\d{4}-\d{2}-\d{2}T[\d:.-]+Z"/g, `content="${buildTime}"`);
    fs.writeFileSync(htmlPath, htmlContent);
    console.log('🔧 HTML version meta tags updated');
  }
  
  console.log('✅ Build completed successfully!');
  console.log(`📦 Version: ${version}`);
  console.log(`⏰ Build time: ${buildTime}`);
  console.log('📁 Build files are in the "build" directory');
  console.log('🌐 To serve the application, you can use:');
  console.log('   npx serve -s build');
  console.log('   or');
  console.log('   npm install -g serve && serve -s build');
  console.log('🧹 Cache will be automatically cleared for users on next visit');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 