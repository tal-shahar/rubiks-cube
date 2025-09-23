import React from 'react';
import { render, act } from '@testing-library/react';

// Mock the color utilities BEFORE importing CubeStateProvider
jest.doMock('../../utils/colors', () => {
  console.log('🎯 MOCK: Color utilities mock is being applied');
  return {
    getOriginalColors: jest.fn((pieceId) => {
      console.log(`🎯 MOCK: getOriginalColors called with pieceId: ${pieceId}`);
      return {
        front: 'white',
        back: 'yellow',
        right: 'red',
        left: 'orange',
        top: 'blue',
        bottom: 'green'
      };
    }),
    getStartingPositionColors: jest.fn((pieceId) => {
      console.log(`🎯 MOCK: getStartingPositionColors called with pieceId: ${pieceId}`);
      return {
        position: [0, 0, 0],
        visibleColors: {
          front: 'white',
          back: 'yellow',
          right: 'red',
          left: 'orange',
          top: 'blue',
          bottom: 'green'
        }
      };
    })
  };
});

import { CubeStateProvider, CubeStateManager } from '../CubeStateProvider';

describe('CubeStateProvider', () => {
  beforeEach(() => {
    // Reset the CubeStateManager before each test
    CubeStateManager.state = null;
    CubeStateManager.initialized = false;
    CubeStateManager.listeners = [];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CubeStateManager', () => {
    it('should initialize with correct state structure', () => {
      const state = CubeStateManager.getState();
      
      expect(state).toBeDefined();
      expect(Array.isArray(state)).toBe(true);
      expect(state).toHaveLength(26); // 3x3x3 minus center piece
      
      // Check that each piece has required properties
      state.forEach((piece, index) => {
        expect(piece).toHaveProperty('position');
        expect(piece).toHaveProperty('colors');
        expect(piece).toHaveProperty('startingColors');
        expect(piece).toHaveProperty('rotationHistory');
        expect(piece).toHaveProperty('pieceId');
        
        expect(Array.isArray(piece.position)).toBe(true);
        expect(piece.position).toHaveLength(3);
        expect(typeof piece.colors).toBe('object');
        expect(Array.isArray(piece.rotationHistory)).toBe(true);
        expect(piece.pieceId).toBe(index);
      });
    });

    it('should only initialize once', () => {
      const state1 = CubeStateManager.getState();
      const state2 = CubeStateManager.getState();
      
      expect(state1).toBe(state2); // Same reference
      expect(CubeStateManager.initialized).toBe(true);
    });

    it('should update state correctly', () => {
      const initialState = CubeStateManager.getState();
      const newState = [...initialState];
      newState[0].position = [2, 2, 2]; // Modify first piece
      
      CubeStateManager.setState(newState);
      
      const updatedState = CubeStateManager.getState();
      expect(updatedState[0].position).toEqual([2, 2, 2]);
    });

    it('should handle function-based state updates', () => {
      const initialState = CubeStateManager.getState();
      
      CubeStateManager.setState(prevState => {
        const newState = [...prevState];
        newState[0].position = [3, 3, 3];
        return newState;
      });
      
      const updatedState = CubeStateManager.getState();
      expect(updatedState[0].position).toEqual([3, 3, 3]);
    });

    it('should notify listeners on state change', () => {
      const listener = jest.fn();
      const unsubscribe = CubeStateManager.subscribe(listener);
      
      CubeStateManager.setState(prevState => prevState ? [...prevState] : []);
      
      expect(listener).toHaveBeenCalledTimes(1);
      
      unsubscribe();
      CubeStateManager.setState(prevState => prevState ? [...prevState] : []);
      
      expect(listener).toHaveBeenCalledTimes(1); // Should not be called again
    });

    it('should handle multiple listeners', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      CubeStateManager.subscribe(listener1);
      CubeStateManager.subscribe(listener2);
      
      CubeStateManager.setState(prevState => prevState ? [...prevState] : []);
      
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });

  describe('CubeStateProvider Component', () => {
    it('should render children with state', () => {
      const mockChildren = jest.fn(() => <div>Test</div>);
      
      render(
        <CubeStateProvider onCubeStateChange={jest.fn()}>
          {mockChildren}
        </CubeStateProvider>
      );
      
      expect(mockChildren).toHaveBeenCalledWith(
        expect.objectContaining({
          cubeState: expect.any(Array),
          isAnimating: expect.any(Boolean),
          rotatingFace: expect.any(Object),
          rotationProgress: expect.any(Number),
          setCubeState: expect.any(Function),
          setIsAnimating: expect.any(Function),
          setRotatingFace: expect.any(Function),
          setRotationProgress: expect.any(Function),
          moveHistory: expect.any(Array),
          setMoveHistory: expect.any(Function),
          hasRotated: expect.any(Boolean),
          setHasRotated: expect.any(Function)
        })
      );
    });

    it('should provide initial state values', () => {
      const mockChildren = jest.fn(() => <div>Test</div>);
      
      render(
        <CubeStateProvider onCubeStateChange={jest.fn()}>
          {mockChildren}
        </CubeStateProvider>
      );
      
      const stateProps = mockChildren.mock.calls[0][0];
      
      expect(stateProps.isAnimating).toBe(false);
      expect(stateProps.rotatingFace).toBe(null);
      expect(stateProps.rotationProgress).toBe(0);
      expect(stateProps.moveHistory).toEqual([]);
      expect(stateProps.hasRotated).toBe(false);
      expect(stateProps.cubeState).toHaveLength(26);
    });

    it('should not call onCubeStateChange to prevent circular dependency', () => {
      const onCubeStateChange = jest.fn();
      const mockChildren = jest.fn(() => <div>Test</div>);
      
      render(
        <CubeStateProvider onCubeStateChange={onCubeStateChange}>
          {mockChildren}
        </CubeStateProvider>
      );
      
      // onCubeStateChange should not be called to prevent circular dependency
      expect(onCubeStateChange).not.toHaveBeenCalled();
    });

    it('should update state when setCubeState is called', () => {
      let stateProps;
      const mockChildren = jest.fn((props) => {
        stateProps = props;
        return <div>Test</div>;
      });
      
      render(
        <CubeStateProvider onCubeStateChange={jest.fn()}>
          {mockChildren}
        </CubeStateProvider>
      );
      
      const newState = [...stateProps.cubeState];
      newState[0].position = [5, 5, 5];
      
      act(() => {
        stateProps.setCubeState(newState);
      });
      
      expect(stateProps.cubeState[0].position).toEqual([5, 5, 5]);
    });

    it('should update animation state when setIsAnimating is called', () => {
      let stateProps;
      const mockChildren = jest.fn((props) => {
        stateProps = props;
        return <div>Test</div>;
      });
      
      render(
        <CubeStateProvider onCubeStateChange={jest.fn()}>
          {mockChildren}
        </CubeStateProvider>
      );
      
      act(() => {
        stateProps.setIsAnimating(true);
      });
      
      expect(stateProps.isAnimating).toBe(true);
    });

    it('should update rotating face when setRotatingFace is called', () => {
      let stateProps;
      const mockChildren = jest.fn((props) => {
        stateProps = props;
        return <div>Test</div>;
      });
      
      render(
        <CubeStateProvider onCubeStateChange={jest.fn()}>
          {mockChildren}
        </CubeStateProvider>
      );
      
      const rotatingFace = { face: 'F', direction: 'clockwise' };
      
      act(() => {
        stateProps.setRotatingFace(rotatingFace);
      });
      
      expect(stateProps.rotatingFace).toEqual(rotatingFace);
    });

    it('should update rotation progress when setRotationProgress is called', () => {
      let stateProps;
      const mockChildren = jest.fn((props) => {
        stateProps = props;
        return <div>Test</div>;
      });
      
      render(
        <CubeStateProvider onCubeStateChange={jest.fn()}>
          {mockChildren}
        </CubeStateProvider>
      );
      
      act(() => {
        stateProps.setRotationProgress(0.5);
      });
      
      expect(stateProps.rotationProgress).toBe(0.5);
    });

    it('should update move history when setMoveHistory is called', () => {
      let stateProps;
      const mockChildren = jest.fn((props) => {
        stateProps = props;
        return <div>Test</div>;
      });
      
      render(
        <CubeStateProvider onCubeStateChange={jest.fn()}>
          {mockChildren}
        </CubeStateProvider>
      );
      
      const newHistory = [{ face: 'F', direction: 'clockwise', timestamp: Date.now() }];
      
      act(() => {
        stateProps.setMoveHistory(newHistory);
      });
      
      expect(stateProps.moveHistory).toEqual(newHistory);
    });

    it('should update hasRotated when setHasRotated is called', () => {
      let stateProps;
      const mockChildren = jest.fn((props) => {
        stateProps = props;
        return <div>Test</div>;
      });
      
      render(
        <CubeStateProvider onCubeStateChange={jest.fn()}>
          {mockChildren}
        </CubeStateProvider>
      );
      
      act(() => {
        stateProps.setHasRotated(true);
      });
      
      expect(stateProps.hasRotated).toBe(true);
    });

    it('should handle function-based setCubeState calls', () => {
      let stateProps;
      const mockChildren = jest.fn((props) => {
        stateProps = props;
        return <div>Test</div>;
      });
      
      render(
        <CubeStateProvider onCubeStateChange={jest.fn()}>
          {mockChildren}
        </CubeStateProvider>
      );
      
      act(() => {
        stateProps.setCubeState(prevState => {
          const newState = [...prevState];
          newState[0].position = [10, 10, 10];
          return newState;
        });
      });
      
      expect(stateProps.cubeState[0].position).toEqual([10, 10, 10]);
    });
  });

  describe('Integration tests', () => {
    it('should maintain state consistency across multiple updates', () => {
      let stateProps;
      const mockChildren = jest.fn((props) => {
        stateProps = props;
        return <div>Test</div>;
      });
      
      render(
        <CubeStateProvider onCubeStateChange={jest.fn()}>
          {mockChildren}
        </CubeStateProvider>
      );
      
      // Multiple state updates
      act(() => {
        stateProps.setIsAnimating(true);
        stateProps.setRotatingFace({ face: 'F', direction: 'clockwise' });
        stateProps.setRotationProgress(0.3);
        stateProps.setCubeState(prevState => {
          const newState = [...prevState];
          newState[0].position = [1, 2, 3];
          return newState;
        });
      });
      
      expect(stateProps.isAnimating).toBe(true);
      expect(stateProps.rotatingFace).toEqual({ face: 'F', direction: 'clockwise' });
      expect(stateProps.rotationProgress).toBe(0.3);
      expect(stateProps.cubeState[0].position).toEqual([1, 2, 3]);
    });
  });
});
