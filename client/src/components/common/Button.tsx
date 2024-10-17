import React from 'react';
import { ButtonProps } from '@/interfaces/common';

const Button: React.FC<ButtonProps> = ({ label, isLoading }) => {
  return (
    <button
      type="submit"
      className={`w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : label}
    </button>
  );
};

export default Button;
