import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Header from '../Header';

// Mock the lucide-react icons
vi.mock('lucide-react', () => ({
  User: vi.fn(({ className }) => <div data-testid="user-icon" className={className}>User</div>),
  BarChart2: vi.fn(({ className }) => <div data-testid="barchart2-icon" className={className}>BarChart2</div>),
  Bell: vi.fn(({ className }) => <div data-testid="bell-icon" className={className}>Bell</div>),
}));

// Mock the UI components
vi.mock('@/ui', () => ({
  Notification: vi.fn(({ data }) => (
    <div data-testid="notification-dropdown">
      {data.map((notification: { id: number; message: string; time: string }) => (
        <div key={notification.id} data-testid={`notification-${notification.id}`}>
          {notification.message} - {notification.time}
        </div>
      ))}
    </div>
  )),
  Profile: vi.fn(({ handleLogout }) => (
    <div data-testid="profile-dropdown">
      <button onClick={handleLogout} data-testid="logout-button">
        Logout
      </button>
    </div>
  )),
}));

describe('Header', () => {
  let mockHandleLogout: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockHandleLogout = vi.fn();
  });

  const renderHeader = () => {
    return render(<Header handleLogout={mockHandleLogout} />);
  };

  it('should render correctly and match snapshot', () => {
    const { container } = renderHeader();
    expect(container).toMatchSnapshot();
  });

  it('should render the dashboard title and logo', () => {
    renderHeader();
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('barchart2-icon')).toBeInTheDocument();
  });

  it('should render the notification bell with badge', () => {
    renderHeader();
    
    const bellButton = screen.getByTestId('notification-button');
    expect(bellButton).toBeInTheDocument();
    
    // Check for notification badge
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render the user profile button', () => {
    renderHeader();
    
    const profileButton = screen.getByTestId('profile-button');
    expect(profileButton).toBeInTheDocument();
  });

  it('should show notifications when bell is clicked', () => {
    renderHeader();
    
    const bellButton = screen.getByTestId('notification-button');
    fireEvent.click(bellButton!);
    
    expect(screen.getByTestId('notification-dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('notification-1')).toBeInTheDocument();
    expect(screen.getByTestId('notification-2')).toBeInTheDocument();
    expect(screen.getByTestId('notification-3')).toBeInTheDocument();
  });

  it('should hide notifications when bell is clicked again', () => {
    renderHeader();
    
    const bellButton = screen.getByTestId('notification-button');
    
    // First click to show
    fireEvent.click(bellButton!);
    expect(screen.getByTestId('notification-dropdown')).toBeInTheDocument();
    
    // Second click to hide
    fireEvent.click(bellButton!);
    expect(screen.queryByTestId('notification-dropdown')).not.toBeInTheDocument();
  });

  it('should show profile dropdown when user button is clicked', () => {
    renderHeader();
    
    const profileButton = screen.getByTestId('profile-button');
    fireEvent.click(profileButton!);
    
    expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
  });

  it('should hide profile dropdown when user button is clicked again', () => {
    renderHeader();
    
    const profileButton = screen.getByTestId('profile-button');
    
    // First click to show
    fireEvent.click(profileButton!);
    expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
    
    // Second click to hide
    fireEvent.click(profileButton!);
    expect(screen.queryByTestId('profile-dropdown')).not.toBeInTheDocument();
  });

  it('should call handleLogout when logout button is clicked', () => {
    renderHeader();
    
    const profileButton = screen.getByTestId('profile-button');
    fireEvent.click(profileButton!);
    
    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);
    
    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
  });

  it('should display correct notification data', () => {
    renderHeader();
    
    const bellButton = screen.getByTestId('notification-button');
    fireEvent.click(bellButton!);
    
    expect(screen.getByText('New job application received - 2m ago')).toBeInTheDocument();
    expect(screen.getByText('Interview scheduled for John Doe - 1h ago')).toBeInTheDocument();
    expect(screen.getByText('Offer sent to Jane Smith - 3h ago')).toBeInTheDocument();
  });

  it('should have correct CSS classes for header container', () => {
    renderHeader();
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass(
      'w-full', 'bg-white/90', 'border-b', 'border-slate-200', 'px-10', 'py-3',
      'flex', 'items-center', 'justify-between', 'shadow-sm', 'sticky', 'top-0', 'z-10', 'backdrop-blur'
    );
  });

  it('should have correct CSS classes for logo section', () => {
    renderHeader();
    
    const logoSection = screen.getByText('Dashboard').closest('div');
    expect(logoSection).toHaveClass('flex', 'items-center', 'gap-3');
  });

  it('should have correct CSS classes for dashboard title', () => {
    renderHeader();
    
    const title = screen.getByText('Dashboard');
    expect(title).toHaveClass('text-2xl', 'font-extrabold', 'text-slate-800', 'tracking-tight');
  });

  it('should have correct CSS classes for logo icon container', () => {
    renderHeader();
    
    const logoContainer = screen.getByTestId('barchart2-icon').closest('span');
    expect(logoContainer).toHaveClass(
      'inline-flex', 'items-center', 'justify-center', 'w-9', 'h-9',
      'rounded-full', 'bg-blue-100', 'text-blue-600'
    );
  });

  it('should have correct CSS classes for right section', () => {
    renderHeader();
    
    const rightSection = screen.getByTestId('notification-button').closest('div')?.parentElement;
    expect(rightSection).toHaveClass('flex', 'items-center', 'gap-4');
  });

  it('should have correct CSS classes for notification button', () => {
    renderHeader();
    
    const notificationButton = screen.getByTestId('notification-button');
    expect(notificationButton).toHaveClass('relative', 'p-2', 'rounded-full', 'hover:bg-blue-50', 'transition');
  });

  it('should have correct CSS classes for notification badge', () => {
    renderHeader();
    
    const badge = screen.getByText('3');
    expect(badge).toHaveClass('absolute', '-top-1', '-right-1', 'bg-red-500', 'text-white', 'text-xs', 'rounded-full', 'px-1.5');
  });

  it('should have correct CSS classes for profile button', () => {
    renderHeader();
    
    const profileButton = screen.getByTestId('profile-button');
    expect(profileButton).toHaveClass(
      'inline-flex', 'items-center', 'justify-center', 'w-10', 'h-10',
      'rounded-full', 'bg-blue-100', 'text-blue-700', 'font-bold', 'text-lg', 'focus:outline-none'
    );
  });

  it('should have correct CSS classes for notification icon', () => {
    renderHeader();
    
    const notificationButton = screen.getByTestId('notification-button');
    const notificationIcon = notificationButton.querySelector('div');
    expect(notificationIcon).toHaveClass('w-6', 'h-6', 'text-blue-700');
  });

  it('should have correct CSS classes for user icon', () => {
    renderHeader();
    
    const profileButton = screen.getByTestId('profile-button');
    const userIcon = profileButton.querySelector('div');
    expect(userIcon).toHaveClass('w-6', 'h-6');
  });

  it('should have correct CSS classes for barchart icon', () => {
    renderHeader();
    
    const barchartIcon = screen.getByTestId('barchart2-icon');
    expect(barchartIcon).toHaveClass('w-5', 'h-5');
  });

  it('should handle multiple notification clicks', () => {
    renderHeader();
    
    const bellButton = screen.getByTestId('notification-button');
    
    // Multiple clicks
    fireEvent.click(bellButton!);
    fireEvent.click(bellButton!);
    fireEvent.click(bellButton!);
    
    // Should be visible after odd number of clicks
    expect(screen.getByTestId('notification-dropdown')).toBeInTheDocument();
  });

  it('should handle multiple profile clicks', () => {
    renderHeader();
    
    const profileButton = screen.getByTestId('profile-button');
    
    // Multiple clicks
    fireEvent.click(profileButton!);
    fireEvent.click(profileButton!);
    fireEvent.click(profileButton!);
    
    // Should be visible after odd number of clicks
    expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
  });

  it('should maintain button accessibility', () => {
    renderHeader();
    
    const buttons = screen.getAllByRole('button');
    
    buttons.forEach(button => {
      expect(button).toBeInTheDocument();
      expect(button).toBeVisible();
      expect(button).not.toBeDisabled();
    });
  });

  it('should have correct notification count in badge', () => {
    renderHeader();
    
    const badge = screen.getByText('3');
    expect(badge).toBeInTheDocument();
    expect(badge.textContent).toBe('3');
  });

  it('should handle rapid successive clicks on notification bell', () => {
    renderHeader();
    
    const bellButton = screen.getByTestId('notification-button');
    
    // Rapid successive clicks
    fireEvent.click(bellButton!);
    fireEvent.click(bellButton!);
    fireEvent.click(bellButton!);
    fireEvent.click(bellButton!);
    fireEvent.click(bellButton!);
    
    // Should be visible after odd number of clicks
    expect(screen.getByTestId('notification-dropdown')).toBeInTheDocument();
  });

  it('should handle rapid successive clicks on profile button', () => {
    renderHeader();
    
    const profileButton = screen.getByTestId('profile-button');
    
    // Rapid successive clicks
    fireEvent.click(profileButton!);
    fireEvent.click(profileButton!);
    fireEvent.click(profileButton!);
    fireEvent.click(profileButton!);
    fireEvent.click(profileButton!);
    
    // Should be visible after odd number of clicks
    expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
  });

  it('should handle logout function being called multiple times', () => {
    renderHeader();
    
    const profileButton = screen.getByTestId('profile-button');
    fireEvent.click(profileButton!);
    
    const logoutButton = screen.getByTestId('logout-button');
    
    // Click logout multiple times
    fireEvent.click(logoutButton);
    fireEvent.click(logoutButton);
    fireEvent.click(logoutButton);
    
    expect(mockHandleLogout).toHaveBeenCalledTimes(3);
  });

  it('should have correct semantic HTML structure', () => {
    renderHeader();
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Dashboard');
  });

  it('should have correct relative positioning for dropdowns', () => {
    renderHeader();
    
    const notificationContainer = screen.getByTestId('notification-button').closest('div');
    const profileContainer = screen.getByTestId('profile-button').closest('div');
    
    expect(notificationContainer).toHaveClass('relative');
    expect(profileContainer).toHaveClass('relative');
  });

  it('should handle state changes correctly for notifications', () => {
    renderHeader();
    
    const bellButton = screen.getByTestId('notification-button');
    
    // Initial state - notifications hidden
    expect(screen.queryByTestId('notification-dropdown')).not.toBeInTheDocument();
    
    // Click to show
    fireEvent.click(bellButton!);
    expect(screen.getByTestId('notification-dropdown')).toBeInTheDocument();
    
    // Click to hide
    fireEvent.click(bellButton!);
    expect(screen.queryByTestId('notification-dropdown')).not.toBeInTheDocument();
  });

  it('should handle state changes correctly for profile', () => {
    renderHeader();
    
    const profileButton = screen.getByTestId('profile-button');
    
    // Initial state - profile hidden
    expect(screen.queryByTestId('profile-dropdown')).not.toBeInTheDocument();
    
    // Click to show
    fireEvent.click(profileButton!);
    expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
    
    // Click to hide
    fireEvent.click(profileButton!);
    expect(screen.queryByTestId('profile-dropdown')).not.toBeInTheDocument();
  });

  it('should have correct z-index for sticky positioning', () => {
    renderHeader();
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('z-10');
  });

  it('should have correct backdrop blur effect', () => {
    renderHeader();
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('backdrop-blur');
  });

  it('should have correct background opacity', () => {
    renderHeader();
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white/90');
  });

  it('should have correct sticky positioning', () => {
    renderHeader();
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky', 'top-0');
  });

  it('should have correct shadow styling', () => {
    renderHeader();
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('shadow-sm');
  });

  it('should have correct border styling', () => {
    renderHeader();
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('border-b', 'border-slate-200');
  });

  it('should have correct padding', () => {
    renderHeader();
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('px-10', 'py-3');
  });

  it('should have correct flex layout', () => {
    renderHeader();
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('flex', 'items-center', 'justify-between');
  });

  it('should have correct width', () => {
    renderHeader();
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('w-full');
  });
}); 