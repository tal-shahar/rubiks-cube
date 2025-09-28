import { useCallback, useState } from 'react';
import { logRotationStep, logToTerminal } from '../utils/logger';
import { getOriginalColors } from '../utils/colors';

// Access CubeStateManager from window object (set by CubeStateProvider)
const CubeStateManager = window.CubeStateManager;

// Helper function to apply 3D position transformation
function applyPositionTransformation(position, face, direction) {
  const [x, y, z] = position;
  let newX = x, newY = y, newZ = z;
  
  // Apply 3D transformation based on face
  switch (face) {
    case 'F': // Front face rotation (Z+ plane)
      if (direction === 'clockwise') {
        newX = -y;
        newY = x;
      } else if (direction === 'counterclockwise') {
        newX = y;
        newY = -x;
      }
      break;
    case 'B': // Back face rotation (Z- plane)
      if (direction === 'clockwise') {
        newX = y;
        newY = -x;
      } else if (direction === 'counterclockwise') {
        newX = -y;
        newY = x;
      }
      break;
    case 'R': // Right face rotation (X+ plane)
      if (direction === 'clockwise') {
        newY = -z;
        newZ = y;
      } else if (direction === 'counterclockwise') {
        newY = z;
        newZ = -y;
      }
      break;
    case 'L': // Left face rotation (X- plane)
      if (direction === 'clockwise') {
        newY = z;
        newZ = -y;
      } else if (direction === 'counterclockwise') {
        newY = -z;
        newZ = y;
      }
      break;
    case 'U': // Up face rotation (Y+ plane)
      if (direction === 'clockwise') {
        newX = z;
        newZ = -x;
      } else if (direction === 'counterclockwise') {
        newX = -z;
        newZ = x;
      }
      break;
    case 'D': // Down face rotation (Y- plane)
      if (direction === 'clockwise') {
        newX = -z;
        newZ = x;
      } else if (direction === 'counterclockwise') {
        newX = z;
        newZ = -x;
      }
      break;
    // Middle piece rotations
    case 'M': // Middle layer rotation (between L and R faces, X=0 plane)
      if (direction === 'clockwise') {
        newY = -z;
        newZ = y;
      } else if (direction === 'counterclockwise') {
        newY = z;
        newZ = -y;
      }
      break;
    case 'E': // Equatorial layer rotation (between U and D faces, Y=0 plane)
      if (direction === 'clockwise') {
        newX = z;
        newZ = -x;
      } else if (direction === 'counterclockwise') {
        newX = -z;
        newZ = x;
      }
      break;
    case 'S': // Standing layer rotation (between F and B faces, Z=0 plane)
      if (direction === 'clockwise') {
        newX = y;
        newY = -x;
      } else if (direction === 'counterclockwise') {
        newX = -y;
        newY = x;
      }
      break;
  }
  
  return [newX, newY, newZ];
}

