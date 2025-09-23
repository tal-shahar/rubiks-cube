import React from 'react';

// Color mapping for cube faces
export const colorMap = {
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

// Helper functions to create individual shape types
function createSquareShape(size, faceColor, borderColor) {
  return () => (
    <group position={[0, 0, 0.012]}>
      <mesh><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>
  );
}

function createCircleShape(size, faceColor, borderColor) {
  return () => (
    <group position={[0, 0, 0.012]}>
      <mesh><circleGeometry args={[size/2, 32]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]}><circleGeometry args={[size*0.45, 32]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]}><circleGeometry args={[size*0.4, 32]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>
  );
}

function createTriangleShape(size, faceColor, borderColor) {
  return () => (
    <group position={[0, 0, 0.012]}>
      <mesh rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size/2, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.45, 0.01, 3]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[size*0.4, 0.01, 3]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>
  );
}

function createDiamondShape(size, faceColor, borderColor) {
  return () => (
    <group position={[0, 0, 0.012]}>
      <mesh rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size, size]} /><meshBasicMaterial color={faceColor} /></mesh>
      <mesh position={[0, 0, 0.001]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.95, size*0.95]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[0, 0, Math.PI/4]}><planeGeometry args={[size*0.9, size*0.9]} /><meshBasicMaterial color={faceColor} /></mesh>
    </group>
  );
}

// Function to create unique shapes for each piece with different border colors per face
export function createShapeWithFaceBorder(pieceId, size, faceIndex, pieceColors) {
  // Get the actual color for this face from the piece
  const faceNames = ['front', 'back', 'right', 'left', 'top', 'bottom'];
  const faceName = faceNames[faceIndex];
  const faceColor = pieceColors ? pieceColors[faceName] : '#444444';
  const borderColor = colorMap[faceColor] || '#444444';

  const shapes = [];
  
  // Generate shapes using loops instead of hardcoded repetition
  // 0-4: Squares (5 shapes)
  for (let i = 0; i < 5; i++) {
    shapes.push(createSquareShape(size, faceColor, borderColor));
  }
  
  // 5-9: Circles (5 shapes)
  for (let i = 0; i < 5; i++) {
    shapes.push(createCircleShape(size, faceColor, borderColor));
  }
  
  // 10-13: Triangles (4 shapes)
  for (let i = 0; i < 4; i++) {
    shapes.push(createTriangleShape(size, faceColor, borderColor));
  }
  
  // 14: Diamond (1 shape)
  shapes.push(createDiamondShape(size, faceColor, borderColor));
  
  // 15-19: Diamonds (5 shapes)
  for (let i = 0; i < 5; i++) {
    shapes.push(createDiamondShape(size, faceColor, borderColor));
  }
  
  // 20-25: Triangles (6 shapes)
  for (let i = 0; i < 6; i++) {
    shapes.push(createTriangleShape(size, faceColor, borderColor));
  }
  
  // Handle edge cases by clamping pieceId to valid range
  const shapeIndex = Math.max(0, Math.min(pieceId, shapes.length - 1));
  const shapeFunction = shapes[shapeIndex];
  return shapeFunction();
}

// Function to create unique shapes for each piece (legacy version)
export function createShape(pieceId, size) {
  const faceColor = '#444444'; // Default color for legacy function
  const borderColor = '#444444'; // Default border color for legacy function
  
  const shapes = [];
  
  // Generate shapes using loops instead of hardcoded repetition
  // 0-4: Squares (5 shapes)
  for (let i = 0; i < 5; i++) {
    shapes.push(createSquareShape(size, faceColor, borderColor));
  }
  
  // 5-9: Circles (5 shapes)
  for (let i = 0; i < 5; i++) {
    shapes.push(createCircleShape(size, faceColor, borderColor));
  }
  
  // 10-13: Triangles (4 shapes)
  for (let i = 0; i < 4; i++) {
    shapes.push(createTriangleShape(size, faceColor, borderColor));
  }
  
  // 14: Diamond (1 shape)
  shapes.push(createDiamondShape(size, faceColor, borderColor));
  
  // 15-19: Diamonds (5 shapes)
  for (let i = 0; i < 5; i++) {
    shapes.push(createDiamondShape(size, faceColor, borderColor));
  }
  
  // 20-25: Triangles (6 shapes)
  for (let i = 0; i < 6; i++) {
    shapes.push(createTriangleShape(size, faceColor, borderColor));
  }
  
  // Handle edge cases by clamping pieceId to valid range
  const shapeIndex = Math.max(0, Math.min(pieceId, shapes.length - 1));
  const shapeFunction = shapes[shapeIndex];
  return shapeFunction();
}
