import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DasboardSelector from '../dashboardselector';

// Mock recharts ResponsiveContainer to avoid rendering issues in tests
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal();
  return typeof actual === 'object' && actual !== null
    ? {
        ...actual,
        ResponsiveContainer: ({ children }: React.PropsWithChildren<unknown>) => <div data-testid="chart-container">{children}</div>,
      }
    : {
        ResponsiveContainer: ({ children }: React.PropsWithChildren<unknown>) => <div data-testid="chart-container">{children}</div>,
      };
});

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  PlusCircle: ({ className }: { className?: string }) => (
    <svg data-testid="plus-circle-icon" className={className} />
  ),
  CalendarCheck2: ({ className }: { className?: string }) => (
    <svg data-testid="calendar-check-icon" className={className} />
  ),
}));

describe('DasboardSelector', () => {
  it('should render correctly and match snapshot', () => {
    const { container } = render(<DasboardSelector />);
    expect(container).toMatchSnapshot();
  });

  describe('Quick Actions Section', () => {
    it('should render quick action buttons', () => {
      render(<DasboardSelector />);
      
      expect(screen.getByRole('button', { name: /Add Job/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Schedule Interview/i })).toBeInTheDocument();
    });

    it('should render icons in quick action buttons', () => {
      render(<DasboardSelector />);
      
      const addJobButton = screen.getByRole('button', { name: /Add Job/i });
      const scheduleButton = screen.getByRole('button', { name: /Schedule Interview/i });
      
      expect(addJobButton.querySelector('[data-testid="plus-circle-icon"]')).toBeInTheDocument();
      expect(scheduleButton.querySelector('[data-testid="calendar-check-icon"]')).toBeInTheDocument();
    });

    it('should have correct CSS classes for quick action buttons', () => {
      render(<DasboardSelector />);
      
      const addJobButton = screen.getByRole('button', { name: /Add Job/i });
      const scheduleButton = screen.getByRole('button', { name: /Schedule Interview/i });
      
      expect(addJobButton).toHaveClass('flex', 'items-center', 'gap-2', 'bg-blue-600', 'hover:bg-blue-700', 'text-white', 'px-5', 'py-2', 'rounded-lg', 'font-semibold', 'shadow', 'transition');
      expect(scheduleButton).toHaveClass('flex', 'items-center', 'gap-2', 'bg-green-600', 'hover:bg-green-700', 'text-white', 'px-5', 'py-2', 'rounded-lg', 'font-semibold', 'shadow', 'transition');
    });

    it('should handle button clicks', () => {
      render(<DasboardSelector />);
      
      const addJobButton = screen.getByRole('button', { name: /Add Job/i });
      const scheduleButton = screen.getByRole('button', { name: /Schedule Interview/i });
      
      fireEvent.click(addJobButton);
      fireEvent.click(scheduleButton);
      
      // Buttons should remain clickable (no errors thrown)
      expect(addJobButton).toBeInTheDocument();
      expect(scheduleButton).toBeInTheDocument();
    });
  });

  describe('Stat Cards Section', () => {
    it('should render all stat cards', () => {
      render(<DasboardSelector />);
      
      expect(screen.getByText('Total Jobs')).toBeInTheDocument();
      expect(screen.getByText('Interviews')).toBeInTheDocument();
      expect(screen.getByText('Offers')).toBeInTheDocument();
    });

    it('should display correct stat values', () => {
      render(<DasboardSelector />);
      
      expect(screen.getByText('74')).toBeInTheDocument(); // Total Jobs
      expect(screen.getByText('18')).toBeInTheDocument(); // Interviews
      expect(screen.getByText('5')).toBeInTheDocument();  // Offers
    });

    it('should have correct CSS classes for stat cards', () => {
      render(<DasboardSelector />);
      
      const statCards = screen.getAllByText(/Total Jobs|Interviews|Offers/);
      
      statCards.forEach(card => {
        const cardContainer = card.closest('div');
        expect(cardContainer).toHaveClass('bg-white', 'rounded-xl', 'shadow', 'p-6', 'flex', 'flex-col', 'gap-2', 'border', 'border-slate-100');
      });
    });

    it('should have correct text styling for stat values', () => {
      render(<DasboardSelector />);
      
      // Get stat cards and find the value elements within them
      const statCards = screen.getAllByText(/Total Jobs|Interviews|Offers/);
      
      statCards.forEach(card => {
        const cardContainer = card.closest('div');
        const valueElement = cardContainer?.querySelector('.text-2xl');
        expect(valueElement).toHaveClass('text-2xl', 'font-bold', 'text-blue-700');
      });
    });

    it('should have correct text styling for stat labels', () => {
      render(<DasboardSelector />);
      
      const statLabels = screen.getAllByText(/Total Jobs|Interviews|Offers/);
      
      statLabels.forEach(label => {
        expect(label).toHaveClass('text-slate-500', 'text-sm');
      });
    });
  });

  describe('Chart Section', () => {
    it('should render chart container', () => {
      render(<DasboardSelector />);
      
      expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    });

    it('should render chart title', () => {
      render(<DasboardSelector />);
      
      expect(screen.getByText('Job Applications Over Time')).toBeInTheDocument();
    });

    it('should have correct CSS classes for chart container', () => {
      render(<DasboardSelector />);
      
      const chartContainer = screen.getByText('Job Applications Over Time').closest('div');
      expect(chartContainer).toHaveClass('bg-white', 'p-8', 'rounded-xl', 'shadow-lg', 'border', 'border-slate-100', 'col-span-1', 'lg:col-span-2');
    });

    it('should have correct CSS classes for chart title', () => {
      render(<DasboardSelector />);
      
      const chartTitle = screen.getByText('Job Applications Over Time');
      expect(chartTitle).toHaveClass('text-xl', 'font-semibold', 'text-slate-800', 'mb-4');
    });
  });

  describe('Recent Activity Section', () => {
    it('should render activity section title', () => {
      render(<DasboardSelector />);
      
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });

    it('should render all activity items', () => {
      render(<DasboardSelector />);
      
      expect(screen.getByText('You added a new job: Frontend Developer')).toBeInTheDocument();
      expect(screen.getByText('Interview completed: Backend Engineer')).toBeInTheDocument();
      expect(screen.getByText('Offer accepted: Product Manager')).toBeInTheDocument();
    });

    it('should render activity timestamps', () => {
      render(<DasboardSelector />);
      
      expect(screen.getByText('Today, 09:00')).toBeInTheDocument();
      expect(screen.getByText('Yesterday, 15:30')).toBeInTheDocument();
      expect(screen.getByText('Yesterday, 11:10')).toBeInTheDocument();
    });

    it('should have correct CSS classes for activity container', () => {
      render(<DasboardSelector />);
      
      const activityContainer = screen.getByText('Recent Activity').closest('div');
      expect(activityContainer).toHaveClass('bg-white', 'p-6', 'rounded-xl', 'shadow-lg', 'border', 'border-slate-100', 'flex', 'flex-col', 'gap-4');
    });

    it('should have correct CSS classes for activity title', () => {
      render(<DasboardSelector />);
      
      const activityTitle = screen.getByText('Recent Activity');
      expect(activityTitle).toHaveClass('text-lg', 'font-semibold', 'text-slate-800', 'mb-2');
    });

    it('should have correct CSS classes for activity items', () => {
      render(<DasboardSelector />);
      
      const activityItems = screen.getAllByText(/You added|Interview completed|Offer accepted/);
      
      activityItems.forEach(item => {
        expect(item).toHaveClass('text-slate-700');
      });
    });

    it('should have correct CSS classes for activity timestamps', () => {
      render(<DasboardSelector />);
      
      const timestamps = screen.getAllByText(/Today, 09:00|Yesterday, 15:30|Yesterday, 11:10/);
      
      timestamps.forEach(timestamp => {
        expect(timestamp).toHaveClass('text-xs', 'text-slate-400');
      });
    });
  });

  describe('Tasks & Reminders Section', () => {
    it('should render tasks section title', () => {
      render(<DasboardSelector />);
      
      expect(screen.getByText('Tasks & Reminders')).toBeInTheDocument();
    });

    it('should render all task items', () => {
      render(<DasboardSelector />);
      
      expect(screen.getByText('Follow up with recruiter')).toBeInTheDocument();
      expect(screen.getByText('Prepare for interview')).toBeInTheDocument();
      expect(screen.getByText('Review candidate resumes')).toBeInTheDocument();
    });

    it('should render task due dates', () => {
      render(<DasboardSelector />);
      
      expect(screen.getByText('Due: Today')).toBeInTheDocument();
      expect(screen.getByText('Due: Tomorrow')).toBeInTheDocument();
      expect(screen.getByText('Due: This week')).toBeInTheDocument();
    });

    it('should have correct CSS classes for tasks container', () => {
      render(<DasboardSelector />);
      
      const tasksContainer = screen.getByText('Tasks & Reminders').closest('div');
      expect(tasksContainer).toHaveClass('bg-white', 'p-6', 'rounded-xl', 'shadow-lg', 'border', 'border-slate-100', 'flex', 'flex-col', 'gap-4');
    });

    it('should have correct CSS classes for tasks title', () => {
      render(<DasboardSelector />);
      
      const tasksTitle = screen.getByText('Tasks & Reminders');
      expect(tasksTitle).toHaveClass('text-lg', 'font-semibold', 'text-slate-800', 'mb-2');
    });

    it('should have correct CSS classes for task items', () => {
      render(<DasboardSelector />);
      
      const taskItems = screen.getAllByText(/Follow up with recruiter|Prepare for interview|Review candidate resumes/);
      
      taskItems.forEach(item => {
        expect(item).toHaveClass('text-slate-700');
      });
    });

    it('should have correct CSS classes for task due dates', () => {
      render(<DasboardSelector />);
      
      const dueDates = screen.getAllByText(/Due: Today|Due: Tomorrow|Due: This week/);
      
      dueDates.forEach(dueDate => {
        expect(dueDate).toHaveClass('text-xs', 'text-slate-400');
      });
    });
  });

  describe('Layout and Structure', () => {
    it('should have correct grid layout for stat cards', () => {
      render(<DasboardSelector />);
      
      const statCardsContainer = screen.getByText('Total Jobs').closest('div')?.parentElement;
      expect(statCardsContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-6', 'mb-8');
    });

    it('should have correct grid layout for chart and widgets', () => {
      render(<DasboardSelector />);
      
      const chartWidgetsContainer = screen.getByText('Job Applications Over Time').closest('div')?.parentElement;
      expect(chartWidgetsContainer).toHaveClass('grid', 'grid-cols-1', 'lg:grid-cols-3', 'gap-8');
    });

    it('should have correct grid layout for tasks section', () => {
      render(<DasboardSelector />);
      
      const tasksContainer = screen.getByText('Tasks & Reminders').closest('div')?.parentElement;
      expect(tasksContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-8', 'mt-8');
    });

    it('should have correct spacing between sections', () => {
      render(<DasboardSelector />);
      
      const quickActionsContainer = screen.getByRole('button', { name: /Add Job/i }).closest('div');
      expect(quickActionsContainer).toHaveClass('flex', 'flex-wrap', 'gap-4', 'mb-8');
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      render(<DasboardSelector />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    it('should have proper heading structure', () => {
      render(<DasboardSelector />);
      
      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(3);
      
      expect(screen.getByText('Job Applications Over Time')).toBeInTheDocument();
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      expect(screen.getByText('Tasks & Reminders')).toBeInTheDocument();
    });

    it('should have proper list structure', () => {
      render(<DasboardSelector />);
      
      const lists = screen.getAllByRole('list');
      expect(lists).toHaveLength(2); // Recent Activity and Tasks lists
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6); // 3 activities + 3 tasks
    });
  });

  describe('Data Display', () => {
    it('should display chart data correctly', () => {
      render(<DasboardSelector />);
      
      // Chart container should be rendered
      expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    });

    it('should display all activity data', () => {
      render(<DasboardSelector />);
      
      const activities = [
        'You added a new job: Frontend Developer',
        'Interview completed: Backend Engineer',
        'Offer accepted: Product Manager'
      ];
      
      activities.forEach(activity => {
        expect(screen.getByText(activity)).toBeInTheDocument();
      });
    });

    it('should display all task data', () => {
      render(<DasboardSelector />);
      
      const tasks = [
        'Follow up with recruiter',
        'Prepare for interview',
        'Review candidate resumes'
      ];
      
      tasks.forEach(task => {
        expect(screen.getByText(task)).toBeInTheDocument();
      });
    });

    it('should display all stat data', () => {
      render(<DasboardSelector />);
      
      const stats = [
        { label: 'Total Jobs', value: '74' },
        { label: 'Interviews', value: '18' },
        { label: 'Offers', value: '5' }
      ];
      
      stats.forEach(stat => {
        expect(screen.getByText(stat.label)).toBeInTheDocument();
        expect(screen.getByText(stat.value)).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid classes', () => {
      render(<DasboardSelector />);
      
      // Stat cards should be responsive
      const statCardsContainer = screen.getByText('Total Jobs').closest('div')?.parentElement;
      expect(statCardsContainer).toHaveClass('grid-cols-1', 'md:grid-cols-3');
      
      // Chart and widgets should be responsive
      const chartWidgetsContainer = screen.getByText('Job Applications Over Time').closest('div')?.parentElement;
      expect(chartWidgetsContainer).toHaveClass('grid-cols-1', 'lg:grid-cols-3');
      
      // Tasks should be responsive
      const tasksContainer = screen.getByText('Tasks & Reminders').closest('div')?.parentElement;
      expect(tasksContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });

    it('should have responsive chart container', () => {
      render(<DasboardSelector />);
      
      const chartContainer = screen.getByText('Job Applications Over Time').closest('div');
      expect(chartContainer).toHaveClass('col-span-1', 'lg:col-span-2');
    });
  });

  describe('Visual Styling', () => {
    it('should have consistent color scheme', () => {
      render(<DasboardSelector />);
      
      // Check for blue theme in buttons and stats
      const addJobButton = screen.getByRole('button', { name: /Add Job/i });
      expect(addJobButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700');
      
      // Get stat cards and find the value elements within them
      const statCards = screen.getAllByText(/Total Jobs|Interviews|Offers/);
      
      statCards.forEach(card => {
        const cardContainer = card.closest('div');
        const valueElement = cardContainer?.querySelector('.text-2xl');
        expect(valueElement).toHaveClass('text-blue-700');
      });
    });

    it('should have consistent shadow and border styling', () => {
      render(<DasboardSelector />);
      
      // All cards should have consistent styling
      const cards = [
        screen.getByText('Total Jobs').closest('div'),
        screen.getByText('Job Applications Over Time').closest('div'),
        screen.getByText('Recent Activity').closest('div'),
        screen.getByText('Tasks & Reminders').closest('div')
      ];
      
      cards.forEach(card => {
        expect(card).toHaveClass('bg-white', 'rounded-xl', 'border', 'border-slate-100');
        // Check for either 'shadow' or 'shadow-lg' as different cards use different shadow classes
        expect(card?.className).toMatch(/shadow/);
      });
    });

    it('should have proper text hierarchy', () => {
      render(<DasboardSelector />);
      
      // Main headings should be larger
      const mainHeading = screen.getByText('Job Applications Over Time');
      expect(mainHeading).toHaveClass('text-xl');
      
      // Secondary headings should be smaller
      const secondaryHeadings = screen.getAllByText(/Recent Activity|Tasks & Reminders/);
      secondaryHeadings.forEach(heading => {
        expect(heading).toHaveClass('text-lg');
      });
    });
  });
}); 