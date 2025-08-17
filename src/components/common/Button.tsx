'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import styled, { css } from 'styled-components';

// 기본 버튼 스타일
const baseButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fonts.size.sm};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

// active 상태에 따라 색상 변경
const buttonStyles = css<{ $active?: boolean }>`
  background-color: ${({ $active, theme }) => 
    $active ? theme.colors.primary : theme.colors.background};
  color: ${({ $active, theme }) => 
    $active ? '#ffffff' : theme.colors.text.primary};
  border-color: ${({ $active, theme }) => 
    $active ? theme.colors.primary : theme.colors.border};
  
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    ${({ $active, theme }) => !$active && `
      background-color: ${theme.colors.surface};
    `}
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

// 단순화된 버튼 컴포넌트 - active 상태와 size만 관리
const StyledButton = styled.button<{ 
  $size: 'sm' | 'md' | 'lg';
  $active?: boolean;
}>`
  ${baseButtonStyles}
  ${buttonStyles}
  
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
          font-size: ${({ theme }) => theme.fonts.size.xs};
        `;
      case 'lg':
        return css`
          padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
          font-size: ${({ theme }) => theme.fonts.size.base};
        `;
      case 'md':
      default:
        return css`
          padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
          font-size: ${({ theme }) => theme.fonts.size.sm};
        `;
    }
  }}
`;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  children: ReactNode;
}

export default function Button({
  size = 'md',
  active = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      $size={size}
      $active={active}
      {...props}
    >
      {children}
    </StyledButton>
  );
}
