import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { CubeStateProvider } from './state/CubeStateProvider';
import { CubeGroup } from './components/CubeGroup';
import { useRotation } from './hooks/useRotation';
import { getOriginalColors } from './utils/colors';
import { getScrambleRotations } from '../../utils/rotationConfig';
import { advancedSolver } from '../../utils/advancedSolver';

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

// Dual cube container
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

const CubeControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
`;

const ControlButton = styled.button`
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  min-width: 80px;
  
  &:hover {
    background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #666666 0%, #555555 100%);
    color: #999999;
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StatusText = styled.div`
  color: #fff;
  font-size: 11px;
  text-align: center;
  margin-top: 5px;
  min-height: 20px;
`;

const ComparisonControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
`;

const ComparisonButton = styled.button`
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #666666 0%, #555555 100%);
    color: #999999;
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// Individual cube component
const ComparisonCube = ({ 
  title, 
  solverType, 
  onStatusChange, 
  isAnimating, 
  setIsAnimating 
}) => {
  const [cubeState, setCubeState] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [status, setStatus] = useState('Ready');
  const [isSolving, setIsSolving] = useState(false);
  
  const {
    executeScrambleWithAnimation,
    executeSolveWithAnimation,
    executeMovesWithAnimation
  } = useRotation();

  // Update parent status
  useEffect(() => {
    onStatusChange(status);
  }, [status, onStatusChange]);

  const scramble = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setStatus('Scrambling...');
    
    try {
      const moves = getScrambleRotations();
      const directions = ['clockwise', 'counterclockwise'];
      const scrambleSequence = [];
      
      // Generate 15 random moves
      for (let i = 0; i < 15; i++) {
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        scrambleSequence.push({ face: randomMove, direction: randomDirection });
      }
      
      console.log(`🎲 ${title} SCRAMBLING with sequence:`, scrambleSequence);
      
      await executeScrambleWithAnimation(scrambleSequence);
      
      // Update move history
      setMoveHistory(scrambleSequence);
      setStatus(`Scrambled (${scrambleSequence.length} moves)`);
      
    } catch (error) {
      console.error(`Scramble error for ${title}:`, error);
      setStatus('Scramble failed');
    } finally {
      setIsAnimating(false);
    }
  };

  const solve = async () => {
    if (isAnimating || isSolving) return;
    
    setIsSolving(true);
    setIsAnimating(true);
    
    try {
      let solution = [];
      
      if (solverType === 'simple') {
        // Use simple revert steps
        solution = simpleRevertSolver(moveHistory);
        setStatus(`Solving with revert steps (${solution.length} moves)...`);
        console.log(`🔄 ${title} SIMPLE SOLVER:`, solution);
      } else {
        // Use advanced solver
        setStatus('Analyzing cube...');
        const analysis = advancedSolver.analyzeComplexity(cubeState);
        console.log(`🧩 ${title} ADVANCED SOLVER analysis:`, analysis);
        
        solution = advancedSolver.solve(cubeState);
        setStatus(`Solving with ${analysis.method} (${solution.length} moves)...`);
        console.log(`🧩 ${title} ADVANCED SOLVER solution:`, solution);
      }
      
      if (solution.length === 0) {
        setStatus('Already solved!');
        return;
      }
      
      await executeSolveWithAnimation(solution);
      
      // Clear move history after solving
      setMoveHistory([]);
      setStatus(`✅ Solved! (${solution.length} moves)`);
      
    } catch (error) {
      console.error(`Solve error for ${title}:`, error);
      setStatus('Solve failed');
    } finally {
      setIsSolving(false);
      setIsAnimating(false);
    }
  };

  const reset = () => {
    if (isAnimating) return;
    
    setMoveHistory([]);
    setStatus('Reset to solved state');
    // Reset cube to solved state
    const solvedState = Array.from({ length: 27 }, (_, i) => ({
      pieceId: i,
      position: [
        (i % 3) - 1,
        Math.floor(i / 3) % 3 - 1,
        Math.floor(i / 9) - 1
      ],
      colors: getOriginalColors(i),
      rotationHistory: []
    }));
    setCubeState(solvedState);
  };

  return (
    <CubeWrapper>
      <CubeTitle>{title}</CubeTitle>
      <CubeCanvas>
        <Canvas camera={{ position: [4, 4, 4], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Environment preset="studio" />
          
          <CubeStateProvider>
            <CubeGroup />
          </CubeStateProvider>
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={8}
          />
        </Canvas>
      </CubeCanvas>
      
      <CubeControls>
        <ControlButton onClick={scramble} disabled={isAnimating}>
          Scramble
        </ControlButton>
        <ControlButton onClick={solve} disabled={isAnimating || isSolving}>
          Solve
        </ControlButton>
        <ControlButton onClick={reset} disabled={isAnimating}>
          Reset
        </ControlButton>
      </CubeControls>
      
      <StatusText>{status}</StatusText>
    </CubeWrapper>
  );
};

// Main comparison component
const CubeComparison = () => {
  const [leftStatus, setLeftStatus] = useState('Ready');
  const [rightStatus, setRightStatus] = useState('Ready');
  const [isAnimating, setIsAnimating] = useState(false);

  const scrambleBoth = () => {
    // This will be handled by individual cubes
  };

  const solveBoth = () => {
    // This will be handled by individual cubes
  };

  return (
    <div>
      <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>
        🧩 Cube Solver Comparison
      </h2>
      
      <ComparisonControls>
        <ComparisonButton onClick={scrambleBoth} disabled={isAnimating}>
          Scramble Both
        </ComparisonButton>
        <ComparisonButton onClick={solveBoth} disabled={isAnimating}>
          Solve Both
        </ComparisonButton>
      </ComparisonControls>
      
      <DualCubeContainer>
        <ComparisonCube
          title="Simple Revert Solver"
          solverType="simple"
          onStatusChange={setLeftStatus}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
        />
        
        <ComparisonCube
          title="Advanced Kociemba Solver"
          solverType="advanced"
          onStatusChange={setRightStatus}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
        />
      </DualCubeContainer>
      
      <div style={{ 
        color: '#fff', 
        textAlign: 'center', 
        marginTop: '20px',
        fontSize: '14px'
      }}>
        <div><strong>Left:</strong> {leftStatus}</div>
        <div><strong>Right:</strong> {rightStatus}</div>
      </div>
    </div>
  );
};

export default CubeComparison;
