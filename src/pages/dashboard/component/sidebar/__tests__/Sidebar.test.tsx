import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Sidebar from '../Sidebar';

// Mock the lucide-react icons
vi.mock('lucide-react', () => ({
  User: vi.fn(() => <div data-testid="user-icon">User</div>),
  Briefcase: vi.fn(() => <div data-testid="briefcase-icon">Briefcase</div>),
  BarChart2: vi.fn(() => <div data-testid="barchart2-icon">BarChart2</div>),
  LogOut: vi.fn(() => <div data-testid="logout-icon">LogOut</div>),
  PlusCircle: vi.fn(() => <div data-testid="pluscircle-icon">PlusCircle</div>),
  CalendarCheck2: vi.fn(() => <div data-testid="calendarcheck2-icon">CalendarCheck2</div>),
  ChevronDown: vi.fn(({ className }) => <div data-testid="chevrondown-icon" className={className}>ChevronDown</div>),
  Settings: vi.fn(() => <div data-testid="settings-icon">Settings</div>),
  Landmark: vi.fn(() => <div data-testid="landmark-icon">Landmark</div>),
  Building2: vi.fn(() => <div data-testid="building2-icon">Building2</div>),
  MapPin: vi.fn(() => <div data-testid="mappin-icon">MapPin</div>),
}));

// Mock the SettingsSelector component
vi.mock('../../component', () => ({
  SettingsSelector: vi.fn(({ onClick }) => (
    <div data-testid="settings-selector">
      <button onClick={() => onClick('bank')} data-testid="bank-settings">Bank</button>
      <button onClick={() => onClick('city')} data-testid="city-settings">City</button>
      <button onClick={() => onClick('state')} data-testid="state-settings">State</button>
      <button onClick={() => onClick('company')} data-testid="company-settings">Company</button>
      <button onClick={() => onClick('skills')} data-testid="skills-settings">Skills</button>
      <button onClick={() => onClick('shift')} data-testid="shift-settings">Shift</button>
      <button onClick={() => onClick('department')} data-testid="department-settings">Department</button>
    </div>
  )),
}));

