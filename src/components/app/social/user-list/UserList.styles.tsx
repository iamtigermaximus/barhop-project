"use client";
import styled from "styled-components";

export const ListContainer = styled.div`
  margin-top: 2rem;
`;

export const ListHeader = styled.h3`
  color: #f8fafc;
  margin-bottom: 1rem;
  font-size: 1.25rem;
`;

export const UserGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

export const UserCard = styled.div`
  background: rgba(30, 41, 59, 0.8);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-1px);
  }
`;

export const UserInfo = styled.div`
  flex: 1;
`;

export const UserName = styled.h4`
  color: #f8fafc;
  margin: 0;
  font-size: 1.125rem;
`;

export const UserDetails = styled.p`
  color: #0ea5e9;
  margin: 0.25rem 0;
  font-size: 0.875rem;
`;

export const Interests = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

export const InterestTag = styled.span`
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
`;

export const HopInButton = styled.button`
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;
