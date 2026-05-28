import { useState, useEffect, useRef } from 'react';

export const useWebGLLoading = () => {
  const [isWebGLReady, setIsWebGLReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const startTimeRef = useRef(Date.now());
  const checkIntervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const checkWebGLReady = () => {
      // Check for Three.js canvas
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;

      // Check WebGL context
      const gl = canvas.getContext('webgl') || 
                 canvas.getContext('webgl2') || 
                 canvas.getContext('experimental-webgl');
      
      if (!gl) return false;

      // Check if canvas has been rendered (has content)
      const hasContent = canvas.width > 0 && canvas.height > 0;
      
      // Check if Three.js scene is ready by looking for WebGL programs
      const hasWebGLPrograms = gl.getParameter(gl.MAX_VERTEX_ATTRIBS) > 0;
      
      return hasContent && hasWebGLPrograms;
    };

    const startChecking = () => {
      const checkAndSetReady = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const minLoadingTime = 800; // Minimum 800ms loading time for visual feedback
        
        if (checkWebGLReady() && elapsed >= minLoadingTime) {
          console.log(`✅ WebGL is ready after ${elapsed}ms`);
          setIsWebGLReady(true);
          setIsLoading(false);
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
          }
          return true;
        }
        return false;
      };

      // Check immediately
      if (checkAndSetReady()) {
        return;
      }

      // Check periodically
      checkIntervalRef.current = setInterval(() => {
        checkAndSetReady();
      }, 50); // Check every 50ms

      // Fallback timeout
      timeoutRef.current = setTimeout(() => {
        console.log('⚠️ WebGL loading timeout, showing cube anyway');
        setIsWebGLReady(true);
        setIsLoading(false);
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
      }, 3000); // 3 second timeout
    };

    // Start checking after a small delay to allow DOM to settle
    const startTimer = setTimeout(startChecking, 100);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearTimeout(startTimer);
    };
  }, []);

  return { isWebGLReady, isLoading };
};
