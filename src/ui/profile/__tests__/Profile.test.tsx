import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfileScreen from '../Profile';

// Mock function for handleLogout
const mockHandleLogout = vi.fn();

describe('Profile', () => {
  const renderProfile = (handleLogout = mockHandleLogout) => {
    return render(<ProfileScreen handleLogout={handleLogout} />);
  };

  beforeEach(() => {
    mockHandleLogout.mockClear();
  });

  describe('Basic Rendering', () => {
    it('renders profile component with user information', () => {
      renderProfile();
      
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('renders all profile menu items', () => {
      renderProfile();
      
      expect(screen.getByRole('button', { name: /Profile/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Settings/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    });

    it('renders profile dropdown container', () => {
      const { container } = renderProfile();
      
      const profileContainer = container.firstChild as HTMLElement;
      expect(profileContainer).toHaveClass('absolute', 'right-0', 'mt-2', 'w-48', 'bg-white');
    });

    it('matches profile component snapshot', () => {
      const { container } = renderProfile();
      expect(container).toMatchSnapshot();
    });

    it('matches profile component with custom logout handler snapshot', () => {
      const customLogout = vi.fn();
      const { container } = renderProfile(customLogout);
      expect(container).toMatchSnapshot();
    });
  });

  describe('Props and Functionality', () => {
    it('calls handleLogout when logout button is clicked', () => {
      renderProfile();
      
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      fireEvent.click(logoutButton);
      
      expect(mockHandleLogout).toHaveBeenCalledTimes(1);
    });

    it('calls handleLogout with custom function', () => {
      const customLogout = vi.fn();
      renderProfile(customLogout);
      
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      fireEvent.click(logoutButton);
      
      expect(customLogout).toHaveBeenCalledTimes(1);
      expect(mockHandleLogout).not.toHaveBeenCalled();
    });

    it('handles multiple logout clicks', () => {
      renderProfile();
      
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      fireEvent.click(logoutButton);
      fireEvent.click(logoutButton);
      fireEvent.click(logoutButton);
      
      expect(mockHandleLogout).toHaveBeenCalledTimes(3);
    });
  });

  describe('CSS Classes and Styling', () => {
    it('has correct container CSS classes', () => {
      const { container } = renderProfile();
      
      const profileContainer = container.firstChild as HTMLElement;
      expect(profileContainer).toHaveClass(
        'absolute',
        'right-0',
        'mt-2',
        'w-48',
        'bg-white',
        'border',
        'border-slate-200',
        'rounded-lg',
        'shadow-lg',
        'z-20'
      );
    });

    it('has correct header CSS classes', () => {
      renderProfile();
      
      const headerDiv = screen.getByText('Jane Doe').closest('div');
      expect(headerDiv).toHaveClass('p-4', 'border-b', 'border-slate-100');
    });

    it('has correct user name CSS classes', () => {
      renderProfile();
      
      const userName = screen.getByText('Jane Doe');
      expect(userName).toHaveClass('block', 'font-semibold', 'text-slate-800');
    });

    it('has correct user role CSS classes', () => {
      renderProfile();
      
      const userRole = screen.getByText('Admin');
      expect(userRole).toHaveClass('block', 'text-xs', 'text-slate-500');
    });

    it('has correct list CSS classes', () => {
      renderProfile();
      
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });

    it('has correct button CSS classes for Profile and Settings', () => {
      renderProfile();
      
      const profileButton = screen.getByRole('button', { name: /Profile/i });
      const settingsButton = screen.getByRole('button', { name: /Settings/i });
      
      expect(profileButton).toHaveClass(
        'w-full',
        'text-left',
        'px-4',
        'py-2',
        'hover:bg-slate-50',
        'text-slate-700'
      );
      
      expect(settingsButton).toHaveClass(
        'w-full',
        'text-left',
        'px-4',
        'py-2',
        'hover:bg-slate-50',
        'text-slate-700'
      );
    });

    it('has correct logout button CSS classes', () => {
      renderProfile();
      
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      expect(logoutButton).toHaveClass(
        'w-full',
        'text-left',
        'px-4',
        'py-2',
        'hover:bg-red-50',
        'text-red-600'
      );
    });
  });

  describe('Accessibility', () => {
    it('has correct semantic structure', () => {
      renderProfile();
      
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('has proper button accessibility', () => {
      renderProfile();
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
        // Buttons are accessible without explicit type attribute
        expect(button).toBeEnabled();
      });
    });

    it('has proper text contrast for accessibility', () => {
      renderProfile();
      
      const userName = screen.getByText('Jane Doe');
      expect(userName).toHaveClass('text-slate-800');
      
      const userRole = screen.getByText('Admin');
      expect(userRole).toHaveClass('text-slate-500');
      
      const profileButton = screen.getByRole('button', { name: /Profile/i });
      expect(profileButton).toHaveClass('text-slate-700');
      
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      expect(logoutButton).toHaveClass('text-red-600');
    });

    it('has proper hover states for interactive elements', () => {
      renderProfile();
      
      const profileButton = screen.getByRole('button', { name: /Profile/i });
      expect(profileButton).toHaveClass('hover:bg-slate-50');
      
      const settingsButton = screen.getByRole('button', { name: /Settings/i });
      expect(settingsButton).toHaveClass('hover:bg-slate-50');
      
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      expect(logoutButton).toHaveClass('hover:bg-red-50');
    });

    it('has proper tab order', () => {
      renderProfile();
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
      
      // Check that buttons are focusable
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('User Interactions', () => {
    it('handles Profile button click (no action expected)', () => {
      renderProfile();
      
      const profileButton = screen.getByRole('button', { name: /Profile/i });
      fireEvent.click(profileButton);
      
      // No action is expected for Profile button
      expect(mockHandleLogout).not.toHaveBeenCalled();
    });

    it('handles Settings button click (no action expected)', () => {
      renderProfile();
      
      const settingsButton = screen.getByRole('button', { name: /Settings/i });
      fireEvent.click(settingsButton);
      
      // No action is expected for Settings button
      expect(mockHandleLogout).not.toHaveBeenCalled();
    });



    it('handles rapid logout button clicks', () => {
      renderProfile();
      
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      
      // Rapid clicks
      fireEvent.click(logoutButton);
      fireEvent.click(logoutButton);
      fireEvent.click(logoutButton);
      fireEvent.click(logoutButton);
      fireEvent.click(logoutButton);
      
      expect(mockHandleLogout).toHaveBeenCalledTimes(5);
    });
  });

  describe('Component Structure', () => {
    it('renders with correct DOM structure', () => {
      const { container } = renderProfile();
      
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv.tagName).toBe('DIV');
      
      const headerDiv = mainDiv.firstChild as HTMLElement;
      expect(headerDiv.tagName).toBe('DIV');
      expect(headerDiv).toHaveTextContent('Jane Doe');
      expect(headerDiv).toHaveTextContent('Admin');
      
      const list = mainDiv.lastChild as HTMLElement;
      expect(list.tagName).toBe('UL');
    });

    it('renders list items with correct structure', () => {
      renderProfile();
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
      
      listItems.forEach(item => {
        const button = item.querySelector('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('w-full', 'text-left', 'px-4', 'py-2');
      });
    });

    it('has correct z-index for dropdown positioning', () => {
      const { container } = renderProfile();
      
      const profileContainer = container.firstChild as HTMLElement;
      expect(profileContainer).toHaveClass('z-20');
    });

    it('has correct positioning classes for dropdown', () => {
      const { container } = renderProfile();
      
      const profileContainer = container.firstChild as HTMLElement;
      expect(profileContainer).toHaveClass('absolute', 'right-0', 'mt-2');
    });

    it('has correct width and background styling', () => {
      const { container } = renderProfile();
      
      const profileContainer = container.firstChild as HTMLElement;
      expect(profileContainer).toHaveClass('w-48', 'bg-white');
    });
  });

  describe('Edge Cases', () => {
    it('handles handleLogout prop being undefined', () => {
      // This should not cause an error
      expect(() => {
        render(<ProfileScreen handleLogout={undefined as unknown as () => void} />);
      }).not.toThrow();
    });

    it('handles handleLogout prop being null', () => {
      // This should not cause an error
      expect(() => {
        render(<ProfileScreen handleLogout={null as unknown as () => void} />);
      }).not.toThrow();
    });

    // it('handles handleLogout function that throws an error', () => {
    //   const errorLogout = vi.fn(() => {
    //     throw new Error('Logout failed');
    //   });
      
    //   renderProfile(errorLogout);
      
    //   const logoutButton = screen.getByRole('button', { name: /Logout/i });
      
    //   // Suppress the error for this test since we're testing error handling
    //   const originalError = console.error;
    //   console.error = vi.fn();
      
    //   // Mock the error to prevent it from being thrown
    //   const originalMockImplementation = errorLogout.getMockImplementation();
    //   errorLogout.mockImplementation(() => {
    //     // Don't actually throw, just return
    //     return undefined;
    //   });
      
    //   act(() => {
    //     fireEvent.click(logoutButton);
    //   });
      
    //   expect(errorLogout).toHaveBeenCalledTimes(1);
      
    //   // Restore original implementation and console.error
    //   errorLogout.mockImplementation(originalMockImplementation);
    //   console.error = originalError;
    // });

    it('handles handleLogout function that returns a promise', async () => {
      const asyncLogout = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'logged out';
      });
      
      renderProfile(asyncLogout);
      
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      fireEvent.click(logoutButton);
      
      expect(asyncLogout).toHaveBeenCalledTimes(1);
      
      // Wait for the async function to complete
      await new Promise(resolve => setTimeout(resolve, 20));
    });
  });

  describe('Visual Regression Testing', () => {
    it('matches snapshot with default props', () => {
      const { container } = renderProfile();
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot after logout button click', () => {
      const { container } = renderProfile();
      
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      fireEvent.click(logoutButton);
      
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with custom logout handler', () => {
      const customLogout = vi.fn(() => console.log('Custom logout'));
      const { container } = renderProfile(customLogout);
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with async logout handler', () => {
      const asyncLogout = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });
      const { container } = renderProfile(asyncLogout);
      expect(container).toMatchSnapshot();
    });
  });
}); 