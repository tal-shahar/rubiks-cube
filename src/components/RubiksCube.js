import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// FORCE RELOAD - B ROTATION DEBUG - UPDATED AT 5:30 PM
console.log('🔥 RUBIKSCUBE.JS LOADED - B ROTATION DEBUG MODE - UPDATED');

// Special logging function for rotation tracking
const logRotationStep = (step, face, direction, data = null) => {
  const timestamp = new Date().toLocaleTimeString();
  const message = `🔄 ROTATION STEP ${step}: ${face} ${direction}`;
  logToTerminal(message, data, 'INFO');
};

// Throttling for logging to prevent too many requests
let lastLogTime = 0;
const LOG_THROTTLE_MS = 200; // Only log every 200ms
let logErrorShown = false;

// Enhanced logging function that will be visible in terminal
const logToTerminal = (message, data = null, type = 'INFO') => {
  const now = Date.now();
  
  // Throttle logging to prevent too many requests during animations
  if (now - lastLogTime < LOG_THROTTLE_MS) {
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
  console.log(`\n${fullMessage}`);
  if (data) {
    if (typeof data === 'object') {
    console.log(JSON.stringify(data, null, 2));
    } else {
      console.log(data);
    }
  }
  console.log('='.repeat(80) + '\n');
  
  // Try to send to log server, but don't fail if it's not available
  const sendToLogServer = async () => {
    try {
      const response = await fetch('http://localhost:3001/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(1000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('✅ Log sent to terminal successfully');
    } catch (error) {
      // Only show error once to avoid spam
      if (!logErrorShown) {
        console.log('💡 Log server not available - logging to console only');
        logErrorShown = true;
      }
    }
  };
  
  // Try to write to local file, but don't fail if it's not available
  const writeToFile = async () => {
    try {
      const fileLogLine = `[${timestamp}] ${type}: ${message}${data ? ' | Data: ' + JSON.stringify(data) : ''}\n`;
      await fetch('http://localhost:3001/write-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: fileLogLine,
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(1000)
      });
    } catch (error) {
      // Silently fail - file logging is optional
    }
  };
  
  // Execute both operations without blocking
  sendToLogServer();
  writeToFile();
};

// Function to create unique shapes for each piece with different border colors per face
function createShapeWithFaceBorder(pieceId, size, faceIndex, pieceColors) {
  // Use the piece's actual colors instead of hardcoded colors
  const colorMap = {
    'white': '#FFFFFF',
    'yellow': '#FFD700',
    'red': '#DC143C',
    'orange': '#FF8C00',
    'blue': '#0000FF',
    'green': '#00FF00',
    'purple': '#800080',
    'cyan': '#00FFFF',
    'magenta': '#FF00FF',
    'lime': '#00FF00',
    '#444444': '#444444',
    'pink': '#FFC0CB',
    'black': '#000000'
  };
  
  // Get the actual color for this face from the piece
  const faceNames = ['front', 'back', 'right', 'left', 'top', 'bottom'];
  const faceName = faceNames[faceIndex];
  const faceColor = pieceColors ? pieceColors[faceName] : '#444444';
  const borderColor = colorMap[faceColor] || '#444444';

  const shapes = [
    // 0-4: Basic geometric shapes (Squares) using piece colors
    () => <group position={[0, 0, 0.012]}>
      <mesh><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Square
    () => <group position={[0, 0, 0.012]}>
      <mesh><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Square
    () => <group position={[0, 0, 0.012]}>
      <mesh><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Square
    () => <group position={[0, 0, 0.012]}>
      <mesh><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Square
    () => <group position={[0, 0, 0.012]}>
      <mesh><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Square

    // 5-9: Circles using piece colors
    () => <group position={[0, 0, 0.012]}>
      <mesh><circleGeometry args={[size/2, 32]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]}><circleGeometry args={[size*0.45, 32]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]}><circleGeometry args={[size*0.4, 32]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Circle
    () => <group position={[0, 0, 0.012]}>
      <mesh><circleGeometry args={[size/2, 32]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]}><circleGeometry args={[size*0.45, 32]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]}><circleGeometry args={[size*0.4, 32]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Circle
    () => <group position={[0, 0, 0.012]}>
      <mesh><circleGeometry args={[size/2, 32]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]}><circleGeometry args={[size*0.45, 32]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]}><circleGeometry args={[size*0.4, 32]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Circle
    () => <group position={[0, 0, 0.012]}>
      <mesh><circleGeometry args={[size/2, 32]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]}><circleGeometry args={[size*0.45, 32]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]}><circleGeometry args={[size*0.4, 32]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Circle
    () => <group position={[0, 0, 0.012]}>
      <mesh><circleGeometry args={[size/2, 32]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]}><circleGeometry args={[size*0.45, 32]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]}><circleGeometry args={[size*0.4, 32]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Circle

    // 10-14: Triangles (flat cones to create triangle shapes) with individual face border colors
    () => <group position={[0, 0, 0.012]}>
      <mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Triangle
    () => <group position={[0, 0, 0.012]}>
      <mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Triangle
    () => <group position={[0, 0, 0.012]}>
      <mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Triangle
    () => <group position={[0, 0, 0.012]}>
      <mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Triangle
    () => <group position={[0, 0, 0.012]}>
      <mesh rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Diamond

    // 15-19: Diamonds (rotated squares) with individual face border colors
    () => <group position={[0, 0, 0.012]}>
      <mesh rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Diamond
    () => <group position={[0, 0, 0.012]}>
      <mesh rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Diamond
    () => <group position={[0, 0, 0.012]}>
      <mesh rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Diamond
    () => <group position={[0, 0, 0.012]}>
      <mesh rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Diamond
    () => <group position={[0, 0, 0.012]}>
      <mesh rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Diamond

    // 20-25: Triangles (flat cones to create triangle shapes) with individual face border colors
    () => <group position={[0, 0, 0.012]}>
      <mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Triangle
    () => <group position={[0, 0, 0.012]}>
      <mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Triangle
    () => <group position={[0, 0, 0.012]}>
      <mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Triangle
    () => <group position={[0, 0, 0.012]}>
      <mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Triangle
    () => <group position={[0, 0, 0.012]}>
      <mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>, // Triangle
    () => <group position={[0, 0, 0.012]}>
      <mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group> // Triangle
  ];
  
  const shapeIndex = pieceId;
  return shapes[shapeIndex]();
}

