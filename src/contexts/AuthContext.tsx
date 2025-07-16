'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiClient, TeamData } from '@/utils/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AuthState {
  isAuthenticated: boolean;
  team: TeamData | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: TeamData }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType extends AuthState {
  loginTeam: (email: string, authProvider: 'github' | 'google', providerData: Record<string, unknown>) => Promise<boolean>;
  registerTeam: (teamName: string, email: string, authProvider: 'github' | 'google', providerData: Record<string, unknown>) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  team: null,
  loading: false,
  error: null,
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
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: false, 
        team: null,
        error: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...initialState 
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [token, setToken, removeToken] = useLocalStorage<string | null>('oasis_token', null);
  const [savedTeam, setSavedTeam, removeSavedTeam] = useLocalStorage<TeamData | null>('oasis_team', null);

  // Initialize auth state from localStorage
  useEffect(() => {
    if (token && savedTeam) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: savedTeam });
    }
  }, [token, savedTeam]);

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
    } catch (error) {
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
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Network error occurred' });
      return false;
    }
  };

  const logout = async () => {
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