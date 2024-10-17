"use client";

import React, { useState } from 'react';
import AuthForm from '@/components/Auth/AuthForm';
import Banner from '@/components/common/Banner';
import { validateEmail, validatePassword } from '@/utils/userValidation';
import { useForm } from '@/hooks/useForm';
import { useBanner } from '@/hooks/useBanner';

const Login = () => {
  const { formState, handleChange, resetForm } = useForm({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { banner, showBanner, closeBanner } = useBanner();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { email, password } = formState;

    const emailValidation = await validateEmail(email);
    if (!emailValidation.isValid) {
      showBanner('error', emailValidation.message || 'An error occurred');
      setIsLoading(false);
      return;
    }

    const passwordValidation = await validatePassword(password);
    if (!passwordValidation.isValid) {
      showBanner('error', passwordValidation.message || 'An error occurred');
      setIsLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    showBanner('success', 'Logged in successfully');
    setIsLoading(false);
    resetForm();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {banner.isVisible && banner.type && <Banner message={banner.message} onClose={closeBanner} type={banner.type} />}
      <AuthForm
        title="Login"
        buttonLabel="Login"
        secondaryAction={{ text: "Don't have an account? Register", link: "/user/register" }}
        onSubmit={handleSubmit}
        forgotPasswordAction={{ text: "Forgot password?", link: "/user/forgot-password" }}
        isLoading={isLoading}
        fields={[
          { name: 'email', placeholder: 'Email', type: 'email', value: formState.email, onChange: handleChange },
          { name: 'password', placeholder: 'Password', type: 'password', value: formState.password, onChange: handleChange },
        ]}
      />
    </div>
  );
};

export default Login;