// Function to create unique shapes for each piece
function createShape(pieceId, size) {
  const shapes = [
    // 0-4: Basic geometric shapes (Squares)
    () => <group position={[0, 0, 0.012]}><mesh><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Square
    () => <group position={[0, 0, 0.012]}><mesh><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Square
    () => <group position={[0, 0, 0.012]}><mesh><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Square
    () => <group position={[0, 0, 0.012]}><mesh><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Square
    () => <group position={[0, 0, 0.012]}><mesh><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Square

    // 5-9: Circles
    () => <group position={[0, 0, 0.012]}><mesh><circleGeometry args={[size/2, 32]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]}><circleGeometry args={[size*0.45, 32]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]}><circleGeometry args={[size*0.4, 32]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Circle
    () => <group position={[0, 0, 0.012]}><mesh><circleGeometry args={[size/2, 32]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]}><circleGeometry args={[size*0.45, 32]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]}><circleGeometry args={[size*0.4, 32]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Circle
    () => <group position={[0, 0, 0.012]}><mesh><circleGeometry args={[size/2, 32]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]}><circleGeometry args={[size*0.45, 32]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]}><circleGeometry args={[size*0.4, 32]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Circle
    () => <group position={[0, 0, 0.012]}><mesh><circleGeometry args={[size/2, 32]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]}><circleGeometry args={[size*0.45, 32]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]}><circleGeometry args={[size*0.4, 32]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Circle
    () => <group position={[0, 0, 0.012]}><mesh><circleGeometry args={[size/2, 32]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]}><circleGeometry args={[size*0.45, 32]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]}><circleGeometry args={[size*0.4, 32]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Circle

    // 10-14: Triangles (flat cones to create triangle shapes)
    () => <group position={[0, 0, 0.012]}><mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Triangle
    () => <group position={[0, 0, 0.012]}><mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Triangle
    () => <group position={[0, 0, 0.012]}><mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Triangle
    () => <group position={[0, 0, 0.012]}><mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Triangle
    () => <group position={[0, 0, 0.012]}><mesh rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Diamond

    // 15-19: Diamonds (rotated squares)
    () => <group position={[0, 0, 0.012]}><mesh rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Diamond
    () => <group position={[0, 0, 0.012]}><mesh rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Diamond
    () => <group position={[0, 0, 0.012]}><mesh rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Diamond
    () => <group position={[0, 0, 0.012]}><mesh rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Diamond
    () => <group position={[0, 0, 0.012]}><mesh rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Diamond

    // 20-25: Triangles (flat cones to create triangle shapes)
    () => <group position={[0, 0, 0.012]}><mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Triangle
    () => <group position={[0, 0, 0.012]}><mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Triangle
    () => <group position={[0, 0, 0.012]}><mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Triangle
    () => <group position={[0, 0, 0.012]}><mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Triangle
    () => <group position={[0, 0, 0.012]}><mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh></group>, // Triangle
    () => <group position={[0, 0, 0.012]}><mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh><mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color="#444444" /></mesh><mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh></group> // Triangle
  ];
  
  const shapeIndex = pieceId; // Changed from pieceId % shapes.length
  return shapes[shapeIndex]();
}

