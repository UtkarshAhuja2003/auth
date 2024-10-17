import { User } from '@/interfaces/user';
import { useState } from 'react';

export const useForm = (initialState: User) => {
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
