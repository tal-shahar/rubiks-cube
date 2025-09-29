// Production Configuration
module.exports = {
  // Environment variables for production
  NODE_ENV: 'production',
  REACT_APP_VERSION: process.env.npm_package_version || '1.0.1',
  REACT_APP_BUILD_TIME: new Date().toISOString(),
  
  // Performance optimizations
  GENERATE_SOURCEMAP: false,
  INLINE_RUNTIME_CHUNK: false,
  
  // AWS Configuration (set these in your deployment environment)
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || 'rubiks-cube-site',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  CLOUDFRONT_DISTRIBUTION_ID: process.env.CLOUDFRONT_DISTRIBUTION_ID || '',
  
  // Build optimizations
  BUILD_OPTIMIZE: true,
  REMOVE_CONSOLE_LOGS: true,
};
