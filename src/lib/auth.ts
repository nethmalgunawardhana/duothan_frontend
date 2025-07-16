// src/lib/auth.ts
interface DecodedToken {
  id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

// Token management utility
export const tokenUtils = {
  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  // Set token in localStorage
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  // Remove token from localStorage
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!tokenUtils.getToken();
  },

  // Decode JWT token (without verification - for client-side use only)
  decodeToken: (token: string): DecodedToken | null => {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded) as DecodedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      const decoded = tokenUtils.decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true;
    }
  },

  // Get user info from token
  getUserFromToken: (token?: string): DecodedToken | null => {
    const tokenToUse = token || tokenUtils.getToken();
    if (!tokenToUse) return null;
    
    if (tokenUtils.isTokenExpired(tokenToUse)) {
      return null;
    }
    
    return tokenUtils.decodeToken(tokenToUse);
  }
};