import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import RubiksCube from './components/RubiksCube';
import Controls from './components/Controls';
import InfoPanel from './components/InfoPanel';
import IdentifyIncorrectShapes from './components/IdentifyIncorrectShapes';

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
  const [highlightedPieces, setHighlightedPieces] = useState([]);
  const scrambleRef = useRef();
  const resetRef = useRef();
  const solveRef = useRef();
  const rotateFaceRef = useRef();

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
    if (resetRef.current) {
      setCurrentScramble('');
      resetRef.current();
    }
  };

  const handleSolve = () => {
    if (solveRef.current) {
      setCurrentScramble('Solving cube...');
      solveRef.current();
    }
  };

  const handleRotateFace = (face, direction) => {
    console.log('🎯 handleRotateFace called with:', face, direction);
    console.log('🎯 rotateFaceRef.current:', rotateFaceRef.current);
    if (rotateFaceRef.current) {
      console.log('🎯 Calling rotateFaceRef.current with:', face, direction);
      try {
        rotateFaceRef.current(face, direction);
        console.log('🎯 rotateFaceRef.current call completed successfully');
      } catch (error) {
        console.log('🎯 ERROR calling rotateFaceRef.current:', error);
      }
    } else {
      console.log('🎯 ERROR: rotateFaceRef.current is null!');
    }
  };

  // Add keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log('🔑 Keyboard event detected:', event.key, event.shiftKey);
      
      // Prevent default behavior for cube rotation keys
      const rotationKeys = ['r', 'l', 'u', 'd', 'f', 'b'];
      if (rotationKeys.includes(event.key.toLowerCase())) {
        event.preventDefault();
        console.log('🔑 Prevented default for key:', event.key);
      }

      // Determine direction based on shift key
      const direction = event.shiftKey ? 'counterclockwise' : 'clockwise';
      console.log('🔑 Direction determined:', direction);

      // Handle cube rotation keys
      switch (event.key.toLowerCase()) {
        case 'r':
          console.log('🔑 R key pressed - calling handleRotateFace');
          handleRotateFace('R', direction);
          break;
        case 'l':
          console.log('🔑 L key pressed - calling handleRotateFace');
          handleRotateFace('L', direction);
          break;
        case 'u':
          console.log('🔑 U key pressed - calling handleRotateFace');
          handleRotateFace('U', direction);
          break;
        case 'd':
          console.log('🔑 D key pressed - calling handleRotateFace');
          handleRotateFace('D', direction);
          break;
        case 'f':
          console.log('🔑 F key pressed - calling handleRotateFace');
          handleRotateFace('F', direction);
          break;
        case 'b':
          console.log('🔑 B key pressed - calling handleRotateFace');
          console.log('🔑 B key - direction:', direction);
          console.log('🔑 B key - rotateFaceRef.current:', !!rotateFaceRef.current);
          handleRotateFace('B', direction);
          break;
        default:
          console.log('🔑 Key not recognized:', event.key);
          break;
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    console.log('🔑 Keyboard event listener added');

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      console.log('🔑 Keyboard event listener removed');
    };
  }, []);


  const handleIdentification = (identificationResult) => {
    // Clear previous highlights
    setHighlightedPieces([]);
    
    // Log identification results to main development terminal
    console.log('\n' + '🔍'.repeat(50));
    console.log(`🎯 IDENTIFICATION RESULT IN MAIN TERMINAL!`);
    console.log(`📊 Type: ${identificationResult.type}`);
    
    if (identificationResult.type === 'piece') {
      console.log(`🆔 Piece ID: ${identificationResult.pieceId}`);
      console.log(`🎨 Shape: ${identificationResult.shapeColor} ${identificationResult.shapeType}`);
      console.log(`📍 Current Position: [${identificationResult.currentPosition.join(', ')}]`);
      console.log(`🎯 Expected Position: [${identificationResult.expectedPosition.join(', ')}]`);
      console.log(`✅ Is Correct: ${identificationResult.isInCorrectPosition}`);
      console.log(`🎭 Expected Border Colors:`, identificationResult.expectedBorderColors);
      console.log(`📊 Move History: ${identificationResult.rotationHistory.length} moves`);
    } else if (identificationResult.type === 'combination') {
      console.log(`🎯 Combination: ${identificationResult.combination.shapeColor} ${identificationResult.combination.shapeType} with ${identificationResult.combination.borderColor} border`);
      console.log(`🔢 Count: ${identificationResult.count} incorrect pieces found`);
      console.log(`📋 Incorrect Pieces:`, identificationResult.incorrectPieces);
    } else if (identificationResult.type === 'blackFaces') {
      console.log(`⚫ BLACK FACES IDENTIFIED: ${identificationResult.count} pieces with visible black faces found`);
      console.log(`🔢 TOTAL BLACK FACES: ${identificationResult.totalBlackFaces} individual faces painted pink`);
      console.log(`📋 Pieces with Black Visible Faces (highlighted in pink):`, identificationResult.incorrectPieces.map(p => ({
        pieceId: p.pieceId,
        shape: `${p.shapeColor} ${p.shapeType}`,
        position: `[${p.currentPosition.join(', ')}]`,
        blackVisibleFaces: p.blackVisibleFaces,
        blackFaceCount: p.blackVisibleFaces.length,
        visibleFaces: p.visibleFaces,
        allColors: p.colors
      })));
      
      // Set highlighted pieces for visual feedback
      setHighlightedPieces(identificationResult.incorrectPieces);
    } else {
      console.log(`🔢 Count: ${identificationResult.count} incorrect pieces found`);
      
      if (identificationResult.type === 'shape') {
        console.log(`🔷 Shape Type: ${identificationResult.shapeType}`);
      } else if (identificationResult.type === 'color') {
        console.log(`🎨 Shape Color: ${identificationResult.shapeColor}`);
      } else if (identificationResult.type === 'border') {
        console.log(`🎭 Border Color: ${identificationResult.borderColorName} (${identificationResult.borderColorHex})`);
        console.log(`🎯 Face Index: ${identificationResult.faceIndex}`);
      }
      
      console.log(`📋 Incorrect Pieces:`, identificationResult.incorrectPieces);
    }
    
    console.log('🔍'.repeat(50) + '\n');
    
    // Force output to the React development server terminal
    if (identificationResult.type === 'piece') {
      console.error(`\n🔍 PIECE IDENTIFICATION: ${identificationResult.shapeColor} ${identificationResult.shapeType} (Piece ${identificationResult.pieceId})`);
      console.error(`📍 Position: [${identificationResult.currentPosition.join(', ')}] -> [${identificationResult.expectedPosition.join(', ')}]`);
      console.error(`✅ Correct: ${identificationResult.isInCorrectPosition}`);
    } else if (identificationResult.type === 'combination') {
      console.error(`\n🔍 COMBINATION IDENTIFICATION: ${identificationResult.combination.shapeColor} ${identificationResult.combination.shapeType} with ${identificationResult.combination.borderColor} border - ${identificationResult.count} incorrect pieces`);
      const details = identificationResult.incorrectPieces.map(p => 
        `${p.shapeColor} ${p.shapeType} (Piece ${p.pieceId}) at [${p.currentPosition.join(', ')}]`
      ).join(', ');
      console.error(`📋 Details:`, details);
    } else if (identificationResult.type === 'blackFaces') {
      console.error(`\n⚫ BLACK FACES IDENTIFICATION: ${identificationResult.count} pieces with visible black faces found`);
      console.error(`🔢 TOTAL BLACK FACES: ${identificationResult.totalBlackFaces} individual faces painted pink`);
      const details = identificationResult.incorrectPieces.map(p => 
        `${p.shapeColor} ${p.shapeType} (Piece ${p.pieceId}) at [${p.currentPosition.join(', ')}] - Black visible faces: [${p.blackVisibleFaces.join(', ')}] (${p.blackVisibleFaces.length} faces) (highlighted in pink)`
      ).join(', ');
      console.error(`📋 Details:`, details);
    } else {
      if (identificationResult.type === 'border') {
        console.error(`\n🔍 BORDER IDENTIFICATION: ${identificationResult.borderColorName.toUpperCase()} - ${identificationResult.count} incorrect pieces`);
        console.error(`🎭 Border Color: ${identificationResult.borderColorName} (${identificationResult.borderColorHex})`);
        const details = identificationResult.incorrectPieces.map(p => 
          `${p.shapeColor} ${p.shapeType} (Piece ${p.pieceId}) at [${p.currentPosition.join(', ')}]`
        ).join(', ');
        console.error(`📋 Details:`, details);
      } else {
        console.error(`\n🔍 IDENTIFICATION: ${identificationResult.type.toUpperCase()} - ${identificationResult.count} incorrect pieces`);
        const details = identificationResult.incorrectPieces.map(p => 
          `${p.shapeColor} ${p.shapeType} (Piece ${p.pieceId}) at [${p.currentPosition.join(', ')}]`
        ).join(', ');
        console.error(`📋 Details:`, details);
      }
    }
    
    // Try to write directly to stdout
    if (typeof process !== 'undefined' && process.stdout) {
      if (identificationResult.type === 'piece') {
        process.stdout.write(`\n🔍 PIECE IDENTIFICATION: ${identificationResult.shapeColor} ${identificationResult.shapeType} (Piece ${identificationResult.pieceId})\n`);
        process.stdout.write(`Position: [${identificationResult.currentPosition.join(', ')}] -> [${identificationResult.expectedPosition.join(', ')}]\n`);
        process.stdout.write(`Correct: ${identificationResult.isInCorrectPosition}\n\n`);
      } else if (identificationResult.type === 'combination') {
        process.stdout.write(`\n🔍 COMBINATION IDENTIFICATION: ${identificationResult.combination.shapeColor} ${identificationResult.combination.shapeType} with ${identificationResult.combination.borderColor} border\n`);
        process.stdout.write(`Count: ${identificationResult.count} incorrect pieces\n`);
        process.stdout.write(`Details: ${identificationResult.incorrectPieces.length} pieces identified\n\n`);
      } else if (identificationResult.type === 'blackFaces') {
        process.stdout.write(`\n⚫ BLACK FACES IDENTIFICATION: ${identificationResult.count} pieces with visible black faces found\n`);
        process.stdout.write(`🔢 TOTAL BLACK FACES: ${identificationResult.totalBlackFaces} individual faces painted pink\n`);
        process.stdout.write(`Details: ${identificationResult.incorrectPieces.length} pieces identified (highlighted in pink)\n\n`);
      } else {
        if (identificationResult.type === 'border') {
          process.stdout.write(`\n🔍 BORDER IDENTIFICATION: ${identificationResult.borderColorName.toUpperCase()}\n`);
          process.stdout.write(`Count: ${identificationResult.count} incorrect pieces\n`);
          process.stdout.write(`Border Color: ${identificationResult.borderColorName} (${identificationResult.borderColorHex})\n\n`);
        } else {
          process.stdout.write(`\n🔍 IDENTIFICATION RESULT: ${identificationResult.type.toUpperCase()}\n`);
          process.stdout.write(`Count: ${identificationResult.count} incorrect pieces\n`);
          process.stdout.write(`Details: ${identificationResult.incorrectPieces.length} pieces identified\n\n`);
        }
      }
    }
  };

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
            onCubeStateChange={setCubeState}
            highlightedPieces={highlightedPieces}
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
        />
        
        <InfoPanel 
          currentScramble={currentScramble}
          isScrambling={isScrambling}
        />
        
        <IdentifyIncorrectShapes
          isScrambling={isScrambling}
          cubeState={cubeState}
          onIdentification={handleIdentification}
          setCubeState={setCubeState}
        />
      </MainContent>
    </AppContainer>
  );
}

export default App; 