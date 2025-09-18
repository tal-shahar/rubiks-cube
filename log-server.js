// Simple HTTP server to receive logs from React app and print to terminal
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.method === 'POST' && req.url === '/log') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const timestamp = new Date().toISOString();
        
        // Check if this is a shape button click
        const isShapeClick = data.message && data.message.includes('SHAPE BUTTON CLICKED');
        
        if (isShapeClick) {
          // Make shape button clicks more prominent
          console.log('\n' + '🔥'.repeat(50));
          console.log(`🎯 ${data.message} - ${timestamp}`);
          console.log('🔥'.repeat(50));
          if (data.data && data.data.summary) {
            console.log(`📊 Shape: ${data.data.summary.shape}`);
            console.log(`🆔 Piece ID: ${data.data.summary.pieceId}`);
            console.log(`📍 Current Position: ${data.data.summary.currentPos}`);
            console.log(`🎯 Expected Position: ${data.data.summary.expectedPos}`);
            console.log(`✅ Is Correct: ${data.data.summary.isCorrect}`);
            console.log(`📈 Move Count: ${data.data.summary.moveCount}`);
          }
          console.log('🔥'.repeat(50) + '\n');
        } else {
          // Regular logging for other messages
          console.log(`\n🎯 ${data.message} - ${timestamp}`);
          if (data.data) {
            console.log(JSON.stringify(data.data, null, 2));
          }
          console.log('='.repeat(80) + '\n');
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        console.error('Error parsing log data:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else if (req.method === 'POST' && req.url === '/write-log') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        console.log('Received write-log body:', body.substring(0, 100)); // Debug: show first 100 chars
        
        // Write directly to cube-debug.log file (body is already formatted text)
        const logFilePath = path.join(__dirname, 'cube-debug.log');
        fs.appendFileSync(logFilePath, body);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        console.error('Error writing to log file:', error);
        console.error('Body received:', body.substring(0, 200)); // Debug: show first 200 chars
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to write log' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Log server running on port ${PORT}`);
  console.log('Ready to receive logs from React app...');
});
