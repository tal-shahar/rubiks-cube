import { logRotationStep, logToTerminal, setTestMode } from '../logger';

// Mock fetch
global.fetch = jest.fn();

// Mock console methods
const mockConsoleLog = jest.fn();
const mockConsoleWarn = jest.fn();
const mockConsoleError = jest.fn();

// Replace console methods
global.console.log = mockConsoleLog;
global.console.warn = mockConsoleWarn;
global.console.error = mockConsoleError;

describe('Logger Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
    mockConsoleLog.mockClear();
    mockConsoleWarn.mockClear();
    mockConsoleError.mockClear();
    
    // Enable test mode to disable throttling
    setTestMode(true);
  });

  describe('logRotationStep', () => {
    it('should call logToTerminal with correct parameters', () => {
      const step = 'A';
      const face = 'F';
      const direction = 'clockwise';
      const data = { test: 'data' };
      
      logRotationStep(step, face, direction, data);
      
      // Should call logToTerminal (which will call console.log)
      expect(mockConsoleLog).toHaveBeenCalled();
    });

    it('should handle null data gracefully', () => {
      logRotationStep('B', 'R', 'counterclockwise', null);
      expect(mockConsoleLog).toHaveBeenCalled();
    });

    it('should handle undefined data gracefully', () => {
      logRotationStep('C', 'L', 'clockwise');
      expect(mockConsoleLog).toHaveBeenCalled();
    });
  });

  describe('logToTerminal', () => {
    it('should log to console with correct format', () => {
      const message = 'Test message';
      const data = { key: 'value' };
      const type = 'INFO';
      
      logToTerminal(message, data, type);
      
      expect(mockConsoleLog).toHaveBeenCalled();
      
      // Check that the message contains expected elements
      const logCalls = mockConsoleLog.mock.calls;
      const hasMessage = logCalls.some(call => 
        call[0] && call[0].includes(message)
      );
      expect(hasMessage).toBe(true);
    });

    it('should use correct prefix for different types', () => {
      logToTerminal('Error message', null, 'ERROR');
      logToTerminal('Warning message', null, 'WARNING');
      logToTerminal('Success message', null, 'SUCCESS');
      logToTerminal('Info message', null, 'INFO');

      expect(mockConsoleLog).toHaveBeenCalled();
      
      // Check that different prefixes are used
      const logCalls = mockConsoleLog.mock.calls;
      const hasErrorPrefix = logCalls.some(call => call[0] && call[0].includes('❌'));
      const hasWarningPrefix = logCalls.some(call => call[0] && call[0].includes('⚠️'));
      const hasSuccessPrefix = logCalls.some(call => call[0] && call[0].includes('✅'));
      const hasInfoPrefix = logCalls.some(call => call[0] && call[0].includes('🎯'));
      
      expect(hasErrorPrefix).toBe(true);
      expect(hasWarningPrefix).toBe(true);
      expect(hasSuccessPrefix).toBe(true);
      expect(hasInfoPrefix).toBe(true);
    });

    it('should handle object data correctly', () => {
      const data = { test: 'object' };
      logToTerminal('Test', data, 'INFO');

      expect(mockConsoleLog).toHaveBeenCalled();
      
      // Check that object data is logged
      const logCalls = mockConsoleLog.mock.calls;
      const hasObjectData = logCalls.some(call => 
        call[0] && (call[0].includes('test') || call[0].includes('object'))
      );
      expect(hasObjectData).toBe(true);
    });

    it('should handle string data correctly', () => {
      const data = 'simple string';
      logToTerminal('Test', data, 'INFO');

      expect(mockConsoleLog).toHaveBeenCalled();
      
      // Check that string data is logged
      const logCalls = mockConsoleLog.mock.calls;
      const hasStringData = logCalls.some(call => 
        call[0] && call[0].includes('simple string')
      );
      expect(hasStringData).toBe(true);
    });

    it('should attempt to send to log server', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true });

      logToTerminal('Test message', null, 'INFO');

      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/log',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('Test message')
        })
      );
    });

    it('should handle log server errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      logToTerminal('Test message', null, 'INFO');

      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(global.fetch).toHaveBeenCalled();
      // Should not throw error
    });
  });
});