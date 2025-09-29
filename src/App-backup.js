import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { RubiksCube } from './components/cube';
import Controls from './components/Controls';
import InfoPanel from './components/InfoPanel';
import KeybindingModal from './components/KeybindingModal';
// import ErrorBoundary from './components/ErrorBoundary';
import { useKeybindings } from './hooks/useKeybindings';
import { useDeviceDetection } from './hooks/useDeviceDetection';
// import { initializeVersionCheck } from './utils/version';
// import { grantRotationPermissions } from './utils/rotationConfig'; // Uncomment to enable rotation management

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 10px;
    justify-content: center;
    align-items: center;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
  color: white;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
    width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
  max-width: 1200px;
  
  @media (max-width: 768px) {
    gap: 20px;
    padding: 20px;
    width: 100%;
    justify-content: center;
  }
`;

const CubeContainer = styled.div`
  width: 100%;
  height: 600px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const DualCubeContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
  margin: 20px 0;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    margin: 0;
    width: 100%;
  }
`;

const CubeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
    padding: 15px;
  }
`;

const CubeTitle = styled.h3`
  color: #fff;
  font-size: 16px;
  margin: 0 0 10px 0;
  text-align: center;
`;

const CubeCanvas = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 280px;
    height: 280px;
  }
  
  @media (max-width: 480px) {
    width: 250px;
    height: 250px;
  }
