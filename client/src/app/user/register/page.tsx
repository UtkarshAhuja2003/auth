"use client";

import React, { useState } from 'react';
import AuthForm from '@/components/Auth/AuthForm';
import Banner from '@/components/common/Banner';
import { validateEmail, validateName, validatePassword } from '@/utils/userValidation';
import { useForm } from '@/hooks/useForm';
import { useBanner } from '@/hooks/useBanner';

const Register = () => {
  const { formState, handleChange, resetForm } = useForm({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { banner, showBanner, closeBanner } = useBanner();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, email, password } = formState;

    const nameValidation = await validateName(name);
    const emailValidation = await validateEmail(email);
    const passwordValidation = await validatePassword(password);

    if (!nameValidation.isValid) {
      showBanner('error', nameValidation.message || 'Name is required.');
      setIsLoading(false);
      return;
    }
    if (!emailValidation.isValid) {
      showBanner('error', emailValidation.message || 'Email is required.');
      setIsLoading(false);
      return;
    }
    if (!passwordValidation.isValid) {
      showBanner('error', passwordValidation.message || 'Password is required.');
      setIsLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    showBanner('success', 'Registration successful! Please check your email to verify your account');
    setIsLoading(false);
    resetForm();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {banner.isVisible && banner.type && <Banner message={banner.message} onClose={closeBanner} type={banner.type} />}
      <AuthForm
        title="Register"
        buttonLabel="Register"
        secondaryAction={{ text: "Already have an account? Login", link: "/user/login" }}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        fields={[
          { name: 'name', placeholder: 'Name', type: 'text', value: formState.name, onChange: handleChange },
          { name: 'email', placeholder: 'Email', type: 'email', value: formState.email, onChange: handleChange },
          { name: 'password', placeholder: 'Password', type: 'password', value: formState.password, onChange: handleChange },
        ]}
      />
    </div>
  );
};

export default Register;
