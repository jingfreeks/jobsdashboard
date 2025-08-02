import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../useToast';

// Mock Date.now() to have predictable timestamps
const mockDateNow = vi.fn();
const originalDateNow = Date.now;

describe('useToast', () => {
  beforeEach(() => {
    mockDateNow.mockReturnValue(1234567890);
    Date.now = mockDateNow;
    vi.clearAllMocks();
  });

  afterEach(() => {
    Date.now = originalDateNow;
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with empty toasts array', () => {
      const { result } = renderHook(() => useToast());

      expect(result.current.toasts).toEqual([]);
      expect(result.current.toasts).toHaveLength(0);
    });

    it('should return all expected functions', () => {
      const { result } = renderHook(() => useToast());

      expect(typeof result.current.addToast).toBe('function');
      expect(typeof result.current.removeToast).toBe('function');
      expect(typeof result.current.showSuccess).toBe('function');
      expect(typeof result.current.showError).toBe('function');
      expect(typeof result.current.showWarning).toBe('function');
      expect(typeof result.current.showInfo).toBe('function');
    });
  });

  describe('addToast', () => {
    it('should add a toast with default type and duration', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('Test message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toEqual({
        id: '1234567890',
        message: 'Test message',
        type: 'info',
        duration: undefined,
      });
    });

    it('should add a toast with custom type and duration', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('Custom toast', 'success', 5000);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toEqual({
        id: '1234567890',
        message: 'Custom toast',
        type: 'success',
        duration: 5000,
      });
    });

    it('should add multiple toasts', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('First toast', 'info');
        mockDateNow.mockReturnValue(1234567891);
        result.current.addToast('Second toast', 'success');
        mockDateNow.mockReturnValue(1234567892);
        result.current.addToast('Third toast', 'error');
      });

      expect(result.current.toasts).toHaveLength(3);
      expect(result.current.toasts[0].message).toBe('First toast');
      expect(result.current.toasts[1].message).toBe('Second toast');
      expect(result.current.toasts[2].message).toBe('Third toast');
      expect(result.current.toasts[0].id).toBe('1234567890');
      expect(result.current.toasts[1].id).toBe('1234567891');
      expect(result.current.toasts[2].id).toBe('1234567892');
    });

    it('should handle empty message', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('', 'warning');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('');
      expect(result.current.toasts[0].type).toBe('warning');
    });

    it('should handle special characters in message', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('Special chars: !@#$%^&*()', 'info');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Special chars: !@#$%^&*()');
    });

    it('should handle unicode characters in message', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('Unicode: 🚀 ✅ ❌ ⚠️', 'info');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Unicode: 🚀 ✅ ❌ ⚠️');
    });

    it('should handle very long messages', () => {
      const { result } = renderHook(() => useToast());
      const longMessage = 'A'.repeat(1000);

      act(() => {
        result.current.addToast(longMessage, 'info');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe(longMessage);
    });
  });

  describe('removeToast', () => {
    it('should remove a specific toast by id', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('First toast');
        mockDateNow.mockReturnValue(1234567891);
        result.current.addToast('Second toast');
        mockDateNow.mockReturnValue(1234567892);
        result.current.addToast('Third toast');
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.removeToast('1234567891');
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts[0].message).toBe('First toast');
      expect(result.current.toasts[1].message).toBe('Third toast');
    });

    it('should handle removing non-existent toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('Test toast');
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        result.current.removeToast('non-existent-id');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Test toast');
    });

    it('should handle removing from empty toasts array', () => {
      const { result } = renderHook(() => useToast());

      expect(result.current.toasts).toHaveLength(0);

      act(() => {
        result.current.removeToast('any-id');
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should remove all toasts when called multiple times', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('First toast');
        mockDateNow.mockReturnValue(1234567891);
        result.current.addToast('Second toast');
        mockDateNow.mockReturnValue(1234567892);
        result.current.addToast('Third toast');
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.removeToast('1234567890');
        result.current.removeToast('1234567891');
        result.current.removeToast('1234567892');
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });

  describe('showSuccess', () => {
    it('should add a success toast with default duration', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showSuccess('Success message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toEqual({
        id: '1234567890',
        message: 'Success message',
        type: 'success',
        duration: undefined,
      });
    });

    it('should add a success toast with custom duration', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showSuccess('Success message', 10000);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toEqual({
        id: '1234567890',
        message: 'Success message',
        type: 'success',
        duration: 10000,
      });
    });
  });

  describe('showError', () => {
    it('should add an error toast with default duration', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showError('Error message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toEqual({
        id: '1234567890',
        message: 'Error message',
        type: 'error',
        duration: undefined,
      });
    });

    it('should add an error toast with custom duration', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showError('Error message', 15000);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toEqual({
        id: '1234567890',
        message: 'Error message',
        type: 'error',
        duration: 15000,
      });
    });
  });

  describe('showWarning', () => {
    it('should add a warning toast with default duration', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showWarning('Warning message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toEqual({
        id: '1234567890',
        message: 'Warning message',
        type: 'warning',
        duration: undefined,
      });
    });

    it('should add a warning toast with custom duration', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showWarning('Warning message', 8000);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toEqual({
        id: '1234567890',
        message: 'Warning message',
        type: 'warning',
        duration: 8000,
      });
    });
  });

  describe('showInfo', () => {
    it('should add an info toast with default duration', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showInfo('Info message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toEqual({
        id: '1234567890',
        message: 'Info message',
        type: 'info',
        duration: undefined,
      });
    });

    it('should add an info toast with custom duration', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showInfo('Info message', 6000);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toEqual({
        id: '1234567890',
        message: 'Info message',
        type: 'info',
        duration: 6000,
      });
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle multiple operations in sequence', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showSuccess('Operation successful');
        mockDateNow.mockReturnValue(1234567891);
        result.current.showError('Operation failed');
        mockDateNow.mockReturnValue(1234567892);
        result.current.showWarning('Please check your input');
        mockDateNow.mockReturnValue(1234567893);
        result.current.showInfo('Processing...');
      });

      expect(result.current.toasts).toHaveLength(4);
      expect(result.current.toasts[0].type).toBe('success');
      expect(result.current.toasts[1].type).toBe('error');
      expect(result.current.toasts[2].type).toBe('warning');
      expect(result.current.toasts[3].type).toBe('info');

      act(() => {
        result.current.removeToast('1234567891'); // Remove error toast
      });

      expect(result.current.toasts).toHaveLength(3);
      expect(result.current.toasts[0].type).toBe('success');
      expect(result.current.toasts[1].type).toBe('warning');
      expect(result.current.toasts[2].type).toBe('info');
    });

    it('should handle rapid toast additions and removals', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('Toast 1');
        mockDateNow.mockReturnValue(1234567891);
        result.current.addToast('Toast 2');
        mockDateNow.mockReturnValue(1234567892);
        result.current.addToast('Toast 3');
        result.current.removeToast('1234567891'); // Remove Toast 2
        mockDateNow.mockReturnValue(1234567893);
        result.current.addToast('Toast 4');
        result.current.removeToast('1234567890'); // Remove Toast 1
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts[0].message).toBe('Toast 3');
      expect(result.current.toasts[1].message).toBe('Toast 4');
    });

    it('should maintain toast order after removals', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('First');
        mockDateNow.mockReturnValue(1234567891);
        result.current.addToast('Second');
        mockDateNow.mockReturnValue(1234567892);
        result.current.addToast('Third');
        mockDateNow.mockReturnValue(1234567893);
        result.current.addToast('Fourth');
      });

      expect(result.current.toasts).toHaveLength(4);

      act(() => {
        result.current.removeToast('1234567891'); // Remove second
        result.current.removeToast('1234567893'); // Remove fourth
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts[0].message).toBe('First');
      expect(result.current.toasts[1].message).toBe('Third');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero duration', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('Test message', 'info', 0);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].duration).toBe(0);
    });

    it('should handle negative duration', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('Test message', 'info', -1000);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].duration).toBe(-1000);
    });

    it('should handle very large duration', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('Test message', 'info', Number.MAX_SAFE_INTEGER);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].duration).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should handle all toast types', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('Success message', 'success');
        mockDateNow.mockReturnValue(1234567891);
        result.current.addToast('Error message', 'error');
        mockDateNow.mockReturnValue(1234567892);
        result.current.addToast('Warning message', 'warning');
        mockDateNow.mockReturnValue(1234567893);
        result.current.addToast('Info message', 'info');
      });

      expect(result.current.toasts).toHaveLength(4);
      expect(result.current.toasts[0].type).toBe('success');
      expect(result.current.toasts[1].type).toBe('error');
      expect(result.current.toasts[2].type).toBe('warning');
      expect(result.current.toasts[3].type).toBe('info');
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot for initial state', () => {
      const { result } = renderHook(() => useToast());

      expect(result.current).toMatchSnapshot();
    });

    it('should match snapshot after adding a toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('Test message', 'success', 5000);
      });

      expect(result.current).toMatchSnapshot();
    });

    it('should match snapshot after adding multiple toasts', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showSuccess('Success message');
        mockDateNow.mockReturnValue(1234567891);
        result.current.showError('Error message');
        mockDateNow.mockReturnValue(1234567892);
        result.current.showWarning('Warning message');
        mockDateNow.mockReturnValue(1234567893);
        result.current.showInfo('Info message');
      });

      expect(result.current).toMatchSnapshot();
    });

    it('should match snapshot after removing toasts', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showSuccess('Success message');
        mockDateNow.mockReturnValue(1234567891);
        result.current.showError('Error message');
        mockDateNow.mockReturnValue(1234567892);
        result.current.showWarning('Warning message');
      });

      act(() => {
        result.current.removeToast('1234567891');
      });

      expect(result.current).toMatchSnapshot();
    });

    it('should match snapshot for empty state after removing all toasts', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showSuccess('Success message');
        mockDateNow.mockReturnValue(1234567891);
        result.current.showError('Error message');
      });

      act(() => {
        result.current.removeToast('1234567890');
        result.current.removeToast('1234567891');
      });

      expect(result.current).toMatchSnapshot();
    });
  });

  describe('Performance and Memory', () => {
    it('should handle large number of toasts', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        for (let i = 0; i < 100; i++) {
          mockDateNow.mockReturnValue(1234567890 + i);
          result.current.addToast(`Toast ${i}`, 'info');
        }
      });

      expect(result.current.toasts).toHaveLength(100);
      expect(result.current.toasts[99].message).toBe('Toast 99');
    });

    it('should handle rapid state updates', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        for (let i = 0; i < 50; i++) {
          mockDateNow.mockReturnValue(1234567890 + i);
          result.current.addToast(`Toast ${i}`);
          if (i % 2 === 0) {
            result.current.removeToast(`1234567890${i - 1}`);
          }
        }
      });

      // Should have some toasts remaining
      expect(result.current.toasts.length).toBeGreaterThan(0);
    });
  });
}); 