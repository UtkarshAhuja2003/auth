"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Banner from "@/components/common/Banner";
import { useBanner } from "@/hooks/useBanner";
import { useEffect, Suspense } from "react";
import { verifyEmail } from "@/api/user";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailVerificationToken = searchParams.get('token');
  const { banner, showBanner, closeBanner } = useBanner();

  useEffect(() => {
    const emailVerify = async () => {
      if (emailVerificationToken) {
        const response = await verifyEmail(emailVerificationToken);
        if (!response.success) {
          showBanner('error', response.message);
          return;
        }
        showBanner('success', response.message);
        setTimeout(() => {
          router.replace('/user/profile');
        }, 2000);
      }
    };
    emailVerify();
  }, []);

  return (
    <div>
      {banner.isVisible && banner.type && <Banner message={banner.message} onClose={closeBanner} type={banner.type} />}
      <h1>Verifying Email...</h1>
    </div>
  );
}

const VerifyEmail = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <VerifyEmailContent />
  </Suspense>
);

export default VerifyEmail;
