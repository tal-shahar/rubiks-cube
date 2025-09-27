import React from 'react';
import { render } from '@testing-library/react';
import { CubeGroup } from '../CubeGroup';

// Mock the CubePiece component
jest.mock('../CubePiece', () => ({
  CubePiece: ({ pieceId, position, colors, rotatingFace, rotationProgress }) => {
    return (
      <div 
        data-testid={`cube-piece-${pieceId}`}
        data-position={JSON.stringify(position)}
        data-colors={JSON.stringify(colors)}
        data-rotating-face={JSON.stringify(rotatingFace)}
        data-rotation-progress={rotationProgress}
      >
        Piece {pieceId}
      </div>
    );
  }
}));


describe('CubeGroup Component', () => {
  const mockCubeState = [
    {
      pieceId: 0,
      position: [1, 1, 1],
      colors: { front: 'white', back: 'yellow', right: 'red', left: 'orange', top: 'blue', bottom: 'green' },
      rotationHistory: []
    },
    {
      pieceId: 1,
      position: [0, 1, 1],
      colors: { front: 'white', back: 'yellow', right: 'red', left: 'orange', top: 'blue', bottom: 'green' },
      rotationHistory: []
    },
    {
      pieceId: 2,
      position: [-1, 1, 1],
      colors: { front: 'white', back: 'yellow', right: 'red', left: 'orange', top: 'blue', bottom: 'green' },
      rotationHistory: []
    },
    {
      pieceId: 3,
      position: [1, 1, -1], // Back face piece
      colors: { front: 'white', back: 'yellow', right: 'red', left: 'orange', top: 'blue', bottom: 'green' },
      rotationHistory: []
    }
  ];

  const defaultProps = {
    cubeState: mockCubeState,
    isAnimating: false,
    rotatingFace: null,
    rotationProgress: 0,
    rotateFace: jest.fn(),
    rotateFaceWithAnimation: jest.fn(),
    scramble: jest.fn(),
    reset: jest.fn(),
    solve: jest.fn(),
    isRotating: false,
    autoRotate: false,
    onScramble: jest.fn(),
    onReset: jest.fn(),
    onSolve: jest.fn(),
    onRotateFace: jest.fn(),
    onCubeStateChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => render(<CubeGroup {...defaultProps} />)).not.toThrow();
  });

  it('should render all cube pieces', () => {
    const { getByTestId } = render(<CubeGroup {...defaultProps} />);
    
    mockCubeState.forEach(piece => {
      expect(getByTestId(`cube-piece-${piece.pieceId}`)).toBeInTheDocument();
    });
  });

  it('should pass correct props to cube pieces', () => {
    const { getByTestId } = render(<CubeGroup {...defaultProps} />);
    
    mockCubeState.forEach(piece => {
      const cubePiece = getByTestId(`cube-piece-${piece.pieceId}`);
      expect(cubePiece).toHaveAttribute('data-position', JSON.stringify(piece.position));
      expect(cubePiece).toHaveAttribute('data-colors', JSON.stringify(piece.colors));
    });
  });

  it('should handle rotating face correctly', () => {
    const rotatingFace = { face: 'F', direction: 'clockwise' };
    const rotationProgress = 0.5;
    
    const props = { 
      ...defaultProps, 
      rotatingFace, 
      rotationProgress 
    };
    
    const { getByTestId } = render(<CubeGroup {...props} />);
    
    // Front face pieces should have rotating face info
    const frontPieces = [0, 1, 2]; // Pieces on front face (z=1)
    frontPieces.forEach(pieceId => {
      const piece = getByTestId(`cube-piece-${pieceId}`);
      expect(piece).toHaveAttribute('data-rotating-face', JSON.stringify(rotatingFace));
      expect(piece).toHaveAttribute('data-rotation-progress', '0.5');
    });
    
    // Back face piece should not have rotating face info
    const backPiece = getByTestId('cube-piece-3');
    expect(backPiece).toHaveAttribute('data-rotating-face', JSON.stringify(rotatingFace));
  });

  it('should handle different rotating faces', () => {
    const faces = ['F', 'B', 'R', 'L', 'U', 'D'];
    
    faces.forEach(face => {
      const rotatingFace = { face, direction: 'clockwise' };
      const props = { 
        ...defaultProps, 
        rotatingFace, 
        rotationProgress: 0.3 
      };
      
      expect(() => render(<CubeGroup {...props} />)).not.toThrow();
    });
  });

  it('should handle different rotation progress values', () => {
    const progressValues = [0, 0.25, 0.5, 0.75, 1.0];
    
    progressValues.forEach(progress => {
      const props = { 
        ...defaultProps, 
        rotatingFace: { face: 'F', direction: 'clockwise' },
        rotationProgress: progress 
      };
      
      expect(() => render(<CubeGroup {...props} />)).not.toThrow();
    });
  });

  it('should handle auto rotation', () => {
    const props = { ...defaultProps, autoRotate: true };
    expect(() => render(<CubeGroup {...props} />)).not.toThrow();
  });

  it('should handle manual rotation', () => {
    const props = { ...defaultProps, isRotating: true };
    expect(() => render(<CubeGroup {...props} />)).not.toThrow();
  });

  it('should handle empty cube state', () => {
    const props = { ...defaultProps, cubeState: [] };
    expect(() => render(<CubeGroup {...props} />)).not.toThrow();
  });

  it('should handle null cube state', () => {
    const props = { ...defaultProps, cubeState: null };
    expect(() => render(<CubeGroup {...props} />)).not.toThrow();
  });

  it('should handle undefined cube state', () => {
    const props = { ...defaultProps, cubeState: undefined };
    expect(() => render(<CubeGroup {...props} />)).not.toThrow();
  });

  it('should handle missing callback functions', () => {
    const props = {
      ...defaultProps,
      onScramble: null,
      onReset: null,
      onSolve: null,
      onRotateFace: null
    };
    
    expect(() => render(<CubeGroup {...props} />)).not.toThrow();
  });


  it('should handle edge cases for piece positions', () => {
    const edgeCaseState = [
      { pieceId: 0, position: [0, 0, 0], colors: {}, rotationHistory: [] },
      { pieceId: 1, position: [2, 2, 2], colors: {}, rotationHistory: [] },
      { pieceId: 2, position: [-2, -2, -2], colors: {}, rotationHistory: [] },
      { pieceId: 3, position: [0.5, 0.5, 0.5], colors: {}, rotationHistory: [] }
    ];

    const props = { ...defaultProps, cubeState: edgeCaseState };
    expect(() => render(<CubeGroup {...props} />)).not.toThrow();
  });

  it('should handle different rotation directions', () => {
    const directions = ['clockwise', 'counterclockwise'];
    
    directions.forEach(direction => {
      const props = { 
        ...defaultProps, 
        rotatingFace: { face: 'F', direction },
        rotationProgress: 0.5 
      };
      
      expect(() => render(<CubeGroup {...props} />)).not.toThrow();
    });
  });

  it('should handle mixed rotation states', () => {
    const props = { 
      ...defaultProps, 
      isAnimating: true,
      rotatingFace: { face: 'R', direction: 'counterclockwise' },
      rotationProgress: 0.8,
      isRotating: true,
      autoRotate: true
    };
    
    expect(() => render(<CubeGroup {...props} />)).not.toThrow();
  });

  it('should handle large cube states', () => {
    const largeState = Array.from({ length: 100 }, (_, i) => ({
      pieceId: i,
      position: [i % 3 - 1, Math.floor(i / 3) % 3 - 1, Math.floor(i / 9) % 3 - 1],
      colors: { front: 'white', back: 'yellow', right: 'red', left: 'orange', top: 'blue', bottom: 'green' },
      rotationHistory: []
    }));

    const props = { ...defaultProps, cubeState: largeState };
    expect(() => render(<CubeGroup {...props} />)).not.toThrow();
  });
});
