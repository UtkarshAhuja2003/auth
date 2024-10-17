"use client";

import React from 'react';
import { BannerProps } from '@/interfaces/common';

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

export default Banner;

