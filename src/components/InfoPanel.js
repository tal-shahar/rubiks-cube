import React from 'react';
import styled from 'styled-components';

const InfoContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px;
  margin-top: 20px;
  color: white;
  max-width: 600px;
`;

const Title = styled.h3`
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #fff;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 15px;
`;

const SectionTitle = styled.h4`
  margin-bottom: 8px;
  color: #fff;
  font-size: 1rem;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  padding: 5px 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  
  &:before {
    content: "•";
    color: #667eea;
    font-weight: bold;
    margin-right: 8px;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 5px;
`;

const ScrambleDisplay = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
  margin-top: 10px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #667eea;
  text-align: center;
  min-height: 20px;
`;

function InfoPanel({ currentScramble, isScrambling }) {
  return (
    <InfoContainer>
      <Title>Rubik's Cube Information</Title>
      
      <Section>
        <SectionTitle>Controls</SectionTitle>
        <List>
          <ListItem>Drag with mouse to rotate the cube</ListItem>
          <ListItem>Scroll to zoom in/out</ListItem>
          <ListItem>Use buttons below for quick actions</ListItem>
          <ListItem>Toggle auto-rotation on/off</ListItem>
        </List>
      </Section>
      
      <Section>
        <SectionTitle>Cube Mechanics</SectionTitle>
        <List>
          <ListItem>Center pieces are fixed and never move</ListItem>
          <ListItem>Edge pieces have 2 colors</ListItem>
          <ListItem>Corner pieces have 3 colors</ListItem>
          <ListItem>Each face rotates independently</ListItem>
          <ListItem>Scramble uses standard notation (F, B, R, L, U, D)</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>Current Scramble</SectionTitle>
        <ScrambleDisplay>
          {isScrambling ? 'Scrambling...' : currentScramble || 'Click Scramble to start'}
        </ScrambleDisplay>
      </Section>
      
      <Stats>
        <StatItem>
          <StatValue>27</StatValue>
          <StatLabel>Cube Pieces</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>6</StatValue>
          <StatLabel>Faces</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>3x3x3</StatValue>
          <StatLabel>Dimensions</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>∞</StatValue>
          <StatLabel>Combinations</StatLabel>
        </StatItem>
      </Stats>
    </InfoContainer>
  );
}

export default InfoPanel; 