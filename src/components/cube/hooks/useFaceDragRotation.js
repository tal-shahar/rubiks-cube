import { useCallback, useState, useRef } from 'react';
import * as THREE from 'three';

// Custom hook for face-based drag rotation (like Rubik's Cube face buttons)
export function useFaceDragRotation() {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragFace, setDragFace] = useState(null);
  const dragThreshold = useRef(0.01); // Minimum drag distance to trigger rotation (reduced from 0.1)

  // Determine which face of the cube is being clicked based on 3D position
  const getFaceFromIntersection = useCallback((intersection) => {
    if (!intersection || !intersection.face) return null;

    const { face } = intersection;
    const normal = face.normal.clone().transformDirection(intersection.object.matrixWorld);
    
    // Determine face based on normal direction (assuming cube is at origin)
    const absX = Math.abs(normal.x);
    const absY = Math.abs(normal.y);
    const absZ = Math.abs(normal.z);

    if (absX > absY && absX > absZ) {
      return normal.x > 0 ? 'R' : 'L'; // Right or Left
    } else if (absY > absX && absY > absZ) {
      return normal.y > 0 ? 'U' : 'D'; // Up or Down
    } else if (absZ > absX && absZ > absY) {
      return normal.z > 0 ? 'F' : 'B'; // Front or Back
    }

    return null;
  }, []);

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
    
    return {
      x: ((clientX - rect.left) / rect.width) * 2 - 1,
      y: -((clientY - rect.top) / rect.height) * 2 + 1
    };
  }, []);

  // Determine if drag started from top or bottom row based on initial position
  const isTopRow = useCallback((position) => {
    const { y } = position;
    
    // Top row: y > 0, Bottom row: y < 0
    // Using a small threshold to handle edge cases
    return y > 0.1;
  }, []);

  // Determine rotation direction based on drag vector relative to face and starting corner
  const getRotationDirection = useCallback((dragStart, dragEnd, face) => {
    const deltaX = dragEnd.x - dragStart.x;
    const deltaY = dragEnd.y - dragStart.y;
    const dragMagnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Determine if drag started from top or bottom row
    const fromTopRow = isTopRow(dragStart);
    
    console.log('🎯 getRotationDirection:', { 
      deltaX, 
      deltaY, 
      dragMagnitude, 
      threshold: dragThreshold.current,
      face,
      fromTopRow,
      dragStart,
      dragEnd
    });
    
    // Need minimum drag distance to trigger rotation
    if (dragMagnitude < dragThreshold.current) {
      console.log('🎯 Drag magnitude too small, returning null');
      return null;
    }

    // Determine direction based on face and drag vector
    // This mapping depends on how the cube is oriented and which face is being dragged
    switch (face) {
      case 'F': // Front face
        // Fixed logic for top row, bottom row acts opposite
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (fromTopRow) {
            // Top row: drag left → rotate left (counterclockwise), drag right → rotate right (clockwise)
            return deltaX > 0 ? 'clockwise' : 'counterclockwise';
          } else {
            // Bottom row: opposite of top row - drag left → rotate right (clockwise)
            return deltaX > 0 ? 'counterclockwise' : 'clockwise';
          }
        }
        // For vertical drags, use the same logic
        if (fromTopRow) {
          return deltaX > 0 ? 'clockwise' : 'counterclockwise';
        } else {
          return deltaX > 0 ? 'counterclockwise' : 'clockwise';
        }
        
      case 'B': // Back face (opposite logic from front)
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (fromTopRow) {
            // Top row: original behavior - opposite of front face
            return deltaX > 0 ? 'clockwise' : 'counterclockwise';
          } else {
            // Bottom row: opposite of top row
            return deltaX > 0 ? 'counterclockwise' : 'clockwise';
          }
        }
        if (fromTopRow) {
          return deltaX > 0 ? 'clockwise' : 'counterclockwise';
        } else {
          return deltaX > 0 ? 'counterclockwise' : 'clockwise';
        }
        
      case 'R': // Right face
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          if (fromTopRow) {
            // Top row: original behavior
            return deltaY > 0 ? 'counterclockwise' : 'clockwise';
          } else {
            // Bottom row: opposite of top row
            return deltaY > 0 ? 'clockwise' : 'counterclockwise';
          }
        }
        if (fromTopRow) {
          return deltaY > 0 ? 'counterclockwise' : 'clockwise';
        } else {
          return deltaY > 0 ? 'clockwise' : 'counterclockwise';
        }
        
      case 'L': // Left face (opposite logic from right)
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          if (fromTopRow) {
            // Top row: original behavior - opposite of right face
            return deltaY > 0 ? 'clockwise' : 'counterclockwise';
          } else {
            // Bottom row: opposite of top row
            return deltaY > 0 ? 'counterclockwise' : 'clockwise';
          }
        }
        if (fromTopRow) {
          return deltaY > 0 ? 'clockwise' : 'counterclockwise';
        } else {
          return deltaY > 0 ? 'counterclockwise' : 'clockwise';
        }
        
      case 'U': // Up face
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (fromTopRow) {
            // Top row: drag left → rotate left (counterclockwise), drag right → rotate right (clockwise)
            return deltaX > 0 ? 'clockwise' : 'counterclockwise';
          } else {
            // Bottom row: opposite of top row
            return deltaX > 0 ? 'counterclockwise' : 'clockwise';
          }
        }
        if (fromTopRow) {
          return deltaX > 0 ? 'clockwise' : 'counterclockwise';
        } else {
          return deltaX > 0 ? 'counterclockwise' : 'clockwise';
        }
        
      case 'D': // Down face (opposite logic from up)
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (fromTopRow) {
            // Top row: original behavior - opposite of up face
            return deltaX > 0 ? 'clockwise' : 'counterclockwise';
          } else {
            // Bottom row: opposite of top row
            return deltaX > 0 ? 'counterclockwise' : 'clockwise';
          }
        }
        if (fromTopRow) {
          return deltaX > 0 ? 'clockwise' : 'counterclockwise';
        } else {
          return deltaX > 0 ? 'counterclockwise' : 'clockwise';
        }
        
      default:
        return null;
    }
  }, []);

  // Handle mouse down - start face drag
  const handleMouseDown = useCallback((event, canvas, clickedFace = null) => {
    if (event.button !== 0) return; // Only left mouse button
    
    const mousePos = getNormalizedMousePosition(event, canvas);
    // Use the clickedFace parameter if provided, otherwise try to detect from intersection
    const face = clickedFace || getFaceFromIntersection(event);
    
    console.log('🎯 Face drag start:', { face, mousePos, clickedFace });
    
    setDragStart(mousePos);
    setDragFace(face);
    setIsDragging(true);
    
    // Change cursor to indicate dragging
    if (canvas) {
      canvas.style.cursor = 'grabbing';
    }
  }, [getNormalizedMousePosition, getFaceFromIntersection]);

  // Handle mouse move - track drag
  const handleMouseMove = useCallback((event, canvas) => {
    if (!isDragging || !dragStart || !dragFace) return;
    
    // Just track the drag, we'll apply rotation on release
    // This prevents accidental rotations during drag
  }, [isDragging, dragStart, dragFace]);

  // Handle mouse up - apply face rotation
  const handleMouseUp = useCallback((event, canvas, onFaceRotate) => {
    console.log('🎯 handleMouseUp called:', { isDragging, dragStart: !!dragStart, dragFace });
    
    if (!isDragging || !dragStart || !dragFace) {
      console.log('🎯 Early return - no active drag');
      setIsDragging(false);
      setDragStart(null);
      setDragFace(null);
      return;
    }
    
    const mousePos = getNormalizedMousePosition(event, canvas);
    const direction = getRotationDirection(dragStart, mousePos, dragFace);
    
    console.log('🎯 Face drag end:', { 
      face: dragFace, 
      direction, 
      dragStart, 
      mousePos,
      deltaX: mousePos.x - dragStart.x,
      deltaY: mousePos.y - dragStart.y
    });
    
    // Reset drag state IMMEDIATELY to prevent multiple calls
    setIsDragging(false);
    setDragStart(null);
    setDragFace(null);
    
    // Apply face rotation if we have a valid direction
    if (direction && onFaceRotate) {
      console.log(`🎯 Applying face rotation: ${dragFace} ${direction}`);
      try {
        onFaceRotate(dragFace, direction);
        console.log(`🎯 Face rotation applied successfully`);
      } catch (error) {
        console.error(`🎯 Error applying face rotation:`, error);
      }
    } else {
      console.log(`🎯 No rotation applied - direction: ${direction}, onFaceRotate: ${!!onFaceRotate}`);
    }
    
    // Reset cursor
    if (canvas) {
      canvas.style.cursor = 'grab';
    }
  }, [isDragging, dragStart, dragFace, getNormalizedMousePosition, getRotationDirection]);

  // Handle mouse leave - cancel drag
  const handleMouseLeave = useCallback((event, canvas) => {
    setIsDragging(false);
    setDragStart(null);
    setDragFace(null);
    
    // Reset cursor
    if (canvas) {
      canvas.style.cursor = 'default';
    }
  }, []);

  return {
    isDragging,
    dragFace,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave
  };
}
