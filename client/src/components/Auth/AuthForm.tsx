"use client";

import React from 'react';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';
import { AuthFormProps } from '@/interfaces/user';
import Link from 'next/link';

const AuthForm: React.FC<AuthFormProps> = ({ title, buttonLabel, secondaryAction, forgotPasswordAction, onSubmit, isLoading, fields }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">{title}</h2>
        <form className="space-y-4" onSubmit={onSubmit}>
          {fields.map((field, idx) => (
            <InputField key={idx} {...field} />
          ))}
          <div className="text-right">
            {forgotPasswordAction && (
              <Link href={forgotPasswordAction.link} passHref>
                <span className="text-blue-600 hover:underline text-sm font-semibold cursor-pointer">
                  {forgotPasswordAction.text}
                </span>
              </Link>
            )}
          </div>
          <Button label={buttonLabel} isLoading={isLoading} />
        </form>
        <div className="text-center mt-4">
          <Link href={secondaryAction.link} passHref>
            <span className="text-blue-500 hover:underline">
              {secondaryAction.text}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;