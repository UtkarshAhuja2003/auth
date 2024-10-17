import React from 'react';
import { InputFieldProps } from '@/interfaces/user';

const InputField: React.FC<InputFieldProps> = ({ name, placeholder, type, value, onChange }) => {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      required
    />
  );
};

export default InputField;