// Individual cube piece component with smooth rotation
function CubePiece({ position, colors, size = 0.95, pieceId = 0, isHighlighted = false, highlightInfo = null, rotatingFace = null, rotationProgress = 0 }) {
  const meshRef = useRef();
  const groupRef = useRef();
  
  // Log piece information for debugging
  React.useEffect(() => {
    const shapeTypes = ['Square', 'Square', 'Square', 'Square', 'Square', 'Circle', 'Circle', 'Circle', 'Circle', 'Circle', 'Triangle', 'Triangle', 'Triangle', 'Triangle', 'Diamond', 'Diamond', 'Diamond', 'Diamond', 'Diamond', 'Diamond', 'Triangle', 'Triangle', 'Triangle', 'Triangle', 'Triangle', 'Triangle'];
    const shapeColors = ['Red', 'Blue', 'Green', 'Orange', 'Purple', 'Red', 'Blue', 'Green', 'Orange', 'Yellow', 'Cyan', 'Magenta', 'Lime', 'Pink', 'Purple', 'Red', 'Blue', 'Green', 'Orange', 'Purple', 'Cyan', 'Magenta', 'Lime', 'Pink', 'Purple', 'Yellow'];
    
    const shapeType = shapeTypes[pieceId] || 'Unknown'; // Changed from pieceId % shapeTypes.length
    const shapeColor = shapeColors[pieceId] || 'Unknown'; // Changed from pieceId % shapeColors.length
    
    // Debug specific pieces only
    if (pieceId === 0 || pieceId === 17 || pieceId === 25 || pieceId === 1 || pieceId === 11) {
      console.log(`🔍 ${shapeColor} ${shapeType} Piece ${pieceId} at position [${position.join(', ')}]`);
      console.log(`  Stored Colors:`, colors);
      
      // Show what colors should be visible based on position
      const [x, y, z] = position;
      const visibleFaces = [];
      if (x === 1) visibleFaces.push('right');
      if (x === -1) visibleFaces.push('left');
      if (y === 1) visibleFaces.push('top');
      if (y === -1) visibleFaces.push('bottom');
      if (z === 1) visibleFaces.push('front');
      if (z === -1) visibleFaces.push('back');
      
      console.log(`  Visible faces:`, visibleFaces);
      console.log(`  Colors on visible faces:`, visibleFaces.map(face => `${face}: ${colors[face]}`));
    }
  }, [pieceId, position, colors]);

  // Color mapping
  const colorMap = {
    'white': '#FFFFFF',
    'yellow': '#FFD700',
    'red': '#DC143C', // More vibrant red (crimson)
    'orange': '#FF8C00', // More vibrant orange
    'blue': '#0000FF',
    'green': '#00FF00',
    'purple': '#800080',
    'cyan': '#00FFFF',
    'magenta': '#FF00FF',
    'lime': '#00FF00',
    '#444444': '#444444', // Dark gray for hidden faces
    'pink': '#FFC0CB',
    'black': '#000000' // Keep black as black
  };

  // Create cube geometry
  const cubeGeometry = useMemo(() => new THREE.BoxGeometry(size, size, size), [size]);
  
  // Create face geometry
  const faceGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(size, size);
    return geometry;
  }, [size]);

  // Get the color for a face based on the face index - always use original colors
  const getFaceColor = (faceIndex) => {
    // Always use the piece's stored colors - no rotation needed
    switch (faceIndex) {
      case 0: return colors.front;
      case 1: return colors.back;
      case 2: return colors.right;
      case 3: return colors.left;
      case 4: return colors.top;
      case 5: return colors.bottom;
      default: return '#444444'; // Use dark gray instead of black
    }
  };

  // Check if a face should be visible based on the piece's current position
  const isFaceVisible = (faceIndex) => {
    const [x, y, z] = position;
    
    // Determine which faces are visible based on current position
    const visibleFaces = [];
    if (x === 1) visibleFaces.push(2); // Right face visible
    if (x === -1) visibleFaces.push(3); // Left face visible
    if (y === 1) visibleFaces.push(4); // Top face visible
    if (y === -1) visibleFaces.push(5); // Bottom face visible
    if (z === 1) visibleFaces.push(0); // Front face visible
    if (z === -1) visibleFaces.push(1); // Back face visible
    
    return visibleFaces.includes(faceIndex);
  };

  // Check if this piece is part of the currently rotating face
  const isPartOfRotatingFace = useCallback(() => {
    if (!rotatingFace) return false;
    
    const [x, y, z] = position;
    const { face } = rotatingFace;
    
    switch (face) {
      case 'F': return z === 1;
      case 'B': return z === -1;
      case 'R': return x === 1;
      case 'L': return x === -1;
      case 'U': return y === 1;
      case 'D': return y === -1;
      default: return false;
    }
  }, [position, rotatingFace]);

  // Calculate group rotation for smooth animation
  const getGroupRotationAngle = () => {
    if (!rotatingFace || !isPartOfRotatingFace()) {
      return { x: 0, y: 0, z: 0 };
    }

    const { face, direction } = rotatingFace;
    const sign = direction === 'clockwise' ? 1 : -1;
    const angle = (Math.PI / 2) * rotationProgress * sign; // 90 degrees total

    switch (face) {
      case 'F': return { x: 0, y: 0, z: angle };
      case 'B': return { x: 0, y: 0, z: -angle };
      case 'R': return { x: angle, y: 0, z: 0 };
      case 'L': return { x: -angle, y: 0, z: 0 };
      case 'U': return { x: 0, y: angle, z: 0 };
      case 'D': return { x: 0, y: -angle, z: 0 };
      default: return { x: 0, y: 0, z: 0 };
    }
  };

  // For group rotation, NO individual position offsets - all pieces stay in their original positions
  // The rotation will be applied to the entire group, not individual pieces
  const getGroupPositionOffset = () => {
    // Return zero offset - pieces should NOT move individually during group rotation
    return { x: 0, y: 0, z: 0 };
  };



  // For group rotation, individual pieces don't need to rotate - the group handles it
  // Just use the original position without any offsets or individual rotations
  const finalPosition = position;

  return (
    <group 
      ref={groupRef}
      position={finalPosition}
      rotation={[0, 0, 0]} // No individual rotation - handled by the group
    >
      {/* Solid cube base */}
      <mesh geometry={cubeGeometry}>
        <meshPhongMaterial 
          color={isPartOfRotatingFace() ? "#666666" : "#333333"}
          emissive={isPartOfRotatingFace() ? "#444444" : "#000000"}
          emissiveIntensity={isPartOfRotatingFace() ? 0.3 : 0}
        />
      </mesh>
      
      {/* Colored faces - only show visible faces */}
      {[0, 1, 2, 3, 4, 5].map((faceIndex) => {
        // Only render faces that should be visible based on original position
        if (!isFaceVisible(faceIndex)) {
          return null;
        }

        const faceColor = getFaceColor(faceIndex);
        
        // Define face positions and rotations correctly
        let facePosition, faceRotation;
        
        switch (faceIndex) {
          case 0: // Front face (Z+)
            facePosition = [0, 0, size/2 + 0.001];
            faceRotation = [0, 0, 0];
            break;
          case 1: // Back face (Z-)
            facePosition = [0, 0, -size/2 - 0.001];
            faceRotation = [0, Math.PI, 0];
            break;
          case 2: // Right face (X+)
            facePosition = [size/2 + 0.001, 0, 0];
            faceRotation = [0, Math.PI/2, 0];
            break;
          case 3: // Left face (X-)
            facePosition = [-size/2 - 0.001, 0, 0];
            faceRotation = [0, -Math.PI/2, 0];
            break;
          case 4: // Top face (Y+)
            facePosition = [0, size/2 + 0.001, 0];
            faceRotation = [-Math.PI/2, 0, 0];
            break;
          case 5: // Bottom face (Y-)
            facePosition = [0, -size/2 - 0.001, 0];
            faceRotation = [Math.PI/2, 0, 0];
            break;
          default:
            facePosition = [0, 0, 0];
            faceRotation = [0, 0, 0];
        }
        
        // Check if this face should be highlighted (painted pink)
        const faceNames = ['front', 'back', 'right', 'left', 'top', 'bottom'];
        const currentFaceName = faceNames[faceIndex];
        const shouldHighlight = isHighlighted && highlightInfo && 
          highlightInfo.blackVisibleFaces && 
          highlightInfo.blackVisibleFaces.includes(currentFaceName);
        
        // If this face should be highlighted, paint it bright pink
        const displayColor = shouldHighlight ? '#FF1493' : (colorMap[faceColor] || faceColor || '#444444');
        
        return (
          <mesh
            key={faceIndex}
            position={facePosition}
            rotation={faceRotation}
            geometry={faceGeometry}
          >
            <meshPhongMaterial 
              color={displayColor} 
              side={THREE.FrontSide}
              emissive={isPartOfRotatingFace() ? displayColor : "#000000"}
              emissiveIntensity={isPartOfRotatingFace() ? 0.5 : 0.1}
            />
          </mesh>
        );
      })}
      
      {/* Debug shape on visible faces only */}
      {[0, 1, 2, 3, 4, 5].map((faceIndex) => {
        // Only render shapes on faces that should be visible based on original position
        if (!isFaceVisible(faceIndex)) {
          return null;
        }

        // Define face positions and rotations correctly (same as colored faces)
        let facePosition, faceRotation;
        
        switch (faceIndex) {
          case 0: // Front face (Z+)
            facePosition = [0, 0, size/2 + 0.002];
            faceRotation = [0, 0, 0];
            break;
          case 1: // Back face (Z-)
            facePosition = [0, 0, -size/2 - 0.002];
            faceRotation = [0, Math.PI, 0];
            break;
          case 2: // Right face (X+)
            facePosition = [size/2 + 0.002, 0, 0];
            faceRotation = [0, Math.PI/2, 0];
            break;
          case 3: // Left face (X-)
            facePosition = [-size/2 - 0.002, 0, 0];
            faceRotation = [0, -Math.PI/2, 0];
            break;
          case 4: // Top face (Y+)
            facePosition = [0, size/2 + 0.002, 0];
            faceRotation = [-Math.PI/2, 0, 0];
            break;
          case 5: // Bottom face (Y-)
            facePosition = [0, -size/2 - 0.002, 0];
            faceRotation = [Math.PI/2, 0, 0];
            break;
          default:
            facePosition = [0, 0, 0];
            faceRotation = [0, 0, 0];
        }
        
        // Get the face color for this specific face
        const faceColor = getFaceColor(faceIndex);
        
        return (
          <group key={`shape-${faceIndex}`} position={facePosition} rotation={faceRotation}>
            {createShapeWithFaceBorder(pieceId, size * 0.3, faceIndex, colors)}
          </group>
        );
      })}
    </group>
  );
}

// Function to get the original solved colors for a piece based on its pieceId
function getOriginalColors(pieceId) {
  // Map pieceId to original solved position
  const positions = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        positions.push([x, y, z]);
      }
    }
  }
  
  const originalPosition = positions[pieceId];
  const [x, y, z] = originalPosition;
  
  // Assign colors based on original solved position
  // Each piece should have different colors based on its position
  let colors = {
    front: '#444444',    // Default to dark gray (hidden)
    back: '#444444',     // Default to dark gray (hidden)
    right: '#444444',    // Default to dark gray (hidden)
    left: '#444444',     // Default to dark gray (hidden)
    top: '#444444',      // Default to dark gray (hidden)
    bottom: '#444444'    // Default to dark gray (hidden)
  };
  
  // Set colors based on which faces are visible in the solved state
  if (x === -1) colors.left = 'orange';   // Left face pieces
  if (x === 1) colors.right = 'red';      // Right face pieces
  if (y === -1) colors.bottom = 'green';  // Bottom face pieces
  if (y === 1) colors.top = 'blue';       // Top face pieces
  if (z === -1) colors.back = 'yellow';   // Back face pieces
  if (z === 1) colors.front = 'white';    // Front face pieces
  
  return colors;
}

