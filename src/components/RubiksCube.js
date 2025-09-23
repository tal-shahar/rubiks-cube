import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { CubeStateProvider } from './cube/state/CubeStateProvider';
import { RubiksCube as ModularRubiksCube } from './cube/RubiksCube';

// Main Rubik's Cube component that uses the modular implementation
export function RubiksCube({ isRotating, autoRotate = false, onScramble, onReset, onSolve, onRotateFace, onCubeStateChange, highlightedPieces = [] }) {
  
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

        useEffect(() => {
          if (onReset) {
            onReset(() => {
              // Reset function will be implemented in the modular component
              console.log('Reset function called');
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
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
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
              highlightedPieces={highlightedPieces}
            />
          </Canvas>
        );
      }}
    </CubeStateProvider>
  );
}

export default RubiksCube;
