import React, { Suspense } from "react";
import VIPPaymentSuccess from "@/components/app/vip-pass/vip-payment-success/VIPPaymentSuccess";

const VIPPaymentSuccessPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VIPPaymentSuccess />
    </Suspense>
  );
};

export default VIPPaymentSuccessPage;
