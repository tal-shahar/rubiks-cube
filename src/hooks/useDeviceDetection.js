import { useState, useEffect } from 'react';

export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Check for touch capability
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Check for hover capability (desktop mice have hover, touch devices don't)
      const hasHover = window.matchMedia('(hover: hover)').matches;
      
      // Check for pointer precision (mice are precise, fingers are not)
      const hasPrecisePointer = window.matchMedia('(pointer: fine)').matches;
      
      // Determine device type
      const isMobileDevice = width <= 768;
      const isTabletDevice = width > 768 && width <= 1024 && hasTouch && !hasHover;
      const isDesktopDevice = width > 1024 || (hasHover && hasPrecisePointer);
      
      setIsMobile(isMobileDevice);
      setIsTablet(isTabletDevice);
      setIsDesktop(isDesktopDevice);
    };

    // Check on mount
    checkDevice();
    
    // Check on resize
    window.addEventListener('resize', checkDevice);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice: isMobile || isTablet,
    isKeyboardDevice: isDesktop
  };
};