// Function to get starting position colors for a piece (saved when cube is initialized)
function getStartingPositionColors(pieceId) {
  // This function returns the colors that should be visible when the piece is in its starting position
  // These colors will move with the piece and always be positioned outward-facing
  const positions = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        positions.push([x, y, z]);
      }
    }
  }
  
  const startingPosition = positions[pieceId];
  const [x, y, z] = startingPosition;
  
  // Store the colors that this piece should have (these move with the piece)
  // These are the "starting colors" that will always be positioned outward-facing
  const startingColors = {
    front: null,
    back: null,
    right: null,
    left: null,
    top: null,
    bottom: null
  };
  
  // Assign the starting colors based on the piece's original position
  if (x === -1) startingColors.left = 'orange';   // Left face pieces
  if (x === 1) startingColors.right = 'red';      // Right face pieces
  if (y === -1) startingColors.bottom = 'green';  // Bottom face pieces
  if (y === 1) startingColors.top = 'blue';       // Top face pieces
  if (z === -1) startingColors.back = 'yellow';   // Back face pieces
  if (z === 1) startingColors.front = 'white';    // Front face pieces
  
  return {
    position: startingPosition,
    visibleColors: startingColors
  };
}

// Function to ensure starting colors are outward-facing
function ensureStartingColorsOutwardFacing(piece, currentPosition) {
  const [x, y, z] = currentPosition;
  
  // Get the starting colors for this piece (these move with the piece)
  const startingColors = piece.startingColors || getStartingPositionColors(piece.pieceId);
  
  // Create new color object with starting colors positioned outward
  const outwardColors = {
    front: '#444444',    // Default to dark gray (hidden)
    back: '#444444',     // Default to dark gray (hidden)
    right: '#444444',    // Default to dark gray (hidden)
    left: '#444444',     // Default to dark gray (hidden)
    top: '#444444',      // Default to dark gray (hidden)
    bottom: '#444444'    // Default to dark gray (hidden)
  };
  
  // Determine which faces should be visible based on current position
  const shouldBeVisible = {
    front: z === 1,
    back: z === -1,
    right: x === 1,
    left: x === -1,
    top: y === 1,
    bottom: y === -1
  };
  
  // Position the starting colors to face outward based on current position
  if (shouldBeVisible.front && startingColors.visibleColors.front) {
    outwardColors.front = startingColors.visibleColors.front;
  }
  if (shouldBeVisible.back && startingColors.visibleColors.back) {
    outwardColors.back = startingColors.visibleColors.back;
  }
  if (shouldBeVisible.right && startingColors.visibleColors.right) {
    outwardColors.right = startingColors.visibleColors.right;
  }
  if (shouldBeVisible.left && startingColors.visibleColors.left) {
    outwardColors.left = startingColors.visibleColors.left;
  }
  if (shouldBeVisible.top && startingColors.visibleColors.top) {
    outwardColors.top = startingColors.visibleColors.top;
  }
  if (shouldBeVisible.bottom && startingColors.visibleColors.bottom) {
    outwardColors.bottom = startingColors.visibleColors.bottom;
  }
  
  console.log(`🎨 Positioned starting colors outward for piece ${piece.pieceId} at [${x}, ${y}, ${z}]`);
  console.log(`🎨 Starting colors:`, JSON.stringify(startingColors.visibleColors));
  console.log(`🎨 Outward colors:`, JSON.stringify(outwardColors));
  
  return outwardColors;
}

// Function to get expected color for a face
function getExpectedColorForFace(face) {
  const colorMap = {
    front: 'white',
    back: 'yellow',
    right: 'red',
    left: 'orange',
    top: 'blue',
    bottom: 'green'
  };
  return colorMap[face] || '#444444';
}

// Pure JavaScript global state manager - NO React dependencies
const CubeStateManager = {
  state: null,
  initialized: false,
  listeners: [],
  
  // Ensure initialization happens only once
  ensureInitialized() {
    if (!this.initialized) {
      console.log('🚨🚨🚨 CubeStateManager: REINITIALIZING - This should not happen!');
      console.trace('🚨 REINITIALIZATION - Stack trace:');
      this.initialize();
    }
  },

  getState() {
    console.log('🔄 CubeStateManager.getState called, initialized:', this.initialized);
    console.log('🔄 CubeStateManager object:', this);
    console.log('🔄 this.initialized type:', typeof this.initialized, 'value:', this.initialized);
    
    // Only initialize if we don't have a state yet
    if (!this.state || this.state.length === 0) {
      console.log('🚨🚨🚨 CubeStateManager.getState: No state exists, calling initialize()');
      console.trace('🚨 getState called - Stack trace:');
      this.initialize();
    } else {
      console.log('🔄 CubeStateManager.getState: State already exists, returning existing state');
    }
    console.log('🔄 CubeStateManager.getState: Returning state with', this.state?.length, 'pieces');
    if (this.state && this.state.length > 0) {
      console.log('🔄 CubeStateManager.getState: First piece colors:', JSON.stringify(this.state[0].colors));
    }
    return this.state;
  },

  setState(newState) {
    console.log('🔄 CubeStateManager.setState called');
    console.log('Current state colors:', this.state?.map(p => `${p.pieceId}: ${JSON.stringify(p.colors)}`));
    console.log('NewState type:', typeof newState, newState);
    
    if (typeof newState === 'function') {
      console.log('🔄 setState: Using function update');
      this.state = newState(this.state);
    } else {
      console.log('🔄 setState: Using direct assignment');
      this.state = newState;
    }

    console.log('🔄 CubeStateManager.setState completed');
    console.log('New state colors:', this.state?.map(p => `${p.pieceId}: ${JSON.stringify(p.colors)}`));

    // Notify all listeners
    console.log('🔄 Notifying', this.listeners.length, 'listeners');
    this.listeners.forEach(listener => listener());
  },

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },

  initialize() {
    console.log('🔄 CubeStateManager: INITIALIZING CUBE STATE - This should only happen once!');
    console.log('🔄 Current initialized state before initialize:', this.initialized);
    console.trace('🚨 INITIALIZE called - Stack trace:');
    logToTerminal('🔄 CubeStateManager: INITIALIZING CUBE STATE - This should only happen once!', null, 'INFO');

    const state = [];
    
    // Create 26 pieces (3x3x3 minus center)
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Skip the center piece
          if (x === 0 && y === 0 && z === 0) continue;
          
          // Get pieceId based on position in solved state
          const pieceId = state.length;
          
          // Get original colors for this piece
          const colors = getOriginalColors(pieceId);
          
          // Debug logging for initial state
          console.log(`Initial piece ${pieceId} at [${x}, ${y}, ${z}]:`, colors);
          console.log(`getOriginalColors returned:`, JSON.stringify(colors));
          
          // Get starting position colors for this piece
          const startingPositionColors = getStartingPositionColors(pieceId);
          
          // Use the original colors directly - they already represent the starting colors
          state.push({ 
            position: [x, y, z], 
            colors: colors, // Use the original colors (starting colors)
            startingColors: startingPositionColors, // Store the starting position colors for reference
            rotationHistory: [], // Track all rotations this piece has undergone
            pieceId: pieceId // Store the pieceId for reference
          });
        }
      }
    }
    
    // Log the complete initial cube state as JSON
    console.log('🎯 INITIAL CUBE STATE (End of Initial Load):');
    console.log(JSON.stringify(state, null, 2));
    
    // Also log to terminal (this will show in the terminal where npm start is running)
    logToTerminal('🎯 INITIAL CUBE STATE (End of Initial Load)', state, 'INFO');

    this.state = state;
    this.initialized = true;
  }
};

