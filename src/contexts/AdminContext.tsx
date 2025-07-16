'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiClient, AdminData } from '@/utils/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AdminState {
  isAuthenticated: boolean;
  admin: AdminData | null;
  loading: boolean;
  error: string | null;
  initialized: boolean; // Add this to track if context is initialized
}

type AdminAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AdminData }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'INITIALIZE' };

interface AdminContextType extends AdminState {
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const initialState: AdminState = {
  isAuthenticated: false,
  admin: null,
  loading: false,
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
        initialized: true
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: false, 
        admin: null,
        error: action.payload,
        initialized: true
      };
    case 'LOGOUT':
      return { ...initialState, initialized: true };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'INITIALIZE':
      return { ...state, initialized: true };
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
  const [adminToken, setAdminToken, removeAdminToken] = useLocalStorage<string | null>('oasis_admin_token', null);
  const [savedAdmin, setSavedAdmin, removeSavedAdmin] = useLocalStorage<AdminData | null>('oasis_admin', null);

  // Initialize admin state from localStorage
  useEffect(() => {
    if (adminToken && savedAdmin) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: savedAdmin });
    } else {
      dispatch({ type: 'INITIALIZE' });
    }
  }, [adminToken, savedAdmin]);

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Real API login
      const response = await apiClient.loginAdmin({ email, password });
      
      if (response.success && response.data) {
        const { admin, token } = response.data;
        setAdminToken(token);
        setSavedAdmin(admin);
        dispatch({ type: 'LOGIN_SUCCESS', payload: admin });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: response.error || 'Admin login failed' });
        return false;
      }
    } catch (error: unknown) {
      let errorMessage = 'Network error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'response' in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        errorMessage = response?.data?.message || 'Network error occurred';
      }
      
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logoutAdmin();
    } catch (error) {
      console.warn('Admin logout API call failed:', error);
    } finally {
      removeAdminToken();
      removeSavedAdmin();
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