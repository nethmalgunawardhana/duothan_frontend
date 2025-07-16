'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiClient, AdminData } from '@/utils/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AdminState {
  isAuthenticated: boolean;
  admin: AdminData | null;
  loading: boolean;
  error: string | null;
}

type AdminAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AdminData }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

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
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: false, 
        admin: null,
        error: action.payload 
      };
    case 'LOGOUT':
      return { ...initialState };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
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
    }
  }, [adminToken, savedAdmin]);

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
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
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Network error occurred' });
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