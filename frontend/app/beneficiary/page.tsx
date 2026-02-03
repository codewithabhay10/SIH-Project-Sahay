"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BeneficiaryPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to register page by default
    router.replace("/beneficiary/register");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
