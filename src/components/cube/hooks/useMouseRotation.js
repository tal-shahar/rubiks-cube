import { useRef, useCallback, useState } from 'react';
import * as THREE from 'three';

// Custom hook for mouse-based cube rotation
export function useMouseRotation() {
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const rotationSpeed = useRef(0.05); // Increased sensitivity (was 0.005)

  // Convert mouse coordinates to normalized device coordinates (-1 to +1)
  const getNormalizedMousePosition = useCallback((event, canvas) => {
    const rect = canvas.getBoundingClientRect();
    
    // For React Three Fiber events, try multiple ways to get coordinates
    let clientX, clientY;
    
    if (event.nativeEvent) {
      clientX = event.nativeEvent.clientX;
      clientY = event.nativeEvent.clientY;
    } else if (event.clientX !== undefined) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event.point) {
      // Use R3F point coordinates as fallback
      clientX = (event.point.x + 1) * 0.5 * rect.width + rect.left;
      clientY = (-event.point.y + 1) * 0.5 * rect.height + rect.top;
    } else {
      console.warn('🖱️ Could not get mouse coordinates from event');
      return { x: 0, y: 0 };
    }
    
    // Debug: console.log('🖱️ Raw coordinates:', { clientX, clientY, rect });
    
    return {
      x: ((clientX - rect.left) / rect.width) * 2 - 1,
      y: -((clientY - rect.top) / rect.height) * 2 + 1
    };
  }, []);

  // Add cursor styles for better UX
  const setCursorStyle = useCallback((canvas, style) => {
    if (canvas) {
      canvas.style.cursor = style;
    }
  }, []);

  // Handle mouse down - start dragging
  const handleMouseDown = useCallback((event, canvas) => {
    if (event.button !== 0) return; // Only left mouse button
    
    const mousePos = getNormalizedMousePosition(event, canvas);
    lastMousePosition.current = mousePos;
    setIsDragging(true);
    
    // Change cursor to indicate dragging
    setCursorStyle(canvas, 'grabbing');
    
    // Note: preventDefault not needed for R3F passive event listeners
  }, [getNormalizedMousePosition, setCursorStyle]);

  // Handle mouse move - update rotation
  const handleMouseMove = useCallback((event, canvas) => {
    if (!isDragging) return;

    const mousePos = getNormalizedMousePosition(event, canvas);
    const deltaX = mousePos.x - lastMousePosition.current.x;
    const deltaY = mousePos.y - lastMousePosition.current.y;

    // Update rotation based on mouse movement
    setRotation(prev => ({
      x: prev.x + deltaY * rotationSpeed.current * 10, // Vertical mouse movement rotates around X axis
      y: prev.y + deltaX * rotationSpeed.current * 10  // Horizontal mouse movement rotates around Y axis
    }));

    lastMousePosition.current = mousePos;
    
    // Note: preventDefault not needed for R3F passive event listeners
  }, [isDragging, getNormalizedMousePosition]);

  // Handle mouse up - stop dragging
  const handleMouseUp = useCallback((event, canvas) => {
    setIsDragging(false);
    
    // Reset cursor to grab
    setCursorStyle(canvas, 'grab');
    
    // Note: preventDefault not needed for R3F passive event listeners
  }, [setCursorStyle]);

  // Handle mouse leave - stop dragging when mouse leaves canvas
  const handleMouseLeave = useCallback((event, canvas) => {
    setIsDragging(false);
    
    // Reset cursor to default
    setCursorStyle(canvas, 'default');
  }, [setCursorStyle]);

  // Get the current rotation as Euler angles
  const getRotationEuler = useCallback(() => {
    return new THREE.Euler(rotation.x, rotation.y, 0, 'XYZ');
  }, [rotation]);

  // Reset rotation
  const resetRotation = useCallback(() => {
    setRotation({ x: 0, y: 0 });
  }, []);

  // Set rotation speed
  const setRotationSpeed = useCallback((speed) => {
    rotationSpeed.current = speed;
  }, []);

  return {
    isDragging,
    rotation,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    getRotationEuler,
    resetRotation,
    setRotationSpeed
  };
}
