import React, { Suspense } from "react";
import VIPPayment from "@/components/app/vip-pass/vip-payment/VIPPayment";

const VIPPaymentPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VIPPayment />
    </Suspense>
  );
};

export default VIPPaymentPage;
