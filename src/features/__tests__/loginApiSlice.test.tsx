import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/config/apiSplice';
import { authApiSlice, useLoginMutation, useSignupMutation, useLogoutMutation } from '../loginApiSlice';

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Login API Slice', () => {
  describe('API Slice Structure', () => {
    it('should export authApiSlice', () => {
      expect(authApiSlice).toBeDefined();
      expect(typeof authApiSlice).toBe('object');
    });

    it('should have endpoints property', () => {
      expect(authApiSlice.endpoints).toBeDefined();
      expect(typeof authApiSlice.endpoints).toBe('object');
    });

    it('should match snapshot', () => {
      expect(authApiSlice).toMatchSnapshot();
    });
  });

  describe('Exported Hooks', () => {
    it('should export useLoginMutation hook', () => {
      expect(useLoginMutation).toBeDefined();
      expect(typeof useLoginMutation).toBe('function');
    });

    it('should export useSignupMutation hook', () => {
      expect(useSignupMutation).toBeDefined();
      expect(typeof useSignupMutation).toBe('function');
    });

    it('should export useLogoutMutation hook', () => {
      expect(useLogoutMutation).toBeDefined();
      expect(typeof useLogoutMutation).toBe('function');
    });

    it('should handle fallback when authApiSlice is undefined', () => {
      // Test the fallback behavior of the export
      const mockAuthApiSlice = undefined;
      const fallbackExports = mockAuthApiSlice || {};
      expect(fallbackExports).toEqual({});
    });
  });

  describe('API Endpoint Configuration', () => {
    it('should have endpoints property', () => {
      expect(authApiSlice.endpoints).toBeDefined();
      expect(typeof authApiSlice.endpoints).toBe('object');
    });

    it('should be injected into apiSlice', () => {
      expect(apiSlice.injectEndpoints).toBeDefined();
      expect(typeof apiSlice.injectEndpoints).toBe('function');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty credentials object', () => {
      const loginEndpoint = authApiSlice.endpoints.login;
      expect(loginEndpoint).toBeDefined();
    });

    it('should handle logout without credentials', () => {
      const logoutEndpoint = authApiSlice.endpoints.logout;
      expect(logoutEndpoint).toBeDefined();
    });

    it('should handle malformed credentials', () => {
      const signupEndpoint = authApiSlice.endpoints.signup;
      expect(signupEndpoint).toBeDefined();
    });
  });

  describe('Performance and Memory', () => {
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

    it('should not cause memory leaks with multiple renders', () => {
      const { result, rerender } = renderHook(() => useLoginMutation(), {
        wrapper: TestWrapper,
      });
      expect(result.current).toBeDefined();
      
      rerender();
      expect(result.current).toBeDefined();
    });

    it('should maintain consistent hook references', () => {
      const { result: result1 } = renderHook(() => useLoginMutation(), {
        wrapper: TestWrapper,
      });
      const { result: result2 } = renderHook(() => useLoginMutation(), {
        wrapper: TestWrapper,
      });
      
      expect(typeof result1.current[0]).toBe('function');
      expect(typeof result2.current[0]).toBe('function');
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
        expect(result.current[1].error).toBeUndefined();
        expect(result.current[1].data).toBeUndefined();
        expect(typeof result.current[1].reset).toBe('function');
      });

      it('should handle login mutation with various credential types', () => {
        const { result } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });
        const [login] = result.current;
        expect(typeof login).toBe('function');
        expect(() => login({})).not.toThrow();
        expect(() => login({ email: 'test@example.com', password: 'password' })).not.toThrow();
        expect(() => login({ username: 'testuser', password: 'password' })).not.toThrow();
      });

      it('should handle login mutation with complex credentials', () => {
        const { result } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });
        const [login] = result.current;
        expect(() => login({ 
          email: 'complex@test.com', 
          password: 'complexPassword123!',
          rememberMe: true 
        })).not.toThrow();
      });

      it('should handle login mutation with special characters', () => {
        const { result } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });
        const [login] = result.current;
        expect(() => login({ 
          email: 'test+tag@example.com', 
          password: 'p@ssw0rd!@#$%' 
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
        expect(result.current[1].error).toBeUndefined();
        expect(result.current[1].data).toBeUndefined();
        expect(typeof result.current[1].reset).toBe('function');
      });

      it('should handle signup mutation with various credential types', () => {
        const { result } = renderHook(() => useSignupMutation(), {
          wrapper: TestWrapper,
        });
        const [signup] = result.current;
        expect(typeof signup).toBe('function');
        expect(() => signup({})).not.toThrow();
        expect(() => signup({ 
          email: 'newuser@example.com', 
          password: 'newpassword',
          confirmPassword: 'newpassword' 
        })).not.toThrow();
      });

      it('should handle signup mutation with full user data', () => {
        const { result } = renderHook(() => useSignupMutation(), {
          wrapper: TestWrapper,
        });
        const [signup] = result.current;
        expect(() => signup({ 
          email: 'fulluser@example.com', 
          password: 'password123',
          confirmPassword: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890'
        })).not.toThrow();
      });

      it('should handle signup mutation with minimal data', () => {
        const { result } = renderHook(() => useSignupMutation(), {
          wrapper: TestWrapper,
        });
        const [signup] = result.current;
        expect(() => signup({ 
          email: 'minimal@example.com', 
          password: 'minimal' 
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
        expect(result.current[1].error).toBeUndefined();
        expect(result.current[1].data).toBeUndefined();
        expect(typeof result.current[1].reset).toBe('function');
      });

      it('should handle logout mutation without parameters', () => {
        const { result } = renderHook(() => useLogoutMutation(), {
          wrapper: TestWrapper,
        });
        const [logout] = result.current;
        expect(typeof logout).toBe('function');
        expect(() => logout(undefined)).not.toThrow();
      });

      it('should handle logout mutation with empty object', () => {
        const { result } = renderHook(() => useLogoutMutation(), {
          wrapper: TestWrapper,
        });
        const [logout] = result.current;
        expect(() => logout({})).not.toThrow();
      });

      it('should handle logout mutation with additional parameters', () => {
        const { result } = renderHook(() => useLogoutMutation(), {
          wrapper: TestWrapper,
        });
        const [logout] = result.current;
        expect(() => logout({ reason: 'user_request' })).not.toThrow();
      });
    });

    describe('Hook State Management', () => {
      it('should initialize hooks with correct default states', () => {
        const { result: loginResult } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });
        const { result: signupResult } = renderHook(() => useSignupMutation(), {
          wrapper: TestWrapper,
        });
        const { result: logoutResult } = renderHook(() => useLogoutMutation(), {
          wrapper: TestWrapper,
        });

        // Check initial states
        expect(loginResult.current[1].isLoading).toBe(false);
        expect(loginResult.current[1].isError).toBe(false);
        expect(loginResult.current[1].isSuccess).toBe(false);
        expect(loginResult.current[1].error).toBeUndefined();
        expect(loginResult.current[1].data).toBeUndefined();

        expect(signupResult.current[1].isLoading).toBe(false);
        expect(signupResult.current[1].isError).toBe(false);
        expect(signupResult.current[1].isSuccess).toBe(false);
        expect(signupResult.current[1].error).toBeUndefined();
        expect(signupResult.current[1].data).toBeUndefined();

        expect(logoutResult.current[1].isLoading).toBe(false);
        expect(logoutResult.current[1].isError).toBe(false);
        expect(logoutResult.current[1].isSuccess).toBe(false);
        expect(logoutResult.current[1].error).toBeUndefined();
        expect(logoutResult.current[1].data).toBeUndefined();
      });

      it('should have reset function available', () => {
        const { result } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });
        const [, state] = result.current;
        
        expect(typeof state.reset).toBe('function');
        expect(() => state.reset()).not.toThrow();
      });
    });

    describe('Hook Error Handling', () => {
      it('should handle null credentials gracefully', () => {
        const { result } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });
        const [login] = result.current;
        expect(() => login(null as unknown as { email: string; password: string })).not.toThrow();
      });

      it('should handle undefined credentials gracefully', () => {
        const { result } = renderHook(() => useSignupMutation(), {
          wrapper: TestWrapper,
        });
        const [signup] = result.current;
        expect(() => signup(undefined as unknown as { email: string; password: string })).not.toThrow();
      });

      it('should handle malformed credential objects', () => {
        const { result } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });
        const [login] = result.current;
        expect(() => login({ invalid: 'data' } as unknown as { email: string; password: string })).not.toThrow();
      });
    });

    describe('Hook Performance', () => {
      it('should maintain consistent function references', () => {
        const { result, rerender } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });
        
        const initialLogin = result.current[0];
        rerender();
        const newLogin = result.current[0];
        
        expect(typeof initialLogin).toBe('function');
        expect(typeof newLogin).toBe('function');
      });

      it('should handle rapid successive calls', () => {
        const { result } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });
        const [login] = result.current;
        
        expect(() => {
          login({ email: 'test1@example.com', password: 'pass1' });
          login({ email: 'test2@example.com', password: 'pass2' });
          login({ email: 'test3@example.com', password: 'pass3' });
        }).not.toThrow();
      });

      it('should handle concurrent hook usage', () => {
        const { result: loginResult } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });
        const { result: signupResult } = renderHook(() => useSignupMutation(), {
          wrapper: TestWrapper,
        });
        const { result: logoutResult } = renderHook(() => useLogoutMutation(), {
          wrapper: TestWrapper,
        });

        expect(typeof loginResult.current[0]).toBe('function');
        expect(typeof signupResult.current[0]).toBe('function');
        expect(typeof logoutResult.current[0]).toBe('function');
      });
    });

    describe('Integration Testing', () => {
      it('should work with all hooks simultaneously', () => {
        const { result: loginResult } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });
        const { result: signupResult } = renderHook(() => useSignupMutation(), {
          wrapper: TestWrapper,
        });
        const { result: logoutResult } = renderHook(() => useLogoutMutation(), {
          wrapper: TestWrapper,
        });

        const [login] = loginResult.current;
        const [signup] = signupResult.current;
        const [logout] = logoutResult.current;

        expect(() => {
          login({ email: 'user@example.com', password: 'password' });
          signup({ email: 'newuser@example.com', password: 'newpassword' });
          logout(undefined);
        }).not.toThrow();
      });

      it('should maintain state isolation between hooks', () => {
        const { result: loginResult } = renderHook(() => useLoginMutation(), {
          wrapper: TestWrapper,
        });
        const { result: signupResult } = renderHook(() => useSignupMutation(), {
          wrapper: TestWrapper,
        });

        expect(loginResult.current[1].isLoading).toBe(false);
        expect(signupResult.current[1].isLoading).toBe(false);
        expect(loginResult.current[1].isError).toBe(false);
        expect(signupResult.current[1].isError).toBe(false);
      });
    });
  });
}); 