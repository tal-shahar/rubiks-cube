// Simple script to monitor cube state logs
// Run this in a separate terminal to see the logs

const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'cube-state.log');

console.log('🎯 Cube State Log Monitor');
console.log('Watching for cube state changes...');
console.log('Open http://localhost:3000 and interact with the cube to see logs here.\n');

// Watch for changes to the log file
fs.watchFile(logFile, (curr, prev) => {
  if (curr.mtime > prev.mtime) {
    // File was modified, read and display the new content
    fs.readFile(logFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading log file:', err);
        return;
      }
      
      // Get only the new content (this is a simple approach)
      const lines = data.split('\n');
      const newLines = lines.slice(-20); // Show last 20 lines
      console.log(newLines.join('\n'));
    });
  }
});

// Also check if log file exists, if not create it
if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, '');
  console.log('Created log file:', logFile);
}
