import React from 'react';
import { render } from '@testing-library/react';
import { CubePiece } from '../CubePiece';

// Mock Three.js components
jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
}));

jest.mock('@react-three/drei', () => ({}));

jest.mock('three', () => ({
  BoxGeometry: jest.fn(),
  PlaneGeometry: jest.fn(),
  FrontSide: 'FrontSide',
}));

// Mock the shape utilities
jest.mock('../../utils/shapes', () => ({
  createShapeWithFaceBorder: jest.fn(() => ({
    type: 'group',
    props: { position: [0, 0, 0.012] },
    children: []
  }))
}));

describe('CubePiece Component', () => {
  const defaultProps = {
    position: [0, 0, 0],
    colors: {
      front: 'white',
      back: 'yellow',
      right: 'red',
      left: 'orange',
      top: 'blue',
      bottom: 'green'
    },
    size: 0.95,
    pieceId: 0,
    isHighlighted: false,
    highlightInfo: null,
    rotatingFace: null,
    rotationProgress: 0
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => render(<CubePiece {...defaultProps} />)).not.toThrow();
  });

  it('should render with default props', () => {
    const { container } = render(<CubePiece {...defaultProps} />);
    expect(container).toBeDefined();
  });

  it('should render with custom size', () => {
    const props = { ...defaultProps, size: 1.5 };
    expect(() => render(<CubePiece {...props} />)).not.toThrow();
  });

  it('should render with different pieceId', () => {
    const props = { ...defaultProps, pieceId: 5 };
    expect(() => render(<CubePiece {...props} />)).not.toThrow();
  });

  it('should render highlighted piece', () => {
    const highlightInfo = {
      shapeType: 'Square',
      shapeColor: 'Red',
      pieceId: 0,
      blackVisibleFaces: ['front']
    };
    const props = { 
      ...defaultProps, 
      isHighlighted: true, 
      highlightInfo 
    };
    expect(() => render(<CubePiece {...props} />)).not.toThrow();
  });

  it('should render with rotating face', () => {
    const rotatingFace = { face: 'F', direction: 'clockwise' };
    const props = { 
      ...defaultProps, 
      rotatingFace, 
      rotationProgress: 0.5 
    };
    expect(() => render(<CubePiece {...props} />)).not.toThrow();
  });

  it('should handle different face positions', () => {
    const positions = [
      [1, 0, 0],   // Right face
      [-1, 0, 0],  // Left face
      [0, 1, 0],   // Top face
      [0, -1, 0],  // Bottom face
      [0, 0, 1],   // Front face
      [0, 0, -1]   // Back face
    ];

    positions.forEach(position => {
      const props = { ...defaultProps, position };
      expect(() => render(<CubePiece {...props} />)).not.toThrow();
    });
  });

  it('should handle different color combinations', () => {
    const colorSets = [
      { front: 'white', back: 'yellow', right: 'red', left: 'orange', top: 'blue', bottom: 'green' },
      { front: '#444444', back: '#444444', right: '#444444', left: '#444444', top: '#444444', bottom: '#444444' },
      { front: 'purple', back: 'cyan', right: 'magenta', left: 'lime', top: 'pink', bottom: 'black' }
    ];

    colorSets.forEach(colors => {
      const props = { ...defaultProps, colors };
      expect(() => render(<CubePiece {...props} />)).not.toThrow();
    });
  });

  it('should handle edge cases', () => {
    // Test with null colors
    const props1 = { ...defaultProps, colors: null };
    expect(() => render(<CubePiece {...props1} />)).not.toThrow();

    // Test with undefined colors
    const props2 = { ...defaultProps, colors: undefined };
    expect(() => render(<CubePiece {...props2} />)).not.toThrow();

    // Test with empty colors object
    const props3 = { ...defaultProps, colors: {} };
    expect(() => render(<CubePiece {...props3} />)).not.toThrow();
  });

  it('should handle different rotation progress values', () => {
    const progressValues = [0, 0.25, 0.5, 0.75, 1.0];
    
    progressValues.forEach(progress => {
      const props = { 
        ...defaultProps, 
        rotatingFace: { face: 'F', direction: 'clockwise' },
        rotationProgress: progress 
      };
      expect(() => render(<CubePiece {...props} />)).not.toThrow();
    });
  });

  it('should handle different rotating faces', () => {
    const faces = ['F', 'B', 'R', 'L', 'U', 'D'];
    const directions = ['clockwise', 'counterclockwise'];
    
    faces.forEach(face => {
      directions.forEach(direction => {
        const props = { 
          ...defaultProps, 
          rotatingFace: { face, direction },
          rotationProgress: 0.5 
        };
        expect(() => render(<CubePiece {...props} />)).not.toThrow();
      });
    });
  });

  it('should handle highlight info variations', () => {
    const highlightVariations = [
      {
        shapeType: 'Circle',
        shapeColor: 'Blue',
        pieceId: 1,
        blackVisibleFaces: ['back', 'right']
      },
      {
        shapeType: 'Triangle',
        shapeColor: 'Green',
        pieceId: 2,
        blackVisibleFaces: []
      },
      {
        shapeType: 'Diamond',
        shapeColor: 'Yellow',
        pieceId: 3,
        blackVisibleFaces: ['top', 'bottom', 'left']
      }
    ];

    highlightVariations.forEach(highlightInfo => {
      const props = { 
        ...defaultProps, 
        isHighlighted: true, 
        highlightInfo 
      };
      expect(() => render(<CubePiece {...props} />)).not.toThrow();
    });
  });

  it('should handle pieceId edge cases', () => {
    const pieceIds = [0, 25, 26, -1, 100];
    
    pieceIds.forEach(pieceId => {
      const props = { ...defaultProps, pieceId };
      expect(() => render(<CubePiece {...props} />)).not.toThrow();
    });
  });

  it('should handle size edge cases', () => {
    const sizes = [0, 0.1, 1.0, 2.0, 10.0, -1];
    
    sizes.forEach(size => {
      const props = { ...defaultProps, size };
      expect(() => render(<CubePiece {...props} />)).not.toThrow();
    });
  });

  it('should handle position edge cases', () => {
    const positions = [
      [0, 0, 0],     // Center
      [2, 2, 2],     // Outside normal range
      [-2, -2, -2],  // Outside normal range
      [0.5, 0.5, 0.5], // Non-integer
      [null, null, null], // Null values
      [undefined, undefined, undefined] // Undefined values
    ];

    positions.forEach(position => {
      const props = { ...defaultProps, position };
      expect(() => render(<CubePiece {...props} />)).not.toThrow();
    });
  });

  it('should handle complex combinations', () => {
    const complexProps = {
      position: [1, -1, 0],
      colors: {
        front: 'white',
        back: 'yellow',
        right: 'red',
        left: 'orange',
        top: 'blue',
        bottom: 'green'
      },
      size: 1.2,
      pieceId: 15,
      isHighlighted: true,
      highlightInfo: {
        shapeType: 'Triangle',
        shapeColor: 'Purple',
        pieceId: 15,
        blackVisibleFaces: ['front', 'back']
      },
      rotatingFace: { face: 'R', direction: 'counterclockwise' },
      rotationProgress: 0.8
    };

    expect(() => render(<CubePiece {...complexProps} />)).not.toThrow();
  });
});
