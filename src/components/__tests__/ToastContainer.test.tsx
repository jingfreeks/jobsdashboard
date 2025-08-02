import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ToastContainer from '../ToastContainer';
import type { ToastMessage } from '@/hooks/useToast';

// Mock the Toast component
vi.mock('../Toast', () => ({
  default: vi.fn(({ message, type, duration, onClose }) => (
    <div data-testid="toast" data-type={type} data-duration={duration}>
      <span>{message}</span>
      <button onClick={onClose} data-testid="close-button">
        Close
      </button>
    </div>
  )),
}));

describe('ToastContainer Component', () => {
  const mockOnRemoveToast = vi.fn();

  const createMockToast = (id: string, message: string, type: ToastMessage['type'] = 'info', duration?: number): ToastMessage => ({
    id,
    message,
    type,
    duration,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Structure and Rendering', () => {
    it('renders empty container when no toasts', () => {
      const { container } = render(<ToastContainer toasts={[]} onRemoveToast={mockOnRemoveToast} />);
      
      expect(container.firstChild).toHaveClass('fixed', 'top-4', 'right-4', 'z-50', 'space-y-2');
      expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
    });

    it('matches empty toast container snapshot', () => {
      const { container } = render(<ToastContainer toasts={[]} onRemoveToast={mockOnRemoveToast} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders single toast correctly', () => {
      const toasts = [createMockToast('1', 'Test message', 'success')];
      
      render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      
      expect(screen.getByTestId('toast')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.getByTestId('toast')).toHaveAttribute('data-type', 'success');
    });

    it('matches single toast container snapshot', () => {
      const toasts = [createMockToast('1', 'Test message', 'success')];
      const { container } = render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders multiple toasts correctly', () => {
      const toasts = [
        createMockToast('1', 'First message', 'success'),
        createMockToast('2', 'Second message', 'error'),
        createMockToast('3', 'Third message', 'warning'),
      ];
      
      render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      
      const toastElements = screen.getAllByTestId('toast');
      expect(toastElements).toHaveLength(3);
      expect(screen.getByText('First message')).toBeInTheDocument();
      expect(screen.getByText('Second message')).toBeInTheDocument();
      expect(screen.getByText('Third message')).toBeInTheDocument();
    });

    it('matches multiple toasts container snapshot', () => {
      const toasts = [
        createMockToast('1', 'First message', 'success'),
        createMockToast('2', 'Second message', 'error'),
        createMockToast('3', 'Third message', 'warning'),
      ];
      const { container } = render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Toast Positioning and Layout', () => {
    it('applies correct positioning classes', () => {
      const { container } = render(<ToastContainer toasts={[]} onRemoveToast={mockOnRemoveToast} />);
      const containerElement = container.firstChild as HTMLElement;
      
      expect(containerElement).toHaveClass('fixed');
      expect(containerElement).toHaveClass('top-4');
      expect(containerElement).toHaveClass('right-4');
      expect(containerElement).toHaveClass('z-50');
      expect(containerElement).toHaveClass('space-y-2');
    });

    it('renders toasts in correct order', () => {
      const toasts = [
        createMockToast('1', 'First toast'),
        createMockToast('2', 'Second toast'),
        createMockToast('3', 'Third toast'),
      ];
      
      render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      
      const toastElements = screen.getAllByTestId('toast');
      expect(toastElements[0]).toHaveTextContent('First toast');
      expect(toastElements[1]).toHaveTextContent('Second toast');
      expect(toastElements[2]).toHaveTextContent('Third toast');
    });

    it('maintains spacing between toasts', () => {
      const toasts = [
        createMockToast('1', 'First toast'),
        createMockToast('2', 'Second toast'),
      ];
      
      const { container } = render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      const containerElement = container.firstChild as HTMLElement;
      
      expect(containerElement).toHaveClass('space-y-2');
    });
  });

  describe('Toast Integration and Props Passing', () => {
    it('passes correct props to Toast components', () => {
      const toasts = [
        createMockToast('1', 'Test message', 'success', 5000),
        createMockToast('2', 'Error message', 'error', 3000),
      ];
      
      render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      
      const toastElements = screen.getAllByTestId('toast');
      expect(toastElements[0]).toHaveAttribute('data-type', 'success');
      expect(toastElements[0]).toHaveAttribute('data-duration', '5000');
      expect(toastElements[1]).toHaveAttribute('data-type', 'error');
      expect(toastElements[1]).toHaveAttribute('data-duration', '3000');
    });

    it('passes unique keys to each toast', () => {
      const toasts = [
        createMockToast('unique-id-1', 'First message'),
        createMockToast('unique-id-2', 'Second message'),
      ];
      
      render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      
      // Each toast should have a unique key prop
      const toastElements = screen.getAllByTestId('toast');
      expect(toastElements).toHaveLength(2);
    });

    it('passes onClose callback that calls onRemoveToast with correct id', () => {
      const toasts = [createMockToast('test-id', 'Test message')];
      
      render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      
      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);
      
      expect(mockOnRemoveToast).toHaveBeenCalledWith('test-id');
    });

    it('handles multiple toast removals correctly', () => {
      const toasts = [
        createMockToast('id-1', 'First message'),
        createMockToast('id-2', 'Second message'),
        createMockToast('id-3', 'Third message'),
      ];
      
      render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      
      const closeButtons = screen.getAllByTestId('close-button');
      
      fireEvent.click(closeButtons[0]); // Remove first toast
      expect(mockOnRemoveToast).toHaveBeenCalledWith('id-1');
      
      fireEvent.click(closeButtons[1]); // Remove second toast
      expect(mockOnRemoveToast).toHaveBeenCalledWith('id-2');
      
      expect(mockOnRemoveToast).toHaveBeenCalledTimes(2);
    });
  });

  describe('Toast Types and Variants', () => {
    it('renders all toast types correctly', () => {
      const types: ToastMessage['type'][] = ['success', 'error', 'warning', 'info'];
      const toasts = types.map((type, index) => 
        createMockToast(`id-${index}`, `${type} message`, type)
      );
      
      render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      
      const toastElements = screen.getAllByTestId('toast');
      expect(toastElements).toHaveLength(4);
      
      types.forEach((type, index) => {
        expect(toastElements[index]).toHaveAttribute('data-type', type);
        expect(screen.getByText(`${type} message`)).toBeInTheDocument();
      });
    });

    it('handles toasts with custom durations', () => {
      const toasts = [
        createMockToast('1', 'Short duration', 'info', 1000),
        createMockToast('2', 'Long duration', 'success', 10000),
        createMockToast('3', 'Default duration', 'warning'), // No duration specified
      ];
      
      render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      
      const toastElements = screen.getAllByTestId('toast');
      expect(toastElements[0]).toHaveAttribute('data-duration', '1000');
      expect(toastElements[1]).toHaveAttribute('data-duration', '10000');
      expect(toastElements[2]).not.toHaveAttribute('data-duration');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles empty toast array', () => {
      render(<ToastContainer toasts={[]} onRemoveToast={mockOnRemoveToast} />);
      
      expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
      expect(mockOnRemoveToast).not.toHaveBeenCalled();
    });

    it('handles toasts with empty messages', () => {
      const toasts = [
        createMockToast('1', ''),
        createMockToast('2', '   '), // Whitespace only
      ];
      
      render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      
      const toastElements = screen.getAllByTestId('toast');
      expect(toastElements).toHaveLength(2);
    });

    it('handles toasts with very long messages', () => {
      const longMessage = 'A'.repeat(1000);
      const toasts = [createMockToast('1', longMessage)];
      
      render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles toasts with special characters in messages', () => {
      const specialMessage = 'Test message with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      const toasts = [createMockToast('1', specialMessage)];
      
      render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      
      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it('handles toasts with duplicate IDs', () => {
      const toasts = [
        createMockToast('duplicate-id', 'First message'),
        createMockToast('duplicate-id', 'Second message'), // Same ID
      ];
      
      render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      
      const toastElements = screen.getAllByTestId('toast');
      expect(toastElements).toHaveLength(2);
    });

    it('handles toasts with null or undefined properties', () => {
      const toasts = [
        { id: '1', message: null as any, type: 'info' as const },
        { id: '2', message: 'Valid message', type: undefined as any },
      ];
      
      render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      
      const toastElements = screen.getAllByTestId('toast');
      expect(toastElements).toHaveLength(2);
    });
  });

  describe('Performance and Memory', () => {
    it('handles large number of toasts efficiently', () => {
      const toasts = Array.from({ length: 100 }, (_, index) => 
        createMockToast(`id-${index}`, `Message ${index}`)
      );
      
      render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      
      const toastElements = screen.getAllByTestId('toast');
      expect(toastElements).toHaveLength(100);
    });

    it('handles rapid toast additions and removals', () => {
      const { rerender } = render(<ToastContainer toasts={[]} onRemoveToast={mockOnRemoveToast} />);
      
      // Rapidly add and remove toasts
      for (let i = 0; i < 10; i++) {
        const toasts = [createMockToast(`id-${i}`, `Message ${i}`)];
        rerender(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      }
      
      expect(screen.getByTestId('toast')).toBeInTheDocument();
    });

    it('does not cause memory leaks with frequent updates', () => {
      const { rerender, unmount } = render(<ToastContainer toasts={[]} onRemoveToast={mockOnRemoveToast} />);
      
      // Simulate frequent updates
      for (let i = 0; i < 50; i++) {
        const toasts = [createMockToast(`id-${i}`, `Message ${i}`)];
        rerender(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      }
      
      unmount();
      
      // Should not throw any errors
      expect(mockOnRemoveToast).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('maintains proper z-index for accessibility', () => {
      const { container } = render(<ToastContainer toasts={[]} onRemoveToast={mockOnRemoveToast} />);
      const containerElement = container.firstChild as HTMLElement;
      
      expect(containerElement).toHaveClass('z-50');
    });

    it('ensures toasts are positioned for screen readers', () => {
      const { container } = render(<ToastContainer toasts={[]} onRemoveToast={mockOnRemoveToast} />);
      const containerElement = container.firstChild as HTMLElement;
      
      expect(containerElement).toHaveClass('fixed');
      expect(containerElement).toHaveClass('top-4');
      expect(containerElement).toHaveClass('right-4');
    });

    it('provides proper spacing for multiple toasts', () => {
      const toasts = [
        createMockToast('1', 'First toast'),
        createMockToast('2', 'Second toast'),
      ];
      
      const { container } = render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      const containerElement = container.firstChild as HTMLElement;
      
      expect(containerElement).toHaveClass('space-y-2');
    });
  });

  describe('Integration with Toast Component', () => {
    it('correctly integrates with individual Toast components', () => {
      const toasts = [
        createMockToast('1', 'Success message', 'success', 3000),
        createMockToast('2', 'Error message', 'error', 5000),
      ];
      
      render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      
      // Verify each toast is rendered with correct props
      const toastElements = screen.getAllByTestId('toast');
      expect(toastElements[0]).toHaveAttribute('data-type', 'success');
      expect(toastElements[0]).toHaveAttribute('data-duration', '3000');
      expect(toastElements[1]).toHaveAttribute('data-type', 'error');
      expect(toastElements[1]).toHaveAttribute('data-duration', '5000');
    });

    it('handles toast removal through individual toast close buttons', () => {
      const toasts = [
        createMockToast('toast-1', 'First message'),
        createMockToast('toast-2', 'Second message'),
      ];
      
      render(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      
      const closeButtons = screen.getAllByTestId('close-button');
      
      // Click first toast close button
      fireEvent.click(closeButtons[0]);
      expect(mockOnRemoveToast).toHaveBeenCalledWith('toast-1');
      
      // Click second toast close button
      fireEvent.click(closeButtons[1]);
      expect(mockOnRemoveToast).toHaveBeenCalledWith('toast-2');
      
      expect(mockOnRemoveToast).toHaveBeenCalledTimes(2);
    });
  });

  describe('State Management Integration', () => {
    it('reflects toast state changes correctly', () => {
      const { rerender } = render(<ToastContainer toasts={[]} onRemoveToast={mockOnRemoveToast} />);
      
      // Initially no toasts
      expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
      
      // Add a toast
      const toasts = [createMockToast('1', 'New toast')];
      rerender(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      expect(screen.getByTestId('toast')).toBeInTheDocument();
      
      // Remove the toast
      rerender(<ToastContainer toasts={[]} onRemoveToast={mockOnRemoveToast} />);
      expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
    });

    it('handles toast updates correctly', () => {
      const { rerender } = render(<ToastContainer toasts={[]} onRemoveToast={mockOnRemoveToast} />);
      
      // Add initial toast
      let toasts = [createMockToast('1', 'Initial message', 'info')];
      rerender(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      expect(screen.getByText('Initial message')).toBeInTheDocument();
      
      // Update toast message
      toasts = [createMockToast('1', 'Updated message', 'success')];
      rerender(<ToastContainer toasts={toasts} onRemoveToast={mockOnRemoveToast} />);
      expect(screen.getByText('Updated message')).toBeInTheDocument();
    });
  });
}); 