import React, { useState } from 'react';
import styled from 'styled-components';

const IdentifyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  max-height: 500px;
  overflow-y: auto;
`;

const SectionTitle = styled.h3`
  color: white;
  text-align: center;
  margin: 0 0 15px 0;
  font-size: 1.3rem;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const IdentifyButton = styled.button`
  padding: 12px 16px;
  border: 2px solid ${props => {
    if (props.$isActive) return '#4CAF50';
    if (props.$hasIncorrect) return '#ff4757';
    return 'rgba(255, 255, 255, 0.3)';
  }};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  background: ${props => {
    if (props.disabled) return 'rgba(100, 100, 100, 0.3)';
    if (props.$isActive) return 'rgba(76, 175, 80, 0.2)';
    if (props.$hasIncorrect) return 'rgba(255, 71, 87, 0.2)';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  color: ${props => {
    if (props.disabled) return '#666';
    if (props.$isActive) return '#4CAF50';
    if (props.$hasIncorrect) return '#ff4757';
    return 'white';
  }};
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.3)'};
    background: ${props => {
      if (props.disabled) return 'rgba(100, 100, 100, 0.3)';
      if (props.$isActive) return 'rgba(76, 175, 80, 0.3)';
      if (props.$hasIncorrect) return 'rgba(255, 71, 87, 0.3)';
      return 'rgba(255, 255, 255, 0.2)';
    }};
  }
  
  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(0)'};
  }
`;

const ButtonContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 100%;
  position: relative;
`;

const ShapeContainer = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 8px 0;
`;

const ShapeVisual = styled.div`
  width: 50px;
  height: 50px;
  background: ${props => props.$shapeColor};
  border: 3px solid ${props => props.$borderColor};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Shape-specific styling */
  border-radius: ${props => {
    if (props.$shapeType === 'Circle') return '50%';
    if (props.$shapeType === 'Diamond') return '0';
    return '0';
  }};
  
  transform: ${props => {
    if (props.$shapeType === 'Diamond') return 'rotate(45deg)';
    return 'none';
  }};
  
  /* Triangle shape using CSS */
  ${props => props.$shapeType === 'Triangle' && `
    width: 0;
    height: 0;
    background: transparent;
    border: none;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 43px solid ${props.$shapeColor};
    position: relative;
  `}
`;

const CountBadge = styled.span`
  background: ${props => props.$hasIncorrect ? '#ff4757' : '#4CAF50'};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  position: absolute;
  top: -5px;
  right: -5px;
  z-index: 10;
`;

const ButtonTitle = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-align: center;
  margin-top: 4px;
`;

const ButtonSubtitle = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-top: 2px;
  line-height: 1.2;
`;

const Instructions = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  text-align: center;
  margin: 0 0 15px 0;
  line-height: 1.4;
`;

const StatusMessage = styled.div`
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.$type === 'success') return 'rgba(76, 175, 80, 0.2)';
    if (props.$type === 'warning') return 'rgba(255, 193, 7, 0.2)';
    if (props.$type === 'error') return 'rgba(244, 67, 54, 0.2)';
    return 'rgba(33, 150, 243, 0.2)';
  }};
  color: ${props => {
    if (props.$type === 'success') return '#4CAF50';
    if (props.$type === 'warning') return '#FFC107';
    if (props.$type === 'error') return '#f44336';
    return '#2196F3';
  }};
  border: 1px solid ${props => {
    if (props.$type === 'success') return 'rgba(76, 175, 80, 0.3)';
    if (props.$type === 'warning') return 'rgba(255, 193, 7, 0.3)';
    if (props.$type === 'error') return 'rgba(244, 67, 54, 0.3)';
    return 'rgba(33, 150, 243, 0.3)';
  }};
`;

// Custom logging function
const logToTerminal = (message, data = null) => {
  console.log(`\n🎯 ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
  console.log('='.repeat(80) + '\n');
  
  // Try to send to log server, but don't fail if it's not available
  const sendToLogServer = async () => {
    try {
      const response = await fetch('http://localhost:3001/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          data: data
        }),
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(1000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('✅ Log sent to terminal successfully');
    } catch (error) {
      // Silently fail - logging server is optional
      console.log('💡 Log server not available - logging to console only');
    }
  };
  
  // Execute without blocking
  sendToLogServer();
};

