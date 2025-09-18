import React from 'react';
import styled from 'styled-components';

const FaceButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  max-height: 400px;
  overflow-y: auto;
`;

const FaceButton = styled.button`
  padding: 8px 12px;
  border: 2px solid ${props => props.$faceColor || '#ccc'};
  border-radius: 6px;
  background: ${props => props.$isIncorrect ? '#ffebee' : '#fff'};
  color: ${props => props.$faceColor || '#333'};
  font-size: 12px;
  font-weight: bold;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.$faceColor || '#f0f0f0'};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const FaceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const FaceName = styled.div`
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
`;

const PieceInfo = styled.div`
  font-size: 9px;
  color: #666;
`;

const FaceButtons = ({ isScrambling, cubeState, onFaceClick }) => {
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

  const getFaceColor = (faceColorName) => {
    // Use the actual Rubik's cube face colors
    const colorMap = {
      'white': '#FFFFFF',
      'yellow': '#FFD700',
      'red': '#DC143C',
      'orange': '#FF8C00',
      'blue': '#0000FF',
      'green': '#00FF00',
      'black': '#000000'
    };
    return colorMap[faceColorName] || '#000000';
  };

  const isPieceInCorrectPosition = (piece, pieceId) => {
    // Safety check
    if (!piece || !piece.position || !Array.isArray(piece.position)) {
      return false;
    }
    
    // Get expected position for this pieceId
    const positions = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;
          positions.push([x, y, z]);
        }
      }
    }
    
    const expectedPosition = positions[pieceId];
    const currentPosition = piece.position;
    
    return JSON.stringify(currentPosition) === JSON.stringify(expectedPosition);
  };

  const handleFaceClick = (pieceId, faceName, pieceInfo) => {
    if (isScrambling) return;
    
    const faceColor = getFaceColor(faceName);
    const shapeType = getShapeType(pieceId);
    const shapeColor = getShapeColor(pieceId);
    
    // Log to main development terminal with enhanced visibility
    console.log('\n' + '🎯'.repeat(40));
    console.log(`🎨 FACE BUTTON CLICKED IN MAIN TERMINAL!`);
    console.log(`🆔 Piece ID: ${pieceId}`);
    console.log(`🎨 Shape: ${shapeColor} ${shapeType}`);
    console.log(`🎭 Face: ${faceName.toUpperCase()}`);
    console.log(`🎨 Face Color: ${faceColor}`);
    console.log(`📍 Current Position: [${pieceInfo.currentPosition.join(', ')}]`);
    console.log(`🎯 Expected Position: [${pieceInfo.expectedPosition.join(', ')}]`);
    console.log(`✅ Is Correct: ${pieceInfo.isInCorrectPosition}`);
    console.log(`📊 Move History: ${pieceInfo.rotationHistory.length} moves`);
    console.log('🎯'.repeat(40) + '\n');

    // Force output to the React development server terminal
    console.error(`\n🎨 FACE CLICK: ${shapeColor} ${shapeType} (Piece ${pieceId}) - ${faceName.toUpperCase()} face`);
    console.error(`🎨 Face Color: ${faceColor}`);
    console.error(`📍 Position: [${pieceInfo.currentPosition.join(', ')}] -> [${pieceInfo.expectedPosition.join(', ')}]`);
    console.error(`✅ Correct: ${pieceInfo.isInCorrectPosition}\n`);

    // Try to write directly to stdout
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(`\n🎨 FACE BUTTON CLICKED: ${shapeColor} ${shapeType} (Piece ${pieceId}) - ${faceName.toUpperCase()} face\n`);
      process.stdout.write(`🎨 Face Color: ${faceColor}\n`);
      process.stdout.write(`📍 Current: [${pieceInfo.currentPosition.join(', ')}] Expected: [${pieceInfo.expectedPosition.join(', ')}]\n`);
      process.stdout.write(`✅ Is Correct: ${pieceInfo.isInCorrectPosition}\n\n`);
    }

    // Call the parent handler
    if (onFaceClick) {
      onFaceClick(pieceId, faceName, {
        ...pieceInfo,
        faceColor,
        shapeType,
        shapeColor
      });
    }
  };

  const pieces = Array.isArray(cubeState) ? cubeState : [];
  const faceNames = ['front', 'back', 'right', 'left', 'top', 'bottom'];

  // Don't render if no cube state yet
  if (!cubeState || !Array.isArray(cubeState)) {
    return (
      <FaceButtonsContainer>
        <h3>Face-Specific Reporting</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
          Loading cube state...
        </p>
      </FaceButtonsContainer>
    );
  }

  return (
    <FaceButtonsContainer>
      <h3>Face-Specific Reporting</h3>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        Click on any face to report incorrect positioning
      </p>
      
      {pieces.map((piece, pieceIndex) => {
        // Safety check for piece object
        if (!piece || typeof piece !== 'object') {
          return null;
        }
        
        const pieceId = piece.pieceId || pieceIndex;
        const isInCorrectPosition = isPieceInCorrectPosition(piece, pieceId);
        const shapeType = getShapeType(pieceId);
        const shapeColor = getShapeColor(pieceId);
        
        // Get expected position for this pieceId
        const positions = [];
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
              if (x === 0 && y === 0 && z === 0) continue;
              positions.push([x, y, z]);
            }
          }
        }
        const expectedPosition = positions[pieceId];
        
        return (
          <div key={pieceId} style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '11px', 
              fontWeight: 'bold', 
              marginBottom: '5px',
              color: isInCorrectPosition ? '#4caf50' : '#f44336'
            }}>
              {shapeColor} {shapeType} (Piece #{pieceId})
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '5px' 
            }}>
              {faceNames.map((faceName) => {
                // Get the actual face color from the piece's stored colors
                const actualFaceColor = piece.colors && piece.colors[faceName] ? piece.colors[faceName] : '#444444';
                const faceColor = getFaceColor(actualFaceColor);
                const isFaceVisible = piece.colors && piece.colors[faceName] !== '#444444';
                const isFaceIncorrect = !isInCorrectPosition && isFaceVisible;
                
                return (
                  <FaceButton
                    key={`${pieceId}-${faceName}`}
                    onClick={() => handleFaceClick(pieceId, faceName, {
                      currentPosition: piece.position || [0, 0, 0],
                      expectedPosition,
                      isInCorrectPosition,
                      rotationHistory: piece.rotationHistory || [],
                      faceColor,
                      shapeType,
                      shapeColor
                    })}
                    disabled={isScrambling || !isFaceVisible}
                    $faceColor={faceColor}
                    $isIncorrect={isFaceIncorrect}
                    title={`${faceName.toUpperCase()} face - ${isFaceVisible ? 'Visible' : 'Hidden'}`}
                  >
                    <FaceInfo>
                      <FaceName>{faceName}</FaceName>
                      <PieceInfo>
                        {isFaceVisible ? 'Visible' : 'Hidden'}
                      </PieceInfo>
                    </FaceInfo>
                  </FaceButton>
                );
              })}
            </div>
          </div>
        );
      })}
    </FaceButtonsContainer>
  );
};

export default FaceButtons;
