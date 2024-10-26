"use client";

import React, {useState} from 'react';
import { BannerProps } from '@/interfaces/common';
import { resendVerificationEmail } from '@/api/user';

const Banner: React.FC<BannerProps> = ({ message, onClose, type }) => {
  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const borderColor = type === 'success' ? 'border-green-500' : 'border-red-500';
  const textColor = type === 'success' ? 'text-green-700' : 'text-red-700';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`${bgColor} ${borderColor} rounded-lg shadow-lg p-6 w-80 text-center border`} role="alert">
        <p className={`font-bold mb-2 ${textColor}`}>{type === 'success' ? 'Success' : 'Error'}</p>
        <p>{message}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export const EmailVerificationBanner = ({ isEmailVerified }: { isEmailVerified: boolean }) => {
  const [loading, setLoading] = useState(false);

  const resendEmailVerification = async () => {
    setLoading(true);
    const response = await resendVerificationEmail();
    alert(response.message);
    setLoading(false);
  };

  return (
    <>
      {!isEmailVerified && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 flex justify-between items-center">
          <span>
            Your email is not verified. Please verify your email to access all
            features.
          </span>
          <button
            onClick={()=> {resendEmailVerification()}}
            className="text-blue-500 hover:underline"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </div>
      )}
    </>
  );
};



export default Banner;

