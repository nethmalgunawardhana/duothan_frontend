// src/contexts/AdminContext.tsx
'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiClient, AdminData } from '@/utils/api';

interface AdminState {
  isAuthenticated: boolean;
  admin: AdminData | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

type AdminAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AdminData }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'INITIALIZE_SUCCESS'; payload: AdminData }
  | { type: 'INITIALIZE_FAILURE' };

interface AdminContextType extends AdminState {
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const initialState: AdminState = {
  isAuthenticated: false,
  admin: null,
  loading: true,
  error: null,
  initialized: false,
};

const adminReducer = (state: AdminState, action: AdminAction): AdminState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        admin: action.payload,
        error: null,
        initialized: true,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        admin: null,
        error: action.payload,
        initialized: true,
      };
    case 'LOGOUT':
      return { ...initialState, initialized: true, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'INITIALIZE_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        admin: action.payload,
        loading: false,
        initialized: true,
        error: null,
      };
    case 'INITIALIZE_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        admin: null,
        loading: false,
        initialized: true,
        error: null,
      };
    default:
      return state;
  }
};

export const AdminContext = createContext<AdminContextType | null>(null);

export const useAdminAuth = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Initialize admin state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('oasis_admin_token');
        const savedAdmin = localStorage.getItem('oasis_admin');

        if (token && savedAdmin) {
          const adminData = JSON.parse(savedAdmin);
          
          // Verify the token is still valid by fetching the profile
          const response = await apiClient.getAdminProfile();
          
          if (response.success && response.data) {
            // Update stored admin data if needed
            localStorage.setItem('oasis_admin', JSON.stringify(response.data));
            dispatch({ type: 'INITIALIZE_SUCCESS', payload: response.data });
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('oasis_admin_token');
            localStorage.removeItem('oasis_admin');
            dispatch({ type: 'INITIALIZE_FAILURE' });
          }
        } else {
          dispatch({ type: 'INITIALIZE_FAILURE' });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear potentially invalid tokens
        localStorage.removeItem('oasis_admin_token');
        localStorage.removeItem('oasis_admin');
        dispatch({ type: 'INITIALIZE_FAILURE' });
      }
    };

    initializeAuth();
  }, []);

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await apiClient.loginAdmin({ email, password });

      if (response.success && response.data) {
        const { admin, token } = response.data;
        
        // Store authentication data
        localStorage.setItem('oasis_admin_token', token);
        localStorage.setItem('oasis_admin', JSON.stringify(admin));
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: admin });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: response.error || 'Login failed' });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Network error occurred';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Call logout API endpoint
      await apiClient.logoutAdmin();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('oasis_admin_token');
      localStorage.removeItem('oasis_admin');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AdminContext.Provider
      value={{
        ...state,
        loginAdmin,
        logout,
        clearError,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};