// Helper function to apply color rotation
function applyColorRotation(colors, face, direction) {
  const rotatedColors = { ...colors };
  
  // Debug logging for piece 17 - DISABLED
  // if (face === 'R' || face === 'F') {
  //   console.log(`🔄 applyColorRotation: ${face} ${direction}`);
  //   console.log(`🔄 Input colors:`, colors);
  // }
  
  switch (face) {
    case 'F': // Front face rotation (Z+ plane)
      if (direction === 'clockwise') {
        // Colors rotate clockwise: top->left, left->bottom, bottom->right, right->top
        const temp = rotatedColors.top;
        rotatedColors.top = rotatedColors.right;
        rotatedColors.right = rotatedColors.bottom;
        rotatedColors.bottom = rotatedColors.left;
        rotatedColors.left = temp;
      } else if (direction === 'counterclockwise') {
        // Colors rotate counterclockwise: top->right, right->bottom, bottom->left, left->top
        const temp = rotatedColors.top;
        rotatedColors.top = rotatedColors.left;
        rotatedColors.left = rotatedColors.bottom;
        rotatedColors.bottom = rotatedColors.right;
        rotatedColors.right = temp;
      }
      break;
    case 'B': // Back face rotation (Z- plane)
      if (direction === 'clockwise') {
        // Colors rotate clockwise: top->left, left->bottom, bottom->right, right->top
        // (opposite to front face because back face is viewed from behind)
        const temp = rotatedColors.top;
        rotatedColors.top = rotatedColors.left;
        rotatedColors.left = rotatedColors.bottom;
        rotatedColors.bottom = rotatedColors.right;
        rotatedColors.right = temp;
      } else if (direction === 'counterclockwise') {
        // Colors rotate counterclockwise: top->right, right->bottom, bottom->left, left->top
        // (opposite to front face because back face is viewed from behind)
        const temp = rotatedColors.top;
        rotatedColors.top = rotatedColors.right;
        rotatedColors.right = rotatedColors.bottom;
        rotatedColors.bottom = rotatedColors.left;
        rotatedColors.left = temp;
      }
      break;
    case 'R': // Right face rotation (X+ plane)
      if (direction === 'clockwise') {
        // Colors rotate clockwise: top->back, back->bottom, bottom->front, front->top
        const temp = rotatedColors.top;
        rotatedColors.top = rotatedColors.back;
        rotatedColors.back = rotatedColors.bottom;
        rotatedColors.bottom = rotatedColors.front;
        rotatedColors.front = temp;
      } else if (direction === 'counterclockwise') {
        // Colors rotate counterclockwise: top->front, front->bottom, bottom->back, back->top
        const temp = rotatedColors.top;
        rotatedColors.top = rotatedColors.front;
        rotatedColors.front = rotatedColors.bottom;
        rotatedColors.bottom = rotatedColors.back;
        rotatedColors.back = temp;
      }
      break;
    case 'L': // Left face rotation (X- plane)
      if (direction === 'clockwise') {
        // Colors rotate clockwise: top->front, front->bottom, bottom->back, back->top
        const temp = rotatedColors.top;
        rotatedColors.top = rotatedColors.front;
        rotatedColors.front = rotatedColors.bottom;
        rotatedColors.bottom = rotatedColors.back;
        rotatedColors.back = temp;
      } else if (direction === 'counterclockwise') {
        // Colors rotate counterclockwise: top->back, back->bottom, bottom->front, front->top
        const temp = rotatedColors.top;
        rotatedColors.top = rotatedColors.back;
        rotatedColors.back = rotatedColors.bottom;
        rotatedColors.bottom = rotatedColors.front;
        rotatedColors.front = temp;
      }
      break;
    case 'U': // Up face rotation (Y+ plane)
      if (direction === 'clockwise') {
        // Colors rotate clockwise: front->right, right->back, back->left, left->front
        const temp = rotatedColors.front;
        rotatedColors.front = rotatedColors.left;
        rotatedColors.left = rotatedColors.back;
        rotatedColors.back = rotatedColors.right;
        rotatedColors.right = temp;
      } else if (direction === 'counterclockwise') {
        // Colors rotate counterclockwise: front->left, left->back, back->right, right->front
        const temp = rotatedColors.front;
        rotatedColors.front = rotatedColors.right;
        rotatedColors.right = rotatedColors.back;
        rotatedColors.back = rotatedColors.left;
        rotatedColors.left = temp;
      }
      break;
    case 'D': // Down face rotation (Y- plane)
      if (direction === 'clockwise') {
        // Colors rotate clockwise: front->left, left->back, back->right, right->front
        const temp = rotatedColors.front;
        rotatedColors.front = rotatedColors.right;
        rotatedColors.right = rotatedColors.back;
        rotatedColors.back = rotatedColors.left;
        rotatedColors.left = temp;
      } else if (direction === 'counterclockwise') {
        // Colors rotate counterclockwise: front->right, right->back, back->left, left->front
        const temp = rotatedColors.front;
        rotatedColors.front = rotatedColors.left;
        rotatedColors.left = rotatedColors.back;
        rotatedColors.back = rotatedColors.right;
        rotatedColors.right = temp;
      }
      break;
    // Middle piece rotations - these affect the same colors as their corresponding face rotations
    case 'M': // Middle layer rotation (between L and R faces, X=0 plane)
      if (direction === 'clockwise') {
        // Colors rotate clockwise: top->back, back->bottom, bottom->front, front->top
        const temp = rotatedColors.top;
        rotatedColors.top = rotatedColors.back;
        rotatedColors.back = rotatedColors.bottom;
        rotatedColors.bottom = rotatedColors.front;
        rotatedColors.front = temp;
      } else if (direction === 'counterclockwise') {
        // Colors rotate counterclockwise: top->front, front->bottom, bottom->back, back->top
        const temp = rotatedColors.top;
        rotatedColors.top = rotatedColors.front;
        rotatedColors.front = rotatedColors.bottom;
        rotatedColors.bottom = rotatedColors.back;
        rotatedColors.back = temp;
      }
      break;
    case 'E': // Equatorial layer rotation (between U and D faces, Y=0 plane)
      if (direction === 'clockwise') {
        // Colors rotate clockwise: front->right, right->back, back->left, left->front
        const temp = rotatedColors.front;
        rotatedColors.front = rotatedColors.left;
        rotatedColors.left = rotatedColors.back;
        rotatedColors.back = rotatedColors.right;
        rotatedColors.right = temp;
      } else if (direction === 'counterclockwise') {
        // Colors rotate counterclockwise: front->left, left->back, back->right, right->front
        const temp = rotatedColors.front;
        rotatedColors.front = rotatedColors.right;
        rotatedColors.right = rotatedColors.back;
        rotatedColors.back = rotatedColors.left;
        rotatedColors.left = temp;
      }
      break;
    case 'S': // Standing layer rotation (between F and B faces, Z=0 plane)
      if (direction === 'clockwise') {
        // Colors rotate clockwise: top->right, right->bottom, bottom->left, left->top (same as F)
        const temp = rotatedColors.top;
        rotatedColors.top = rotatedColors.right;
        rotatedColors.right = rotatedColors.bottom;
        rotatedColors.bottom = rotatedColors.left;
        rotatedColors.left = temp;
      } else if (direction === 'counterclockwise') {
        // Colors rotate counterclockwise: top->left, left->bottom, bottom->right, right->top (same as F)
        const temp = rotatedColors.top;
        rotatedColors.top = rotatedColors.left;
        rotatedColors.left = rotatedColors.bottom;
        rotatedColors.bottom = rotatedColors.right;
        rotatedColors.right = temp;
      }
      break;
  }
  
  // Debug logging for piece 17 - DISABLED
  // if (face === 'R' || face === 'F') {
  //   console.log(`🔄 Output colors:`, rotatedColors);
  // }
  
  return rotatedColors;
}

