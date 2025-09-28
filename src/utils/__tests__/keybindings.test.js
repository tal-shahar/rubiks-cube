import {
  DEFAULT_KEYBINDINGS,
  parseKeyCombination,
  eventToKeyString,
  isValidKeyCombination,
  getKeyDisplayName,
  mergeKeybindings,
  findKeybindingConflicts,
  hasKeybindingsCookie
} from '../keybindings';

describe('Keybinding utilities', () => {
  describe('parseKeyCombination', () => {
    test('should parse single key', () => {
      const result = parseKeyCombination('r');
      expect(result).toEqual({ modifiers: [], key: 'r' });
    });

    test('should parse key with modifiers', () => {
      const result = parseKeyCombination('ctrl+alt+r');
      expect(result).toEqual({ modifiers: ['ctrl', 'alt'], key: 'r' });
    });

    test('should handle cmd as meta', () => {
      const result = parseKeyCombination('cmd+r');
      expect(result).toEqual({ modifiers: ['meta'], key: 'r' });
    });
  });

  describe('isValidKeyCombination', () => {
    test('should validate single keys', () => {
      expect(isValidKeyCombination('r')).toBe(true);
      expect(isValidKeyCombination('space')).toBe(true);
    });

    test('should validate key combinations', () => {
      expect(isValidKeyCombination('ctrl+r')).toBe(true);
      expect(isValidKeyCombination('alt+shift+f')).toBe(true);
    });

    test('should reject invalid combinations', () => {
      expect(isValidKeyCombination('')).toBe(false);
      expect(isValidKeyCombination('invalidkey')).toBe(false);
    });
  });

  describe('getKeyDisplayName', () => {
    test('should format single keys', () => {
      expect(getKeyDisplayName('r')).toBe('R');
      expect(getKeyDisplayName('space')).toBe('Space');
    });

    test('should format key combinations', () => {
      expect(getKeyDisplayName('ctrl+r')).toBe('Ctrl + R');
      expect(getKeyDisplayName('alt+shift+f')).toBe('Alt + Shift + F');
    });
  });

  describe('mergeKeybindings', () => {
    test('should merge user keybindings with defaults', () => {
      const userKeybindings = {
        'x': { face: 'R', direction: 'clockwise' }
      };
      const result = mergeKeybindings(userKeybindings);
      
      expect(result['x']).toEqual({ face: 'R', direction: 'clockwise' });
      expect(result['r']).toEqual(DEFAULT_KEYBINDINGS['r']); // Default should still exist
    });
  });

  describe('findKeybindingConflicts', () => {
    test('should find conflicts', () => {
      const keybindings = {
        'r': { face: 'R', direction: 'clockwise' },
        'x': { face: 'L', direction: 'clockwise' }
      };
      
      const conflicts = findKeybindingConflicts(keybindings, 'r');
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].key).toBe('r');
    });

    test('should not find conflicts when excluding key', () => {
      const keybindings = {
        'r': { face: 'R', direction: 'clockwise' }
      };
      
      const conflicts = findKeybindingConflicts(keybindings, 'r', 'r');
      expect(conflicts).toHaveLength(0);
    });
  });

  describe('hasKeybindingsCookie', () => {
    beforeEach(() => {
      // Clear any existing cookies
      document.cookie = 'rubiks-cube-keybindings=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });

    test('should return false when no cookie exists', () => {
      expect(hasKeybindingsCookie()).toBe(false);
    });

    test('should return true when cookie exists', () => {
      // Set a test cookie
      document.cookie = 'rubiks-cube-keybindings=test; path=/';
      expect(hasKeybindingsCookie()).toBe(true);
    });

    test('should return false for empty cookie', () => {
      // Set an empty cookie
      document.cookie = 'rubiks-cube-keybindings=; path=/';
      expect(hasKeybindingsCookie()).toBe(false);
    });
  });
});
