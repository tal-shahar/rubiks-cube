import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for cache management (temporarily disabled)
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then((registration) => {
//         console.log('🔧 Service Worker registered successfully:', registration.scope);
//         
//         // Check for updates silently
//         registration.addEventListener('updatefound', () => {
//           const newWorker = registration.installing;
//           newWorker.addEventListener('statechange', () => {
//             if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
//               console.log('🆕 New version available! Reload to update.');
//               // Optionally show update notification
//               if (window.confirm('A new version is available! Reload to get the latest features?')) {
//                 window.location.reload();
//               }
//             }
//           });
//         });
//       })
//       .catch((error) => {
//         console.log('❌ Service Worker registration failed:', error);
//       });
//   });
// } 