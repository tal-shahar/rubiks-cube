// Version tracking and cache management utilities

// Get version from package.json at build time
const VERSION = process.env.REACT_APP_VERSION || '1.0.1';
const BUILD_TIME = process.env.REACT_APP_BUILD_TIME || new Date().toISOString();

// Cache busting utilities
export const getVersion = () => VERSION;
export const getBuildTime = () => BUILD_TIME;

// Generate cache-busting query parameter
export const getCacheBuster = () => `?v=${VERSION}&t=${Date.now()}`;

// Check if this is a new version (for localStorage comparison)
export const isNewVersion = () => {
  const storedVersion = localStorage.getItem('rubiks-cube-version');
  const currentVersion = VERSION;
  
  if (storedVersion !== currentVersion) {
    localStorage.setItem('rubiks-cube-version', currentVersion);
    localStorage.setItem('rubiks-cube-build-time', BUILD_TIME);
    return true;
  }
  return false;
};

// Clear all caches when new version is detected
export const clearCaches = () => {
  try {
    // Clear localStorage (except keybindings)
    const keybindings = localStorage.getItem('rubiks-cube-keybindings');
    localStorage.clear();
    if (keybindings) {
      localStorage.setItem('rubiks-cube-keybindings', keybindings);
    }
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear service worker cache if available
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    
    // Clear service worker cache via message
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.active) {
          const messageChannel = new MessageChannel();
          messageChannel.port1.onmessage = (event) => {
            if (event.data.success) {
              console.log('✅ Service worker caches cleared');
            } else {
              console.error('❌ Failed to clear service worker caches:', event.data.error);
            }
          };
          registration.active.postMessage({ type: 'CLEAR_CACHE' }, [messageChannel.port2]);
        }
      });
    }
    
    console.log('🧹 Caches cleared for new version:', VERSION);
    return true;
  } catch (error) {
    console.error('❌ Failed to clear caches:', error);
    return false;
  }
};

// Silent reload with cache busting (for manual use if needed)
export const silentReload = () => {
  const url = new URL(window.location);
  url.searchParams.set('v', VERSION);
  url.searchParams.set('t', Date.now().toString());
  window.location.href = url.toString();
};

// Initialize version checking
export const initializeVersionCheck = () => {
  // Check if we're already in a reload loop
  const reloadCount = parseInt(sessionStorage.getItem('reload-count') || '0');
  if (reloadCount > 2) {
    console.log('🔄 Too many reloads, stopping version check');
    sessionStorage.removeItem('reload-count');
    return;
  }

  if (isNewVersion()) {
    console.log('🆕 New version detected:', VERSION);
    clearCaches();
    
    // Increment reload counter
    sessionStorage.setItem('reload-count', (reloadCount + 1).toString());
    
    // Silent reload - no prompts, just provide latest version
    console.log('🔄 Silently updating to latest version...');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } else {
    // Reset reload counter if no new version
    sessionStorage.removeItem('reload-count');
  }
};

// Get version info for debugging
export const getVersionInfo = () => ({
  version: VERSION,
  buildTime: BUILD_TIME,
  userAgent: navigator.userAgent,
  timestamp: new Date().toISOString()
});
