import React, { Suspense } from "react";
import VIPPaymentError from "@/components/app/vip-pass/vip-payment-error/VIPPaymentError";

const VIPPaymentErrorPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VIPPaymentError />
    </Suspense>
  );
};

export default VIPPaymentErrorPage;
