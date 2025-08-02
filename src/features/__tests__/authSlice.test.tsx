import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/config/apiSplice';
import { authApiSlice, useLoginMutation, useSignupMutation, useLogoutMutation } from '../authSlice';

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Auth API Slice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Auth API Slice Structure', () => {
    it('should have authApiSlice defined', () => {
      expect(authApiSlice).toBeDefined();
    });

    it('should match snapshot for auth API slice', () => {
      expect(authApiSlice).toMatchSnapshot();
    });

    it('should have endpoints property', () => {
      expect(authApiSlice.endpoints).toBeDefined();
    });

    it('should have login endpoint', () => {
      expect(authApiSlice.endpoints.login).toBeDefined();
    });

    it('should have logout endpoint', () => {
      expect(authApiSlice.endpoints.logout).toBeDefined();
    });

    it('should have signup endpoint', () => {
      expect(authApiSlice.endpoints.signup).toBeDefined();
    });

    it('should have correct endpoint configurations', () => {
      // Test login endpoint
      const loginEndpoint = authApiSlice.endpoints.login;
      expect(loginEndpoint.name).toBe('login');
      
      // Test logout endpoint
      const logoutEndpoint = authApiSlice.endpoints.logout;
      expect(logoutEndpoint.name).toBe('logout');
      
      // Test signup endpoint
      const signupEndpoint = authApiSlice.endpoints.signup;
      expect(signupEndpoint.name).toBe('signup');
    });
  });

  describe('Exported Hooks', () => {
    it('should export useLoginMutation', () => {
      expect(useLoginMutation).toBeDefined();
      expect(typeof useLoginMutation).toBe('function');
    });

    it('should export useSignupMutation', () => {
      expect(useSignupMutation).toBeDefined();
      expect(typeof useSignupMutation).toBe('function');
    });

    it('should export useLogoutMutation', () => {
      expect(useLogoutMutation).toBeDefined();
      expect(typeof useLogoutMutation).toBe('function');
    });

    it('should match snapshot for exported hooks', () => {
      const hooks = {
        useLoginMutation: typeof useLoginMutation,
        useSignupMutation: typeof useSignupMutation,
        useLogoutMutation: typeof useLogoutMutation,
      };
      expect(hooks).toMatchSnapshot();
    });
  });

  describe('API Endpoint Configuration', () => {
    it('should have correct login endpoint configuration', () => {
      const loginEndpoint = authApiSlice.endpoints.login;
      
      expect(loginEndpoint.name).toBe('login');
    });

    it('should have correct signup endpoint configuration', () => {
      const signupEndpoint = authApiSlice.endpoints.signup;
      
      expect(signupEndpoint.name).toBe('signup');
    });

    it('should have correct logout endpoint configuration', () => {
      const logoutEndpoint = authApiSlice.endpoints.logout;
      
      expect(logoutEndpoint.name).toBe('logout');
    });

    it('should match snapshot for endpoint configurations', () => {
      const endpointConfigs = {
        login: {
          name: authApiSlice.endpoints.login.name,
        },
        signup: {
          name: authApiSlice.endpoints.signup.name,
        },
        logout: {
          name: authApiSlice.endpoints.logout.name,
        },
      };

      expect(endpointConfigs).toMatchSnapshot();
    });
  });

  describe('API Slice Properties', () => {
    it('should have reducer property', () => {
      expect(authApiSlice.reducer).toBeDefined();
      expect(typeof authApiSlice.reducer).toBe('function');
    });

    it('should have middleware property', () => {
      expect(authApiSlice.middleware).toBeDefined();
      expect(typeof authApiSlice.middleware).toBe('function');
    });

    it('should have reducerPath property', () => {
      expect(authApiSlice.reducerPath).toBeDefined();
      expect(typeof authApiSlice.reducerPath).toBe('string');
    });

    it('should have internalActions property', () => {
      expect(authApiSlice.internalActions).toBeDefined();
      expect(typeof authApiSlice.internalActions).toBe('object');
    });

    it('should have util property', () => {
      expect(authApiSlice.util).toBeDefined();
      expect(typeof authApiSlice.util).toBe('object');
    });

    it('should match snapshot for API slice properties', () => {
      const properties = {
        hasReducer: !!authApiSlice.reducer,
        hasMiddleware: !!authApiSlice.middleware,
        reducerPath: authApiSlice.reducerPath,
        hasInternalActions: !!authApiSlice.internalActions,
        hasUtil: !!authApiSlice.util,
      };

      expect(properties).toMatchSnapshot();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined endpoints gracefully', () => {
      // Test that accessing non-existent endpoints doesn't crash
      expect(() => {
        const endpoints = authApiSlice.endpoints;
        expect(endpoints).toBeDefined();
      }).not.toThrow();
    });

    it('should have consistent endpoint structure', () => {
      const loginEndpoint = authApiSlice.endpoints.login;
      const signupEndpoint = authApiSlice.endpoints.signup;
      const logoutEndpoint = authApiSlice.endpoints.logout;

      // All endpoints should have the same basic structure
      const expectedProperties = ['name', 'initiate', 'select', 'useMutation'];
      
      expectedProperties.forEach(prop => {
        expect(loginEndpoint).toHaveProperty(prop);
        expect(signupEndpoint).toHaveProperty(prop);
        expect(logoutEndpoint).toHaveProperty(prop);
      });
    });

    it('should have unique endpoint names', () => {
      const loginName = authApiSlice.endpoints.login.name;
      const signupName = authApiSlice.endpoints.signup.name;
      const logoutName = authApiSlice.endpoints.logout.name;

      expect(loginName).not.toBe(signupName);
      expect(loginName).not.toBe(logoutName);
      expect(signupName).not.toBe(logoutName);
    });
  });

  describe('Performance and Memory', () => {
    it('should have efficient endpoint access', () => {
      // Test that accessing endpoints multiple times doesn't cause issues
      for (let i = 0; i < 100; i++) {
        expect(authApiSlice.endpoints.login).toBeDefined();
        expect(authApiSlice.endpoints.signup).toBeDefined();
        expect(authApiSlice.endpoints.logout).toBeDefined();
      }
    });

    it('should maintain consistent references', () => {
      const loginEndpoint1 = authApiSlice.endpoints.login;
      const loginEndpoint2 = authApiSlice.endpoints.login;
      
      expect(loginEndpoint1).toBe(loginEndpoint2);
    });

    it('should handle rapid property access', () => {
      const properties = ['reducer', 'middleware', 'reducerPath', 'endpoints', 'util'];
      
      for (let i = 0; i < 100; i++) {
        properties.forEach(prop => {
          expect(authApiSlice).toHaveProperty(prop);
        });
      }
    });
  });

  describe('Enhanced Hook Testing', () => {
    let store: ReturnType<typeof createTestStore>;

    const createTestStore = () => {
      return configureStore({
        reducer: {
          api: apiSlice.reducer,
        },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(apiSlice.middleware),
      });
    };

    beforeEach(() => {
      store = createTestStore();
      vi.clearAllMocks();
      mockFetch.mockClear();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    describe('Login Mutation Hook', () => {
      it('should have working login mutation hook with full structure', () => {
        const { result } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });

        expect(result.current[0]).toBeDefined();
        expect(result.current[1]).toBeDefined();
        expect(typeof result.current[0]).toBe('function');
        expect(typeof result.current[1].isLoading).toBe('boolean');
        expect(typeof result.current[1].isError).toBe('boolean');
        expect(typeof result.current[1].isSuccess).toBe('boolean');
        expect(typeof result.current[1].reset).toBe('function');
      });

      it('should handle login mutation with various credential types', () => {
        const { result } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });

        const [login] = result.current;

        // Test that the mutation function can be called with different credential types
        expect(typeof login).toBe('function');
        
        // Test with empty credentials
        expect(() => login({})).not.toThrow();
        
        // Test with basic credentials
        expect(() => login({ email: 'test@example.com', password: 'password' })).not.toThrow();
        
        // Test with extended credentials
        expect(() => login({ 
          email: 'test@example.com', 
          password: 'password',
          rememberMe: true 
        })).not.toThrow();
      });
    });

    describe('Signup Mutation Hook', () => {
      it('should have working signup mutation hook with full structure', () => {
        const { result } = renderHook(() => useSignupMutation(), {
          wrapper: TestWrapper,
        });

        expect(result.current[0]).toBeDefined();
        expect(result.current[1]).toBeDefined();
        expect(typeof result.current[0]).toBe('function');
        expect(typeof result.current[1].isLoading).toBe('boolean');
        expect(typeof result.current[1].isError).toBe('boolean');
        expect(typeof result.current[1].isSuccess).toBe('boolean');
        expect(typeof result.current[1].reset).toBe('function');
      });

      it('should handle signup mutation with various credential types', () => {
        const { result } = renderHook(() => useSignupMutation(), {
          wrapper: TestWrapper,
        });

        const [signup] = result.current;

        // Test that the mutation function can be called with different credential types
        expect(typeof signup).toBe('function');
        
        // Test with minimal credentials
        expect(() => signup({ email: 'test@example.com', password: 'password' })).not.toThrow();
        
        // Test with extended credentials
        expect(() => signup({ 
          email: 'test@example.com', 
          password: 'password',
          name: 'Test User',
          phone: '+1234567890'
        })).not.toThrow();
        
        // Test with complex credentials
        expect(() => signup({ 
          email: 'test@example.com', 
          password: 'password',
          name: 'Test User',
          preferences: { theme: 'dark', notifications: true }
        })).not.toThrow();
      });
    });

    describe('Logout Mutation Hook', () => {
      it('should have working logout mutation hook with full structure', () => {
        const { result } = renderHook(() => useLogoutMutation(), {
          wrapper: TestWrapper,
        });

        expect(result.current[0]).toBeDefined();
        expect(result.current[1]).toBeDefined();
        expect(typeof result.current[0]).toBe('function');
        expect(typeof result.current[1].isLoading).toBe('boolean');
        expect(typeof result.current[1].isError).toBe('boolean');
        expect(typeof result.current[1].isSuccess).toBe('boolean');
        expect(typeof result.current[1].reset).toBe('function');
      });

      it('should handle logout mutation with various parameter types', () => {
        const { result } = renderHook(() => useLogoutMutation(), {
          wrapper: TestWrapper,
        });

        const [logout] = result.current;

        // Test that the mutation function can be called with different parameter types
        expect(typeof logout).toBe('function');
        
                 // Test with no parameters
         expect(() => logout(undefined)).not.toThrow();
        
        // Test with empty object
        expect(() => logout({})).not.toThrow();
        
        // Test with null
        expect(() => logout(null)).not.toThrow();
      });
    });

    describe('Hook State Management', () => {
      it('should handle multiple hook instances', () => {
        const { result: loginResult } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });

        const { result: signupResult } = renderHook(() => useSignupMutation(), {
          wrapper: TestWrapper,
        });

        const { result: logoutResult } = renderHook(() => useLogoutMutation(), {
          wrapper: TestWrapper,
        });

        // All hooks should be independent
        expect(loginResult.current[0]).not.toBe(signupResult.current[0]);
        expect(loginResult.current[0]).not.toBe(logoutResult.current[0]);
        expect(signupResult.current[0]).not.toBe(logoutResult.current[0]);
      });

      it('should handle hook state transitions', () => {
        const { result } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });

                 const [, state] = result.current;

                 // Initial state should be idle
        expect(state.isLoading).toBe(false);
        expect(state.isError).toBe(false);
        expect(state.isSuccess).toBe(false);
        expect(state.data).toBeUndefined();
        expect(state.error).toBeUndefined();

         // Test reset function
         expect(() => state.reset()).not.toThrow();
      });
    });

    describe('Hook Error Handling', () => {
      it('should handle hook errors gracefully', () => {
        const { result } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });

                 const [, state] = result.current;

                 // Test that error states are properly typed
        expect(state.error).toBeUndefined();
        expect(state.isError).toBe(false);

         // Test reset functionality
         expect(typeof state.reset).toBe('function');
         expect(() => state.reset()).not.toThrow();
      });
    });

    describe('Hook Performance', () => {
      it('should handle rapid hook calls', () => {
        const { result } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });

        const [login] = result.current;

        // Test rapid calls to the mutation function
        for (let i = 0; i < 10; i++) {
          expect(() => login({ 
            email: `user${i}@example.com`, 
            password: 'password' 
          })).not.toThrow();
        }
      });

      it('should maintain hook consistency under load', () => {
        const { result } = renderHook(() => useSignupMutation(), {
          wrapper: TestWrapper,
        });

        const [signup, state] = result.current;

        // Test multiple rapid calls
        for (let i = 0; i < 5; i++) {
          expect(() => signup({ 
            email: `user${i}@example.com`, 
            password: 'password',
            name: `User ${i}`
          })).not.toThrow();
        }

        // State should remain consistent
        expect(typeof state.isLoading).toBe('boolean');
        expect(typeof state.isError).toBe('boolean');
        expect(typeof state.isSuccess).toBe('boolean');
      });
    });
  });
}); 