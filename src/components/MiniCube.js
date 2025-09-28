import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function MiniCube({ onRotationChange, disabled = false, cubeState = null, mainCubeRotation = { x: 0, y: 0, z: 0 }, resetTrigger = 0 }) {
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const [miniCubeRotation, setMiniCubeRotation] = useState({ x: 0, y: 0, z: 0 });

  // Sync mini cube rotation with main cube rotation
  useEffect(() => {
    setMiniCubeRotation({
      x: mainCubeRotation.x,
      y: mainCubeRotation.y,
      z: mainCubeRotation.z
    });
  }, [mainCubeRotation]);

  // Initialize mini cube rotation to match main cube's initial state
  useEffect(() => {
    if (mainCubeRotation.x === 0 && mainCubeRotation.y === 0 && mainCubeRotation.z === 0) {
      setMiniCubeRotation({ x: 0, y: 0, z: 0 });
    }
  }, []);

  // Handle reset trigger - reset mini cube rotation when reset button is pressed
  useEffect(() => {
    if (resetTrigger > 0) {
      setMiniCubeRotation({ x: 0, y: 0, z: 0 });
      console.log('🎲 Mini cube rotation reset to initial state');
    }
  }, [resetTrigger]);

  // Helper function to get face colors - use standard Rubik's cube colors
  const getFaceColors = () => {
    // Use standard Rubik's cube colors that match the main cube
    return {
      front: '#FFFFFF',   // White
      back: '#FFD700',    // Yellow  
      right: '#DC143C',   // Red
      left: '#FF8C00',    // Orange
      top: '#0000FF',     // Blue
      bottom: '#00FF00'   // Green
    };
  };

  const faceColors = getFaceColors();

  // Handle mouse/touch start
  const handleStart = useCallback((event) => {
    if (disabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);
    
    // Set initial mouse position using ref (synchronous)
    lastMousePositionRef.current = { x: clientX - centerX, y: clientY - centerY };
    setIsDragging(true);
    
    document.body.style.cursor = 'grabbing';
  }, [disabled]);

  // Handle mouse/touch move
  const handleMove = useCallback((event, containerElement) => {
    if (!isDragging || disabled) return;
    
    event.preventDefault();
    
    if (!containerElement) return;
    
    const rect = containerElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);
    
    const deltaX = (clientX - centerX) - lastMousePositionRef.current.x;
    const deltaY = (clientY - centerY) - lastMousePositionRef.current.y;
    
    const rotationSpeed = 0.01;
    
    // Apply rotation to mini cube and main cube
    const rotationX = deltaY * rotationSpeed;
    const rotationY = deltaX * rotationSpeed;
    
    // Update mini cube rotation state
    setMiniCubeRotation(prev => ({
      x: prev.x + rotationX,
      y: prev.y + rotationY,
      z: prev.z
    }));
    
    // Send rotation data to parent (main cube)
    if (onRotationChange) {
      onRotationChange({
        x: rotationX,
        y: rotationY,
        z: 0
      });
    }
    
    lastMousePositionRef.current = { x: clientX - centerX, y: clientY - centerY };
  }, [isDragging, disabled, onRotationChange]);

  // Handle mouse/touch end
  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    document.body.style.cursor = 'default';
  }, [isDragging]);

  // Global mouse/touch event listeners
  React.useEffect(() => {
    if (isDragging) {
      const containerElement = document.querySelector('.mini-cube-container');
      
      const handleGlobalMove = (e) => {
        if (containerElement) {
          handleMove(e, containerElement);
        }
      };
      
      const handleGlobalEnd = () => handleEnd();
      
      document.addEventListener('mousemove', handleGlobalMove);
      document.addEventListener('mouseup', handleGlobalEnd);
      document.addEventListener('touchmove', handleGlobalMove, { passive: false });
      document.addEventListener('touchend', handleGlobalEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMove);
        document.removeEventListener('mouseup', handleGlobalEnd);
        document.removeEventListener('touchmove', handleGlobalMove);
        document.removeEventListener('touchend', handleGlobalEnd);
      };
    }
  }, [isDragging, handleMove, handleEnd]);

  const containerStyle = {
    width: '80px',
    height: '80px',
    position: 'relative',
    cursor: disabled ? 'not-allowed' : (isDragging ? 'grabbing' : 'grab'),
    opacity: disabled ? 0.3 : 1,
    userSelect: 'none',
    touchAction: 'none'
  };

  // Three.js Mini Cube Component
  const MiniCube3D = () => {
    const groupRef = useRef();
    
    useFrame(() => {
      if (groupRef.current) {
        groupRef.current.rotation.x = miniCubeRotation.x;
        groupRef.current.rotation.y = miniCubeRotation.y;
        groupRef.current.rotation.z = miniCubeRotation.z;
      }
    });

    return (
      <group ref={groupRef}>
        {/* Create a simple cube using Three.js BoxGeometry */}
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshLambertMaterial color="#888888" />
        </mesh>
        
        {/* Front face */}
        <mesh position={[0, 0, 1.01]}>
          <planeGeometry args={[2, 2]} />
          <meshLambertMaterial color={faceColors.front} />
        </mesh>
        
        {/* Back face */}
        <mesh position={[0, 0, -1.01]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2, 2]} />
          <meshLambertMaterial color={faceColors.back} />
        </mesh>
        
        {/* Right face */}
        <mesh position={[1.01, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[2, 2]} />
          <meshLambertMaterial color={faceColors.right} />
        </mesh>
        
        {/* Left face */}
        <mesh position={[-1.01, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[2, 2]} />
          <meshLambertMaterial color={faceColors.left} />
        </mesh>
        
        {/* Top face */}
        <mesh position={[0, 1.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2, 2]} />
          <meshLambertMaterial color={faceColors.top} />
        </mesh>
        
        {/* Bottom face */}
        <mesh position={[0, -1.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2, 2]} />
          <meshLambertMaterial color={faceColors.bottom} />
        </mesh>
      </group>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <div 
        className="mini-cube-container"
        style={{
          width: '80px',
          height: '80px',
          position: 'relative',
          cursor: disabled ? 'not-allowed' : (isDragging ? 'grabbing' : 'grab'),
          opacity: disabled ? 0.3 : 1,
          userSelect: 'none',
          touchAction: 'none'
        }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <Canvas
          camera={{ position: [2.5, 2.5, 2.5], fov: 50 }}
          style={{ width: '80px', height: '80px' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 2.5]} intensity={1} />
          <MiniCube3D />
        </Canvas>
      </div>
      
      <div style={{ 
        fontSize: '9px', 
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        fontWeight: '600',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
      }}>
        {disabled ? 'Disabled' : 'Drag to Rotate'}
      </div>
    </div>
  );
}