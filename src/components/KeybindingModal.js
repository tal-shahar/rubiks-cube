import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  AVAILABLE_FACES, 
  DIRECTIONS, 
  getKeyDisplayName, 
  isValidKeyCombination,
  findKeybindingConflicts,
  eventToKeyString
} from '../utils/keybindings';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 2vh;
  z-index: 2147483647;
  backdrop-filter: blur(5px);
  
  /* Create a new stacking context and ensure it's on top */
  transform: translateZ(0);
  will-change: transform;
  
  /* Force the modal to be above everything */
  isolation: isolate;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  max-width: 800px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 2147483646;
  
  /* Ensure content stays on top and is properly isolated */
  transform: translateZ(0);
  isolation: isolate;
  
  /* Force all child elements to stay within this stacking context */
  & * {
    position: relative;
    z-index: auto;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
`;

const ModalTitle = styled.h2`
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const KeybindingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const KeybindingItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  border: 2px solid ${props => props.$isActive ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const KeybindingLabel = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const FaceIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: ${props => props.$color};
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color === '#FFFFFF' ? '#333' : 'white'};
  font-weight: bold;
  font-size: 14px;
  border: 2px solid rgba(0, 0, 0, 0.2);
`;

const FaceInfo = styled.div`
  flex: 1;
`;

const FaceName = styled.div`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const DirectionName = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
`;

const KeyInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    background: rgba(255, 255, 255, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const ConflictWarning = styled.div`
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
`;

const Button = styled.button`
  padding: 12px 30px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  
  ${props => props.$primary ? `
    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
      transform: translateY(-2px);
    }
  ` : `
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Instructions = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  border-left: 4px solid #4CAF50;
`;

const InstructionsTitle = styled.h3`
  color: white;
  margin: 0 0 15px 0;
  font-size: 18px;
`;

const InstructionsList = styled.ul`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  padding-left: 20px;
  
  li {
    margin-bottom: 8px;
    line-height: 1.5;
  }
`;

function KeybindingModal({ isOpen, onClose, keybindings, onSaveKeybindings, onResetKeybindings }) {
  const [localKeybindings, setLocalKeybindings] = useState({});
  const [activeInput, setActiveInput] = useState(null);
  const [conflicts, setConflicts] = useState({});

  // Initialize local keybindings when modal opens
  useEffect(() => {
    if (isOpen) {
      // Convert keybindings from {key: {face, direction}} to {face-direction: key} format
      const convertedKeybindings = {};
      for (const [key, binding] of Object.entries(keybindings)) {
        if (binding && typeof binding === 'object' && binding.face && binding.direction) {
          convertedKeybindings[`${binding.face}-${binding.direction}`] = key;
        }
      }
      setLocalKeybindings(convertedKeybindings);
      setConflicts({});
    }
  }, [isOpen, keybindings]);

  // Handle key input
  const handleKeyInput = (event, face, direction) => {
    event.preventDefault();
    event.stopPropagation();
    
    const keyString = eventToKeyString(event);
    
    if (isValidKeyCombination(keyString)) {
      // Check for conflicts
      const newConflicts = findKeybindingConflicts(localKeybindings, keyString, `${face}-${direction}`);
      
      setLocalKeybindings(prev => ({
        ...prev,
        [`${face}-${direction}`]: keyString
      }));
      
      setConflicts(prev => ({
        ...prev,
        [`${face}-${direction}`]: newConflicts
      }));
    }
    
    setActiveInput(null);
  };

  // Handle input focus
  const handleInputFocus = (face, direction) => {
    setActiveInput(`${face}-${direction}`);
  };

  // Handle input blur
  const handleInputBlur = () => {
    setActiveInput(null);
  };

  // Handle save
  const handleSave = () => {
    // Convert local keybindings to the format expected by the app
    const newKeybindings = {};
    
    for (const [key, binding] of Object.entries(localKeybindings)) {
      if (binding && typeof binding === 'string') {
        newKeybindings[binding] = {
          face: key.split('-')[0],
          direction: key.split('-')[1]
        };
      }
    }
    
    onSaveKeybindings(newKeybindings);
    onClose();
  };

  // Handle reset
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all keybindings to default?')) {
      onResetKeybindings();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay 
      onClick={onClose}
      style={{
        zIndex: 2147483647, // Maximum z-index value
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        isolation: 'isolate',
        transform: 'translateZ(0)'
      }}
    >
      <ModalContent 
        onClick={(e) => e.stopPropagation()}
        style={{
          zIndex: 2147483646, // Just below the maximum
          position: 'relative',
          isolation: 'isolate',
          transform: 'translateZ(0)'
        }}
      >
        <ModalHeader>
          <ModalTitle>Customize Keybindings</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <Instructions>
          <InstructionsTitle>How to customize keybindings:</InstructionsTitle>
          <InstructionsList>
            <li>Click on any key input field to start recording</li>
            <li>Press the key or key combination you want to use</li>
            <li>You can use single keys (like 'r') or combinations (like 'Ctrl+R')</li>
            <li>Use Shift, Ctrl, Alt, or Cmd as modifiers</li>
            <li>Click "Save" to apply your changes</li>
          </InstructionsList>
        </Instructions>

        <KeybindingGrid>
          {AVAILABLE_FACES.map(face => 
            DIRECTIONS.map(direction => {
              const key = `${face.id}-${direction.id}`;
              const currentKey = localKeybindings[key] || '';
              const faceDirection = AVAILABLE_FACES.find(f => f.id === face.id);
              const directionInfo = DIRECTIONS.find(d => d.id === direction.id);
              const isActive = activeInput === key;
              const hasConflicts = conflicts[key] && conflicts[key].length > 0;
              
              return (
                <KeybindingItem key={key} $isActive={isActive}>
                  <KeybindingLabel>
                    <FaceIcon $color={faceDirection.color}>
                      {face.id}
                    </FaceIcon>
                    <FaceInfo>
                      <FaceName>{faceDirection.name}</FaceName>
                      <DirectionName>{directionInfo.name}</DirectionName>
                    </FaceInfo>
                  </KeybindingLabel>
                  
                  <KeyInput
                    type="text"
                    value={currentKey ? getKeyDisplayName(currentKey) : ''}
                    placeholder="Click to record key"
                    onFocus={() => handleInputFocus(face.id, direction.id)}
                    onBlur={handleInputBlur}
                    onKeyDown={(e) => handleKeyInput(e, face.id, direction.id)}
                    readOnly={!isActive}
                    style={{
                      borderColor: hasConflicts ? '#ff6b6b' : isActive ? '#4CAF50' : 'rgba(255, 255, 255, 0.3)'
                    }}
                  />
                  
                  {hasConflicts && (
                    <ConflictWarning>
                      {conflicts[key][0].message}
                    </ConflictWarning>
                  )}
                </KeybindingItem>
              );
            })
          )}
        </KeybindingGrid>

        <ButtonGroup>
          <Button onClick={handleReset}>
            Reset to Default
          </Button>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button $primary onClick={handleSave}>
            Save Keybindings
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
}

export default KeybindingModal;
