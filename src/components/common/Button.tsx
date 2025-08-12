'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import styled, { css } from 'styled-components';

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

const primaryStyles = css`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-color: ${({ theme }) => theme.colors.primary};
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary}cc;
    border-color: ${({ theme }) => theme.colors.primary}cc;
  }
`;

const secondaryStyles = css`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  border-color: ${({ theme }) => theme.colors.border};
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.surface};
  }
`;

const filterStyles = css<{ $active?: boolean }>`
  background-color: ${({ theme, $active }) => 
    $active ? theme.colors.filter.active : theme.colors.filter.inactive};
  color: ${({ theme, $active }) => 
    $active ? 'white' : theme.colors.text.primary};
  border-color: ${({ theme, $active }) => 
    $active ? theme.colors.filter.active : theme.colors.border};
  
  &:hover:not(:disabled) {
    background-color: ${({ theme, $active }) => 
      $active ? `${theme.colors.filter.active}cc` : theme.colors.surface};
  }
`;

const StyledButton = styled.button<{ 
  $variant: 'primary' | 'secondary' | 'filter';
  $size: 'sm' | 'md' | 'lg';
  $active?: boolean;
}>`
  ${baseButtonStyles}
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return primaryStyles;
      case 'secondary':
        return secondaryStyles;
      case 'filter':
        return filterStyles;
      default:
        return primaryStyles;
    }
  }}
  
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
  variant?: 'primary' | 'secondary' | 'filter';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  active = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $active={active}
      {...props}
    >
      {children}
    </StyledButton>
  );
}
