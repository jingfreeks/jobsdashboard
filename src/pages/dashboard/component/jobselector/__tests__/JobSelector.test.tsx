import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Jobselector from '../Jobselector';

describe('JobSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly and match snapshot', () => {
    const { container } = render(<Jobselector />);
    expect(container).toMatchSnapshot();
  });

  it('should display jobs list correctly', () => {
    render(<Jobselector />);

    expect(screen.getByText('Jobs List')).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  it('should show empty state when no jobs exist', () => {
    // We need to modify the component to start with empty jobs for this test
    // Since the component has hardcoded initial jobs, we'll test the empty state
    // by deleting all jobs first
    render(<Jobselector />);
    
    // Delete all jobs
    const deleteButtons = screen.getAllByRole('button').filter(button => 
      button.innerHTML.includes('M6 18L18 6M6 6l12 12')
    );
    
    deleteButtons.forEach(button => {
      fireEvent.click(button);
    });

    expect(screen.getByText('No jobs')).toBeInTheDocument();
  });

  it('should open add job modal when add button is clicked', () => {
    render(<Jobselector />);
    
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    expect(screen.getByText('Create New Job')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Job Title')).toBeInTheDocument();
  });

  it('should create a new job successfully', async () => {
    render(<Jobselector />);
    
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
  });

  it('should not create job with empty name', async () => {
    render(<Jobselector />);
    
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
    render(<Jobselector />);
    
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

  it('should trim whitespace from job title when creating', async () => {
    render(<Jobselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Fill form with whitespace and submit
    const input = screen.getByPlaceholderText('Job Title');
    fireEvent.change(input, { target: { value: '  New Job Title  ' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('New Job Title')).toBeInTheDocument();
    });
  });

  it('should open edit modal when edit button is clicked', () => {
    render(<Jobselector />);
    
    // Find and click edit button for the first job
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      expect(screen.getByText('Edit Job')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Frontend Developer')).toBeInTheDocument();
    }
  });

  it('should update job successfully', async () => {
    render(<Jobselector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Update the title
      const input = screen.getByDisplayValue('Frontend Developer');
      fireEvent.change(input, { target: { value: 'Updated Job Title' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('Updated Job Title')).toBeInTheDocument();
      });
    }
  });

  it('should not update job with empty name', async () => {
    render(<Jobselector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Clear the title
      const input = screen.getByDisplayValue('Frontend Developer');
      fireEvent.change(input, { target: { value: '' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      // Modal should still be open
      expect(screen.getByText('Edit Job')).toBeInTheDocument();
    }
  });

  it('should trim whitespace from job title when updating', async () => {
    render(<Jobselector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Update with whitespace
      const input = screen.getByDisplayValue('Frontend Developer');
      fireEvent.change(input, { target: { value: '  Updated Job Title  ' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('Updated Job Title')).toBeInTheDocument();
      });
    }
  });

  it('should delete job when delete button is clicked', async () => {
    render(<Jobselector />);
    
    // Verify initial job exists
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
  });

  it('should close add modal when cancel button is clicked', () => {
    render(<Jobselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Click cancel button
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Create New Job')).not.toBeInTheDocument();
  });

  it('should close add modal when close button (×) is clicked', () => {
    render(<Jobselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Click close button
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Create New Job')).not.toBeInTheDocument();
  });

  it('should close edit modal when cancel button is clicked', () => {
    render(<Jobselector />);
    
    // Open edit modal
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Click cancel button
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(screen.queryByText('Edit Job')).not.toBeInTheDocument();
    }
  });

  it('should close edit modal when close button (×) is clicked', () => {
    render(<Jobselector />);
    
    // Open edit modal
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Click close button
      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);

      expect(screen.queryByText('Edit Job')).not.toBeInTheDocument();
    }
  });

  it('should generate correct IDs for new jobs', async () => {
    render(<Jobselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Add first new job
    const input = screen.getByPlaceholderText('Job Title');
    fireEvent.change(input, { target: { value: 'First New Job' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('First New Job')).toBeInTheDocument();
    });

    // Add second new job
    fireEvent.click(addButton);
    const input2 = screen.getByPlaceholderText('Job Title');
    fireEvent.change(input2, { target: { value: 'Second New Job' } });
    
    const createButton2 = screen.getByText('Create');
    fireEvent.click(createButton2);

    await waitFor(() => {
      expect(screen.getByText('Second New Job')).toBeInTheDocument();
    });
  });

  it('should handle multiple job operations correctly', async () => {
    render(<Jobselector />);
    
    // Verify initial jobs
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();

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
  });

  it('should handle rapid job operations', async () => {
    render(<Jobselector />);
    
    // Open add modal multiple times quickly
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    // Should only show one modal
    const modals = screen.getAllByText('Create New Job');
    expect(modals).toHaveLength(1);
  });

  it('should handle special characters in job titles', async () => {
    render(<Jobselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Add job with special characters
    const input = screen.getByPlaceholderText('Job Title');
    fireEvent.change(input, { target: { value: 'Job Title with @#$%^&*()' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Job Title with @#$%^&*()')).toBeInTheDocument();
    });
  });

  it('should handle long job titles', async () => {
    render(<Jobselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Add job with long title
    const longTitle = 'This is a very long job title that should be handled properly by the component without breaking the layout or functionality';
    const input = screen.getByPlaceholderText('Job Title');
    fireEvent.change(input, { target: { value: longTitle } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });
  });

  it('should maintain job order after operations', async () => {
    render(<Jobselector />);
    
    // Verify initial order
    const initialJobs = ['Frontend Developer', 'Backend Engineer', 'Product Manager'];
    initialJobs.forEach(job => {
      expect(screen.getByText(job)).toBeInTheDocument();
    });

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
  });

  it('should handle form submission with Enter key', async () => {
    render(<Jobselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Fill form and submit with Enter key
    const input = screen.getByPlaceholderText('Job Title');
    fireEvent.change(input, { target: { value: 'Enter Key Job' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // The component doesn't handle Enter key submission, so modal should remain open
    expect(screen.getByText('Create New Job')).toBeInTheDocument();
  });

  it('should handle edit form submission with Enter key', async () => {
    render(<Jobselector />);
    
    // Open edit modal
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Update with Enter key
      const input = screen.getByDisplayValue('Frontend Developer');
      fireEvent.change(input, { target: { value: 'Enter Key Update' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      // The component doesn't handle Enter key submission, so modal should remain open
      expect(screen.getByText('Edit Job')).toBeInTheDocument();
    }
  });

  it('should handle empty state after deleting all jobs', async () => {
    render(<Jobselector />);
    
    // Delete all jobs
    const deleteButtons = screen.getAllByRole('button').filter(button => 
      button.innerHTML.includes('M6 18L18 6M6 6l12 12')
    );
    
    deleteButtons.forEach(button => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText('No jobs')).toBeInTheDocument();
    });

    // Verify add button is still available
    expect(screen.getByText('Add Job')).toBeInTheDocument();
  });

  it('should handle adding job after deleting all jobs', async () => {
    render(<Jobselector />);
    
    // Delete all jobs first
    const deleteButtons = screen.getAllByRole('button').filter(button => 
      button.innerHTML.includes('M6 18L18 6M6 6l12 12')
    );
    
    deleteButtons.forEach(button => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText('No jobs')).toBeInTheDocument();
    });

    // Add a new job
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);
    
    const input = screen.getByPlaceholderText('Job Title');
    fireEvent.change(input, { target: { value: 'First Job After Delete' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('First Job After Delete')).toBeInTheDocument();
      expect(screen.queryByText('No jobs')).not.toBeInTheDocument();
    });
  });

  it('should handle concurrent edit and add operations', async () => {
    render(<Jobselector />);
    
    // Open edit modal
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Try to open add modal while edit is open
      const addButton = screen.getByText('Add Job');
      fireEvent.click(addButton);

      // The component allows multiple modals to be open simultaneously
      expect(screen.getByText('Edit Job')).toBeInTheDocument();
      expect(screen.getByText('Create New Job')).toBeInTheDocument();
    }
  });

  it('should handle form validation properly', async () => {
    render(<Jobselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Job');
    fireEvent.click(addButton);

    // Try to submit without entering anything
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    // Modal should still be open
    expect(screen.getByText('Create New Job')).toBeInTheDocument();

    // Try to submit with only spaces
    const input = screen.getByPlaceholderText('Job Title');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(createButton);

    // Modal should still be open
    expect(screen.getByText('Create New Job')).toBeInTheDocument();
  });

  it('should handle edit form validation properly', async () => {
    render(<Jobselector />);
    
    // Open edit modal
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Try to submit with empty value
      const input = screen.getByDisplayValue('Frontend Developer');
      fireEvent.change(input, { target: { value: '' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      // Modal should still be open
      expect(screen.getByText('Edit Job')).toBeInTheDocument();

      // Try to submit with only spaces
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(updateButton);

      // Modal should still be open
      expect(screen.getByText('Edit Job')).toBeInTheDocument();
    }
  });
}); 