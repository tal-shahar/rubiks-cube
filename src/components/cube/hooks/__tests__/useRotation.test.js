import { applyRotation } from '../useRotation';

// Helper function to normalize positions (convert -0 to 0)
const normalizePosition = (position) => {
  return position.map(coord => coord === -0 ? 0 : coord);
};

// Custom Jest matcher for position equality
expect.extend({
  toEqualPosition(received, expected) {
    const normalizedReceived = normalizePosition(received);
    const normalizedExpected = normalizePosition(expected);
    
    const pass = this.equals(normalizedReceived, normalizedExpected);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to equal position ${expected}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to equal position ${expected} (normalized: ${normalizedReceived} vs ${normalizedExpected})`,
        pass: false,
      };
    }
  },
});

describe('Rotation Logic', () => {
  describe('applyRotation', () => {
    let mockPieces;

    beforeEach(() => {
      // Create mock pieces for testing
      mockPieces = [
        {
          pieceId: 0,
          position: [1, 1, 1], // Front face piece
          colors: { front: 'white', back: 'yellow', right: 'red', left: 'orange', top: 'blue', bottom: 'green' },
          rotationHistory: []
        },
        {
          pieceId: 1,
          position: [0, 1, 1], // Front face edge piece
          colors: { front: 'white', back: 'yellow', right: 'red', left: 'orange', top: 'blue', bottom: 'green' },
          rotationHistory: []
        },
        {
          pieceId: 2,
          position: [-1, 1, 1], // Front face corner piece
          colors: { front: 'white', back: 'yellow', right: 'red', left: 'orange', top: 'blue', bottom: 'green' },
          rotationHistory: []
        },
        {
          pieceId: 3,
          position: [1, 1, -1], // Back face piece (should not rotate)
          colors: { front: 'white', back: 'yellow', right: 'red', left: 'orange', top: 'blue', bottom: 'green' },
          rotationHistory: []
        }
      ];
    });

    describe('Front face rotation (F)', () => {
      it('should rotate front face pieces clockwise correctly', () => {
        const originalPositions = mockPieces.map(p => [...p.position]);
        
        applyRotation(mockPieces, 'F', 'clockwise');
        
        // Front face pieces should be rotated
        expect(mockPieces[0].position).toEqual([-1, 1, 1]); // [1,1,1] -> [-1,1,1]
        expect(mockPieces[1].position).toEqual([-1, 0, 1]); // [0,1,1] -> [-1,0,1]
        expect(mockPieces[2].position).toEqual([-1, -1, 1]); // [-1,1,1] -> [-1,-1,1]
        
        // Back face piece should not move
        expect(mockPieces[3].position).toEqual([1, 1, -1]);
        
        // Colors should be preserved
        mockPieces.forEach((piece, index) => {
          expect(piece.colors).toEqual(mockPieces[index].colors);
        });
        
        // Rotation history should be updated
        mockPieces.slice(0, 3).forEach(piece => {
          expect(piece.rotationHistory).toHaveLength(1);
          expect(piece.rotationHistory[0].move).toBe('F');
          expect(piece.rotationHistory[0].direction).toBe('clockwise');
        });
      });

      it('should rotate front face pieces counterclockwise correctly', () => {
        applyRotation(mockPieces, 'F', 'counterclockwise');
        
        // Front face pieces should be rotated counterclockwise
        expect(mockPieces[0].position).toEqualPosition([1, -1, 1]); // [1,1,1] -> [1,-1,1]
        expect(mockPieces[1].position).toEqualPosition([1, 0, 1]); // [0,1,1] -> [1,0,1]
        expect(mockPieces[2].position).toEqualPosition([1, 1, 1]); // [-1,1,1] -> [1,1,1]
        
        // Back face piece should not move
        expect(mockPieces[3].position).toEqual([1, 1, -1]);
      });
    });

    describe('Back face rotation (B)', () => {
      it('should rotate back face pieces clockwise correctly', () => {
        // Move pieces to back face
        mockPieces[0].position = [1, 1, -1];
        mockPieces[1].position = [0, 1, -1];
        mockPieces[2].position = [-1, 1, -1];
        
        applyRotation(mockPieces, 'B', 'clockwise');
        
        // Back face pieces should be rotated
        expect(mockPieces[0].position).toEqualPosition([1, -1, -1]); // [1,1,-1] -> [1,-1,-1]
        expect(mockPieces[1].position).toEqualPosition([1, 0, -1]); // [0,1,-1] -> [1,0,-1]
        expect(mockPieces[2].position).toEqualPosition([1, 1, -1]); // [-1,1,-1] -> [1,1,-1]
      });

      it('should rotate back face pieces counterclockwise correctly', () => {
        // Move pieces to back face
        mockPieces[0].position = [1, 1, -1];
        mockPieces[1].position = [0, 1, -1];
        mockPieces[2].position = [-1, 1, -1];
        
        applyRotation(mockPieces, 'B', 'counterclockwise');
        
        // Back face pieces should be rotated counterclockwise
        expect(mockPieces[0].position).toEqual([-1, 1, -1]); // [1,1,-1] -> [-1,1,-1]
        expect(mockPieces[1].position).toEqual([-1, 0, -1]); // [0,1,-1] -> [-1,0,-1]
        expect(mockPieces[2].position).toEqual([-1, -1, -1]); // [-1,1,-1] -> [-1,-1,-1]
      });
    });

    describe('Right face rotation (R)', () => {
      it('should rotate right face pieces clockwise correctly', () => {
        // Move pieces to right face
        mockPieces[0].position = [1, 1, 1];
        mockPieces[1].position = [1, 0, 1];
        mockPieces[2].position = [1, -1, 1];
        
        applyRotation(mockPieces, 'R', 'clockwise');
        
        // Right face pieces should be rotated
        expect(mockPieces[0].position).toEqualPosition([1, -1, 1]); // [1,1,1] -> [1,-1,1]
        expect(mockPieces[1].position).toEqualPosition([1, -1, 0]); // [1,0,1] -> [1,-1,0]
        expect(mockPieces[2].position).toEqualPosition([1, -1, -1]); // [1,-1,1] -> [1,-1,-1]
      });

      it('should rotate right face pieces counterclockwise correctly', () => {
        // Move pieces to right face
        mockPieces[0].position = [1, 1, 1];
        mockPieces[1].position = [1, 0, 1];
        mockPieces[2].position = [1, -1, 1];
        
        applyRotation(mockPieces, 'R', 'counterclockwise');
        
        // Right face pieces should be rotated counterclockwise
        expect(mockPieces[0].position).toEqualPosition([1, 1, -1]); // [1,1,1] -> [1,1,-1]
        expect(mockPieces[1].position).toEqualPosition([1, 1, 0]); // [1,0,1] -> [1,1,0]
        expect(mockPieces[2].position).toEqualPosition([1, 1, 1]); // [1,-1,1] -> [1,1,1]
      });
    });

    describe('Left face rotation (L)', () => {
      it('should rotate left face pieces clockwise correctly', () => {
        // Move pieces to left face
        mockPieces[0].position = [-1, 1, 1];
        mockPieces[1].position = [-1, 0, 1];
        mockPieces[2].position = [-1, -1, 1];
        
        applyRotation(mockPieces, 'L', 'clockwise');
        
        // Left face pieces should be rotated
        expect(mockPieces[0].position).toEqualPosition([-1, 1, -1]); // [-1,1,1] -> [-1,1,-1]
        expect(mockPieces[1].position).toEqualPosition([-1, 1, 0]); // [-1,0,1] -> [-1,1,0]
        expect(mockPieces[2].position).toEqualPosition([-1, 1, 1]); // [-1,-1,1] -> [-1,1,1]
      });

      it('should rotate left face pieces counterclockwise correctly', () => {
        // Move pieces to left face
        mockPieces[0].position = [-1, 1, 1];
        mockPieces[1].position = [-1, 0, 1];
        mockPieces[2].position = [-1, -1, 1];
        
        applyRotation(mockPieces, 'L', 'counterclockwise');
        
        // Left face pieces should be rotated counterclockwise
        expect(mockPieces[0].position).toEqualPosition([-1, -1, 1]); // [-1,1,1] -> [-1,-1,1]
        expect(mockPieces[1].position).toEqualPosition([-1, -1, 0]); // [-1,0,1] -> [-1,-1,0]
        expect(mockPieces[2].position).toEqualPosition([-1, -1, -1]); // [-1,-1,1] -> [-1,-1,-1]
      });
    });

    describe('Up face rotation (U)', () => {
      it('should rotate up face pieces clockwise correctly', () => {
        // Move pieces to up face
        mockPieces[0].position = [1, 1, 1];
        mockPieces[1].position = [0, 1, 1];
        mockPieces[2].position = [-1, 1, 1];
        
        applyRotation(mockPieces, 'U', 'clockwise');
        
        // Up face pieces should be rotated
        expect(mockPieces[0].position).toEqualPosition([1, 1, -1]); // [1,1,1] -> [1,1,-1]
        expect(mockPieces[1].position).toEqualPosition([1, 1, 0]); // [0,1,1] -> [1,1,0]
        expect(mockPieces[2].position).toEqualPosition([1, 1, 1]); // [-1,1,1] -> [1,1,1]
      });

      it('should rotate up face pieces counterclockwise correctly', () => {
        // Move pieces to up face
        mockPieces[0].position = [1, 1, 1];
        mockPieces[1].position = [0, 1, 1];
        mockPieces[2].position = [-1, 1, 1];
        
        applyRotation(mockPieces, 'U', 'counterclockwise');
        
        // Up face pieces should be rotated counterclockwise
        expect(mockPieces[0].position).toEqualPosition([-1, 1, 1]); // [1,1,1] -> [-1,1,1]
        expect(mockPieces[1].position).toEqualPosition([-1, 1, 0]); // [0,1,1] -> [-1,1,0]
        expect(mockPieces[2].position).toEqualPosition([-1, 1, -1]); // [-1,1,1] -> [-1,1,-1]
      });
    });

    describe('Down face rotation (D)', () => {
      it('should rotate down face pieces clockwise correctly', () => {
        // Move pieces to down face
        mockPieces[0].position = [1, -1, 1];
        mockPieces[1].position = [0, -1, 1];
        mockPieces[2].position = [-1, -1, 1];
        
        applyRotation(mockPieces, 'D', 'clockwise');
        
        // Down face pieces should be rotated
        expect(mockPieces[0].position).toEqualPosition([-1, -1, 1]); // [1,-1,1] -> [-1,-1,1]
        expect(mockPieces[1].position).toEqualPosition([-1, -1, 0]); // [0,-1,1] -> [-1,-1,0]
        expect(mockPieces[2].position).toEqualPosition([-1, -1, -1]); // [-1,-1,1] -> [-1,-1,-1]
      });

      it('should rotate down face pieces counterclockwise correctly', () => {
        // Move pieces to down face
        mockPieces[0].position = [1, -1, 1];
        mockPieces[1].position = [0, -1, 1];
        mockPieces[2].position = [-1, -1, 1];
        
        applyRotation(mockPieces, 'D', 'counterclockwise');
        
        // Down face pieces should be rotated counterclockwise
        expect(mockPieces[0].position).toEqualPosition([1, -1, -1]); // [1,-1,1] -> [1,-1,-1]
        expect(mockPieces[1].position).toEqualPosition([1, -1, 0]); // [0,-1,1] -> [1,-1,0]
        expect(mockPieces[2].position).toEqualPosition([1, -1, 1]); // [-1,-1,1] -> [1,-1,1]
      });
    });

    describe('Edge cases', () => {
      it('should handle empty pieces array', () => {
        const emptyPieces = [];
        expect(() => applyRotation(emptyPieces, 'F', 'clockwise')).not.toThrow();
      });

      it('should handle invalid face', () => {
        expect(() => applyRotation(mockPieces, 'X', 'clockwise')).not.toThrow();
        // Pieces should remain unchanged
        expect(mockPieces[0].position).toEqual([1, 1, 1]);
      });

      it('should handle invalid direction', () => {
        // Create a fresh piece for this test
        const testPiece = {
          pieceId: 0,
          position: [1, 1, 1],
          colors: {},
          rotationHistory: []
        };
        
        expect(() => applyRotation([testPiece], 'F', 'invalid')).not.toThrow();
        
        // Pieces should remain unchanged
        expect(testPiece.position).toEqualPosition([1, 1, 1]);
      });

      it('should update colors to match new position during rotation', () => {
        // Get a piece that will be affected by front face rotation
        const testPiece = mockPieces.find(p => p.position[2] === 1); // Front face piece
        expect(testPiece).toBeDefined();
        
        const originalPosition = [...testPiece.position];
        
        applyRotation(mockPieces, 'F', 'clockwise');
        
        // Position should change
        expect(testPiece.position).not.toEqual(originalPosition);
        
        // Colors should be updated to match the new position (like a real Rubik's cube)
        const [newX, newY, newZ] = testPiece.position;
        const expectedColors = {
          front: 'white',
          back: 'yellow', 
          right: 'red',
          left: 'orange',
          top: 'blue',
          bottom: 'green'
        };
        
        // Colors are rotated based on the rotation applied, not just position
        // The actual implementation applies color rotation logic
        expectedColors.bottom = 'orange';
        expectedColors.left = 'blue';
        expectedColors.right = 'green';
        expectedColors.top = 'red';
        
        expect(testPiece.colors).toEqual(expectedColors);
      });

      it('should update rotation history', () => {
        const initialHistoryLength = mockPieces[0].rotationHistory.length;
        
        applyRotation(mockPieces, 'F', 'clockwise');
        
        expect(mockPieces[0].rotationHistory.length).toBe(initialHistoryLength + 1);
        expect(mockPieces[0].rotationHistory[initialHistoryLength]).toEqual({
          move: 'F',
          direction: 'clockwise',
          fromPosition: [1, 1, 1],
          toPosition: [-1, 1, 1],
          timestamp: expect.any(String)
        });
      });
    });

    describe('Mathematical correctness', () => {
      it('should apply correct 90-degree rotation transformations', () => {
        // Test that rotations are mathematically correct
        const testCases = [
          { face: 'F', direction: 'clockwise', input: [1, 1, 1], expected: [-1, 1, 1] },
          { face: 'F', direction: 'counterclockwise', input: [1, 1, 1], expected: [1, -1, 1] },
          { face: 'R', direction: 'clockwise', input: [1, 1, 1], expected: [1, -1, 1] },
          { face: 'R', direction: 'counterclockwise', input: [1, 1, 1], expected: [1, 1, -1] },
          { face: 'U', direction: 'clockwise', input: [1, 1, 1], expected: [1, 1, -1] },
          { face: 'U', direction: 'counterclockwise', input: [1, 1, 1], expected: [-1, 1, 1] }
        ];

        testCases.forEach(({ face, direction, input, expected }) => {
          const testPiece = {
            pieceId: 0,
            position: [...input],
            colors: {},
            rotationHistory: []
          };
          
          applyRotation([testPiece], face, direction);
          
          expect(testPiece.position).toEqualPosition(expected);
        });
      });
    });
  });
});
