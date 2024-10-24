export const validateName = async (name: string | undefined): Promise<{ isValid: boolean; message: string }> => {
    if (!name) {
      return { isValid: false, message: 'Name is required' };
    }
    if (name.length < 2 || name.length > 200) {
      return { isValid: false, message: 'Name should be between 2 and 200 characters' };
    }
    return { isValid: true, message: "Valid name" };
};
  
export const validateEmail = async (email: string | undefined): Promise<{ isValid: boolean; message: string }> => {
    const re = /\S+@\S+\.\S+/;
    if (!email) {
      return { isValid: false, message: 'Email is required' };
    }
    if (!re.test(email)) {
      return { isValid: false, message: 'Invalid email address' };
    }
    return { isValid: true, message: "Valid Email" };
};
  
export const validatePassword = async (password: string | undefined): Promise<{ isValid: boolean; message: string }> => {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain one lowercase, uppercase, number, and special character',
      };
    }
    return { isValid: true, message: "Valid Password" };
};
  