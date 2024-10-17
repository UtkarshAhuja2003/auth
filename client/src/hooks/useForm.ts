import { useState } from 'react';

export const useForm = (initialState: { [key: string]: string }) => {
  const [formState, setFormState] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => setFormState(initialState);

  return { formState, handleChange, resetForm };
};
