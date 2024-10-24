"use client";
import React, { useState } from 'react';
import AuthForm from '@/components/Auth/AuthForm';
import Banner from '@/components/common/Banner';
import { validateEmail, validateName, validatePassword } from '@/utils/validation';
import { useForm } from '@/hooks/useForm';
import { useBanner } from '@/hooks/useBanner';
import { registerUser } from '@/api/user';

const Register = () => {
  const { formState, handleChange, validateForm, resetForm } = useForm(
    { name: '', email: '', password: '' },
    (state) => [validateName(state.name), validateEmail(state.email), validatePassword(state.password)]
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

    const response = await registerUser(formState);
    if (!response.success) {
      showBanner('error', response.message || 'An error occurred');
      setIsLoading(false);
      return;
    }

    showBanner('success', 'Registration successful! Please check your email to verify your account');
    setIsLoading(false);
    resetForm();

    setTimeout(() => {
      window.location.href = '/user/profile';
    }, 1000);
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
