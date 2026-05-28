import React from 'react';
import styled, { keyframes } from 'styled-components';

// Spinning animation for the cube
const spin = keyframes`
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  25% {
    transform: rotateX(90deg) rotateY(0deg);
  }
  50% {
    transform: rotateX(90deg) rotateY(90deg);
  }
  75% {
    transform: rotateX(0deg) rotateY(90deg);
  }
  100% {
    transform: rotateX(0deg) rotateY(0deg);
  }
`;

// Pulse animation for the loading text
const pulse = keyframes`
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
`;

const CubeContainer = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
  transform-style: preserve-3d;
  animation: ${spin} 2s linear infinite;
  margin-bottom: 20px;
`;

const CubeFace = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: ${props => props.color || 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: blur(10px);
  
  &:nth-child(1) {
    transform: rotateY(0deg) translateZ(40px);
    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  }
  &:nth-child(2) {
    transform: rotateY(90deg) translateZ(40px);
    background: linear-gradient(135deg, #4ecdc4, #44a08d);
  }
  &:nth-child(3) {
    transform: rotateY(180deg) translateZ(40px);
    background: linear-gradient(135deg, #45b7d1, #96c93d);
  }
  &:nth-child(4) {
    transform: rotateY(-90deg) translateZ(40px);
    background: linear-gradient(135deg, #f093fb, #f5576c);
  }
  &:nth-child(5) {
    transform: rotateX(90deg) translateZ(40px);
    background: linear-gradient(135deg, #4facfe, #00f2fe);
  }
  &:nth-child(6) {
    transform: rotateX(-90deg) translateZ(40px);
    background: linear-gradient(135deg, #43e97b, #38f9d7);
  }
`;

const LoadingText = styled.div`
  color: white;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  animation: ${pulse} 1.5s ease-in-out infinite;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const LoadingDots = styled.span`
  &::after {
    content: '';
    animation: ${pulse} 1.5s ease-in-out infinite;
  }
  
  &::after {
    content: '...';
    animation: ${pulse} 1.5s ease-in-out infinite;
  }
`;

const LoadingSpinner = ({ message = "Loading Cube" }) => {
  return (
    <LoadingContainer>
      <CubeContainer>
        <CubeFace />
        <CubeFace />
        <CubeFace />
        <CubeFace />
        <CubeFace />
        <CubeFace />
      </CubeContainer>
      <LoadingText>
        {message}
        <LoadingDots />
      </LoadingText>
    </LoadingContainer>
  );
};

export default LoadingSpinner;
