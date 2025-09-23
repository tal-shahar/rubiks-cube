import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CubePiece } from './CubePiece';
import { logToTerminal } from '../utils/logger';
import { getOriginalPosition } from '../utils/colors';

// Main cube group component with enhanced structure
export function CubeGroup({ 
  cubeState, 
  isAnimating, 
  rotatingFace, 
  rotationProgress, 
  rotateFace, 
  rotateFaceWithAnimation, 
  scramble, 
  reset, 
  solve, 
  isRotating, 
  autoRotate = false, 
  onScramble, 
  onReset, 
  onSolve, 
  onRotateFace, 
  onCubeStateChange, 
  highlightedPieces = [] 
}) {
  // Debug: Log when CubeGroup receives new state
  // console.log('🎨 CubeGroup received state with', cubeState?.length || 0, 'pieces');
  if (cubeState && cubeState.length > 0) {
    // console.log('🎨 First piece position:', cubeState[0].position);
    // console.log('🎨 All piece positions:', cubeState.map(p => `${p.pieceId}: [${p.position.join(', ')}]`));
    
      // Check if this looks like solved state
      const isSolved = cubeState.every((piece, index) => {
        const originalPosition = getOriginalPosition(piece.pieceId);
        return piece.position[0] === originalPosition[0] && 
               piece.position[1] === originalPosition[1] && 
               piece.position[2] === originalPosition[2];
      });
    
    // console.log(`🔍 CubeGroup: isSolved = ${isSolved}, cubeState.length = ${cubeState.length}`);
    // console.log(`🔍 First 3 pieces positions:`, cubeState.slice(0, 3).map(p => `${p.pieceId}: [${p.position.join(', ')}]`));
    
      if (isSolved) {
        // console.log('🚨 CubeGroup received SOLVED state - this is the problem!');
      } else {
        // console.log('✅ CubeGroup received SCRAMBLED state - this is correct');
      //   
      //   // Count how many pieces are actually scrambled
      //   const scrambledCount = cubeState.filter((piece, index) => {
      //     const originalPosition = getOriginalPosition(piece.pieceId);
      //     return piece.position[0] !== originalPosition[0] || 
      //            piece.position[1] !== originalPosition[1] || 
      //            piece.position[2] !== originalPosition[2];
      //   }).length;
      //   
      //   // console.log(`📊 ${scrambledCount} out of ${cubeState.length} pieces are scrambled`);
      //   
      //   if (scrambledCount === 0) {
      //     console.log('🚨 PROBLEM: No pieces are actually scrambled despite receiving "scrambled" state!');
      //   } else if (scrambledCount === cubeState.length) {
      //     console.log('🚨 PROBLEM: All pieces are scrambled - this might look like solved state!');
      //   } else {
      //     console.log('✅ GOOD: Some pieces are scrambled, some are in original positions');
      //   }
      }
  }
  const groupRef = useRef();
  const [rotationSpeed] = useState({ x: 0.005, y: 0.01 });
  
  // Set up refs for parent component
  React.useEffect(() => {
    if (onRotateFace) {
      onRotateFace(rotateFaceWithAnimation);
    }
    if (onScramble) {
      onScramble(scramble);
    }
    if (onReset) {
      onReset(reset);
    }
    if (onSolve) {
      onSolve(solve);
    }
  }, [rotateFace, scramble, reset, solve, onRotateFace, onScramble, onReset, onSolve]);

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
    
    if (autoRotate && groupRef.current && groupRef.current.rotation) {
      const animate = () => {
        if (groupRef.current && groupRef.current.rotation) {
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
    if (isRotating && groupRef.current && groupRef.current.rotation) {
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
    // console.log(`🎯 getRotationAngle: ${face} ${direction} - progress: ${rotationProgress.toFixed(3)}, angle: ${angle.toFixed(3)}`);
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
  
  // Handle null/undefined cubeState
  if (!cubeState || !Array.isArray(cubeState)) {
    return (
      <group ref={groupRef}>
        {/* Empty group for null/undefined cubeState */}
      </group>
    );
  }
  
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

    // Debug: Log what position we're passing to CubePiece - DISABLED
    // if (pieceId === 0 || pieceId === 17 || pieceId === 25) {
    //   console.log(`🎯 CubeGroup passing to Piece ${pieceId}: position [${piece.position.join(', ')}]`);
    //   console.log(`🎯 Piece ${pieceId} colors being passed:`, piece.colors);
    // }

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
    // console.log(`🎯 ROTATION DEBUG: Face=${rotatingFace.face}, Progress=${rotationProgress.toFixed(3)}, Angle=`, groupRotationAngle);
    // console.log(`🎯 Rotating pieces count: ${rotatingPieces.length}`);
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
      
      {/* Debug: Show all pieces at their final positions when not animating */}
      {!rotatingFace && cubeState.map((piece, index) => (
        <group key={`debug-${piece.pieceId}`} position={piece.position}>
          <mesh>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color="red" transparent opacity={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