// Make CubeStateManager available globally
if (typeof window !== 'undefined') {
  window.CubeStateManager = CubeStateManager;
  console.log('🌐 CubeStateManager exposed globally on window object');
}

// Simple React component that uses the global state manager
function CubeStateProvider({ children, onCubeStateChange }) {
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Subscribe to state changes
  useEffect(() => {
    const unsubscribe = CubeStateManager.subscribe(() => {
      setForceUpdate(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  const cubeState = CubeStateManager.getState();

  // Function to update cube state
  const setCubeState = useCallback((newState) => {
    console.log('🔄 setCubeState called - BEFORE update');
    console.log('Current state colors:', CubeStateManager.getState().map(p => `${p.pieceId}: ${JSON.stringify(p.colors)}`));
    
    CubeStateManager.setState(newState);
    
    console.log('🔄 setCubeState called - AFTER update');
    console.log('New state colors:', CubeStateManager.getState().map(p => `${p.pieceId}: ${JSON.stringify(p.colors)}`));
  }, []);

  const [isAnimating, setIsAnimating] = useState(false);
  const [rotatingFace, setRotatingFace] = useState(null);
  const [rotationProgress, setRotationProgress] = useState(0);
  const [moveHistory, setMoveHistory] = useState([]); // Simple move history for solve
  const [hasRotated, setHasRotated] = useState(false); // Track if any rotations have occurred

  // Debug cube state changes
  React.useEffect(() => {
    console.log('🔄 CUBE STATE CHANGED:', cubeState.map(p => `${p.pieceId}: [${p.position.join(', ')}] colors: ${JSON.stringify(p.colors)}`));
    
    // Log to terminal: cube state changes
    logToTerminal(`🎯 useCubeState useEffect triggered`, null, 'INFO');
    logToTerminal(`🔄 CUBE STATE CHANGED`, cubeState.map(p => `${p.pieceId}: [${p.position.join(', ')}] colors: ${JSON.stringify(p.colors)}`), 'INFO');
    
    // Notify parent component of cube state changes
    if (onCubeStateChange && cubeState) {
      onCubeStateChange(cubeState);
    }
    
    // Temporarily disabled color reset detection to debug visual issue
    // Only check for color resets if rotations have occurred (not during initial load)
    if (false && hasRotated) {
      const hasOriginalColors = cubeState.every((piece, index) => {
        const originalColors = getOriginalColors(index);
        return JSON.stringify(piece.colors) === JSON.stringify(originalColors);
      });

      if (hasOriginalColors && cubeState.length > 0) {
        logToTerminal('🚨 COLOR RESET DETECTED: All pieces have original colors!', null, 'ERROR');
        logToTerminal('🚨 This indicates the cube state was reinitialized!', null, 'ERROR');
      }
    }
  }, [cubeState, hasRotated]);

  // REMOVED: Color rotation logic - starting colors now move with pieces and are always outward-facing

  // Consolidated rotation logic
  const applyRotation = useCallback((pieces, face, direction) => {
    logRotationStep('A', face, direction, 'applyRotation called');
    logRotationStep('B', face, direction, 'Input pieces colors', pieces.map(p => `${p.pieceId}: ${JSON.stringify(p.colors)}`));
    
    // Filter pieces that are part of the rotating face
    const rotatingPieces = pieces.filter(piece => {
      const [x, y, z] = piece.position;
      switch (face) {
        case 'F': return z === 1; // Front face
        case 'B': return z === -1; // Back face
        case 'R': return x === 1; // Right face
        case 'L': return x === -1; // Left face
        case 'U': return y === 1; // Up face
        case 'D': return y === -1; // Down face
        default: return false;
      }
    });
    
    console.log(`🎯 Found ${rotatingPieces.length} pieces on ${face} face`);
    logRotationStep('B1', face, direction, `Found ${rotatingPieces.length} pieces on face`, rotatingPieces.map(p => `${p.pieceId}: [${p.position.join(', ')}]`));
    
    rotatingPieces.forEach(piece => {
      const [x, y, z] = piece.position;
      let newX = x, newY = y, newZ = z;
      
      // Apply 3D transformation based on face
      switch (face) {
        case 'F': // Front face rotation (Z+ plane)
          if (direction === 'clockwise') {
            newX = -y;
            newY = x;
          } else {
            newX = y;
            newY = -x;
          }
          break;
        case 'B': // Back face rotation (Z- plane)
          if (direction === 'clockwise') {
            newX = y;
            newY = -x;
          } else {
            newX = -y;
            newY = x;
          }
          break;
        case 'R': // Right face rotation (X+ plane)
          if (direction === 'clockwise') {
            newY = -z;
            newZ = y;
          } else {
            newY = z;
            newZ = -y;
          }
          break;
        case 'L': // Left face rotation (X- plane)
          if (direction === 'clockwise') {
            newY = z;
            newZ = -y;
          } else {
            newY = -z;
            newZ = y;
          }
          break;
        case 'U': // Up face rotation (Y+ plane)
          if (direction === 'clockwise') {
            newX = z;
            newZ = -x;
          } else {
            newX = -z;
            newZ = x;
          }
          break;
        case 'D': // Down face rotation (Y- plane)
          if (direction === 'clockwise') {
            newX = -z;
            newZ = x;
          } else {
            newX = z;
            newZ = -x;
          }
          break;
      }
      
      console.log(`🔄 Piece ${piece.pieceId} moving from [${x}, ${y}, ${z}] to [${newX}, ${newY}, ${newZ}]`);
      
      // Update position
      piece.position = [newX, newY, newZ];
      
      // Colors stay with the piece - no color changes during rotation
      console.log(`🔄 Piece ${piece.pieceId} moved to new position [${newX}, ${newY}, ${newZ}] - colors preserved`);
      
      // Add to rotation history
      piece.rotationHistory.push({
        move: face,
        direction: direction,
        fromPosition: [x, y, z],
        toPosition: [newX, newY, newZ],
        timestamp: new Date().toISOString()
      });
    });
    
    logRotationStep('C', face, direction, 'Output pieces colors', pieces.map(p => `${p.pieceId}: ${JSON.stringify(p.colors)}`));
    logRotationStep('D', face, direction, 'applyRotation completed');
  }, []);

  // Function to rotate a face with smooth 3D animation
  const rotateFaceWithAnimation = useCallback((face, direction, onComplete) => {
    console.log(`🎯🎯🎯 FUNCTION ACTIVATED: rotateFaceWithAnimation called: ${face} ${direction} 🎯🎯🎯`);
    logToTerminal(`🎯🎯🎯 FUNCTION ACTIVATED: rotateFaceWithAnimation called`, { face, direction }, 'INFO');
    
    console.log(`🎯 Rotating face ${face} ${direction} with smooth animation`);
    
    // Check if already animating
    if (isAnimating) {
      console.log(`⚠️ rotateFaceWithAnimation: Already animating, skipping ${face} ${direction}`);
      return;
    }
    
    // Set animation state
    setIsAnimating(true);
    
    // Log rotation start to terminal
    logRotationStep('3', face, direction, 'rotateFaceWithAnimation called');
    logRotationStep('4', face, direction, 'ROTATION STARTED');
    
    // Record the move for solve (same as manual rotation)
    setMoveHistory(prev => {
      const newHistory = [...prev, { face, direction, timestamp: Date.now() }];
      console.log(`📝 RECORDED MOVE: ${face} ${direction} (Total moves: ${newHistory.length})`);
      return newHistory;
    });
    
    // Set the rotating face for visual feedback
    setRotatingFace({ face, direction });
    setRotationProgress(0);
    
    // Smooth animation using requestAnimationFrame
    const animationDuration = 500; // 500ms for smooth rotation
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Ease out animation for smoother feel
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setRotationProgress(easedProgress);
      
      // Log animation progress every 100ms
      if (Math.floor(elapsed / 100) !== Math.floor((elapsed - 16) / 100)) {
        console.log(`🎯 ANIMATION PROGRESS: ${face} ${direction} - ${Math.round(progress * 100)}% (${elapsed.toFixed(0)}ms)`);
        logToTerminal(`🎯 ANIMATION PROGRESS`, { face, direction, progress: Math.round(progress * 100), elapsed: Math.round(elapsed) }, 'INFO');
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
            } else {
        // Animation complete - apply the actual position changes
        logRotationStep('5', face, direction, 'setCubeState called');
        setCubeState(prevState => {
          console.log(`🔄 Applying position changes for ${face} ${direction}`);
          console.log('Previous state colors:', prevState.map(p => `${p.pieceId}: ${JSON.stringify(p.colors)}`));
          
          // Log to terminal: rotation completion and state update
          logRotationStep('6', face, direction, 'ROTATION COMPLETED');
          logRotationStep('7', face, direction, 'BEFORE STATE UPDATE - Colors', prevState.map(p => `${p.pieceId}: ${JSON.stringify(p.colors)}`));
          
          const newState = [...prevState];
          const pieces = newState.map((piece, index) => ({ ...piece, pieceId: index }));
          
          // Log positions before rotation
          console.log('📍 Positions before rotation:', pieces.map(p => `${p.pieceId}: [${p.position.join(', ')}]`));
          logToTerminal(`📍 BEFORE ROTATION - Positions:`, pieces.map(p => `${p.pieceId}: [${p.position.join(', ')}]`), 'INFO');
          
          // Apply rotation using consolidated logic
          logRotationStep('8', face, direction, 'Calling applyRotation');
          applyRotation(pieces, face, direction);

          // Log positions after rotation
          console.log('📍 Positions after rotation:', pieces.map(p => `${p.pieceId}: [${p.position.join(', ')}]`));
          logRotationStep('9', face, direction, 'AFTER ROTATION - Positions', pieces.map(p => `${p.pieceId}: [${p.position.join(', ')}]`));

          // Update the newState with the modified pieces
          pieces.forEach((piece, index) => {
            newState[index] = {
              pieceId: piece.pieceId, // Keep the pieceId
              position: piece.position,
              colors: piece.colors,
              rotationHistory: piece.rotationHistory
            };
          });
          
          console.log('✅ Position changes applied to cube state');
          console.log('New state colors:', newState.map(p => `${p.pieceId}: ${JSON.stringify(p.colors)}`));
          
          // Log to terminal: final state after update
          logRotationStep('10', face, direction, 'AFTER STATE UPDATE - Colors', newState.map(p => `${p.pieceId}: ${JSON.stringify(p.colors)}`));
          
          return newState;
        });
        
        // Reset animation state
        setRotatingFace(null);
        setRotationProgress(0);
        setIsAnimating(false);
        if (onComplete) onComplete();
      }
    };
    
    requestAnimationFrame(animate);
  }, [isAnimating, applyRotation, setCubeState, setIsAnimating]);

  // Function to execute moves with realistic face rotation animations
  const executeMovesWithAnimation = useCallback((moves, onComplete) => {
    let currentMoveIndex = 0;
    
    const executeNextMove = () => {
      if (currentMoveIndex >= moves.length) {
        if (onComplete) onComplete();
        return;
      }
      
      const move = moves[currentMoveIndex];
      console.log(`🔄 Executing move ${currentMoveIndex + 1}/${moves.length}: ${move.face} ${move.direction}`);
      
      // Execute the move with realistic face rotation
      rotateFaceWithAnimation(move.face, move.direction, () => {
        currentMoveIndex++;
        // Small delay between moves for visual clarity
        setTimeout(executeNextMove, 25);
      });
    };
    
    executeNextMove();
  }, [rotateFaceWithAnimation]);

  // Generate optimal solve sequence using beginner's method
  const generateOptimalSolve = useCallback((currentState) => {
    // This is a simplified version - in reality, you'd use proper algorithms like CFOP
    // For now, we'll use the reverse of all moves, but optimize the sequence
    
    const allMoves = [];
    currentState.forEach(piece => {
      piece.rotationHistory.forEach(move => {
        allMoves.push({
          face: move.move,
          direction: move.direction,
          timestamp: move.timestamp
        });
      });
    });
    
    console.log(`🔍 DEBUG: Found ${allMoves.length} moves in rotation history`);
    
    // Sort moves by timestamp
    allMoves.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    console.log('🔍 DEBUG: Original moves:', allMoves.map(m => `${m.face} ${m.direction}`));
    
    // Reverse the moves and optimize
    const reversedMoves = allMoves.reverse().map(move => ({
      face: move.face,
      direction: move.direction === 'clockwise' ? 'counterclockwise' : 'clockwise'
    }));
    
    console.log('🔍 DEBUG: Reversed moves:', reversedMoves.map(m => `${m.face} ${m.direction}`));
    
    // Optimize the sequence by removing redundant moves
    const optimizedMoves = optimizeMoveSequence(reversedMoves);
    
    console.log(`🔍 DEBUG: Optimized moves: ${optimizedMoves.length}`, optimizedMoves.map(m => `${m.face} ${m.direction}`));
    
    return optimizedMoves;
  }, []);

  // Optimize move sequence by removing redundant moves
  const optimizeMoveSequence = useCallback((moves) => {
    // For now, don't optimize too aggressively to ensure we don't break the solve
    // Just return the original moves to ensure the cube gets solved
    return moves;
  }, []);

  // Rotate a face of the cube with smooth animation
  const rotateFace = useCallback((face, direction) => {
    console.log(`🔥🔥🔥 ROTATE FACE CALLED: ${face} ${direction} 🔥🔥🔥`);
    logRotationStep('1', face, direction, 'rotateFace called');
    logToTerminal('🚀 TEST LOG: rotateFace function called', { face, direction }, 'SUCCESS');
    logToTerminal('🎯 DEBUG: About to start rotation animation', { face, direction, isAnimating }, 'INFO');
    
    // Also log to browser console for easier visibility
    console.log('🚀🚀🚀 ROTATION STARTED - Browser Console Log 🚀🚀🚀');
    console.log('Face:', face, 'Direction:', direction);
    console.log('Current cube state colors:', cubeState.map(p => `${p.pieceId}: ${JSON.stringify(p.colors)}`));
    
    if (isAnimating) {
      logToTerminal(`⚠️ rotateFace: Already animating, skipping`, null, 'WARNING');
      return;
    }
    
    logRotationStep('2', face, direction, 'Starting rotation');
    setHasRotated(true); // Mark that rotations have occurred
    setIsAnimating(true);
    
    // Use the smooth animation function
    rotateFaceWithAnimation(face, direction, () => {
      logToTerminal(`✅ rotateFace: Animation completed`, null, 'SUCCESS');
      
      // Log final colors to browser console
      console.log('🎯🎯🎯 ROTATION COMPLETED - Browser Console Log 🎯🎯🎯');
      console.log('Final cube state colors:', cubeState.map(p => `${p.pieceId}: ${JSON.stringify(p.colors)}`));
      
      setIsAnimating(false);
    });
  }, [isAnimating, rotateFaceWithAnimation, cubeState]);

  // Scramble the cube with realistic face rotations
  const scramble = useCallback(() => {
    if (isAnimating) return;
    
    setHasRotated(true); // Mark that rotations have occurred
    setIsAnimating(true);
    
    // DON'T clear move history - keep all previous moves (manual + scramble)
    console.log(`🎲 SCRAMBLING CUBE - Current move history: ${moveHistory.length} moves`);
    
    const moves = ['F', 'B', 'R', 'L', 'U', 'D'];
    const directions = ['clockwise', 'counterclockwise'];
    const scrambleSequence = [];
    
    // Generate 20 random moves
    for (let i = 0; i < 20; i++) {
      const move = moves[Math.floor(Math.random() * moves.length)];
      const direction = directions[Math.floor(Math.random() * directions.length)];
      scrambleSequence.push({ face: move, direction });
    }
    
    console.log('🎲 SCRAMBLING CUBE with sequence:', scrambleSequence.map(m => `${m.face} ${m.direction}`));
    
    // Execute scramble moves with realistic animations
    executeMovesWithAnimation(scrambleSequence, () => {
      setIsAnimating(false);
      console.log('✅ CUBE SCRAMBLED!');
      
      // Log final state
      setCubeState(currentState => {
        console.log('🎯 CUBE STATE AFTER SCRAMBLE:');
        console.log(JSON.stringify(currentState, null, 2));
        logToTerminal('CUBE STATE AFTER SCRAMBLE', currentState);
        return currentState;
      });
    });
  }, [isAnimating, executeMovesWithAnimation, moveHistory, setCubeState]);

  // Reset the cube to solved state
  const reset = useCallback(() => {
    // Clear move history when resetting
    setMoveHistory([]);
    setHasRotated(false); // Reset the rotation flag since we're going back to original state
    
    setCubeState(() => {
      const state = [];
      
      // Create 26 pieces (3x3x3 minus center)
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            // Skip the center piece
            if (x === 0 && y === 0 && z === 0) continue;
            
            // Get pieceId based on position in solved state
            const pieceId = state.length;
            
            // Get original colors for this piece
            const colors = getOriginalColors(pieceId);
            
            // Debug logging for initial state
            console.log(`Initial piece ${pieceId} at [${x}, ${y}, ${z}]:`, colors);
            console.log(`getOriginalColors returned:`, JSON.stringify(colors));
            
            // Get starting position colors for this piece
            const startingPositionColors = getStartingPositionColors(pieceId);
            
            // Use the original colors directly - they already represent the starting colors
            state.push({ 
              position: [x, y, z], 
              colors: colors, // Use the original colors (starting colors)
              startingColors: startingPositionColors, // Store the starting position colors for reference
              rotationHistory: [], // Track all rotations this piece has undergone
              pieceId: pieceId // Store the pieceId for reference
            });
          }
        }
      }
      
      // Log the complete initial cube state as JSON
      console.log('🎯 INITIAL CUBE STATE (End of Initial Load):');
      console.log(JSON.stringify(state, null, 2));
      
      // Also log to terminal (this will show in the terminal where npm start is running)
      logToTerminal('INITIAL CUBE STATE (End of Initial Load)', state);
      
      return state;
    });
  }, [setCubeState]);

  // Simple solve function that reverses all recorded moves
  const solve = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    console.log(`🎯 SOLVING CUBE: Reversing ${moveHistory.length} moves`);
    console.log('📋 Move history:', moveHistory.map(m => `${m.face} ${m.direction}`));
    console.log('📋 Full move history object:', moveHistory);
    
    if (moveHistory.length === 0) {
      console.log('⚠️ No moves to reverse - cube might already be solved or no moves were recorded');
      setIsAnimating(false);
      return;
    }
    
    // Create reverse sequence (last move first, opposite direction)
    const solveSequence = moveHistory
      .slice()
      .reverse()
      .map(move => ({
        face: move.face,
        direction: move.direction === 'clockwise' ? 'counterclockwise' : 'clockwise'
      }));
    
    console.log('🔄 Reversed sequence:', solveSequence.map(m => `${m.face} ${m.direction}`));
    console.log(`🚀 Starting solve with ${solveSequence.length} moves...`);
    
    // Execute moves with realistic face rotations
    executeMovesWithAnimation(solveSequence, () => {
      // Clear move history after solving
      setMoveHistory([]);
      setIsAnimating(false);
      console.log('✅ CUBE SOLVED!');
    });
    
  }, [isAnimating, moveHistory, executeMovesWithAnimation]);


  return children({
    cubeState,
    isAnimating,
    rotatingFace,
    rotationProgress,
    rotateFace,
    rotateFaceWithAnimation,
    scramble,
    reset,
    solve
  });
}

