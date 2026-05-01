// src/components/CityChip.tsx

"use client";

import styled from "styled-components";

const Chip = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.dm}; /* Changed from body to dm */
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primaryAccent : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryAccent : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? "#fff" : theme.colors.textSecondary};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

interface CityChipProps {
  city: string;
  active?: boolean;
  onClick?: () => void;
}

export default function CityChip({ city, active, onClick }: CityChipProps) {
  return (
    <Chip $active={active} onClick={onClick}>
      {city}
    </Chip>
  );
}