describe('Sidebar', () => {
  let mockSetSelectedSection: ReturnType<typeof vi.fn>;
  let mockHandleSettingsClick: ReturnType<typeof vi.fn>;
  let mockHandleLogout: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSetSelectedSection = vi.fn();
    mockHandleSettingsClick = vi.fn();
    mockHandleLogout = vi.fn();
  });

  const renderSidebar = (selectedSection: "dashboard" | "jobs" | "settings" = "dashboard") => {
    return render(
      <Sidebar
        selectedSection={selectedSection}
        setSelectedSection={mockSetSelectedSection}
        handleSettingsClick={mockHandleSettingsClick}
        handleLogout={mockHandleLogout}
      />
    );
  };

  it('should render correctly and match snapshot', () => {
    const { container } = renderSidebar();
    expect(container).toMatchSnapshot();
  });

  it('should render all main navigation sections', () => {
    renderSidebar();
    
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Management')).toBeInTheDocument();
    // Settings section header is rendered
    const settingsHeaders = screen.getAllByText('Settings').filter(el => 
      el.tagName === 'DIV' && el.className.includes('text-xs')
    );
    expect(settingsHeaders).toHaveLength(1);
  });

  it('should render all navigation buttons', () => {
    renderSidebar();
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Jobs')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Settings/ })).toBeInTheDocument();
    expect(screen.getByText('Add Job')).toBeInTheDocument();
    expect(screen.getByText('Schedule Interview')).toBeInTheDocument();
  });

  it('should render all icons', () => {
    renderSidebar();
    
    expect(screen.getByTestId('barchart2-icon')).toBeInTheDocument();
    expect(screen.getByTestId('briefcase-icon')).toBeInTheDocument();
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    expect(screen.getByTestId('chevrondown-icon')).toBeInTheDocument();
    expect(screen.getByTestId('pluscircle-icon')).toBeInTheDocument();
    expect(screen.getByTestId('calendarcheck2-icon')).toBeInTheDocument();
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
  });

  it('should render user profile section', () => {
    renderSidebar();
    
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should call setSelectedSection with "dashboard" when Dashboard button is clicked', () => {
    renderSidebar();
    
    const dashboardButton = screen.getByText('Dashboard');
    fireEvent.click(dashboardButton);
    
    expect(mockSetSelectedSection).toHaveBeenCalledWith('dashboard');
    expect(mockSetSelectedSection).toHaveBeenCalledTimes(1);
  });

  it('should call setSelectedSection with "jobs" when Jobs button is clicked', () => {
    renderSidebar();
    
    const jobsButton = screen.getByText('Jobs');
    fireEvent.click(jobsButton);
    
    expect(mockSetSelectedSection).toHaveBeenCalledWith('jobs');
    expect(mockSetSelectedSection).toHaveBeenCalledTimes(1);
  });

  it('should call setSelectedSection with "settings" when Settings button is clicked', () => {
    renderSidebar();
    
    const settingsButton = screen.getByRole('button', { name: /Settings/ });
    fireEvent.click(settingsButton);
    
    expect(mockSetSelectedSection).toHaveBeenCalledWith('settings');
    expect(mockSetSelectedSection).toHaveBeenCalledTimes(1);
  });

  it('should call handleLogout when Logout button is clicked', () => {
    renderSidebar();
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
  });

  it('should show SettingsSelector when settings section is selected', () => {
    renderSidebar('settings');
    
    // Check that the settings sublist is rendered
    expect(screen.getByText('Bank')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('State')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Shift')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
  });

  it('should not show SettingsSelector when settings section is not selected', () => {
    renderSidebar('dashboard');
    
    expect(screen.queryByTestId('settings-selector')).not.toBeInTheDocument();
  });

  it('should handle settings click through SettingsSelector', () => {
    renderSidebar('settings');
    
    const bankButton = screen.getByText('Bank');
    fireEvent.click(bankButton);
    
    expect(mockHandleSettingsClick).toHaveBeenCalledWith('bank');
    expect(mockHandleSettingsClick).toHaveBeenCalledTimes(1);
  });

  it('should apply correct active styles to Dashboard when selected', () => {
    renderSidebar('dashboard');
    
    const dashboardButton = screen.getByText('Dashboard').closest('button');
    expect(dashboardButton).toHaveClass('bg-blue-100', 'text-blue-700', 'shadow');
  });

  it('should apply correct active styles to Jobs when selected', () => {
    renderSidebar('jobs');
    
    const jobsButton = screen.getByText('Jobs').closest('button');
    expect(jobsButton).toHaveClass('bg-blue-100', 'text-blue-700', 'shadow');
  });

  it('should apply correct active styles to Settings when selected', () => {
    renderSidebar('settings');
    
    const settingsButton = screen.getByRole('button', { name: /Settings/ });
    // The Settings button doesn't get active styles, it just shows the sublist
    expect(settingsButton).toHaveClass('text-slate-700', 'hover:bg-blue-50', 'hover:text-blue-700');
  });

  it('should apply correct inactive styles to buttons when not selected', () => {
    renderSidebar('dashboard');
    
    const jobsButton = screen.getByText('Jobs').closest('button');
    expect(jobsButton).toHaveClass('text-slate-700', 'hover:bg-blue-50', 'hover:text-blue-700');
  });

  it('should rotate ChevronDown icon when settings is selected', () => {
    renderSidebar('settings');
    
    const chevronIcon = screen.getByTestId('chevrondown-icon');
    // The ChevronDown icon should have the rotate-180 class when settings is selected
    expect(chevronIcon).toHaveClass('rotate-180');
  });

  it('should not rotate ChevronDown icon when settings is not selected', () => {
    renderSidebar('dashboard');
    
    const chevronIcon = screen.getByTestId('chevrondown-icon');
    expect(chevronIcon).not.toHaveClass('rotate-180');
  });

  it('should have correct aria attributes for settings button', () => {
    renderSidebar('settings');
    
    const settingsButton = screen.getByRole('button', { name: /Settings/ });
    expect(settingsButton).toHaveAttribute('aria-expanded', 'true');
    expect(settingsButton).toHaveAttribute('aria-controls', 'sidebar-settings-sublist');
  });

  it('should have correct aria attributes when settings is not selected', () => {
    renderSidebar('dashboard');
    
    const settingsButton = screen.getByRole('button', { name: /Settings/ });
    expect(settingsButton).toHaveAttribute('aria-expanded', 'false');
    expect(settingsButton).toHaveAttribute('aria-controls', 'sidebar-settings-sublist');
  });

  it('should have correct CSS classes for sidebar container', () => {
    renderSidebar();
    
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass(
      'w-64', 'bg-gradient-to-b', 'from-blue-50', 'via-white', 'to-white',
      'border-r', 'border-slate-200', 'flex', 'flex-col', 'min-h-screen', 'shadow-lg'
    );
  });

  it('should have correct CSS classes for navigation buttons', () => {
    renderSidebar();
    
    const navigationButtons = screen.getAllByRole('button').filter(button => 
      !button.textContent?.includes('Logout')
    );
    
    navigationButtons.forEach(button => {
      expect(button).toHaveClass(
        'flex', 'items-center', 'gap-3', 'rounded-lg', 'px-3', 'py-2',
        'font-medium', 'text-base', 'transition', 'w-full'
      );
    });
  });

  it('should have correct CSS classes for logout button', () => {
    renderSidebar();
    
    const logoutButton = screen.getByText('Logout').closest('button');
    expect(logoutButton).toHaveClass(
      'flex', 'items-center', 'gap-2', 'w-full', 'bg-red-50', 'hover:bg-red-100',
      'text-red-600', 'rounded-md', 'px-4', 'py-2', 'font-semibold', 'transition', 'mt-2'
    );
  });

  it('should handle multiple button clicks correctly', () => {
    renderSidebar();
    
    const dashboardButton = screen.getByText('Dashboard');
    const jobsButton = screen.getByText('Jobs');
    const settingsButton = screen.getByRole('button', { name: /Settings/ });
    
    fireEvent.click(dashboardButton);
    fireEvent.click(jobsButton);
    fireEvent.click(settingsButton);
    
    expect(mockSetSelectedSection).toHaveBeenCalledTimes(3);
    expect(mockSetSelectedSection).toHaveBeenNthCalledWith(1, 'dashboard');
    expect(mockSetSelectedSection).toHaveBeenNthCalledWith(2, 'jobs');
    expect(mockSetSelectedSection).toHaveBeenNthCalledWith(3, 'settings');
  });

  it('should handle rapid successive clicks', () => {
    renderSidebar();
    
    const dashboardButton = screen.getByText('Dashboard');
    
    // Rapid successive clicks
    fireEvent.click(dashboardButton);
    fireEvent.click(dashboardButton);
    fireEvent.click(dashboardButton);
    
    expect(mockSetSelectedSection).toHaveBeenCalledTimes(3);
    expect(mockSetSelectedSection).toHaveBeenCalledWith('dashboard');
  });

  it('should maintain button accessibility', () => {
    renderSidebar();
    
    const buttons = screen.getAllByRole('button');
    
    buttons.forEach(button => {
      expect(button).toBeInTheDocument();
      expect(button).toBeVisible();
      expect(button).not.toBeDisabled();
    });
  });

  it('should have correct list structure', () => {
    renderSidebar();
    
    const lists = screen.getAllByRole('list');
    expect(lists).toHaveLength(3); // Main, Settings, Management
    
    lists.forEach(list => {
      const listItems = list.querySelectorAll('li');
      expect(listItems.length).toBeGreaterThan(0);
      
      listItems.forEach(item => {
        expect(item).toContainElement(item.querySelector('button'));
      });
    });
  });

  it('should have correct section headers', () => {
    renderSidebar();
    
    const headers = screen.getAllByText(/Main|Settings|Management/).filter(header => 
      header.tagName === 'DIV' && header.className.includes('text-xs')
    );
    expect(headers).toHaveLength(3);
    
    headers.forEach(header => {
      expect(header).toHaveClass('text-xs', 'font-semibold', 'text-slate-400', 'uppercase', 'tracking-wider');
    });
  });

  it('should have correct user profile structure', () => {
    renderSidebar();
    
    const userAvatar = screen.getByTestId('user-icon');
    expect(userAvatar).toBeInTheDocument();
    
    const userRole = screen.getByText('Admin');
    expect(userRole).toHaveClass('text-xs', 'text-slate-500');
  });

  it('should handle settings selector interactions correctly', () => {
    renderSidebar('settings');
    
    const settingsButtons = [
      'Bank',
      'City', 
      'State',
      'Company',
      'Skills',
      'Shift',
      'Department'
    ];
    
    const expectedCalls = ['bank', 'city', 'state', 'company', 'skills', 'shift', 'department'];
    
    settingsButtons.forEach((buttonText, index) => {
      const button = screen.getByText(buttonText);
      fireEvent.click(button);
      expect(mockHandleSettingsClick).toHaveBeenCalledWith(expectedCalls[index]);
    });
    
    expect(mockHandleSettingsClick).toHaveBeenCalledTimes(7);
  });

  it('should handle logout function being called multiple times', () => {
    renderSidebar();
    
    const logoutButton = screen.getByText('Logout');
    
    // Click logout multiple times
    fireEvent.click(logoutButton);
    fireEvent.click(logoutButton);
    fireEvent.click(logoutButton);
    
    expect(mockHandleLogout).toHaveBeenCalledTimes(3);
  });

  it('should have correct hover states for inactive buttons', () => {
    renderSidebar('dashboard');
    
    const jobsButton = screen.getByText('Jobs').closest('button');
    const settingsButton = screen.getByRole('button', { name: /Settings/ });
    const addJobButton = screen.getByText('Add Job').closest('button');
    const scheduleButton = screen.getByText('Schedule Interview').closest('button');
    
    [jobsButton, settingsButton, addJobButton, scheduleButton].forEach(button => {
      expect(button).toHaveClass('hover:bg-blue-50', 'hover:text-blue-700');
    });
  });

  it('should have correct border separators', () => {
    renderSidebar();
    
    const separators = document.querySelectorAll('.border-t.border-slate-100');
    expect(separators).toHaveLength(2); // Two separators in the sidebar
  });
}); 