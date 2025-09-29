import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { RubiksCube } from './components/cube';
import Controls from './components/Controls';
import InfoPanel from './components/InfoPanel';
import KeybindingModal from './components/KeybindingModal';
import ErrorBoundary from './components/ErrorBoundary';
import { useKeybindings } from './hooks/useKeybindings';
import { useDeviceDetection } from './hooks/useDeviceDetection';
// import { initializeVersionCheck } from './utils/version';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
  color: white;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
  max-width: 1200px;
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
`;

const CubeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
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
    
    console.log('🔄 DUAL SCRAMBLE: Starting scramble on both cubes...');
    setIsScrambling(true);
    setCurrentScramble('Generating scramble sequence...');
    
    // Scramble both cubes simultaneously
    if (leftScrambleRef.current) {
      console.log('🔄 Left cube: Starting scramble');
      leftScrambleRef.current();
    } else {
      console.log('❌ Left cube: Cannot scramble - missing ref');
    }
    
    if (rightScrambleRef.current) {
      console.log('🔄 Right cube: Starting scramble');
      rightScrambleRef.current();
    } else {
      console.log('❌ Right cube: Cannot scramble - missing ref');
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
    
    console.log('🔄 DUAL RESET: Starting reset on both cubes...');
    setCurrentScramble('');
    
    // Reset both cubes simultaneously
    if (leftResetRef.current) {
      console.log('🔄 Left cube: Starting reset');
      leftResetRef.current();
    } else {
      console.log('❌ Left cube: Cannot reset - missing ref');
    }
    
    if (rightResetRef.current) {
      console.log('🔄 Right cube: Starting reset');
      rightResetRef.current();
    } else {
      console.log('❌ Right cube: Cannot reset - missing ref');
    }
    
    // Also reset camera position for both cubes
    if (leftCameraResetRef.current) {
      console.log('Calling left camera reset function');
      leftCameraResetRef.current();
    } else {
      console.log('Left camera reset function not available');
    }
    if (rightCameraResetRef.current) {
      console.log('Calling right camera reset function');
      rightCameraResetRef.current();
    } else {
      console.log('Right camera reset function not available');
    }
    
    // Also reset cube rotation/orientation with a small delay
    setTimeout(() => {
      if (leftGroupRef.current && leftGroupRef.current.rotation) {
        leftGroupRef.current.rotation.set(0, 0, 0);
        console.log('Left cube rotation reset to initial orientation');
      } else {
        console.log('Left group ref not available for rotation reset');
      }
      if (rightGroupRef.current && rightGroupRef.current.rotation) {
        rightGroupRef.current.rotation.set(0, 0, 0);
        console.log('Right cube rotation reset to initial orientation');
      } else {
        console.log('Right group ref not available for rotation reset');
      }
    }, 150); // Slightly longer delay to ensure camera reset completes first
  };

  const handleSolve = useCallback(() => {
    if (cubeIsAnimating) return;
    
    console.log('🧩 DUAL SOLVER: Starting solve on both cubes...');
    setCurrentScramble('Solving cube...');
    
    // Left cube: Simple revert solver (will use move history internally)
    if (leftSolveRef.current) {
      console.log('🔄 Left cube: Using simple revert solver');
      leftSolveRef.current(); // No parameters - will use internal move history
    } else {
      console.log('❌ Left cube: Cannot solve - missing ref');
    }
    
    // Right cube: Advanced solver  
    if (rightSolveRef.current) {
      console.log('🧩 Right cube: Using advanced Kociemba solver');
      rightSolveRef.current(); // No parameters - will use advanced solver internally
    } else {
      console.log('❌ Right cube: Cannot solve - missing ref');
    }
  }, [cubeIsAnimating]);


  const handleRotateFace = (face, direction, cubeId = 'left') => {
    // console.log('🎯 handleRotateFace called with:', face, direction, 'for cube:', cubeId);
    const rotateFaceRef = cubeId === 'left' ? leftRotateFaceRef : rightRotateFaceRef;
    // console.log('🎯 rotateFaceRef.current:', rotateFaceRef.current);
    if (rotateFaceRef.current) {
      // console.log('🎯 Calling rotateFaceRef.current with:', face, direction);
      try {
        rotateFaceRef.current(face, direction);
        // console.log('🎯 rotateFaceRef.current call completed successfully');
      } catch (error) {
        // console.log('🎯 ERROR calling rotateFaceRef.current:', error);
      }
    } else {
      // console.log('🎯 ERROR: rotateFaceRef.current is null!');
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
    // console.log('🔑 Keyboard event listener added');

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // console.log('🔑 Keyboard event listener removed');
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
        
        <ErrorBoundary>
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
        </ErrorBoundary>
        
        <ErrorBoundary>
          <InfoPanel 
            currentScramble={currentScramble}
            isScrambling={isScrambling}
          />
        </ErrorBoundary>
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