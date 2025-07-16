export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateTeamName = (teamName: string): ValidationResult => {
  if (!teamName.trim()) {
    return { isValid: false, error: 'Team name is required' };
  }
  
  if (teamName.length < 3) {
    return { isValid: false, error: 'Team name must be at least 3 characters' };
  }
  
  if (teamName.length > 50) {
    return { isValid: false, error: 'Team name must be less than 50 characters' };
  }
  
  if (!/^[a-zA-Z0-9\s_-]+$/.test(teamName)) {
    return { isValid: false, error: 'Team name can only contain letters, numbers, spaces, underscores, and hyphens' };
  }
  
  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

export const validateAdminCredentials = (email: string, password: string): ValidationResult => {
  if (!email.trim() || !password.trim()) {
    return { isValid: false, error: 'Email and password are required' };
  }
  
  return { isValid: true };
};