import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { RubiksCube } from './components/cube';
import Controls from './components/Controls';
import InfoPanel from './components/InfoPanel';
import KeybindingModal from './components/KeybindingModal';
import { useKeybindings } from './hooks/useKeybindings';
import { useDeviceDetection } from './hooks/useDeviceDetection';

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

function App() {
  const [isRotating, setIsRotating] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [currentScramble, setCurrentScramble] = useState('');
  const [cubeState, setCubeState] = useState(null);
  const scrambleRef = useRef();
  const resetRef = useRef();
  const solveRef = useRef();
  const rotateFaceRef = useRef();
  const cameraResetRef = useRef();
  const groupRef = useRef();

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
    if (scrambleRef.current) {
      setIsScrambling(true);
      setCurrentScramble('Generating scramble sequence...');
      scrambleRef.current();
      
      // Update scramble display after a delay
      setTimeout(() => {
        setCurrentScramble('F B R L U D F\' B\' R\' L\' U\' D\' F2 B2 R2 L2 U2 D2');
        setTimeout(() => {
          setIsScrambling(false);
        }, 7000);
      }, 1000);
    }
  };

  const handleReset = () => {
    console.log('handleReset called');
    console.log('resetRef.current:', !!resetRef.current);
    console.log('cameraResetRef.current:', !!cameraResetRef.current);
    console.log('groupRef.current:', !!groupRef.current);
    
    if (resetRef.current) {
      setCurrentScramble('');
      resetRef.current();
      // Also reset camera position
      if (cameraResetRef.current) {
        console.log('Calling camera reset function');
        cameraResetRef.current();
      } else {
        console.log('Camera reset function not available');
      }
      // Also reset cube rotation/orientation with a small delay
      setTimeout(() => {
        if (groupRef.current && groupRef.current.rotation) {
          groupRef.current.rotation.set(0, 0, 0);
          console.log('Cube rotation reset to initial orientation');
        } else {
          console.log('Group ref not available for rotation reset');
        }
      }, 150); // Slightly longer delay to ensure camera reset completes first
    }
  };

  const handleSolve = () => {
    if (solveRef.current) {
      setCurrentScramble('Solving cube...');
      solveRef.current();
    }
  };

  const handleRotateFace = (face, direction) => {
    // console.log('🎯 handleRotateFace called with:', face, direction);
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
        <CubeContainer>
          <RubiksCube 
            isRotating={isRotating}
            autoRotate={autoRotate}
            onScramble={(scrambleFn) => { scrambleRef.current = scrambleFn; }}
            onReset={(resetFn) => { resetRef.current = resetFn; }}
            onSolve={(solveFn) => { solveRef.current = solveFn; }}
            onRotateFace={(rotateFaceFn) => { rotateFaceRef.current = rotateFaceFn; }}
            onCameraReset={(cameraResetFn) => { cameraResetRef.current = cameraResetFn; }}
            onGroupRef={(groupRefFn) => { groupRef.current = groupRefFn; }}
            onCubeStateChange={setCubeState}
          />
        </CubeContainer>
        
        <Controls 
          isRotating={isRotating}
          setIsRotating={setIsRotating}
          autoRotate={autoRotate}
          setAutoRotate={setAutoRotate}
          onScramble={handleScramble}
          onReset={handleReset}
          onSolve={handleSolve}
          onRotateFace={handleRotateFace}
          cubeState={cubeState}
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