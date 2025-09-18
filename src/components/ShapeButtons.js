import React from 'react';
import styled from 'styled-components';

const ShapeButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  max-height: 400px;
  overflow-y: auto;
`;

const SectionTitle = styled.h3`
  color: white;
  text-align: center;
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ShapeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  max-width: 100%;
`;

const ShapeButton = styled.button`
  padding: 8px 12px;
  border: 2px solid ${props => props.$isIncorrect ? '#ff4757' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  background: ${props => {
    if (props.disabled) return 'rgba(100, 100, 100, 0.3)';
    if (props.$isIncorrect) return 'rgba(255, 71, 87, 0.2)';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  color: ${props => props.disabled ? '#666' : 'white'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.3)'};
    background: ${props => {
      if (props.disabled) return 'rgba(100, 100, 100, 0.3)';
      if (props.$isIncorrect) return 'rgba(255, 71, 87, 0.4)';
      return 'rgba(255, 255, 255, 0.2)';
    }};
  }
  
  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(0)'};
  }
`;

const ShapeInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const ShapeType = styled.span`
  font-size: 10px;
  font-weight: 600;
`;

const ShapeColor = styled.span`
  font-size: 9px;
  opacity: 0.8;
`;

const PieceId = styled.span`
  font-size: 8px;
  opacity: 0.6;
  margin-top: 2px;
`;

const Instructions = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  text-align: center;
  margin: 0 0 10px 0;
  line-height: 1.4;
`;

// Custom logging function that will be visible in terminal
const logToTerminal = (message, data = null) => {
  // Log to browser console with enhanced visibility
  console.log(`\n🎯 ${message}`);
  console.log('='.repeat(80));
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
  console.log('='.repeat(80) + '\n');
  
    // Show alert for immediate feedback with terminal info
    alert(`🎯 ${message}\n\nCheck the main terminal panel (left side) for detailed logs!\nThe logs appear in the terminal with [0] prefix.`);
  
  // Send to log server to print in terminal
  fetch('http://localhost:3001/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message,
      data: data
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log('✅ Log sent to terminal successfully');
  })
  .catch(error => {
    console.error('❌ Could not send log to terminal server:', error);
    console.log('💡 Make sure the log server is running with: npm run log-server');
    console.log('💡 You can also check the browser console (F12) for the logged information');
  });
};

