// src/utils/validation.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  return { valid: true, message: '' };
};

export const validateName = (name: string): { valid: boolean; message: string } => {
  if (name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters long' };
  }
  return { valid: true, message: '' };
};