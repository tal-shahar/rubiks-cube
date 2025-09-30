// Enhanced logging utilities for Rubik's Cube
// Throttling for logging to prevent too many requests
let lastLogTime = 0;
const LOG_THROTTLE_MS = 200; // Only log every 200ms
let logErrorShown = false;

// Test mode flag to disable throttling in tests
let testMode = false;
export const setTestMode = (enabled) => {
  testMode = enabled;
};

// Environment detection - only use localhost endpoints in development
const isDevelopment = process.env.NODE_ENV === 'development';

// Special logging function for rotation tracking
export const logRotationStep = (step, face, direction, data = null) => {
  const timestamp = new Date().toLocaleTimeString();
  const message = `🔄 ROTATION STEP ${step}: ${face} ${direction}`;
  logToTerminal(message, data, 'INFO');
};

// Enhanced logging function that will be visible in terminal
export const logToTerminal = (message, data = null, type = 'INFO') => {
  const now = Date.now();
  
  // Throttle logging to prevent too many requests during animations (skip in test mode)
  if (!testMode && now - lastLogTime < LOG_THROTTLE_MS) {
    return;
  }
  lastLogTime = now;
  
  const timestamp = new Date().toLocaleTimeString();
  const prefix = type === 'ERROR' ? '❌' : type === 'WARNING' ? '⚠️' : type === 'SUCCESS' ? '✅' : '🎯';
  const fullMessage = `${prefix} [${timestamp}] ${message}`;
  
  // Create a more structured log entry
  const logEntry = {
    timestamp: timestamp,
    type: type,
    message: message,
    data: data
  };
  
  // Log to browser console with enhanced formatting
  // console.log(`\n${fullMessage}`);
  // if (data) {
  //   if (typeof data === 'object') {
  //   console.log(JSON.stringify(data, null, 2));
  //   } else {
  //     console.log(data);
  //   }
  // }
  // console.log('='.repeat(80) + '\n');
  
  // Try to send to log server, but don't fail if it's not available
  // Only attempt this in development mode
  const sendToLogServer = async () => {
    if (!isDevelopment) {
      return; // Skip localhost logging in production
    }
    
    try {
      const response = await fetch('http://localhost:3001/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
        // Add timeout to prevent hanging (skip in test mode)
        ...(testMode ? {} : { signal: AbortSignal.timeout(1000) })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('✅ Log sent to terminal successfully');
    } catch (error) {
      // Only show error once to avoid spam
      if (!logErrorShown) {
        // console.log('💡 Log server not available - logging to console only');
        logErrorShown = true;
      }
    }
  };
  
  // Try to write to local file, but don't fail if it's not available
  // Only attempt this in development mode
  const writeToFile = async () => {
    if (!isDevelopment) {
      return; // Skip localhost logging in production
    }
    
    try {
      const fileLogLine = `[${timestamp}] ${type}: ${message}${data ? ' | Data: ' + JSON.stringify(data) : ''}\n`;
      await fetch('http://localhost:3001/write-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: fileLogLine,
        // Add timeout to prevent hanging (skip in test mode)
        ...(testMode ? {} : { signal: AbortSignal.timeout(1000) })
      });
    } catch (error) {
      // Silently fail - file logging is optional
    }
  };
  
  // Execute both operations without blocking
  sendToLogServer();
  writeToFile();
};
