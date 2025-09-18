// Simple Node.js script to log cube state to terminal
// This will be called from the React app to log to terminal

const fs = require('fs');
const path = require('path');

// Function to log cube state to terminal
function logCubeState(message, data) {
  const timestamp = new Date().toISOString();
  const logMessage = `\n🎯 ${message} - ${timestamp}\n`;
  const dataString = data ? JSON.stringify(data, null, 2) : '';
  const separator = '='.repeat(80) + '\n';
  
  const fullLog = logMessage + dataString + '\n' + separator;
  
  // Log to console (terminal)
  console.log(fullLog);
  
  // Also write to a log file
  const logFile = path.join(__dirname, 'cube-state.log');
  fs.appendFileSync(logFile, fullLog);
}

// Export for use in other scripts
module.exports = { logCubeState };

// If run directly, log a test message
if (require.main === module) {
  logCubeState('TEST MESSAGE', { test: 'data' });
}