function IdentifyIncorrectShapes({ isScrambling, cubeState, onIdentification, setCubeState }) {
  const [activeIdentification, setActiveIdentification] = useState(null);
  const [identificationResults, setIdentificationResults] = useState({});

  if (!cubeState) {
    // console.log('🚨 SHOWING LOADING MESSAGE - no cubeState');
    return (
      <IdentifyContainer>
        <SectionTitle>Identify Incorrect Shapes</SectionTitle>
        <StatusMessage $type="warning">
          Loading cube state... Please scramble the cube first to identify incorrect shapes.
        </StatusMessage>
      </IdentifyContainer>
    );
  }

  // Helper functions
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
    const expectedPosition = getExpectedPosition(pieceId);
    return JSON.stringify(piece.position) === JSON.stringify(expectedPosition);
  };

  const getExpectedBorderColor = (faceIndex) => {
    const borderColors = [
      '#FFFFFF', // Face 0 (front) - White
      '#FF8C00', // Face 1 (back) - Orange  
      '#00FF00', // Face 2 (right) - Green
      '#DC143C', // Face 3 (left) - Red
      '#0000FF', // Face 4 (top) - Blue
      '#FFD700'  // Face 5 (bottom) - Yellow
    ];
    return borderColors[faceIndex] || '#000000';
  };

  const getBorderColorName = (faceIndex) => {
    const colorNames = ['White', 'Orange', 'Green', 'Red', 'Blue', 'Yellow'];
    return colorNames[faceIndex] || 'Unknown';
  };

  const getShapeColorHex = (shapeColor) => {
    const colorMap = {
      'Red': '#DC143C',
      'Blue': '#0000FF',
      'Green': '#00FF00',
      'Orange': '#FF8C00',
      'Purple': '#800080',
      'Yellow': '#FFD700',
      'Cyan': '#00FFFF',
      'Magenta': '#FF00FF',
      'Lime': '#00FF00',
      'Pink': '#FFC0CB'
    };
    return colorMap[shapeColor] || '#000000';
  };

  // Function to validate that starting colors are properly outward-facing
  const validateColorOrientation = () => {
    logToTerminal('🎨 ========== STARTING COLOR ORIENTATION VALIDATION ==========');
    
    if (!cubeState || cubeState.length === 0) {
      logToTerminal('🎨 ❌ No cube state available for color orientation validation');
      return {
        type: 'colorOrientation',
        incorrectPieces: [],
        count: 0,
        totalIncorrectFaces: 0
      };
    }

    logToTerminal('🎨 ✅ Cube state available, validating starting colors are outward-facing for', cubeState.length, 'pieces...');
    
    const incorrectPieces = [];
    let totalIncorrectFaces = 0;
    let piecesChecked = 0;

    cubeState.forEach((piece, index) => {
      piecesChecked++;
      const pieceId = piece.pieceId || index;
      
      if (!Array.isArray(piece.position) || !piece.colors || typeof piece.colors !== 'object') {
        logToTerminal(`🎨 ❌ Piece ${pieceId} has invalid position or colors`);
        return;
      }
      
      const [x, y, z] = piece.position;
      
      // Determine which faces should be visible based on current position
      const shouldBeVisible = {
        front: z === 1,
        back: z === -1,
        right: x === 1,
        left: x === -1,
        top: y === 1,
        bottom: y === -1
      };
      
      const incorrectFaces = [];
      
      // Check if visible faces have proper colors (not black/gray)
      Object.keys(shouldBeVisible).forEach(face => {
        if (shouldBeVisible[face]) {
          const faceColor = piece.colors[face];
          
          // Check if the visible face has a proper color (not black/gray)
          if (faceColor === '#444444' || faceColor === 'black' || faceColor === '#000000') {
            incorrectFaces.push({
              face: face,
              currentColor: faceColor,
              issue: 'Visible face is black/gray - starting color should be outward-facing'
            });
            totalIncorrectFaces++;
            logToTerminal(`🎨 ❌ Piece ${pieceId} has black/gray ${face} face: ${faceColor} (should have starting color outward-facing)`);
          } else {
            logToTerminal(`🎨 ✅ Piece ${pieceId} ${face} face has proper color: ${faceColor}`);
          }
        }
      });
      
      if (incorrectFaces.length > 0) {
        incorrectPieces.push({
          pieceId: pieceId,
          currentPosition: piece.position,
          startingColors: piece.startingColors,
          incorrectFaces: incorrectFaces
        });
        logToTerminal(`🎨 ✅ Added piece ${pieceId} to incorrect pieces with ${incorrectFaces.length} incorrect faces`);
      }
    });

    logToTerminal('🎨 ========== STARTING COLOR ORIENTATION VALIDATION SUMMARY ==========');
    logToTerminal('🎨 Total pieces checked:', piecesChecked);
    logToTerminal('🎨 Pieces with incorrect color orientation:', incorrectPieces.length);
    logToTerminal('🎨 Total incorrect faces found:', totalIncorrectFaces);

    const result = {
      type: 'colorOrientation',
      incorrectPieces: incorrectPieces,
      count: incorrectPieces.length,
      totalIncorrectFaces: totalIncorrectFaces
    };
    
    setIdentificationResults(prev => ({
      ...prev,
      'colorOrientation': result
    }));

    return result;
  };

  // Function to get expected color for a face
  const getExpectedColorForFace = (face) => {
    const colorMap = {
      front: 'white',
      back: 'yellow',
      right: 'red',
      left: 'orange',
      top: 'blue',
      bottom: 'green'
    };
    return colorMap[face] || '#444444';
  };

  // Get pieces data
  const getPieces = () => {
    if (Array.isArray(cubeState)) {
      return cubeState.map((piece, index) => ({
        pieceId: index,
        position: piece.position,
        colors: piece.colors,
        rotationHistory: piece.rotationHistory || []
      }));
    } else if (cubeState?.pieces) {
      return cubeState.pieces;
    }
    return [];
  };

  const pieces = getPieces();

  // Identify incorrect shapes by type
  const identifyIncorrectShapesByType = (shapeType) => {
    const incorrectPieces = pieces.filter(piece => {
      const pieceId = piece.pieceId;
      const actualShapeType = getShapeType(pieceId);
      return actualShapeType === shapeType && !isPieceInCorrectPosition(piece, pieceId);
    });

    const result = {
      type: 'shape',
      shapeType,
      incorrectPieces: incorrectPieces.map(piece => ({
        pieceId: piece.pieceId,
        shapeType: getShapeType(piece.pieceId),
        shapeColor: getShapeColor(piece.pieceId),
        currentPosition: piece.position,
        expectedPosition: getExpectedPosition(piece.pieceId),
        colors: piece.colors,
        rotationHistory: piece.rotationHistory
      })),
      count: incorrectPieces.length
    };

    setIdentificationResults(prev => ({
      ...prev,
      [`shape-${shapeType}`]: result
    }));

    logToTerminal(`🔍 IDENTIFIED INCORRECT ${shapeType.toUpperCase()} SHAPES`, result);
    
    if (onIdentification) {
      onIdentification(result);
    }

    return result;
  };

  // Identify incorrect shapes by color
  const identifyIncorrectShapesByColor = (shapeColor) => {
    const incorrectPieces = pieces.filter(piece => {
      const pieceId = piece.pieceId;
      const actualShapeColor = getShapeColor(pieceId);
      return actualShapeColor === shapeColor && !isPieceInCorrectPosition(piece, pieceId);
    });

    const result = {
      type: 'color',
      shapeColor,
      incorrectPieces: incorrectPieces.map(piece => ({
        pieceId: piece.pieceId,
        shapeType: getShapeType(piece.pieceId),
        shapeColor: getShapeColor(piece.pieceId),
        currentPosition: piece.position,
        expectedPosition: getExpectedPosition(piece.pieceId),
        colors: piece.colors,
        rotationHistory: piece.rotationHistory
      })),
      count: incorrectPieces.length
    };

    setIdentificationResults(prev => ({
      ...prev,
      [`color-${shapeColor}`]: result
    }));

    logToTerminal(`🎨 IDENTIFIED INCORRECT ${shapeColor.toUpperCase()} SHAPES`, result);
    
    if (onIdentification) {
      onIdentification(result);
    }

    return result;
  };

  // Identify incorrect border colors
  const identifyIncorrectBorderColors = (faceIndex) => {
    const borderColorName = getBorderColorName(faceIndex);
    const borderColorHex = getExpectedBorderColor(faceIndex);
    
    const incorrectPieces = pieces.filter(piece => {
      const pieceId = piece.pieceId;
      const isInCorrectPosition = isPieceInCorrectPosition(piece, pieceId);
      
      // Check if this piece should have this border color in its current position
      const [x, y, z] = piece.position;
      let shouldHaveBorderColor = false;
      
      switch (faceIndex) {
        case 0: // Front face (Z+) - White
          shouldHaveBorderColor = z === 1;
          break;
        case 1: // Back face (Z-) - Orange
          shouldHaveBorderColor = z === -1;
          break;
        case 2: // Right face (X+) - Green
          shouldHaveBorderColor = x === 1;
          break;
        case 3: // Left face (X-) - Red
          shouldHaveBorderColor = x === -1;
          break;
        case 4: // Top face (Y+) - Blue
          shouldHaveBorderColor = y === 1;
          break;
        case 5: // Bottom face (Y-) - Yellow
          shouldHaveBorderColor = y === -1;
          break;
      }
      
      // Piece is incorrect if it should have this border color but is not in correct position
      return shouldHaveBorderColor && !isInCorrectPosition;
    });

    const result = {
      type: 'border',
      faceIndex,
      borderColorName,
      borderColorHex,
      incorrectPieces: incorrectPieces.map(piece => ({
        pieceId: piece.pieceId,
        shapeType: getShapeType(piece.pieceId),
        shapeColor: getShapeColor(piece.pieceId),
        currentPosition: piece.position,
        expectedPosition: getExpectedPosition(piece.pieceId),
        colors: piece.colors,
        rotationHistory: piece.rotationHistory
      })),
      count: incorrectPieces.length
    };

    setIdentificationResults(prev => ({
      ...prev,
      [`border-${faceIndex}`]: result
    }));

    logToTerminal(`🎭 IDENTIFIED INCORRECT ${borderColorName.toUpperCase()} BORDER COLORS`, result);
    
    if (onIdentification) {
      onIdentification(result);
    }

    return result;
  };

  // Identify pieces with black faces that should be visible
  const identifyPiecesWithBlackFaces = () => {
    logToTerminal('🔍 ========== STARTING BLACK FACES IDENTIFICATION ==========');
    logToTerminal('🔍 cubeState type:', typeof cubeState);
    logToTerminal('🔍 cubeState length:', cubeState ? cubeState.length : 'null');
    logToTerminal('🔍 cubeState is null:', cubeState === null);
    logToTerminal('🔍 cubeState is undefined:', cubeState === undefined);
    
    if (!cubeState || cubeState.length === 0) {
      logToTerminal('🔍 ❌ No cube state available for identification');
      return {
        type: 'blackFaces',
        incorrectPieces: [],
        count: 0,
        totalBlackFaces: 0
      };
    }

    logToTerminal('🔍 ✅ Cube state available, checking', cubeState.length, 'pieces...');
    
    const incorrectPieces = [];
    let totalBlackFaces = 0;
    let piecesChecked = 0;
    let piecesWithColors = 0;
    let piecesWithPosition = 0;

    // Log detailed structure of first few pieces
    logToTerminal('🔍 ========== PIECE STRUCTURE ANALYSIS ==========');
    cubeState.slice(0, 5).forEach((piece, index) => {
      logToTerminal(`🔍 Piece ${index}:`, {
        pieceId: piece.pieceId,
        hasPosition: Array.isArray(piece.position),
        position: piece.position,
        hasColors: typeof piece.colors === 'object' && piece.colors !== null,
        colors: piece.colors,
        allKeys: Object.keys(piece)
      });
    });

    logToTerminal('🔍 ========== CHECKING ALL PIECES ==========');
    
    cubeState.forEach((piece, index) => {
      piecesChecked++;
      const pieceId = piece.pieceId || index;
      
      // Check if piece has position
      if (!Array.isArray(piece.position)) {
        logToTerminal(`🔍 ❌ Piece ${pieceId} has invalid position:`, piece.position);
        return;
      }
      piecesWithPosition++;
      
      // Check if piece has colors
      if (!piece.colors || typeof piece.colors !== 'object') {
        logToTerminal(`🔍 ❌ Piece ${pieceId} has invalid colors:`, piece.colors);
        return;
      }
      piecesWithColors++;
      
      const [x, y, z] = piece.position;
      
      logToTerminal(`🔍 Checking piece ${pieceId} at position [${x}, ${y}, ${z}]`);
      logToTerminal(`🔍 Piece colors object:`, piece.colors);
      logToTerminal(`🔍 Color keys:`, Object.keys(piece.colors));
      
      // Determine which faces should be visible based on current position
      const visibleFaces = [];
      if (x === 1) visibleFaces.push('right');
      if (x === -1) visibleFaces.push('left');
      if (y === 1) visibleFaces.push('top');
      if (y === -1) visibleFaces.push('bottom');
      if (z === 1) visibleFaces.push('front');
      if (z === -1) visibleFaces.push('back');
      
      logToTerminal(`🔍 Visible faces for piece ${pieceId}:`, visibleFaces);
      
      // Check if any visible faces are black/gray
      const blackVisibleFaces = [];
      visibleFaces.forEach(face => {
        const faceColor = piece.colors[face];
        logToTerminal(`🔍 Face ${face} color: "${faceColor}" (type: ${typeof faceColor})`);
        
        // Check for both #444444 and 'black' values
        if (faceColor === '#444444' || faceColor === 'black' || faceColor === '#000000') {
          blackVisibleFaces.push(face);
          totalBlackFaces++;
          logToTerminal(`🔍 ✅ FOUND BLACK/GRAY FACE: ${face} on piece ${pieceId} with color "${faceColor}"`);
        } else {
          logToTerminal(`🔍 Face ${face} is not black/gray (color: "${faceColor}")`);
        }
      });
      
      if (blackVisibleFaces.length > 0) {
        incorrectPieces.push({
          pieceId: pieceId,
          currentPosition: piece.position,
          blackVisibleFaces: blackVisibleFaces
        });
        logToTerminal(`🔍 ✅ Added piece ${pieceId} to incorrect pieces with ${blackVisibleFaces.length} black faces:`, blackVisibleFaces);
      } else {
        logToTerminal(`🔍 Piece ${pieceId} has no black visible faces`);
      }
    });

    logToTerminal('🔍 ========== IDENTIFICATION SUMMARY ==========');
    logToTerminal('🔍 Total pieces checked:', piecesChecked);
    logToTerminal('🔍 Pieces with valid position:', piecesWithPosition);
    logToTerminal('🔍 Pieces with valid colors:', piecesWithColors);
    logToTerminal('🔍 Pieces with black faces:', incorrectPieces.length);
    logToTerminal('🔍 Total black faces found:', totalBlackFaces);
    logToTerminal('🔍 Incorrect pieces details:', incorrectPieces);

    const result = {
      type: 'blackFaces',
      incorrectPieces: incorrectPieces,
      count: incorrectPieces.length,
      totalBlackFaces: totalBlackFaces
    };
    
    logToTerminal('🔍 ========== RETURNING RESULT ==========');
    logToTerminal('🔍 Result:', result);
    
    setIdentificationResults(prev => {
      const newResults = {
        ...prev,
        'blackFaces': result
      };
      logToTerminal('🔧 UPDATING identificationResults:', newResults);
      return newResults;
    });

    return result;
  };

  const handleButtonClick = (type, identifier) => {
    if (isScrambling) return;

    setActiveIdentification(`${type}-${identifier}`);

    let result;
    switch (type) {
      case 'shape':
        result = identifyIncorrectShapesByType(identifier);
        break;
      case 'color':
        result = identifyIncorrectShapesByColor(identifier);
        break;
      case 'border':
        result = identifyIncorrectBorderColors(identifier);
        break;
      case 'blackFaces':
        result = identifyPiecesWithBlackFaces();
        break;
      case 'colorOrientation':
        result = validateColorOrientation();
        break;
    }

    // Reset active state after a short delay
    setTimeout(() => {
      setActiveIdentification(null);
    }, 2000);
  };

  const handleFindAndFixGrayFaces = () => {
    logToTerminal('🔧 FIND AND FIX GRAY FACES BUTTON CLICKED!');
    logToTerminal('🔧 isScrambling:', isScrambling);
    
    if (isScrambling) {
      logToTerminal('🔧 Button disabled - cube is scrambling');
      return;
    }

    // First identify the pieces with black faces
    const blackFacesResult = identifyPiecesWithBlackFaces();
    
    if (blackFacesResult.count === 0) {
      logToTerminal('No gray faces to fix');
      return;
    }

    logToTerminal('🔧 FOUND AND FIXING GRAY FACES:', blackFacesResult.incorrectPieces.length, 'pieces');
    logToTerminal('🔧 Pieces to fix:', blackFacesResult.incorrectPieces.map(p => `${p.pieceId} at [${p.currentPosition.join(', ')}]`));

    // Update the cube state to fix the colors using React state management
    logToTerminal('🔧 Using React setCubeState to update cube state');
    logToTerminal('🔧 Current state length:', cubeState.length);
    
    setCubeState(prevState => {
      logToTerminal('🔧 setCubeState called with prevState length:', prevState.length);
      const newState = [...prevState];
        
        blackFacesResult.incorrectPieces.forEach(incorrectPiece => {
          logToTerminal(`🔧 Processing piece ${incorrectPiece.pieceId}...`);
          const pieceIndex = newState.findIndex(p => p.pieceId === incorrectPiece.pieceId);
          logToTerminal(`🔧 Found piece at index ${pieceIndex}`);
          
          if (pieceIndex !== -1) {
            const piece = newState[pieceIndex];
            const [x, y, z] = piece.position;
            logToTerminal(`🔧 Piece ${piece.pieceId} at position [${x}, ${y}, ${z}]`);
            logToTerminal(`🔧 Current colors:`, piece.colors);
            
            // Determine which faces should be visible based on current position
            const visibleFaces = [];
            if (x === 1) visibleFaces.push('right');
            if (x === -1) visibleFaces.push('left');
            if (y === 1) visibleFaces.push('top');
            if (y === -1) visibleFaces.push('bottom');
            if (z === 1) visibleFaces.push('front');
            if (z === -1) visibleFaces.push('back');
            
            logToTerminal(`🔧 Visible faces:`, visibleFaces);
            
            // Fix the colors for visible faces that are currently black/gray
            const updatedColors = { ...piece.colors };
            let fixedAny = false;
            
            visibleFaces.forEach(face => {
              logToTerminal(`🔧 Checking face ${face}: current color = ${updatedColors[face]}`);
              if (updatedColors[face] === '#444444' || updatedColors[face] === 'black' || updatedColors[face] === '#000000') {
                // Set the correct color based on the face
                switch (face) {
                  case 'front':
                    updatedColors[face] = '#FFFFFF'; // White
                    break;
                  case 'back':
                    updatedColors[face] = '#FFD700'; // Yellow
                    break;
                  case 'right':
                    updatedColors[face] = '#DC143C'; // Red
                    break;
                  case 'left':
                    updatedColors[face] = '#FF8C00'; // Orange
                    break;
                  case 'top':
                    updatedColors[face] = '#0000FF'; // Blue
                    break;
                  case 'bottom':
                    updatedColors[face] = '#00FF00'; // Green
                    break;
                }
                logToTerminal(`🔧 Fixed face ${face} to ${updatedColors[face]}`);
                fixedAny = true;
              }
            });
            
            if (fixedAny) {
              newState[pieceIndex] = {
                ...piece,
                colors: updatedColors
              };
              logToTerminal(`🔧 Updated piece ${piece.pieceId} with new colors:`, updatedColors);
            } else {
              logToTerminal(`🔧 No changes needed for piece ${piece.pieceId}`);
            }
          } else {
            logToTerminal(`🔧 ERROR: Could not find piece ${incorrectPiece.pieceId} in cube state`);
          }
        });
        
      logToTerminal('✅ Gray faces find and fix completed!');
      logToTerminal('🔧 New state length:', newState.length);
      return newState;
    });

    // Clear the identification results since we've fixed the issue
    setIdentificationResults(prev => ({
      ...prev,
      blackFaces: null
    }));

    // Clear the highlighting by calling onIdentification with empty result
    if (onIdentification) {
      onIdentification({
        type: 'blackFaces',
        count: 0,
        totalBlackFaces: 0,
        incorrectPieces: []
      });
    }
  };

  const getButtonState = (type, identifier) => {
    const key = `${type}-${identifier}`;
    const result = identificationResults[key];
    const isActive = activeIdentification === key;
    
    return {
      isActive,
      hasIncorrect: result && result.count > 0,
      count: result ? result.count : 0
    };
  };

  // Generate all possible combinations of shape+color+border
  const generateCombinations = () => {
    const shapeTypes = ['Square', 'Circle', 'Triangle', 'Diamond'];
    const shapeColors = ['Red', 'Blue', 'Green', 'Orange', 'Purple', 'Yellow', 'Cyan', 'Magenta', 'Lime', 'Pink'];
    const borderColors = [
      { name: 'White', hex: '#FFFFFF', faceIndex: 0 },
      { name: 'Orange', hex: '#FF8C00', faceIndex: 1 },
      { name: 'Green', hex: '#00FF00', faceIndex: 2 },
      { name: 'Red', hex: '#DC143C', faceIndex: 3 },
      { name: 'Blue', hex: '#0000FF', faceIndex: 4 },
      { name: 'Yellow', hex: '#FFD700', faceIndex: 5 }
    ];

    const combinations = [];
    shapeTypes.forEach(shapeType => {
      shapeColors.forEach(shapeColor => {
        borderColors.forEach(borderColor => {
          combinations.push({
            id: `${shapeType}-${shapeColor}-${borderColor.name}`,
            shapeType,
            shapeColor,
            borderColor: borderColor.name,
            borderColorHex: borderColor.hex,
            faceIndex: borderColor.faceIndex
          });
        });
      });
    });
    return combinations;
  };

  // Identify incorrect pieces by combination
  const identifyIncorrectCombination = (combination) => {
    const incorrectPieces = pieces.filter(piece => {
      const pieceId = piece.pieceId;
      const actualShapeType = getShapeType(pieceId);
      const actualShapeColor = getShapeColor(pieceId);
      const isInCorrectPosition = isPieceInCorrectPosition(piece, pieceId);
      
      // Check if this piece matches the combination
      const matchesShape = actualShapeType === combination.shapeType;
      const matchesColor = actualShapeColor === combination.shapeColor;
      
      // Check if this piece should have this border color in its current position
      const [x, y, z] = piece.position;
      let shouldHaveBorderColor = false;
      
      switch (combination.faceIndex) {
        case 0: // Front face (Z+) - White
          shouldHaveBorderColor = z === 1;
          break;
        case 1: // Back face (Z-) - Orange
          shouldHaveBorderColor = z === -1;
          break;
        case 2: // Right face (X+) - Green
          shouldHaveBorderColor = x === 1;
          break;
        case 3: // Left face (X-) - Red
          shouldHaveBorderColor = x === -1;
          break;
        case 4: // Top face (Y+) - Blue
          shouldHaveBorderColor = y === 1;
          break;
        case 5: // Bottom face (Y-) - Yellow
          shouldHaveBorderColor = y === -1;
          break;
      }
      
      // Piece is incorrect if it matches the combination but is not in correct position
      return matchesShape && matchesColor && shouldHaveBorderColor && !isInCorrectPosition;
    });

    const result = {
      type: 'combination',
      combination,
      incorrectPieces: incorrectPieces.map(piece => ({
        pieceId: piece.pieceId,
        shapeType: getShapeType(piece.pieceId),
        shapeColor: getShapeColor(piece.pieceId),
        currentPosition: piece.position,
        expectedPosition: getExpectedPosition(piece.pieceId),
        colors: piece.colors,
        rotationHistory: piece.rotationHistory
      })),
      count: incorrectPieces.length
    };

    setIdentificationResults(prev => ({
      ...prev,
      [`combination-${combination.id}`]: result
    }));

    logToTerminal(`🎯 IDENTIFIED INCORRECT ${combination.shapeColor} ${combination.shapeType} with ${combination.borderColor} border`, result);
    
    if (onIdentification) {
      onIdentification(result);
    }

    return result;
  };

  const handleCombinationClick = (combination) => {
    if (isScrambling) return;

    setActiveIdentification(`combination-${combination.id}`);
    const result = identifyIncorrectCombination(combination);

    // Reset active state after a short delay
    setTimeout(() => {
      setActiveIdentification(null);
    }, 2000);
  };

  const getCombinationButtonState = (combination) => {
    const key = `combination-${combination.id}`;
    const result = identificationResults[key];
    const isActive = activeIdentification === key;
    
    return {
      isActive,
      hasIncorrect: result && result.count > 0,
      count: result ? result.count : 0
    };
  };

  const combinations = generateCombinations();

  return (
    <IdentifyContainer>
      <SectionTitle>Identify Incorrect Shapes</SectionTitle>
      <Instructions>
        Click any button below to identify pieces with that specific combination of shape+color+border that are in incorrect positions.
        Buttons show the count of incorrect pieces found for each combination.
      </Instructions>

      {/* Color Orientation and Special Issues */}
      <div>
        <h4 style={{ color: 'white', marginBottom: '10px', fontSize: '16px' }}>Color Orientation & Special Issues</h4>
        <ButtonGrid style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '20px' }}>
          {/* Color Orientation Validation Button */}
          <IdentifyButton
            onClick={() => handleButtonClick('colorOrientation', 'all')}
            disabled={isScrambling}
            $isActive={activeIdentification === 'colorOrientation-all'}
            $hasIncorrect={identificationResults['colorOrientation'] && identificationResults['colorOrientation'].count > 0}
            style={{
              borderColor: '#9C27B0',
              borderWidth: '3px',
              background: 'rgba(156, 39, 176, 0.2)'
            }}
          >
            <ButtonContent>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎨</div>
              <ButtonTitle style={{ color: '#9C27B0', fontWeight: 'bold' }}>
                Color Orientation
              </ButtonTitle>
              <ButtonSubtitle>
                Validate that all visible faces have correct colors
              </ButtonSubtitle>
              {identificationResults['colorOrientation'] && identificationResults['colorOrientation'].count > 0 && (
                <CountBadge $hasIncorrect={true}>
                  {identificationResults['colorOrientation'].count} pieces
                  <br />
                  {identificationResults['colorOrientation'].totalIncorrectFaces} faces
                </CountBadge>
              )}
            </ButtonContent>
          </IdentifyButton>
          <IdentifyButton
            onClick={() => handleButtonClick('blackFaces', 'all')}
            disabled={isScrambling}
            $isActive={activeIdentification === 'blackFaces-all'}
            $hasIncorrect={identificationResults['blackFaces'] && identificationResults['blackFaces'].count > 0}
            style={{
              background: 'rgba(255, 0, 0, 0.2)',
              borderColor: '#ff0000',
              borderWidth: '3px',
              display: 'none' // Hide the button but keep functionality
            }}
          >
            <ButtonContent>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚫</div>
              <ButtonTitle style={{ color: '#ff0000', fontWeight: 'bold' }}>
                Dark Gray Faces
              </ButtonTitle>
              <ButtonSubtitle>
                Find pieces with dark gray faces (highlighted in pink)
              </ButtonSubtitle>
              {identificationResults['blackFaces'] && identificationResults['blackFaces'].count > 0 && (
                <CountBadge $hasIncorrect={true}>
                  {identificationResults['blackFaces'].count} pieces
                  <br />
                  {identificationResults['blackFaces'].totalBlackFaces} faces
                </CountBadge>
              )}
            </ButtonContent>
          </IdentifyButton>
          
          {/* Find and Fix Gray Faces Button */}
          <IdentifyButton
            onClick={() => {
              logToTerminal('🔧 BUTTON CLICKED - onClick handler triggered');
              logToTerminal('🔧 isScrambling:', isScrambling);
              handleFindAndFixGrayFaces();
            }}
            disabled={isScrambling}
            $isActive={false}
            $hasIncorrect={false}
            style={{
              borderColor: '#FF6B6B',
              borderWidth: '3px',
              background: 'rgba(255, 107, 107, 0.2)'
            }}
          >
            <ButtonContent>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔧</div>
              <ButtonTitle style={{ color: '#FF6B6B', fontWeight: 'bold' }}>
                Find & Fix Gray Faces
              </ButtonTitle>
              <ButtonSubtitle>
                Identify and automatically correct dark gray faces to proper colors
              </ButtonSubtitle>
            </ButtonContent>
          </IdentifyButton>
        </ButtonGrid>
      </div>

      {/* Combination Identification */}
      <div>
        <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '16px' }}>By Shape + Color + Border Combinations</h4>
        <ButtonGrid style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {combinations.map(combination => {
            const state = getCombinationButtonState(combination);
            
            return (
              <IdentifyButton
                key={`combination-${combination.id}`}
                onClick={() => handleCombinationClick(combination)}
                disabled={isScrambling}
                $isActive={state.isActive}
                $hasIncorrect={state.hasIncorrect}
                style={{
                  borderColor: state.hasIncorrect ? '#ff4757' : combination.borderColorHex,
                  borderWidth: '3px'
                }}
              >
                <ButtonContent>
                  <ShapeContainer>
                    {combination.shapeType === 'Triangle' ? (
                      <svg width="50" height="50" viewBox="0 0 50 50">
                        <polygon 
                          points="25,5 45,40 5,40" 
                          fill={getShapeColorHex(combination.shapeColor)}
                          stroke={combination.borderColorHex}
                          strokeWidth="3"
                        />
                      </svg>
                    ) : (
                      <ShapeVisual
                        $shapeType={combination.shapeType}
                        $shapeColor={getShapeColorHex(combination.shapeColor)}
                        $borderColor={combination.borderColorHex}
                      />
                    )}
                    {state.count > 0 && (
                      <CountBadge $hasIncorrect={state.hasIncorrect}>
                        {state.count}
                      </CountBadge>
                    )}
                  </ShapeContainer>
                  <ButtonTitle>
                    {combination.shapeColor} {combination.shapeType}
                  </ButtonTitle>
                </ButtonContent>
              </IdentifyButton>
            );
          })}
        </ButtonGrid>
      </div>

      {/* Status Message */}
      {activeIdentification && (
        <StatusMessage $type="success">
          Combination identification complete! Check the terminal for detailed results.
        </StatusMessage>
      )}
    </IdentifyContainer>
  );
}

export default IdentifyIncorrectShapes;
