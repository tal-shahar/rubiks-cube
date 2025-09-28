import { useState, useEffect, useCallback } from 'react';
import { 
  DEFAULT_KEYBINDINGS,
  loadKeybindingsFromCookie,
  saveKeybindingsToCookie,
  clearKeybindingsCookie,
  hasKeybindingsCookie,
  mergeKeybindings,
  eventToKeyString
} from '../utils/keybindings';

export const useKeybindings = () => {
  const [keybindings, setKeybindings] = useState(DEFAULT_KEYBINDINGS);
  const [userKeybindings, setUserKeybindings] = useState({});
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load keybindings from cookie on mount
  useEffect(() => {
    const loadKeybindings = () => {
      try {
        const savedKeybindings = loadKeybindingsFromCookie();
        if (savedKeybindings) {
          setUserKeybindings(savedKeybindings);
          setKeybindings(mergeKeybindings(savedKeybindings));
          // If we have saved keybindings, user already has permission
          setHasPermission(true);
        }
      } catch (error) {
        console.error('Failed to load keybindings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadKeybindings();
  }, []);

  // Request permission for cookie usage
  const requestPermission = useCallback(() => {
    return new Promise((resolve) => {
      const userConfirmed = window.confirm(
        'This app would like to save your keybinding preferences in a cookie. ' +
        'This allows your custom keybindings to persist between sessions. ' +
        'Do you want to allow this?'
      );
      
      setHasPermission(userConfirmed);
      resolve(userConfirmed);
    });
  }, []);

  // Request permission when keybinding modal is opened
  const requestPermissionOnOpen = useCallback(async () => {
    // If we already have permission, return true immediately
    if (hasPermission) {
      return true;
    }
    
    // Check if we have existing keybindings in cookies
    if (hasKeybindingsCookie()) {
      // User already has keybindings saved, grant permission automatically
      setHasPermission(true);
      return true;
    }
    
    // No existing keybindings, request permission from user
    return await requestPermission();
  }, [hasPermission, requestPermission]);

  // Save keybindings to cookie
  const saveKeybindings = useCallback(async (newKeybindings) => {
    // Permission should already be granted when modal was opened
    if (!hasPermission) {
      console.warn('Attempting to save keybindings without permission');
      return false;
    }

    try {
      const success = saveKeybindingsToCookie(newKeybindings);
      if (success) {
        setUserKeybindings(newKeybindings);
        setKeybindings(mergeKeybindings(newKeybindings));
        return true;
      }
    } catch (error) {
      console.error('Failed to save keybindings:', error);
    }
    
    return false;
  }, [hasPermission]);

  // Reset keybindings to default
  const resetKeybindings = useCallback(async () => {
    try {
      const success = clearKeybindingsCookie();
      if (success) {
        setUserKeybindings({});
        setKeybindings(DEFAULT_KEYBINDINGS);
        return true;
      }
    } catch (error) {
      console.error('Failed to reset keybindings:', error);
    }
    
    return false;
  }, []);

  // Handle key press and execute corresponding action
  const handleKeyPress = useCallback((event, onRotateFace) => {
    if (!onRotateFace) return;

    const keyString = eventToKeyString(event);
    const binding = keybindings[keyString];
    
    if (binding) {
      event.preventDefault();
      onRotateFace(binding.face, binding.direction);
    }
  }, [keybindings]);

  // Get keybinding for a specific face and direction
  const getKeybinding = useCallback((face, direction) => {
    for (const [key, binding] of Object.entries(keybindings)) {
      if (binding.face === face && binding.direction === direction) {
        return key;
      }
    }
    return null;
  }, [keybindings]);

  // Check if a key is bound
  const isKeyBound = useCallback((keyString) => {
    return keyString in keybindings;
  }, [keybindings]);

  return {
    keybindings,
    userKeybindings,
    hasPermission,
    isLoading,
    requestPermission,
    requestPermissionOnOpen,
    saveKeybindings,
    resetKeybindings,
    handleKeyPress,
    getKeybinding,
    isKeyBound
  };
};
