import { 
  getOriginalColors, 
  getStartingPositionColors, 
  ensureStartingColorsOutwardFacing, 
  getExpectedColorForFace 
} from '../colors';

describe('Color Utilities', () => {
  describe('getOriginalColors', () => {
    it('should return correct colors for corner pieces', () => {
      // Piece 0: [-1, -1, -1] - back-bottom-left corner piece
      const colors = getOriginalColors(0);
      
      expect(colors).toEqual({
        front: '#444444',    // Not visible (z = -1)
        back: 'yellow',      // Visible (z = -1)
        right: '#444444',    // Not visible (x = -1)
        left: 'orange',      // Visible (x = -1)
        top: '#444444',      // Not visible (y = -1)
        bottom: 'green'      // Visible (y = -1)
      });
    });

    it('should return correct colors for edge pieces', () => {
      // Piece 1: [-1, -1, 0] - edge piece (left-bottom)
      const colors = getOriginalColors(1);
      
      expect(colors).toEqual({
        front: '#444444',
        back: '#444444',
        right: '#444444',
        left: 'orange',     // x = -1
        top: '#444444',
        bottom: 'green'     // y = -1
      });
    });

    it('should return correct colors for center pieces', () => {
      // Piece 13: [0, 0, 1] - front center piece
      const colors = getOriginalColors(13);
      
      expect(colors).toEqual({
        front: 'white',      // Visible (z = 1)
        back: '#444444',    // Not visible (z = 1)
        right: '#444444',   // Not visible (x = 0)
        left: '#444444',    // Not visible (x = 0)
        top: '#444444',     // Not visible (y = 0)
        bottom: '#444444'   // Not visible (y = 0)
      });
    });

    it('should return correct colors for front-top-right corner', () => {
      // Piece 25: [1, 1, 1] - front-top-right corner piece
      const colors = getOriginalColors(25);
      
      expect(colors).toEqual({
        front: 'white',      // Visible (z = 1)
        back: '#444444',    // Not visible (z = 1)
        right: 'red',       // Visible (x = 1)
        left: '#444444',    // Not visible (x = 1)
        top: 'blue',        // Visible (y = 1)
        bottom: '#444444'   // Not visible (y = 1)
      });
    });

    it('should handle all 26 pieces correctly', () => {
      for (let i = 0; i < 26; i++) {
        const colors = getOriginalColors(i);
        
        // Should have all face properties
        expect(colors).toHaveProperty('front');
        expect(colors).toHaveProperty('back');
        expect(colors).toHaveProperty('right');
        expect(colors).toHaveProperty('left');
        expect(colors).toHaveProperty('top');
        expect(colors).toHaveProperty('bottom');
        
        // Should have valid color values
        Object.values(colors).forEach(color => {
          expect(typeof color).toBe('string');
          expect(color.length).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('getStartingPositionColors', () => {
    it('should return correct starting colors for corner piece', () => {
      const result = getStartingPositionColors(0);
      
      expect(result).toHaveProperty('position');
      expect(result).toHaveProperty('visibleColors');
      expect(result.position).toEqual([-1, -1, -1]);
      
      expect(result.visibleColors).toEqual({
        front: null,
        back: 'yellow',
        right: null,
        left: 'orange',
        top: null,
        bottom: 'green'
      });
    });

    it('should return correct starting colors for edge piece', () => {
      const result = getStartingPositionColors(1);
      
      expect(result.position).toEqual([-1, -1, 0]);
      expect(result.visibleColors).toEqual({
        front: null,
        back: null,
        right: null,
        left: 'orange',     // x = -1
        top: null,
        bottom: 'green'     // y = -1
      });
    });

    it('should handle all 26 pieces correctly', () => {
      for (let i = 0; i < 26; i++) {
        const result = getStartingPositionColors(i);
        
        expect(result).toHaveProperty('position');
        expect(result).toHaveProperty('visibleColors');
        expect(Array.isArray(result.position)).toBe(true);
        expect(result.position).toHaveLength(3);
        
        // Position should be valid 3D coordinates
        result.position.forEach(coord => {
          expect([-1, 0, 1]).toContain(coord);
        });
      }
    });
  });

  describe('ensureStartingColorsOutwardFacing', () => {
    it('should position colors correctly for front face piece', () => {
      const piece = {
        pieceId: 0,
        startingColors: {
          visibleColors: {
            front: 'white',
            back: 'yellow',
            right: 'red',
            left: 'orange',
            top: 'blue',
            bottom: 'green'
          }
        }
      };
      const currentPosition = [0, 0, 1]; // Front face
      
      const result = ensureStartingColorsOutwardFacing(piece, currentPosition);
      
      expect(result.front).toBe('white');
      expect(result.back).toBe('#444444');
      expect(result.right).toBe('#444444');
      expect(result.left).toBe('#444444');
      expect(result.top).toBe('#444444');
      expect(result.bottom).toBe('#444444');
    });

    it('should position colors correctly for back face piece', () => {
      const piece = {
        pieceId: 0,
        startingColors: {
          visibleColors: {
            front: 'white',
            back: 'yellow',
            right: 'red',
            left: 'orange',
            top: 'blue',
            bottom: 'green'
          }
        }
      };
      const currentPosition = [0, 0, -1]; // Back face
      
      const result = ensureStartingColorsOutwardFacing(piece, currentPosition);
      
      expect(result.front).toBe('#444444');
      expect(result.back).toBe('yellow');
      expect(result.right).toBe('#444444');
      expect(result.left).toBe('#444444');
      expect(result.top).toBe('#444444');
      expect(result.bottom).toBe('#444444');
    });

    it('should position colors correctly for right face piece', () => {
      const piece = {
        pieceId: 0,
        startingColors: {
          visibleColors: {
            front: 'white',
            back: 'yellow',
            right: 'red',
            left: 'orange',
            top: 'blue',
            bottom: 'green'
          }
        }
      };
      const currentPosition = [1, 0, 0]; // Right face
      
      const result = ensureStartingColorsOutwardFacing(piece, currentPosition);
      
      expect(result.front).toBe('#444444');
      expect(result.back).toBe('#444444');
      expect(result.right).toBe('red');
      expect(result.left).toBe('#444444');
      expect(result.top).toBe('#444444');
      expect(result.bottom).toBe('#444444');
    });

    it('should handle piece without startingColors', () => {
      const piece = { pieceId: 0 };
      const currentPosition = [0, 0, 1];
      
      const result = ensureStartingColorsOutwardFacing(piece, currentPosition);
      
      // Should call getStartingPositionColors internally
      expect(result).toHaveProperty('front');
      expect(result).toHaveProperty('back');
      expect(result).toHaveProperty('right');
      expect(result).toHaveProperty('left');
      expect(result).toHaveProperty('top');
      expect(result).toHaveProperty('bottom');
    });

    it('should log positioning information', () => {
      const piece = {
        pieceId: 0,
        startingColors: {
          visibleColors: {
            front: 'white',
            back: 'yellow',
            right: 'red',
            left: 'orange',
            top: 'blue',
            bottom: 'green'
          }
        }
      };
      const currentPosition = [0, 0, 1];
      
      // Mock console.log to verify logging
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      ensureStartingColorsOutwardFacing(piece, currentPosition);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('🎨 Positioned starting colors outward for piece 0')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('getExpectedColorForFace', () => {
    it('should return correct colors for all faces', () => {
      expect(getExpectedColorForFace('front')).toBe('white');
      expect(getExpectedColorForFace('back')).toBe('yellow');
      expect(getExpectedColorForFace('right')).toBe('red');
      expect(getExpectedColorForFace('left')).toBe('orange');
      expect(getExpectedColorForFace('top')).toBe('blue');
      expect(getExpectedColorForFace('bottom')).toBe('green');
    });

    it('should return default color for unknown face', () => {
      expect(getExpectedColorForFace('unknown')).toBe('#444444');
      expect(getExpectedColorForFace('')).toBe('#444444');
      expect(getExpectedColorForFace(null)).toBe('#444444');
      expect(getExpectedColorForFace(undefined)).toBe('#444444');
    });
  });
});
