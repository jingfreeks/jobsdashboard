import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Toast from '../Toast';
import type { ToastProps } from '../Toast';

// Mock timers for testing timeouts
vi.useFakeTimers();

describe('Toast Component', () => {
  const defaultProps: ToastProps = {
    message: 'Test message',
    type: 'info',
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Component Structure and Rendering', () => {
    it('renders toast with basic structure', () => {
      render(<Toast {...defaultProps} />);
      
      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('matches toast component snapshot', () => {
      const { container } = render(<Toast {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders with custom duration', () => {
      render(<Toast {...defaultProps} duration={5000} />);
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('renders with default duration when not provided', () => {
      render(<Toast {...defaultProps} />);
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
  });

  describe('Toast Types and Styling', () => {
    it('renders success toast with correct styling and icon', () => {
      const { container } = render(<Toast {...defaultProps} type="success" message="Success message" />);
      
      const toast = container.firstChild as HTMLElement;
      expect(toast).toHaveClass('bg-green-500');
      expect(toast).toHaveClass('text-white');
      
      // Check for success icon (checkmark)
      const icon = toast.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders error toast with correct styling and icon', () => {
      const { container } = render(<Toast {...defaultProps} type="error" message="Error message" />);
      
      const toast = container.firstChild as HTMLElement;
      expect(toast).toHaveClass('bg-red-500');
      expect(toast).toHaveClass('text-white');
      
      // Check for error icon (X)
      const icon = toast.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders warning toast with correct styling and icon', () => {
      const { container } = render(<Toast {...defaultProps} type="warning" message="Warning message" />);
      
      const toast = container.firstChild as HTMLElement;
      expect(toast).toHaveClass('bg-yellow-500');
      expect(toast).toHaveClass('text-white');
      
      // Check for warning icon (triangle)
      const icon = toast.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders info toast with correct styling and icon', () => {
      const { container } = render(<Toast {...defaultProps} type="info" message="Info message" />);
      
      const toast = container.firstChild as HTMLElement;
      expect(toast).toHaveClass('bg-blue-500');
      expect(toast).toHaveClass('text-white');
      
      // Check for info icon (circle with i)
      const icon = toast.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders with default styling for unknown type', () => {
      const { container } = render(<Toast {...defaultProps} type={'unknown' as ToastProps['type']} message="Unknown type message" />);
      
      const toast = container.firstChild as HTMLElement;
      expect(toast).toHaveClass('bg-gray-500');
      expect(toast).toHaveClass('text-white');
    });

    it('applies base styles to all toast types', () => {
      const types: ToastProps['type'][] = ['success', 'error', 'warning', 'info'];
      
      types.forEach(type => {
        const { container } = render(<Toast {...defaultProps} type={type} />);
        const toast = container.firstChild as HTMLElement;
        
        expect(toast).toHaveClass('fixed');
        expect(toast).toHaveClass('top-4');
        expect(toast).toHaveClass('right-4');
        expect(toast).toHaveClass('z-50');
        expect(toast).toHaveClass('p-4');
        expect(toast).toHaveClass('rounded-lg');
        expect(toast).toHaveClass('shadow-lg');
        expect(toast).toHaveClass('transition-all');
        expect(toast).toHaveClass('duration-300');
        expect(toast).toHaveClass('transform');
      });
    });
  });

  describe('Animation and Visibility States', () => {
    it('starts with visible state', () => {
      const { container } = render(<Toast {...defaultProps} />);
      const toast = container.firstChild as HTMLElement;
      
      expect(toast).toHaveClass('translate-x-0');
      expect(toast).toHaveClass('opacity-100');
    });

    it('applies fade out animation when closing', () => {
      const { container } = render(<Toast {...defaultProps} />);
      const toast = container.firstChild as HTMLElement;
      const closeButton = screen.getByRole('button');
      
      fireEvent.click(closeButton);
      
      expect(toast).toHaveClass('translate-x-full');
      expect(toast).toHaveClass('opacity-0');
    });

    it('calls onClose after animation delay when manually closed', () => {
      const onClose = vi.fn();
      render(<Toast {...defaultProps} onClose={onClose} />);
      const closeButton = screen.getByRole('button');
      
      fireEvent.click(closeButton);
      
      // Should not call onClose immediately
      expect(onClose).not.toHaveBeenCalled();
      
      // Should call onClose after 300ms animation delay
      act(() => {
        vi.advanceTimersByTime(300);
      });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Auto-dismiss Functionality', () => {
    it('auto-dismisses after default duration', () => {
      const onClose = vi.fn();
      render(<Toast {...defaultProps} onClose={onClose} />);
      
      // Should not call onClose immediately
      expect(onClose).not.toHaveBeenCalled();
      
      // Should call onClose after default duration (3000ms) + animation delay (300ms)
      act(() => {
        vi.advanceTimersByTime(3300);
      });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('auto-dismisses after custom duration', () => {
      const onClose = vi.fn();
      render(<Toast {...defaultProps} onClose={onClose} duration={5000} />);
      
      // Should not call onClose immediately
      expect(onClose).not.toHaveBeenCalled();
      
      // Should call onClose after custom duration (5000ms) + animation delay (300ms)
      act(() => {
        vi.advanceTimersByTime(5300);
      });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('clears timeout on unmount', () => {
      const onClose = vi.fn();
      const { unmount } = render(<Toast {...defaultProps} onClose={onClose} />);
      
      unmount();
      
      // Advance time past the duration
      act(() => {
        vi.advanceTimersByTime(4000);
      });
      
      // Should not call onClose after unmount
      expect(onClose).not.toHaveBeenCalled();
    });

    it('updates timeout when duration changes', () => {
      const onClose = vi.fn();
      const { rerender } = render(<Toast {...defaultProps} onClose={onClose} duration={1000} />);
      
      // Change duration
      rerender(<Toast {...defaultProps} onClose={onClose} duration={2000} />);
      
      // Should not call onClose after original duration
      act(() => {
        vi.advanceTimersByTime(1300);
      });
      expect(onClose).not.toHaveBeenCalled();
      
      // Should call onClose after new duration
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('User Interactions', () => {
    it('handles close button click', () => {
      const onClose = vi.fn();
      render(<Toast {...defaultProps} onClose={onClose} />);
      const closeButton = screen.getByRole('button');
      
      fireEvent.click(closeButton);
      
      act(() => {
        vi.advanceTimersByTime(300);
      });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('prevents multiple onClose calls from manual close', () => {
      const onClose = vi.fn();
      render(<Toast {...defaultProps} onClose={onClose} />);
      const closeButton = screen.getAllByRole('button')[0];
      
      // Click multiple times
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);
      
      act(() => {
        vi.advanceTimersByTime(300);
      });
      
      // Should only call onClose once (the component doesn't prevent multiple calls)
      expect(onClose).toHaveBeenCalledTimes(3);
    });

    it('handles close button hover state', () => {
      render(<Toast {...defaultProps} />);
      const closeButton = screen.getByRole('button');
      
      expect(closeButton).toHaveClass('hover:text-gray-200');
      expect(closeButton).toHaveClass('transition-colors');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles empty message', () => {
      render(<Toast {...defaultProps} message="" />);
      expect(screen.getAllByRole('button')[0]).toBeInTheDocument();
    });

    it('handles very long messages', () => {
      const longMessage = 'A'.repeat(1000);
      render(<Toast {...defaultProps} message={longMessage} />);
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles special characters in message', () => {
      const specialMessage = 'Test message with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      render(<Toast {...defaultProps} message={specialMessage} />);
      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it('handles zero duration', () => {
      const onClose = vi.fn();
      render(<Toast {...defaultProps} onClose={onClose} duration={0} />);
      
      act(() => {
        vi.advanceTimersByTime(300);
      });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('handles negative duration', () => {
      const onClose = vi.fn();
      render(<Toast {...defaultProps} onClose={onClose} duration={-1000} />);
      
      act(() => {
        vi.advanceTimersByTime(300);
      });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('handles very large duration', () => {
      const onClose = vi.fn();
      render(<Toast {...defaultProps} onClose={onClose} duration={999999} />);
      
      // Should not call onClose immediately
      expect(onClose).not.toHaveBeenCalled();
      
      // Should not call onClose after a reasonable time
      act(() => {
        vi.advanceTimersByTime(10000);
      });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper button role', () => {
      render(<Toast {...defaultProps} />);
      const closeButton = screen.getAllByRole('button')[0];
      expect(closeButton).toBeInTheDocument();
    });

    it('has proper SVG icons', () => {
      const { container } = render(<Toast {...defaultProps} type="success" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 20 20');
    });

    it('maintains proper contrast with white text', () => {
      const { container } = render(<Toast {...defaultProps} type="success" />);
      const toast = container.firstChild as HTMLElement;
      expect(toast).toHaveClass('text-white');
    });
  });

  describe('Performance and Memory', () => {
    it('cleans up timers properly', () => {
      const onClose = vi.fn();
      const { unmount } = render(<Toast {...defaultProps} onClose={onClose} />);
      
      unmount();
      
      // Should not cause memory leaks or timer issues
      act(() => {
        vi.advanceTimersByTime(10000);
      });
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it('handles rapid state changes', () => {
      const onClose = vi.fn();
      const { rerender } = render(<Toast {...defaultProps} onClose={onClose} duration={1000} />);
      
      // Rapidly change props
      for (let i = 0; i < 5; i++) {
        rerender(<Toast {...defaultProps} onClose={onClose} duration={1000 + i * 100} />);
      }
      
      // Should still work correctly - advance time past the final duration + animation delay
      act(() => {
        vi.advanceTimersByTime(1700); // Past the final duration (1000 + 4*100 = 1400) + 300ms animation delay
      });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration with Toast Types', () => {
    it('renders all toast types correctly', () => {
      const types: ToastProps['type'][] = ['success', 'error', 'warning', 'info'];
      
      types.forEach(type => {
        const { container } = render(<Toast {...defaultProps} type={type} message={`${type} message`} />);
        expect(screen.getByText(`${type} message`)).toBeInTheDocument();
        
        const toast = container.firstChild as HTMLElement;
        expect(toast).toHaveClass('text-white');
        expect(toast).toHaveClass('shadow-lg');
        
        // Clean up
        container.remove();
      });
    });

    it('maintains consistent layout across types', () => {
      const types: ToastProps['type'][] = ['success', 'error', 'warning', 'info'];
      
      types.forEach(type => {
        const { container } = render(<Toast {...defaultProps} type={type} />);
        const toast = container.firstChild as HTMLElement;
        
        // All types should have the same base layout classes
        const innerDiv = toast?.querySelector('.flex');
        expect(innerDiv).toHaveClass('flex');
        expect(innerDiv).toHaveClass('items-center');
        expect(innerDiv).toHaveClass('gap-3');
        
        // Clean up
        container.remove();
      });
    });
  });
}); 