// Consolidated rotation logic
export const applyRotation = (pieces, face, direction) => {
  // console.log(`🔄 Applying ${face} ${direction} rotation`);
  
  // Debug: Log the incoming pieces to see if they have rotation history (only for R rotation)
  if (face === 'R') {
    console.log('🔍 R rotation - applyRotation called with', pieces.length, 'pieces');
    const piece25 = pieces.find(p => p.pieceId === 25);
    if (piece25) {
      console.log('🔍 Piece 25 incoming rotationHistory:', piece25.rotationHistory);
      console.log('🔍 Piece 25 incoming colors:', piece25.colors);
    }
  }
  
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
      case 'M': return x === 0; // Middle layer (between L and R faces)
      case 'E': return y === 0; // Equatorial layer (between U and D faces)
      case 'S': return z === 0; // Standing layer (between F and B faces)
      default: return false;
    }
  });
  
  // Debug: Log the filtering results (only for R rotation)
  if (face === 'R') {
    console.log(`🎯 Found ${rotatingPieces.length} pieces on R face`);
    console.log(`🎯 Pieces on R face:`, rotatingPieces.map(p => `${p.pieceId}: [${p.position.join(', ')}]`));
    
    // Debug: Check if piece 25 is included
    const piece25Included = rotatingPieces.find(p => p.pieceId === 25);
    if (piece25Included) {
      console.log(`🎯 Piece 25 is included in R face rotation`);
    } else {
      console.log(`🎯 Piece 25 is NOT included in R face rotation`);
    }
  }
  
  logRotationStep('B1', face, direction, `Found ${rotatingPieces.length} pieces on face`, rotatingPieces.map(p => `${p.pieceId}: [${p.position.join(', ')}]`));
  
  rotatingPieces.forEach(piece => {
    // Debug: Log initial colors for piece 17 before any rotation
    if (piece.pieceId === 17) {
      console.log(`🎨 BEFORE ROTATION - Piece 17 starting colors for ${face} ${direction}:`, piece.colors);
    }
    
    // Debug: Log all pieces being processed
    console.log(`🎨 Processing piece ${piece.pieceId} for ${face} ${direction} rotation at position [${piece.position.join(', ')}]`);
    
    // Apply 3D transformation based on face (only current rotation)
    const [x, y, z] = piece.position;
    const [newX, newY, newZ] = applyPositionTransformation(piece.position, face, direction);
    
    // console.log(`🔄 Piece ${piece.pieceId} moving from [${x}, ${y}, ${z}] to [${newX}, ${newY}, ${newZ}]`);
    
    // Rotate the colors to match the new orientation
    // When a piece rotates, its colors need to be rotated too
    // Start with the original solved colors and apply ALL rotations from history
    const originalColors = getOriginalColors(piece.pieceId);
    let rotatedColors = { ...originalColors };
    
    // Apply all previous rotations to get to the current color state
    for (const rotation of piece.rotationHistory || []) {
      rotatedColors = applyColorRotation(rotatedColors, rotation.move, rotation.direction);
    }
    
    // Now apply the current rotation
    rotatedColors = applyColorRotation(rotatedColors, face, direction);
    
    // Color rotation is now handled by the helper function above
    
    // Debug: Log the color rotation for piece 25 (top-right-front corner, more visible)
    if (piece.pieceId === 25 && (face === 'R' || face === 'B')) {
      // Clear console at start of rotation for clean logs
      if (piece.rotationHistory.length === 0) {
        console.clear();
        console.log('🧹 Console cleared for rotation test');
      }
      
      console.log(`🎨 Piece 25 ${face} rotation: ${face} ${direction}`);
      console.log(`🎨 Original solved colors:`, originalColors);
      console.log(`🎨 Rotation history:`, piece.rotationHistory || []);
      console.log(`🎨 Current piece colors (before this rotation):`, piece.colors);
      
      // Debug: Check if rotationHistory is undefined or null
      if (!piece.rotationHistory) {
        console.log('🚨 PROBLEM: piece.rotationHistory is undefined or null!');
      } else if (piece.rotationHistory.length === 0) {
        console.log('✅ FIRST ROTATION: No previous rotations');
      } else {
        console.log('⚠️ COMPOUND ROTATION: Has', piece.rotationHistory.length, 'previous rotations');
      }
      
      // Debug: Show step-by-step color application
      let stepColors = { ...originalColors };
      console.log(`🎨 Step 1 - Starting with original colors:`, stepColors);
      
      for (let i = 0; i < (piece.rotationHistory || []).length; i++) {
        const rotation = piece.rotationHistory[i];
        stepColors = applyColorRotation(stepColors, rotation.move, rotation.direction);
        console.log(`🎨 Step ${i + 2} - After ${rotation.move} ${rotation.direction}:`, stepColors);
      }
      
      // Show the current rotation being applied
      const currentRotationResult = applyColorRotation(stepColors, face, direction);
      console.log(`🎨 Step ${(piece.rotationHistory || []).length + 2} - After current ${face} ${direction}:`, currentRotationResult);
      
      console.log(`🎨 Final rotated colors (after all rotations):`, rotatedColors);
      console.log(`🎨 Position change: [${x}, ${y}, ${z}] → [${newX}, ${newY}, ${newZ}]`);
      
      // Debug: Show what colors should be visible on each face
      console.log(`🎨 Colors that should be visible on each face:`);
      console.log(`🎨   Top face (y=1): ${rotatedColors.top}`);
      console.log(`🎨   Bottom face (y=-1): ${rotatedColors.bottom}`);
      console.log(`🎨   Front face (z=1): ${rotatedColors.front}`);
      console.log(`🎨   Back face (z=-1): ${rotatedColors.back}`);
      console.log(`🎨   Right face (x=1): ${rotatedColors.right}`);
      console.log(`🎨   Left face (x=-1): ${rotatedColors.left}`);
      
      // Special debug for B then R sequence
      if (piece.rotationHistory.length === 1 && piece.rotationHistory[0].move === 'B' && face === 'R') {
        console.log('🔍 SPECIAL DEBUG: B then R sequence detected!');
        console.log('🔍 After B rotation, colors should be:', piece.colors);
        console.log('🔍 Now applying R rotation to those colors...');
      }
    }
    
    // Update position and colors
    piece.position = [newX, newY, newZ];
    piece.colors = rotatedColors;
    
    // Add to rotation history
    piece.rotationHistory.push({
      move: face,
      direction: direction,
      fromPosition: [x, y, z],
      toPosition: [newX, newY, newZ],
      timestamp: new Date().toISOString()
    });
    
    // Debug: Log rotation history addition for piece 25
    if (piece.pieceId === 25 && (face === 'R' || face === 'B')) {
      console.log(`📝 Added ${face} rotation to history: ${face} ${direction}`);
      console.log(`📝 Rotation history now has`, piece.rotationHistory.length, 'rotations:', piece.rotationHistory);
    }
  });
  
  logRotationStep('C', face, direction, 'Output pieces colors after rotation', pieces.map(p => `${p.pieceId}: ${JSON.stringify(p.colors)}`));
  logRotationStep('D', face, direction, 'applyRotation completed');
};

