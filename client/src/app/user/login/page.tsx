"use client";

import React, { useState } from 'react';
import AuthForm from '@/components/Auth/AuthForm';
import Banner from '@/components/common/Banner';
import { validateEmail, validatePassword } from '@/utils/validation';
import { useForm } from '@/hooks/useForm';
import { useBanner } from '@/hooks/useBanner';
import { loginUser } from '@/api/user';
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const { formState, handleChange, validateForm, resetForm } = useForm(
    { email: '', password: '' },
    (state) => [validateEmail(state.email), validatePassword(state.password)]
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

    const response = await loginUser(formState);
    if (!response.success) {
      showBanner('error', response.message || 'An error occurred');
      setIsLoading(false);
      return;
    }
    showBanner('success', 'Logged in successfully');
    setIsLoading(false);
    resetForm();

    setTimeout(() => {
      router.replace('/user/profile');
    }, 1000);
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
