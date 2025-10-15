export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
  phoneNumber?: string;
}

export interface SignupResponse {
  message: string;
  user?: {
    id: string;
    email: string;
    name?: string | null;
    phoneNumber?: string | null;
    createdAt: Date;
  };
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  error?: string;
}
