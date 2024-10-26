import { useState } from 'react';

export const useForm = <T extends object>(
  initialState: T,
  validate: (state: T) => Promise<{ isValid: boolean, message: string }>[]
) => {
  const [formState, setFormState] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = async () => {
    const validations = await Promise.all(validate(formState));
    let validationError: string | undefined;
    validations.forEach(v => {
      if (!v.isValid) return validationError = v.message || "Invalid values";
    });

    return validationError;
  };

  const resetForm = () => setFormState(initialState);

  return { formState, handleChange, validateForm, resetForm };
};