function ShapeButtons({ isScrambling, cubeState, onShapeClick }) {
  // Helper functions for shape information
  const getShapeType = (pieceId) => {
    const shapeTypes = [
      'Square', 'Square', 'Square', 'Square', 'Square',
      'Circle', 'Circle', 'Circle', 'Circle', 'Circle',
      'Triangle', 'Triangle', 'Triangle', 'Triangle', 'Diamond',
      'Diamond', 'Diamond', 'Diamond', 'Diamond', 'Diamond',
      'Triangle', 'Triangle', 'Triangle', 'Triangle', 'Triangle', 'Triangle'
    ];
    return shapeTypes[pieceId] || 'Unknown';
  };

  const getShapeColor = (pieceId) => {
    const shapeColors = [
      'Red', 'Blue', 'Green', 'Orange', 'Purple',
      'Red', 'Blue', 'Green', 'Orange', 'Yellow',
      'Cyan', 'Magenta', 'Lime', 'Pink', 'Purple',
      'Red', 'Blue', 'Green', 'Orange', 'Purple',
      'Cyan', 'Magenta', 'Lime', 'Pink', 'Purple', 'Yellow'
    ];
    return shapeColors[pieceId] || 'Unknown';
  };

  const getExpectedPosition = (pieceId) => {
    // Map pieceId to expected solved position
    const positions = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;
          positions.push([x, y, z]);
        }
      }
    }
    return positions[pieceId];
  };

  const isPieceInCorrectPosition = (piece, pieceId) => {
    if (!piece || !piece.position) return false;
    const [x, y, z] = piece.position;
    const expectedPosition = getExpectedPosition(pieceId);
    return x === expectedPosition[0] && y === expectedPosition[1] && z === expectedPosition[2];
  };

  const handleShapeClick = (pieceId) => {
    if (isScrambling || !cubeState) return;

    // Get piece information
    let piece;
    if (Array.isArray(cubeState)) {
      // Old format - cubeState is an array
      piece = cubeState[pieceId];
    } else {
      // New format - cubeState is an enhanced object
      piece = cubeState.pieces?.[pieceId];
    }

    if (!piece) {
      console.error(`Piece ${pieceId} not found in cube state`);
      return;
    }

    const shapeType = getShapeType(pieceId);
    const shapeColor = getShapeColor(pieceId);
    const expectedPosition = getExpectedPosition(pieceId);
    const isInCorrectPosition = isPieceInCorrectPosition(piece, pieceId);

    // Create detailed piece information
    const pieceInfo = {
      pieceId,
      shapeType,
      shapeColor,
      currentPosition: piece.position,
      expectedPosition,
      isInCorrectPosition,
      colors: piece.colors,
      rotationHistory: piece.rotationHistory || [],
      timestamp: new Date().toISOString()
    };

    // Enhanced console logging that should appear in main terminal
    console.log('\n' + '='.repeat(100));
    console.log(`🎯 SHAPE BUTTON CLICKED: ${shapeColor} ${shapeType} (Piece ${pieceId})`);
    console.log(`📍 Current Position: [${piece.position.join(', ')}]`);
    console.log(`🎯 Expected Position: [${expectedPosition.join(', ')}]`);
    console.log(`✅ Is in correct position: ${isInCorrectPosition}`);
    console.log(`🎨 Colors:`, piece.colors);
    console.log(`📊 Move History: ${piece.rotationHistory.length} moves`);
    console.log('='.repeat(100) + '\n');
    
    // Force output using multiple methods to ensure visibility
    console.error(`\n🔥 SHAPE CLICK ERROR LOG: ${shapeColor} ${shapeType} (Piece ${pieceId})`);
    console.warn(`\n⚠️ SHAPE CLICK WARN: Position [${piece.position.join(', ')}] -> [${expectedPosition.join(', ')}]`);
    console.info(`\nℹ️ SHAPE CLICK INFO: Correct = ${isInCorrectPosition}`);
    
    // Try to write directly to stdout if available
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(`\n🎯 SHAPE BUTTON CLICKED: ${shapeColor} ${shapeType} (Piece ${pieceId})\n`);
      process.stdout.write(`📍 Current: [${piece.position.join(', ')}] Expected: [${expectedPosition.join(', ')}]\n`);
      process.stdout.write(`✅ Is Correct: ${isInCorrectPosition}\n\n`);
    }

    // Log to terminal with enhanced visibility
    logToTerminal(`🎯 SHAPE BUTTON CLICKED: ${shapeColor} ${shapeType} (Piece ${pieceId})`, {
      ...pieceInfo,
      summary: {
        shape: `${shapeColor} ${shapeType}`,
        pieceId: pieceId,
        currentPos: `[${piece.position.join(', ')}]`,
        expectedPos: `[${expectedPosition.join(', ')}]`,
        isCorrect: isInCorrectPosition,
        moveCount: piece.rotationHistory.length
      }
    });

    // Call parent callback if provided
    if (onShapeClick) {
      onShapeClick(pieceId, pieceInfo);
    }
  };

  // Get pieces data
  let pieces = [];
  if (Array.isArray(cubeState)) {
    // Old format - cubeState is an array
    pieces = cubeState.map((piece, index) => ({
      pieceId: index,
      position: piece.position,
      colors: piece.colors,
      rotationHistory: piece.rotationHistory || []
    }));
  } else if (cubeState?.pieces) {
    // New format - cubeState is an enhanced object
    pieces = cubeState.pieces;
  }

  return (
    <ShapeButtonsContainer>
      <SectionTitle>Identify Incorrect Shapes</SectionTitle>
      <Instructions>
        Click on any shape button to report it as being in an incorrect position after scrambling.
        Buttons are only active after scrambling is complete.
      </Instructions>
      
      <ShapeGrid>
        {Array.from({ length: 26 }, (_, pieceId) => {
          const piece = pieces[pieceId];
          const isInCorrectPosition = piece ? isPieceInCorrectPosition(piece, pieceId) : false;
          
          // All shapes are now visible, no need to skip any
          
          return (
            <ShapeButton
              key={pieceId}
              onClick={() => handleShapeClick(pieceId)}
              disabled={isScrambling}
              $isIncorrect={!isInCorrectPosition && !isScrambling}
            >
              <ShapeInfo>
                <ShapeType>{getShapeType(pieceId)}</ShapeType>
                <ShapeColor>{getShapeColor(pieceId)}</ShapeColor>
                <PieceId>#{pieceId}</PieceId>
              </ShapeInfo>
            </ShapeButton>
          );
        })}
      </ShapeGrid>
    </ShapeButtonsContainer>
  );
}

export default ShapeButtons;