`;

function App() {
  const [isRotating, setIsRotating] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [currentScramble, setCurrentScramble] = useState('');
  const [cubeState, setCubeState] = useState(null);
  const [cubeIsAnimating, setCubeIsAnimating] = useState(false);
  const [leftCubeState, setLeftCubeState] = useState(null);
  const [rightCubeState, setRightCubeState] = useState(null);
  const [leftMoveHistory, setLeftMoveHistory] = useState([]);
  const [rightMoveHistory, setRightMoveHistory] = useState([]);
  const leftSolveRef = useRef();
  const rightSolveRef = useRef();
  const leftScrambleRef = useRef();
  const rightScrambleRef = useRef();
  const leftResetRef = useRef();
  const rightResetRef = useRef();
  const solveRef = useRef();
  const leftRotateFaceRef = useRef();
  const rightRotateFaceRef = useRef();
  const leftCameraResetRef = useRef();
  const rightCameraResetRef = useRef();
  const leftGroupRef = useRef();
  const rightGroupRef = useRef();

  // Initialize version checking and cache management
  useEffect(() => {
    // initializeVersionCheck(); // Temporarily disabled to prevent reload loops
    
    // To enable rotation management permissions, uncomment the following:
    // grantRotationPermissions();
  }, []);

  // Initialize keybinding system
  const {
    keybindings,
    userKeybindings,
    hasPermission,
    isLoading,
    requestPermissionOnOpen,
    saveKeybindings,
    resetKeybindings,
    handleKeyPress
  } = useKeybindings();

  // Keybinding modal state
  const [showKeybindingModal, setShowKeybindingModal] = useState(false);
  
  // Device detection
  const { isKeyboardDevice } = useDeviceDetection();

  const handleOpenKeybindingModal = async () => {
    // Request permission before opening the modal
    if (requestPermissionOnOpen) {
      await requestPermissionOnOpen();
    }
    setShowKeybindingModal(true);
  };

  const handleCloseKeybindingModal = () => {
    setShowKeybindingModal(false);
  };

  const handleKeybindingSave = (newKeybindings) => {
    if (saveKeybindings) {
      saveKeybindings(newKeybindings);
    }
  };

  const handleKeybindingReset = () => {
    if (resetKeybindings) {
      resetKeybindings();
    }
  };

  const handleScramble = () => {
    if (cubeIsAnimating) return;
    
    setIsScrambling(true);
    setCurrentScramble('Generating scramble sequence...');
    
    // Scramble both cubes simultaneously
    if (leftScrambleRef.current) {
      leftScrambleRef.current();
    }
    
    if (rightScrambleRef.current) {
      rightScrambleRef.current();
    }
    
    // Update scramble display after a delay
    setTimeout(() => {
      setCurrentScramble('F B R L U D F\' B\' R\' L\' U\' D\' F2 B2 R2 L2 U2 D2');
      setTimeout(() => {
        setIsScrambling(false);
      }, 7000);
    }, 1000);
  };

  const handleReset = () => {
    if (cubeIsAnimating) return;
    
    setCurrentScramble('');
    
    // Reset both cubes simultaneously
    if (leftResetRef.current) {
      leftResetRef.current();
    }
    
    if (rightResetRef.current) {
      rightResetRef.current();
    }
    
    // Also reset camera position for both cubes
    if (leftCameraResetRef.current) {
      leftCameraResetRef.current();
    }
    if (rightCameraResetRef.current) {
      rightCameraResetRef.current();
    }
    
    // Also reset cube rotation/orientation with a small delay
    setTimeout(() => {
      if (leftGroupRef.current && leftGroupRef.current.rotation) {
        leftGroupRef.current.rotation.set(0, 0, 0);
      }
      if (rightGroupRef.current && rightGroupRef.current.rotation) {
        rightGroupRef.current.rotation.set(0, 0, 0);
      }
    }, 150); // Slightly longer delay to ensure camera reset completes first
  };

  const handleSolve = useCallback(() => {
    if (cubeIsAnimating) return;
    
    setCurrentScramble('Solving cube...');
    
    // Left cube: Simple revert solver (will use move history internally)
    if (leftSolveRef.current) {
      leftSolveRef.current(); // No parameters - will use internal move history
    }
    
    // Right cube: Advanced solver  
    if (rightSolveRef.current) {
      rightSolveRef.current(); // No parameters - will use advanced solver internally
    }
  }, [cubeIsAnimating]);


  const handleRotateFace = (face, direction, cubeId = 'left') => {
    const rotateFaceRef = cubeId === 'left' ? leftRotateFaceRef : rightRotateFaceRef;
    if (rotateFaceRef.current) {
      try {
        rotateFaceRef.current(face, direction);
      } catch (error) {
        // Silently handle errors in production
      }
    }
  };

  // Add keyboard event handling with keybinding support
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Use the keybinding system to handle key presses
      handleKeyPress(event, handleRotateFace);
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyPress]);



  return (
    <AppContainer>
      <Header>
        <Title>Rubik's Cube</Title>
        <Subtitle>Interactive 3D Cube with Three.js & React</Subtitle>
      </Header>
      
      <MainContent>
        <DualCubeContainer>
          <CubeWrapper>
            <CubeTitle>Simple Revert Solver</CubeTitle>
            <CubeCanvas>
              <CubeContainer style={{ width: '300px', height: '300px' }}>
                <RubiksCube 
                  isRotating={isRotating}
                  autoRotate={autoRotate}
                  onScramble={(scrambleFn) => { leftScrambleRef.current = scrambleFn; }}
                  onReset={(resetFn) => { leftResetRef.current = resetFn; }}
                  onSolveRef={leftSolveRef}
                  onRotateFace={(rotateFaceFn) => { leftRotateFaceRef.current = rotateFaceFn; }}
                  onCameraReset={(cameraResetFn) => { leftCameraResetRef.current = cameraResetFn; }}
                  onGroupRef={(groupRefFn) => { leftGroupRef.current = groupRefFn; }}
                  onCubeStateChange={setLeftCubeState}
                  onAnimationStateChange={setCubeIsAnimating}
                  cubeId="left"
                  onMoveHistoryChange={setLeftMoveHistory}
                />
              </CubeContainer>
            </CubeCanvas>
          </CubeWrapper>
          
          <CubeWrapper>
            <CubeTitle>Advanced Kociemba Solver</CubeTitle>
            <CubeCanvas>
              <CubeContainer style={{ width: '300px', height: '300px' }}>
                <RubiksCube 
                  isRotating={isRotating}
                  autoRotate={autoRotate}
                  onScramble={(scrambleFn) => { rightScrambleRef.current = scrambleFn; }}
                  onReset={(resetFn) => { rightResetRef.current = resetFn; }}
                  onSolveRef={rightSolveRef}
                  onRotateFace={(rotateFaceFn) => { rightRotateFaceRef.current = rotateFaceFn; }}
                  onCameraReset={(cameraResetFn) => { rightCameraResetRef.current = cameraResetFn; }}
                  onGroupRef={(groupRefFn) => { rightGroupRef.current = groupRefFn; }}
                  onCubeStateChange={setRightCubeState}
                  onAnimationStateChange={setCubeIsAnimating}
                  cubeId="right"
                  onMoveHistoryChange={setRightMoveHistory}
                />
              </CubeContainer>
            </CubeCanvas>
          </CubeWrapper>
        </DualCubeContainer>
        
        <Controls 
          isRotating={isRotating}
          setIsRotating={setIsRotating}
          autoRotate={autoRotate}
          setAutoRotate={setAutoRotate}
          onScramble={handleScramble}
          onReset={handleReset}
          onSolve={handleSolve}
          leftSolveRef={leftSolveRef}
          rightSolveRef={rightSolveRef}
          onRotateFace={handleRotateFace}
          cubeState={leftCubeState}
          rightCubeState={rightCubeState}
          leftMoveHistory={leftMoveHistory}
          rightMoveHistory={rightMoveHistory}
          cubeIsAnimating={cubeIsAnimating}
          onOpenKeybindingModal={handleOpenKeybindingModal}
        />
        
        <InfoPanel 
          currentScramble={currentScramble}
          isScrambling={isScrambling}
        />
      </MainContent>

      {isKeyboardDevice && (
        <KeybindingModal
          isOpen={showKeybindingModal}
          onClose={handleCloseKeybindingModal}
          keybindings={userKeybindings}
          onSaveKeybindings={handleKeybindingSave}
          onResetKeybindings={handleKeybindingReset}
        />
      )}
    </AppContainer>
  );
}

export default App; 