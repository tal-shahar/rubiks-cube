import React, { useState } from 'react';
import styled from 'styled-components';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

const ControlsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.$active ? 'white' : '#333'};
  border: 2px solid ${props => props.$active ? 'transparent' : 'rgba(255, 255, 255, 0.3)'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    background: ${props => props.$active 
      ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' 
      : 'rgba(255, 255, 255, 0.3)'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ToggleButton = styled(Button)`
  min-width: 120px;
`;

const ActionButton = styled(Button)`
  min-width: 100px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:hover {
    background: ${props => props.disabled 
      ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' 
      : 'linear-gradient(135deg, #ff5252 0%, #e74c3c 100%)'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const SettingsButton = styled(Button)`
  min-width: 120px;
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #8e24aa 0%, #6a1b9a 100%);
  }
  
  /* Hide on mobile devices */
  @media (max-width: 768px) {
    display: none;
  }
  
  /* Hide on touch devices (phones/tablets) */
  @media (hover: none) and (pointer: coarse) {
    display: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const FaceButton = styled(Button)`
  min-width: 60px;
  padding: 8px 12px;
  font-size: 12px;
  background: ${props => props.$faceColor || 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'};
  color: white;
  
  &:hover {
    background: ${props => props.$hoverColor || 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)'};
  }
`;

// Individual face button components with specific colors
const FButton = styled(FaceButton)`
  background: linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%);
  color: #333;
  border: 2px solid #DDD;
  
  &:hover {
    background: linear-gradient(135deg, #F0F0F0 0%, #E0E0E0 100%);
  }
`;

const BButton = styled(FaceButton)`
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #333;
  
  &:hover {
    background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
  }
`;

const RButton = styled(FaceButton)`
  background: linear-gradient(135deg, #DC143C 0%, #B22222 100%);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #B22222 0%, #8B0000 100%);
  }
`;

const LButton = styled(FaceButton)`
  background: linear-gradient(135deg, #FF8C00 0%, #FF7F00 100%);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #FF7F00 0%, #FF6600 100%);
  }
`;

const UButton = styled(FaceButton)`
  background: linear-gradient(135deg, #0000FF 0%, #0000CD 100%);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #0000CD 0%, #000080 100%);
  }
`;

const DButton = styled(FaceButton)`
  background: linear-gradient(135deg, #00FF00 0%, #00CC00 100%);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #00CC00 0%, #009900 100%);
  }
`;

// Middle rotation buttons
const MButton = styled(FaceButton)`
  background: linear-gradient(135deg, #800080 0%, #660066 100%);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #660066 0%, #4D004D 100%);
  }
`;

const EButton = styled(FaceButton)`
  background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #FF1493 0%, #DC143C 100%);
  }
`;

const SButton = styled(FaceButton)`
  background: linear-gradient(135deg, #00CED1 0%, #008B8B 100%);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #008B8B 0%, #006666 100%);
  }
`;

const FaceButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-width: 200px;
  margin: 0 auto;
`;

const Label = styled.h3`
  color: white;
  font-weight: 600;
  font-size: 16px;
  margin: 0 0 8px 0;
  text-align: center;
`;

function Controls({ 
  isRotating, 
  setIsRotating, 
  autoRotate, 
  setAutoRotate,
  onScramble,
  onReset,
  onSolve,
  onRotateFace,
  cubeState,
  onOpenKeybindingModal
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { isKeyboardDevice } = useDeviceDetection();

  const handleReset = () => {
    if (isAnimating || !onReset) return;
    setIsAnimating(true);
    console.log('Reset cube');
    onReset();
    // Simulate animation delay
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const handleScramble = () => {
    if (isAnimating || !onScramble) return;
    setIsAnimating(true);
    console.log('Scramble cube');
    onScramble();
    // Simulate animation delay
    setTimeout(() => setIsAnimating(false), 8000); // Longer delay for scramble
  };

  const handleSolve = () => {
    if (isAnimating || !onSolve) return;
    setIsAnimating(true);
    console.log('Solve cube');
    onSolve(); // Use the animated solve function
    // Simulate animation delay
    setTimeout(() => setIsAnimating(false), 10000); // Longer delay for solve animation
  };

  const handleFaceRotation = (face, direction) => {
    // console.log(`🔵 handleFaceRotation called: ${face} ${direction}`);
    // console.log(`🔵 isAnimating: ${isAnimating}`);
    // console.log(`🔵 onRotateFace exists: ${!!onRotateFace}`);
    
    if (isAnimating) {
      // console.log(`🔵 BLOCKED: Animation in progress`);
      return;
    }
    
    if (!onRotateFace) {
      // console.log(`🔵 BLOCKED: onRotateFace function not available`);
      return;
    }
    
    // console.log(`🔵 Calling onRotateFace: ${face} ${direction}`);
    onRotateFace(face, direction);
  };





  return (
    <ControlsContainer>

      <ButtonGroup>
        <Label>Face Rotations</Label>
        <FaceButtonGroup>
          <RButton onClick={() => handleFaceRotation('R', 'clockwise')}>R</RButton>
          <FButton onClick={() => handleFaceRotation('F', 'clockwise')}>F</FButton>
          <BButton onClick={() => handleFaceRotation('B', 'clockwise')}>B</BButton>
          <LButton onClick={() => handleFaceRotation('L', 'clockwise')}>L</LButton>
          <UButton onClick={() => handleFaceRotation('U', 'clockwise')}>U</UButton>
          <DButton onClick={() => handleFaceRotation('D', 'clockwise')}>D</DButton>
        </FaceButtonGroup>
      </ButtonGroup>

      <ButtonGroup>
        <Label>Counter-Clockwise</Label>
        <FaceButtonGroup>
          <RButton onClick={() => handleFaceRotation('R', 'counterclockwise')}>R'</RButton>
          <FButton onClick={() => handleFaceRotation('F', 'counterclockwise')}>F'</FButton>
          <BButton onClick={() => handleFaceRotation('B', 'counterclockwise')}>B'</BButton>
          <LButton onClick={() => handleFaceRotation('L', 'counterclockwise')}>L'</LButton>
          <UButton onClick={() => handleFaceRotation('U', 'counterclockwise')}>U'</UButton>
          <DButton onClick={() => handleFaceRotation('D', 'counterclockwise')}>D'</DButton>
        </FaceButtonGroup>
      </ButtonGroup>

      <ButtonGroup>
        <Label>Middle Rotations</Label>
        <FaceButtonGroup>
          <MButton onClick={() => handleFaceRotation('M', 'clockwise')}>M</MButton>
          <EButton onClick={() => handleFaceRotation('E', 'clockwise')}>E</EButton>
          <SButton onClick={() => handleFaceRotation('S', 'clockwise')}>S</SButton>
        </FaceButtonGroup>
      </ButtonGroup>

      <ButtonGroup>
        <Label>Middle Counter-Clockwise</Label>
        <FaceButtonGroup>
          <MButton onClick={() => handleFaceRotation('M', 'counterclockwise')}>M'</MButton>
          <EButton onClick={() => handleFaceRotation('E', 'counterclockwise')}>E'</EButton>
          <SButton onClick={() => handleFaceRotation('S', 'counterclockwise')}>S'</SButton>
        </FaceButtonGroup>
      </ButtonGroup>

      <ButtonGroup>
        <ActionButton 
          onClick={handleReset}
          disabled={isAnimating}
        >
          {isAnimating ? 'Resetting...' : 'Reset'}
        </ActionButton>
        <ActionButton 
          onClick={handleScramble}
          disabled={isAnimating}
        >
          {isAnimating ? 'Scrambling...' : 'Scramble'}
        </ActionButton>
        <ActionButton 
          onClick={handleSolve}
          disabled={isAnimating}
        >
          {isAnimating ? 'Solving...' : 'Solve'}
        </ActionButton>
      </ButtonGroup>

      <ButtonGroup>
        <ToggleButton
          $active={autoRotate}
          onClick={() => setAutoRotate(!autoRotate)}
        >
          Auto Rotate: {autoRotate ? 'ON' : 'OFF'}
        </ToggleButton>
        <ToggleButton
          $active={isRotating}
          onClick={() => setIsRotating(!isRotating)}
        >
          Manual Rotate: {isRotating ? 'ON' : 'OFF'}
        </ToggleButton>
      </ButtonGroup>

      {isKeyboardDevice && (
        <ButtonGroup>
          <SettingsButton 
            onClick={onOpenKeybindingModal}
          >
            ⚙️ Customize Keys
          </SettingsButton>
        </ButtonGroup>
      )}
    </ControlsContainer>
  );
}

export default Controls; 