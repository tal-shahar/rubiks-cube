// Quick fix script to clear stuck version prompt
// Run this in browser console to fix the stuck state

console.log('🔧 Fixing stuck version prompt...');

// Clear all version-related storage
localStorage.removeItem('rubiks-cube-version');
localStorage.removeItem('rubiks-cube-build-time');
sessionStorage.removeItem('reload-count');

// Clear all caches
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
      caches.delete(cacheName);
    });
    console.log('✅ Caches cleared');
  });
}

// Clear service worker cache
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    if (registration.active) {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data.success) {
          console.log('✅ Service worker caches cleared');
        }
      };
      registration.active.postMessage({ type: 'CLEAR_CACHE' }, [messageChannel.port2]);
    }
  });
}

// Force reload without version check
console.log('🔄 Reloading page...');
setTimeout(() => {
  window.location.href = window.location.origin + window.location.pathname;
}, 1000);
