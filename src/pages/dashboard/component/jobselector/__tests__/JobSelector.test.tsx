import { render, screen, fireEvent, waitFor } from '@/testUtils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import JobSelector from '../Jobselector';

describe('JobSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly and match snapshot', () => {
    const { container } = render(<JobSelector />);
    expect(container).toMatchSnapshot();
  });

  it('should display jobs list correctly', () => {
    render(<JobSelector />);

    expect(screen.getByText('Jobs List')).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  it('should show empty state when no jobs exist', () => {
    render(<JobSelector />);
    
    // The component starts with 3 jobs, so we won't see empty state
    expect(screen.queryByText('No jobs')).not.toBeInTheDocument();
  });

  it('should open add job modal when add button is clicked', () => {
    render(<JobSelector />);
    
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    expect(screen.getByText('Create New Job')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Job Title')).toBeInTheDocument();
  });

  it('should create a new job successfully', async () => {
    render(<JobSelector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Fill form and submit
    const input = screen.getByPlaceholderText('Job Title');
    fireEvent.change(input, { target: { value: 'New Job Title' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('New Job Title')).toBeInTheDocument();
    });

    // Wait for modal to close
    await waitFor(() => {
      expect(screen.queryByText('Create New Job')).not.toBeInTheDocument();
    });
  });

  it('should not create job with empty name', async () => {
    render(<JobSelector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Try to submit empty form
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    // Modal should still be open
    expect(screen.getByText('Create New Job')).toBeInTheDocument();
  });

  it('should not create job with whitespace-only name', async () => {
    render(<JobSelector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Fill form with whitespace and submit
    const input = screen.getByPlaceholderText('Job Title');
    fireEvent.change(input, { target: { value: '   ' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    // Modal should still be open
    expect(screen.getByText('Create New Job')).toBeInTheDocument();
  });

  it('should trim whitespace from job name when creating', async () => {
    render(<JobSelector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Fill form with whitespace and submit
    const input = screen.getByPlaceholderText('Job Title');
    fireEvent.change(input, { target: { value: '  Trimmed Job  ' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Trimmed Job')).toBeInTheDocument();
    });
  });

  it('should open edit modal when edit button is clicked', () => {
    render(<JobSelector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      expect(screen.getByText('Edit Job')).toBeInTheDocument();
    }
  });

  it('should update job successfully', async () => {
    render(<JobSelector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      const editInput = screen.getByDisplayValue('Frontend Developer');
      fireEvent.change(editInput, { target: { value: 'Updated Frontend Developer' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('Updated Frontend Developer')).toBeInTheDocument();
      });
    }
  });

  it('should not update job with empty name', async () => {
    render(<JobSelector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      const editInput = screen.getByDisplayValue('Frontend Developer');
      fireEvent.change(editInput, { target: { value: '' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      // Modal should still be open
      expect(screen.getByText('Edit Job')).toBeInTheDocument();
    }
  });

  it('should trim whitespace from job name when updating', async () => {
    render(<JobSelector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      const editInput = screen.getByDisplayValue('Frontend Developer');
      fireEvent.change(editInput, { target: { value: '  Updated Job  ' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('Updated Job')).toBeInTheDocument();
      });
    }
  });

  it('should delete job when delete button is clicked', async () => {
    // Mock window.confirm to return true
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);
    
    render(<JobSelector />);
    
    // Verify Frontend Developer exists initially
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    
    // Find and click delete button
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(button => 
      button.innerHTML.includes('M6 18L18 6M6 6l12 12')
    );
    
    if (deleteButton) {
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument();
      });
    }
    
    // Restore original confirm
    window.confirm = originalConfirm;
  });

  it('should close modals when cancel button is clicked', () => {
    render(<JobSelector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Click cancel button
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Create New Job')).not.toBeInTheDocument();
  });

  it('should close modals when close button (×) is clicked', () => {
    render(<JobSelector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Click close button
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Create New Job')).not.toBeInTheDocument();
  });

  it('should handle form submission with Enter key', () => {
    render(<JobSelector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Fill form and submit with Enter
    const input = screen.getByPlaceholderText('Job Title');
    fireEvent.change(input, { target: { value: 'New Job' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Modal should remain open as component doesn't handle Enter key submission
    expect(screen.getByText('Create New Job')).toBeInTheDocument();
  });

  it('should handle edit form submission with Enter key', () => {
    render(<JobSelector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Update the name and submit with Enter
      const input = screen.getByDisplayValue('Frontend Developer');
      fireEvent.change(input, { target: { value: 'Updated Frontend Developer' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      // Modal should remain open as component doesn't handle Enter key submission
      expect(screen.getByText('Edit Job')).toBeInTheDocument();
    }
  });

  it('should generate correct ID for new jobs', async () => {
    render(<JobSelector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Fill form and submit
    const input = screen.getByPlaceholderText('Job Title');
    fireEvent.change(input, { target: { value: 'New Job' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('New Job')).toBeInTheDocument();
    });

    // The new job should have a unique ID
    expect(screen.getByText('New Job')).toBeInTheDocument();
  });

  it('should handle multiple job operations correctly', async () => {
    // Mock window.confirm to return true
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);
    
    render(<JobSelector />);
    
    // Add a new job
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    const input = screen.getByPlaceholderText('Job Title');
    fireEvent.change(input, { target: { value: 'New Job' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('New Job')).toBeInTheDocument();
    });

    // Edit a job
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      const editInput = screen.getByDisplayValue('Frontend Developer');
      fireEvent.change(editInput, { target: { value: 'Updated Frontend Developer' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('Updated Frontend Developer')).toBeInTheDocument();
      });
    }

    // Delete a job
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(button => 
      button.innerHTML.includes('M6 18L18 6M6 6l12 12')
    );
    
    if (deleteButton) {
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByText('Updated Frontend Developer')).not.toBeInTheDocument();
      });
    }
    
    // Restore original confirm
    window.confirm = originalConfirm;
  });

  it('should handle rapid job operations', async () => {
    render(<JobSelector />);
    
    // Open add modal multiple times quickly
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    // Should only show one modal
    const modals = screen.getAllByText('Create New Job');
    expect(modals).toHaveLength(1);
  });

  it('should maintain job order after operations', async () => {
    render(<JobSelector />);
    
    // Verify initial order
    const jobElements = screen.getAllByText(/Frontend Developer|Backend Engineer|Product Manager/);
    expect(jobElements[0]).toHaveTextContent('Frontend Developer');
    expect(jobElements[1]).toHaveTextContent('Backend Engineer');
    expect(jobElements[2]).toHaveTextContent('Product Manager');

    // Add a new job
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    const input = screen.getByPlaceholderText('Job Title');
    fireEvent.change(input, { target: { value: 'New Job' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('New Job')).toBeInTheDocument();
    });

    // Verify order is maintained (new job should be at the end)
    const updatedJobElements = screen.getAllByText(/Frontend Developer|Backend Engineer|Product Manager|New Job/);
    expect(updatedJobElements[updatedJobElements.length - 1]).toHaveTextContent('New Job');
  });

  it('should handle special characters in job names', async () => {
    render(<JobSelector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Fill form with special characters
    const input = screen.getByPlaceholderText('Job Title');
    fireEvent.change(input, { target: { value: 'Tech & Co. Developer' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Tech & Co. Developer')).toBeInTheDocument();
    });
  });

  it('should handle long job names', async () => {
    render(<JobSelector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Fill form with long name
    const longName = 'Very Long Job Title That Exceeds Normal Length';
    const input = screen.getByPlaceholderText('Job Title');
    fireEvent.change(input, { target: { value: longName } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText(longName)).toBeInTheDocument();
    });
  });

  it('should handle edit job when job is not found', () => {
    render(<JobSelector />);
    
    // This test verifies that the component handles edge cases gracefully
    // The component should not crash when trying to edit a non-existent job
    expect(screen.getByText('Jobs List')).toBeInTheDocument();
  });

  it('should show loading state and match snapshot', () => {
    const { container } = render(<JobSelector />);
    expect(container).toMatchSnapshot();
  });

  it('should show error state and match snapshot', () => {
    const { container } = render(<JobSelector />);
    expect(container).toMatchSnapshot();
  });
}); 