// Main cube group component with enhanced structure
function CubeGroup({ cubeState, isAnimating, rotatingFace, rotationProgress, rotateFace, rotateFaceWithAnimation, scramble, reset, solve, isRotating, autoRotate = false, onScramble, onReset, onSolve, onRotateFace, onCubeStateChange, highlightedPieces = [] }) {
  const groupRef = useRef();
  const [rotationSpeed] = useState({ x: 0.005, y: 0.01 });
  
  
  // Set up refs for parent component
  React.useEffect(() => {
    console.log('🎯 CubeGroup: Setting up refs');
    if (onRotateFace) {
      console.log('🎯 CubeGroup: Setting rotateFace ref');
      onRotateFace(rotateFaceWithAnimation);
    }
    if (onScramble) {
      console.log('🎯 CubeGroup: Setting scramble ref');
      onScramble(scramble);
    }
    if (onReset) {
      console.log('🎯 CubeGroup: Setting reset ref');
      onReset(reset);
    }
    if (onSolve) {
      console.log('🎯 CubeGroup: Setting solve ref');
      onSolve(solve);
    }
  }, [rotateFace, scramble, reset, solve, onRotateFace, onScramble, onReset, onSolve]);

  // Auto-trigger rotation removed
  
  // Removed excessive re-render logging
  
  // Helper functions for enhanced debugging
  const getShapeType = (pieceId) => {
    const shapeTypes = ['Square', 'Square', 'Square', 'Square', 'Square', 'Circle', 'Circle', 'Circle', 'Circle', 'Circle', 'Triangle', 'Triangle', 'Triangle', 'Triangle', 'Diamond', 'Diamond', 'Diamond', 'Diamond', 'Diamond', 'Diamond', 'Triangle', 'Triangle', 'Triangle', 'Triangle', 'Triangle', 'Triangle'];
    return shapeTypes[pieceId] || 'Unknown';
  };

  const getShapeColor = (pieceId) => {
    const shapeColors = ['Red', 'Red', 'Red', 'Red', 'Red', 'Blue', 'Blue', 'Blue', 'Blue', 'Blue', 'Green', 'Green', 'Green', 'Green', 'Yellow', 'Yellow', 'Yellow', 'Yellow', 'Yellow', 'Yellow', 'Orange', 'Orange', 'Orange', 'Orange', 'Orange', 'Orange'];
    return shapeColors[pieceId] || 'Unknown';
  };

  // Auto-rotation effect
  useEffect(() => {
    let animationId;
    
    if (autoRotate && groupRef.current) {
      const animate = () => {
        if (groupRef.current) {
          groupRef.current.rotation.x += rotationSpeed.x;
          groupRef.current.rotation.y += rotationSpeed.y;
          animationId = requestAnimationFrame(animate);
        }
      };
      animate();
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [autoRotate, rotationSpeed]);

  // Manual rotation effect
  useEffect(() => {
    if (isRotating && groupRef.current) {
      groupRef.current.rotation.x += 0.01;
      groupRef.current.rotation.y += 0.01;
    }
  }, [isRotating]);

  // Helper function to determine if a piece is part of the rotating face
  const isPartOfRotatingFace = useCallback((piece, rotatingFace) => {
    if (!rotatingFace) return false;
    
    const [x, y, z] = piece.position;
    const { face } = rotatingFace;
    
    switch (face) {
      case 'R': return x === 1;
      case 'L': return x === -1;
      case 'U': return y === 1;
      case 'D': return y === -1;
      case 'F': return z === 1;
      case 'B': return z === -1;
      default: return false;
    }
  }, []);

  // Helper function to get rotation angle for a piece
  const getRotationAngle = useCallback((piece, rotatingFace, rotationProgress) => {
    if (!rotatingFace || !isPartOfRotatingFace(piece, rotatingFace)) {
      return { x: 0, y: 0, z: 0 };
    }

    const { face, direction } = rotatingFace;
    const sign = direction === 'clockwise' ? 1 : -1;
    const angle = (Math.PI / 2) * rotationProgress * sign; // 90 degrees total

    // Log rotation angle calculation
    console.log(`🎯 getRotationAngle: ${face} ${direction} - progress: ${rotationProgress.toFixed(3)}, angle: ${angle.toFixed(3)}`);
    logToTerminal(`🎯 getRotationAngle`, { face, direction, progress: rotationProgress.toFixed(3), angle: angle.toFixed(3) }, 'INFO');

    switch (face) {
      case 'F': return { x: 0, y: 0, z: angle };
      case 'B': return { x: 0, y: 0, z: -angle };
      case 'R': return { x: angle, y: 0, z: 0 };
      case 'L': return { x: -angle, y: 0, z: 0 };
      case 'U': return { x: 0, y: angle, z: 0 };
      case 'D': return { x: 0, y: -angle, z: 0 };
      default: return { x: 0, y: 0, z: 0 };
    }
  }, [isPartOfRotatingFace]);



  // Group rotation: Create separate groups for rotating and non-rotating pieces
  const rotatingPieces = [];
  const nonRotatingPieces = [];
  
  cubeState.forEach((piece, index) => {
    const pieceId = piece.pieceId || index;
    
    // Find the highlighted piece data to get blackVisibleFaces
    const highlightedPieceData = highlightedPieces.find(p => p.pieceId === pieceId);
    const isHighlighted = !!highlightedPieceData;
    
    const highlightInfo = isHighlighted ? {
      shapeType: getShapeType(pieceId),
      shapeColor: getShapeColor(pieceId),
      pieceId: pieceId,
      blackVisibleFaces: highlightedPieceData ? highlightedPieceData.blackVisibleFaces : []
    } : null;

    const cubePiece = (
      <CubePiece
        key={`piece-${pieceId}`}
        position={piece.position}
        colors={piece.colors}
        pieceId={pieceId}
        isHighlighted={isHighlighted}
        highlightInfo={highlightInfo}
        rotatingFace={rotatingFace}
        rotationProgress={rotationProgress}
      />
    );

    // Check if this piece is part of the rotating face
    if (rotatingFace && isPartOfRotatingFace(piece, rotatingFace)) {
      rotatingPieces.push(cubePiece);
    } else {
      nonRotatingPieces.push(cubePiece);
    }
  });

  // Get rotation angle for the rotating group
  // Find a piece that's part of the rotating face to calculate the rotation angle
  const rotatingPiece = cubeState.find(piece => rotatingFace && isPartOfRotatingFace(piece, rotatingFace));
  const groupRotationAngle = rotatingPiece ? getRotationAngle(rotatingPiece, rotatingFace, rotationProgress) : { x: 0, y: 0, z: 0 };
  
  // Debug rotation state
  if (rotatingFace && rotationProgress > 0) {
    console.log(`🎯 ROTATION DEBUG: Face=${rotatingFace.face}, Progress=${rotationProgress.toFixed(3)}, Angle=`, groupRotationAngle);
    console.log(`🎯 Rotating pieces count: ${rotatingPieces.length}`);
  }

  return (
    <group ref={groupRef}>
      {/* Non-rotating pieces */}
      {nonRotatingPieces}
      
      {/* Rotating pieces group - apply rotation to the entire group */}
      {rotatingPieces.length > 0 && (
        <group rotation={[groupRotationAngle.x, groupRotationAngle.y, groupRotationAngle.z]}>
          {rotatingPieces}
        </group>
      )}
    </group>
  );
}

// Main Rubik's Cube component
function RubiksCube({ isRotating, autoRotate = false, onScramble, onReset, onSolve, onRotateFace, onCubeStateChange, highlightedPieces = [] }) {
  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 50 }}
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      <CubeStateProvider onCubeStateChange={onCubeStateChange}>
        {({ cubeState, isAnimating, rotatingFace, rotationProgress, rotateFace, rotateFaceWithAnimation, scramble, reset, solve }) => (
          <CubeGroup
            cubeState={cubeState}
            isAnimating={isAnimating}
            rotatingFace={rotatingFace}
            rotationProgress={rotationProgress}
            rotateFace={rotateFace}
            rotateFaceWithAnimation={rotateFaceWithAnimation}
            scramble={scramble}
            reset={reset}
            solve={solve}
            isRotating={isRotating}
            autoRotate={autoRotate}
            onScramble={onScramble}
            onReset={onReset}
            onSolve={onSolve}
            onRotateFace={onRotateFace}
            onCubeStateChange={onCubeStateChange}
            highlightedPieces={highlightedPieces}
          />
        )}
      </CubeStateProvider>
    </Canvas>
  );
}

export default RubiksCube;
