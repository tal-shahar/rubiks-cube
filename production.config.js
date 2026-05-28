// Production Configuration
module.exports = {
  // Environment variables for production
  NODE_ENV: 'production',
  REACT_APP_VERSION: process.env.npm_package_version || '1.0.1',
  REACT_APP_BUILD_TIME: new Date().toISOString(),
  
  // Performance optimizations
  GENERATE_SOURCEMAP: false,
  INLINE_RUNTIME_CHUNK: false,
  
  // Hostinger FTP (set in environment or GitHub Actions secrets)
  HOSTINGER_FTP_SERVER: process.env.HOSTINGER_FTP_SERVER || '',
  HOSTINGER_FTP_REMOTE_DIR: process.env.HOSTINGER_FTP_REMOTE_DIR || '/public_html/',
  
  // Build optimizations
  BUILD_OPTIMIZE: true,
  REMOVE_CONSOLE_LOGS: true,
};