// Custom hook for rotation functionality
export function useRotation(setCubeState, setIsAnimating, setRotatingFace, setRotationProgress, setMoveHistory, setHasRotated) {

  // Function to rotate a face with smooth 3D animation
  const rotateFaceWithAnimation = useCallback((face, direction, onComplete) => {
    // console.log(`🎯🎯🎯 FUNCTION ACTIVATED: rotateFaceWithAnimation called: ${face} ${direction} 🎯🎯🎯`);
    logToTerminal(`🎯🎯🎯 FUNCTION ACTIVATED: rotateFaceWithAnimation called`, { face, direction }, 'INFO');
    
    // console.log(`🎯 Rotating face ${face} ${direction} with smooth animation`);
    
    // Set animation state
    setIsAnimating(true);
    
    // Log rotation start to terminal
    logRotationStep('3', face, direction, 'rotateFaceWithAnimation called');
    logRotationStep('4', face, direction, 'ROTATION STARTED');
    
    // Record the move for solve (same as manual rotation)
    setMoveHistory(prev => {
      const newHistory = [...prev, { face, direction, timestamp: Date.now() }];
      // console.log(`📝 RECORDED MOVE: ${face} ${direction} (Total moves: ${newHistory.length})`);
      return newHistory;
    });
    
    // Set the rotating face for visual feedback
    setRotatingFace({ face, direction });
    setRotationProgress(0);
    
    // Smooth animation using requestAnimationFrame
    const animationDuration = 1000; // 1000ms for smooth rotation (increased for visibility)
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Ease out animation for smoother feel
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setRotationProgress(easedProgress);
      
      // Log animation progress every 100ms
      if (Math.floor(elapsed / 100) !== Math.floor((elapsed - 16) / 100)) {
        // console.log(`🎯 ANIMATION PROGRESS: ${face} ${direction} - ${Math.round(progress * 100)}% (${elapsed.toFixed(0)}ms)`);
        logToTerminal(`🎯 ANIMATION PROGRESS`, { face, direction, progress: Math.round(progress * 100), elapsed: Math.round(elapsed) }, 'INFO');
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete - apply the actual position changes
        logRotationStep('5', face, direction, 'setCubeState called');
        setCubeState(prevState => {
          // console.log(`🔄 Applying position changes for ${face} ${direction}`);
          // console.log('Previous state colors:', prevState.map(p => `${p.pieceId}: ${JSON.stringify(p.colors)}`));
          
          // Log to terminal: rotation completion and state update
          logRotationStep('6', face, direction, 'ROTATION COMPLETED');
          // About to update state with rotation
          
          const newState = [...prevState];
          const pieces = newState.map((piece, index) => ({ ...piece }));
          
          // Apply rotation using consolidated logic
          applyRotation(pieces, face, direction);

          // Update the newState with the modified pieces
          pieces.forEach((piece, index) => {
            newState[index] = {
              pieceId: piece.pieceId, // Keep the pieceId
              position: piece.position,
              colors: piece.colors,
              rotationHistory: piece.rotationHistory
            };
          });
          
          // console.log('✅ Rotation applied to cube state');
          
          return newState;
        });
        
        // Clear rotation state
        setRotatingFace(null);
        setRotationProgress(0);
        setIsAnimating(false);
        setHasRotated(true); // Mark that rotation has occurred
        
        // console.log('🎯 ROTATION COMPLETED - State should be updated');
        // Get current state to verify rotation was applied
        const currentState = CubeStateManager.getState();
        // console.log('🎯 Pieces that moved:', currentState.filter(p => {
        //   const originalPos = [-1, -1, -1]; // Default original position for piece 0
        //   return p.position[0] !== originalPos[0] || p.position[1] !== originalPos[1] || p.position[2] !== originalPos[2];
        // }).map(p => `${p.pieceId}: [${p.position.join(', ')}]`));
        
        // Check if state gets reset after a short delay
        setTimeout(() => {
          const delayedState = CubeStateManager.getState();
          const stillScrambled = delayedState.some(p => {
            const originalPos = [-1, -1, -1]; // Default original position for piece 0
            return p.position[0] !== originalPos[0] || p.position[1] !== originalPos[1] || p.position[2] !== originalPos[2];
          });
          if (!stillScrambled) {
            console.log('🚨 STATE WAS RESET AFTER ROTATION COMPLETED!');
            console.log('🚨 SUMMARY: State management has a bug - state gets reset');
          } else {
            // console.log('✅ State remained scrambled after delay');
            console.log('✅ SUMMARY: State management is working correctly');
          }
        }, 100);
        
        // Call completion callback
        if (onComplete) {
          onComplete();
        }
      }
    };
    
    requestAnimationFrame(animate);
  }, [setCubeState, setIsAnimating, setHasRotated]);

  // Function to execute moves with realistic face rotation animations
  const executeMovesWithAnimation = useCallback((moves, onComplete) => {
    let currentMoveIndex = 0;
    
    const executeNextMove = () => {
      if (currentMoveIndex >= moves.length) {
        if (onComplete) onComplete();
        return;
      }
      
      const move = moves[currentMoveIndex];
      // console.log(`🔄 Executing move ${currentMoveIndex + 1}/${moves.length}: ${move.face} ${move.direction}`);
      
      // Execute the move with realistic face rotation
      rotateFaceWithAnimation(move.face, move.direction, () => {
        currentMoveIndex++;
        // Small delay between moves for visual clarity
        setTimeout(executeNextMove, 25);
      });
    };
    
    executeNextMove();
  }, [rotateFaceWithAnimation]);

  // Rotate a face of the cube with smooth animation
  const rotateFace = useCallback((face, direction) => {
    // console.log(`🔥🔥🔥 ROTATE FACE CALLED: ${face} ${direction} 🔥🔥🔥`);
    logRotationStep('1', face, direction, 'rotateFace called');
    logToTerminal('🚀 TEST LOG: rotateFace function called', { face, direction }, 'SUCCESS');
    
    // Also log to browser console for easier visibility
    // console.log('🚀🚀🚀 ROTATION STARTED - Browser Console Log 🚀🚀🚀');
    // console.log('Face:', face, 'Direction:', direction);
    
    logRotationStep('2', face, direction, 'Starting rotation');
    setIsAnimating(true);
    
    // Use the smooth animation function
    rotateFaceWithAnimation(face, direction, () => {
      logToTerminal(`✅ rotateFace: Animation completed`, null, 'SUCCESS');
      setIsAnimating(false);
    });
  }, [rotateFaceWithAnimation]);

  return {
    rotateFace,
    rotateFaceWithAnimation,
    executeMovesWithAnimation,
    applyRotation
  };
}
