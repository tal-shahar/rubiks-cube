// Rotation configuration - controls which rotations are enabled/disabled
// This affects buttons, keybindings, scramble, and all other rotation access points

export const ROTATION_CONFIG = {
  // Basic face rotations
  R: { enabled: true, name: 'Right', color: '#DC143C' },
  L: { enabled: true, name: 'Left', color: '#FF8C00' },
  U: { enabled: true, name: 'Up', color: '#0000FF' },
  D: { enabled: true, name: 'Down', color: '#00FF00' },
  F: { enabled: true, name: 'Front', color: '#FFFFFF' },
  B: { enabled: true, name: 'Back', color: '#FFD700' },
  
  // Middle layer rotations
  M: { enabled: true, name: 'Middle', color: '#800080' },
  E: { enabled: true, name: 'Equatorial', color: '#FF69B4' },
  S: { enabled: false, name: 'Standing', color: '#00CED1', reason: 'Color shift issues' }, // Temporarily disabled
};

// Helper functions
export const isRotationEnabled = (face) => {
  return ROTATION_CONFIG[face]?.enabled === true;
};

export const getEnabledRotations = () => {
  return Object.entries(ROTATION_CONFIG)
    .filter(([face, config]) => config.enabled)
    .map(([face, config]) => ({ face, ...config }));
};

export const getDisabledRotations = () => {
  return Object.entries(ROTATION_CONFIG)
    .filter(([face, config]) => !config.enabled)
    .map(([face, config]) => ({ face, ...config }));
};

// Get rotations for scramble (only enabled ones)
export const getScrambleRotations = () => {
  return getEnabledRotations().map(({ face }) => face);
};

// Get rotations for keybindings (only enabled ones)
export const getKeybindingRotations = () => {
  return getEnabledRotations();
};

// Toggle rotation enabled/disabled
export const toggleRotation = (face) => {
  if (ROTATION_CONFIG[face]) {
    ROTATION_CONFIG[face].enabled = !ROTATION_CONFIG[face].enabled;
    return ROTATION_CONFIG[face].enabled;
  }
  return false;
};

// Enable/disable specific rotation
export const setRotationEnabled = (face, enabled) => {
  if (ROTATION_CONFIG[face]) {
    ROTATION_CONFIG[face].enabled = enabled;
    return true;
  }
  return false;
};

// Get rotation info
export const getRotationInfo = (face) => {
  return ROTATION_CONFIG[face] || null;
};
