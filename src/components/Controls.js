import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { advancedSolver } from '../utils/advancedSolver';
import { isRotationEnabled, getRotationInfo } from '../utils/rotationConfig';

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
  
  &:disabled {
    background: linear-gradient(135deg, #666666 0%, #555555 100%);
    color: #999999;
    cursor: not-allowed;
    opacity: 0.5;
    
    &:hover {
      background: linear-gradient(135deg, #666666 0%, #555555 100%);
      transform: none;
    }
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

const SolverInfo = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 200px;
`;

const SolverText = styled.div`
  color: white;
  font-size: 12px;
  text-align: center;
  margin: 2px 0;
`;

const SolverMethod = styled.div`
  color: #4CAF50;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  margin: 5px 0;
`;


function Controls({ 
  isRotating, 
  setIsRotating, 
  autoRotate, 
  setAutoRotate,
  onScramble,
  onReset,
  onSolve,
  leftSolveRef, // New prop for left cube's solve function
  rightSolveRef, // New prop for right cube's solve function
  onRotateFace,
  cubeState,
  rightCubeState,
  leftMoveHistory, // New prop for left cube's move history
  rightMoveHistory, // New prop for right cube's move history
  cubeIsAnimating, // Add this prop to receive cube animation state
  onOpenKeybindingModal
}) {
  const [solverInfo, setSolverInfo] = useState({ method: 'Ready', complexity: 'Unknown' });
  const { isKeyboardDevice } = useDeviceDetection();

  // Analyze cube state when it changes
  useEffect(() => {
    if (cubeState && Array.isArray(cubeState)) {
      const complexity = advancedSolver.analyzeComplexity(cubeState);
      const isSolved = advancedSolver.isSolved(cubeState);
      
      setSolverInfo({
        method: isSolved ? 'Already Solved!' : `${complexity.difficulty} (${complexity.score}/100)`,
        complexity: complexity.difficulty,
        score: complexity.score,
        isSolved: isSolved
      });
    } else {
      setSolverInfo({ method: 'Ready', complexity: 'Unknown' });
    }
  }, [cubeState]);

  const handleReset = () => {
    if (cubeIsAnimating || !onReset) return;
    onReset();
  };

  const handleScramble = () => {
    if (cubeIsAnimating || !onScramble) return;
    onScramble();
  };

  // Simple revert steps solver (old method)
  const simpleRevertSolver = (moveHistory) => {
    if (!moveHistory || moveHistory.length === 0) {
      return [];
    }
    
    // Create reverse sequence by reversing each move
    const reverseSequence = moveHistory
      .slice()
      .reverse()
      .map(move => ({
        face: move.face,
        direction: move.direction === 'clockwise' ? 'counterclockwise' : 'clockwise'
      }));
    
    return reverseSequence;
  };

  const handleSolve = () => {
    if (cubeIsAnimating) return;
    
    // Call the parent's handleSolve function which will handle both cubes
    if (onSolve) {
      onSolve();
    }
  };

  const handleFaceRotation = (face, direction) => {
    if (cubeIsAnimating) {
      return;
    }
    
    if (!onRotateFace) {
      return;
    }
    
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
          <SButton onClick={() => handleFaceRotation('S', 'clockwise')} disabled={!isRotationEnabled('S')}>S</SButton>
        </FaceButtonGroup>
      </ButtonGroup>

      <ButtonGroup>
        <Label>Middle Counter-Clockwise</Label>
        <FaceButtonGroup>
          <MButton onClick={() => handleFaceRotation('M', 'counterclockwise')}>M'</MButton>
          <EButton onClick={() => handleFaceRotation('E', 'counterclockwise')}>E'</EButton>
          <SButton onClick={() => handleFaceRotation('S', 'counterclockwise')} disabled={!isRotationEnabled('S')}>S'</SButton>
        </FaceButtonGroup>
      </ButtonGroup>

      <ButtonGroup>
        <ActionButton 
          onClick={handleReset}
          disabled={cubeIsAnimating}
        >
          {cubeIsAnimating ? 'Resetting...' : 'Reset'}
        </ActionButton>
        <ActionButton 
          onClick={handleScramble}
          disabled={cubeIsAnimating}
        >
          {cubeIsAnimating ? 'Scrambling...' : 'Scramble'}
        </ActionButton>
        <ActionButton 
          onClick={handleSolve}
          disabled={cubeIsAnimating}
        >
          {cubeIsAnimating ? 'Solving...' : 'Solve'}
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

      <SolverInfo>
        <Label>🧩 Advanced Solver</Label>
        <SolverMethod>{solverInfo.method}</SolverMethod>
        <SolverText>
          {solverInfo.isSolved ? '✅ Cube is solved!' : `Complexity: ${solverInfo.complexity}`}
        </SolverText>
        <SolverText>
          {solverInfo.isSolved ? '' : `Score: ${solverInfo.score || 0}/100`}
        </SolverText>
      </SolverInfo>

    </ControlsContainer>
  );
}

export default Controls; 