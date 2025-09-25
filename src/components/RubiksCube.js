import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { CubeStateProvider } from './cube/state/CubeStateProvider';
import { RubiksCube as ModularRubiksCube } from './cube/RubiksCube';

// Camera reset component
const CameraReset = ({ onCameraReset }) => {
  console.log('CameraReset component rendering, onCameraReset:', !!onCameraReset);
  const { camera, gl } = useThree();
  
  // Store initial camera position
  const initialCameraPosition = [5, 5, 5];
  const initialTarget = [0, 0, 0];
  
  // Expose camera reset function to parent
  useEffect(() => {
    console.log('CameraReset useEffect running, onCameraReset:', !!onCameraReset);
    if (onCameraReset) {
      console.log('Setting up camera reset function');
      onCameraReset(() => {
        console.log('Camera reset function called');
        console.log('OrbitControls ref available:', !!window.orbitControlsRef);
        console.log('Camera object:', camera);
        
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
            // Force render
            gl.render();
            
            console.log('Camera reset to initial position - COMPLETED');
          } else {
            console.log('OrbitControls ref not available for camera reset');
          }
        }, 100); // Small delay to ensure cube state reset completes first
      });
    }
  }, [onCameraReset, camera, gl]);
  
  return null; // This component doesn't render anything
};

// Main Rubik's Cube component that uses the modular implementation
export function RubiksCubeWrapper({ isRotating, autoRotate = false, onScramble, onReset, onSolve, onRotateFace, onCubeStateChange, onCameraReset, onGroupRef }) {
  console.log('RubiksCube component rendering, onCameraReset:', !!onCameraReset);
  
  return (
    <CubeStateProvider onCubeStateChange={onCubeStateChange}>
      {({ cubeState, isAnimating, rotatingFace, rotationProgress, setCubeState, setIsAnimating, setRotatingFace, setRotationProgress, moveHistory, setMoveHistory, hasRotated, setHasRotated }) => {
        
        // Expose functions to parent component
        useEffect(() => {
          if (onScramble) {
            onScramble(() => {
              // Scramble function will be implemented in the modular component
              console.log('Scramble function called');
            });
          }
        }, [onScramble]);

        // Store reference to reset function from modular component
        const resetRef = useRef();
        
        useEffect(() => {
          if (onReset) {
            onReset(() => {
              // Call the actual reset function from the modular component
              if (resetRef.current) {
                resetRef.current();
              }
            });
          }
        }, [onReset]);

        useEffect(() => {
          if (onSolve) {
            onSolve(() => {
              // Solve function will be implemented in the modular component
              console.log('Solve function called');
            });
          }
        }, [onSolve]);

        useEffect(() => {
          if (onRotateFace) {
            onRotateFace((face, direction) => {
              // Rotate face function will be implemented in the modular component
              console.log('Rotate face function called:', face, direction);
            });
          }
        }, [onRotateFace]);


        return (
          <Canvas
            camera={{ position: [5, 5, 5], fov: 50 }}
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
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
              enableRotate={true} 
            />
            <Environment preset="sunset" />
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            <ModularRubiksCube
              cubeState={cubeState}
              isAnimating={isAnimating}
              rotatingFace={rotatingFace}
              rotationProgress={rotationProgress}
              setCubeState={setCubeState}
              setIsAnimating={setIsAnimating}
              setRotatingFace={setRotatingFace}
              setRotationProgress={setRotationProgress}
              moveHistory={moveHistory}
              setMoveHistory={setMoveHistory}
              hasRotated={hasRotated}
              setHasRotated={setHasRotated}
              isRotating={isRotating}
              autoRotate={autoRotate}
              onResetRef={resetRef}
              onGroupRef={onGroupRef}
            />
            
            <CameraReset />
          </Canvas>
        );
      }}
    </CubeStateProvider>
  );
}

export default RubiksCubeWrapper;
