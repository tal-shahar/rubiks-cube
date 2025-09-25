import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { CubeStateProvider } from './state/CubeStateProvider';
import { CubeGroup } from './components/CubeGroup';
import { useRotation } from './hooks/useRotation';
import { getOriginalColors, getStartingPositionColors } from './utils/colors';

// Main Rubik's Cube component
export function RubiksCube({ isRotating, autoRotate = false, onScramble, onReset, onSolve, onRotateFace, onCubeStateChange, highlightedPieces = [] }) {
  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 50 }}
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      <CubeStateProvider onCubeStateChange={onCubeStateChange}>
        {({ cubeState, isAnimating, rotatingFace, rotationProgress, setCubeState, setIsAnimating, setRotatingFace, setRotationProgress, moveHistory, setMoveHistory, hasRotated, setHasRotated }) => {
          const rotationHook = useRotation(setCubeState, setIsAnimating, setRotatingFace, setRotationProgress, setMoveHistory, setHasRotated);
          
          // Create enhanced functions that use the rotation hook
          const enhancedRotateFace = (face, direction) => {
            if (isAnimating) {
              console.log(`⚠️ enhancedRotateFace: Already animating, skipping ${face} ${direction}`);
              return;
            }
            rotationHook.rotateFace(face, direction);
          };
          
          const enhancedRotateFaceWithAnimation = (face, direction, onComplete) => {
            if (isAnimating) {
              console.log(`⚠️ enhancedRotateFaceWithAnimation: Already animating, skipping ${face} ${direction}`);
              return;
            }
            rotationHook.rotateFaceWithAnimation(face, direction, onComplete);
          };
          
          const enhancedExecuteMovesWithAnimation = (moves, onComplete) => {
            if (isAnimating) {
              console.log(`⚠️ enhancedExecuteMovesWithAnimation: Already animating, skipping moves`);
              return;
            }
            rotationHook.executeMovesWithAnimation(moves, onComplete);
          };

          // Scramble the cube with realistic face rotations
          const scramble = () => {
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
            enhancedExecuteMovesWithAnimation(scrambleSequence, () => {
              setIsAnimating(false);
              console.log('✅ CUBE SCRAMBLED!');
              
              // Log final state
              setCubeState(currentState => {
                console.log('🎯 CUBE STATE AFTER SCRAMBLE:');
                console.log(JSON.stringify(currentState, null, 2));
                return currentState;
              });
            });
          };

          // Reset the cube to solved state
          const reset = () => {
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
              
              console.log('🎯 CUBE RESET TO SOLVED STATE');
              console.log(JSON.stringify(state, null, 2));
              
              return state;
            });
          };

          // Generate optimal solve sequence using beginner's method
          const generateOptimalSolve = (moveHistory) => {
            // This is a simplified version - in reality, you'd use proper algorithms like CFOP
            // For now, we'll use the reverse of all moves, but optimize the sequence
            
            if (moveHistory.length === 0) {
              console.log('⚠️ No moves to reverse - cube might already be solved or no moves were recorded');
              return [];
            }
            
            // Reverse the moves and create solve sequence
            const solveSequence = moveHistory
              .slice()
              .reverse()
              .map(move => ({
                face: move.face,
                direction: move.direction === 'clockwise' ? 'counterclockwise' : 'clockwise'
              }));
            
            return solveSequence;
          };

          // Solve the cube by reversing all moves
          const solve = () => {
            if (isAnimating) return;
            
            console.log('🧩 SOLVING CUBE...');
            console.log(`🎯 SOLVING CUBE: Reversing ${moveHistory.length} moves`);
            console.log('📋 Move history:', moveHistory.map(m => `${m.face} ${m.direction}`));
            
            // Generate solve sequence from move history
            const solveSequence = generateOptimalSolve(moveHistory);
            
            if (solveSequence.length === 0) {
              console.log('⚠️ No moves to reverse - cube might already be solved or no moves were recorded');
              return;
            }
            
            console.log('🔄 Reversed sequence:', solveSequence.map(m => `${m.face} ${m.direction}`));
            console.log(`🚀 Starting solve with ${solveSequence.length} moves...`);
            
            // Execute moves with realistic face rotations
            enhancedExecuteMovesWithAnimation(solveSequence, () => {
              // Clear move history after solving
              setMoveHistory([]);
              setIsAnimating(false);
              console.log('✅ CUBE SOLVED!');
            });
          };

          return (
            <CubeGroup
              cubeState={cubeState}
              isAnimating={isAnimating}
              rotatingFace={rotatingFace}
              rotationProgress={rotationProgress}
              rotateFace={enhancedRotateFace}
              rotateFaceWithAnimation={enhancedRotateFaceWithAnimation}
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
          );
        }}
      </CubeStateProvider>
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <Environment preset="sunset" />
    </Canvas>
  );
}
