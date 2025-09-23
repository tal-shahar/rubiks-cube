import React from 'react';
import { render } from '@testing-library/react';
import { RubiksCube } from '../RubiksCube';

// Mock Three.js and React Three Fiber
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'canvas' }, children);
  },
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'orbit-controls' });
  },
  Environment: () => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'environment' });
  },
}));

// Mock the CubeStateProvider
jest.mock('../state/CubeStateProvider', () => ({
  CubeStateProvider: ({ children, onCubeStateChange }) => {
    const mockState = {
      cubeState: [
        { pieceId: 0, position: [0, 0, 0], colors: {}, rotationHistory: [] }
      ],
      isAnimating: false,
      rotatingFace: null,
      rotationProgress: 0,
      setCubeState: jest.fn(),
      setIsAnimating: jest.fn(),
      setRotatingFace: jest.fn(),
      setRotationProgress: jest.fn(),
      moveHistory: [],
      setMoveHistory: jest.fn(),
      hasRotated: false,
      setHasRotated: jest.fn()
    };

    React.useEffect(() => {
      if (onCubeStateChange) {
        onCubeStateChange(mockState.cubeState);
      }
    }, [onCubeStateChange]);

    return children(mockState);
  }
}));

// Mock the CubeGroup component
jest.mock('../components/CubeGroup', () => ({
  CubeGroup: ({ cubeState, isAnimating, rotatingFace, rotationProgress, onRotateFace, onScramble, onReset, onSolve }) => {
    React.useEffect(() => {
      if (onRotateFace) onRotateFace(jest.fn());
      if (onScramble) onScramble(jest.fn());
      if (onReset) onReset(jest.fn());
      if (onSolve) onSolve(jest.fn());
    }, [onRotateFace, onScramble, onReset, onSolve]);

    return React.createElement('div', { 
      'data-testid': 'cube-group',
      'data-cube-state-length': cubeState?.length || 0,
      'data-is-animating': isAnimating,
      'data-rotating-face': JSON.stringify(rotatingFace),
      'data-rotation-progress': rotationProgress
    }, 'CubeGroup');
  }
}));

// Mock the useRotation hook
jest.mock('../hooks/useRotation', () => ({
  useRotation: jest.fn(() => ({
    rotateFace: jest.fn(),
    rotateFaceWithAnimation: jest.fn(),
    executeMovesWithAnimation: jest.fn(),
    applyRotation: jest.fn()
  }))
}));

// Mock the color utilities
jest.mock('../utils/colors', () => ({
  getOriginalColors: jest.fn(() => ({
    front: 'white',
    back: 'yellow',
    right: 'red',
    left: 'orange',
    top: 'blue',
    bottom: 'green'
  })),
  getStartingPositionColors: jest.fn(() => ({
    position: [0, 0, 0],
    visibleColors: {
      front: 'white',
      back: 'yellow',
      right: 'red',
      left: 'orange',
      top: 'blue',
      bottom: 'green'
    }
  }))
}));

