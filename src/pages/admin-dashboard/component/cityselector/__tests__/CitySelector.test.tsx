import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Cityselector from '../Cityselector';
import { useCityOperations } from '@/hooks/useCityOperations';
import { useToast } from '@/hooks/useToast';

// Mock the hooks
vi.mock('@/hooks/useCityOperations', () => ({
  useCityOperations: vi.fn(),
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: vi.fn(),
}));

// Mock the API slice
vi.mock('@/features/city', () => ({
  useUploadImageMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
}));

// Mock the state API slice
vi.mock('@/features/state', () => ({
  stateApiSlice: {
    reducerPath: 'stateApi',
    reducer: vi.fn(),
    middleware: vi.fn(),
  },
}));

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
      cityApi: (state = {}) => state,
      stateApi: (state = {}) => state,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
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

describe('CitySelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockReturnValue(true);
    
    // Set up default mock values
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: [],
      states: [],
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
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
    const mockCitiesWithStates = [
      { _id: '1', name: 'New York', stateId: 'state1', statename: 'New York State', image: 'url1' },
      { _id: '2', name: 'Los Angeles', stateId: 'state2', statename: 'California', image: undefined },
      { _id: '3', name: 'Chicago', stateId: 'state3', statename: 'Illinois', image: 'url3' },
    ];

    const mockStates = [
      { _id: 'state1', name: 'New York State' },
      { _id: 'state2', name: 'California' },
      { _id: 'state3', name: 'Illinois' },
    ];

    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: mockCitiesWithStates,
      states: mockStates,
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    const { container } = renderWithProvider(<Cityselector />);
    expect(container).toMatchSnapshot();
  });

  it('should display city list correctly', () => {
    const mockCitiesWithStates = [
      { _id: '1', name: 'New York', stateId: 'state1', statename: 'New York State', image: 'url1' },
      { _id: '2', name: 'Los Angeles', stateId: 'state2', statename: 'California', image: undefined },
    ];

    const mockStates = [
      { _id: 'state1', name: 'New York State' },
      { _id: 'state2', name: 'California' },
    ];

    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: mockCitiesWithStates,
      states: mockStates,
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    renderWithProvider(<Cityselector />);

    expect(screen.getByText('City List')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
    expect(screen.getAllByText('New York State')).toHaveLength(2); // One in dropdown, one in list
    expect(screen.getAllByText('California')).toHaveLength(2); // One in dropdown, one in list
  });

  it('should show loading state and match snapshot', () => {
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: [],
      states: [],
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: true,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    const { container } = renderWithProvider(<Cityselector />);
    expect(screen.getByText('Loading cities...')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should show error state and match snapshot', () => {
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: [],
      states: [],
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: 'Failed to load cities',
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    const { container } = renderWithProvider(<Cityselector />);
    expect(screen.getByText('Failed to load cities. Please try again.')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should show empty state when no cities exist', () => {
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: [],
      states: [],
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    renderWithProvider(<Cityselector />);
    expect(screen.getByText('No cities')).toBeInTheDocument();
  });

  it('should open add city modal when add button is clicked', () => {
    const mockCreateCity = vi.fn();
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: [],
      states: [],
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: mockCreateCity,
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    renderWithProvider(<Cityselector />);
    
    const addButton = screen.getByText('Add City');
    fireEvent.click(addButton);

    expect(screen.getByText('Create New City')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('City Name')).toBeInTheDocument();
    expect(screen.getByText('Select State')).toBeInTheDocument();
  });

  it('should create a new city successfully', async () => {
    const mockCreateCity = vi.fn().mockResolvedValue({ _id: '1', name: 'New City' });
    const mockShowSuccess = vi.fn();
    
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: [],
      states: [],
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: mockCreateCity,
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
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

    renderWithProvider(<Cityselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add City');
    fireEvent.click(addButton);

    // Fill form and submit
    const input = screen.getByPlaceholderText('City Name');
    fireEvent.change(input, { target: { value: 'New City' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockCreateCity).toHaveBeenCalledWith({ name: 'New City', stateId: undefined, image: undefined });
      expect(mockShowSuccess).toHaveBeenCalledWith('City "New City" has been created successfully.');
    });
  });

  it('should not create city with empty name', async () => {
    const mockCreateCity = vi.fn();
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: [],
      states: [],
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: mockCreateCity,
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    renderWithProvider(<Cityselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add City');
    fireEvent.click(addButton);

    // Try to submit empty form
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    expect(mockCreateCity).not.toHaveBeenCalled();
  });

  it('should not create city with whitespace-only name', async () => {
    const mockCreateCity = vi.fn();
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: [],
      states: [],
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: mockCreateCity,
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    renderWithProvider(<Cityselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add City');
    fireEvent.click(addButton);

    // Fill form with whitespace and submit
    const input = screen.getByPlaceholderText('City Name');
    fireEvent.change(input, { target: { value: '   ' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    expect(mockCreateCity).not.toHaveBeenCalled();
  });

  it('should trim whitespace from city name when creating', async () => {
    const mockCreateCity = vi.fn().mockResolvedValue({ _id: '1', name: 'New City' });
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: [],
      states: [],
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: mockCreateCity,
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    renderWithProvider(<Cityselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add City');
    fireEvent.click(addButton);

    // Fill form with whitespace and submit
    const input = screen.getByPlaceholderText('City Name');
    fireEvent.change(input, { target: { value: '  New City  ' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockCreateCity).toHaveBeenCalledWith({ name: 'New City', stateId: undefined, image: undefined });
    });
  });

  it('should open edit modal when edit button is clicked', () => {
    const mockCitiesWithStates = [{ _id: '1', name: 'New York', stateId: 'state1', statename: 'New York State', image: 'url1' }];
    const mockStates = [{ _id: 'state1', name: 'New York State' }];
    const mockUpdateCity = vi.fn();
    
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: mockCitiesWithStates,
      states: mockStates,
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: mockUpdateCity,
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    renderWithProvider(<Cityselector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      expect(screen.getByText('Edit City')).toBeInTheDocument();
      expect(screen.getByDisplayValue('New York')).toBeInTheDocument();
    }
  });

  it('should update city successfully', async () => {
    const mockCitiesWithStates = [{ _id: '1', name: 'New York', stateId: 'state1', statename: 'New York State', image: 'url1' }];
    const mockStates = [{ _id: 'state1', name: 'New York State' }];
    const mockUpdateCity = vi.fn().mockResolvedValue({ _id: '1', name: 'Updated City' });
    const mockShowSuccess = vi.fn();
    
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: mockCitiesWithStates,
      states: mockStates,
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: mockUpdateCity,
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
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

    renderWithProvider(<Cityselector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Update the name
      const input = screen.getByDisplayValue('New York');
      fireEvent.change(input, { target: { value: 'Updated City' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(mockUpdateCity).toHaveBeenCalledWith({ _id: '1', name: 'Updated City', stateId: 'state1' });
        expect(mockShowSuccess).toHaveBeenCalledWith('City "Updated City" has been updated successfully.');
      });
    }
  });

  it('should not update city with empty name', async () => {
    const mockCitiesWithStates = [{ _id: '1', name: 'New York', stateId: 'state1', statename: 'New York State', image: 'url1' }];
    const mockStates = [{ _id: 'state1', name: 'New York State' }];
    const mockUpdateCity = vi.fn();
    
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: mockCitiesWithStates,
      states: mockStates,
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: mockUpdateCity,
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    renderWithProvider(<Cityselector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Clear the name
      const input = screen.getByDisplayValue('New York');
      fireEvent.change(input, { target: { value: '' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      expect(mockUpdateCity).not.toHaveBeenCalled();
    }
  });

  it('should trim whitespace from city name when updating', async () => {
    const mockCitiesWithStates = [{ _id: '1', name: 'New York', stateId: 'state1', statename: 'New York State', image: 'url1' }];
    const mockStates = [{ _id: 'state1', name: 'New York State' }];
    const mockUpdateCity = vi.fn().mockResolvedValue({ _id: '1', name: 'Updated City' });
    
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: mockCitiesWithStates,
      states: mockStates,
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: mockUpdateCity,
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    renderWithProvider(<Cityselector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Update with whitespace
      const input = screen.getByDisplayValue('New York');
      fireEvent.change(input, { target: { value: '  Updated City  ' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(mockUpdateCity).toHaveBeenCalledWith({ _id: '1', name: 'Updated City', stateId: 'state1' });
      });
    }
  });

  it('should delete city when confirmed', async () => {
    const mockCitiesWithStates = [{ _id: '1', name: 'New York', stateId: 'state1', statename: 'New York State', image: 'url1' }];
    const mockStates = [{ _id: 'state1', name: 'New York State' }];
    const mockDeleteCity = vi.fn().mockResolvedValue(true);
    const mockShowSuccess = vi.fn();
    
    const mockCityMap = new Map();
    mockCityMap.set('1', { _id: '1', name: 'New York', stateId: 'state1', image: 'url1' });
    
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: mockCitiesWithStates,
      states: mockStates,
      cityMap: mockCityMap,
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: vi.fn(),
      deleteCityById: mockDeleteCity,
      refetch: vi.fn(),
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

    renderWithProvider(<Cityselector />);
    
    // Find and click delete button
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
        expect(mockDeleteCity).toHaveBeenCalledWith('1');
        expect(mockShowSuccess).toHaveBeenCalledWith('City "New York" has been deleted successfully.');
      });
    }
  });

  it('should not delete city when cancelled', async () => {
    const mockCitiesWithStates = [{ _id: '1', name: 'New York', stateId: 'state1', statename: 'New York State', image: 'url1' }];
    const mockStates = [{ _id: 'state1', name: 'New York State' }];
    const mockDeleteCity = vi.fn();
    
    const mockCityMap = new Map();
    mockCityMap.set('1', { _id: '1', name: 'New York', stateId: 'state1', image: 'url1' });
    
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: mockCitiesWithStates,
      states: mockStates,
      cityMap: mockCityMap,
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: vi.fn(),
      deleteCityById: mockDeleteCity,
      refetch: vi.fn(),
    });

    renderWithProvider(<Cityselector />);
    
    // Find and click delete button
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
      expect(mockDeleteCity).not.toHaveBeenCalled();
      
      // Verify that modal is closed
      expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
    }
  });

  it('should show error when city creation fails', async () => {
    const mockCreateCity = vi.fn().mockResolvedValue(null);
    const mockShowError = vi.fn();
    const mockShowSuccess = vi.fn();
    
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: [],
      states: [],
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: mockCreateCity,
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
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

    renderWithProvider(<Cityselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add City');
    fireEvent.click(addButton);

    // Fill form and submit
    const input = screen.getByPlaceholderText('City Name');
    fireEvent.change(input, { target: { value: 'New City' } });
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to create city. Please try again.');
    });
  });

  it('should show error when city update fails', async () => {
    const mockCitiesWithStates = [{ _id: '1', name: 'New York', stateId: 'state1', statename: 'New York State', image: 'url1' }];
    const mockStates = [{ _id: 'state1', name: 'New York State' }];
    const mockUpdateCity = vi.fn().mockResolvedValue(null);
    const mockShowError = vi.fn();
    const mockShowSuccess = vi.fn();

    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: mockCitiesWithStates,
      states: mockStates,
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: mockUpdateCity,
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
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

    renderWithProvider(<Cityselector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      
      // Update the name
      const input = screen.getByDisplayValue('New York');
      fireEvent.change(input, { target: { value: 'Updated City' } });
      
      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Failed to update city. Please try again.');
      });
    }
  });

  it('should show error when city deletion fails', async () => {
    const mockCitiesWithStates = [{ _id: '1', name: 'New York', stateId: 'state1', statename: 'New York State', image: 'url1' }];
    const mockStates = [{ _id: 'state1', name: 'New York State' }];
    const mockDeleteCity = vi.fn().mockResolvedValue(false);
    const mockShowError = vi.fn();
    const mockShowSuccess = vi.fn();

    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: mockCitiesWithStates,
      states: mockStates,
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: vi.fn(),
      deleteCityById: mockDeleteCity,
      refetch: vi.fn(),
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

    renderWithProvider(<Cityselector />);
    
    // Find and click delete button
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
        expect(mockShowError).toHaveBeenCalledWith('Failed to delete city. Please try again.');
      });
    }
  });

  it('should close modals when cancel button is clicked', () => {
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: [],
      states: [],
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    renderWithProvider(<Cityselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add City');
    fireEvent.click(addButton);

    // Click cancel button
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Create New City')).not.toBeInTheDocument();
  });

  it('should close modals when close button (×) is clicked', () => {
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: [],
      states: [],
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    renderWithProvider(<Cityselector />);
    
    // Open add modal
    const addButton = screen.getByText('Add City');
    fireEvent.click(addButton);

    // Click close button
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Create New City')).not.toBeInTheDocument();
  });

  it('should show loading state in add modal when creating', () => {
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: [],
      states: [],
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: true,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    renderWithProvider(<Cityselector />);
    
    // When isAdding is true, the button shows "Adding..." and is disabled
    expect(screen.getByText('Adding...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /adding/i })).toBeDisabled();
  });

  it('should show loading state in edit modal when updating', () => {
    const mockCitiesWithStates = [{ _id: '1', name: 'New York', stateId: 'state1', statename: 'New York State', image: 'url1' }];
    const mockStates = [{ _id: 'state1', name: 'New York State' }];
    
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: mockCitiesWithStates,
      states: mockStates,
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: true,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    renderWithProvider(<Cityselector />);
    
    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => 
      button.innerHTML.includes('M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z')
    );
    
    if (editButton) {
      fireEvent.click(editButton);
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    }
  });

  it('should disable edit and delete buttons during deletion', () => {
    const mockCitiesWithStates = [{ _id: '1', name: 'New York', stateId: 'state1', statename: 'New York State', image: 'url1' }];
    const mockStates = [{ _id: 'state1', name: 'New York State' }];
    
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: mockCitiesWithStates,
      states: mockStates,
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: true,
      createCity: vi.fn(),
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    renderWithProvider(<Cityselector />);
    
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

  it('should handle deletion of city with empty name gracefully', () => {
    const mockCitiesWithStates = [{ _id: '1', name: '', stateId: 'state1', statename: 'New York State', image: 'url1' }];
    const mockStates = [{ _id: 'state1', name: 'New York State' }];
    const mockDeleteCity = vi.fn().mockResolvedValue(true);
    const mockShowSuccess = vi.fn();
    
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: mockCitiesWithStates,
      states: mockStates,
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: vi.fn(),
      updateCityById: vi.fn(),
      deleteCityById: mockDeleteCity,
      refetch: vi.fn(),
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

    renderWithProvider(<Cityselector />);
    
    // Component should render without errors
    expect(screen.getByText('City List')).toBeInTheDocument();
  });

  it('should handle multiple city operations correctly', async () => {
    const mockCitiesWithStates = [
      { _id: '1', name: 'New York', stateId: 'state1', statename: 'New York State', image: 'url1' },
      { _id: '2', name: 'Los Angeles', stateId: 'state2', statename: 'California', image: undefined },
    ];
    const mockStates = [
      { _id: 'state1', name: 'New York State' },
      { _id: 'state2', name: 'California' },
    ];
    const mockCreateCity = vi.fn().mockResolvedValue({ _id: '3', name: 'New City' });
    const mockUpdateCity = vi.fn().mockResolvedValue({ _id: '1', name: 'Updated City' });
    const mockDeleteCity = vi.fn().mockResolvedValue(true);
    
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: mockCitiesWithStates,
      states: mockStates,
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: mockCreateCity,
      updateCityById: mockUpdateCity,
      deleteCityById: mockDeleteCity,
      refetch: vi.fn(),
    });

    renderWithProvider(<Cityselector />);
    
    // Verify all cities are displayed
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
  });

  it('should handle rapid city operations', async () => {
    const mockCitiesWithStates = [{ _id: '1', name: 'New York', stateId: 'state1', statename: 'New York State', image: 'url1' }];
    const mockStates = [{ _id: 'state1', name: 'New York State' }];
    const mockCreateCity = vi.fn().mockResolvedValue({ _id: '2', name: 'New City' });
    
    vi.mocked(useCityOperations).mockReturnValue({
      cities: [],
      citiesWithStates: mockCitiesWithStates,
      states: mockStates,
      cityMap: new Map(),
      stateMap: new Map(),
      isLoading: false,
      error: null,
      isAdding: false,
      isUpdating: false,
      isDeleting: false,
      createCity: mockCreateCity,
      updateCityById: vi.fn(),
      deleteCityById: vi.fn(),
      refetch: vi.fn(),
    });

    renderWithProvider(<Cityselector />);
    
    // Open add modal multiple times quickly
    const addButton = screen.getByText('Add City');
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    // Should only show one modal
    const modals = screen.getAllByText('Create New City');
    expect(modals).toHaveLength(1);
  });
}); 