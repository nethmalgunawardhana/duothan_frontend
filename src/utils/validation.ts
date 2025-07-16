// src/utils/validation.ts

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateAdminCredentials = (email: string, password: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!email.includes('@')) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  if (!password.trim()) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 3) {
    return { isValid: false, error: 'Password must be at least 3 characters long' };
  }
  
  return { isValid: true };
};

export const validateChallengeData = (challengeData: any): ValidationResult => {
  if (!challengeData.title?.trim()) {
    return { isValid: false, error: 'Challenge title is required' };
  }
  
  if (!challengeData.description?.trim()) {
    return { isValid: false, error: 'Challenge description is required' };
  }
  
  if (!['algorithmic', 'buildathon'].includes(challengeData.type)) {
    return { isValid: false, error: 'Challenge type must be either algorithmic or buildathon' };
  }
  
  if (!['easy', 'medium', 'hard'].includes(challengeData.difficulty)) {
    return { isValid: false, error: 'Difficulty must be easy, medium, or hard' };
  }
  
  if (!challengeData.points || challengeData.points <= 0) {
    return { isValid: false, error: 'Points must be a positive number' };
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

export const validatePassword = (password: string): ValidationResult => {
  if (!password.trim()) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }
  
  return { isValid: true };
};

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value?.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true };
};