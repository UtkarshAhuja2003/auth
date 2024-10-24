"use client";

import React, { useState } from 'react';
import AuthForm from '@/components/Auth/AuthForm';
import Banner from '@/components/common/Banner';
import { validateEmail } from '@/utils/validation';
import { useForm } from '@/hooks/useForm';
import { useBanner } from '@/hooks/useBanner';
import { forgotPasswordRequest } from '@/api/user';

const ForgotPassword = () => {
  const { formState, handleChange, validateForm, resetForm } = useForm(
    { email: '' },
    (state) => [validateEmail(state.email)]
  );
  const [isLoading, setIsLoading] = useState(false);
  const { banner, showBanner, closeBanner } = useBanner();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const validationError = await validateForm();
    if(validationError) {
       showBanner('error', validationError);
       setIsLoading(false);
    }

    const response = await forgotPasswordRequest(formState);
    if (!response.success) {
      showBanner('error', response.message || 'An error occurred');
      setIsLoading(false);
      return;
    }
    showBanner('success', response.message);
    setIsLoading(false);
    resetForm();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {banner.isVisible && banner.type && <Banner message={banner.message} onClose={closeBanner} type={banner.type} />}
      <AuthForm
        title="Forgot Password"
        buttonLabel="Send Reset Link"
        secondaryAction={{ text: "Back to Login", link: "/user/login" }}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        fields={[{
          name: 'email',
          placeholder: 'Email',
          type: 'email',
          value: formState.email,
          onChange: handleChange,
        }]}
      />
    </div>
  );
};

export default ForgotPassword;
