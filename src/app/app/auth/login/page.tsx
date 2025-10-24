// import LoginForm from "@/components/auth/login-form/LoginForm";
// import React from "react";

// const LoginPage = () => {
//   return (
//     <div>
//       <LoginForm />
//     </div>
//   );
// };

// export default LoginPage;
// src/app/auth/login/page.tsx
// src/app/auth/login/page.tsx
import LoginForm from "@/components/app/common/auth/login-form/LoginForm";
import React from "react";

interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const resolvedSearchParams = await searchParams;

  return <LoginForm searchParams={resolvedSearchParams} />;
};

export default LoginPage;
