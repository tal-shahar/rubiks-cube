#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load production configuration
const config = require('./production.config.js');

console.log('🚀 Starting Production Deployment for Rubik\'s Cube...');
console.log(`📦 Version: ${config.REACT_APP_VERSION}`);
console.log(`⏰ Build Time: ${config.REACT_APP_BUILD_TIME}`);

// Set environment variables for production build
process.env.NODE_ENV = config.NODE_ENV;
process.env.REACT_APP_VERSION = config.REACT_APP_VERSION;
process.env.REACT_APP_BUILD_TIME = config.REACT_APP_BUILD_TIME;
process.env.GENERATE_SOURCEMAP = config.GENERATE_SOURCEMAP.toString();
process.env.INLINE_RUNTIME_CHUNK = config.INLINE_RUNTIME_CHUNK.toString();

try {
  // Step 1: Clean previous builds
  console.log('\n🧹 Cleaning previous builds...');
  if (fs.existsSync('build')) {
    fs.rmSync('build', { recursive: true, force: true });
  }

  // Step 2: Install dependencies
  console.log('\n📦 Installing dependencies...');
  execSync('npm ci --production=false', { stdio: 'inherit' });

  // Step 3: Run tests
  console.log('\n🧪 Running tests...');
  execSync('npm test -- --watchAll=false --coverage', { stdio: 'inherit' });

  // Step 4: Build for production
  console.log('\n🔨 Building for production...');
  execSync('npm run build', { stdio: 'inherit' });

  // Step 5: Verify build
  console.log('\n✅ Verifying build...');
  const buildDir = path.join(__dirname, 'build');
  if (!fs.existsSync(buildDir)) {
    throw new Error('Build directory not found');
  }

  const buildFiles = fs.readdirSync(buildDir);
  console.log(`📁 Build contains ${buildFiles.length} files/directories`);

  // Step 6: Update service worker with version
  const swPath = path.join(buildDir, 'sw.js');
  if (fs.existsSync(swPath)) {
    let swContent = fs.readFileSync(swPath, 'utf8');
    swContent = swContent.replace(/v\d+\.\d+\.\d+/g, `v${config.REACT_APP_VERSION}`);
    fs.writeFileSync(swPath, swContent);
    console.log('🔧 Service worker version updated');
  }

  // Step 7: Update HTML with version and build time
  const htmlPath = path.join(buildDir, 'index.html');
  if (fs.existsSync(htmlPath)) {
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    htmlContent = htmlContent.replace(/content="\d+\.\d+\.\d+"/g, `content="${config.REACT_APP_VERSION}"`);
    htmlContent = htmlContent.replace(/content="\d{4}-\d{2}-\d{2}T[\d:.-]+Z"/g, `content="${config.REACT_APP_BUILD_TIME}"`);
    fs.writeFileSync(htmlPath, htmlContent);
    console.log('🔧 HTML version meta tags updated');
  }

  // Step 8: Create deployment info file
  const deploymentInfo = {
    version: config.REACT_APP_VERSION,
    buildTime: config.REACT_APP_BUILD_TIME,
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    buildOptimizations: {
      sourceMaps: config.GENERATE_SOURCEMAP,
      consoleLogsRemoved: config.REMOVE_CONSOLE_LOGS,
      inlineRuntimeChunk: config.INLINE_RUNTIME_CHUNK
    }
  };

  fs.writeFileSync(
    path.join(buildDir, 'deployment-info.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log('\n🎉 Production build completed successfully!');
  console.log(`📦 Version: ${config.REACT_APP_VERSION}`);
  console.log(`⏰ Build time: ${config.REACT_APP_BUILD_TIME}`);
  console.log('📁 Build files are in the "build" directory');
  console.log('\n🌐 Deployment Options:');
  console.log('1. Local testing: npm run serve');
  console.log('2. AWS S3: npm run deploy:s3');
  console.log('3. Manual upload: Upload build/ folder to your hosting provider');

  // Step 9: Check if AWS credentials are available for deployment
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    console.log('\n🔑 AWS credentials detected. Ready for S3 deployment.');
    console.log('Run: npm run deploy:s3');
  } else {
    console.log('\n⚠️  AWS credentials not found. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for S3 deployment.');
  }

} catch (error) {
  console.error('❌ Production deployment failed:', error.message);
  process.exit(1);
}
