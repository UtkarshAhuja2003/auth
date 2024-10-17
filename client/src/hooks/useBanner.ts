import { useState } from 'react';

type BannerType = 'success' | 'error' | null;

interface BannerState {
  isVisible: boolean;
  type: BannerType;
  message: string;
}

export const useBanner = () => {
  const [banner, setBanner] = useState<BannerState>({
    isVisible: false,
    type: null,
    message: '',
  });

  const showBanner = (type: BannerType, message: string) => {
    setBanner({ isVisible: true, type, message });
  };

  const closeBanner = () => {
    setBanner({ ...banner, isVisible: false });
  };

  return { banner, showBanner, closeBanner };
};
