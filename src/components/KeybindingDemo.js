import React from 'react';
import styled from 'styled-components';
import { useKeybindings } from '../hooks/useKeybindings';
import { getKeyDisplayName } from '../utils/keybindings';

const DemoContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const DemoTitle = styled.h3`
  color: white;
  margin: 0 0 15px 0;
  font-size: 18px;
`;

const KeybindingList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
`;

const KeybindingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 14px;
`;

const FaceName = styled.span`
  color: white;
  font-weight: 600;
`;

const KeyName = styled.span`
  color: #4CAF50;
  font-family: monospace;
  background: rgba(76, 175, 80, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
`;

const Status = styled.div`
  color: ${props => props.$hasPermission ? '#4CAF50' : '#ff6b6b'};
  font-size: 12px;
  margin-top: 10px;
  text-align: center;
`;

function KeybindingDemo() {
  const { keybindings, hasPermission, isLoading } = useKeybindings();

  if (isLoading) {
    return (
      <DemoContainer>
        <DemoTitle>Keybindings</DemoTitle>
        <div style={{ color: 'white', textAlign: 'center' }}>Loading...</div>
      </DemoContainer>
    );
  }

  // Get current keybindings for display
  const currentKeybindings = Object.entries(keybindings).map(([key, binding]) => ({
    key,
    face: binding.face,
    direction: binding.direction
  }));

  return (
    <DemoContainer>
      <DemoTitle>Current Keybindings</DemoTitle>
      <KeybindingList>
        {currentKeybindings.map(({ key, face, direction }) => (
          <KeybindingItem key={`${face}-${direction}`}>
            <FaceName>
              {face} {direction === 'clockwise' ? '' : "'"}
            </FaceName>
            <KeyName>
              {getKeyDisplayName(key)}
            </KeyName>
          </KeybindingItem>
        ))}
      </KeybindingList>
      <Status $hasPermission={hasPermission}>
        {hasPermission ? '✓ Keybindings saved to cookie' : '⚠ Keybindings not saved (no permission)'}
      </Status>
    </DemoContainer>
  );
}

export default KeybindingDemo;
