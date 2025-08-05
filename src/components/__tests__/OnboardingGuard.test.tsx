import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import OnboardingGuard from '../OnboardingGuard';
import authReducer from '@/features/auth';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        userId: null,
        roles: [],
        onboardingComplete: false,
        ...initialState,
      },
    },
  });
};

const renderWithProviders = (component: React.ReactElement, initialState = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('OnboardingGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should redirect to onboarding when user is authenticated but onboarding is not complete', () => {
    renderWithProviders(
      <OnboardingGuard>
        <div>Protected Content</div>
      </OnboardingGuard>,
      {
        user: 'testuser',
        token: 'testtoken',
        userId: '123',
        roles: ['user'],
        onboardingComplete: false,
      }
    );

    expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
  });

  it('should render children when user is authenticated and onboarding is complete', () => {
    renderWithProviders(
      <OnboardingGuard>
        <div>Protected Content</div>
      </OnboardingGuard>,
      {
        user: 'testuser',
        token: 'testtoken',
        userId: '123',
        roles: ['user'],
        onboardingComplete: true,
      }
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should render children when onboarding is complete in localStorage', () => {
    localStorageMock.getItem.mockReturnValue('true');
    
    renderWithProviders(
      <OnboardingGuard>
        <div>Protected Content</div>
      </OnboardingGuard>,
      {
        user: 'testuser',
        token: 'testtoken',
        userId: '123',
        roles: ['user'],
        onboardingComplete: false,
      }
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should not render anything when user is not authenticated', () => {
    renderWithProviders(
      <OnboardingGuard>
        <div>Protected Content</div>
      </OnboardingGuard>,
      {
        user: null,
        token: null,
        userId: null,
        roles: [],
        onboardingComplete: false,
      }
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
}); 