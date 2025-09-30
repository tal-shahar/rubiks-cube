import React, { useEffect, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { CubeStateProvider } from './state/CubeStateProvider';
import { CubeGroup } from './components/CubeGroup';
import { useRotation } from './hooks/useRotation';
import { getOriginalColors, getStartingPositionColors } from './utils/colors';
import { getScrambleRotations } from '../../utils/rotationConfig';
import { advancedSolver } from '../../utils/advancedSolver';

// Camera reset component
const CameraReset = ({ onCameraReset }) => {
  const { camera } = useThree();
  
  // Store initial camera position
  const initialCameraPosition = [5, 5, 5];
  const initialTarget = [0, 0, 0];
  
  // Expose camera reset function to parent
  useEffect(() => {
    if (onCameraReset) {
      onCameraReset(() => {
        console.log('Camera reset function called');
        console.log('OrbitControls ref available:', !!window.orbitControlsRef);
        
        // Use a timeout to ensure the reset happens after the cube state reset
        setTimeout(() => {
          if (window.orbitControlsRef) {
            console.log('Resetting camera position to:', initialCameraPosition);
            console.log('Resetting camera target to:', initialTarget);
            
            // Reset camera position
            camera.position.set(...initialCameraPosition);
            // Reset controls target
            window.orbitControlsRef.target.set(...initialTarget);
            // Update controls
            window.orbitControlsRef.update();
            
            console.log('Camera reset to initial position - COMPLETED');
          } else {
            console.log('OrbitControls ref not available for camera reset');
          }
        }, 100); // Small delay to ensure cube state reset completes first
      });
    }
  }, [onCameraReset, camera]);
  
  return null; // This component doesn't render anything
};

// Main Rubik's Cube component
export function RubiksCube({ 
  isRotating, 
  autoRotate = false, 
  onScramble, 
  onReset, 
  onSolveRef,
  onRotateFace, 
  onCubeStateChange, 
  onResetRef, 
  onGroupRef, 
  onCameraReset, 
  onAnimationStateChange,
  cubeId,
  onMoveHistoryChange 
}) {
  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 50 }}
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      <CubeStateProvider onCubeStateChange={onCubeStateChange} cubeId={cubeId}>
        {({ cubeState, isAnimating, rotatingFace, rotationProgress, setCubeState, setIsAnimating, setRotatingFace, setRotationProgress, moveHistory, setMoveHistory, hasRotated, setHasRotated, cubeStateManager }) => {
          const rotationHook = useRotation(setCubeState, setIsAnimating, setRotatingFace, setRotationProgress, setMoveHistory, setHasRotated, cubeStateManager);
          
          // Notify parent component when animation state changes
          useEffect(() => {
            if (onAnimationStateChange) {
              onAnimationStateChange(isAnimating);
            }
          }, [isAnimating, onAnimationStateChange]);
          
          // Create enhanced functions that use the rotation hook
          const enhancedRotateFace = useCallback((face, direction) => {
            if (isAnimating) {
              console.log(`⚠️ enhancedRotateFace: Already animating, skipping ${face} ${direction}`);
              return;
            }
            rotationHook.rotateFace(face, direction);
          }, [isAnimating]);
          
          const enhancedRotateFaceWithAnimation = useCallback((face, direction, onComplete) => {
            if (isAnimating) {
              console.log(`⚠️ enhancedRotateFaceWithAnimation: Already animating, skipping ${face} ${direction}`);
              return;
            }
            rotationHook.rotateFaceWithAnimation(face, direction, onComplete);
          }, [isAnimating]);
          
          const enhancedExecuteMovesWithAnimation = useCallback((moves, onComplete) => {
            if (isAnimating) {
              console.log(`⚠️ enhancedExecuteMovesWithAnimation: Already animating, skipping moves`);
              return;
            }
            rotationHook.executeMovesWithAnimation(moves, onComplete);
          }, [isAnimating]);

          const enhancedExecuteScrambleWithAnimation = useCallback((moves, onComplete) => {
            if (isAnimating) {
              console.log(`⚠️ enhancedExecuteScrambleWithAnimation: Already animating, skipping moves`);
              return;
            }
            rotationHook.executeScrambleWithAnimation(moves, onComplete);
          }, [isAnimating]);

          const enhancedExecuteSolveWithAnimation = useCallback((moves, onComplete) => {
            if (isAnimating) {
              console.log(`⚠️ enhancedExecuteSolveWithAnimation: Already animating, skipping moves`);
              return;
            }
            rotationHook.executeSolveWithAnimation(moves, onComplete);
          }, [isAnimating]);

          // Scramble the cube with realistic face rotations
          const scramble = useCallback(() => {
            if (isAnimating) return;
            
            setHasRotated(true); // Mark that rotations have occurred
            setIsAnimating(true);
            
            // DON'T clear move history - keep all previous moves (manual + scramble)
            console.log(`🎲 SCRAMBLING CUBE - Current move history: ${moveHistory.length} moves`);
            
            const moves = getScrambleRotations();
            const directions = ['clockwise', 'counterclockwise'];
            const scrambleSequence = [];
            
            // Use a shared seed for consistent scramble across both cubes
            // This ensures both cubes get the same sequence but generate it independently
            const sharedSeed = Math.floor(Date.now() / 1000); // Use seconds for shared timing
            let seed = sharedSeed;
            
            // Simple seeded random number generator
            const seededRandom = () => {
              seed = (seed * 9301 + 49297) % 233280;
              return seed / 233280;
            };
            
            // Generate 30 random moves using the seeded generator
            for (let i = 0; i < 30; i++) {
              const move = moves[Math.floor(seededRandom() * moves.length)];
              const direction = directions[Math.floor(seededRandom() * directions.length)];
              scrambleSequence.push({ face: move, direction });
            }
            
            console.log('🎲 SCRAMBLING CUBE with sequence:', scrambleSequence.map(m => `${m.face} ${m.direction}`));
            
            // Execute scramble moves with fast animations
            enhancedExecuteScrambleWithAnimation(scrambleSequence, () => {
              setIsAnimating(false);
              console.log('✅ CUBE SCRAMBLED!');
              
              // Update move history with scramble moves
              setMoveHistory(prevHistory => {
                const newHistory = [...prevHistory, ...scrambleSequence];
                console.log(`📝 Updated move history: ${newHistory.length} total moves`);
                
                // Notify parent component of move history change
                if (onMoveHistoryChange) {
                  onMoveHistoryChange(newHistory);
                }
                
                return newHistory;
              });
              
              // Log final state
              setCubeState(currentState => {
                console.log('🎯 CUBE STATE AFTER SCRAMBLE:');
                console.log(JSON.stringify(currentState, null, 2));
                return currentState;
              });
            });
          }, [isAnimating, setHasRotated, setIsAnimating, enhancedExecuteScrambleWithAnimation, setMoveHistory, onMoveHistoryChange, setCubeState]);

          // Reset the cube to solved state
          const reset = useCallback(() => {
            // Clear move history when resetting
            setMoveHistory([]);
            setHasRotated(false); // Reset the rotation flag since we're going back to original state
            
            // Notify parent component of cleared move history
            if (onMoveHistoryChange) {
              onMoveHistoryChange([]);
            }
            
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
          }, [setMoveHistory, setHasRotated, onMoveHistoryChange, setCubeState]);

          // Expose reset function to parent component
          useEffect(() => {
            if (onResetRef) {
              onResetRef.current = reset;
            }
          }, [onResetRef, reset]);


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
          const solve = useCallback((customSequence = null) => {
            if (isAnimating) return;
            
            // If custom sequence is provided (for simple revert solver), use it
            if (customSequence && customSequence.length > 0) {
              console.log(`🔄 SIMPLE REVERT SOLVER: Using provided sequence with ${customSequence.length} moves`);
              console.log('🔄 Sequence:', customSequence.map(m => `${m.face} ${m.direction}`));
              
              // Execute moves with slower solve animations (55 FPS)
              enhancedExecuteSolveWithAnimation(customSequence, () => {
                // Clear move history after solving
                setMoveHistory([]);
                setIsAnimating(false);
                console.log('✅ CUBE SOLVED WITH SIMPLE REVERT METHOD!');
                
                // Notify parent component of cleared move history
                if (onMoveHistoryChange) {
                  onMoveHistoryChange([]);
                }
              });
              return;
            }
            
            // Check if this is the left cube (simple revert solver) or right cube (advanced solver)
            const isLeftCube = cubeId === 'left';
            
            if (isLeftCube) {
              console.log('🔄 LEFT CUBE: Using simple revert solver (no custom sequence provided)');
              
              // For left cube without custom sequence, use move history
              if (moveHistory.length === 0) {
                console.log('⚠️ Left cube: No moves to reverse - cube might already be solved');
                return;
              }
              
              const solveSequence = generateOptimalSolve(moveHistory);
              
              if (solveSequence.length === 0) {
                console.log('⚠️ Left cube: No moves to reverse - cube might already be solved');
                return;
              }
              
              console.log(`🎯 LEFT CUBE SIMPLE SOLVE: Reversing ${moveHistory.length} moves`);
              console.log('🔄 Left cube sequence:', solveSequence.map(m => `${m.face} ${m.direction}`));
              
              // Track performance for Simple Reverse
              const simpleStartTime = performance.now();
              console.log(`⏱️ Simple Reverse started at ${simpleStartTime.toFixed(2)}ms`);
              
              enhancedExecuteSolveWithAnimation(solveSequence, () => {
                const simpleEndTime = performance.now();
                const simpleTotalTime = simpleEndTime - simpleStartTime;
                
                setMoveHistory([]);
                setIsAnimating(false);
                console.log(`✅ LEFT CUBE SOLVED WITH SIMPLE METHOD!`);
                console.log(`⏱️ Simple Reverse completed in ${simpleTotalTime.toFixed(2)}ms with ${solveSequence.length} moves`);
                
                // Notify parent component of cleared move history
                if (onMoveHistoryChange) {
                  onMoveHistoryChange([]);
                }
              });
              return;
            }
            
            console.log('🧩 RIGHT CUBE ADVANCED SOLVER: Starting solve...');
            
            // Use advanced solver to analyze and solve the cube
            // Pass both cube state and move history for proper solving
            const solverResult = advancedSolver.solve(cubeState, moveHistory);
            
            if (solverResult.success) {
              console.log(`✅ Advanced solver found solution: ${solverResult.moves} moves using ${solverResult.method}`);
              console.log('📝 Solution:', solverResult.solution);
              
              // Log performance comparison data
              if (solverResult.performance) {
                console.log('📊 PERFORMANCE COMPARISON:');
                console.log(`⏱️ Simple Reverse: ${solverResult.performance.simpleReverse.moves} moves in ${solverResult.performance.simpleReverse.time.toFixed(2)}ms`);
                if (solverResult.performance.advanced) {
                  console.log(`⏱️ Advanced Algorithm: ${solverResult.performance.advanced.moves} moves in ${solverResult.performance.advanced.time.toFixed(2)}ms`);
                }
                console.log(`🏆 Winner: ${solverResult.performance.comparison}`);
                
                // Calculate efficiency comparison
                const simpleMoves = solverResult.performance.simpleReverse.moves;
                const advancedMoves = solverResult.performance.advanced ? solverResult.performance.advanced.moves : simpleMoves;
                const efficiency = ((simpleMoves - advancedMoves) / simpleMoves * 100).toFixed(1);
                
                if (solverResult.performance.advanced) {
                  if (advancedMoves < simpleMoves) {
                    console.log(`🚀 Advanced is ${efficiency}% more efficient!`);
                  } else if (advancedMoves > simpleMoves) {
                    console.log(`⚠️ Advanced is ${Math.abs(efficiency)}% less efficient!`);
                  } else {
                    console.log(`🤝 Both methods are equally efficient`);
                  }
                }
              }
              
              if (solverResult.solution.length === 0) {
                console.log('🎯 Cube is already solved!');
                return;
              }
              
              // Convert solution to move sequence format
              const solveSequence = solverResult.solution.map(move => {
                const face = move[0];
                const direction = move.endsWith("'") ? 'counterclockwise' : move.endsWith('2') ? 'double' : 'clockwise';
                return { face, direction };
              });
              
              console.log('🔄 Converted sequence:', solveSequence.map(m => `${m.face} ${m.direction}`));
              console.log(`🚀 Starting advanced solve with ${solveSequence.length} moves...`);
              
              // Execute moves with slower solve animations (55 FPS)
              enhancedExecuteSolveWithAnimation(solveSequence, () => {
                // Clear move history after solving
                setMoveHistory([]);
                setIsAnimating(false);
                console.log('✅ RIGHT CUBE SOLVED WITH ADVANCED ALGORITHM!');
                
                // Notify parent component of cleared move history
                if (onMoveHistoryChange) {
                  onMoveHistoryChange([]);
                }
              });
              
            } else {
              console.log('❌ Advanced solver failed:', solverResult.error || 'Unknown error');
              console.log('🔄 Falling back to simple reverse method...');
              
              // Fallback to simple reverse method
              console.log(`🎯 SIMPLE SOLVE: Reversing ${moveHistory.length} moves`);
              const solveSequence = generateOptimalSolve(moveHistory);
              
              if (solveSequence.length === 0) {
                console.log('⚠️ No moves to reverse - cube might already be solved');
                return;
              }
              
              enhancedExecuteSolveWithAnimation(solveSequence, () => {
                setMoveHistory([]);
                setIsAnimating(false);
                console.log('✅ CUBE SOLVED WITH SIMPLE METHOD!');
                
                // Notify parent component of cleared move history
                if (onMoveHistoryChange) {
                  onMoveHistoryChange([]);
                }
              });
            }

          }, [isAnimating, cubeId, onMoveHistoryChange, setMoveHistory, setIsAnimating]);

          // Expose solve function to parent component
          useEffect(() => {
            if (onSolveRef) {
              onSolveRef.current = solve;
            }
          }, [onSolveRef, solve]);

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
              onRotateFace={onRotateFace}
              onCubeStateChange={onCubeStateChange}
              onGroupRef={onGroupRef}
              cubeId={cubeId}
            />
          );
        }}
      </CubeStateProvider>
      
      <CameraReset onCameraReset={onCameraReset} />
      <OrbitControls 
        ref={ref => {
          // Store controls reference for camera reset
          if (ref) {
            window.orbitControlsRef = ref;
            console.log('OrbitControls ref set:', ref);
          }
        }}
        enablePan={true} 
        enableZoom={true} 
        enableRotate={isRotating}
        autoRotate={false}
        autoRotateSpeed={2.0}
      />
      <Environment preset="sunset" />
    </Canvas>
  );
}
