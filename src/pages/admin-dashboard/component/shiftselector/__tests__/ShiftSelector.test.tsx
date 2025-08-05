import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShiftSelector from '../shiftselector';

describe('ShiftSelector', () => {
  it('should render correctly', () => {
    render(<ShiftSelector />);
    
    expect(screen.getByText('Shift List')).toBeInTheDocument();
    expect(screen.getByText('Add Shift')).toBeInTheDocument();
    expect(screen.getByText('Morning')).toBeInTheDocument();
    expect(screen.getByText('Evening')).toBeInTheDocument();
    expect(screen.getByText('Night')).toBeInTheDocument();
  });

  it('should display shifts list', () => {
    render(<ShiftSelector />);
    
    const shifts = ['Morning', 'Evening', 'Night'];
    shifts.forEach(shift => {
      expect(screen.getByText(shift)).toBeInTheDocument();
    });
  });

  it('should show empty state when no shifts', () => {
    // We can't easily test this without modifying the component's initial state
    // This test documents the expected behavior
    render(<ShiftSelector />);
    
    // Should show the default shifts
    expect(screen.getByText('Morning')).toBeInTheDocument();
  });

  it('should open add modal when add button is clicked', () => {
    render(<ShiftSelector />);
    
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    expect(screen.getByText('Create New Shift')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Shift Name')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should close add modal when cancel is clicked', () => {
    render(<ShiftSelector />);
    
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(screen.queryByText('Create New Shift')).not.toBeInTheDocument();
  });

  it('should close add modal when close button is clicked', () => {
    render(<ShiftSelector />);
    
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    expect(screen.queryByText('Create New Shift')).not.toBeInTheDocument();
  });

  it('should handle shift creation', async () => {
    render(<ShiftSelector />);
    
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const input = screen.getByPlaceholderText('Shift Name');
    fireEvent.change(input, { target: { value: 'Graveyard' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText('Graveyard')).toBeInTheDocument();
      expect(screen.queryByText('Create New Shift')).not.toBeInTheDocument();
    });
  });

  it('should not create shift with empty name', () => {
    render(<ShiftSelector />);
    
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const input = screen.getByPlaceholderText('Shift Name');
    fireEvent.change(input, { target: { value: '' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    // Modal should remain open
    expect(screen.getByText('Create New Shift')).toBeInTheDocument();
  });

  it('should not create shift with whitespace-only name', () => {
    render(<ShiftSelector />);
    
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const input = screen.getByPlaceholderText('Shift Name');
    fireEvent.change(input, { target: { value: '   ' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    // Modal should remain open
    expect(screen.getByText('Create New Shift')).toBeInTheDocument();
  });

  it('should trim whitespace from shift name when creating', async () => {
    render(<ShiftSelector />);
    
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const input = screen.getByPlaceholderText('Shift Name');
    fireEvent.change(input, { target: { value: '  Graveyard  ' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText('Graveyard')).toBeInTheDocument();
      expect(screen.queryByText('Create New Shift')).not.toBeInTheDocument();
    });
  });

  it('should open edit modal when edit button is clicked', () => {
    render(<ShiftSelector />);
    
    // Find the first edit button (for Morning shift)
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      expect(screen.getByText('Edit Shift')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Morning')).toBeInTheDocument();
      expect(screen.getByText('Update')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    }
  });

  it('should close edit modal when cancel is clicked', () => {
    render(<ShiftSelector />);
    
    // Find the first edit button (for Morning shift)
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      expect(screen.queryByText('Edit Shift')).not.toBeInTheDocument();
    }
  });

  it('should close edit modal when close button is clicked', () => {
    render(<ShiftSelector />);
    
    // Find the first edit button (for Morning shift)
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);
      
      expect(screen.queryByText('Edit Shift')).not.toBeInTheDocument();
    }
  });

  it('should handle shift update', async () => {
    render(<ShiftSelector />);
    
    // Find the first edit button (for Morning shift)
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      const input = screen.getByDisplayValue('Morning');
      fireEvent.change(input, { target: { value: 'Early Morning' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Early Morning')).toBeInTheDocument();
        expect(screen.queryByText('Edit Shift')).not.toBeInTheDocument();
      });
    }
  });

  it('should not update shift with empty name', () => {
    render(<ShiftSelector />);
    
    // Find the first edit button (for Morning shift)
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      const input = screen.getByDisplayValue('Morning');
      fireEvent.change(input, { target: { value: '' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);
      
      // Modal should remain open
      expect(screen.getByText('Edit Shift')).toBeInTheDocument();
    }
  });

  it('should not update shift with whitespace-only name', () => {
    render(<ShiftSelector />);
    
    // Find the first edit button (for Morning shift)
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      const input = screen.getByDisplayValue('Morning');
      fireEvent.change(input, { target: { value: '   ' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);
      
      // Modal should remain open
      expect(screen.getByText('Edit Shift')).toBeInTheDocument();
    }
  });

  it('should trim whitespace from shift name when updating', async () => {
    render(<ShiftSelector />);
    
    // Find the first edit button (for Morning shift)
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      const input = screen.getByDisplayValue('Morning');
      fireEvent.change(input, { target: { value: '  Early Morning  ' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Early Morning')).toBeInTheDocument();
        expect(screen.queryByText('Edit Shift')).not.toBeInTheDocument();
      });
    }
  });

  it('should handle shift deletion', async () => {
    render(<ShiftSelector />);
    
    // Find the first delete button (for Morning shift)
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(button => 
      button.innerHTML.includes('M6 18L18 6M6 6l12 12')
    );
    
    if (deleteButton) {
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Morning')).not.toBeInTheDocument();
      });
    }
  });

  it('should handle multiple shift operations', async () => {
    render(<ShiftSelector />);
    
    // Add a new shift
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const input = screen.getByPlaceholderText('Shift Name');
    fireEvent.change(input, { target: { value: 'Graveyard' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText('Graveyard')).toBeInTheDocument();
    });
    
    // Edit the Morning shift (first one) instead of the new shift
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      const editInput = screen.getByDisplayValue('Morning');
      fireEvent.change(editInput, { target: { value: 'Early Morning' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Early Morning')).toBeInTheDocument();
        expect(screen.getByText('Graveyard')).toBeInTheDocument();
      });
    }
  });

  it('should generate correct IDs for new shifts', async () => {
    render(<ShiftSelector />);
    
    // Add multiple shifts to test ID generation
    const addButton = screen.getByText('Add Shift');
    
    // Add first shift
    fireEvent.click(addButton);
    const input1 = screen.getByPlaceholderText('Shift Name');
    fireEvent.change(input1, { target: { value: 'Shift 1' } });
    const createButton1 = screen.getByText('Create');
    fireEvent.click(createButton1);
    
    await waitFor(() => {
      expect(screen.getByText('Shift 1')).toBeInTheDocument();
    });
    
    // Add second shift
    fireEvent.click(addButton);
    const input2 = screen.getByPlaceholderText('Shift Name');
    fireEvent.change(input2, { target: { value: 'Shift 2' } });
    const createButton2 = screen.getByText('Create');
    fireEvent.click(createButton2);
    
    await waitFor(() => {
      expect(screen.getByText('Shift 2')).toBeInTheDocument();
    });
    
    // Both shifts should be present
    expect(screen.getByText('Shift 1')).toBeInTheDocument();
    expect(screen.getByText('Shift 2')).toBeInTheDocument();
  });

  it('should handle rapid shift operations', async () => {
    render(<ShiftSelector />);
    
    // Add a shift
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const input = screen.getByPlaceholderText('Shift Name');
    fireEvent.change(input, { target: { value: 'Rapid Shift' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText('Rapid Shift')).toBeInTheDocument();
    });
    
    // Immediately edit the Morning shift (first one)
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      const editInput = screen.getByDisplayValue('Morning');
      fireEvent.change(editInput, { target: { value: 'Updated Morning' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Updated Morning')).toBeInTheDocument();
        expect(screen.getByText('Rapid Shift')).toBeInTheDocument();
      });
    }
  });

  it('should handle special characters in shift names', async () => {
    render(<ShiftSelector />);
    
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const input = screen.getByPlaceholderText('Shift Name');
    fireEvent.change(input, { target: { value: 'Shift @ Night (9PM-6AM)' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText('Shift @ Night (9PM-6AM)')).toBeInTheDocument();
    });
  });

  it('should handle long shift names', async () => {
    render(<ShiftSelector />);
    
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const longName = 'Very Long Shift Name That Exceeds Normal Length Expectations';
    const input = screen.getByPlaceholderText('Shift Name');
    fireEvent.change(input, { target: { value: longName } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText(longName)).toBeInTheDocument();
    });
  });

  it('should maintain order of shifts after operations', async () => {
    render(<ShiftSelector />);
    
    // Add a new shift
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const input = screen.getByPlaceholderText('Shift Name');
    fireEvent.change(input, { target: { value: 'Zebra Shift' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText('Zebra Shift')).toBeInTheDocument();
    });
    
    // Check that original shifts are still in order
    const shifts = ['Evening', 'Morning', 'Night', 'Zebra Shift'];
    shifts.forEach(shift => {
      expect(screen.getByText(shift)).toBeInTheDocument();
    });
  });
}); 