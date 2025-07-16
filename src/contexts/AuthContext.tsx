'use client';

import React, { createContext, useReducer, useEffect } from 'react';
import { apiClient, TeamData } from '@/utils/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AuthState {
  isAuthenticated: boolean;
  team: TeamData | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: TeamData }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'INITIALIZE_SUCCESS'; payload: TeamData }
  | { type: 'INITIALIZE_FAILURE' };

interface AuthContextType extends AuthState {
  loginTeam: (email: string, authProvider: 'github' | 'google', providerData: Record<string, unknown>) => Promise<boolean>;
  registerTeam: (teamName: string, email: string, authProvider: 'github' | 'google', providerData: Record<string, unknown>) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  team: null,
  loading: true,
  error: null,
  initialized: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: true, 
        team: action.payload,
        error: null,
        initialized: true
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: false, 
        team: null,
        error: action.payload,
        initialized: true
      };
    case 'LOGOUT':
      return { 
        ...initialState,
        initialized: true,
        loading: false
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'INITIALIZE_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        team: action.payload,
        loading: false,
        initialized: true,
        error: null,
      };
    case 'INITIALIZE_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        team: null,
        loading: false,
        initialized: true,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [token, setToken, removeToken] = useLocalStorage<string | null>('oasis_token', null);
  const [savedTeam, setSavedTeam, removeSavedTeam] = useLocalStorage<TeamData | null>('oasis_team', null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (token && savedTeam) {
          // Verify the token is still valid by fetching the profile
          const response = await apiClient.getTeamProfile();
          
          if (response.success && response.data) {
            // Update stored team data if needed
            setSavedTeam(response.data);
            dispatch({ type: 'INITIALIZE_SUCCESS', payload: response.data });
          } else {
            // Token is invalid, clear storage
            removeToken();
            removeSavedTeam();
            dispatch({ type: 'INITIALIZE_FAILURE' });
          }
        } else {
          dispatch({ type: 'INITIALIZE_FAILURE' });
        }
      } catch (error) {
        console.error('Team auth initialization error:', error);
        // Clear potentially invalid tokens
        removeToken();
        removeSavedTeam();
        dispatch({ type: 'INITIALIZE_FAILURE' });
      }
    };

    // Only run if not already initialized
    if (!state.initialized) {
      initializeAuth();
    }
  }, [token, savedTeam, setSavedTeam, removeToken, removeSavedTeam, state.initialized]);

  const loginTeam = async (
    email: string, 
    authProvider: 'github' | 'google', 
    providerData: Record<string, unknown>
  ): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await apiClient.loginTeam({
        email,
        authProvider,
        providerData,
      });
      
      if (response.success && response.data) {
        const { team, token: authToken } = response.data;
        setToken(authToken);
        setSavedTeam(team);
        dispatch({ type: 'LOGIN_SUCCESS', payload: team });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: response.error || 'Login failed' });
        return false;
      }
    } catch {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Network error occurred' });
      return false;
    }
  };

  const registerTeam = async (
    teamName: string,
    email: string,
    authProvider: 'github' | 'google',
    providerData: Record<string, unknown>
  ): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await apiClient.registerTeam({
        teamName,
        email,
        authProvider,
        providerData,
      });
      
      if (response.success && response.data) {
        const { team, token: authToken } = response.data;
        setToken(authToken);
        setSavedTeam(team);
        dispatch({ type: 'LOGIN_SUCCESS', payload: team });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: response.error || 'Registration failed' });
        return false;
      }
    } catch {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Network error occurred' });
      return false;
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await apiClient.logoutTeam();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      removeToken();
      removeSavedTeam();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginTeam,
        registerTeam,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};