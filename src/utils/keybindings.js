// Keybinding utility functions
import { getKeybindingRotations } from './rotationConfig';

// Generate default keybindings based on enabled rotations
const generateDefaultKeybindings = () => {
  const keybindings = {};
  const enabledRotations = getKeybindingRotations();
  
  enabledRotations.forEach(({ face }) => {
    // Lowercase for clockwise, uppercase for counterclockwise
    keybindings[face.toLowerCase()] = { face, direction: 'clockwise' };
    keybindings[face.toUpperCase()] = { face, direction: 'counterclockwise' };
  });
  
  return keybindings;
};

// Default keybindings (dynamically generated based on enabled rotations)
export const DEFAULT_KEYBINDINGS = generateDefaultKeybindings();

// Available faces for keybinding (dynamically generated based on enabled rotations)
export const AVAILABLE_FACES = getKeybindingRotations().map(({ face, name, color }) => ({
  id: face,
  name,
  color
}));

export const DIRECTIONS = [
  { id: 'clockwise', name: 'Clockwise' },
  { id: 'counterclockwise', name: 'Counter-Clockwise' },
];

// Cookie management
export const COOKIE_NAME = 'rubiks-cube-keybindings';

export const saveKeybindingsToCookie = (keybindings) => {
  try {
    const keybindingData = JSON.stringify(keybindings);
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(keybindingData)}; path=/; max-age=31536000; SameSite=Lax`;
    return true;
  } catch (error) {
    console.error('Failed to save keybindings to cookie:', error);
    return false;
  }
};

export const loadKeybindingsFromCookie = () => {
  try {
    const cookies = document.cookie.split(';');
    const keybindingCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${COOKIE_NAME}=`)
    );
    
    if (keybindingCookie) {
      const keybindingData = decodeURIComponent(
        keybindingCookie.split('=')[1]
      );
      return JSON.parse(keybindingData);
    }
  } catch (error) {
    console.error('Failed to load keybindings from cookie:', error);
  }
  
  return null;
};

export const clearKeybindingsCookie = () => {
  try {
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    return true;
  } catch (error) {
    console.error('Failed to clear keybindings cookie:', error);
    return false;
  }
};

export const hasKeybindingsCookie = () => {
  try {
    const cookies = document.cookie.split(';');
    const keybindingCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${COOKIE_NAME}=`)
    );
    
    if (!keybindingCookie) {
      return false;
    }
    
    // Check if the cookie has a non-empty value
    const cookieValue = keybindingCookie.split('=')[1];
    return cookieValue !== undefined && cookieValue.trim() !== '';
  } catch (error) {
    console.error('Failed to check keybindings cookie:', error);
    return false;
  }
};

// Key combination parsing
export const parseKeyCombination = (keyString) => {
  const parts = keyString.split('+').map(part => part.trim().toLowerCase());
  const modifiers = [];
  let key = '';
  
  for (const part of parts) {
    if (['ctrl', 'control', 'alt', 'meta', 'cmd', 'shift'].includes(part)) {
      modifiers.push(part === 'cmd' ? 'meta' : part);
    } else {
      key = part;
    }
  }
  
  return { modifiers, key };
};

// Convert key event to key combination string
export const eventToKeyString = (event) => {
  const modifiers = [];
  
  if (event.ctrlKey) modifiers.push('ctrl');
  if (event.altKey) modifiers.push('alt');
  if (event.metaKey) modifiers.push('meta');
  if (event.shiftKey) modifiers.push('shift');
  
  const key = event.key.toLowerCase();
  const keyString = modifiers.length > 0 
    ? `${modifiers.join('+')}+${key}`
    : key;
    
  return keyString;
};

// Check if key combination is valid
export const isValidKeyCombination = (keyString) => {
  if (!keyString || keyString.trim() === '') return false;
  
  const { modifiers, key } = parseKeyCombination(keyString);
  
  // Must have a key
  if (!key) return false;
  
  // Key must be a single character or special key
  if (key.length > 1 && !['space', 'enter', 'escape', 'tab', 'backspace', 'delete'].includes(key)) {
    return false;
  }
  
  return true;
};

// Get display name for key combination
export const getKeyDisplayName = (keyString) => {
  const { modifiers, key } = parseKeyCombination(keyString);
  
  const modifierNames = {
    ctrl: 'Ctrl',
    alt: 'Alt',
    meta: 'Cmd',
    shift: 'Shift'
  };
  
  const keyNames = {
    space: 'Space',
    enter: 'Enter',
    escape: 'Esc',
    tab: 'Tab',
    backspace: 'Backspace',
    delete: 'Del'
  };
  
  const displayModifiers = modifiers.map(mod => modifierNames[mod] || mod);
  const displayKey = keyNames[key] || key.toUpperCase();
  
  return displayModifiers.length > 0 
    ? `${displayModifiers.join(' + ')} + ${displayKey}`
    : displayKey;
};

// Merge default keybindings with user keybindings
export const mergeKeybindings = (userKeybindings) => {
  return {
    ...DEFAULT_KEYBINDINGS,
    ...userKeybindings
  };
};

// Check for keybinding conflicts
export const findKeybindingConflicts = (keybindings, newKey, excludeKey = null) => {
  const conflicts = [];
  
  for (const [key, binding] of Object.entries(keybindings)) {
    if (key === excludeKey) continue;
    if (key === newKey) {
      conflicts.push({
        key,
        binding,
        message: `Key "${getKeyDisplayName(key)}" is already mapped to ${binding.face} ${binding.direction}`
      });
    }
  }
  
  return conflicts;
};
