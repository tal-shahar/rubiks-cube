import { AdvancedSolver, advancedSolver } from '../advancedSolver';

describe('AdvancedSolver', () => {
  let solver;
  let mockCubeState;

  beforeEach(() => {
    solver = new AdvancedSolver();
    
    // Create a mock cube state with proper solved positions
    // For a truly solved cube, we need pieces in their original positions with no rotation history
    mockCubeState = {
      pieces: [
        // Mock pieces in solved positions with no rotation history
        // Each piece should have colors that match the face they're on
        { 
          pieceId: 0,
          position: [-1, -1, -1], 
          originalPosition: [-1, -1, -1], 
          rotation: 0,
          colors: { front: 'white', back: 'yellow', right: 'red', left: 'orange', top: 'blue', bottom: 'green' },
          rotationHistory: []
        },
        { 
          pieceId: 1,
          position: [0, -1, -1], 
          originalPosition: [0, -1, -1], 
          rotation: 0,
          colors: { front: 'white', back: 'yellow', right: 'red', left: 'orange', top: 'blue', bottom: 'green' },
          rotationHistory: []
        },
        { 
          pieceId: 2,
          position: [1, -1, -1], 
          originalPosition: [1, -1, -1], 
          rotation: 0,
          colors: { front: 'white', back: 'yellow', right: 'red', left: 'orange', top: 'blue', bottom: 'green' },
          rotationHistory: []
        },
        { 
          pieceId: 3,
          position: [-1, 0, -1], 
          originalPosition: [-1, 0, -1], 
          rotation: 0,
          colors: { front: 'white', back: 'yellow', right: 'red', left: 'orange', top: 'blue', bottom: 'green' },
          rotationHistory: []
        }
      ]
    };
  });

  describe('analyzeComplexity', () => {
    test('should analyze solved cube as easy', () => {
      // Create a truly solved cube state with correct face colors
      const solvedPieces = [
        { 
          pieceId: 0,
          position: [-1, -1, -1], 
          originalPosition: [-1, -1, -1], 
          rotation: 0,
          colors: { front: 'red', back: 'orange', right: 'green', left: 'blue', top: 'white', bottom: 'yellow' },
          rotationHistory: []
        }
      ];
      const complexity = solver.analyzeComplexity(solvedPieces);
      
      expect(complexity.score).toBeLessThanOrEqual(20);
      expect(complexity.difficulty).toBe('Easy');
    });

    test('should analyze scrambled cube as harder', () => {
      // Create a more scrambled state
      const scrambledPieces = mockCubeState.pieces.map(piece => ({
        ...piece,
        position: [Math.random(), Math.random(), Math.random()],
        rotation: Math.floor(Math.random() * 3)
      }));
      
      const complexity = solver.analyzeComplexity(scrambledPieces);
      
      expect(complexity.score).toBeGreaterThan(20);
      expect(['Medium', 'Hard', 'Very Hard']).toContain(complexity.difficulty);
    });

    test('should handle null cube state', () => {
      const complexity = solver.analyzeComplexity(null);
      
      expect(complexity.score).toBe(50);
      expect(complexity.difficulty).toBe('Medium');
    });
  });

  describe('isSolved', () => {
    test('should return true for solved cube', () => {
      // Create a truly solved cube state with proper face colors
      const solvedPieces = [
        { 
          pieceId: 0,
          position: [-1, -1, -1], 
          originalPosition: [-1, -1, -1], 
          rotation: 0,
          colors: { front: 'red', back: 'orange', right: 'green', left: 'blue', top: 'white', bottom: 'yellow' },
          rotationHistory: []
        }
      ];
      const isSolved = solver.isSolved(solvedPieces);
      expect(isSolved).toBe(true);
    });

    test('should return false for scrambled cube', () => {
      const scrambledPieces = mockCubeState.pieces.map(piece => ({
        ...piece,
        position: [1, 1, 1], // Moved from original position
        rotation: 1 // Rotated
      }));
      
      const isSolved = solver.isSolved(scrambledPieces);
      expect(isSolved).toBe(false);
    });

    test('should handle null cube state', () => {
      const isSolved = solver.isSolved(null);
      expect(isSolved).toBe(false);
    });
  });

  describe('solve', () => {
    test('should return already solved for solved cube', () => {
      // Create a truly solved cube state
      const solvedPieces = [
        { 
          pieceId: 0,
          position: [-1, -1, -1], 
          originalPosition: [-1, -1, -1], 
          rotation: 0,
          colors: { front: 'red', back: 'orange', right: 'green', left: 'blue', top: 'white', bottom: 'yellow' },
          rotationHistory: []
        }
      ];
      const result = solver.solve(solvedPieces);
      
      expect(result.success).toBe(true);
      expect(result.solution).toEqual([]);
      expect(result.method).toBe('Already Solved');
    });

    test('should choose appropriate method for simple scrambles', () => {
      // Mock a simple scramble
      const simpleScramble = mockCubeState.pieces.map(piece => ({
        ...piece,
        position: [piece.originalPosition[0] + 0.1, piece.originalPosition[1], piece.originalPosition[2]]
      }));
      
      const result = solver.solve(simpleScramble);
      
      expect(['Simple Reverse', 'Simple Reverse - Already Solved', 'Layer-by-Layer', 'CFOP', 'Simplified Kociemba']).toContain(result.method);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.solution)).toBe(true);
    });
  });

  describe('generateScramble', () => {
    test('should generate scramble of correct length', () => {
      const scramble = solver.generateScramble(10);
      
      expect(scramble).toHaveLength(10);
      expect(Array.isArray(scramble)).toBe(true);
    });

    test('should not have consecutive moves on same face', () => {
      const scramble = solver.generateScramble(20);
      
      for (let i = 0; i < scramble.length - 1; i++) {
        const face1 = scramble[i][0];
        const face2 = scramble[i + 1][0];
        expect(face1).not.toBe(face2);
      }
    });

    test('should use valid face notation', () => {
      const scramble = solver.generateScramble(10);
      const validFaces = ['U', 'D', 'F', 'B', 'L', 'R'];
      
      scramble.forEach(move => {
        expect(validFaces).toContain(move[0]);
      });
    });
  });

  describe('optimizeSolution', () => {
    test('should remove cancellations', () => {
      const solution = ['R', "R'", 'U', 'D'];
      const optimized = solver.optimizeSolution(solution);
      
      expect(optimized).toEqual(['U', 'D']);
    });

    test('should combine identical moves', () => {
      const solution = ['R', 'R', 'U', 'U'];
      const optimized = solver.optimizeSolution(solution);
      
      expect(optimized).toEqual(['R2', 'U2']);
    });

    test('should handle empty solution', () => {
      const optimized = solver.optimizeSolution([]);
      expect(optimized).toEqual([]);
    });

    test('should handle null solution', () => {
      const optimized = solver.optimizeSolution(null);
      expect(optimized).toEqual(null);
    });
  });

  describe('utility methods', () => {
    test('getDirection should extract direction correctly', () => {
      expect(solver.getDirection('R')).toBe('');
      expect(solver.getDirection("R'")).toBe("'");
      expect(solver.getDirection('R2')).toBe('2');
    });

    test('cancelsOut should detect cancellations', () => {
      expect(solver.cancelsOut('R', "R'")).toBe(true);
      expect(solver.cancelsOut("R'", 'R')).toBe(true);
      expect(solver.cancelsOut('R', 'U')).toBe(false);
    });

    test('canCombine should detect combinable moves', () => {
      expect(solver.canCombine('R', 'R')).toBe(true);
      expect(solver.canCombine('R', "R'")).toBe(false);
      expect(solver.canCombine('R', 'U')).toBe(false);
    });
  });

  describe('singleton instance', () => {
    test('should export singleton instance', () => {
      expect(advancedSolver).toBeInstanceOf(AdvancedSolver);
    });

    test('should have same methods as class', () => {
      expect(typeof advancedSolver.solve).toBe('function');
      expect(typeof advancedSolver.analyzeComplexity).toBe('function');
      expect(typeof advancedSolver.generateScramble).toBe('function');
    });
  });
});
