import React, { useRef, useState, useEffect, useCallback } from 'react';

export function VirtualJoystick({ onJoystickMove, onJoystickEnd, disabled = false }) {
  const joystickRef = useRef(null);
  const knobRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const joystickSize = 100; // Size of the joystick container (smaller for overlay)
  const knobSize = 35; // Size of the movable knob
  const maxDistance = (joystickSize - knobSize) / 2; // Maximum distance knob can move

  // Handle mouse/touch start
  const handleStart = useCallback((clientX, clientY) => {
    if (disabled) return;
    
    setIsDragging(true);
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setStartPosition({ x: centerX, y: centerY });
    
    // Calculate initial knob position
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance <= maxDistance) {
      setKnobPosition({ x: deltaX, y: deltaY });
    } else {
      // Clamp to max distance
      const angle = Math.atan2(deltaY, deltaX);
      setKnobPosition({
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance
      });
    }
  }, [disabled, maxDistance]);

  // Handle mouse/touch move
  const handleMove = useCallback((clientX, clientY) => {
    if (!isDragging || disabled) return;
    
    const deltaX = clientX - startPosition.x;
    const deltaY = clientY - startPosition.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    let newX = deltaX;
    let newY = deltaY;
    
    // Clamp to joystick bounds
    if (distance > maxDistance) {
      const angle = Math.atan2(deltaY, deltaX);
      newX = Math.cos(angle) * maxDistance;
      newY = Math.sin(angle) * maxDistance;
    }
    
    setKnobPosition({ x: newX, y: newY });
    
    // Calculate normalized values (-1 to 1)
    const normalizedX = newX / maxDistance;
    const normalizedY = -newY / maxDistance; // Invert Y for intuitive control
    
    // Call the callback with joystick values
    if (onJoystickMove) {
      onJoystickMove({ x: normalizedX, y: normalizedY });
    }
  }, [isDragging, disabled, startPosition, maxDistance, onJoystickMove]);

  // Handle mouse/touch end
  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    setKnobPosition({ x: 0, y: 0 });
    
    if (onJoystickEnd) {
      onJoystickEnd();
    }
  }, [isDragging, onJoystickEnd]);

  // Mouse events
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const handleMouseMove = useCallback((e) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Touch events
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    handleEnd();
  }, [handleEnd]);

  // Global mouse/touch event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const joystickStyle = {
    width: joystickSize,
    height: joystickSize,
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.6)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : (isDragging ? 'grabbing' : 'grab'),
    opacity: disabled ? 0.3 : 0.9,
    userSelect: 'none',
    touchAction: 'none',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
  };

  const knobStyle = {
    width: knobSize,
    height: knobSize,
    borderRadius: '50%',
    backgroundColor: isDragging ? '#4ecdc4' : '#ff6b6b',
    border: '2px solid rgba(255, 255, 255, 0.8)',
    position: 'absolute',
    transform: `translate(${knobPosition.x}px, ${knobPosition.y}px)`,
    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
    cursor: disabled ? 'not-allowed' : (isDragging ? 'grabbing' : 'grab'),
    boxShadow: isDragging ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.3)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div
        ref={joystickRef}
        style={joystickStyle}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div ref={knobRef} style={knobStyle} />
      </div>
      <div style={{ 
        fontSize: '10px', 
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        fontWeight: '600',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
        marginTop: '4px'
      }}>
        {disabled ? 'Disabled' : 'Rotate Cube'}
      </div>
    </div>
  );
}
