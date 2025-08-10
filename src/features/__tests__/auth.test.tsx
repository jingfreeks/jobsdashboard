import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/config/apiSplice';
import authReducer, { 
  setCredentials, 
  setLogout, 
  rehydrateAuth,
  selectCurrentUser,
  selectCurrentUserId,
  selectCurrentToken,
  selectUserRoles,
  selectIsAuthenticated
} from '../auth';
import { authApiSlice } from '../authSlice';
import type { RootState } from '@/config/store';
// Mock console.warn to avoid noise in tests
const mockConsoleWarn = vi.fn();

describe('Auth Feature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(mockConsoleWarn);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Auth Slice', () => {
    let store: ReturnType<typeof createTestStore>;

    const createTestStore = () => {
      return configureStore({
        reducer: {
          auth: authReducer,
          api: apiSlice.reducer,
        },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(apiSlice.middleware),
      });
    };

    beforeEach(() => {
      store = createTestStore();
    });

    describe('Initial State', () => {
      it('should have correct initial state', () => {
        const state = store.getState();
        
        expect(state.auth).toEqual({
          user: null,
          token: null,
          userId: null,
          roles: [],
          onboardingComplete: false,
        });
      });

      it('should match snapshot for initial state', () => {
        const state = store.getState();
        expect(state.auth).toMatchSnapshot();
      });
    });

    describe('setCredentials Action', () => {
      it('should set credentials correctly with valid payload', () => {
        const credentials = {
          user: 'testuser@example.com',
          accessToken: 'valid-token-123',
          userId: 'user123',
          roles: ['user', 'admin'],
        };

        store.dispatch(setCredentials(credentials));

        const state = store.getState();
        expect(state.auth.user).toBe('testuser@example.com');
        expect(state.auth.token).toBe('valid-token-123');
        expect(state.auth.userId).toBe('user123');
        expect(state.auth.roles).toEqual(['user', 'admin']);
        expect(mockConsoleWarn).not.toHaveBeenCalled();
      });

      it('should handle empty roles array', () => {
        const credentials = {
          user: 'testuser@example.com',
          accessToken: 'valid-token-123',
          userId: 'user123',
          roles: [],
        };

        store.dispatch(setCredentials(credentials));

        const state = store.getState();
        expect(state.auth.roles).toEqual([]);
      });

      it('should handle non-array roles and convert to empty array', () => {
        const credentials = {
          user: 'testuser@example.com',
          accessToken: 'valid-token-123',
          userId: 'user123',
          roles: 'invalid-roles' as unknown as string[],
        };

        store.dispatch(setCredentials(credentials));

        const state = store.getState();
        expect(state.auth.roles).toEqual([]);
      });

      it('should handle missing user and log warning', () => {
        const credentials = {
          user: '',
          accessToken: 'valid-token-123',
          userId: 'user123',
          roles: ['user'],
        };

        store.dispatch(setCredentials(credentials));

        const state = store.getState();
        expect(state.auth.user).toBe(null);
        expect(state.auth.token).toBe(null);
        expect(state.auth.userId).toBe(null);
        expect(state.auth.roles).toEqual([]);
        expect(mockConsoleWarn).toHaveBeenCalledWith('Invalid credentials payload:', credentials);
      });

      it('should handle missing accessToken and log warning', () => {
        const credentials = {
          user: 'testuser@example.com',
          accessToken: '',
          userId: 'user123',
          roles: ['user'],
        };

        store.dispatch(setCredentials(credentials));

        const state = store.getState();
        expect(state.auth.user).toBe(null);
        expect(state.auth.token).toBe(null);
        expect(state.auth.userId).toBe(null);
        expect(state.auth.roles).toEqual([]);
        expect(mockConsoleWarn).toHaveBeenCalledWith('Invalid credentials payload:', credentials);
      });

      it('should handle missing userId and log warning', () => {
        const credentials = {
          user: 'testuser@example.com',
          accessToken: 'valid-token-123',
          userId: '',
          roles: ['user'],
        };

        store.dispatch(setCredentials(credentials));

        const state = store.getState();
        expect(state.auth.user).toBe(null);
        expect(state.auth.token).toBe(null);
        expect(state.auth.userId).toBe(null);
        expect(state.auth.roles).toEqual([]);
        expect(mockConsoleWarn).toHaveBeenCalledWith('Invalid credentials payload:', credentials);
      });

      it('should handle null values and log warning', () => {
        const credentials = {
          user: null as unknown as string,
          accessToken: 'valid-token-123',
          userId: 'user123',
          roles: ['user'],
        };

        store.dispatch(setCredentials(credentials));

        const state = store.getState();
        expect(state.auth.user).toBe(null);
        expect(state.auth.token).toBe(null);
        expect(state.auth.userId).toBe(null);
        expect(state.auth.roles).toEqual([]);
        expect(mockConsoleWarn).toHaveBeenCalledWith('Invalid credentials payload:', credentials);
      });

      it('should handle undefined values and log warning', () => {
        const credentials = {
          user: 'testuser@example.com',
          accessToken: undefined as unknown as string,
          userId: 'user123',
          roles: ['user'],
        };

        store.dispatch(setCredentials(credentials));

        const state = store.getState();
        expect(state.auth.user).toBe(null);
        expect(state.auth.token).toBe(null);
        expect(state.auth.userId).toBe(null);
        expect(state.auth.roles).toEqual([]);
        expect(mockConsoleWarn).toHaveBeenCalledWith('Invalid credentials payload:', credentials);
      });

      it('should match snapshot after setting credentials', () => {
        const credentials = {
          user: 'testuser@example.com',
          accessToken: 'valid-token-123',
          userId: 'user123',
          roles: ['user', 'admin'],
        };

        store.dispatch(setCredentials(credentials));
        const state = store.getState();
        expect(state.auth).toMatchSnapshot();
      });
    });

    describe('setLogout Action', () => {
      it('should clear all auth state', () => {
        // First set some credentials
        const credentials = {
          user: 'testuser@example.com',
          accessToken: 'valid-token-123',
          userId: 'user123',
          roles: ['user', 'admin'],
        };
        store.dispatch(setCredentials(credentials));

        // Then logout
        store.dispatch(setLogout());

        const state = store.getState();
        expect(state.auth.user).toBe(null);
        expect(state.auth.token).toBe(null);
        expect(state.auth.userId).toBe(null);
        expect(state.auth.roles).toEqual([]);
      });

      it('should match snapshot after logout', () => {
        // First set some credentials
        const credentials = {
          user: 'testuser@example.com',
          accessToken: 'valid-token-123',
          userId: 'user123',
          roles: ['user', 'admin'],
        };
        store.dispatch(setCredentials(credentials));

        // Then logout
        store.dispatch(setLogout());
        const state = store.getState();
        expect(state.auth).toMatchSnapshot();
      });

      it('should handle logout when already logged out', () => {
        store.dispatch(setLogout());

        const state = store.getState();
        expect(state.auth.user).toBe(null);
        expect(state.auth.token).toBe(null);
        expect(state.auth.userId).toBe(null);
        expect(state.auth.roles).toEqual([]);
      });
    });

    describe('rehydrateAuth Action', () => {
      it('should rehydrate with partial state', () => {
        const rehydrateData = {
          user: 'testuser@example.com',
          token: 'valid-token-123',
          userId: 'user123',
          roles: ['user'],
        };

        store.dispatch(rehydrateAuth(rehydrateData));

        const state = store.getState();
        expect(state.auth.user).toBe('testuser@example.com');
        expect(state.auth.token).toBe('valid-token-123');
        expect(state.auth.userId).toBe('user123');
        expect(state.auth.roles).toEqual(['user']);
      });

      it('should handle partial rehydration with only user', () => {
        const rehydrateData = {
          user: 'testuser@example.com',
        };

        store.dispatch(rehydrateAuth(rehydrateData));

        const state = store.getState();
        expect(state.auth.user).toBe('testuser@example.com');
        expect(state.auth.token).toBe(null);
        expect(state.auth.userId).toBe(null);
        expect(state.auth.roles).toEqual([]);
      });

      it('should handle partial rehydration with only token', () => {
        const rehydrateData = {
          token: 'valid-token-123',
        };

        store.dispatch(rehydrateAuth(rehydrateData));

        const state = store.getState();
        expect(state.auth.user).toBe(null);
        expect(state.auth.token).toBe('valid-token-123');
        expect(state.auth.userId).toBe(null);
        expect(state.auth.roles).toEqual([]);
      });

      it('should handle partial rehydration with only userId', () => {
        const rehydrateData = {
          userId: 'user123',
        };

        store.dispatch(rehydrateAuth(rehydrateData));

        const state = store.getState();
        expect(state.auth.user).toBe(null);
        expect(state.auth.token).toBe(null);
        expect(state.auth.userId).toBe('user123');
        expect(state.auth.roles).toEqual([]);
      });

      it('should handle partial rehydration with only roles', () => {
        const rehydrateData = {
          roles: ['admin', 'moderator'],
        };

        store.dispatch(rehydrateAuth(rehydrateData));

        const state = store.getState();
        expect(state.auth.user).toBe(null);
        expect(state.auth.token).toBe(null);
        expect(state.auth.userId).toBe(null);
        expect(state.auth.roles).toEqual(['admin', 'moderator']);
      });

      it('should handle non-array roles in rehydration', () => {
        const rehydrateData = {
          roles: 'invalid-roles' as any,
        };

        store.dispatch(rehydrateAuth(rehydrateData));

        const state = store.getState();
        expect(state.auth.roles).toEqual([]);
      });

      it('should handle empty rehydration data', () => {
        store.dispatch(rehydrateAuth({}));

        const state = store.getState();
        expect(state.auth.user).toBe(null);
        expect(state.auth.token).toBe(null);
        expect(state.auth.userId).toBe(null);
        expect(state.auth.roles).toEqual([]);
      });

      it('should match snapshot after rehydration', () => {
        const rehydrateData = {
          user: 'testuser@example.com',
          token: 'valid-token-123',
          userId: 'user123',
          roles: ['user', 'admin'],
        };

        store.dispatch(rehydrateAuth(rehydrateData));
        const state = store.getState();
        expect(state.auth).toMatchSnapshot();
      });
    });

    describe('State Transitions', () => {
      it('should handle login -> logout -> login cycle', () => {
        // First login
        const credentials1 = {
          user: 'user1@example.com',
          accessToken: 'token1',
          userId: 'user1',
          roles: ['user'],
        };
        store.dispatch(setCredentials(credentials1));

        let state = store.getState();
        expect(state.auth.user).toBe('user1@example.com');

        // Logout
        store.dispatch(setLogout());
        state = store.getState();
        expect(state.auth.user).toBe(null);

        // Second login
        const credentials2 = {
          user: 'user2@example.com',
          accessToken: 'token2',
          userId: 'user2',
          roles: ['admin'],
        };
        store.dispatch(setCredentials(credentials2));

        state = store.getState();
        expect(state.auth.user).toBe('user2@example.com');
        expect(state.auth.roles).toEqual(['admin']);
      });

      it('should handle multiple rehydrations', () => {
        // First rehydration
        store.dispatch(rehydrateAuth({ user: 'user1@example.com' }));
        let state = store.getState();
        expect(state.auth.user).toBe('user1@example.com');

        // Second rehydration
        store.dispatch(rehydrateAuth({ token: 'token1' }));
        state = store.getState();
        expect(state.auth.user).toBe('user1@example.com');
        expect(state.auth.token).toBe('token1');

        // Third rehydration
        store.dispatch(rehydrateAuth({ userId: 'user1', roles: ['admin'] }));
        state = store.getState();
        expect(state.auth.user).toBe('user1@example.com');
        expect(state.auth.token).toBe('token1');
        expect(state.auth.userId).toBe('user1');
        expect(state.auth.roles).toEqual(['admin']);
      });
    });
  });

  describe('Selectors', () => {
    let store: ReturnType<typeof createTestStore>;

    const createTestStore = () => {
      return configureStore({
        reducer: {
          auth: authReducer,
          api: apiSlice.reducer,
        },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(apiSlice.middleware),
      });
    };

    // Helper function to get state with proper typing
    //const getState = () => store.getState() as RootState;

    beforeEach(() => {
      store = createTestStore();
    });

    describe('selectCurrentUser', () => {
      it('should return current user', () => {
        const credentials = {
          user: 'testuser@example.com',
          accessToken: 'valid-token-123',
          userId: 'user123',
          roles: ['user'],
        };
        store.dispatch(setCredentials(credentials));

        const state = store.getState() as RootState;
        expect(selectCurrentUser(state)).toBe('testuser@example.com');
      });

      it('should return null when no user', () => {
        const state = store.getState() as RootState;
        expect(selectCurrentUser(state)).toBe(null);
      });
    });

    describe('selectCurrentUserId', () => {
      it('should return current user ID', () => {
        const credentials = {
          user: 'testuser@example.com',
          accessToken: 'valid-token-123',
          userId: 'user123',
          roles: ['user'],
        };
        store.dispatch(setCredentials(credentials));

        const state = store.getState() as RootState;
        
        expect(selectCurrentUserId(state)).toBe('user123');
      });

      it('should return null when no user ID', () => {
        const state = store.getState() as RootState;
        expect(selectCurrentUserId(state)).toBe(null);
      });
    });

    describe('selectCurrentToken', () => {
      it('should return current token', () => {
        const credentials = {
          user: 'testuser@example.com',
          accessToken: 'valid-token-123',
          userId: 'user123',
          roles: ['user'],
        };
        store.dispatch(setCredentials(credentials));

        const state = store.getState() as RootState;
        expect(selectCurrentToken(state)).toBe('valid-token-123');
      });

      it('should return null when no token', () => {
        const state = store.getState() as RootState;
        expect(selectCurrentToken(state)).toBe(null);
      });
    });

    describe('selectUserRoles', () => {
      it('should return user roles', () => {
        const credentials = {
          user: 'testuser@example.com',
          accessToken: 'valid-token-123',
          userId: 'user123',
          roles: ['user', 'admin'],
        };
        store.dispatch(setCredentials(credentials));

        const state = store.getState() as RootState;
        expect(selectUserRoles(state)).toEqual(['user', 'admin']);
      });

      it('should return empty array when no roles', () => {
        const state = store.getState() as RootState;
        expect(selectUserRoles(state)).toEqual([]);
      });
    });

    describe('selectIsAuthenticated', () => {
      it('should return true when token exists', () => {
        const credentials = {
          user: 'testuser@example.com',
          accessToken: 'valid-token-123',
          userId: 'user123',
          roles: ['user'],
        };
        store.dispatch(setCredentials(credentials));

        const state = store.getState() as RootState;
        expect(selectIsAuthenticated(state)).toBe(true);
      });

      it('should return false when no token', () => {
        const state = store.getState() as RootState;
        expect(selectIsAuthenticated(state)).toBe(false);
      });

      it('should return false when token is empty string', () => {
        const credentials = {
          user: 'testuser@example.com',
          accessToken: '',
          userId: 'user123',
          roles: ['user'],
        };
        store.dispatch(setCredentials(credentials));

        const state = store.getState() as RootState;
        expect(selectIsAuthenticated(state)).toBe(false);
      });
    });

    describe('Selector Snapshots', () => {
      it('should match snapshot for all selectors when authenticated', () => {
        const credentials = {
          user: 'testuser@example.com',
          accessToken: 'valid-token-123',
          userId: 'user123',
          roles: ['user', 'admin'],
        };
        store.dispatch(setCredentials(credentials));

        const state = store.getState() as RootState;
        const selectorResults = {
          currentUser: selectCurrentUser(state),
          currentUserId: selectCurrentUserId(state),
          currentToken: selectCurrentToken(state),
          userRoles: selectUserRoles(state),
          isAuthenticated: selectIsAuthenticated(state),
        };

        expect(selectorResults).toMatchSnapshot();
      });

      it('should match snapshot for all selectors when not authenticated', () => {
        const state = store.getState() as RootState;
        const selectorResults = {
          currentUser: selectCurrentUser(state),
          currentUserId: selectCurrentUserId(state),
          currentToken: selectCurrentToken(state),
          userRoles: selectUserRoles(state),
          isAuthenticated: selectIsAuthenticated(state),
        };

        expect(selectorResults).toMatchSnapshot();
      });
    });
  });

  describe('Auth API Slice', () => {
    it('should have authApiSlice defined', () => {
      expect(authApiSlice).toBeDefined();
    });

    it('should match snapshot for auth API slice', () => {
      expect(authApiSlice).toMatchSnapshot();
    });

    it('should have endpoints property', () => {
      expect(authApiSlice.endpoints).toBeDefined();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    let store: ReturnType<typeof createTestStore>;

    const createTestStore = () => {
      return configureStore({
        reducer: {
          auth: authReducer,
        },
      });
    };

    beforeEach(() => {
      store = createTestStore();
    });

    it('should handle very long user names', () => {
      const longUserName = 'a'.repeat(1000);
      const credentials = {
        user: longUserName,
        accessToken: 'valid-token-123',
        userId: 'user123',
        roles: ['user'],
      };

      store.dispatch(setCredentials(credentials));

      const state = store.getState();
      expect(state.auth.user).toBe(longUserName);
    });

    it('should handle very long tokens', () => {
      const longToken = 'a'.repeat(1000);
      const credentials = {
        user: 'testuser@example.com',
        accessToken: longToken,
        userId: 'user123',
        roles: ['user'],
      };

      store.dispatch(setCredentials(credentials));

      const state = store.getState();
      expect(state.auth.token).toBe(longToken);
    });

    it('should handle very long user IDs', () => {
      const longUserId = 'a'.repeat(1000);
      const credentials = {
        user: 'testuser@example.com',
        accessToken: 'valid-token-123',
        userId: longUserId,
        roles: ['user'],
      };

      store.dispatch(setCredentials(credentials));

      const state = store.getState();
      expect(state.auth.userId).toBe(longUserId);
    });

    it('should handle many roles', () => {
      const manyRoles = Array.from({ length: 100 }, (_, i) => `role${i}`);
      const credentials = {
        user: 'testuser@example.com',
        accessToken: 'valid-token-123',
        userId: 'user123',
        roles: manyRoles,
      };

      store.dispatch(setCredentials(credentials));

      const state = store.getState();
      expect(state.auth.roles).toEqual(manyRoles);
    });

    it('should handle special characters in user names', () => {
      const specialUserName = 'test+user@example.com';
      const credentials = {
        user: specialUserName,
        accessToken: 'valid-token-123',
        userId: 'user123',
        roles: ['user'],
      };

      store.dispatch(setCredentials(credentials));

      const state = store.getState();
      expect(state.auth.user).toBe(specialUserName);
    });

    it('should handle unicode characters', () => {
      const unicodeUserName = 'tëst@exämple.com';
      const credentials = {
        user: unicodeUserName,
        accessToken: 'valid-token-123',
        userId: 'user123',
        roles: ['user'],
      };

      store.dispatch(setCredentials(credentials));

      const state = store.getState();
      expect(state.auth.user).toBe(unicodeUserName);
    });
  });

  describe('Performance and Memory', () => {
    let store: ReturnType<typeof createTestStore>;

    const createTestStore = () => {
      return configureStore({
        reducer: {
          auth: authReducer,
        },
      });
    };

    beforeEach(() => {
      store = createTestStore();
    });

    it('should handle rapid state changes', () => {
      for (let i = 0; i < 100; i++) {
        const credentials = {
          user: `user${i}@example.com`,
          accessToken: `token${i}`,
          userId: `user${i}`,
          roles: [`role${i}`],
        };
        store.dispatch(setCredentials(credentials));
        store.dispatch(setLogout());
      }

      const state = store.getState();
      expect(state.auth.user).toBe(null);
      expect(state.auth.token).toBe(null);
      expect(state.auth.userId).toBe(null);
      expect(state.auth.roles).toEqual([]);
    });

    it('should handle rapid rehydrations', () => {
      for (let i = 0; i < 100; i++) {
        store.dispatch(rehydrateAuth({
          user: `user${i}@example.com`,
          token: `token${i}`,
          userId: `user${i}`,
          roles: [`role${i}`],
        }));
      }

      const state = store.getState();
      expect(state.auth.user).toBe('user99@example.com');
      expect(state.auth.token).toBe('token99');
      expect(state.auth.userId).toBe('user99');
      expect(state.auth.roles).toEqual(['role99']);
    });
  });
}); 