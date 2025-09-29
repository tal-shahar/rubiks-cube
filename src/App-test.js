import React from 'react';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 10px;
    justify-content: center;
    align-items: center;
  }
`;

const DualCubeContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
  margin: 20px 0;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    margin: 0;
    width: 100%;
  }
`;

const CubeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
    padding: 15px;
  }
`;

const TestCube = styled.div`
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
`;

function AppTest() {
  return (
    <AppContainer>
      <h1 style={{ color: 'white', textAlign: 'center' }}>Mobile Centering Test</h1>
      
      <DualCubeContainer>
        <CubeWrapper>
          <h3 style={{ color: '#fff', margin: '0 0 10px 0', textAlign: 'center' }}>
            Simple Revert Solver
          </h3>
          <TestCube>Cube 1</TestCube>
        </CubeWrapper>
        
        <CubeWrapper>
          <h3 style={{ color: '#fff', margin: '0 0 10px 0', textAlign: 'center' }}>
            Advanced Kociemba Solver
          </h3>
          <TestCube>Cube 2</TestCube>
        </CubeWrapper>
      </DualCubeContainer>
    </AppContainer>
  );
}

export default AppTest;
