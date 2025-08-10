import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SettingsSelector from '../Settingselector';

// Mock the lucide-react icons
vi.mock('lucide-react', () => ({
  Briefcase: vi.fn(() => <div data-testid="briefcase-icon">Briefcase</div>),
  BarChart2: vi.fn(() => <div data-testid="barchart2-icon">BarChart2</div>),
  CalendarCheck2: vi.fn(() => <div data-testid="calendarcheck2-icon">CalendarCheck2</div>),
  Landmark: vi.fn(() => <div data-testid="landmark-icon">Landmark</div>),
  Building2: vi.fn(() => <div data-testid="building2-icon">Building2</div>),
  MapPin: vi.fn(() => <div data-testid="mappin-icon">MapPin</div>),
}));

describe('SettingsSelector', () => {
  let mockOnClick: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnClick = vi.fn();
  });

  it('should render correctly and match snapshot', () => {
    const { container } = render(<SettingsSelector onClick={mockOnClick} />);
    expect(container).toMatchSnapshot();
  });

  it('should render all setting options', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    expect(screen.getByText('Bank')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('State')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Shift')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
  });

  it('should render all icons', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    expect(screen.getByTestId('landmark-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('building2-icon')).toHaveLength(2); // Used for City and Department
    expect(screen.getByTestId('mappin-icon')).toBeInTheDocument();
    expect(screen.getByTestId('briefcase-icon')).toBeInTheDocument();
    expect(screen.getByTestId('barchart2-icon')).toBeInTheDocument();
    expect(screen.getByTestId('calendarcheck2-icon')).toBeInTheDocument();
  });

  it('should call onClick with "bank" when Bank button is clicked', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    const bankButton = screen.getByText('Bank');
    fireEvent.click(bankButton);
    
    expect(mockOnClick).toHaveBeenCalledWith('bank');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick with "city" when City button is clicked', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    const cityButton = screen.getByText('City');
    fireEvent.click(cityButton);
    
    expect(mockOnClick).toHaveBeenCalledWith('city');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick with "state" when State button is clicked', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    const stateButton = screen.getByText('State');
    fireEvent.click(stateButton);
    
    expect(mockOnClick).toHaveBeenCalledWith('state');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick with "company" when Company button is clicked', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    const companyButton = screen.getByText('Company');
    fireEvent.click(companyButton);
    
    expect(mockOnClick).toHaveBeenCalledWith('company');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick with "skills" when Skills button is clicked', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    const skillsButton = screen.getByText('Skills');
    fireEvent.click(skillsButton);
    
    expect(mockOnClick).toHaveBeenCalledWith('skills');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick with "shift" when Shift button is clicked', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    const shiftButton = screen.getByText('Shift');
    fireEvent.click(shiftButton);
    
    expect(mockOnClick).toHaveBeenCalledWith('shift');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick with "department" when Department button is clicked', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    const departmentButton = screen.getByText('Department');
    fireEvent.click(departmentButton);
    
    expect(mockOnClick).toHaveBeenCalledWith('department');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple button clicks correctly', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    const bankButton = screen.getByText('Bank');
    const cityButton = screen.getByText('City');
    const stateButton = screen.getByText('State');
    
    fireEvent.click(bankButton);
    fireEvent.click(cityButton);
    fireEvent.click(stateButton);
    
    expect(mockOnClick).toHaveBeenCalledTimes(3);
    expect(mockOnClick).toHaveBeenNthCalledWith(1, 'bank');
    expect(mockOnClick).toHaveBeenNthCalledWith(2, 'city');
    expect(mockOnClick).toHaveBeenNthCalledWith(3, 'state');
  });

  it('should have correct CSS classes for styling', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    const container = screen.getByRole('list');
    expect(container).toHaveClass('ml-8', 'mt-1', 'flex', 'flex-col', 'gap-1', 'border-l', 'border-blue-100', 'pl-4');
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveClass(
        'flex', 'items-center', 'gap-2', 'px-2', 'py-1', 
        'text-slate-600', 'hover:text-blue-700', 'hover:bg-blue-50', 
        'rounded', 'transition', 'w-full', 'text-sm'
      );
    });
  });

  it('should have correct button order', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    const buttons = screen.getAllByRole('button');
    const buttonTexts = buttons.map(button => button.textContent);
    
    expect(buttonTexts).toEqual([
      'Landmark Bank',
      'Building2 City', 
      'MapPin State',
      'Briefcase Company',
      'BarChart2 Skills',
      'CalendarCheck2 Shift',
      'Building2 Department'
    ]);
  });

  it('should have correct icon and text pairing', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    const bankButton = screen.getByText('Bank').closest('button');
    const cityButton = screen.getByText('City').closest('button');
    const stateButton = screen.getByText('State').closest('button');
    const companyButton = screen.getByText('Company').closest('button');
    const skillsButton = screen.getByText('Skills').closest('button');
    const shiftButton = screen.getByText('Shift').closest('button');
    const departmentButton = screen.getByText('Department').closest('button');
    
    expect(bankButton).toContainElement(screen.getByTestId('landmark-icon'));
    expect(cityButton).toContainElement(screen.getAllByTestId('building2-icon')[0]);
    expect(stateButton).toContainElement(screen.getByTestId('mappin-icon'));
    expect(companyButton).toContainElement(screen.getByTestId('briefcase-icon'));
    expect(skillsButton).toContainElement(screen.getByTestId('barchart2-icon'));
    expect(shiftButton).toContainElement(screen.getByTestId('calendarcheck2-icon'));
    expect(departmentButton).toContainElement(screen.getAllByTestId('building2-icon')[1]);
  });

  it('should handle rapid successive clicks', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    const bankButton = screen.getByText('Bank');
    
    // Rapid successive clicks
    fireEvent.click(bankButton);
    fireEvent.click(bankButton);
    fireEvent.click(bankButton);
    
    expect(mockOnClick).toHaveBeenCalledTimes(3);
    expect(mockOnClick).toHaveBeenCalledWith('bank');
  });

  it('should handle clicks on different buttons in sequence', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    const buttons = screen.getAllByRole('button');
    const expectedCalls = ['bank', 'city', 'state', 'company', 'skills', 'shift', 'department'];
    
    buttons.forEach((button, index) => {
      fireEvent.click(button);
      expect(mockOnClick).toHaveBeenCalledWith(expectedCalls[index]);
    });
    
    expect(mockOnClick).toHaveBeenCalledTimes(7);
  });

  it('should maintain button accessibility', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    const buttons = screen.getAllByRole('button');
    
    buttons.forEach(button => {
      expect(button).toBeInTheDocument();
      expect(button).toBeVisible();
      expect(button).not.toBeDisabled();
    });
  });

  it('should have correct list structure', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    const list = screen.getByRole('list');
    const listItems = list.querySelectorAll('li');
    
    expect(listItems).toHaveLength(7);
    
    listItems.forEach(item => {
      expect(item).toContainElement(item.querySelector('button'));
    });
  });

  it('should handle onClick function being called multiple times', () => {
    render(<SettingsSelector onClick={mockOnClick} />);
    
    const bankButton = screen.getByText('Bank');
    const cityButton = screen.getByText('City');
    
    // Click bank multiple times
    fireEvent.click(bankButton);
    fireEvent.click(bankButton);
    fireEvent.click(bankButton);
    
    // Click city
    fireEvent.click(cityButton);
    
    expect(mockOnClick).toHaveBeenCalledTimes(4);
    expect(mockOnClick).toHaveBeenNthCalledWith(1, 'bank');
    expect(mockOnClick).toHaveBeenNthCalledWith(2, 'bank');
    expect(mockOnClick).toHaveBeenNthCalledWith(3, 'bank');
    expect(mockOnClick).toHaveBeenNthCalledWith(4, 'city');
  });
}); 