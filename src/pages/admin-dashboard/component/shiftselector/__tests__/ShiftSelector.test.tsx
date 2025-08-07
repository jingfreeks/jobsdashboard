import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ShiftSelector from '../shiftselector';
import { shiftApiSlice } from '@/features/shift';

// Mock the hooks
vi.mock('@/hooks/useShiftOperations', () => ({
  useShiftOperations: vi.fn(),
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: vi.fn(),
}));

// Import the mocked hooks
import { useShiftOperations } from '@/hooks/useShiftOperations';
import { useToast } from '@/hooks/useToast';

// Mock the store
const createTestStore = () => {
  return configureStore({
    reducer: {
      [shiftApiSlice.reducerPath]: shiftApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(shiftApiSlice.middleware),
  });
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore();
  return <Provider store={store}>{children}</Provider>;
};

describe('ShiftSelector', () => {
  const mockShifts = [
    { _id: '1', title: 'Morning' },
    { _id: '2', title: 'Evening' },
    { _id: '3', title: 'Night' },
  ];

  const mockCreateShift = vi.fn();
  const mockUpdateShift = vi.fn();
  const mockDeleteShift = vi.fn();
  const mockGetShiftById = vi.fn();
  const mockShowSuccess = vi.fn();
  const mockShowError = vi.fn();
  const mockRemoveToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    useShiftOperations.mockReturnValue({
      shifts: mockShifts,
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createShift: mockCreateShift,
      updateShift: mockUpdateShift,
      deleteShift: mockDeleteShift,
      getShiftById: mockGetShiftById,
    });

    useToast.mockReturnValue({
      toasts: [],
      removeToast: mockRemoveToast,
      showSuccess: mockShowSuccess,
      showError: mockShowError,
    });

    mockGetShiftById.mockImplementation((id) => 
      mockShifts.find(shift => shift._id === id)
    );
  });

  it('should render correctly', () => {
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    expect(screen.getByText('Shift List')).toBeInTheDocument();
    expect(screen.getByText('Add Shift')).toBeInTheDocument();
    expect(screen.getByText('Morning')).toBeInTheDocument();
    expect(screen.getByText('Evening')).toBeInTheDocument();
    expect(screen.getByText('Night')).toBeInTheDocument();
  });

  it('should display shifts list', () => {
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const shifts = ['Morning', 'Evening', 'Night'];
    shifts.forEach(shift => {
      expect(screen.getByText(shift)).toBeInTheDocument();
    });
  });

  it('should show empty state when no shifts', () => {
    useShiftOperations.mockReturnValue({
      shifts: [],
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createShift: mockCreateShift,
      updateShift: mockUpdateShift,
      deleteShift: mockDeleteShift,
      getShiftById: mockGetShiftById,
    });

    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    expect(screen.getByText('No shifts found. Create your first shift to get started.')).toBeInTheDocument();
  });

  it('should open add modal when add button is clicked', () => {
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    expect(screen.getByText('Create New Shift')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Shift Name')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should close add modal when cancel is clicked', () => {
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(screen.queryByText('Create New Shift')).not.toBeInTheDocument();
  });

  it('should close add modal when close button is clicked', () => {
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    expect(screen.queryByText('Create New Shift')).not.toBeInTheDocument();
  });

  it('should handle shift creation', async () => {
    mockCreateShift.mockResolvedValue(true);
    
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const input = screen.getByPlaceholderText('Shift Name');
    fireEvent.change(input, { target: { value: 'Graveyard' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockCreateShift).toHaveBeenCalledWith({ title: 'Graveyard' });
      expect(mockShowSuccess).toHaveBeenCalledWith('Shift "Graveyard" has been created successfully.');
    });
  });

  it('should not create shift with empty name', () => {
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const input = screen.getByPlaceholderText('Shift Name');
    fireEvent.change(input, { target: { value: '' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    // Modal should remain open and no API call should be made
    expect(screen.getByText('Create New Shift')).toBeInTheDocument();
    expect(mockCreateShift).not.toHaveBeenCalled();
  });

  it('should not create shift with whitespace-only name', () => {
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const input = screen.getByPlaceholderText('Shift Name');
    fireEvent.change(input, { target: { value: '   ' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    // Modal should remain open and no API call should be made
    expect(screen.getByText('Create New Shift')).toBeInTheDocument();
    expect(mockCreateShift).not.toHaveBeenCalled();
  });

  it('should trim whitespace from shift name when creating', async () => {
    mockCreateShift.mockResolvedValue(true);
    
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const input = screen.getByPlaceholderText('Shift Name');
    fireEvent.change(input, { target: { value: '  Graveyard  ' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockCreateShift).toHaveBeenCalledWith({ title: 'Graveyard' });
    });
  });

  it('should open edit modal when edit button is clicked', () => {
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const editButtons = screen.getAllByTitle('Edit shift');
    const editButton = editButtons[0];
    fireEvent.click(editButton);
    
    expect(screen.getByText('Edit Shift')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Morning')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should close edit modal when cancel is clicked', () => {
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const editButtons = screen.getAllByTitle('Edit shift');
    const editButton = editButtons[0];
    fireEvent.click(editButton);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(screen.queryByText('Edit Shift')).not.toBeInTheDocument();
  });

  it('should close edit modal when close button is clicked', () => {
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const editButtons = screen.getAllByTitle('Edit shift');
    const editButton = editButtons[0];
    fireEvent.click(editButton);
    
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    expect(screen.queryByText('Edit Shift')).not.toBeInTheDocument();
  });

  it('should handle shift update', async () => {
    mockUpdateShift.mockResolvedValue(true);
    
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const editButtons = screen.getAllByTitle('Edit shift');
    const editButton = editButtons[0];
    fireEvent.click(editButton);
    
    const input = screen.getByDisplayValue('Morning');
    fireEvent.change(input, { target: { value: 'Updated Morning' } });
    
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);
    
    await waitFor(() => {
      expect(mockUpdateShift).toHaveBeenCalledWith({
        _id: '1',
        title: 'Updated Morning',
      });
      expect(mockShowSuccess).toHaveBeenCalledWith('Shift "Updated Morning" has been updated successfully.');
    });
  });

  it('should not update shift with empty name', () => {
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const editButtons = screen.getAllByTitle('Edit shift');
    const editButton = editButtons[0];
    fireEvent.click(editButton);
    
    const input = screen.getByDisplayValue('Morning');
    fireEvent.change(input, { target: { value: '' } });
    
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);
    
    // Modal should remain open and no API call should be made
    expect(screen.getByText('Edit Shift')).toBeInTheDocument();
    expect(mockUpdateShift).not.toHaveBeenCalled();
  });

  it('should not update shift with whitespace-only name', () => {
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const editButtons = screen.getAllByTitle('Edit shift');
    const editButton = editButtons[0];
    fireEvent.click(editButton);
    
    const input = screen.getByDisplayValue('Morning');
    fireEvent.change(input, { target: { value: '   ' } });
    
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);
    
    // Modal should remain open and no API call should be made
    expect(screen.getByText('Edit Shift')).toBeInTheDocument();
    expect(mockUpdateShift).not.toHaveBeenCalled();
  });

  it('should trim whitespace from shift name when updating', async () => {
    mockUpdateShift.mockResolvedValue(true);
    
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const editButtons = screen.getAllByTitle('Edit shift');
    const editButton = editButtons[0];
    fireEvent.click(editButton);
    
    const input = screen.getByDisplayValue('Morning');
    fireEvent.change(input, { target: { value: '  Updated Morning  ' } });
    
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);
    
    await waitFor(() => {
      expect(mockUpdateShift).toHaveBeenCalledWith({
        _id: '1',
        title: 'Updated Morning',
      });
    });
  });

  it('should handle shift deletion', async () => {
    mockDeleteShift.mockResolvedValue(true);
    
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const deleteButtons = screen.getAllByTitle('Delete shift');
    const deleteButton = deleteButtons[0];
    fireEvent.click(deleteButton);
    
    // Check that confirmation modal is shown
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    
    // Click the delete button in the modal
    const confirmDeleteButton = screen.getByText('Delete');
    fireEvent.click(confirmDeleteButton);
    
    await waitFor(() => {
      expect(mockDeleteShift).toHaveBeenCalledWith({ _id: '1' });
      expect(mockShowSuccess).toHaveBeenCalledWith('Shift "Morning" has been deleted successfully.');
    });
  });

  it('should handle multiple shift operations', async () => {
    mockCreateShift.mockResolvedValue(true);
    mockUpdateShift.mockResolvedValue(true);
    mockDeleteShift.mockResolvedValue(true);
    
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    // Create a new shift
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const input = screen.getByPlaceholderText('Shift Name');
    fireEvent.change(input, { target: { value: 'New Shift' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockCreateShift).toHaveBeenCalledWith({ title: 'New Shift' });
    });
    
    // Edit a shift
    const editButtons = screen.getAllByTitle('Edit shift');
    const editButton = editButtons[0];
    fireEvent.click(editButton);
    
    const editInput = screen.getByDisplayValue('Morning');
    fireEvent.change(editInput, { target: { value: 'Updated Morning' } });
    
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);
    
    await waitFor(() => {
      expect(mockUpdateShift).toHaveBeenCalledWith({
        _id: '1',
        title: 'Updated Morning',
      });
    });
    
    // Delete a shift
    const deleteButtons = screen.getAllByTitle('Delete shift');
    const deleteButton = deleteButtons[0];
    fireEvent.click(deleteButton);
    
    const confirmDeleteButton = screen.getByText('Delete');
    fireEvent.click(confirmDeleteButton);
    
    await waitFor(() => {
      expect(mockDeleteShift).toHaveBeenCalledWith({ _id: '1' });
    });
  });

  it('should handle loading states', () => {
    useShiftOperations.mockReturnValue({
      shifts: mockShifts,
      isLoading: true,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createShift: mockCreateShift,
      updateShift: mockUpdateShift,
      deleteShift: mockDeleteShift,
      getShiftById: mockGetShiftById,
    });

    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    expect(screen.getByText('Loading shifts...')).toBeInTheDocument();
  });

  it('should handle error states', () => {
    useShiftOperations.mockReturnValue({
      shifts: [],
      isLoading: false,
      error: 'Failed to load shifts',
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createShift: mockCreateShift,
      updateShift: mockUpdateShift,
      deleteShift: mockDeleteShift,
      getShiftById: mockGetShiftById,
    });

    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    expect(screen.getByText('Error loading shifts. Please try again.')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    mockCreateShift.mockResolvedValue(false);
    
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const addButton = screen.getByText('Add Shift');
    fireEvent.click(addButton);
    
    const input = screen.getByPlaceholderText('Shift Name');
    fireEvent.change(input, { target: { value: 'New Shift' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to create shift. Please try again.');
    });
  });

  it('should cancel shift deletion when user declines confirmation', async () => {
    render(
      <TestWrapper>
        <ShiftSelector />
      </TestWrapper>
    );
    
    const deleteButtons = screen.getAllByTitle('Delete shift');
    const deleteButton = deleteButtons[0];
    fireEvent.click(deleteButton);
    
    // Check that confirmation modal is shown
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    
    // Click the cancel button in the modal
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    // Verify that delete function was NOT called
    expect(mockDeleteShift).not.toHaveBeenCalled();
    
    // Verify that modal is closed
    expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
  });
}); 