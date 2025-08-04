import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Notificationscreen from '../Notification';

// Mock data for testing
const mockNotifications = [
  { id: 1, message: 'New job posted', time: '2 min ago' },
  { id: 2, message: 'Application submitted', time: '5 min ago' },
  { id: 3, message: 'Interview scheduled', time: '1 hour ago' },
];

const mockEmptyNotifications: { id: number; message: string; time: string }[] = [];

const mockSingleNotification = [
  { id: 1, message: 'Single notification', time: '1 min ago' },
];

const mockLongMessageNotification = [
  { id: 1, message: 'This is a very long notification message that should wrap properly and display correctly in the notification component', time: '1 min ago' },
];

const mockSpecialCharactersNotification = [
  { id: 1, message: 'Notification with special chars: @#$%^&*()', time: '1 min ago' },
];

const mockUnicodeNotification = [
  { id: 1, message: 'Notification with unicode: José María Ñoño', time: '1 min ago' },
];

describe('Notification', () => {
  const renderNotification = (data: { id: number; message: string; time: string }[]) => {
    return render(<Notificationscreen data={data} />);
  };

  describe('Basic Rendering', () => {
    it('renders notification component with header', () => {
      renderNotification(mockNotifications);
      
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });

    it('renders all notification items', () => {
      renderNotification(mockNotifications);
      
      expect(screen.getByText('New job posted')).toBeInTheDocument();
      expect(screen.getByText('Application submitted')).toBeInTheDocument();
      expect(screen.getByText('Interview scheduled')).toBeInTheDocument();
    });

    it('renders notification times', () => {
      renderNotification(mockNotifications);
      
      expect(screen.getByText('2 min ago')).toBeInTheDocument();
      expect(screen.getByText('5 min ago')).toBeInTheDocument();
      expect(screen.getByText('1 hour ago')).toBeInTheDocument();
    });

    it('renders empty notification list', () => {
      renderNotification(mockEmptyNotifications);
      
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('renders single notification', () => {
      renderNotification(mockSingleNotification);
      
      expect(screen.getByText('Single notification')).toBeInTheDocument();
      expect(screen.getByText('1 min ago')).toBeInTheDocument();
    });

    it('matches notification component snapshot', () => {
      const { container } = renderNotification(mockNotifications);
      expect(container).toMatchSnapshot();
    });

    it('matches empty notification snapshot', () => {
      const { container } = renderNotification(mockEmptyNotifications);
      expect(container).toMatchSnapshot();
    });

    it('matches single notification snapshot', () => {
      const { container } = renderNotification(mockSingleNotification);
      expect(container).toMatchSnapshot();
    });

    it('matches long message notification snapshot', () => {
      const { container } = renderNotification(mockLongMessageNotification);
      expect(container).toMatchSnapshot();
    });

    it('matches special characters notification snapshot', () => {
      const { container } = renderNotification(mockSpecialCharactersNotification);
      expect(container).toMatchSnapshot();
    });

    it('matches unicode notification snapshot', () => {
      const { container } = renderNotification(mockUnicodeNotification);
      expect(container).toMatchSnapshot();
    });
  });

  describe('Props and Data Handling', () => {
    it('handles long message notifications', () => {
      renderNotification(mockLongMessageNotification);
      
      expect(screen.getByText(/This is a very long notification message/)).toBeInTheDocument();
    });

    it('handles notifications with special characters', () => {
      renderNotification(mockSpecialCharactersNotification);
      
      expect(screen.getByText(/Notification with special chars: @#\$%\^&\*\(\)/)).toBeInTheDocument();
    });

    it('handles notifications with unicode characters', () => {
      renderNotification(mockUnicodeNotification);
      
      expect(screen.getByText(/José María Ñoño/)).toBeInTheDocument();
    });

    it('renders notifications in correct order', () => {
      renderNotification(mockNotifications);
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
      
      // Check first notification
      expect(listItems[0]).toHaveTextContent('New job posted');
      expect(listItems[0]).toHaveTextContent('2 min ago');
      
      // Check second notification
      expect(listItems[1]).toHaveTextContent('Application submitted');
      expect(listItems[1]).toHaveTextContent('5 min ago');
      
      // Check third notification
      expect(listItems[2]).toHaveTextContent('Interview scheduled');
      expect(listItems[2]).toHaveTextContent('1 hour ago');
    });
  });

  describe('CSS Classes and Styling', () => {
    it('has correct container CSS classes', () => {
      const { container } = renderNotification(mockNotifications);
      
      const notificationContainer = container.firstChild as HTMLElement;
      expect(notificationContainer).toHaveClass(
        'absolute',
        'right-0',
        'mt-2',
        'w-72',
        'bg-white',
        'border',
        'border-slate-200',
        'rounded-lg',
        'shadow-lg',
        'z-20'
      );
    });

    it('has correct header CSS classes', () => {
      renderNotification(mockNotifications);
      
      const header = screen.getByText('Notifications');
      expect(header).toHaveClass(
        'p-4',
        'border-b',
        'border-slate-100',
        'font-semibold',
        'text-slate-700'
      );
    });

    it('has correct list CSS classes', () => {
      renderNotification(mockNotifications);
      
      const list = screen.getByRole('list');
      expect(list).toHaveClass('max-h-60', 'overflow-y-auto');
    });

    it('has correct list item CSS classes', () => {
      renderNotification(mockNotifications);
      
      const listItems = screen.getAllByRole('listitem');
      listItems.forEach(item => {
        expect(item).toHaveClass(
          'px-4',
          'py-2',
          'hover:bg-slate-50',
          'text-slate-700',
          'flex',
          'justify-between'
        );
      });
    });

    it('has correct time span CSS classes', () => {
      renderNotification(mockNotifications);
      
      const timeSpans = screen.getAllByText(/min ago|hour ago/);
      timeSpans.forEach(span => {
        expect(span).toHaveClass('text-xs', 'text-slate-400', 'ml-2');
      });
    });
  });

  describe('Accessibility', () => {
    it('has correct semantic structure', () => {
      renderNotification(mockNotifications);
      
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('has proper heading structure', () => {
      renderNotification(mockNotifications);
      
      const header = screen.getByText('Notifications');
      expect(header).toBeInTheDocument();
    });

    it('has proper text contrast for accessibility', () => {
      renderNotification(mockNotifications);
      
      const header = screen.getByText('Notifications');
      expect(header).toHaveClass('text-slate-700');
      
      const listItems = screen.getAllByRole('listitem');
      listItems.forEach(item => {
        expect(item).toHaveClass('text-slate-700');
      });
    });

    it('has proper hover states for interactive elements', () => {
      renderNotification(mockNotifications);
      
      const listItems = screen.getAllByRole('listitem');
      listItems.forEach(item => {
        expect(item).toHaveClass('hover:bg-slate-50');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty data array', () => {
      renderNotification(mockEmptyNotifications);
      
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });

    it('handles single notification', () => {
      renderNotification(mockSingleNotification);
      
      expect(screen.getByText('Single notification')).toBeInTheDocument();
      expect(screen.getByText('1 min ago')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
    });

    it('handles notifications with empty messages', () => {
      const notificationsWithEmptyMessage = [
        { id: 1, message: '', time: '1 min ago' },
        { id: 2, message: 'Valid message', time: '2 min ago' },
      ];
      
      renderNotification(notificationsWithEmptyMessage);
      
      expect(screen.getByText('Valid message')).toBeInTheDocument();
      expect(screen.getByText('2 min ago')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });

    it('handles notifications with empty times', () => {
      const notificationsWithEmptyTime = [
        { id: 1, message: 'Test message', time: '' },
        { id: 2, message: 'Another message', time: '1 min ago' },
      ];
      
      renderNotification(notificationsWithEmptyTime);
      
      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.getByText('Another message')).toBeInTheDocument();
      expect(screen.getByText('1 min ago')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });

    it('handles very long time strings', () => {
      const notificationsWithLongTime = [
        { id: 1, message: 'Test message', time: 'This is a very long time string that should display properly' },
      ];
      
      renderNotification(notificationsWithLongTime);
      
      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.getByText(/This is a very long time string/)).toBeInTheDocument();
    });

    it('handles notifications with numbers in messages', () => {
      const notificationsWithNumbers = [
        { id: 1, message: 'Job #12345 has been posted', time: '1 min ago' },
        { id: 2, message: 'You have 5 new applications', time: '2 min ago' },
      ];
      
      renderNotification(notificationsWithNumbers);
      
      expect(screen.getByText('Job #12345 has been posted')).toBeInTheDocument();
      expect(screen.getByText('You have 5 new applications')).toBeInTheDocument();
    });

    it('handles notifications with HTML-like content', () => {
      const notificationsWithHTML = [
        { id: 1, message: 'Message with <script>alert("test")</script> content', time: '1 min ago' },
        { id: 2, message: 'Message with <div>div</div> content', time: '2 min ago' },
      ];
      
      renderNotification(notificationsWithHTML);
      
      expect(screen.getByText(/Message with <script>alert\("test"\)<\/script> content/)).toBeInTheDocument();
      expect(screen.getByText(/Message with <div>div<\/div> content/)).toBeInTheDocument();
    });

    it('matches HTML-like content notification snapshot', () => {
      const notificationsWithHTML = [
        { id: 1, message: 'Message with <script>alert("test")</script> content', time: '1 min ago' },
        { id: 2, message: 'Message with <div>div</div> content', time: '2 min ago' },
      ];
      
      const { container } = renderNotification(notificationsWithHTML);
      expect(container).toMatchSnapshot();
    });

    it('matches notifications with numbers snapshot', () => {
      const notificationsWithNumbers = [
        { id: 1, message: 'Job #12345 has been posted', time: '1 min ago' },
        { id: 2, message: 'You have 5 new applications', time: '2 min ago' },
      ];
      
      const { container } = renderNotification(notificationsWithNumbers);
      expect(container).toMatchSnapshot();
    });

    it('matches notifications with empty messages snapshot', () => {
      const notificationsWithEmptyMessage = [
        { id: 1, message: '', time: '1 min ago' },
        { id: 2, message: 'Valid message', time: '2 min ago' },
      ];
      
      const { container } = renderNotification(notificationsWithEmptyMessage);
      expect(container).toMatchSnapshot();
    });

    it('matches notifications with empty times snapshot', () => {
      const notificationsWithEmptyTime = [
        { id: 1, message: 'Test message', time: '' },
        { id: 2, message: 'Another message', time: '1 min ago' },
      ];
      
      const { container } = renderNotification(notificationsWithEmptyTime);
      expect(container).toMatchSnapshot();
    });

    it('matches notifications with long time strings snapshot', () => {
      const notificationsWithLongTime = [
        { id: 1, message: 'Test message', time: 'This is a very long time string that should display properly' },
      ];
      
      const { container } = renderNotification(notificationsWithLongTime);
      expect(container).toMatchSnapshot();
    });
  });

  describe('Component Structure', () => {
    it('renders with correct DOM structure', () => {
      const { container } = renderNotification(mockNotifications);
      
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv.tagName).toBe('DIV');
      
      const headerDiv = mainDiv.firstChild as HTMLElement;
      expect(headerDiv.tagName).toBe('DIV');
      expect(headerDiv).toHaveTextContent('Notifications');
      
      const list = mainDiv.lastChild as HTMLElement;
      expect(list.tagName).toBe('UL');
    });

    it('renders list items with correct structure', () => {
      renderNotification(mockNotifications);
      
      const listItems = screen.getAllByRole('listitem');
      listItems.forEach(item => {
        const spans = item.querySelectorAll('span');
        expect(spans).toHaveLength(2);
        
        // First span should contain the message
        expect(spans[0]).toHaveTextContent(/New job posted|Application submitted|Interview scheduled/);
        
        // Second span should contain the time
        expect(spans[1]).toHaveTextContent(/min ago|hour ago/);
      });
    });

    it('has correct z-index for dropdown positioning', () => {
      const { container } = renderNotification(mockNotifications);
      
      const notificationContainer = container.firstChild as HTMLElement;
      expect(notificationContainer).toHaveClass('z-20');
    });

    it('has correct positioning classes for dropdown', () => {
      const { container } = renderNotification(mockNotifications);
      
      const notificationContainer = container.firstChild as HTMLElement;
      expect(notificationContainer).toHaveClass('absolute', 'right-0', 'mt-2');
    });
  });
}); 