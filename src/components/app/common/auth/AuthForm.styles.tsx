"use client";
import styled from "styled-components";

export const Page = styled.div`
  padding: 2rem 1rem 10rem;
  max-width: 500px;
  margin: 0 auto;
  background: linear-gradient(
    -45deg,
    rgb(9, 9, 11),
    rgb(24, 20, 31),
    rgb(9, 9, 11),
    rgb(21, 17, 23)
  );
  background-size: 400% 400%;
  animation: gradientShift 10s ease infinite;
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

export const AuthCard = styled.div`
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 3rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 12px 30px rgba(139, 92, 246, 0.15);
  }

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 8s ease infinite;
  text-align: center;
`;

export const Subtitle = styled.p`
  color: #e2e8f0;
  text-align: center;
  margin-bottom: 2rem;
`;

export const SuccessMessage = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #6ee7b7;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  color: #f8fafc;
  font-weight: 600;
  font-size: 0.875rem;
`;

export const Input = styled.input`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #f8fafc;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(139, 92, 246, 0.6);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const SubmitButton = styled.button<{ $loading: boolean }>`
  background: linear-gradient(45deg, #8b5cf6, #3b82f6, #0ea5e9);
  background-size: 400% 400%;
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${(props) =>
    props.$loading ? "none" : "gradientShift 4s ease infinite"};
  opacity: ${(props) => (props.$loading ? 0.7 : 1)};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const Divider = styled.div`
  text-align: center;
  color: #94a3b8;
  margin: 1.5rem 0;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(139, 92, 246, 0.2);
  }

  span {
    background: rgba(30, 41, 59, 0.9);
    padding: 0 1rem;
    position: relative;
  }
`;

export const SwitchText = styled.p`
  text-align: center;
  color: #e2e8f0;

  a {
    color: #8b5cf6;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
`;

export const GoogleButton = styled.button`
  background: transparent;
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #e2e8f0;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;

  &:hover:not(:disabled) {
    background: rgba(139, 92, 246, 0.1);
    border-color: rgba(139, 92, 246, 0.6);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