describe('RubiksCube Component', () => {
  const defaultProps = {
    isRotating: false,
    autoRotate: false,
    onScramble: jest.fn(),
    onReset: jest.fn(),
    onSolve: jest.fn(),
    onRotateFace: jest.fn(),
    onCubeStateChange: jest.fn(),
    highlightedPieces: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => render(<RubiksCube {...defaultProps} />)).not.toThrow();
  });

  it('should render Canvas component', () => {
    const { getByTestId } = render(<RubiksCube {...defaultProps} />);
    expect(getByTestId('canvas')).toBeInTheDocument();
  });

  it('should render OrbitControls', () => {
    const { getByTestId } = render(<RubiksCube {...defaultProps} />);
    expect(getByTestId('orbit-controls')).toBeInTheDocument();
  });

  it('should render Environment', () => {
    const { getByTestId } = render(<RubiksCube {...defaultProps} />);
    expect(getByTestId('environment')).toBeInTheDocument();
  });

  it('should render CubeGroup', () => {
    const { getByTestId } = render(<RubiksCube {...defaultProps} />);
    expect(getByTestId('cube-group')).toBeInTheDocument();
  });

  it('should pass correct props to CubeGroup', () => {
    const { getByTestId } = render(<RubiksCube {...defaultProps} />);
    const cubeGroup = getByTestId('cube-group');
    
    expect(cubeGroup).toHaveAttribute('data-cube-state-length', '1');
    expect(cubeGroup).toHaveAttribute('data-is-animating', 'false');
    expect(cubeGroup).toHaveAttribute('data-rotating-face', 'null');
    expect(cubeGroup).toHaveAttribute('data-rotation-progress', '0');
  });

  it('should handle isRotating prop', () => {
    const props = { ...defaultProps, isRotating: true };
    const { getByTestId } = render(<RubiksCube {...props} />);
    const cubeGroup = getByTestId('cube-group');
    
    expect(cubeGroup).toBeInTheDocument();
  });

  it('should handle autoRotate prop', () => {
    const props = { ...defaultProps, autoRotate: true };
    const { getByTestId } = render(<RubiksCube {...props} />);
    const cubeGroup = getByTestId('cube-group');
    
    expect(cubeGroup).toBeInTheDocument();
  });

  it('should handle highlightedPieces prop', () => {
    const highlightedPieces = [
      { pieceId: 0, blackVisibleFaces: ['front'] },
      { pieceId: 1, blackVisibleFaces: ['back'] }
    ];
    const props = { ...defaultProps, highlightedPieces };
    
    expect(() => render(<RubiksCube {...props} />)).not.toThrow();
  });

  it('should call onCubeStateChange when state changes', () => {
    render(<RubiksCube {...defaultProps} />);
    
    expect(defaultProps.onCubeStateChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          pieceId: expect.any(Number),
          position: expect.any(Array),
          colors: expect.any(Object)
        })
      ])
    );
  });

  it('should set up refs for parent callbacks', () => {
    render(<RubiksCube {...defaultProps} />);
    
    expect(defaultProps.onRotateFace).toHaveBeenCalledWith(expect.any(Function));
    expect(defaultProps.onScramble).toHaveBeenCalledWith(expect.any(Function));
    expect(defaultProps.onReset).toHaveBeenCalledWith(expect.any(Function));
    expect(defaultProps.onSolve).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should handle missing callback props gracefully', () => {
    const propsWithoutCallbacks = {
      isRotating: false,
      autoRotate: false,
      highlightedPieces: []
    };
    
    expect(() => render(<RubiksCube {...propsWithoutCallbacks} />)).not.toThrow();
  });

  it('should handle null callback props gracefully', () => {
    const propsWithNullCallbacks = {
      ...defaultProps,
      onScramble: null,
      onReset: null,
      onSolve: null,
      onRotateFace: null,
      onCubeStateChange: null
    };
    
    expect(() => render(<RubiksCube {...propsWithNullCallbacks} />)).not.toThrow();
  });

  it('should handle undefined callback props gracefully', () => {
    const propsWithUndefinedCallbacks = {
      ...defaultProps,
      onScramble: undefined,
      onReset: undefined,
      onSolve: undefined,
      onRotateFace: undefined,
      onCubeStateChange: undefined
    };
    
    expect(() => render(<RubiksCube {...propsWithUndefinedCallbacks} />)).not.toThrow();
  });

  it('should handle complex highlightedPieces', () => {
    const complexHighlightedPieces = [
      {
        pieceId: 0,
        blackVisibleFaces: ['front', 'right', 'top']
      },
      {
        pieceId: 5,
        blackVisibleFaces: ['back', 'left', 'bottom']
      },
      {
        pieceId: 10,
        blackVisibleFaces: []
      }
    ];
    
    const props = { ...defaultProps, highlightedPieces: complexHighlightedPieces };
    expect(() => render(<RubiksCube {...props} />)).not.toThrow();
  });

  it('should handle empty highlightedPieces array', () => {
    const props = { ...defaultProps, highlightedPieces: [] };
    expect(() => render(<RubiksCube {...props} />)).not.toThrow();
  });

  it('should handle null highlightedPieces', () => {
    const props = { ...defaultProps, highlightedPieces: null };
    expect(() => render(<RubiksCube {...props} />)).not.toThrow();
  });

  it('should handle undefined highlightedPieces', () => {
    const props = { ...defaultProps, highlightedPieces: undefined };
    expect(() => render(<RubiksCube {...props} />)).not.toThrow();
  });

  it('should handle all boolean combinations', () => {
    const booleanCombinations = [
      { isRotating: false, autoRotate: false },
      { isRotating: false, autoRotate: true },
      { isRotating: true, autoRotate: false },
      { isRotating: true, autoRotate: true }
    ];

    booleanCombinations.forEach(combination => {
      const props = { ...defaultProps, ...combination };
      expect(() => render(<RubiksCube {...props} />)).not.toThrow();
    });
  });

  it('should maintain component structure', () => {
    const { container } = render(<RubiksCube {...defaultProps} />);
    
    // Should have Canvas as root
    expect(container.firstChild).toHaveAttribute('data-testid', 'canvas');
    
    // Should have OrbitControls and Environment inside Canvas
    const canvas = container.firstChild;
    expect(canvas.querySelector('[data-testid="orbit-controls"]')).toBeInTheDocument();
    expect(canvas.querySelector('[data-testid="environment"]')).toBeInTheDocument();
    expect(canvas.querySelector('[data-testid="cube-group"]')).toBeInTheDocument();
  });

  it('should handle re-renders correctly', () => {
    const { rerender } = render(<RubiksCube {...defaultProps} />);
    
    // Re-render with different props
    const newProps = { ...defaultProps, isRotating: true, autoRotate: true };
    expect(() => rerender(<RubiksCube {...newProps} />)).not.toThrow();
    
    // Re-render with same props
    expect(() => rerender(<RubiksCube {...defaultProps} />)).not.toThrow();
  });
});
