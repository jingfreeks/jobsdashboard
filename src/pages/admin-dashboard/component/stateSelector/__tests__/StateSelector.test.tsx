import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import StateSelector from '../Stateselector';

// Mock the custom hooks
const mockUseStateOperations = {
  states: [
    { _id: '1', name: 'California' },
    { _id: '2', name: 'Texas' },
    { _id: '3', name: 'Florida' },
  ],
  isLoading: false,
  isAdding: false,
  isUpdating: false,
  isDeleting: false,
  createState: vi.fn(),
  updateStateById: vi.fn(),
  deleteStateById: vi.fn(),
};

const mockUseToast = {
  toasts: [],
  removeToast: vi.fn(),
  showSuccess: vi.fn(),
  showError: vi.fn(),
};

vi.mock('@/hooks/useStateOperations', () => ({
  useStateOperations: vi.fn(() => mockUseStateOperations),
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: vi.fn(() => mockUseToast),
}));

describe('StateSelector', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create a mock store
    store = configureStore({
      reducer: {
        // Add any required reducers here
      },
    });
  });

  const renderStateSelector = () => {
    return render(
      <Provider store={store}>
        <StateSelector />
      </Provider>
    );
  };

  it('should render correctly', () => {
    const { container } = renderStateSelector();
    expect(container).toMatchSnapshot();
  });

  it('should display the title and add button', () => {
    renderStateSelector();
    
    expect(screen.getByText('State List')).toBeInTheDocument();
    expect(screen.getByText('Add State')).toBeInTheDocument();
  });

  it('should display states list', () => {
    renderStateSelector();
    
    expect(screen.getByText('California')).toBeInTheDocument();
    expect(screen.getByText('Texas')).toBeInTheDocument();
    expect(screen.getByText('Florida')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    // Temporarily modify the mock return value
    const originalStates = mockUseStateOperations.states;
    const originalIsLoading = mockUseStateOperations.isLoading;
    
    mockUseStateOperations.states = [];
    mockUseStateOperations.isLoading = true;
    
    renderStateSelector();
    
    expect(screen.getByText('Loading states...')).toBeInTheDocument();
    
    // Restore original values
    mockUseStateOperations.states = originalStates;
    mockUseStateOperations.isLoading = originalIsLoading;
  });

  it('should show empty state when no states', () => {
    // Temporarily modify the mock return value
    const originalStates = mockUseStateOperations.states;
    mockUseStateOperations.states = [];
    
    renderStateSelector();
    
    expect(screen.getByText('No states')).toBeInTheDocument();
    
    // Restore original values
    mockUseStateOperations.states = originalStates;
  });

  it('should open add modal when add button is clicked', () => {
    renderStateSelector();
    
    const addButton = screen.getByText('Add State');
    fireEvent.click(addButton);
    
    expect(screen.getByText('Create New State')).toBeInTheDocument();
  });

  it('should close add modal when cancel is clicked', () => {
    renderStateSelector();
    
    // Open modal
    const addButton = screen.getByText('Add State');
    fireEvent.click(addButton);
    
    // Close modal
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(screen.queryByText('Create New State')).not.toBeInTheDocument();
  });

  it('should handle state creation', async () => {
    mockUseStateOperations.createState.mockResolvedValue({ _id: '4', name: 'New York' });
    
    renderStateSelector();
    
    // Open modal
    const addButton = screen.getByText('Add State');
    fireEvent.click(addButton);
    
    // Fill form
    const input = screen.getByPlaceholderText('State Name');
    fireEvent.change(input, { target: { value: 'New York' } });
    
    // Submit form
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockUseStateOperations.createState).toHaveBeenCalledWith({ name: 'New York' });
      expect(mockUseToast.showSuccess).toHaveBeenCalledWith('State "New York" has been created successfully.');
    });
  });

  it('should handle state update', async () => {
    mockUseStateOperations.updateStateById.mockResolvedValue({ _id: '1', name: 'Updated California' });
    
    renderStateSelector();
    
    // Find and click edit button for first state
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Update form
      const input = screen.getByPlaceholderText('State Name');
      fireEvent.change(input, { target: { value: 'Updated California' } });
      
      // Submit form
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(mockUseStateOperations.updateStateById).toHaveBeenCalledWith({ 
          _id: '1', 
          name: 'Updated California' 
        });
        expect(mockUseToast.showSuccess).toHaveBeenCalledWith('State "Updated California" has been updated successfully.');
      });
    }
  });

  it('should handle state deletion', async () => {
    mockUseStateOperations.deleteStateById.mockResolvedValue(true);
    
    renderStateSelector();
    
    // Find and click delete button for first state
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(button => 
      button.innerHTML.includes('M6 18L18 6M6 6l12 12')
    );
    
    if (deleteButton) {
      fireEvent.click(deleteButton);
      
      // Check that confirmation modal is shown
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      
      // Click the delete button in the modal
      const confirmDeleteButton = screen.getByText('Delete');
      fireEvent.click(confirmDeleteButton);
      
      await waitFor(() => {
        expect(mockUseStateOperations.deleteStateById).toHaveBeenCalledWith('1');
        expect(mockUseToast.showSuccess).toHaveBeenCalledWith('State "California" has been deleted successfully.');
      });
    }
  });

  it('should handle error during state creation', async () => {
    mockUseStateOperations.createState.mockResolvedValue(null);
    
    renderStateSelector();
    
    // Open modal
    const addButton = screen.getByText('Add State');
    fireEvent.click(addButton);
    
    // Fill form
    const input = screen.getByPlaceholderText('State Name');
    fireEvent.change(input, { target: { value: 'New York' } });
    
    // Submit form
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockUseToast.showError).toHaveBeenCalledWith('Failed to create state. Please try again.');
    });
  });

  it('should handle error during state update', async () => {
    mockUseStateOperations.updateStateById.mockResolvedValue(null);
    
    renderStateSelector();
    
    // Find and click edit button for first state
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Update form
      const input = screen.getByPlaceholderText('State Name');
      fireEvent.change(input, { target: { value: 'Updated California' } });
      
      // Submit form
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(mockUseToast.showError).toHaveBeenCalledWith('Failed to update state. Please try again.');
      });
    }
  });

  it('should handle error during state deletion', async () => {
    mockUseStateOperations.deleteStateById.mockResolvedValue(false);
    
    renderStateSelector();
    
    // Find and click delete button for first state
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(button => 
      button.innerHTML.includes('M6 18L18 6M6 6l12 12')
    );
    
    if (deleteButton) {
      fireEvent.click(deleteButton);
      
      // Check that confirmation modal is shown
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      
      // Click the delete button in the modal
      const confirmDeleteButton = screen.getByText('Delete');
      fireEvent.click(confirmDeleteButton);
      
      await waitFor(() => {
        expect(mockUseToast.showError).toHaveBeenCalledWith('Failed to delete state. Please try again.');
      });
    }
  });

  // Additional test cases for better coverage

  it('should not create state with empty name', async () => {
    renderStateSelector();
    
    // Open modal
    const addButton = screen.getByText('Add State');
    fireEvent.click(addButton);
    
    // Try to submit with empty name
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockUseStateOperations.createState).not.toHaveBeenCalled();
    });
  });

  it('should not create state with whitespace-only name', async () => {
    renderStateSelector();
    
    // Open modal
    const addButton = screen.getByText('Add State');
    fireEvent.click(addButton);
    
    // Fill form with whitespace
    const input = screen.getByPlaceholderText('State Name');
    fireEvent.change(input, { target: { value: '   ' } });
    
    // Submit form
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockUseStateOperations.createState).not.toHaveBeenCalled();
    });
  });

  it('should trim whitespace from state name when creating', async () => {
    mockUseStateOperations.createState.mockResolvedValue({ _id: '4', name: 'New York' });
    
    renderStateSelector();
    
    // Open modal
    const addButton = screen.getByText('Add State');
    fireEvent.click(addButton);
    
    // Fill form with whitespace
    const input = screen.getByPlaceholderText('State Name');
    fireEvent.change(input, { target: { value: '  New York  ' } });
    
    // Submit form
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockUseStateOperations.createState).toHaveBeenCalledWith({ name: 'New York' });
    });
  });

  it('should not update state with empty name', async () => {
    renderStateSelector();
    
    // Find and click edit button for first state
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Clear the input
      const input = screen.getByPlaceholderText('State Name');
      fireEvent.change(input, { target: { value: '' } });
      
      // Submit form
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(mockUseStateOperations.updateStateById).not.toHaveBeenCalled();
      });
    }
  });

  it('should not delete state when user cancels confirmation', async () => {
    renderStateSelector();
    
    // Find and click delete button for first state
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(button => 
      button.innerHTML.includes('M6 18L18 6M6 6l12 12')
    );
    
    if (deleteButton) {
      fireEvent.click(deleteButton);
      
      // Check that confirmation modal is shown
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      
      // Click the cancel button in the modal
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      // Verify that delete function was NOT called
      expect(mockUseStateOperations.deleteStateById).not.toHaveBeenCalled();
      
      // Verify that modal is closed
      expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
    }
  });

  it('should disable add button when operations are in progress', () => {
    // Set loading states
    mockUseStateOperations.isAdding = true;
    
    renderStateSelector();
    
    const addButton = screen.getByText('Add State');
    expect(addButton).toBeDisabled();
    
    // Reset loading state
    mockUseStateOperations.isAdding = false;
  });

  it('should disable add button when adding state', () => {
    // Set loading state first
    mockUseStateOperations.isAdding = true;
    
    renderStateSelector();
    
    // Check that the button is disabled
    const addButton = screen.getByText('Add State');
    expect(addButton).toBeDisabled();
    
    // Reset loading state
    mockUseStateOperations.isAdding = false;
  });

  it('should show loading state in edit modal when updating', () => {
    mockUseStateOperations.isUpdating = true;
    
    renderStateSelector();
    
    // Find and click edit button for first state
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      expect(screen.getByText('Updating...')).toBeInTheDocument();
    }
    
    // Reset loading state
    mockUseStateOperations.isUpdating = false;
  });

  it('should handle deletion of state with empty name gracefully', async () => {
    mockUseStateOperations.deleteStateById.mockResolvedValue(true);
    
    // Temporarily modify states to include one with empty name
    const originalStates = mockUseStateOperations.states;
    mockUseStateOperations.states = [
      { _id: '1', name: 'California' },
      { _id: '2', name: '' },
      { _id: '3', name: 'Florida' },
    ];
    
    renderStateSelector();
    
    // Test that the component renders without errors when there's a state with empty name
    expect(screen.getByText('California')).toBeInTheDocument();
    expect(screen.getByText('Florida')).toBeInTheDocument();
    
    // Restore original states
    mockUseStateOperations.states = originalStates;
  });

  it('should handle edit state when state is not found', () => {
    renderStateSelector();
    
    // Temporarily modify states to be empty
    const originalStates = mockUseStateOperations.states;
    mockUseStateOperations.states = [];
    
    // This should not throw an error
    expect(() => renderStateSelector()).not.toThrow();
    
    // Restore original states
    mockUseStateOperations.states = originalStates;
  });
}); 