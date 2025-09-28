import React, { useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';

// Individual cube piece component with smooth rotation
export function CubePiece({ position, colors, size = 0.95, pieceId = 0, rotatingFace = null, rotationProgress = 0, onFaceClick = null }) {
  const meshRef = useRef();
  const groupRef = useRef();
  
  // Debug logging that runs on every render - DISABLED
  // if (pieceId === 17 || pieceId === 25) {
  //   console.log(`🔍 RENDER: Piece ${pieceId} at position [${position.join(', ')}]`);
  //   
  //   // Check if this piece is in its original solved position
  //   const originalPosition = [-1, -1, -1]; // Default for piece 0
  //   const isInOriginalPosition = position[0] === originalPosition[0] && 
  //                                position[1] === originalPosition[1] && 
  //                                position[2] === originalPosition[2];
  //   
  //   if (isInOriginalPosition) {
  //     console.log(`🔍 RENDER: Piece ${pieceId} is in ORIGINAL SOLVED position`);
  //   } else {
  //     console.log(`🔍 RENDER: Piece ${pieceId} is in SCRAMBLED position`);
  //   }
  // }
  

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

  // Get the color for a face based on the face index - use rotated colors
  const getFaceColor = (faceIndex) => {
    // Use the piece's stored colors (which are now rotated after face rotations)
    let faceColor;
    switch (faceIndex) {
      case 0: faceColor = colors.front; break;
      case 1: faceColor = colors.back; break;
      case 2: faceColor = colors.right; break;
      case 3: faceColor = colors.left; break;
      case 4: faceColor = colors.top; break;
      case 5: faceColor = colors.bottom; break;
      default: faceColor = '#444444'; break; // Use dark gray instead of black
    }
    
    // Debug: Log colors for piece 17 - DISABLED
    // if (pieceId === 17 && faceIndex === 0) {
    //   console.log(`🎨 Piece 17 front face color:`, faceColor, 'from colors:', colors);
    //   console.log(`🎨 Piece 17 position: [${position.join(', ')}]`);
    //   console.log(`🎨 Piece 17 visible faces:`, {
    //     front: position[2] === 1,
    //     back: position[2] === -1,
    //     right: position[0] === 1,
    //     left: position[0] === -1,
    //     top: position[1] === 1,
    //     bottom: position[1] === -1
    //   });
    // }
    
    return faceColor;
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

  // Map face index to face name
  const getFaceName = useCallback((faceIndex) => {
    const faceNames = ['F', 'B', 'R', 'L', 'U', 'D'];
    return faceNames[faceIndex];
  }, []);

  // Handle face click
  const handleFaceClick = useCallback((faceIndex, event) => {
    if (onFaceClick) {
      const faceName = getFaceName(faceIndex);
      console.log(`🎯 Face clicked: ${faceName} on piece ${pieceId}`);
      onFaceClick(faceName, event);
    }
  }, [onFaceClick, getFaceName, pieceId]);
  
  // Debug: Log when position changes for key pieces - DISABLED
  // if (pieceId === 25 || pieceId === 17 || pieceId === 0) {
  //   console.log(`🎯 RENDER: Piece ${pieceId} rendering at position [${finalPosition.join(', ')}]`);
  //   console.log(`🎯 Piece ${pieceId} colors:`, colors);
  // }

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
        
        // Debug: Log which faces are being rendered for piece 17 - DISABLED
        // if (pieceId === 17) {
        //   const faceNames = ['front', 'back', 'right', 'left', 'top', 'bottom'];
        //   console.log(`🎨 Piece 17 rendering ${faceNames[faceIndex]} face with color:`, faceColor);
        // }
        
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
        
        // Use the face color directly
        const displayColor = colorMap[faceColor] || faceColor || '#444444';
        
        return (
          <mesh
            key={faceIndex}
            position={facePosition}
            rotation={faceRotation}
            geometry={faceGeometry}
            onPointerDown={(event) => handleFaceClick(faceIndex, event)}
            onPointerMove={(event) => {
              // Pass through to parent for drag handling
              if (onFaceClick) {
                onFaceClick('MOVE', event);
              }
            }}
            onPointerUp={(event) => {
              // Pass through to parent for drag completion
              if (onFaceClick) {
                onFaceClick('UP', event);
              }
            }}
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
    </group>
  );
}
