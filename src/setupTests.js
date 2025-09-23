import '@testing-library/jest-dom';

// Mock fetch for testing
global.fetch = jest.fn();

// Mock console methods to avoid noise in tests (but allow log for debugging)
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  // log: jest.fn(), // Commented out to allow debugging
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock performance.now for animation tests
global.performance = {
  ...performance,
  now: jest.fn(() => Date.now()),
};

// Mock requestAnimationFrame for animation tests
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

// Mock Three.js and React Three Fiber components
jest.mock('three', () => ({
  ...jest.requireActual('three'),
  Vector3: jest.fn(),
  Euler: jest.fn(),
  Color: jest.fn(),
}));

// Mock React Three Fiber components
jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
  useThree: jest.fn(),
}));

// Mock the shapes utility
jest.mock('./components/cube/utils/shapes', () => ({
  createShapeWithFaceBorder: jest.fn(() => <div data-testid="mocked-shape" />),
}));