import { renderHook } from '@testing-library/react';
import { useDeviceDetection } from '../useDeviceDetection';

// Mock window.matchMedia
const mockMatchMedia = (matches) => {
  return jest.fn().mockImplementation((query) => ({
    matches: matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

// Mock window properties
const mockWindow = (width, height, hasTouch = false, maxTouchPoints = 0) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  Object.defineProperty(window, 'ontouchstart', {
    writable: true,
    configurable: true,
    value: hasTouch ? {} : undefined,
  });
  Object.defineProperty(navigator, 'maxTouchPoints', {
    writable: true,
    configurable: true,
    value: maxTouchPoints,
  });
};

describe('useDeviceDetection', () => {
  beforeEach(() => {
    // Reset window properties
    mockWindow(1024, 768, false, 0);
    window.matchMedia = mockMatchMedia(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should detect desktop device correctly', () => {
    mockWindow(1920, 1080, false, 0);
    window.matchMedia = mockMatchMedia(true); // hover: hover matches
    
    const { result } = renderHook(() => useDeviceDetection());
    
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isTouchDevice).toBe(false);
    expect(result.current.isKeyboardDevice).toBe(true);
  });

  it('should detect mobile device correctly', () => {
    mockWindow(375, 667, true, 5);
    window.matchMedia = mockMatchMedia(false); // hover: none matches
    
    const { result } = renderHook(() => useDeviceDetection());
    
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isTouchDevice).toBe(true);
    expect(result.current.isKeyboardDevice).toBe(false);
  });

  it('should detect tablet device correctly', () => {
    mockWindow(900, 1024, true, 5);
    window.matchMedia = mockMatchMedia(false); // hover: none matches
    
    const { result } = renderHook(() => useDeviceDetection());
    
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isTouchDevice).toBe(true);
    expect(result.current.isKeyboardDevice).toBe(false);
  });

  it('should detect small screen as mobile even without touch', () => {
    mockWindow(600, 800, false, 0);
    window.matchMedia = mockMatchMedia(false);
    
    const { result } = renderHook(() => useDeviceDetection());
    
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isKeyboardDevice).toBe(false);
  });

  it('should detect large screen with touch as desktop if it has hover and precise pointer', () => {
    mockWindow(1920, 1080, true, 5);
    window.matchMedia = mockMatchMedia(true); // hover: hover matches
    
    const { result } = renderHook(() => useDeviceDetection());
    
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isKeyboardDevice).toBe(true);
  });
});
