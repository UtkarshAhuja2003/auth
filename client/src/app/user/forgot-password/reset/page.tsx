"use client";

import React, { useState, Suspense } from 'react';
import AuthForm from '@/components/Auth/AuthForm';
import Banner from '@/components/common/Banner';
import { validatePassword } from '@/utils/validation';
import { useForm } from '@/hooks/useForm';
import { useBanner } from '@/hooks/useBanner';
import { useSearchParams } from 'next/navigation';
import { resetForgottenPassword } from '@/api/user';
import { useRouter } from "next/navigation";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const URLToken = searchParams.get('token');
  const router = useRouter();
  const { formState, handleChange, validateForm, resetForm } = useForm(
    { newPassword: '', forgotPasswordToken: URLToken || '' },
    (state) => [validatePassword(state.newPassword)]
  );
  const [isLoading, setIsLoading] = useState(false);
  const { banner, showBanner, closeBanner } = useBanner();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const validationError = await validateForm();
    if (validationError) {
      showBanner('error', validationError);
      setIsLoading(false);
    }

    const response = await resetForgottenPassword(formState);
    if (!response.success) {
      showBanner('error', response.message || 'An error occurred');
      setIsLoading(false);
      return;
    }
    showBanner('success', response.message);
    setIsLoading(false);
    resetForm();

    setTimeout(() => {
      router.replace("/user/login");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {banner.isVisible && banner.type && (
        <Banner message={banner.message} onClose={closeBanner} type={banner.type} />
      )}
      <AuthForm
        title="Reset Password"
        buttonLabel="Reset Password"
        secondaryAction={{ text: "Login", link: "/user/login" }}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        fields={[{
          name: 'newPassword',
          placeholder: 'New Password',
          type: 'password',
          value: formState.newPassword,
          onChange: handleChange,
        }]}
      />
    </div>
  );
}

const ForgotPassword = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ForgotPasswordContent />
  </Suspense>
);

export default ForgotPassword;
