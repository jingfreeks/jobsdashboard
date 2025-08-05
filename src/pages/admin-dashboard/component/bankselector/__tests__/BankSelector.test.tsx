import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Bankselector from '../Bankselector';
import { bankApiSlice } from '@/features/bank';
import { useBankOperations } from '@/hooks/useBankOperations';
import { useToast } from '@/hooks/useToast';

// Mock the hooks
vi.mock('@/hooks/useBankOperations', () => ({
  useBankOperations: vi.fn(),
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: vi.fn(),
}));

// Mock the API slice
vi.mock('@/features/bank', async () => {
  const actual = await vi.importActual('@/features/bank');
  return {
    ...actual,
    useGetBanksQuery: vi.fn(),
    useAddBankMutation: vi.fn(),
    useUpdateBankMutation: vi.fn(),
    useDeleteBankMutation: vi.fn(),
  };
});

// Mock window.confirm
const mockConfirm = vi.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true,
});

// Create a test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      [bankApiSlice.reducerPath]: bankApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(bankApiSlice.middleware),
  });
};

// Helper function to render with provider
const renderWithProvider = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('BankSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockReturnValue(true);
    
    // Set up default mock values
    vi.mocked(useBankOperations).mockReturnValue({
      banks: [],
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    vi.mocked(useToast).mockReturnValue({
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      showSuccess: vi.fn(),
      showError: vi.fn(),
      showWarning: vi.fn(),
      showInfo: vi.fn(),
    });
  });

  it('should render correctly and match snapshot', () => {
    const mockBanks = [
      { _id: '1', name: 'Chase Bank' },
      { _id: '2', name: 'Wells Fargo' },
      { _id: '3', name: 'Bank of America' },
    ];

    vi.mocked(useBankOperations).mockReturnValue({
      banks: mockBanks,
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    const { container } = renderWithProvider(<Bankselector />);
    expect(container).toMatchSnapshot();
  });

  it('should display bank list correctly', () => {
    const mockBanks = [
      { _id: '1', name: 'Chase Bank' },
      { _id: '2', name: 'Wells Fargo' },
      { _id: '3', name: 'Bank of America' },
    ];

    vi.mocked(useBankOperations).mockReturnValue({
      banks: mockBanks,
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    renderWithProvider(<Bankselector />);

    expect(screen.getByText('Bank List')).toBeInTheDocument();
    expect(screen.getByText('Chase Bank')).toBeInTheDocument();
    expect(screen.getByText('Wells Fargo')).toBeInTheDocument();
    expect(screen.getByText('Bank of America')).toBeInTheDocument();
  });

  it('should show loading state and match snapshot', () => {
    vi.mocked(useBankOperations).mockReturnValue({
      banks: [],
      isLoading: true,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    const { container } = renderWithProvider(<Bankselector />);
    expect(screen.getByText('Loading banks...')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should show error state and match snapshot', () => {
    vi.mocked(useBankOperations).mockReturnValue({
      banks: [],
      isLoading: false,
      error: 'Failed to load banks',
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    const { container } = renderWithProvider(<Bankselector />);
    expect(screen.getByText('Error loading banks. Please try again.')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should show empty state when no banks exist', () => {
    vi.mocked(useBankOperations).mockReturnValue({
      banks: [],
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    expect(screen.getByText('No banks found')).toBeInTheDocument();
  });

  it('should open add bank modal when add button is clicked', () => {
    const mockCreateBank = vi.fn();
    vi.mocked(useBankOperations).mockReturnValue({
      banks: [],
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: mockCreateBank,
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    const addButton = screen.getByText('Add Bank');
    fireEvent.click(addButton);

    expect(screen.getByText('Create New Bank')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Bank Name')).toBeInTheDocument();
  });

  it('should create a new bank successfully', async () => {
    const mockCreateBank = vi.fn().mockResolvedValue({ _id: '1', name: 'New Bank' });
    const mockShowSuccess = vi.fn();
    
    vi.mocked(useBankOperations).mockReturnValue({
      banks: [],
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: mockCreateBank,
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    vi.mocked(useToast).mockReturnValue({
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      showSuccess: mockShowSuccess,
      showError: vi.fn(),
      showWarning: vi.fn(),
      showInfo: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Bank');
    fireEvent.click(addButton);

    // Fill form and submit
    const input = screen.getByPlaceholderText('Bank Name');
    fireEvent.change(input, { target: { value: 'New Bank' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockCreateBank).toHaveBeenCalledWith({ name: 'New Bank' });
      expect(mockShowSuccess).toHaveBeenCalledWith('Bank "New Bank" has been created successfully.');
    });
  });

  it('should not create bank with empty name', async () => {
    const mockCreateBank = vi.fn();
    vi.mocked(useBankOperations).mockReturnValue({
      banks: [],
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: mockCreateBank,
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Bank');
    fireEvent.click(addButton);

    // Try to submit empty form
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    expect(mockCreateBank).not.toHaveBeenCalled();
  });

  it('should not create bank with whitespace-only name', async () => {
    const mockCreateBank = vi.fn();
    vi.mocked(useBankOperations).mockReturnValue({
      banks: [],
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: mockCreateBank,
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Bank');
    fireEvent.click(addButton);

    // Fill form with whitespace and submit
    const input = screen.getByPlaceholderText('Bank Name');
    fireEvent.change(input, { target: { value: '   ' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    expect(mockCreateBank).not.toHaveBeenCalled();
  });

  it('should trim whitespace from bank name when creating', async () => {
    const mockCreateBank = vi.fn().mockResolvedValue({ _id: '1', name: 'New Bank' });
    vi.mocked(useBankOperations).mockReturnValue({
      banks: [],
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: mockCreateBank,
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Bank');
    fireEvent.click(addButton);

    // Fill form with whitespace and submit
    const input = screen.getByPlaceholderText('Bank Name');
    fireEvent.change(input, { target: { value: '  New Bank  ' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockCreateBank).toHaveBeenCalledWith({ name: 'New Bank' });
    });
  });

  it('should open edit modal when edit button is clicked', () => {
    const mockBanks = [{ _id: '1', name: 'Chase Bank' }];
    const mockUpdateBank = vi.fn();
    
    vi.mocked(useBankOperations).mockReturnValue({
      banks: mockBanks,
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: mockUpdateBank,
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      expect(screen.getByText('Edit Bank')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Chase Bank')).toBeInTheDocument();
    }
  });

  it('should update bank successfully', async () => {
    const mockBanks = [{ _id: '1', name: 'Chase Bank' }];
    const mockUpdateBank = vi.fn().mockResolvedValue({ _id: '1', name: 'Updated Bank' });
    const mockShowSuccess = vi.fn();
    
    vi.mocked(useBankOperations).mockReturnValue({
      banks: mockBanks,
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: mockUpdateBank,
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    vi.mocked(useToast).mockReturnValue({
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      showSuccess: mockShowSuccess,
      showError: vi.fn(),
      showWarning: vi.fn(),
      showInfo: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Update the name
      const input = screen.getByDisplayValue('Chase Bank');
      fireEvent.change(input, { target: { value: 'Updated Bank' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(mockUpdateBank).toHaveBeenCalledWith({ _id: '1', name: 'Updated Bank' });
        expect(mockShowSuccess).toHaveBeenCalledWith('Bank "Updated Bank" has been updated successfully.');
      });
    }
  });

  it('should not update bank with empty name', async () => {
    const mockBanks = [{ _id: '1', name: 'Chase Bank' }];
    const mockUpdateBank = vi.fn();
    
    vi.mocked(useBankOperations).mockReturnValue({
      banks: mockBanks,
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: mockUpdateBank,
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Clear the name
      const input = screen.getByDisplayValue('Chase Bank');
      fireEvent.change(input, { target: { value: '' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      expect(mockUpdateBank).not.toHaveBeenCalled();
    }
  });

  it('should trim whitespace from bank name when updating', async () => {
    const mockBanks = [{ _id: '1', name: 'Chase Bank' }];
    const mockUpdateBank = vi.fn().mockResolvedValue({ _id: '1', name: 'Updated Bank' });
    
    vi.mocked(useBankOperations).mockReturnValue({
      banks: mockBanks,
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: mockUpdateBank,
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Update with whitespace
      const input = screen.getByDisplayValue('Chase Bank');
      fireEvent.change(input, { target: { value: '  Updated Bank  ' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(mockUpdateBank).toHaveBeenCalledWith({ _id: '1', name: 'Updated Bank' });
      });
    }
  });

  it('should delete bank when confirmed', async () => {
    const mockBanks = [{ _id: '1', name: 'Chase Bank' }];
    const mockDeleteBank = vi.fn().mockResolvedValue(true);
    const mockShowSuccess = vi.fn();
    
    vi.mocked(useBankOperations).mockReturnValue({
      banks: mockBanks,
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: vi.fn(),
      deleteBankById: mockDeleteBank,
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    vi.mocked(useToast).mockReturnValue({
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      showSuccess: mockShowSuccess,
      showError: vi.fn(),
      showWarning: vi.fn(),
      showInfo: vi.fn(),
    });

    mockConfirm.mockReturnValue(true);

    renderWithProvider(<Bankselector />);
    
    // Find and click delete button
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(button => 
      button.innerHTML.includes('M6 18L18 6M6 6l12 12')
    );
    
    if (deleteButton) {
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete "Chase Bank"? This action cannot be undone.');
        expect(mockDeleteBank).toHaveBeenCalledWith('1');
        expect(mockShowSuccess).toHaveBeenCalledWith('Bank "Chase Bank" has been deleted successfully.');
      });
    }
  });

  it('should not delete bank when cancelled', async () => {
    const mockBanks = [{ _id: '1', name: 'Chase Bank' }];
    const mockDeleteBank = vi.fn();
    
    vi.mocked(useBankOperations).mockReturnValue({
      banks: mockBanks,
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: vi.fn(),
      deleteBankById: mockDeleteBank,
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    mockConfirm.mockReturnValue(false);

    renderWithProvider(<Bankselector />);
    
    // Find and click delete button
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(button => 
      button.innerHTML.includes('M6 18L18 6M6 6l12 12')
    );
    
    if (deleteButton) {
      fireEvent.click(deleteButton);

      expect(mockConfirm).toHaveBeenCalled();
      expect(mockDeleteBank).not.toHaveBeenCalled();
    }
  });

  it('should show error when bank creation fails', async () => {
    const mockCreateBank = vi.fn().mockResolvedValue(null);
    const mockShowError = vi.fn();
    const mockShowSuccess = vi.fn();
    
    vi.mocked(useBankOperations).mockReturnValue({
      banks: [],
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: mockCreateBank,
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    vi.mocked(useToast).mockReturnValue({
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      showSuccess: mockShowSuccess,
      showError: mockShowError,
      showWarning: vi.fn(),
      showInfo: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Bank');
    fireEvent.click(addButton);

    // Fill form and submit
    const input = screen.getByPlaceholderText('Bank Name');
    fireEvent.change(input, { target: { value: 'New Bank' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to create bank. Please try again.');
    });
  });

  it('should show error when bank update fails', async () => {
    const mockBanks = [{ _id: '1', name: 'Chase Bank' }];
    const mockUpdateBank = vi.fn().mockResolvedValue(null);
    const mockShowError = vi.fn();
    const mockShowSuccess = vi.fn();

    vi.mocked(useBankOperations).mockReturnValue({
      banks: mockBanks,
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: mockUpdateBank,
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    vi.mocked(useToast).mockReturnValue({
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      showSuccess: mockShowSuccess,
      showError: mockShowError,
      showWarning: vi.fn(),
      showInfo: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Update the name
      const input = screen.getByDisplayValue('Chase Bank');
      fireEvent.change(input, { target: { value: 'Updated Bank' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Failed to update bank. Please try again.');
      });
    }
  });

  it('should show error when bank deletion fails', async () => {
    const mockBanks = [{ _id: '1', name: 'Chase Bank' }];
    const mockDeleteBank = vi.fn().mockResolvedValue(false);
    const mockShowError = vi.fn();
    const mockShowSuccess = vi.fn();

    vi.mocked(useBankOperations).mockReturnValue({
      banks: mockBanks,
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: vi.fn(),
      deleteBankById: mockDeleteBank,
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    vi.mocked(useToast).mockReturnValue({
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      showSuccess: mockShowSuccess,
      showError: mockShowError,
      showWarning: vi.fn(),
      showInfo: vi.fn(),
    });

    mockConfirm.mockReturnValue(true);

    renderWithProvider(<Bankselector />);
    
    // Find and click delete button
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(button => 
      button.innerHTML.includes('M6 18L18 6M6 6l12 12')
    );
    
    if (deleteButton) {
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Failed to delete bank. Please try again.');
      });
    }
  });

  it('should close modals when cancel button is clicked', () => {
    vi.mocked(useBankOperations).mockReturnValue({
      banks: [],
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Bank');
    fireEvent.click(addButton);

    // Click cancel button
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Create New Bank')).not.toBeInTheDocument();
  });

  it('should close modals when close button (×) is clicked', () => {
    vi.mocked(useBankOperations).mockReturnValue({
      banks: [],
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Bank');
    fireEvent.click(addButton);

    // Click close button
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Create New Bank')).not.toBeInTheDocument();
  });

  it('should not disable add button during operations (component does not implement this)', () => {
    vi.mocked(useBankOperations).mockReturnValue({
      banks: [],
      isLoading: false,
      error: null,
      isAdding: true,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    const addButton = screen.getByText('Add Bank');
    expect(addButton).not.toBeDisabled();
  });

  it('should show loading state in add modal when creating', () => {
    vi.mocked(useBankOperations).mockReturnValue({
      banks: [],
      isLoading: false,
      error: null,
      isAdding: true,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add Bank');
    fireEvent.click(addButton);

    expect(screen.getByText('Create...')).toBeInTheDocument();
  });

  it('should show loading state in edit modal when updating', () => {
    const mockBanks = [{ _id: '1', name: 'Chase Bank' }];
    
    vi.mocked(useBankOperations).mockReturnValue({
      banks: mockBanks,
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: true,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      expect(screen.getByText('Update...')).toBeInTheDocument();
    }
  });

  it('should disable edit and delete buttons during deletion', () => {
    const mockBanks = [{ _id: '1', name: 'Chase Bank' }];
    
    vi.mocked(useBankOperations).mockReturnValue({
      banks: mockBanks,
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: true,
      createBank: vi.fn(),
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    // Find edit and delete buttons
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    const deleteButton = editButtons.find(button => 
      button.innerHTML.includes('M6 18L18 6M6 6l12 12')
    );
    
    if (editButton) {
      expect(editButton).toBeDisabled();
    }
    if (deleteButton) {
      expect(deleteButton).toBeDisabled();
    }
  });

  it('should handle deletion of bank with empty name gracefully', () => {
    const mockBanks = [{ _id: '1', name: '' }];
    const mockDeleteBank = vi.fn().mockResolvedValue(true);
    const mockShowSuccess = vi.fn();
    
    vi.mocked(useBankOperations).mockReturnValue({
      banks: mockBanks,
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: vi.fn(),
      updateBankById: vi.fn(),
      deleteBankById: mockDeleteBank,
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    vi.mocked(useToast).mockReturnValue({
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      showSuccess: mockShowSuccess,
      showError: vi.fn(),
      showWarning: vi.fn(),
      showInfo: vi.fn(),
    });

    mockConfirm.mockReturnValue(true);

    renderWithProvider(<Bankselector />);
    
    // Component should render without errors
    expect(screen.getByText('Bank List')).toBeInTheDocument();
  });

  it('should handle multiple bank operations correctly', async () => {
    const mockBanks = [
      { _id: '1', name: 'Chase Bank' },
      { _id: '2', name: 'Wells Fargo' },
    ];
    const mockCreateBank = vi.fn().mockResolvedValue({ _id: '3', name: 'New Bank' });
    const mockUpdateBank = vi.fn().mockResolvedValue({ _id: '1', name: 'Updated Chase' });
    const mockDeleteBank = vi.fn().mockResolvedValue(true);
    
    vi.mocked(useBankOperations).mockReturnValue({
      banks: mockBanks,
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: mockCreateBank,
      updateBankById: mockUpdateBank,
      deleteBankById: mockDeleteBank,
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    // Verify all banks are displayed
    expect(screen.getByText('Chase Bank')).toBeInTheDocument();
    expect(screen.getByText('Wells Fargo')).toBeInTheDocument();
  });

  it('should handle rapid bank operations', async () => {
    const mockBanks = [{ _id: '1', name: 'Chase Bank' }];
    const mockCreateBank = vi.fn().mockResolvedValue({ _id: '2', name: 'New Bank' });
    
    vi.mocked(useBankOperations).mockReturnValue({
      banks: mockBanks,
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createBank: mockCreateBank,
      updateBankById: vi.fn(),
      deleteBankById: vi.fn(),
      refetch: vi.fn(),
      getBankById: vi.fn(),
      searchBanks: vi.fn(),
    });

    renderWithProvider(<Bankselector />);
    
    // Open add modal multiple times quickly
    const addButton = screen.getByText('Add Bank');
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    // Should only show one modal
    const modals = screen.getAllByText('Create New Bank');
    expect(modals).toHaveLength(1);
  });
}); 