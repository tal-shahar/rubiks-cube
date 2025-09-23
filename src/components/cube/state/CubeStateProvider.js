import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { logToTerminal } from '../utils/logger';
import { getOriginalPosition, getOriginalColors, getStartingPositionColors } from '../utils/colors';

// Pure JavaScript global state manager - NO React dependencies
const CubeStateManager = {
  state: null,
  initialized: false,
  listeners: [],
  
  // Ensure initialization happens only once
  ensureInitialized() {
    if (!this.initialized) {
      // console.log('🚨🚨🚨 CubeStateManager: REINITIALIZING - This should not happen!');
      // console.trace('🚨 REINITIALIZATION - Stack trace:');
      this.initialize();
    }
  },

  getState() {
    // Only initialize if we haven't initialized yet (first time only)
    if (!this.initialized) {
      console.log('🚨 CubeStateManager: REINITIALIZING! initialized =', this.initialized);
      this.initialize();
    } else {
      // Debug: Check if rotation history is being preserved
      const hasRotationHistory = this.state.some(piece => piece.rotationHistory && piece.rotationHistory.length > 0);
      if (hasRotationHistory) {
        console.log('✅ CubeStateManager: State has rotation history preserved');
      } else {
        console.log('⚠️ CubeStateManager: State has NO rotation history');
      }
    }
    return this.state;
  },

  setState(newState) {
    if (typeof newState === 'function') {
      this.state = newState(this.state);
    } else {
      this.state = newState;
    }
    
    // Debug: Check if this looks like a reset to solved state
    const isSolvedState = this.state.every((piece, index) => {
      const originalPosition = getOriginalPosition(piece.pieceId);
      return piece.position[0] === originalPosition[0] && 
             piece.position[1] === originalPosition[1] && 
             piece.position[2] === originalPosition[2];
    });
    
    if (isSolvedState) {
      console.log('⚠️ State update resulted in solved state - this might be a reset!');
      console.trace('⚠️ Stack trace of state reset:');
    } else {
      // console.log('✅ State updated with scrambled positions');
    }

    // Notify all listeners
    this.listeners.forEach(listener => listener());
  },

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },

  initialize() {
    // console.log('🔄 CubeStateManager: Initializing cube state');
    logToTerminal('🔄 CubeStateManager: Initializing cube state', null, 'INFO');

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
          // console.log(`Initial piece ${pieceId} at [${x}, ${y}, ${z}]:`, colors);
          // console.log(`getOriginalColors returned:`, JSON.stringify(colors));
          
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
    // console.log('🎯 INITIAL CUBE STATE (End of Initial Load):');
    // console.log(JSON.stringify(state, null, 2));
    
    // Also log to terminal (this will show in the terminal where npm start is running)
    logToTerminal('🎯 INITIAL CUBE STATE (End of Initial Load)', state, 'INFO');

    this.state = state;
    this.initialized = true;
  }
};

// Make CubeStateManager available globally
if (typeof window !== 'undefined') {
  window.CubeStateManager = CubeStateManager;
  // console.log('🌐 CubeStateManager exposed globally on window object');
}

// Simple React component that uses the global state manager
export function CubeStateProvider({ children, onCubeStateChange }) {
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Subscribe to state changes
  useEffect(() => {
    const unsubscribe = CubeStateManager.subscribe(() => {
      setForceUpdate(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

    const cubeState = useMemo(() => {
      const state = CubeStateManager.getState();
      // console.log(`🔍 CubeStateProvider providing state:`, state.slice(0, 3).map(p => `${p.pieceId}: [${p.position.join(', ')}]`));
      
      // Check if this is a solved state
      const isSolved = state.every((piece, index) => {
        const originalPosition = getOriginalPosition(piece.pieceId);
        return piece.position[0] === originalPosition[0] && 
               piece.position[1] === originalPosition[1] && 
               piece.position[2] === originalPosition[2];
      });
      
      // if (isSolved) {
      //   console.log('🚨 CubeStateProvider providing SOLVED state!');
      //   console.trace('🚨 Stack trace of SOLVED state provision:');
      // } else {
      //   console.log('✅ CubeStateProvider providing SCRAMBLED state');
      // }
      
      return state;
    }, [forceUpdate]);

  // Function to update cube state
  const setCubeState = useCallback((newState) => {
    CubeStateManager.setState(newState);
  }, []);

  const [isAnimating, setIsAnimating] = useState(false);
  const [rotatingFace, setRotatingFace] = useState(null);
  const [rotationProgress, setRotationProgress] = useState(0);
  const [moveHistory, setMoveHistory] = useState([]); // Simple move history for solve
  const [hasRotated, setHasRotated] = useState(false); // Track if any rotations have occurred

  // Debug cube state changes
  React.useEffect(() => {
    // Check if ALL pieces are back in their original solved positions (this is the real problem)
    const isBackToSolved = cubeState.every((piece, index) => {
      const originalPosition = getOriginalPosition(piece.pieceId);
      return piece.position[0] === originalPosition[0] && 
             piece.position[1] === originalPosition[1] && 
             piece.position[2] === originalPosition[2];
    });
    
    if (isBackToSolved && hasRotated) {
      // console.log('🚨 PROBLEM: Cube reverted to solved state after rotation!');
      // console.log('🚨 This means the state is being reset somewhere after rotation completes');
    } else if (!isBackToSolved && hasRotated) {
      // console.log('✅ GOOD: Cube is scrambled after rotation (pieces moved from original positions)');
    }
    
    // NOTE: Removed onCubeStateChange call to prevent circular dependency
    // The parent component can access cubeState directly if needed
    
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

  return children({
    cubeState,
    isAnimating,
    rotatingFace,
    rotationProgress,
    setCubeState,
    setIsAnimating,
    setRotatingFace,
    setRotationProgress,
    moveHistory,
    setMoveHistory,
    hasRotated,
    setHasRotated
  });
}

export { CubeStateManager };
